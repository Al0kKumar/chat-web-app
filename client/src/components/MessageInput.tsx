// MessageInput.tsx
import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void; // Callback function to send message
  //onTyping: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() === '') return; // Prevent sending empty messages
    onSend(message);
    setMessage(''); // Clear input after sending
  };

  return (
    <div className="flex p-4 border-t border-gray-300 bg-white">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
      />
      <button
        onClick={handleSend}
        className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
