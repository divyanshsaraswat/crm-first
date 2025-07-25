'use client';

// Imports from Testing Library for robust, user-centric interactions
import userEvent from '@testing-library/user-event';
import { findByRole, findByPlaceholderText, screen } from '@testing-library/dom';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { LucideMessageCircle, BrainCircuit, Mic } from 'lucide-react';

// --- INTERFACES ---
interface Message {
  id: number;
  sender: 'user' | 'bot' | 'system';
  text: string;
  operations?: DOMOperation[];
  chainOfThought?: string;
}
interface DOMOperation {
  type: 'click' | 'type' | 'scroll' | 'wait' | 'navigate';
  role?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  selector?: string;
}
interface PageState {
  url: string;
  title: string;
  elements: ElementInfo[];
  viewport: { width: number; height: number };
  scrollPosition: { x: number; y: number };
}
interface ElementInfo {
  tagName: string;
  text?: string;
  placeholder?: string;
  name?: string; // Accessible name from label
  selector: string;
}

// --- THOUGHTBUBBLE COMPONENT ---
const ThoughtBubble = ({ thought }: { thought: string }) => {
  return (
    <div className="my-3 p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
      <div className="flex items-center text-sm font-semibold text-gray-600 mb-2">
        <BrainCircuit className="h-4 w-4 mr-2" />
        Agent's Plan
      </div>
      <div className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
        {thought}
      </div>
    </div>
  );
};

