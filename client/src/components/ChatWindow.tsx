import React, { useEffect, useRef, useState } from 'react';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';

interface Message {
  content: string;
  sender: string; // User who sent the message
}

interface ChatWindowProps {
  username: string; // Current user's username
  receiver: string; // Receiver's username
  socket: WebSocket; // WebSocket instance for real-time communication
}

const ChatWindow: React.FC<ChatWindowProps> = ({ username, receiver, socket }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Reference to scroll to the bottom of the chat

  const sendMessage = (message: string) => {
    
    const newMessage = { content: message, sender: username };
    setMessages((prev) => [...prev, newMessage]); // Update local messages
    socket.send(JSON.stringify(newMessage)); // Send message via WebSocket
  };

  // Effect to listen for incoming messages
  useEffect(() => {
    socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]); // Update messages with the new message
    };
  }, [socket]);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg, index) => (
          <MessageItem
            key={index}
            message={msg.content}
            isSender={msg.sender === username}
          />
        ))}
        <div ref={messagesEndRef} /> {/* Scroll reference */}
      </div>
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default ChatWindow;
