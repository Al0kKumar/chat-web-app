import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { Mail, Lock, MessageSquare } from 'lucide-react';
import API from '@/api'; // using your wrapper
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if(loading)  return;

    setLoading(true);
    try {
      localStorage.removeItem('token');

      const res = await API.post('/login', formData);
      console.log('Login successful:', res.data);

      const { token } = res.data;

      if(token){
        localStorage.setItem("token", res.data.token);
        navigate('/dashboard');
      }
      else{
        alert('No token recievd.Something went wrong')
      }

      
    } catch (err: any) {
      console.error('Login failed:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
   const googleLogin = useGoogleLogin({
     onSuccess: async (tokenResponse) => {
      try {
        localStorage.removeItem('token');

        const res = await API.post('/auth/google', {
          token: tokenResponse.access_token,
        },
       { withCredentials: true });
  
        const { user, token, status } = res.data;

        if(token){
          localStorage.setItem('token', token);
        }
  
        if (status === "existing") {
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
        alert(err.response?.data?.message || 'Google login failed');
      }
    }
  });
  
      

  const handleGoogleLogin = () => {
    googleLogin();
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
          <p className="text-zinc-400">
            Resume your secure session
          </p>
        </div>

        {/* Card */}
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">
              Sign In
            </CardTitle>
            <CardDescription className="text-zinc-400 text-center">
              Access your encrypted workspace
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-400" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-zinc-500 focus:border-green-400"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-400" />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-zinc-500 focus:border-green-400"
                  required
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 text-black font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? 'Authenticating…' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <Separator className="bg-white/10" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-2 text-zinc-500 text-sm">
                or
              </span>
            </div>

            {/* Google */}
            <Button
              onClick={() => googleLogin()}
              variant="outline"
              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Footer */}
            <p className="text-center text-zinc-500 text-sm">
              Don’t have an account?{' '}
              <Link
                to="/signup"
                className="text-green-400 hover:text-cyan-400 font-semibold"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;