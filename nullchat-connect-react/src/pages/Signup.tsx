import API from '@/api';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { Mail, Phone, User, Lock, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';


const Signup = () => {
     
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
    const payload = {
      name: formData.username,
      email: formData.email,
      phoneNumber: formData.phone,
      password: formData.password,
    };

    const res = await API.post('/signup', payload);
    console.log('Signup success:', res.data);

    navigate('/verify-otp') 
  } catch (err: any) {
    console.error('Signup failed:', err.response?.data || err.message);
    alert(err.response?.data?.message || 'Signup failed');
  }
    // Signup logic will be implemented here
    console.log('Signup with:', formData);
  };


 

 const googleLogin = useGoogleLogin({
   onSuccess: async (tokenResponse) => {
    console.log("Google token response:", tokenResponse);
    try {
      const res = await API.post('/auth/google', {
        token: tokenResponse.access_token,
      });

      const { user, token, status } = res.data;

      if (status === "existing") {
        localStorage.setItem("token", token);
        navigate('/dashboard');
      } else if (status === "incomplete") {
        // No phone number yet
        navigate('/phone-collection', {
          state: { email: user.email }
        });
      } else {
        // new user
        navigate('/verify-otp', {
          state: { from: 'google', email: user.email },
        });
      }

    } catch (err) {
      console.error('Google login failed:', err.response?.data || err.message);
      alert('Google login failed');
    }
  }
});

    

  const handleGoogleSignup = () => {
    // Google OAuth signup logic
    googleLogin();
    console.log('Google signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="h-12 w-12 text-white mr-3" />
            <h1 className="text-4xl font-bold text-white">Nullchat</h1>
          </div>
          <p className="text-purple-200">Connect with anyone, anywhere</p>
        </div>

        <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-center">Create Account</CardTitle>
            <CardDescription className="text-purple-200 text-center">
              Join Nullchat and start connecting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
                <Input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                  required
                />
              </div>
              
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                  required
                />
              </div>
              
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                  required
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Create Account
              </Button>
            </form>

            <div className="relative">
              <Separator className="bg-white/20" />
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-2 text-purple-200 text-sm">
                or
              </span>
            </div>

            <Button 
              onClick={handleGoogleSignup}
              variant="outline" 
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <p className="text-center text-purple-200 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-300 hover:text-white font-semibold">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
