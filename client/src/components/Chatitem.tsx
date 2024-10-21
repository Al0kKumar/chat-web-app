// ChatItem.tsx
import React from 'react';

interface ChatItemProps {
  username: string;
  message: string;
  timestamp: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ username, message, timestamp }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer">
      <div className="flex flex-col">
        <span className="font-semibold">{username}</span>
        <span className="text-gray-600 text-sm">{message}</span>
      </div>
      <span className="text-gray-500 text-xs">{timestamp}</span>
    </div>
  );
};

export default ChatItem;
