import axios from "axios";

// Spring Boot backend base URL
const API_BASE_URL = "http://localhost:8080/api";

// Send message to Gemini AI backend
export const sendMessageToAI = async (question, chatSessionId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, {
      question,
      chatSessionId,
    });
    return response.data; // expected to return an AI message
  } catch (error) {
    console.error("Error sending message to AI:", error);
    throw error;
  }
};

// Get chat history for a session
export const getChatHistory = async (chatSessionId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/chat/history/${chatSessionId}`
    );
    return response.data; // expected to return a list of { message, type }
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};
