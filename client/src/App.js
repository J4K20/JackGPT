import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("conversations");
    return saved ? JSON.parse(saved) : {};
  });
  const [currentId, setCurrentId] = useState(null);

  const sendMessage = async (messages) => {
    const res = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    const data = await res.json();
    addMessage({ role: "assistant", content: data.text }, currentId);
  };

  const createConversation = () => {
    const id = new Date().toISOString().replace(/[:.]/g, "-");
    setConversations((prev) => ({
      ...prev,
      [id]: [],
    }));
    setCurrentId(id);
  };

  const addMessage = (msg, id = currentId) => {
    setConversations((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), msg],
    }));
  };

  const messages = conversations[currentId] || [];

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    const saved = localStorage.getItem("conversations");

    if (saved) {
      const parsed = JSON.parse(saved);
      setConversations(parsed);

      const ids = Object.keys(parsed);
      if (ids.length) setCurrentId(ids[ids.length - 1]); // open latest
    } else {
      createConversation(); // first ever load
    }
  }, []);

  const handleClick = () => {
    if (!input || !currentId) return;
    const updatedMessages = [...messages, { role: "user", content: input }];
    addMessage({ role: "user", content: input }, currentId);
    sendMessage(updatedMessages);
    setInput("");
  };

  return (
    <div className="App">
      <div>
        <header>
          <h1>JackGPT</h1>
        </header>
      </div>
      <div className="page">
        <div className="sidebar">
          <button onClick={createConversation}>New Chat</button>

          {Object.keys(conversations).map((id) => (
            <button key={id} onClick={() => setCurrentId(id)}>
              {id}
            </button>
          ))}
        </div>
        <div className="main-content">
          <div className="message-box">
            {messages.map((m, i) => (
              <p key={i} className={`message ${m.role}`}>
                {m.content}
              </p>
            ))}
          </div>
          <div className="text-div">
            <input
              type="text"
              placeholder="Write me a poem about..."
              value={input}
              onKeyDown={(e) => e.key === "Enter" && handleClick()}
              onChange={(e) => setInput(e.target.value)}
            ></input>
            {<button onClick={handleClick}>Send</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
