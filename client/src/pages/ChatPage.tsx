// ChatApp.tsx
import React, { useEffect, useState } from 'react';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';

interface Chat {
  username: string;
  message: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [chats, setChats] = useState<Chat[]>([
    
    // Example initial chats
    { username: 'User1', message: 'Hello!', timestamp: '2024-10-21T10:00:00Z' },
    { username: 'User2', message: 'Hi there!', timestamp: '2024-10-21T10:01:00Z' },
  ]);
  const [currentReceiver, setCurrentReceiver] = useState<string | null>(null);

  // Establish WebSocket connection
  useEffect(() => {
    const newSocket = new WebSocket(`ws://localhost:8080?token=${yourJWTToken}`);

    newSocket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    newSocket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      // Here, handle the incoming message data
      console.log("Incoming message:", messageData);
      // Update chats based on received message
      // You need to handle adding this message to the correct chat conversation
    };

    newSocket.onclose = (event) => {
      console.log('WebSocket connection closed: ', event);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close(); // Cleanup on unmount
    };
  }, []);

  const handleChatSelect = (username: string) => {
    setCurrentReceiver(username); // Set the receiver for the chat window
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r border-gray-300">
        <ChatList chats={chats} onChatSelect={handleChatSelect} />
      </div>
      <div className="flex-1">
        {currentReceiver ? (
          <ChatWindow username="YourUsername" receiver={currentReceiver} socket={socket} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
