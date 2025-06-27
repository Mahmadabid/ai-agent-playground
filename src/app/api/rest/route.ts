import { AISdkOpenAI } from "@/app/lib/openai";
import { NextRequest, NextResponse } from "next/server";

// Single source of truth for localStorage schema
const STORAGE_SCHEMA = {
    calculation: {
        description: "Store calculation results or numeric values",
        validate: (value: string) => !isNaN(Number(value)) && value.trim() !== "",
        examples: ["42", "3.14", "1000", "-5.7"],
        behaviorNotes: "Accept various number formats, validate they're numeric"
    },
    flag: {
        description: "Store boolean flags",
        validate: (value: string) => ["true", "false"].includes(value.toLowerCase()),
        supportedValues: ["true", "false"],
        examples: ["true", "false"],
        behaviorNotes: "Accept 'yes'/'no', 'on'/'off', '1'/'0' and convert to 'true'/'false'"
    },
    note: {
        description: "Store text notes and messages",
        validate: (value: string) => typeof value === "string" && value.trim().length > 0,
        examples: ["Meeting at 3pm", "Remember to check logs", "Project deadline Friday"],
        behaviorNotes: "Accept any non-empty text, trim whitespace"
    },
    theme: {
        description: "Store UI theme preference",
        validate: (value: string) => ["light", "dark"].includes(value.toLowerCase()),
        supportedValues: ["light", "dark"],
        examples: ["light", "dark"],
        behaviorNotes: "Case-insensitive, normalize to lowercase"
    }
} as const;

// Tools: Define WHAT the AI can do (structure & validation)
const tools = [
    {
        type: "function" as const,
        function: {
            name: "setLocalStorage",
            description: "Store a value in localStorage under the specified key",
            parameters: {
                type: "object",
                properties: {
                    key: {
                        type: "string",
                        enum: Object.keys(STORAGE_SCHEMA),
                        description: "The storage key to use"
                    },
                    value: {
                        type: "string",
                        description: "The value to store (will be normalized based on key type)"
                    }
                },
                required: ["key", "value"]
            }
        }
    },
    {
        type: "function" as const,
        function: {
            name: "getLocalStorage",
            description: "Retrieve a value from localStorage for the specified key",
            parameters: {
                type: "object",
                properties: {
                    key: {
                        type: "string",
                        enum: Object.keys(STORAGE_SCHEMA),
                        description: "The storage key to read from"
                    }
                },
                required: ["key"]
            }
        }
    },
    {
        type: "function" as const,
        function: {
            name: "continueConversation",
            description: "Continue the conversation after executing localStorage operations",
            parameters: {
                type: "object",
                properties: {},
                required: []
            }
        }
    }
];

export async function POST(req: NextRequest) {
    try {
        const { apiKey, messageList, model } = await req.json();

        const openai = AISdkOpenAI(apiKey);

        const systemPrompt = `
You are a helpful localStorage editor AI assistant.

BEHAVIOR GUIDELINES:
- Always explain what you're doing when storing or retrieving values
- Be flexible with user input and normalize values appropriately
- Provide helpful feedback about what was stored/retrieved
- Handle multiple operations by calling the appropriate tools for each operation
- If a user asks to get all values, call getLocalStorage for each key in the schema

TOOL USAGE RULES:

1. For simple operations (just get/set):
   - If the request is a simple “set this key” or “get this key”, call only \`setLocalStorage\` or \`getLocalStorage\` and respond directly.

2. For conditional or dependent operations:

   - If logic depends on a single value:
     → Call \`getLocalStorage\` and \`continueConversation\` TOGETHER in the SAME \`tool_calls\` array.
     → Always put \`getLocalStorage\` first and \`continueConversation\` last.

   - If logic depends on MULTIPLE values (e.g. “If flag is true and note is X”):
     → Call \`getLocalStorage\` once for EACH key you need (each as a separate \`tool_call\`)
     → Then call \`continueConversation\` as the LAST \`tool_call\` in the same array.
     → Example: \`tool_calls = [get(flag), get(note), continueConversation()]\`

   - You MAY also include \`setLocalStorage\` in the same \`tool_calls\` array **before** \`continueConversation\`
     if:
     → You want to make a change and then make further decisions or follow-up changes based on it.
     → Example: \`tool_calls = [set(theme), get(flag), continueConversation()]\`

3. NEVER call just \`getLocalStorage\` and wait — always follow it with \`continueConversation\` if further logic is needed.

4. Use \`continueConversation\` when:
   - You need to evaluate a condition or value before acting
   - You’re chaining logic based on previously fetched values
   - You’re performing multi-step conditional tasks
   - You’ve just stored something but plan to take additional action depending on it

EXAMPLES:
- "Store theme as dark" → Just call \`setLocalStorage\` (no \`continueConversation\` needed)
- "Get my calculation value" → Just call \`getLocalStorage\` (no \`continueConversation\` needed)
- "Read calculation value, if odd set it to 7 if even set it to 9"
  → \`tool_calls: [getLocalStorage (key: calculation), continueConversation()]\`
- "Get all my values and tell me which ones need updating"
  → \`tool_calls: [getLocalStorage(calculation), getLocalStorage(flag), getLocalStorage(note), getLocalStorage(theme), continueConversation()]\`
- "If flag is true, set theme to dark; else set to light. Then check note and set calculation accordingly"
  → \`tool_calls: [getLocalStorage(flag), getLocalStorage(note), continueConversation()]\`
- "read value of flag, if true, set theme to light, else dark"
    → \`tool_calls: [getLocalStorage(flag), continueConversation()]\`
    → \`tool_calls: [setLocalStorage(theme)]\`

KEY-SPECIFIC BEHAVIORS:
${Object.entries(STORAGE_SCHEMA)
                .map(
                    ([key, config]) => `- ${key}: ${config.behaviorNotes}`
                )
                .join('\n')}

EXAMPLES OF FLEXIBLE INPUT HANDLING:
- calculation: "42", "3.14", " 100 " (trim spaces), "-5.7"
- flag: "yes" → "true", "no" → "false", "on" → "true", "off" → "false"

IMPORTANT: Only call \`continueConversation\` when you need to process results, evaluate conditions, or perform additional logic after localStorage operations. For simple get/set requests, respond directly after the localStorage operation. But if a user says "read this value and act on it" or "check both flag and note then decide", you MUST fetch the needed values and follow with \`continueConversation()\` to complete the logic.
Make sure to always call \`continueConversation\` after any \`getLocalStorage\` calls that require further processing or decision-making.
`.trim();

        let messages = [
            {
                role: "system",
                content: systemPrompt
            },
            ...messageList
        ];

        let chatCompletion = await openai.chat.completions.create({
            model,
            messages,
            temperature: 0.7,
            max_tokens: 150,
            tools,
            tool_choice: "auto",
        });

        let toolcalls: any[] = [];
        let message = chatCompletion.choices?.[0]?.message;

        if (message?.tool_calls && message.tool_calls.length > 0) {
            messages.push(message);

            message.tool_calls.forEach((toolCall: any) => {
                toolcalls.push(toolCall);
            });
        }
        let onlyToolCalled = false;
        if (!message?.content && toolcalls.length > 0) {
            onlyToolCalled = true;
        }
        const reply = onlyToolCalled ? 'Calling tools ' : message?.content;
        return NextResponse.json({
            reply,
            fulltrace: messages,
            toolcalls: toolcalls,
            onlyToolCalled,
        }, { status: 200 });

    } catch (err: any) {
        console.error("API Error:", err);
        return NextResponse.json({
            reply: "Error: " + (err?.message || "Unknown error.")
        }, { status: 500 });
    }
}