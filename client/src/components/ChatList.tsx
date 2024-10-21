// ChatList.tsx
import React from 'react';
import ChatItem from './Chatitem';

interface Chat {
  username: string;
  message: string;
  timestamp: string;
}

interface ChatListProps {
  chats: Chat[];
  onChatSelect: (username: string) => void; // Callback when a chat is selected
}

const ChatList: React.FC<ChatListProps> = ({ chats, onChatSelect }) => {
  return (
    <div className="flex flex-col">
      {chats.map((chat, index) => (
        <div key={index} onClick={() => onChatSelect(chat.username)}>
          <ChatItem
            username={chat.username}
            message={chat.message}
            timestamp={chat.timestamp}
          />
        </div>
      ))}
    </div>
  );
};

export default ChatList;
