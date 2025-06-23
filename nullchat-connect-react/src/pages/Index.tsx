
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-white mr-3" />
            <span className="text-2xl font-bold text-white">Nullchat</span>
          </div>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Connect with
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {" "}Anyone
            </span>
            <br />
            Anywhere with
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {" "}Nullchat
            </span>
          </h1>
          
          <p className="text-xl text-purple-200 mb-10 max-w-2xl mx-auto">
            Experience seamless peer-to-peer messaging with enhanced privacy, 
            lightning-fast delivery, and a beautiful interface designed for modern communication.
          </p>
          
          <div className="space-x-4">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Chatting Now
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-lg"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose Nullchat?
          </h2>
          <p className="text-xl text-purple-200">
            Built for the future of communication
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Peer-to-Peer</h3>
            <p className="text-purple-200">
              Direct communication between users without intermediaries, ensuring faster and more private conversations.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Privacy First</h3>
            <p className="text-purple-200">
              Your conversations are private and secure with end-to-end encryption and no data mining.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Lightning Fast</h3>
            <p className="text-purple-200">
              Experience instant message delivery with our optimized peer-to-peer infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience Nullchat?
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            Join thousands of users who have already discovered the future of messaging.
          </p>
          <Link to="/signup">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Started for Free
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/10">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6 text-purple-400 mr-2" />
            <span className="text-lg font-semibold text-white">Nullchat</span>
          </div>
          <p className="text-purple-300">
            © 2024 Nullchat. Connecting the world, one conversation at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
