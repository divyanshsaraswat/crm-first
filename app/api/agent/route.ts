// pages/api/agent/route.ts

import { NextRequest } from "next/server";

// --- INTERFACES ---
interface DOMOperation {
  type: 'click' | 'type' | 'scroll' | 'wait' | 'navigate' | 'select' | 'fill_form';
  role?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  selector?: string;
  method?: 'position' | 'content';
  position?: 'first' | 'last';
  count?: number;
}
interface ElementInfo {
  tagName: string;
  text?: string;
  placeholder?: string;
  name?: string;
  selector: string;
}
interface PageState {
  url: string;
  title: string;
  elements: ElementInfo[];
  viewport: { width: number; height: number };
  scrollPosition: { x: number; y: number };
}
interface AgentRequest {
  prompt: string;
  pageState?: PageState;
  capabilities?: any;
}

// --- PROMPT CREATION ---
function createWebAgentPrompt(userPrompt: string, pageState?: PageState): string {
  if (!pageState) {
    return userPrompt;
  }

  const interactiveElements = pageState.elements
    .slice(0, 30)
    .map(el => {
      let description = `${el.tagName}`;
      if (el.name) description += ` (Name: "${el.name}")`;
      if (el.placeholder) description += ` (Placeholder: "${el.placeholder}")`;
      if (el.text) description += `: "${el.text}"`;
      return `- ${description}`;
    }).join('\n');

  // MODIFIED: Enhanced prompt to be explicit about using labels vs. placeholders.
  const systemPrompt = `You are a precise web automation agent.

CURRENT PAGE CONTEXT:
- URL: ${pageState.url}
- Title: ${pageState.title}
- Interactive Elements (first 30):
${interactiveElements}

YOUR TASK:
1.  Analyze the user's request and the current page context.
2.  Formulate a concise, step-by-step plan in a "THINKING" block to accomplish the user's goal.
3.  For each step, generate a corresponding "OPERATION" command.

**AVAILABLE OPERATIONS & RULES:**
- \`click\`: Clicks an element. Requires "role" and "name".
- \`type\`: Types into an input field. Requires "role", "value", and an identifier.
    - **Use \`"name": "Label Text"\`** when the input has a visible label (e.g., "Username", "Email"). This is the **preferred and most reliable method**.
    - **Use \`"placeholder": "Placeholder Text"\`** only as a fallback if the input has NO visible label but has gray placeholder text inside it.
- \`select\`: Selects a table row via its checkbox.
    - By Position: \`{"method":"position", "position":"first"|"last", "count":number}\`
    - By Content: \`{"method":"content", "value":"text to find"}\`
- \`Maps\`: Navigates to a new URL. Requires "value".
- \`wait\`: Pauses execution. Requires "value" (milliseconds).
- **CRITICAL RULE**: Do not create redundant steps.

**GOOD EXAMPLE (Form Filling):**
USER REQUEST: Add a user with username "test-user", email "test@example.com", password "password123", and role "Admin".
AGENT RESPONSE:
THINKING:
1. The user wants to fill a form. I see fields for Username, Email, Password, and Role.
2. I will type "test-user" into the input with the label "Username".
3. I will type "test@example.com" into the input with the label "Email".
4. I will type "password123" into the input with the label "Password".
5. For the "Role" dropdown, I will first click it to open the options, then click the "Admin" option.
6. Finally, I will click the "Save User" button to submit the form.
END_THINKING
I am creating the new user now.
OPERATION:{"type":"type","role":"textbox","name":"Username","value":"test-user"}
OPERATION:{"type":"type","role":"textbox","name":"Email","value":"test@example.com"}
OPERATION:{"type":"type","role":"textbox","name":"Password","value":"password123"}
OPERATION:{"type":"click","role":"button","name":"Select role"}
OPERATION:{"type":"click","role":"option","name":"Admin"}
OPERATION:{"type":"click","role":"button","name":"Save User"}

USER REQUEST: ${userPrompt}

Now, generate your response.`;
  return systemPrompt;
}

// --- OPERATION EXTRACTION ---
function extractOperationsFromResponse(response: string): DOMOperation[] {
  const operations: DOMOperation[] = [];
  const lines = response.split('\n');
  
  for (const line of lines) {
    if (line.trim().startsWith('OPERATION:')) {
      try {
        const operationData = line.substring(line.indexOf(':') + 1).trim();
        const operation = JSON.parse(operationData);
        operations.push(operation);
      } catch (error) {
        console.error('Failed to parse operation:', line, error);
      }
    }
  }
  
  return operations;
}

// --- API ROUTE HANDLER ---
export async function POST(req: NextRequest) {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return new Response("Groq API key not found", { status: 500 });
  }

  const body: AgentRequest = await req.json();
  const { prompt, pageState } = body;
  
  if (!prompt || typeof prompt !== "string") {
    return new Response("Invalid prompt", { status: 400 });
  }

  const enhancedPrompt = createWebAgentPrompt(prompt, pageState);

  const groqResponse = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: enhancedPrompt }],
        temperature: 0.1,
        stream: true,
        max_tokens: 6000,
      }),
    }
  );

  if (!groqResponse.ok || !groqResponse.body) {
    const errorBody = await groqResponse.text();
    console.error("Groq API stream error:", errorBody);
    return new Response("Groq API error", { status: 500 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      const reader = groqResponse.body!.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk
            .split("\n")
            .filter(line => line.trim().startsWith("data: "));

          for (const line of lines) {
            const data = line.replace(/^data:\s*/, "");
            
            if (data === "[DONE]") {
              const operations = extractOperationsFromResponse(fullResponse);
              for (const operation of operations) {
                controller.enqueue(encoder.encode(`\nOPERATION:${JSON.stringify(operation)}\n`));
              }
              controller.close();
              return;
            }
            
            if (!data) {
                continue;
            }

            try {
              const json = JSON.parse(data);
              const token = json.choices?.[0]?.delta?.content;
              if (token) {
                fullResponse += token;
                if (!token.includes('OPERATION:')) {
                  controller.enqueue(encoder.encode(token));
                }
              }
            } catch (err) {
              console.error("Parse error on data chunk:", data, err);
            }
          }
        }
        
        const operations = extractOperationsFromResponse(fullResponse);
        for (const operation of operations) {
            controller.enqueue(encoder.encode(`\nOPERATION:${JSON.stringify(operation)}\n`));
        }
        controller.close();
      } catch (err) {
        console.error("Stream error:", err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}