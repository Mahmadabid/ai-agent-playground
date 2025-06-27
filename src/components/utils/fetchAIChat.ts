import { ApiResponse, ChatMessage } from "../SimpleChatBoxRest";

export async function fetchOpenAIMessage(apiKey: string, messageList: ChatMessage[], model: string): Promise<ApiResponse> {
    try {
        const response = await fetch("/api/rest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ apiKey, messageList, model }),
        });
        if (!response.ok) {
            return { reply: "Sorry, there was an error with the chat API.", fulltrace: [], toolcalls: [], onlyToolCalled: false };
        }
        const data: ApiResponse = await response.json();
        return data;
    } catch (err: any) {
        return { reply: "Sorry, there was an error with the chat API.", fulltrace: [], toolcalls: [], onlyToolCalled: false };
    }
}