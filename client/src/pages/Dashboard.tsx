// Dashboard.tsx
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ChatList from '../components/ChatList';

const Dashboard: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  // Sample chat data
  const chats = [
    { username: 'Alice', message: 'Hey there!', timestamp: '10:00 AM' },
    { username: 'Bob', message: 'How are you?', timestamp: '9:30 AM' },
    { username: 'Charlie', message: 'Let’s meet up!', timestamp: 'Yesterday' },
    { username: 'David', message: 'What’s up?', timestamp: '2:00 PM' },
    { username: 'Eve', message: 'Let’s grab lunch.', timestamp: '11:30 AM' },
  ];

  // Filter chats based on the search value
  const filteredChats = chats.filter((chat) =>
    chat.username.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <SearchBar value={searchValue} onChange={setSearchValue} />
      <div className="flex-1 overflow-y-auto">
        <ChatList chats={filteredChats} />
      </div>
    </div>
  );
};

export default Dashboard;

