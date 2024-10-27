// MessageInput.tsx
import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void; // Callback function to send message
  //onTyping: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim()) {
          onSend(inputValue);
          setInputValue(""); // Clear the input field after sending
      }
  };

  return (
    <form onSubmit={handleSubmit} className="flex p-4 bg-white border-t">
    <input
        type="text"
        className="flex-1 p-2 border rounded-full border-gray-300"
        placeholder="Type a message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
    />
    <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full">
        Send
    </button>
</form>
  );
};

export default MessageInput;
