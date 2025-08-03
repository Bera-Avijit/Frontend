import React, { useEffect, useRef, useState } from "react";
import "./ChatWindow.css";
import { getChatHistory, sendMessageToAI } from "../Services/ChatService";
import ReactMarkdown from "react-markdown";
import { BsSendFill } from "react-icons/bs";

const ChatWindow = ({
  selectedChat,
  darkMode,
  sidebarCollapsed,
  chatList,
  setChatList,
  setSelectedChat,
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);

  // Fetch chat history when selectedChat changes
  useEffect(() => {
    if (selectedChat) {
      getChatHistory(selectedChat.sessionId).then((data) => {
        // Map backend fields to frontend format
        const mappedMessages = (data || []).map((msg) => ({
          content: msg.message,
          type: msg.sender, // "USER" or "AI"
        }));
        setMessages(mappedMessages);
      });
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate streaming response like ChatGPT
  const simulateStreamingAIResponse = (fullText) => {
    const words = fullText.split(" ");
    let index = 0;
    let currentText = "";

    const interval = setInterval(() => {
      if (index < words.length) {
        currentText += words[index] + " ";
        index++;

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];

          if (last && last.type === "AI") {
            last.content = currentText;
          } else {
            updated.push({ content: currentText, type: "AI" });
          }

          return [...updated];
        });
      } else {
        clearInterval(interval);
        setIsThinking(false);
      }
    }, 10); // 10ms per word
  };

  // Send user input and get AI reply
  const handleSend = async () => {
    if (!input.trim() || !selectedChat) return;

    const userMessage = {
      content: input,
      type: "USER",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const aiResponse = await sendMessageToAI(input, selectedChat.sessionId);
      simulateStreamingAIResponse(aiResponse); // Streaming simulation
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { content: "❌ Error fetching AI response.", type: "AI" },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  // Enter = send, Shift+Enter = newline
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`chat-window ${sidebarCollapsed ? "expanded" : ""} ${
        darkMode ? "dark" : "light"
      }`}
    >
      {selectedChat ? (
        <>
          <div className="messages-area">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-bubble ${
                  msg.type === "USER" ? "user" : "ai"
                }`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ))}
            {isThinking && <div className="message-bubble ai">Thinking...</div>}
            <div ref={chatEndRef} />
          </div>
          <div className="input-area">
            <textarea
              className="form-control"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
            />
            <button
              className="btn btn-primary send-btn"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <BsSendFill />
            </button>
          </div>
        </>
      ) : (
        <div className="welcome-msg">
          <h1>Welcome, User!</h1>
          <p>
            To start a conversation, click on <strong>“+ New Chat”</strong> or
            select from your existing chats.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
