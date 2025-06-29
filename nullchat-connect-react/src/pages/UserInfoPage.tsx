import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const UserInfoPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { username, phoneNumber } = state || {};

  const getInitials = () => {
    if (username) {
      return username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
    return phoneNumber?.slice(-2) || 'NA';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white px-6 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <ArrowLeft className="text-white h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold ml-4">User Info</h1>
      </div>

      {/* User Card */}
      <div className="max-w-md mx-auto bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-md text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-3xl font-bold">
          {getInitials()}
        </div>
        <h2 className="mt-4 text-2xl font-semibold">{username || 'Unknown User'}</h2>
         {phoneNumber ? (
          <p className="mt-2 text-lg text-purple-200 flex items-center justify-center space-x-2">
            <span className="bg-white/10 text-purple-300 px-2 py-0.5 rounded-full text-sm font-medium tracking-wide">
              +91
            </span>
            <span className="text-white tracking-wide font-mono">{phoneNumber}</span>
          </p>
        ) : (
          <p className="text-purple-300 mt-2">No Number</p>
        )}
      </div>
    </div>
  );
};

// it works until 

export default UserInfoPage;
