import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSocket } from './Websocket';

const Chat: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();  // Get the recipient's userId from the URL
  const [newMessage, setNewMessage] = useState('');
  const token = localStorage.getItem('token');  // Get the token from localStorage

  const { messages, sendMessage } = useWebSocket(token!);

  const handleSendMessage = () => {
    if (newMessage.trim() && userId) {
      sendMessage(userId, newMessage);  // Send the message to the specific recipient
      setNewMessage('');  // Clear the input field after sending
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-blue-500 p-4 text-white flex justify-between items-center">
        <h2 className="text-lg font-bold">Chat with User {userId}</h2>
        <button
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          onClick={() => {
            localStorage.removeItem('token');  // Log out the user
            window.location.href = '/';
          }}
        >
          Logout
        </button>
      </div>

      {/* Message Display Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 p-2 rounded ${
              msg.senderId === userId ? 'bg-green-100 self-end' : 'bg-blue-100'
            }`}
          >
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 flex items-center">
        <input
          type="text"
          className="border p-2 rounded flex-1 mr-2"
          placeholder="Type your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