// --- MAIN CHAT COMPONENT ---
function WebAgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageState, setPageState] = useState<PageState | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // --- HELPER FUNCTIONS ---
  const generateSelector = (element: Element): string => {
    if (element.id) {
        const idSelector = `#${CSS.escape(element.id)}`;
        if (document.querySelectorAll(idSelector).length === 1) return idSelector;
    }
    const testId = element.getAttribute('data-testid') || element.getAttribute('data-cy');
    if (testId) {
        const testIdSelector = `[data-testid="${CSS.escape(testId)}"]`;
        if (document.querySelectorAll(testIdSelector).length === 1) return testIdSelector;
    }
    const name = element.getAttribute('name');
    if (name) {
        const nameSelector = `${element.tagName.toLowerCase()}[name="${CSS.escape(name)}"]`;
        if (document.querySelectorAll(nameSelector).length === 1) return nameSelector;
    }
    let path = [];
    let current: Element | null = element;
    while (current) {
        let part = current.tagName.toLowerCase();
        const parent = current.parentElement as any;
        if (parent) {
            const siblings = Array.from(parent.children).filter(
                child => (child as Element).tagName === (current as Element).tagName
            );
            if (siblings.length > 1) {
                const index = siblings.indexOf(current) + 1;
                part += `:nth-of-type(${index})`;
            }
        }
        path.unshift(part);
        const tempSelector = path.join(' > ');
        if (document.querySelectorAll(tempSelector).length === 1) return tempSelector;
        current = parent;
    }
    return path.join(' > ');
  };

  const capturePageState = (): PageState => {
    const elements: ElementInfo[] = [];
    const interactiveSelector = 'a, button, input, select, textarea, [role="button"]';
    
    document.querySelectorAll(interactiveSelector).forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
      if (!isVisible) return;
      const elementInfo: ElementInfo = {
        tagName: el.tagName.toLowerCase(),
        text: el.textContent?.trim().substring(0, 100),
        selector: generateSelector(el),
      };
      if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
        const inputEl = el as HTMLInputElement | HTMLTextAreaElement;
        elementInfo.placeholder = inputEl.placeholder;
        if (inputEl.id) {
          const label = document.querySelector(`label[for="${inputEl.id}"]`);
          if (label) {
            elementInfo.name = label.textContent?.trim();
          }
        }
        if (!elementInfo.name && inputEl.parentElement?.tagName.toLowerCase() === 'label') {
          elementInfo.name = inputEl.parentElement.textContent?.trim();
        }
      }
      elements.push(elementInfo);
    });

    return {
      url: window.location.href,
      title: document.title,
      elements: elements,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      scrollPosition: { x: window.scrollX, y: window.scrollY }
    };
  };

  // --- AUTOMATION STATE MACHINE LOGIC ---
  const AUTOMATION_OPERATIONS_KEY = 'automation_operations';
  const AUTOMATION_STEP_KEY = 'automation_step';
  const AUTOMATION_GOAL_KEY = 'automation_goal';

  const executeDOMOperation = async (operation: DOMOperation): Promise<string> => {
    const container = document.body;
    try {
      switch (operation.type) {
        case 'click': {
          if (!operation.role || !operation.name) throw new Error("A 'role' and 'name' are required for click operations.");
          const element = await findByRole(container, operation.role, { name: new RegExp(operation.name, 'i') });
          if ((element as HTMLButtonElement).disabled) throw new Error(`Element is disabled.`);
          await userEvent.click(element);
          return `✅ Clicked ${operation.role}: "${operation.name}"`;
        }
        case 'type': {
          if (operation.value === undefined) throw new Error("A 'value' is required.");
          if (!operation.role) throw new Error("A 'role' is required.");
          let element: HTMLElement;
          if (operation.name) {
            element = await findByRole(container, operation.role, { name: new RegExp(operation.name, 'i') });
          } else if (operation.placeholder) {
            element = await findByPlaceholderText(container, new RegExp(operation.placeholder, 'i'));
          } else {
            throw new Error("A 'name' or 'placeholder' is required.");
          }
          await userEvent.clear(element);
          await userEvent.type(element, operation.value.toString());
          return `✅ Typed into ${operation.role} (Name: "${operation.name || operation.placeholder}")`;
        }
        case 'scroll': {
            if (!operation.name) throw new Error("A 'name' (text content) is required for 'scroll'.");
            const element = await screen.findByText(new RegExp(operation.name, 'i'));
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return `✅ Scrolled to element with text: "${operation.name}"`;
        }
        case 'wait': {
            const delay = (operation.value as number) || 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return `✅ Waited for ${delay}ms`;
        }
        case 'navigate': {
            if (!operation.value) throw new Error("A 'value' (URL) is required for 'navigate'.");
            window.location.href = operation.value.toString();
            return `✅ Navigating to ${operation.value}`;
        }
        default:
          throw new Error(`Unknown operation type: ${(operation as any).type}`);
      }
    } catch (error) {
      let conciseErrorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        conciseErrorMessage = error.message.split('\n')[0];
      }
      return `❌ Error on ${operation.type} for "${operation.name || ''}": ${conciseErrorMessage}`;
    }
  };

  const cleanupAutomation = () => {
    sessionStorage.removeItem(AUTOMATION_OPERATIONS_KEY);
    sessionStorage.removeItem(AUTOMATION_STEP_KEY);
    sessionStorage.removeItem(AUTOMATION_GOAL_KEY);
    setIsExecuting(false);
  };

  const continueAutomation = async () => {
    if (!sessionStorage.getItem(AUTOMATION_OPERATIONS_KEY)) {
      if (isExecuting) setIsExecuting(false);
      return;
    }

    setIsExecuting(true);

    while (sessionStorage.getItem(AUTOMATION_OPERATIONS_KEY)) {
        const opsJson = sessionStorage.getItem(AUTOMATION_OPERATIONS_KEY);
        const stepStr = sessionStorage.getItem(AUTOMATION_STEP_KEY);

        if (!opsJson || !stepStr) {
            cleanupAutomation();
            break;
        }

        const operations: DOMOperation[] = JSON.parse(opsJson);
        const currentStep = parseInt(stepStr, 10);

        if (currentStep >= operations.length) {
            setMessages(prev => [...prev, { id: Date.now(), sender: 'system', text: `🤖 Execution finished.` }]);
            cleanupAutomation();
            break;
        }

        const operation = operations[currentStep];
        sessionStorage.setItem(AUTOMATION_STEP_KEY, (currentStep + 1).toString());
        
        const MAX_RETRIES = 3;
        let finalResult = '';

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            // Before retrying, check if the user has cancelled the execution
            if (!sessionStorage.getItem(AUTOMATION_OPERATIONS_KEY)) {
                console.log("Automation cancelled during retry wait.");
                return;
            }
            const result = await executeDOMOperation(operation);
            finalResult = result;
            if (result.startsWith('✅')) {
                break;
            }
            if (attempt < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        setMessages(prev => [...prev, { id: Date.now(), sender: 'system', text: finalResult }]);

        if (finalResult.startsWith('❌')) {
            const originalGoal = sessionStorage.getItem(AUTOMATION_GOAL_KEY);
            if (originalGoal) {
                setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'system', text: `🤖 Action failed. Attempting to create a new plan...` }]);
                await fetchAndStartAgent(originalGoal, capturePageState());
            } else {
                setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'system', text: `🤖 Execution stopped due to an error.` }]);
                cleanupAutomation();
            }
            break; 
        }

        if (operation.type === 'navigate' || operation.type === 'click') {
            break;
        }
    }
  };

  const startAutomation = (operations: DOMOperation[], goal: string) => {
    if (!operations || operations.length === 0) return;
    sessionStorage.setItem(AUTOMATION_OPERATIONS_KEY, JSON.stringify(operations));
    sessionStorage.setItem(AUTOMATION_STEP_KEY, '0');
    sessionStorage.setItem(AUTOMATION_GOAL_KEY, goal);
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'system',
      text: `🤖 Starting execution of ${operations.length} steps...`
    }]);
    continueAutomation();
  };
  
  const fetchAndStartAgent = async (goal: string, state: PageState | null) => {
    setLoading(true);
    const botMessageId = Date.now();
    setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: '' }]);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: goal, pageState: state }),
      });

      if (!res.ok || !res.body) throw new Error('Streaming failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let finalOperations: DOMOperation[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        
        let currentText = accumulated;
        let currentThought: string | undefined = undefined;
        const thoughtRegex = /THINKING:\s*([\s\S]*?)\s*END_THINKING/;
        const thoughtMatch = accumulated.match(thoughtRegex);

        if (thoughtMatch && thoughtMatch[1]) {
          currentThought = thoughtMatch[1].trim();
          currentText = accumulated.replace(thoughtRegex, '').trim();
        }
        const cleanText = currentText.replace(/OPERATION:.*\n?/g, '');
        setMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: cleanText, chainOfThought: currentThought } : msg));
      }
      
      const lines = accumulated.split('\n');
      for (const line of lines) {
        if (line.startsWith('OPERATION:')) {
          finalOperations.push(JSON.parse(line.substring(10)));
        }
      }

      if (finalOperations.length > 0) {
        startAutomation(finalOperations, goal);
      } else {
         setMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: "I'm not sure how to do that. Please be more specific." } : msg));
      }
    } catch (error) {
      console.error("Agent fetch error:", error);
      setMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: "Sorry, an error occurred." } : msg));
    } finally {
      setLoading(false);
    }
  };

  // --- REACT HOOKS ---
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;
    const updatePageState = () => setPageState(capturePageState());
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updatePageState, 1000);
    });

    const onPageReady = () => {
      updatePageState();
      observer.observe(document.body, { childList: true, subtree: true, attributes: true });
      continueAutomation();
    };

    if (document.readyState === 'complete') {
      onPageReady();
    } else {
      window.addEventListener('load', onPageReady);
    }
    
    return () => {
      window.removeEventListener('load', onPageReady);
      observer.disconnect();
      clearTimeout(debounceTimer);
    };
  }, [pathname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(prevInput => prevInput + transcript);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'network') {
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'system',
          text: '🎙️ Speech service unavailable. Please check your internet connection.'
        }]);
      }
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = recognition;
  }, []);

  // --- EVENT HANDLERS ---
  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading || isExecuting) return;

    const userMessage: Message = { id: Date.now(), sender: 'user', text: trimmedInput };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    await fetchAndStartAgent(trimmedInput, pageState);
  };
  
  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // NEW: Handler for the main floating button to allow stopping execution
  const handleMainButtonClick = () => {
    if (isExecuting) {
      cleanupAutomation();
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'system',
        text: '🤖 Execution stopped by user.'
      }]);
    } else {
      setIsOpen(!isOpen);
    }
  };

  // --- RENDER LOGIC ---
  const MessageBubble = ({ msg }: { msg: Message }) => {
    if (msg.sender === 'system') {
      return <div className="text-center text-xs text-gray-500 my-2 italic whitespace-pre-wrap">{msg.text}</div>;
    }
    const isUser = msg.sender === 'user';
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs md:max-w-sm rounded-lg px-3 py-2 text-sm ${isUser ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
          <div className="whitespace-pre-wrap">{msg.text || (loading && '...')}</div>
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
                  {pageState ? `${pageState.elements.length} interactive elements` : 'Scanning...'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {isExecuting && <div className="animate-spin h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full"></div>}
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800" aria-label="Close chat">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <React.Fragment key={msg.id}>
                  {msg.chainOfThought && msg.sender === 'bot' && (
                    <ThoughtBubble thought={msg.chainOfThought} />
                  )}
                  {(msg.text || msg.sender !== 'bot' || (loading && messages[messages.length - 1].id === msg.id)) && (
                      <MessageBubble msg={msg} />
                  )}
                </React.Fragment>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white rounded-b-xl">
              <div className="flex items-center space-x-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isListening ? "Listening..." : "Tell me what to do..."}
                  className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                  disabled={loading || isExecuting}/>
                
                <button 
                  onClick={handleListen} 
                  className={`p-2 rounded-md transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                  disabled={!recognitionRef.current || loading || isExecuting}
                  aria-label={isListening ? "Stop listening" : "Start listening"}
                >
                  <Mic className="h-5 w-5" />
                </button>

                <button onClick={handleSendMessage} className="bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed"
                  disabled={!input.trim() || loading || isExecuting} aria-label="Send message">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={handleMainButtonClick} 
        className={`fixed bottom-4 right-4 z-[999] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 ${isExecuting ? 'bg-orange-600 hover:bg-orange-700 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'}`} 
        aria-label={isExecuting ? "Stop execution" : "Toggle web agent"}
      >
        {isExecuting ? (<div className="animate-spin h-7 w-7 border-2 border-white border-t-transparent rounded-full"></div>) : (<LucideMessageCircle />)}
      </button>
    </>
  );
}


// --- WRAPPER COMPONENT ---
export default function AgentChat(){
  const pathname = usePathname();
  const allowedPaths = ['accounts', 'tasks', 'reports', 'settings', 'users', 'dashboard'];
  const currentPath = pathname?.split('/')[1]; 

  if (!currentPath || !allowedPaths.includes(currentPath)) {
      return null;
  }

  return <WebAgentChat />;
}

// --- GLOBAL TYPES ---
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    SpeechRecognitionEvent: any;
    SpeechRecognitionErrorEvent: any;
  }
}