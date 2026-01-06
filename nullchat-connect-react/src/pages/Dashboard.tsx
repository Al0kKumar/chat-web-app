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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // AvatarImage is no longer used, but kept in imports for now
import { usePhoneSearch } from '@/hooks/usePhoneSearch';
import axios from 'axios';
import { formatMessageTimestamp } from '@/utils/timeFormatter';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  profilePic?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { searchResults, isSearching, searchByPhone, clearSearch } = usePhoneSearch();
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get<CurrentUser>(
          'https://chat-web-app-6330.onrender.com/api/v1/userDetails',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCurrentUser(response.data);
        console.log('✅ Current user:', response.data);
      } catch (error) {
        console.error('❌ Error fetching current user info:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(
          'https://chat-web-app-6330.onrender.com/api/v1/getchats',
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('💬 Conversations response:', response.data);
        response.data.forEach((conv: any) => {
          console.log(`Conversation ID: ${conv.id}, Profile Pic: ${conv.profilePic}, Type: ${typeof conv.profilePic}`);
        });
        setConversations(response.data);
      } catch (error) {
        console.error('❌ Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

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

  const handleClick = (conversation: { userName?: string; phoneNumber?: string; id: string }) =>
    navigate(`/chat/${conversation.id}`, {
      state: {
        username: conversation.userName,
        id: conversation.id,
        phoneNumber: conversation.phoneNumber,
      },
    });

  const displayConversations = useMemo(() => {
    return searchQuery.trim() ? searchResults : conversations;
  }, [searchQuery, searchResults, conversations]);

  return (
    <div className="flex h-screen w-full bg-black text-white">
      {/* Sidebar */}
      <div className="w-full md:w-96 flex flex-col border-r border-white/10 bg-zinc-950">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <MessageSquare className="h-7 w-7 text-green-400 mr-2" />
              <h1 className="text-xl font-semibold tracking-wide">
                Nullchat
              </h1>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5 text-zinc-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-white/10 text-white">
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/user/me`, {
                      state: {
                        username: currentUser?.name,
                        phoneNumber: currentUser?.phoneNumber,
                      },
                    })
                  }
                >
                  👤 My Info
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.clear();
                    navigate('/login');
                  }}
                >
                  🚪 Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-400 animate-spin" />
            )}
            <Input
              placeholder="Search by phone number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-green-400"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {displayConversations.length > 0 ? (
            displayConversations.map((conversation: any) => (
              <div
                key={conversation.id}
                onClick={() => handleClick(conversation)}
                className="p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition"
              >
                <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                     
                      {conversation.profilePic ? (
                        <img
                          src={`${conversation.profilePic}?t=${Date.now()}`}
                          alt="Profile"
                          // ADDED 'absolute inset-0' HERE
                          className="absolute inset-0 h-full w-full object-cover"
                          onError={(e) => {
                            console.error(`Error loading image for ${conversation.userName || conversation.phoneNumber}: ${e.currentTarget.src}`);
                            // Consider setting a state here to force AvatarFallback if image fails to load permanently
                          }}
                        />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                        {conversation.userName
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase() || conversation.phoneNumber?.slice(-2)}
                      </AvatarFallback>
                      )}
                      {/* <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                        {conversation.userName
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase() || conversation.phoneNumber?.slice(-2)}
                      </AvatarFallback> */}
                    </Avatar>


                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">
                        {conversation.userName || conversation.phoneNumber}
                      </h3>
                      {conversation.lastMessageTime && (
                        <span className="text-xs text-zinc-500">
                          {formatMessageTimestamp(
                            conversation.lastMessageTime
                          )}
                        </span>
                      )}
                    </div>

                    {conversation.lastMessage ? (
                      <p className="text-sm text-zinc-400 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                    ) : (
                      <p className="text-sm text-zinc-600 italic mt-1">
                        No messages yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-zinc-500 mt-10">
              {searchQuery ? 'No users found.' : 'No conversations yet.'}
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      <div className="hidden md:flex flex-1 items-center justify-center text-zinc-600 text-lg">
        Select a chat to start messaging
      </div>
    </div>
  );
};

export default Dashboard;