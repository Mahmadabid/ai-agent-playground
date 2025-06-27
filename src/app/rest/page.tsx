'use client';

import SimpleChatBoxRest from "@/components/SimpleChatBoxRest";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { hasGeminiApiKey } from "@/components/SettingsPage";

export default function Home() {

    const router = useRouter();
    const hasRun = useRef(false);
    
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        if (typeof window !== "undefined" && !hasGeminiApiKey()) {
            alert("Gemini API key not found. Please set your API key in Settings.");
            router.replace("/settings");
        }
    }, []);

    return (
        <div className="flex flex-col min-h-[calc(100vh-60px)] bg-white dark:bg-gray-900">
            <SimpleChatBoxRest className="flex-1 w-full" />
        </div>
    );
}
