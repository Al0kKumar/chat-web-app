
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ArrowLeft, Phone, Video, Search, X } from 'lucide-react';

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

interface ProfileInfoProps {
  conversation: Conversation;
  onBack: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ conversation, onBack }) => {
  const [showImagePreview, setShowImagePreview] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-lg">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold text-white">Profile Info</h2>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 text-center">
          <div className="relative inline-block mb-4">
            <Avatar 
              className="h-32 w-32 mx-auto cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowImagePreview(true)}
            >
              <AvatarImage src={conversation.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-3xl">
                {conversation.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {conversation.isOnline && (
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900"></div>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{conversation.name}</h3>
          <p className="text-purple-300 mb-4">{conversation.phone}</p>
          <p className="text-sm text-purple-200">
            {conversation.isOnline ? 'Online' : 'Last seen recently'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-2 p-4 text-white hover:bg-white/10 h-auto"
            >
              <Phone className="h-6 w-6 text-green-400" />
              <span className="text-xs">Call</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-2 p-4 text-white hover:bg-white/10 h-auto"
            >
              <Video className="h-6 w-6 text-blue-400" />
              <span className="text-xs">Video</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-2 p-4 text-white hover:bg-white/10 h-auto"
            >
              <Search className="h-6 w-6 text-purple-400" />
              <span className="text-xs">Search</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Picture Preview Modal */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="bg-black/90 border-none max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowImagePreview(false)}
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="w-full h-full flex items-center justify-center p-8">
              {conversation.avatar ? (
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="w-80 h-80 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-8xl font-bold">
                    {conversation.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
              <h3 className="text-white text-xl font-semibold mb-1">{conversation.name}</h3>
              <p className="text-purple-300">{conversation.phone}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileInfo;
