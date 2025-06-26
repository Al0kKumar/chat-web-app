

import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MessageSquare,
  Loader2,
  MoreVertical,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePhoneSearch } from '@/hooks/usePhoneSearch';

// Placeholder for now
const conversations: any[] = []; // Replace with real backend data

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { searchResults, isSearching, searchByPhone, clearSearch } = usePhoneSearch();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const isPhone = /^\+?\d+$/.test(searchQuery.trim());
      if (searchQuery.trim() && isPhone) {
        searchByPhone(searchQuery.trim());
      } else {
        clearSearch();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchByPhone, clearSearch]);

  const handleClick = (id: string) => navigate(`/chat/${id}`);

  const displayConversations = useMemo(() => {
    return searchQuery.trim() ? searchResults : conversations;
  }, [searchQuery, searchResults]);

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <div className="w-full md:w-96 flex flex-col border-r border-white/10">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-purple-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Nullchat</h1>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300 animate-spin" />
            )}
            <Input
              placeholder="Search by phone or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:bg-white/15"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {displayConversations.length > 0 ? (
            displayConversations.map((conversation: any) => (
              <div
                key={conversation.id}
                onClick={() => handleClick(conversation.id)}
                className="p-4 border-b border-white/5 cursor-pointer transition-all duration-200 hover:bg-white/10"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                        {conversation.name
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white truncate">
                        {conversation.name || conversation.phone}
                      </h3>
                      {conversation.lastMessageTime && (
                        <span className="text-xs text-purple-300">
                          {conversation.lastMessageTime}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage ? (
                      <p className="text-sm text-purple-200 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                    ) : (
                      <p className="text-sm text-purple-500 italic mt-1">No messages yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-purple-400 mt-10">
              {searchQuery ? 'No users found.' : 'No conversations yet.'}
            </div>
          )}
        </div>
      </div>

      {/* Fallback chat panel for larger screens */}
      <div className="hidden md:flex flex-1 items-center justify-center text-purple-300 text-xl">
        Select a chat to start messaging
      </div>
    </div>
  );
};

export default Dashboard;
