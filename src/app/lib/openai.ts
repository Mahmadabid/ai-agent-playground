import OpenAI from "openai";

export function AISdkOpenAI(apiKey: string): OpenAI {
    return new OpenAI({
        apiKey: apiKey,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });
}