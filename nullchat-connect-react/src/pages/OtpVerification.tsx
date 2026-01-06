import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { MessageSquare, Mail } from 'lucide-react';
import API from '@/api';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const from = location.state?.from; // 'google' or undefined

  const handleVerifyOtp = async () => {
    if (!email) {
      alert("Missing email, can't verify.");
      navigate('/signup');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/verify-otp', {
        email,
        otp,
      });

      console.log('OTP Verified:', res.data);

      let token = res.data.token;

      if(token){
        localStorage.setItem('token',token);
      }



      // Decide where to go next
      if (from === 'google') {
        navigate('/phone-collection');
      } else {
        navigate('/profile-upload', { state: { email: email } });
      //  navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('OTP verification failed:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return alert("Missing email, can't resend OTP.");

    try {
      setResending(true);
      const res = await API.post('/resend-otp', { email });
      console.log('OTP resent:', res.data);
      alert('OTP sent again to your email');
    } catch (err: any) {
      console.error('Resend failed:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
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
              <Mail className="h-8 w-8 text-black" />
            </div>

            <CardTitle className="text-white text-2xl">
              Verify Your Email
            </CardTitle>

            <CardDescription className="text-zinc-400">
              Enter the 6-digit verification code sent to your email.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* OTP */}
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                className="gap-3"
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="bg-white/10 border-white/20 text-white w-12 h-12 text-xl focus:border-green-400"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Verify */}
            <Button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || loading}
              className="w-full bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 text-black font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Verifying…' : 'Verify & Continue'}
            </Button>

            {/* Resend */}
            <div className="text-center">
              <p className="text-zinc-500 text-sm mb-2">
                Didn’t receive the code?
              </p>
              <Button
                onClick={handleResendOtp}
                variant="ghost"
                disabled={resending}
                className="text-green-400 hover:text-cyan-400 hover:bg-white/10"
              >
                {resending ? 'Sending…' : 'Resend Code'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OtpVerification;