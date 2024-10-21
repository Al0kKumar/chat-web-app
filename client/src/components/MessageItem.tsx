// MessageItem.tsx
import React from 'react';

interface MessageItemProps {
  message: string;
  isSender: boolean; // True if the message is sent by the user, otherwise false
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isSender }) => {
  return (
    <div
      className={`p-2 m-2 rounded-lg ${isSender ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}
    >
      {message}
    </div>
  );
};

export default MessageItem;
