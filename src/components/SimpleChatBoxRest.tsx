import { getSelectedModel } from "@/app/lib/models";
import { useRef, useState, useEffect } from "react";
import { getGeminiApiKey } from "./SettingsPage";
import { Atom, RefreshCcw, Send, Trash } from "lucide-react";
import { fetchOpenAIMessage } from "./utils/fetchAIChat";
import ComponentsUI from "./ComponentsUI";
import { getLocalStorage, setLocalStorage, useStateRef } from "atomhooks";
import { LOCAL_STORAGE_CONFIG } from "@/lib/useLocalStorageValue";

export interface ToolCallFunction {
    arguments: string;
    name: string;
}

export interface ToolCall {
    function: ToolCallFunction;
    id: string;
    type: "function";
    name: string;
}

export interface ChatMessage {
    content: string;
    role: "user" | "tool" | "assistant";
    tool_call_id?: string;
    tool_calls?: ToolCall[]; // Add this for assistant messages with tool calls
    forUser?: boolean; // Indicates if the message is for the user
    continueConversationToolCall?: boolean;
    showAtom?: boolean;
    setToolCall?: boolean;
}

interface AiChatMessage {
    role: "user" | "tool" | "assistant";
    content: string;
    tool_call_id?: string;
}

export interface ApiResponse {
    reply: string;
    fulltrace: FullTraceMessage[];
    toolcalls: ToolCall[];
    onlyToolCalled?: boolean; // Indicates if a tool was called
}

export interface FullTraceMessage {
    role: "system" | "user" | "assistant" | "tool";
    content: string;
    tool_calls?: ToolCall[];
}

interface SimpleChatBoxRestProps {
    className?: string;
}

