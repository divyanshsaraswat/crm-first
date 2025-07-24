'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { BubblesIcon, LucideMessageCircle, MessageCircleDashed } from 'lucide-react';

// Define the structure for a message
interface Message {
  id: number;
  sender: 'user' | 'bot' | 'system';
  text: string;
  operations?: DOMOperation[];
}

// Define DOM operation types
interface DOMOperation {
  type: 'click' | 'type' | 'scroll' | 'wait' | 'extract' | 'navigate';
  selector?: string;
  value?: string | number;
  coordinates?: { x: number; y: number };
  options?: any;
}

// Page state interface
interface PageState {
  url: string;
  title: string;
  elements: ElementInfo[];
  viewport: { width: number; height: number };
  scrollPosition: { x: number; y: number };
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

function WebAgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageState, setPageState] = useState<PageState | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const capturePageState = (): PageState => {
    const elements: ElementInfo[] = [];
    const interactiveSelector = 'a, button, input, select, textarea, form, [onclick], [role="button"], [href]';
    const allElements = document.querySelectorAll(interactiveSelector);
    
    allElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0 && 
        window.getComputedStyle(el).visibility !== 'hidden' &&
        window.getComputedStyle(el).display !== 'none';
      
      if (!isVisible) return;
      
      const selector = generateSelector(el);
      const attributes: Record<string, string> = {};
      
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        attributes[attr.name] = attr.value;
      }
      
      elements.push({
        tagName: el.tagName,
        id: el.id || undefined,
        className: el.className || undefined,
        text: el.textContent?.trim().substring(0, 100) || undefined,
        selector,
        bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        isVisible,
        isInteractive: true,
        attributes
      });
    });

    return {
      url: window.location.href,
      title: document.title,
      elements: elements,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      scrollPosition: { x: window.scrollX, y: window.scrollY }
    };
  };

  const generateSelector = (element: Element): string => {
    if (element.id) {
      return `#${CSS.escape(element.id)}`;
    }
  
    let selector = element.tagName.toLowerCase();
    const classAttr = element.getAttribute('class');
  
    if (classAttr) {
      const escapedClasses = classAttr.split(' ')
        .filter(c => c.trim())
        .map(c => `.${CSS.escape(c)}`)
        .join('');
      selector += escapedClasses;
    }
  
    const matches = document.querySelectorAll(selector);
    if (matches.length > 1) {
      const parent = element.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(element) + 1;
        selector += `:nth-child(${index})`;
      }
    }
  
    return selector;
  };


  const executeDOMOperation = async (operation: DOMOperation): Promise<string> => {
    try {
      switch (operation.type) {
        case 'click':
          if (operation.selector) {
            const element = document.querySelector(operation.selector) as HTMLElement;
            if (element) {
              element.click();
              return `Clicked element: ${operation.selector}`;
            }
          } else if (operation.coordinates) {
            const element = document.elementFromPoint(operation.coordinates.x, operation.coordinates.y) as HTMLElement;
            if (element) {
              element.click();
              return `Clicked at coordinates (${operation.coordinates.x}, ${operation.coordinates.y})`;
            }
          }
          throw new Error('Element not found or not clickable');

        case 'type':
          if (operation.selector && operation.value) {
            const element = document.querySelector(operation.selector) as HTMLInputElement;
            if (element) {
              element.focus();
              element.value = operation.value.toString();
              element.dispatchEvent(new Event('input', { bubbles: true }));
              element.dispatchEvent(new Event('change', { bubbles: true }));
              return `Typed "${operation.value}" into ${operation.selector}`;
            }
          }
          throw new Error('Input element not found');

        case 'scroll':
          if (operation.coordinates) {
            window.scrollTo({
              left: operation.coordinates.x,
              top: operation.coordinates.y,
              behavior: 'smooth'
            });
            return `Scrolled to (${operation.coordinates.x}, ${operation.coordinates.y})`;
          } else if (operation.selector) {
            const element = document.querySelector(operation.selector);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              return `Scrolled to element: ${operation.selector}`;
            }
          }
          throw new Error('Scroll target not found');

        case 'wait':
          const delay = (operation.value as number) || 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return `Waited ${delay}ms`;

        case 'extract':
          if (operation.selector) {
            const elements = document.querySelectorAll(operation.selector);
            const data = Array.from(elements).map(el => ({
              text: el.textContent?.trim(),
              html: el.innerHTML,
              attributes: Object.fromEntries(
                Array.from(el.attributes).map(attr => [attr.name, attr.value])
              )
            }));
            return `Extracted data from ${elements.length} elements matching ${operation.selector}`;
          }
          throw new Error('Selector required for extraction');

        case 'navigate':
          if (operation.value) {
            window.location.href = operation.value.toString();
            return `Navigating to ${operation.value}`;
          }
          throw new Error('URL required for navigation');

        default:
          throw new Error(`Unknown operation type: ${(operation as any).type}`);
      }
    } catch (error) {
      return `Error executing ${operation.type}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const executeOperations = async (operations: DOMOperation[]): Promise<string[]> => {
    setIsExecuting(true);
    const results: string[] = [];
    
    for (const operation of operations) {
      const result = await executeDOMOperation(operation);
      results.push(result);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsExecuting(false);
    return results;
  };

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    const updatePageState = () => {
      const newPageState = capturePageState();
      setPageState(newPageState);
      
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].sender === 'system') {
            return prev;
        }
        return [
            ...prev,
            { 
              id: Date.now(), 
              sender: 'system', 
              text: `📍 Page updated: ${newPageState.title} (${newPageState.elements.length} interactive elements detected)` 
            },
        ];
      });
    };

    updatePageState();

    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updatePageState, 500);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    return () => {
        observer.disconnect();
        clearTimeout(debounceTimer);
    };
  }, [pathname]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: trimmedInput,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const botMessageId = Date.now() + 1;
    setMessages(prev => [
      ...prev,
      { id: botMessageId, sender: 'bot', text: '' },
    ]);

    try {
      const payload = {
        prompt: trimmedInput,
        pageState: pageState,
        capabilities: {
          canClick: true,
          canType: true,
          canScroll: true,
          canExtract: true,
          canNavigate: true,
          canWait: true
        }
      };

      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok || !res.body) throw new Error('Streaming failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let operations: DOMOperation[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        try {
          const lines = accumulated.split('\n');
          for (const line of lines) {
            if (line.startsWith('OPERATION:')) {
              const opData = line.substring(10);
              const operation = JSON.parse(opData);
              operations.push(operation);
            }
          }
        } catch (e) {
            // Parsing errors are ignored
        }

        await new Promise(resolve => setTimeout(resolve, 30));

        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId 
              ? { ...msg, text: accumulated.replace(/OPERATION:.*\n/g, ''), operations } 
              : msg
          )
        );
      }

      if (operations.length > 0) {
        const executionResults = await executeOperations(operations);
        
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 2,
            sender: 'system',
            text: `🤖 Executed ${operations.length} operations:\n${executionResults.join('\n')}`
          }
        ]);

        setTimeout(() => {
          setPageState(capturePageState());
        }, 1000);
      }

    } catch (error) {
      console.error("Streaming error:", error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessageId
            ? { ...msg, text: "Sorry, I'm having trouble connecting. Please try again later." }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const MessageBubble = ({ msg }: { msg: Message }) => {
    if (msg.sender === 'system') {
      return (
        <div className="text-center text-xs text-gray-500 my-2 italic whitespace-pre-wrap">
          {msg.text}
        </div>
      );
    }

    const isUser = msg.sender === 'user';
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs md:max-w-sm rounded-lg px-3 py-2 text-sm ${isUser ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
          <div className="whitespace-pre-wrap">{msg.text}</div>
          {msg.operations && msg.operations.length > 0 && (
            <div className="mt-2 text-xs opacity-75">
              🔧 {msg.operations.length} operation(s) planned
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/80 md:items-end md:justify-end md:bg-transparent md:p-4 md:pointer-events-none">
          <div className="w-11/12 max-h-[85vh] md:w-96 md:max-h-[70vh] md:mb-16 flex flex-col bg-white rounded-xl shadow-2xl transition-all duration-300 ease-in-out md:pointer-events-auto">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-xl">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Web Agent</h3>
                <p className="text-xs text-gray-500">
                  {pageState ? `${pageState.elements.length} elements detected` : 'Scanning page...'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {isExecuting && (
                  <div className="animate-spin h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                )}
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 cursor-pointer" aria-label="Close chat">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white rounded-b-xl">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tell me what to do on this page..."
                  className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                  disabled={isExecuting}
                />
                <button onClick={handleSendMessage} className="bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed" disabled={!input.trim() || loading || isExecuting} aria-label="Send message">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                I can click, type, scroll, extract data, and navigate for you
              </div>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className={`fixed bottom-24 md:bottom-4 right-4 z-[999] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 cursor-pointer ${isExecuting ? 'bg-orange-600 hover:bg-orange-700 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'}`} aria-label="Toggle web agent">
        {isExecuting ? (
          <div className="animate-spin h-7 w-7 border-2 border-white border-t-transparent rounded-full"></div>
        ) : (
          <LucideMessageCircle/>
        )}
      </button>
    </>
  );
}

export default function AgentChat(){
  const pathname = usePathname();

  const allowedPaths = ['accounts', 'tasks', 'reports', 'settings', 'users'];
  const currentPath = pathname?.split('/')[1]; // get first path segment

  if (!allowedPaths.includes(currentPath)) return null;

  return <WebAgentChat />;
}