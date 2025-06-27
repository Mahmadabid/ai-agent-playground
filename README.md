
# AI Agent Playground: A Gemini-Based LocalStorage Interaction Demo (via OpenAI SDK)

This is a **Next.js + TypeScript** demo project that showcases how to use **Gemini via the OpenAI SDK** (using the Chat Completion API) to interact with client-side `localStorage`. It's a proof-of-concept for building stateful, AI-driven user experiences using REST APIs — with **webhook support coming soon**. The full chat history is passed to the AI on each request, enabling context-aware, multi-turn conversations.

---

## 🧠 Powered By

- **OpenAI SDK** – Used to structure agent logic and function calling
- **Gemini API** – The actual LLM backend powering responses
- **atomHooks** – Lightweight state management for syncing localStorage with UI
- **Next.js (TypeScript)** – Frontend + API architecture

---

## ✨ Key Features

- **Gemini Agent via REST API**  
  User input is sent to a REST endpoint where a Gemini-based agent responds using structured function calls.
- **Tool Calling Support**  
  The agent can invoke:
    - `getLocalStorage(key)`
    - `setLocalStorage(key, value)`
    - `continueConversation()`
- **Multi-Step Reasoning**  
  The AI can chain operations and use conditionals based on previously retrieved values.
- **Reactive UI with atomHooks**  
  Client-side state changes reflect immediately using reactive localStorage bindings.
- **Webhook Support (Coming Soon)**  
  Webhooks will allow external triggers to invoke agent actions in future iterations.

---

## 📁 Supported Keys

- `calculation` (number)
- `flag` (boolean)
- `note` (string)
- `theme` ("light" | "dark")

---

## 🚀 Quick Start

1. `npm install`
2. `npm run dev`
3. Go to `http://localhost:3000`
4. Enter your Gemini API key in Settings
5. Start interacting via the REST interface

---

This project is intended as a reference for developers building AI agents that manipulate client-side browser state using modern LLMs through the OpenAI SDK.
