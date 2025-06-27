
'use client';

import { useState, useEffect } from "react";

import Link from "next/link";
import { THEME, useCalculation, useFlag, useNote, useTheme } from "@/lib/useLocalStorageValue";

export default function Home() {
  // Prevent hydration mismatch: only render after mount
  const [mounted, setMounted] = useState(false);
  const [calculation] = useCalculation();
  const [flag] = useFlag();
  const [note] = useNote();
  const [theme] = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent hydration mismatch: render nothing until client-side
    return null;
  }

  return (
    <div className="px-2 max-[500px]:px-1 py-5">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-block px-2 py-0.5 text-sm max-[500px]:text-[13px] rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
            AI-Powered • Real-time • Interactive
          </div>
          <h1 className="text-2xl max-[500px]:text-lg font-bold text-gray-900 dark:text-white">
            AI Agent Playground
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-xs max-[500px]:text-[11px]">
            Experiment with an intelligent AI agent powered by
            <span className="font-semibold text-blue-600 dark:text-blue-400"> Gemini models</span> through the
            <span className="font-semibold text-purple-600 dark:text-purple-400"> OpenAI SDK</span>.
            Watch the AI agent update your localStorage values live via a REST API.
          </p>
        </div>

        {/* Live LocalStorage Dashboard */}
        <section>
          <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-3 max-[500px]:px-1 bg-white dark:bg-gray-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2 max-[500px]:text-sm">
              Live LocalStorage Dashboard
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm max-[500px]:text-[13px] w-full">

              <div className="rounded-lg p-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 min-w-0 flex-1 max-[500px]:text-[10px]">
                <div className="text-sm max-[500px]:text-[13px] font-medium mb-0.5">CALCULATION</div>
                <div className="font-semibold break-words text-sm max-[500px]:text-[13px]">{calculation || 0}</div>
              </div>

              <div className="rounded-lg p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 min-w-0 flex-1 max-[500px]:text-[10px]">
                <div className="text-sm max-[500px]:text-[13px] font-medium mb-0.5">FLAG STATUS</div>
                <div className="font-semibold text-sm max-[500px]:text-[13px]">{flag ? "TRUE" : "FALSE"}</div>
              </div>

              <div className="rounded-lg p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 min-w-0 flex-1 max-[500px]:text-[10px]">
                <div className="text-sm max-[500px]:text-[13px] font-medium mb-0.5">NOTE</div>
                <div className="text-sm max-[500px]:text-[13px] font-semibold break-words truncate">
                  {note || <span className="italic text-gray-400">(empty)</span>}
                </div>
              </div>

              <div className="rounded-lg p-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 min-w-0 flex-1 max-[500px]:text-[10px]">
                <div className="text-sm max-[500px]:text-[13px] font-medium mb-0.5">THEME</div>
                <div className="font-semibold uppercase text-sm max-[500px]:text-[13px]">{theme || THEME.LIGHT}</div>
              </div>

            </div>
          </div>
        </section>

        {/* Features */}
        <section>
          <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-3 max-[500px]:px-1 bg-white dark:bg-gray-800 space-y-2">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white max-[500px]:text-sm">Key Features</h2>
            <div className="space-y-1 text-sm max-[500px]:text-[13px] text-gray-700 dark:text-gray-300">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">✅ AI Agent Chat:</span> Chat with Gemini models using a functional REST API powered by the OpenAI SDK.
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">📦 LocalStorage Management:</span> AI agent can read and update 4 localStorage values: <code>calculation</code>, <code>flag</code>, <code>note</code>, and <code>theme</code>.
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">🔄 Webhook Support:</span> Webhook-based chat interactions <span className="text-amber-600 dark:text-amber-400 font-medium">coming soon</span>.
              </div>
            </div>
          </div>
        </section>

        {/* Quick Guide */}
        <section>
          <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-3 max-[500px]:px-1 bg-white dark:bg-gray-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2 max-[500px]:text-sm">Quick Start</h2>
            <ol className="space-y-1 text-sm max-[500px]:text-[13px] text-gray-700 dark:text-gray-300 list-decimal list-inside">
              <li>
                <span className="font-medium text-gray-900 dark:text-white">Setup API:</span> Enter your Gemini API key and model in <Link href="/settings" className="text-blue-600 dark:text-blue-400 underline">Settings</Link>
              </li>
              <li>
                <span className="font-medium text-gray-900 dark:text-white">Chat:</span> Start chatting with the AI agent on the <Link href="/rest" className="text-purple-600 dark:text-purple-400 underline">REST page</Link>
              </li>
              <li>
                <span className="font-medium text-gray-900 dark:text-white">Observe:</span> Let the agent update your localStorage values live
              </li>
            </ol>
          </div>
        </section>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-2 w-full max-w-md mx-auto text-sm max-[500px]:text-[13px]">
          <Link href="/rest">
            <div className="text-center px-3 py-1 text-sm max-[500px]:text-[13px] rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
              🔧 REST API
            </div>
          </Link>
          <Link href="/webhook">
            <div className="text-center px-3 py-1 text-sm max-[500px]:text-[13px] rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium transition">
              🧩 Webhook
            </div>
          </Link>
          <Link href="/settings">
            <div className="text-center px-2 py-1 text-sm max-[500px]:text-[13px] rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium border border-gray-300 dark:border-gray-600 transition">
              ⚙️ Settings
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-sm max-[500px]:text-[13px] text-gray-600 dark:text-gray-400">
          ⚡ Functional REST API via Gemini & OpenAI SDK · <span className="text-amber-600 dark:text-amber-400 font-medium">Webhook support coming soon</span>
        </div>
      </div>
    </div>
  );
}
