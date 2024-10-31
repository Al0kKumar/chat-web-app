// MessageInput.tsx
import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi'; // Import a send icon from react-icons

interface MessageInputProps {
    onSend: (message: string) => void; // Callback function to send message
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSend(inputValue);
            setInputValue(""); // Clear the input field after sending
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center p-3 bg-gray-800 border-t border-gray-700">
            <input
                type="text"
                className="flex-1 p-2 bg-gray-700 text-white placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button 
                type="submit" 
                className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200"
            >
                <FiSend className="w-5 h-5" /> {/* Send icon */}
            </button>
        </form>
    );
};

export default MessageInput;
