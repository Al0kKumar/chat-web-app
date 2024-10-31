// ChatHeader.tsx
import React from 'react';
import { FiArrowLeft } from 'react-icons/fi'; // Import a back arrow icon from react-icons

interface HeaderProps {
    name: string;
    onBack?: () => void; // Optional back button handler
}

const ChatHeader: React.FC<HeaderProps> = ({ name, onBack }) => {
    return (
        <div className="flex items-center bg-gray-800 p-4 shadow-md">
            {onBack && ( // Show back button only if onBack function is provided
                <button onClick={onBack} className="text-gray-400 hover:text-white transition duration-200 mr-4">
                    <FiArrowLeft className="w-6 h-6" />
                </button>
            )}
            <h2 className="text-xl font-semibold text-white">{name}</h2>
        </div>
    );
};

export default ChatHeader;
