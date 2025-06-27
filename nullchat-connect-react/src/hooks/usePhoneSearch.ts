import { useState } from 'react';
import API from '@/api';

interface SearchResult {
  id: string;
  userName: string;
  phoneNumber: string;
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
      console.warn('⚠️ Invalid phone number search input:', trimmed);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const token = localStorage.getItem('token');

    try {
      const res = await API.get('/search', {
        params: { phone: trimmed },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;
      console.log('📦 Raw /search response:', data);

      const results: SearchResult[] = Array.isArray(data)
        ? data.map((user: any) => {
            console.log('➡️ Mapping user:', user);
            return {
              id: user.id,
              userName: user.name || user.phone || 'Unknown',
              phoneNumber: user.phone || 'N/A',
              avatar: user.avatar || '',
              isOnline: !!user.isOnline,
              hasExistingChat: !!user.hasExistingChat,
              lastMessage: user.lastMessage || '',
              lastMessageTime: user.lastMessageTime || '',
              unreadCount: user.unreadCount || 0,
            };
          })
        : [];

      console.log('✅ Final mapped search results:', results);
      setSearchResults(results);
    } catch (err) {
      console.error('❌ Search error:', err);
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
