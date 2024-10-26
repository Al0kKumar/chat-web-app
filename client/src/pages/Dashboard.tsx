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

  const fetchChats = async (searchTerm: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/v1/getchats', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { search: searchTerm } // Send search term
      });
      setChats(response.data);
      setFilteredChats(response.data); // Initially show all chats
      console.log('Fetched chats:', response.data); // Log fetched chats for debugging
    } catch (error) {
      console.error('Error fetching chats:', error);
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchChats(''); // Fetch all chats on initial load
  }, []);

  useEffect(() => {
    if (search.trim()) {
      fetchChats(search); // Fetch chats based on the search input
    } else {
      fetchChats(''); // Fetch all chats if search is empty
    }
  }, [search]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleChatClick = (chatId: number) => {
    navigate(`/chats/?${chatId}`);
  };

  return (
    <div className="dashboard">
      <SearchBar value={search} onChange={handleSearchChange} placeholder="Search by phone number" />

      <div className="chat-list">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div key={chat.userid} className="chat-item" onClick={() => handleChatClick(chat.userid)}>
              <div>{chat.userName} </div>
              <div>{chat.lastMessage ? chat.lastMessage : 'No messages'}</div>
            </div>
          ))
        ) : (
          <div>No chats found.</div> // Message if no chats are found
        )}
      </div>
    </div>
  );
};

export default Dashboard;
