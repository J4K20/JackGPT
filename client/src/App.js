import "./App.css";
import ReactMarkdown from "react-markdown";
import SettingsModal from "./components/SettingsModal.jsx";
import { useState, useEffect } from "react";

function App() {
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("conversations");
    return saved ? JSON.parse(saved) : {};
  });
  const [showSidebar, setShowSidebar] = useState(() => {
    const saved = localStorage.getItem("settings");
    return saved ? (JSON.parse(saved).showSidebar ?? true) : true;
  });
  const [showUserMessages, setShowUserMessages] = useState(() => {
    const saved = localStorage.getItem("settings");
    return saved ? (JSON.parse(saved).showUserMessages ?? true) : true;
  });
  const [showSendButton, setShowSendButton] = useState(() => {
    const saved = localStorage.getItem("settings");
    return saved ? (JSON.parse(saved).showSendButton ?? true) : true;
  });
  const [lightMode, setLightMode] = useState(() => {
    const saved = localStorage.getItem("settings");
    return saved ? (JSON.parse(saved).lightMode ?? true) : false;
  });

  const messages = conversations[currentId]?.messages || [];

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    const saved = localStorage.getItem("conversations");
    if (saved) {
      const parsed = JSON.parse(saved);
      setConversations(parsed);
      const ids = Object.keys(parsed);
      if (ids.length) setCurrentId(ids[ids.length - 1]);
    } else {
      setCurrentId(0);
    }
  }, []);

  const openSettingsModal = () => setSettingsOpen(true);
  const closeSettingsModal = () => setSettingsOpen(false);

  const addMessage = (msg, id = currentId) => {
    setConversations((prev) => ({
      ...prev,
      [id]: { ...prev[id], messages: [...(prev[id]?.messages || []), msg] },
    }));
  };

  const sendMessage = async (messages, currentId) => {
    const res = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    const data = await res.json();
    addMessage({ role: "assistant", content: data.text }, currentId);
  };

  const generateName = async (firstMessage, id) => {
    const response = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `Generate a 3-4 word title for a conversation starting with this message: ${firstMessage}. Respond with only the title. No punctuation, no emojis, no markdown.`,
          },
        ],
      }),
    });
    const data = await response.json();
    setConversations((prev) => ({
      ...prev,
      [id]: { ...prev[id], name: data.text.trim() },
    }));
  };

  const handleClick = () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    if (!currentId) {
      const id = new Date().toISOString().replace(/[:.]/g, "-");
      setConversations((prev) => ({
        ...prev,
        [id]: { name: "...", messages: [userMessage] },
      }));
      setCurrentId(id);
      sendMessage([userMessage], id);
      generateName(input, id);
      setInput("");
    } else {
      const updatedMessages = [...messages, userMessage];
      addMessage(userMessage, currentId);
      sendMessage(updatedMessages, currentId);
      setInput("");
    }
  };

  const saveSettings = () => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        showUserMessages,
        showSidebar,
        showSendButton,
        lightMode,
      }),
    );
    closeSettingsModal();
  };

  const exportConversation = () => {
    const conversation = conversations[currentId];
    const blob = new Blob([JSON.stringify(conversation, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${conversation.name || "conversation"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConversation = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!imported.name || !imported.messages)
          throw new Error("Invalid format");
        const id = new Date().toISOString().replace(/[:.]/g, "-");
        setConversations((prev) => ({ ...prev, [id]: imported }));
        setCurrentId(id);
      } catch {
        alert("Invalid conversation file.");
      }
    };
    reader.readAsText(file);
  };

  const deleteConversation = () => {
    const updated = { ...conversations };
    delete updated[currentId];
    setConversations(updated);
    setCurrentId(null);
  };

  const renameConversation = (id, name) => {
    setConversations((prev) => ({
      ...prev,
      [id]: { ...prev[id], name },
    }));
    setEditingId(null);
  };

  return (
    <div className={`App ${lightMode ? "light" : ""}`}>
      <span className="blob-container">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </span>

      <header>
        <button
          className="round-button settings-button"
          onClick={openSettingsModal}
        >
          <i className="fa-solid fa-gear"></i>
        </button>
        <h1>JackGPT</h1>
      </header>

      <div className="page">
        <div className={`sidebar ${!showSidebar ? "hidden" : ""}`}>
          <button
            onClick={() => setCurrentId(null)}
            className={`wide-button ${!currentId ? "active-chat" : ""}`}
          >
            New Chat
          </button>
          <hr />
          {Object.entries(conversations).map(([id, conversation]) => (
            <div
              key={id}
              className={`past-chat ${currentId === id ? "active-chat" : ""}`}
              onClick={() => setCurrentId(id)}
            >
              {editingId === id ? (
                <input
                  autoFocus
                  className="rename-input"
                  defaultValue={conversation.name}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={(e) => renameConversation(id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      renameConversation(id, e.target.value);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <>
                  <span className="chat-name">{conversation.name}</span>
                  <i
                    className="fa-solid fa-pen chat-rename-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(id);
                    }}
                  />
                </>
              )}
            </div>
          ))}
        </div>

        <div className="main-content">
          <div className="content-header">
            <button
              className="round-button delete-button"
              onClick={deleteConversation}
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
            <button
              className="round-button download-button"
              onClick={exportConversation}
            >
              <i className="fa-solid fa-download"></i>
            </button>
          </div>

          <div className="message-box" key={currentId}>
            <div className={`import-div ${currentId === null ? "" : "hidden"}`}>
              <input
                type="file"
                id="import-input"
                accept=".json"
                style={{ display: "none" }}
                onChange={importConversation}
              />
              <p>
                Start a conversation or{" "}
                <span
                  className="import-link"
                  onClick={() =>
                    document.getElementById("import-input").click()
                  }
                >
                  import one
                </span>
              </p>
            </div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`message ${m.role} ${!showUserMessages && m.role === "user" ? "hidden" : ""}`}
              >
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            ))}
          </div>

          <div className="text-div">
            <input
              type="text"
              className="message-input"
              placeholder="Ask anything"
              value={input}
              onKeyDown={(e) => e.key === "Enter" && handleClick()}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className={`send-button wide-button ${!showSendButton ? "hidden" : ""}`}
              onClick={handleClick}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <SettingsModal
        settingsOpen={settingsOpen}
        onClose={closeSettingsModal}
        handleSubmit={saveSettings}
        showUserMessages={showUserMessages}
        setShowUserMessages={setShowUserMessages}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        showSendButton={showSendButton}
        setShowSendButton={setShowSendButton}
        lightMode={lightMode}
        setLightMode={setLightMode}
      />
    </div>
  );
}

export default App;
