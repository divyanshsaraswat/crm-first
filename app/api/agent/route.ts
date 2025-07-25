// pages/api/agent/route.ts

import { NextRequest } from "next/server";

// --- INTERFACES ---
interface DOMOperation {
  type: 'click' | 'type' | 'scroll' | 'wait' | 'navigate';
  role?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  selector?: string;
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

  const systemPrompt = `You are a precise web automation agent.

CURRENT PAGE CONTEXT:
- URL: ${pageState.url}
- Title: ${pageState.title}
- Interactive Elements:
${interactiveElements}

YOUR TASK:
1.  Analyze the user's request and the current page context.
2.  Formulate a concise, step-by-step plan in a "THINKING" block to accomplish the user's goal.
3.  For each step in your plan, generate a corresponding "OPERATION" command.
4.  If the context is ambiguous or you cannot complete the task, you MUST respond with a clarifying question without generating any operations.

**ABSOLUTE RULES:**
- Each operation must be on a new line, prefixed with "OPERATION:".
- For 'click' operations, the JSON MUST include a "role" and a "name".
- For 'type' operations, the JSON MUST include a "role", a "value", and either a "name" or a "placeholder".
- After a 'click' that likely navigates, subsequent steps must be based on general assumptions (e.g., a search bar on a "Users" page will likely contain "search users", not "search accounts").
- **CRITICAL RULE: Review your own plan for redundancy. Once you have navigated to a page or achieved a step's goal, DO NOT generate the same operation again. The plan must not contain loops.**

GOOD EXAMPLE (Multi-step login):
USER REQUEST: Log me in with the email "user@example.com" and password "password123".
AGENT RESPONSE:
THINKING:
1. The user wants to log in. This requires three steps.
2. Step 1: Type the email into the email input field. I see an element: 'input (Name: "Email")'.
3. Step 2: Type the password into the password input field. I see an element: 'input (Name: "Password")'.
4. Step 3: Click the "Sign In" button to submit the form.
END_THINKING
I will log you in now.
OPERATION:{"type":"type","role":"textbox","name":"Email","value":"user@example.com"}
OPERATION:{"type":"type","role":"textbox","name":"Password","value":"password123"}
OPERATION:{"type":"click","role":"button","name":"Sign In"}

BAD EXAMPLE (Redundant Plan):
USER REQUEST: Go to users and search for "John".
AGENT RESPONSE:
THINKING:
1. The user wants to go to the users page. I will click the "Users" button.
2. The user wants to search. I will type "John" in the search bar.
3. I need to go to the users page. I will click the "Users" button. (This is a redundant error).
END_THINKING
... (The AI should correct this plan before outputting operations)

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