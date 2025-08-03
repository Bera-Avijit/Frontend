import React, { useEffect, useState } from "react";
import "./App.css";
import { generateSessionId } from "./Services/GenerateSessionId";
import Sidebar from "./Components/Sidebar";
import ChatWindow from "./Components/ChatWindow";

function App() {
  // Load from localStorage during initial render
  const [chatList, setChatList] = useState(() => {
    const stored = localStorage.getItem("chatList");
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedChat, setSelectedChat] = useState(() => {
    const stored = localStorage.getItem("selectedChat");
    return stored ? JSON.parse(stored) : null;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : false;
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebarCollapsed");
    return stored ? JSON.parse(stored) : false;
  });

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleTheme = () => setDarkMode(!darkMode);

  // Sync to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("chatList", JSON.stringify(chatList));
  }, [chatList]);

  useEffect(() => {
    localStorage.setItem("selectedChat", JSON.stringify(selectedChat));
  }, [selectedChat]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Handle creating a new chat
  const handleNewChat = () => {
    const newSessionId = generateSessionId();

    let nextNumber = 1;

    if (chatList.length > 0) {
      const topTitle = chatList[0].title;
      const parts = topTitle.split(" ");
      if (parts.length === 2 && !isNaN(parts[1])) {
        // isNan internally use parseInt to convert string to number
        const currentNumber = parseInt(parts[1]);
        nextNumber = currentNumber + 1;
      }
    }

    const newChat = {
      title: `Chat ${nextNumber}`,
      sessionId: newSessionId,
    };

    setChatList([newChat, ...chatList]);
    setSelectedChat(newChat);
  };

  // Handle deleting a chat
  const handleDeleteChat = (sessionId) => {
    const updatedList = chatList.filter((chat) => chat.sessionId !== sessionId);
    setChatList(updatedList);
    if (selectedChat?.sessionId === sessionId) {
      setSelectedChat(null);
    }
  };

  // Handle selecting a chat
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div
      className={`app-container ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <Sidebar
        chatList={chatList}
        selectedChat={selectedChat}
        handleNewChat={handleNewChat}
        handleDeleteChat={handleDeleteChat}
        handleSelectChat={handleSelectChat}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />
      <ChatWindow
        selectedChat={selectedChat}
        darkMode={darkMode}
        sidebarCollapsed={sidebarCollapsed}
        chatList={chatList}
        setChatList={setChatList}
        setSelectedChat={setSelectedChat}
      />
    </div>
  );
}

export default App;
