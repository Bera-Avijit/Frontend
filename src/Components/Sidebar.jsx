import React from "react";
import "./Sidebar.css";
import { FaMoon, FaSun, FaTrash, FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

function Sidebar({
  chatList,
  selectedChat,
  handleNewChat,
  handleDeleteChat,
  handleSelectChat,
  darkMode,
  toggleTheme,
  sidebarCollapsed,
  toggleSidebar,
}) {
  const themeClass = darkMode ? "dark" : "light";

  return (
    <div
      className={`sidebar ${themeClass} ${sidebarCollapsed ? "collapsed" : ""}`}
    >
      <div className="sidebar-header mb-2">
        {!sidebarCollapsed && (
          <h2 className="sidebar-title">
            <span className={`logo-text ${darkMode ? "dark" : "light"}`}>
              ιη𝔣ιηᦠ
            </span>
          </h2>
        )}
        <button className="toggle-btn" onClick={toggleSidebar}>
          {sidebarCollapsed ? <FaBars /> : <IoMdClose />}
        </button>
      </div>

      {!sidebarCollapsed && (
        <div className="sidebar-content">
          <button className="new-chat-btn" onClick={handleNewChat}>
            + New Chat
          </button>

          <div className="chat-history-title">
            <span>Chat History</span>
            <hr />
          </div>

          <div className="chat-list">
            {chatList.map((chat) => (
              <div
                key={chat.sessionId}
                className={`chat-item ${
                  selectedChat?.sessionId === chat.sessionId ? "active" : ""
                }`}
                onClick={() => handleSelectChat(chat)}
              >
                <span>{chat.title}</span>
                <FaTrash
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.sessionId);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {!sidebarCollapsed && (
        <div className="theme-toggle">
          <button className="theme-btn" onClick={toggleTheme}>
            {darkMode ? <FaSun /> : <FaMoon />}
            <span>{darkMode ? " Light Mode" : " Dark Mode"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
