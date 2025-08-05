import React, { useState } from "react";
import axios from "axios";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;
  
    const newChat = [...chatHistory, { sender: "user", text: message }];
    setChatHistory(newChat);
  
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/chat", {
        params: { message },
      });
      
      console.log("Chatbot Response:", res.data);  // Debugging line
      setChatHistory([...newChat, { sender: "bot", text: res.data.response || "No response received" }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setChatHistory([...newChat, { sender: "bot", text: "Error: Unable to connect to chatbot" }]);
    }
  
    setMessage("");
  };  

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {chatHistory.map((msg, index) => (
          <div key={index} style={msg.sender === "user" ? styles.userMsg : styles.botMsg}>
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

// Inline CSS styles
const styles = {
  container: { width: "400px", margin: "20px auto", textAlign: "center" },
  chatBox: { height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", marginBottom: "10px" },
  userMsg: { textAlign: "right", background: "#d1e7dd", padding: "5px", borderRadius: "5px", margin: "5px 0" },
  botMsg: { textAlign: "left", background: "#f8d7da", padding: "5px", borderRadius: "5px", margin: "5px 0" },
  inputArea: { display: "flex" },
  input: { flex: 1, padding: "10px", border: "1px solid #ccc" },
  button: { padding: "10px", background: "#007bff", color: "#fff", border: "none", cursor: "pointer" },
};

export default Chatbot;
