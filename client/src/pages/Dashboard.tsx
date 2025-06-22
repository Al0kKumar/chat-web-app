import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Chat {
  userid: number;
  userName: string;
  phoneNumber: string;
  lastMessage: string | null;
  lastMessageTime: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  
  const token = localStorage.getItem('token');

  // Fetch all chats on mount
  const fetchAllChats = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/getchats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setChats(response.data); // Store all chats
      setFilteredChats(response.data); // Show all chats initially
      console.log('Fetched all chats:', response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
      navigate('/login');
    }
  };

  // Fetch chats based on search input
  const fetchSearchedChats = async (searchTerm: string) => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/search', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { search: searchTerm }
      });
      setFilteredChats(response.data); // Show only searched chats
      console.log('Fetched searched chats:', response.data);
    } catch (error) {
      console.error('Error fetching searched chats:', error);
    }
  };

  useEffect(() => {
    fetchAllChats(); // Fetch all chats on initial load
  }, []);

  useEffect(() => {
    if (search.trim()) {
      fetchSearchedChats(search); // Fetch chats based on the search input
    } else {
      setFilteredChats(chats); // Show all chats if search is empty
    }
  }, [search, chats]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleChatClick = (chatId: number) => {
    navigate(`/chats/${chatId}`);
  };

  return (
    <div className="dashboard bg-gray-800 min-h-screen">
      <SearchBar value={search} onChange={handleSearchChange} placeholder="Search by phone number" />
  
      <div className="chat-list p-4 space-y-4 bg-gray-800 text-white rounded-sm shadow-lg">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div 
              key={chat.userid} 
              className="chat-item flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition duration-200 shadow-md"
              onClick={() => handleChatClick(chat.userid)}
            >
              {/* Profile Image Placeholder or Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4 text-white font-bold">
                {chat.userName[0].toUpperCase()} {/* First letter of username */}
              </div>
  
              {/* Chat Details */}
              <div className="flex-1">
                <div className="text-lg font-semibold">{chat.userName}</div>
                <div className="text-sm text-gray-300">
                  {chat.lastMessage ? chat.lastMessage : 'No messages yet'}
                </div>
              </div>
  
              {/* Optional: Display time or other details */}
              <div className="text-xs text-gray-400">
                {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                }) : ''}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No chats found.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
