import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { MessageSquare, Search, Send, Phone, MoreVertical, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ChatWindow from '@/components/ChatWindow';
import { usePhoneSearch } from '@/hooks/usePhoneSearch';

interface Conversation {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar?: string;
  isOnline: boolean;
}

interface Message {
  id: string;
  text: string;
  time: string;
  isOwn: boolean;
}

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isMobile] = useState(false); // For responsive design

  // Mock data for conversations
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'John Doe',
      phone: '+1234567890',
      lastMessage: 'Hey, how are you doing?',
      lastMessageTime: '2 min',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      phone: '+1234567891',
      lastMessage: 'See you tomorrow!',
      lastMessageTime: '1 hour',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      name: 'Mike Johnson',
      phone: '+1234567892',
      lastMessage: 'Thanks for the help',
      lastMessageTime: '3 hours',
      unreadCount: 1,
      isOnline: true
    }
  ];

  // Mock messages for selected conversation
  const messages: Message[] = [
    {
      id: '1',
      text: 'Hey there! How are you?',
      time: '10:30 AM',
      isOwn: false
    },
    {
      id: '2',
      text: 'I am good, thanks! How about you?',
      time: '10:32 AM',
      isOwn: true
    },
    {
      id: '3',
      text: 'Doing great! Working on the new Nullchat features',
      time: '10:33 AM',
      isOwn: false
    }
  ];

  const { searchResults, isSearching, searchByPhone, clearSearch } = usePhoneSearch();

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() && /^\+?\d+/.test(searchQuery)) {
        // Only search if query looks like a phone number
        searchByPhone(searchQuery);
      } else {
        clearSearch();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchByPhone, clearSearch]);

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.phone.includes(searchQuery)
  );

  const handleConversationSelect = (conversation: Conversation | any) => {
    // Convert search result to conversation format if needed
    const normalizedConversation: Conversation = {
      id: conversation.id,
      name: conversation.name,
      phone: conversation.phone,
      lastMessage: conversation.lastMessage || '',
      lastMessageTime: conversation.lastMessageTime || 'Now',
      unreadCount: conversation.unreadCount || 0,
      avatar: conversation.avatar,
      isOnline: conversation.isOnline
    };
    setSelectedConversation(normalizedConversation);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar */}
      <div className={`${selectedConversation && isMobile ? 'hidden' : 'flex'} flex-col w-full md:w-96 bg-white/5 backdrop-blur-lg border-r border-white/10`}>
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
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300 animate-spin" />
            )}
            <Input
              placeholder="Search by phone number or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:bg-white/15"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border-b border-white/10">
              <div className="p-2 bg-white/5">
                <h3 className="text-sm font-medium text-purple-300 px-2">Search Results</h3>
              </div>
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleConversationSelect(result)}
                  className="p-4 border-b border-white/5 cursor-pointer transition-all duration-200 hover:bg-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={result.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                          {result.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {result.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white truncate">{result.name}</h3>
                        {result.lastMessageTime && (
                          <span className="text-xs text-purple-300">{result.lastMessageTime}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-purple-400" />
                          <span className="text-xs text-purple-300">{result.phone}</span>
                        </div>
                        {result.unreadCount > 0 && (
                          <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {result.unreadCount}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-purple-200 truncate mt-1">
                        {result.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Existing Conversations */}
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b border-white/5 cursor-pointer transition-all duration-200 hover:bg-white/10 ${
                selectedConversation?.id === conversation.id ? 'bg-white/15' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white truncate">{conversation.name}</h3>
                    <span className="text-xs text-purple-300">{conversation.lastMessageTime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3 text-purple-400" />
                      <span className="text-xs text-purple-300">{conversation.phone}</span>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-purple-200 truncate mt-1">{conversation.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        {selectedConversation ? (
          <ChatWindow 
            conversation={selectedConversation} 
            messages={messages}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white/5 backdrop-blur-lg">
            <div className="text-center">
              <MessageSquare className="h-24 w-24 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">Welcome to Nullchat</h2>
              <p className="text-purple-200 max-w-md">
                Select a conversation to start chatting, or search for someone by their phone number to begin a new conversation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
