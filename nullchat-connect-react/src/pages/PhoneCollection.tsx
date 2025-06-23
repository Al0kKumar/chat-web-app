
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Phone } from 'lucide-react';

const PhoneCollection = () => {
  const [phone, setPhone] = useState('');

  const handleContinue = () => {
    // Phone number collection logic
    console.log('Phone number collected:', phone);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="h-12 w-12 text-white mr-3" />
            <h1 className="text-4xl font-bold text-white">Nullchat</h1>
          </div>
        </div>

        <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-white">Add Your Phone Number</CardTitle>
            <CardDescription className="text-purple-200">
              We need your phone number to help others find you on Nullchat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                required
              />
            </div>

            <Button 
              onClick={handleContinue}
              disabled={!phone}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Nullchat
            </Button>

            <p className="text-center text-purple-200 text-xs">
              Your phone number will be used to connect you with friends and family on Nullchat
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhoneCollection;
