import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Phone } from 'lucide-react';
import API from '@/api'; 


const PhoneCollection = () => {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleContinue = async () => {
    if (!email) {
      alert('Missing email. Please restart the signup process.');
      return;
    }

    try {
      const payload = {
        email,
        phoneNumber: phone,
      };

      const res = await API.post('/auth/google/complete-profile', payload); // adjust URL later
      console.log('Phone linked successfully:', res.data);

    //  navigate('/dashboard');
    navigate('/profile-upload', { state: { email: email } });
    } catch (err: any) {
      console.error('Failed to link phone:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="h-12 w-12 text-green-400 mr-3" />
            <h1 className="text-4xl font-bold text-white tracking-wide">
              Nullchat
            </h1>
          </div>
        </div>

        {/* Card */}
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center">
              <Phone className="h-8 w-8 text-black" />
            </div>

            <CardTitle className="text-white text-2xl">
              Add Your Phone Number
            </CardTitle>

            <CardDescription className="text-zinc-400">
              Used only to help trusted contacts find you.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Phone Input */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-400" />
              <Input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-zinc-500 focus:border-green-400"
                required
              />
            </div>

            {/* Continue */}
            <Button
              onClick={handleContinue}
              disabled={!phone}
              className="w-full bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 text-black font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              Continue
            </Button>

            {/* Footer */}
            <p className="text-center text-zinc-500 text-xs">
              Your phone number is never shared publicly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhoneCollection;