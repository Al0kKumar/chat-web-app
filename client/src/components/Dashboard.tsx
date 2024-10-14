import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`http://localhost:8080/api/v1/search?phoneNumber=${searchQuery}`, {
      headers:{
        Authorization: `Bearer ${token}`
      }
      });
      setUsers(response.data);  // Assuming the API returns an array of users
    } catch (err: any) {
      setError('No user found with that phone number');
      console.error(err);
    }
  };

  const handleStartChat = (userId: string) => {
    // Navigate to the chat page with the recipient's userId as a parameter
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">Search Users</h2>

      <form onSubmit={handleSearch} className="w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Enter phone number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2 w-full">
          Search
        </button>
      </form>

      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Search Results */}
      <div className="w-full max-w-md">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-gray-100 mb-2 rounded flex justify-between items-center cursor-pointer"
            onClick={() => handleStartChat(user.id)}
          >
            <p>{user.phoneNumber}</p>
            <button className="bg-green-500 text-white p-2 rounded">
              Start Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