const SimpleChatBoxRest = ({ className }: SimpleChatBoxRestProps) => {
    const [input, setInput, refInput] = useStateRef<string>("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages, refMessages] = useStateRef<ChatMessage[]>([]);
    const aiMessagesRef = useRef<AiChatMessage[]>([]);
    const [isProcessingTools, setIsProcessingTools] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [localStorageLoaded, setLocalStorageLoaded] = useState(false);

    // Wait for localStorage to load before enabling input
    useEffect(() => {
        // Simulate async localStorage load (replace with actual logic if needed)
        // If you have a specific key to check, use getLocalStorage('key')
        // For now, just set loaded after a tick
        Promise.resolve().then(() => setLocalStorageLoaded(true));
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            const newHeight = Math.min(scrollHeight, 72);
            textareaRef.current.style.height = newHeight + 'px';

            // Show scrollbar only when content exceeds max height
            if (scrollHeight > 72) {
                textareaRef.current.style.overflow = 'auto';
            } else {
                textareaRef.current.style.overflow = 'hidden';
            }
        }
    }, [input]);

    const handleClear = () => {
        setMessages([]);
        aiMessagesRef.current = [];
        setInput("");
    };

    const sendMessage = async () => {
        setLoading(true);

        try {
            const apiKey = getGeminiApiKey();
            const model = getSelectedModel();
            if (!apiKey || !model) return;

            if (refInput()) {
                const userMessage = { role: "user" as const, content: refInput().trim() };
                setMessages(prevMessages => [...prevMessages, userMessage]);
                aiMessagesRef.current.push(userMessage);
            }

            setInput("");

            const AiCall = await fetchOpenAIMessage(apiKey, aiMessagesRef.current, model);

            if (AiCall.onlyToolCalled) {
                setLoading(false);
            }
            const assistantMessage: AiChatMessage = {
                role: "assistant",
                content: AiCall.reply,
                ...(AiCall.toolcalls?.length > 0 && { tool_calls: AiCall.toolcalls }),
            };

            aiMessagesRef.current.push(assistantMessage);

            // Create a separate ChatMessage for UI, do not mutate assistantMessage
            const userMessage: ChatMessage = {
                ...assistantMessage,
            };

            if (AiCall.onlyToolCalled) {
                userMessage.forUser = true;
                userMessage.showAtom = true;
            }

            const updatedMessages = [...refMessages(), userMessage];

            const userAssistantMessage: ChatMessage = {
                role: "assistant",
                content: 'Calling tools ',
                forUser: true,
                showAtom: true,
            };

            const userUpdatedMessages = AiCall.onlyToolCalled ? updatedMessages : [...updatedMessages, userAssistantMessage]
            setMessages(userUpdatedMessages);

            if (AiCall.toolcalls && AiCall.toolcalls.length > 0) {
                await processToolCalls(AiCall.toolcalls);
            }

        } catch (error) {
            console.error("Error sending message:", error);
            return;
        } finally {
            setLoading(false);
        }
    }

    const processToolCalls = async (toolCalls: ToolCall[]) => {
        setIsProcessingTools(true);
        for (const toolCall of toolCalls) {
            switch (toolCall.function.name) {
                case "getLocalStorage": {
                    const args = JSON.parse(toolCall.function.arguments);
                    if (args.key) {
                        const { value: localStorageValue } = getLocalStorage(args.key, null, LOCAL_STORAGE_CONFIG)
                        const newMessage: ChatMessage = {
                            role: "tool",
                            content: `Reading value of ${args.key}, It's ${localStorageValue}`,
                            tool_call_id: toolCall.id,
                        };
                        const aiNewMessage: AiChatMessage = {
                            role: "tool",
                            content: `Called tool getLocalStorage, Local Storage Value for ${args.key}: ${localStorageValue}`,
                            tool_call_id: toolCall.id,
                        };
                        setMessages(prev => [...prev, newMessage]);
                        aiMessagesRef.current.push(aiNewMessage);
                    }
                    else {
                        console.warn("Invalid arguments for getLocalStorage:", args);
                        const newMessage: ChatMessage = {
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: "There was an error reading value."
                        };
                        const aiNewMessage: AiChatMessage = {
                            role: "tool",
                            content: "Called tool getLocalStorage, Error: Invalid arguments for getLocalStorage, Try Again",
                            tool_call_id: toolCall.id,
                        };
                        setMessages(prev => [...prev, newMessage]);
                        aiMessagesRef.current.push(aiNewMessage);
                    }
                    break;
                }
                case "setLocalStorage": {
                    const args = JSON.parse(toolCall.function.arguments);
                    if (args.key && args.value) {
                        setLocalStorage(args.key, args.value);
                        const newMessage: ChatMessage = {
                            role: "tool",
                            content: `I have set the value of ${args.key} to ${args.value}`,
                            tool_call_id: toolCall.id,
                            setToolCall: true,
                        };
                        const aiNewMessage: AiChatMessage = {
                            role: "tool",
                            content: `Called tool setLocalStorage, Local Storage Value for ${args.key} has been set to ${args.value}`,
                            tool_call_id: toolCall.id,
                        };
                        setMessages(prev => [...prev, newMessage]);
                        aiMessagesRef.current.push(aiNewMessage);
                    } else {
                        console.warn("Invalid arguments for setLocalStorage:", args);
                        const newMessage: ChatMessage = {
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: "There was an error in setting the value.",
                            setToolCall: true,
                        };
                        const aiNewMessage: AiChatMessage = {
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: "Called tool setLocalStorage, Error: Invalid arguments for setLocalStorage, Try Again"
                        };

                        setMessages(prev => [...prev, newMessage]);
                        aiMessagesRef.current.push(aiNewMessage);
                    }
                    break;
                }
                case "continueConversation": {
                    const newMessage: ChatMessage = {
                        role: "tool",
                        content: "Continuing conversation ",
                        tool_call_id: toolCall.id,
                        continueConversationToolCall: true,
                        showAtom: true,
                    };
                    const aiNewMessage: AiChatMessage = {
                        role: "tool",
                        content: "Called tool continueConversation, Continuing conversation...",
                        tool_call_id: toolCall.id,
                    };
                    setMessages(prev => [...prev, newMessage]);
                    aiMessagesRef.current.push(aiNewMessage);
                    sendMessage();
                    break;
                }
                default: {
                    console.warn("Unknown tool call function:", toolCall.function.name);
                    const newMessage: ChatMessage = {
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: `Error: Unknown tool call function ${toolCall.function.name}, Try Again`
                    };
                    setMessages(prev => [...prev, newMessage]);
                    break;
                }
            }
        }
        setIsProcessingTools(false);
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage();
    }

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!loading && !isProcessingTools && input.trim()) {
                handleSend(e);
            }
        }
    };

    return (
        <div className={"flex flex-col h-full w-full bg-white dark:bg-gray-900 " + (className || "")}>
            <style>{`
          @keyframes customPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.75; }
          }
          .custom-pulse {
            animation: customPulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
            <div className="w-full bg-white dark:bg-gray-900 z-[60] sticky top-0">
                <div className="flex items-center px-2 justify-between">
                    <ComponentsUI />
                </div>
                <hr className="shadow text-white dark:text-gray-900 shadow-gray-300 dark:shadow-gray-700 w-full mt-2" />
            </div>
            {/* Add padding-top to prevent content from being hidden under the fixed bar. Adjust value if bar height changes. */}
            <div className="flex-1 overflow-y-auto px-0 sm:px-0 py-4 mx-2 space-y-3">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`text-base rounded px-2 py-1 max-w-2xl w-fit break-words shadow-sm transition-all
                            ${msg.role === "user"
                                ? "bg-blue-500 text-white rounded-br-none self-end ml-auto animate-fade-in-right"
                                : msg.role === "tool"
                                    ? msg.continueConversationToolCall
                                        ? "bg-teal-100 dark:bg-teal-900 text-teal-900 dark:text-teal-100 self-start mr-auto border-l-4 border-teal-500 dark:border-teal-400 animate-fade-in-left"
                                        : msg.setToolCall ?
                                            "bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 self-start mr-auto border-l-4 border-emerald-500 dark:border-emerald-400 animate-fade-in-left"
                                            : "bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 self-start mr-auto border-l-4 border-yellow-500 dark:border-yellow-400 animate-fade-in-left"
                                    : msg.forUser
                                        ? "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 self-start mr-auto border-l-4 border-green-500 dark:border-green-400 animate-fade-in-left"
                                        : "bg-gray-200 rounded-bl-none dark:bg-gray-800 text-gray-900 dark:text-gray-100 self-start mr-auto animate-fade-in-left"
                            }`}
                    >
                        {msg.role === "tool" && !msg.continueConversationToolCall && (
                            <div className="text-xs font-semibold mb-1 opacity-70">Tool Response</div>
                        )}
                        <span className="flex items-center" style={{ whiteSpace: 'pre-line' }}>
                            {
                                msg.content && msg.content.replace(/\n+$/g, "")
                            }&nbsp;{msg.showAtom && (
                                <Atom className="w-4 h-4" />)}
                        </span>
                    </div>
                ))}
                {(loading) && (
                    <div className="text-blue-500 bg-blue-100 rounded border-l-4 border-l-blue-500 max-w-fit p-1 custom-pulse">
                        {isProcessingTools ? <span className="flex flex-row items-center justify-center">Processing tools &nbsp;<RefreshCcw className="w-4 h-4 animate-spin" /></span> : <span className="flex flex-row items-center justify-center">Thinking &nbsp;<RefreshCcw className="w-4 h-4 animate-spin" /></span>}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="flex gap-2 items-center justify-center p-4 max-[500px]:px-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky bottom-0 w-full">
                <button
                    type="button"
                    onClick={handleClear}
                    title="Clear chat"
                    className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                    aria-label="Clear chat"
                >
                    <Trash className="w-5 h-5 text-red-500" />
                </button>
                <textarea
                    ref={textareaRef}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-2 text-base leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition-all duration-200 resize-none placeholder-gray-500 dark:placeholder-gray-400"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here..."
                    rows={1}
                    style={{
                        minHeight: '32px',
                        maxHeight: '120px',
                        lineHeight: '1.5',
                        overflow: 'hidden'
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={!localStorageLoaded}
                />

                {/* Character counter for long messages */}
                {input.length > 500 && (
                    <div className="absolute rounded bottom-1 right-14 text-xs bg-white p-1 dark:bg-gray-900 text-gray-400 dark:text-gray-500">
                        {input.length}
                    </div>
                )}
                <button
                    type="submit"
                    className="bg-blue-500 text-white max-h-10 px-2 py-2 rounded hover:bg-blue-600 text-base font-semibold shadow-md transition-all disabled:opacity-50"
                    disabled={loading || isProcessingTools || !input.trim() || !localStorageLoaded}
                >
                    <Send className="w-5 h-5" />
                </button>
            </form >
        </div >
    );
}

export default SimpleChatBoxRest;