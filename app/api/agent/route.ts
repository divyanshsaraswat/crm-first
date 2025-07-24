import { NextRequest } from "next/server";

interface DOMOperation {
  type: 'click' | 'type' | 'scroll' | 'wait' | 'extract' | 'navigate';
  selector?: string;
  value?: string | number;
  coordinates?: { x: number; y: number };
  options?: any;
}

interface ElementInfo {
  tagName: string;
  id?: string;
  className?: string;
  text?: string;
  selector: string;
  bounds: { x: number; y: number; width: number; height: number };
  isVisible: boolean;
  isInteractive: boolean;
  attributes: Record<string, string>;
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
  capabilities?: {
    canClick: boolean;
    canType: boolean;
    canScroll: boolean;
    canExtract: boolean;
    canNavigate: boolean;
    canWait: boolean;
  };
}

const chatHistory: { role: "user" | "assistant"; content: string }[] = [];

function createWebAgentPrompt(userPrompt: string, pageState?: PageState): string {
  if (!pageState) {
    return userPrompt;
  }

  const interactiveElements = pageState.elements
    .filter(el => el.isInteractive)
    .slice(0, 15) // Limit to prevent context overflow
    .map(el => ({
      tag: el.tagName,
      text: el.text?.substring(0, 50) || '',
      selector: el.selector,
      id: el.id,
      className: el.className?.split(' ').slice(0, 2).join('.') || ''
    }));

  const systemPrompt = `You are a web automation agent that can interact with web pages. You have access to the current page state and can perform DOM operations.

CURRENT PAGE:
- URL: ${pageState.url}
- Title: ${pageState.title}
- Viewport: ${pageState.viewport.width}x${pageState.viewport.height}
- Interactive Elements: ${interactiveElements.length}

KEY INTERACTIVE ELEMENTS:
${interactiveElements.map(el => 
  `- ${el.tag}: "${el.text}" (selector: ${el.selector}${el.id ? `, id: ${el.id}` : ''}${el.className ? `, class: ${el.className}` : ''})`
).join('\n')}

AVAILABLE OPERATIONS:
You can respond with DOM operations by including them in your response using this EXACT format:
OPERATION:{"type":"click","selector":"#button-id"}
OPERATION:{"type":"type","selector":"input[name='email']","value":"text to type"}
OPERATION:{"type":"scroll","coordinates":{"x":0,"y":500}}
OPERATION:{"type":"wait","value":1000}
OPERATION:{"type":"extract","selector":"a"}
OPERATION:{"type":"navigate","value":"https://example.com"}

IMPORTANT RULES:
1. Only use selectors that exist in the current page elements
2. Be specific and accurate with selectors
3. Explain what you're doing before providing operations
4. If you can't find the right element, ask for clarification
5. Operations should be on separate lines starting with "OPERATION:"

USER REQUEST: ${userPrompt}

Analyze the page and provide helpful assistance with DOM operations when needed.`;

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
  const { prompt, pageState, capabilities } = body;
  
  if (!prompt || typeof prompt !== "string") {
    return new Response("Invalid prompt", { status: 400 });
  }

  // Create enhanced prompt with page context
  const enhancedPrompt = createWebAgentPrompt(prompt, pageState);
  
  // Add user message to history
  chatHistory.push({ role: "user", content: enhancedPrompt });

  const groqResponse = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: chatHistory,
        temperature: 0.3, // Lower temperature for more consistent operation parsing
        stream: true,
        max_tokens: 1000,
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
              // Process final response to extract operations
              const operations = extractOperationsFromResponse(fullResponse);
              
              // Send operations as separate chunks
              for (const operation of operations) {
                controller.enqueue(encoder.encode(`\nOPERATION:${JSON.stringify(operation)}\n`));
              }
              
              // Add assistant response to history (without OPERATION lines)
              const cleanResponse = fullResponse.replace(/OPERATION:.*$/gm, '').trim();
              chatHistory.push({ role: "assistant", content: cleanResponse });
              
              controller.close();
              return;
            }

            try {
              const json = JSON.parse(data);
              const token = json.choices?.[0]?.delta?.content;
              if (token) {
                fullResponse += token;
                // Don't stream OPERATION lines to the UI - they'll be processed separately
                if (!token.includes('OPERATION:')) {
                  controller.enqueue(encoder.encode(token));
                }
              }
            } catch (err) {
              console.error("Parse error:", err);
            }
          }
        }

        // Fallback in case [DONE] wasn't received
        const operations = extractOperationsFromResponse(fullResponse);
        for (const operation of operations) {
          controller.enqueue(encoder.encode(`\nOPERATION:${JSON.stringify(operation)}\n`));
        }
        
        const cleanResponse = fullResponse.replace(/OPERATION:.*$/gm, '').trim();
        chatHistory.push({ role: "assistant", content: cleanResponse });
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