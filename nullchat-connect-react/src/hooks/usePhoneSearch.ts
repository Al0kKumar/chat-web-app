
import { useState } from 'react';

interface SearchResult {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  isOnline: boolean;
  hasExistingChat: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export const usePhoneSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchByPhone = async (phoneNumber: string) => {
    if (!phoneNumber.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // Mock API call - replace with your actual endpoint
      const response = await fetch(`/api/search-users?phone=${encodeURIComponent(phoneNumber)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const results = await response.json();
      
      // Mock data for demonstration - replace with actual API response
      const mockResults: SearchResult[] = [
        {
          id: 'search-1',
          name: 'Alice Smith',
          phone: phoneNumber,
          isOnline: true,
          hasExistingChat: false,
          unreadCount: 0
        },
        {
          id: 'search-2', 
          name: 'Bob Wilson',
          phone: phoneNumber,
          isOnline: false,
          hasExistingChat: true,
          lastMessage: 'Hey, how are you?',
          lastMessageTime: '2 days',
          unreadCount: 1
        }
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
  };

  return {
    searchResults,
    isSearching,
    searchByPhone,
    clearSearch
  };
};
