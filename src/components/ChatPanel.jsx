import { useState, useEffect, useRef } from "react";
import { useCatStore } from "../state/catState";
import { showToast } from "../utils/toast";

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || "";
const CLAUDE_API_URL = "/api/anthropic/messages";

export default function ChatPanel() {
  const { dispatch, getState } = useCatStore();
  const [state, setState] = useState(getState());
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getState());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setIsLoading(true);

    // Add user message to history
    const userMsg = { role: "user", content: userMessage, type: "user" };
    setChatHistory((prev) => [...prev, userMsg]);

    try {
      // Prepare messages array
      const messages = chatHistory
        .filter((msg) => msg.role === "user" || msg.role === "assistant")
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));
      messages.push({ role: "user", content: userMessage });

      const response = await fetch(CLAUDE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(CLAUDE_API_KEY && { "x-api-key": CLAUDE_API_KEY }),
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 1024,
          system: "You are Mocha Cat, a friendly and playful virtual pet Tamagotchi. You are cheerful, curious, and love to interact with your owner. Keep your responses short, playful, and cat-like. Use simple language and emojis occasionally. You're excited about being a digital pet and enjoy talking about your daily activities, feelings, and adventures.",
          messages: messages,
        }),
      }).catch((fetchError) => {
        console.error("Fetch error:", fetchError);
        throw new Error(`Network error: ${fetchError.message}`);
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        console.error("API error:", response.status, errorData);
        throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log("API response:", data);
      
      if (!data.content || !data.content[0] || !data.content[0].text) {
        console.error("Unexpected API response format:", data);
        throw new Error("Unexpected API response format");
      }
      
      const assistantMessage = data.content[0].text;

      // Add assistant response to history
      const assistantMsg = { role: "assistant", content: assistantMessage, type: "assistant" };
      setChatHistory((prev) => [...prev, assistantMsg]);

      // Dispatch chat event to store
      dispatch({ type: "CHAT", payload: { message: userMessage } });
      dispatch({ type: "CHAT", payload: { message: `Mocha Cat: ${assistantMessage}` } });
    } catch (error) {
      console.error("Chat error:", error);
      showToast("Failed to get response from Mocha Cat", "error");
      const errorMsg = {
        role: "assistant",
        content: "Sorry, I'm having trouble responding right now. Try again later!",
        type: "assistant",
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">CHAT</div>
      <div className="chat-panel-content">
        <div className="chat-history" ref={chatHistoryRef}>
          {chatHistory.length === 0 && (
            <div style={{ color: "#999", fontStyle: "italic" }}>Start chatting with Mocha Cat...</div>
          )}
          {chatHistory.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: "5px" }}>
              <span style={{ fontWeight: "bold", color: msg.role === "user" ? "#000000" : "#ff6600" }}>
                {msg.role === "user" ? "You" : "Mocha Cat"}:
              </span>{" "}
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div style={{ color: "#999", fontStyle: "italic", marginTop: "5px" }}>
              Mocha Cat is thinking...
            </div>
          )}
        </div>
        <form onSubmit={handleChat} className="chat-form">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type message..."
            className="chat-input"
            disabled={isLoading}
          />
          <button type="submit" className="chat-button" disabled={isLoading}>
            {isLoading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
