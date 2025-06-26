import { useState } from 'react';
import API from '@/api'; 

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
    const trimmed = phoneNumber.trim();
    if (!trimmed || !/^\+?\d+$/.test(trimmed)) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const res = await API.get('/api/v1/search', {
        params: { phone: trimmed },
      });

      const data = res.data;

      const results: SearchResult[] = Array.isArray(data)
        ? data.map((user: any) => ({
            id: user.id,
            name: user.name || user.phone,
            phone: user.phone,
            avatar: user.avatar || '',
            isOnline: !!user.isOnline,
            hasExistingChat: !!user.hasExistingChat,
            lastMessage: user.lastMessage || '',
            lastMessageTime: user.lastMessageTime || '',
            unreadCount: user.unreadCount || 0,
          }))
        : [];

      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => setSearchResults([]);

  return {
    searchResults,
    isSearching,
    searchByPhone,
    clearSearch,
  };
};
