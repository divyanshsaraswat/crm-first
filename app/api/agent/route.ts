// pages/api/agent/route.ts

import { NextRequest } from "next/server";

// All interfaces remain the same...
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
  name?: string; // Accessible name from label
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

// MODIFIED: Chat history is now commented out to disable it.
// const chatHistory: { role: "user" | "assistant"; content: string }[] = [];

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
1.  Analyze the user's request and the page context.
2.  Formulate a step-by-step plan in a "THINKING" block.
3.  If you can confidently identify the target element, generate the necessary "OPERATION" command. The JSON inside the operation MUST contain all required fields.
4.  If the context is ambiguous or the target element is missing a clear identifier, you MUST respond that you cannot perform the action.

**ABSOLUTE RULES:**
- For 'click' operations, the JSON **MUST** include a "role" and a "name".
- For 'type' operations, the JSON **MUST** include a "role", a "value", and either a "name" or a "placeholder".

GOOD EXAMPLE (Clicking a button):
THINKING:
1. The user wants to click the "Columns" button.
2. I see an element in the context: "button: "Columns"".
3. I will use the role 'button' and the name 'Columns'.
END_THINKING
I will click the "Columns" button for you.
OPERATION:{"type":"click","role":"button","name":"Columns"}

GOOD EXAMPLE (Typing in an input):
THINKING:
1. The user wants to type "laptops" in the search bar.
2. I see an element: "input (Placeholder: "Search for products...")".
3. I will use the role 'textbox' and the placeholder "Search for products...".
END_THINKING
I will search for "laptops" for you.
OPERATION:{"type":"type","role":"textbox","placeholder":"Search for products...","value":"laptops"}

BAD EXAMPLE (Ambiguous Target):
THINKING:
1. The user wants to click "the icon".
2. The context has multiple icon buttons with no clear name. I cannot proceed.
END_THINKING
I see several icons, could you be more specific about which one to click?

USER REQUEST: ${userPrompt}

Now, generate your response.`;
  return systemPrompt;
}

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
  
  // MODIFIED: This line is commented out to disable history.
  // chatHistory.push({ role: "user", content: enhancedPrompt });

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
        // MODIFIED: The 'messages' payload now only sends the current prompt.
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
              const cleanResponse = fullResponse.replace(/OPERATION:.*$/gm, '').trim();
              
              // MODIFIED: This line is commented out to disable history.
              // chatHistory.push({ role: "assistant", content: cleanResponse });
              
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
        const cleanResponse = fullResponse.replace(/OPERATION:.*$/gm, '').trim();
        
        // MODIFIED: This line is commented out to disable history.
        // chatHistory.push({ role: "assistant", content: cleanResponse });
        
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