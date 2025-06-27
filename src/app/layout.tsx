import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Agent Playground: Gemini-Based LocalStorage Demo",
  description:
    "A Next.js + TypeScript demo using Gemini via OpenAI SDK to interact with localStorage. Features REST API, tool calling, multi-step reasoning, and reactive UI with atomHooks.",
  keywords: [
    "Next.js",
    "TypeScript",
    "OpenAI SDK",
    "Gemini API",
    "localStorage",
    "atomHooks",
    "REST API",
    "AI agent",
    "webhooks",
    "state management",
    "chatbot",
    "function calling"
  ],
  authors: [{ name: "Muhammad Ahmad" }],
  openGraph: {
    title: "AI Agent Playground: Gemini-Based LocalStorage Demo",
    description:
      "A Next.js + TypeScript demo using Gemini via OpenAI SDK to interact with localStorage. Features REST API, tool calling, multi-step reasoning, and reactive UI with atomHooks.",
    url: "https://github.com/mahmadabid/ai-agent-playground",
    siteName: "AI Agent Playground",
    images: [
      {
        url: "/vercel.svg",
        width: 1200,
        height: 630,
        alt: "AI Agent Playground Logo"
      }
    ],
    locale: "en_US",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-100 dark:bg-gray-950 antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
