// Generate a unique session ID based on timestamp
export const generateSessionId = () => {
  return "session-" + Date.now();
};
