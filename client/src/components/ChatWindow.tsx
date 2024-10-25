// ChatPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Message {
  content: string;
  senderId: number;
  receiverId: number;
  timestamp: Date; // Optional if you want to display message time
}

interface ChatPageProps {
  contactUserId: number; 
  receiverName: string; 
}

const ChatPage: React.FC<ChatPageProps> = ({ contactUserId, receiverName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/v1/messages/${contactUserId}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [contactUserId]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    try {
      await axios.post('/api/v1/send-message', {
        content: inputValue,
        receiverId: contactUserId,
      });

      // Clear the input field and update messages
      setInputValue('');
      const response = await axios.get(`/api/v1/messages/${contactUserId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-page flex flex-col h-screen">
      {/* Top Bar */}
      <div className="top-bar bg-blue-600 text-white p-4">
        <h1>{receiverName}</h1>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === contactUserId ? 'received' : 'sent'}`}>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="input-container p-4 bg-gray-100">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} className="ml-2 bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
