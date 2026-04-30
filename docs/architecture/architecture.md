---
marp: true
---

# JackGPT

## Design & Architecture Document

---

## Tech Stack

| Layer     | Technology                  |
| --------- | --------------------------- |
| Frontend  | React                       |
| Rendering | react-markdown              |
| Backend   | Node.js, Express            |
| AI        | OpenAI API (GPT-4.1)        |
| Testing   | Jest, Supertest, Playwright |
| Storage   | localStorage                |

---

## Project Structure

```
jackgpt/
├── client/
│   └── src/
│       ├── components/
│       │   └── SettingsModal.jsx
│       ├── App.js
│       └── App.css
├── server/
│   ├── server.js
│   ├── openai.js
│   └── tests/
│       ├── openai.test.js
│       └── server.test.js
├── tests/
│   └── app.e2e.test.js
└── package.json
```

---

## System Architecture

```
┌─────────────────────────────────────────┐
│           React Frontend                │
│  App.js → SettingsModal.jsx             │
│  App.js → OpenAI API (via server)       │
└────────────┬────────────────────────────┘
             │ HTTP POST /api/chat
┌────────────┴────────────────────────────┐
│           server.js                     │
│   Node.js Express Server                │
│          │                              │
│        OpenAI API (GPT-4.1)             │
└─────────────────────────────────────────┘
```

---

## Message Flow

1. User types input → `handleClick()`
2. User message added to conversation state and localStorage
3. `sendMessage()` POSTs `{ messages }` to `/api/chat`
4. Server calls OpenAI API with message history
5. Response returned as `{ text }`
6. Assistant message added to conversation state

---

## Data Models

**Message**

```js
{
  (role, content);
}
```

**Conversation**

```js
{ name, messages[] }
```

**localStorage keys**

- `conversations` — all conversation objects keyed by timestamp ID
- `settings` — user preferences object

---

## Key Design Decisions

- **localStorage over sessionStorage** — conversations and settings survive page refreshes and restarts
- **Client owns history** — full message history sent with every request, server is stateless
- **HTTP over WebSockets** — simpler implementation without streaming requirement
- **Lazy conversation creation** — conversations are not created until the first message is sent
- **Generated conversation names** — first message is sent to OpenAI to generate a short title

---

## Component Responsibilities

| Component           | Responsibility                                              |
| ------------------- | ----------------------------------------------------------- |
| `App.js`            | All app state, conversation management, API calls, settings |
| `SettingsModal.jsx` | Purely presentational settings UI, no state                 |
| `server.js`         | Receives messages, forwards to OpenAI, returns response     |
| `openai.js`         | OpenAI client wrapper                                       |

---

## Testing Strategy

| Layer       | Tool             | Purpose                                                   |
| ----------- | ---------------- | --------------------------------------------------------- |
| Unit        | Jest             | Tests `callOpenAI` in isolation with mocked OpenAI client |
| Integration | Jest + Supertest | Tests Express `/api/chat` route with mocked dependencies  |
| Acceptance  | Playwright       | Tests complete user stories end to end in the browser     |

---

## Settings and Customization

Users can toggle the following UI elements via the settings modal:

| Setting       | Effect                               |
| ------------- | ------------------------------------ |
| Sidebar       | Show/hide the conversation sidebar   |
| Send Button   | Show/hide the send button            |
| User Messages | Show/hide user messages in the chat  |
| Light Mode    | Toggle between dark and light themes |

Settings are persisted to localStorage and loaded on startup.
