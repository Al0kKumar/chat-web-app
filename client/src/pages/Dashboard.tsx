import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Chat {
  id: number;
  name: string;
  phoneNumber: string; // Assuming you have a phone number field
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/getchats');
        setChats(response.data);
        setFilteredChats(response.data); // Initially, show all chats
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const filtered = chats.filter(chat => 
      chat.phoneNumber.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [search, chats]);

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
        {filteredChats.map((chat) => (
          <div key={chat.id} className="chat-item" onClick={() => handleChatClick(chat.id)}>
            {chat.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;