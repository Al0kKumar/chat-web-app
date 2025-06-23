
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Phone, Video, MoreVertical } from 'lucide-react';
import ProfileInfo from './ProfileInfo';

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

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, messages, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showProfileInfo, setShowProfileInfo] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Send message logic will be implemented here
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProfileClick = () => {
    setShowProfileInfo(true);
  };

  const handleProfileInfoBack = () => {
    setShowProfileInfo(false);
  };

  if (showProfileInfo) {
    return (
      <ProfileInfo 
        conversation={conversation} 
        onBack={handleProfileInfoBack}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-lg">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="md:hidden text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div 
            className="relative cursor-pointer"
            onClick={handleProfileClick}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                {conversation.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {conversation.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
            )}
          </div>
          
          <div 
            className="flex-1 cursor-pointer"
            onClick={handleProfileClick}
          >
            <h3 className="font-semibold text-white hover:text-purple-200 transition-colors">
              {conversation.name}
            </h3>
            <p className="text-sm text-purple-300">
              {conversation.isOnline ? 'Online' : 'Last seen recently'}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.isOwn
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  : 'bg-white/10 text-white border border-white/20'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${message.isOwn ? 'text-purple-100' : 'text-purple-300'}`}>
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:bg-white/15 pr-12"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
