
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { MessageSquare, Mail } from 'lucide-react';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');

  const handleVerifyOtp = () => {
    // OTP verification logic
    console.log('Verifying OTP:', otp);
  };

  const handleResendOtp = () => {
    // Resend OTP logic
    console.log('Resending OTP');
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
              <Mail className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-white">Verify Your Email</CardTitle>
            <CardDescription className="text-purple-200">
              We've sent a 6-digit code to your email address. Please enter it below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                className="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="bg-white/10 border-white/20 text-white w-12 h-12 text-xl" />
                  <InputOTPSlot index={1} className="bg-white/10 border-white/20 text-white w-12 h-12 text-xl" />
                  <InputOTPSlot index={2} className="bg-white/10 border-white/20 text-white w-12 h-12 text-xl" />
                  <InputOTPSlot index={3} className="bg-white/10 border-white/20 text-white w-12 h-12 text-xl" />
                  <InputOTPSlot index={4} className="bg-white/10 border-white/20 text-white w-12 h-12 text-xl" />
                  <InputOTPSlot index={5} className="bg-white/10 border-white/20 text-white w-12 h-12 text-xl" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify & Continue
            </Button>

            <div className="text-center">
              <p className="text-purple-200 text-sm mb-2">
                Didn't receive the code?
              </p>
              <Button 
                onClick={handleResendOtp}
                variant="ghost" 
                className="text-purple-300 hover:text-white hover:bg-white/10"
              >
                Resend Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OtpVerification;
