/**
 * Checks if a Gemini API key exists in localStorage
 * @returns {boolean} True if the key exists, false otherwise
 */
export function hasGeminiApiKey(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(STORAGE_KEY);
}

import React, { useState, useEffect } from "react";
import { getSelectedModel, saveSelectedModel, getAvailableModelsInfo } from "../app/lib/models";

const STORAGE_KEY = "gemini_api_key";

// XOR obfuscation helpers
function xorObfuscate(str: string): string {
    const key = process.env.NEXT_PUBLIC_XOR_KEY || 'gmchajkhsakdh' 
    let result = "";
    for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

/**
 * Exported function to get the Gemini API key (deobfuscated)
 * @returns The API key string, or empty string if not set
 */
export function getGeminiApiKey(): string {
    if (typeof window === "undefined") return "";
    const obfuscated = localStorage.getItem(STORAGE_KEY);
    if (!obfuscated) return "";
    try {
        return xorObfuscate(obfuscated);
    } catch {
        return "";
    }
}

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("");
    const [model, setModel] = useState(getSelectedModel());

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedKey = localStorage.getItem(STORAGE_KEY);
            if (storedKey) setApiKey(xorObfuscate(storedKey));
        }
    }, []);

    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(e.target.value);
    };


    const handleApiKeySave = () => {
        if (typeof window !== "undefined") {
            const obfuscated = xorObfuscate(apiKey);
            localStorage.setItem(STORAGE_KEY, obfuscated);
            alert("API key saved!");
        }
    };

    const handleApiKeyRemove = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
            setApiKey("");
            alert("API key removed.");
        }
    };

    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setModel(e.target.value);
        saveSelectedModel(e.target.value);
    };

    return (
        <div className="px-2 py-10">
            <div className="max-w-lg mx-auto p-6 max-[500px]:px-2 max-[500px]:py-4 rounded-xl shadow-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Settings</h2>
                {/* Note about API key storage */}
                <div className="mb-4 p-3 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 text-sm border border-blue-200 dark:border-blue-700">
                    <strong>How your API key is stored:</strong> Your Gemini API key is <b>never sent to any server</b>. It is stored only in your browser's local storage, and is obfuscated using a simple XOR algorithm for basic protection. You can clear or update it at any time. For maximum security, do not share your device with others.
                </div>
                <div className="mb-6">
                    <label htmlFor="api-key" className="block mb-2 font-medium text-gray-900 dark:text-white">
                        Gemini API Key
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">Google AI Studio</a>. Your key is stored securely in your browser.
                    </p>
                    <input
                        id="api-key"
                        type="password"
                        value={apiKey}
                        onChange={handleApiKeyChange}
                        placeholder="Enter your API key..."
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-3 mt-3">
                        <button
                            onClick={handleApiKeySave}
                            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white border-none transition-colors"
                        >
                            Save API Key
                        </button>
                        <button
                            onClick={handleApiKeyRemove}
                            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white border-none transition-colors"
                            type="button"
                        >
                            Remove Key
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="model-select" className="block mb-2 font-medium text-gray-900 dark:text-white">
                        Select Model
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Choose the AI model that best fits your needs. Different models have varying capabilities and response speeds.
                    </p>
                    <div className="relative w-full">
                        <select
                            id="model-select"
                            value={model}
                            onChange={handleModelChange}
                            className="w-full p-3 pr-10 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                        >
                            {getAvailableModelsInfo().map((m: { id: string; name: string }) => (
                                <option key={m.id} value={m.id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                    {m.name}
                                </option>
                            ))}
                        </select>
                        {/* Custom dropdown arrow */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="h-5 w-5 text-gray-400 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.584l3.71-3.354a.75.75 0 111.02 1.1l-4.25 3.85a.75.75 0 01-1.02 0l-4.25-3.85a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}