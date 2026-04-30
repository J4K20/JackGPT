---
marp: true
---

# JackGPT User Manual

## Prerequisites

Before running JackGPT you will need the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher)
- An OpenAI API key

---

## Getting an OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Click your profile icon in the top right and select **API Keys**
4. Click **Create new secret key**
5. Copy the key — you won't be able to see it again after closing the dialog

Note: OpenAI API usage is not free. You will need to add a payment method and maintain a positive credit balance. For casual use, a few dollars of credit will last a long time.

---

## Installation

1. Clone or download the repository

```bash
git clone https://github.com/J4K20/JackGPT.git
cd jackgpt
```

2. Install dependencies

```bash
npm install
npm install --prefix client
```

3. Create a `.env` file in the root of the project

```bash
touch .env
```

4. Open `.env` and add your API key

```
OPENAI_API_KEY=your-api-key-here
```

---

## Running the App

```bash
npm start
```

This starts both the backend server on port `3001` and the React frontend on port `3000`. Your browser should open automatically. If it doesn't, navigate to `http://localhost:3000`.

---

## Using JackGPT

### Starting a Conversation

Type your message in the input bar at the bottom of the screen and press **Enter** or click **Send**. A new conversation will be created automatically and given a generated title based on your first message.

---

### Managing Conversations

- **New Chat** — click the New Chat button in the sidebar to start a fresh conversation
- **Switch conversations** — click any conversation in the sidebar to open it

---

### Managing Conversations

- **Rename** — hover over a conversation in the sidebar and click the pencil icon to rename it
- **Delete** — click the trash icon in the top left of the chat area to delete the current conversation

---

### Importing and Exporting

- **Export** — click the download icon in the top right of the chat area to save the current conversation as a `.json` file
- **Import** — on the empty chat screen, click **import one** to load a previously exported `.json` file

---

### Settings

Click the gear icon in the top left to open the settings panel. The following options are available:

| Setting       | Description                                        |
| ------------- | -------------------------------------------------- |
| User Messages | Toggle visibility of your own messages in the chat |
| Sidebar       | Toggle visibility of the conversation sidebar      |
| Send Button   | Toggle visibility of the Send button               |
| Light Mode    | Switch between dark and light themes               |

Click **Save** to apply and persist your settings.
