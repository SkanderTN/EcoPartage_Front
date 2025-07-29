// src/components/Chat.jsx
import React, { useState, useEffect } from "react";
import socket from "../socket";

function Chat({ senderId, receiverId }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const msg = {
      senderId,
      receiverId,
      content: message,
    };

    socket.emit("sendMessage", msg);
    setChat((prev) => [...prev, msg]);
    setMessage("");
  };

  return (
    <div>
      <div>
        {chat.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId === senderId ? "Moi" : "Lui"}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tape ton message..."
      />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
}

export default Chat;
