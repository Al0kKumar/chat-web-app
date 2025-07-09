import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Shield, Zap, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-white mr-3" />
            <span className="text-2xl font-bold text-white">Nullchat</span>
          </div>
          <div className="space-x-4 flex flex-wrap justify-center">
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
      <div className="container mx-auto px-6 py-20 flex-1">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Connect with
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"> Anyone</span>
            <br />
            Anywhere with
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"> Nullchat</span>
          </h1>

          <p className="text-xl text-purple-200 mb-10 max-w-2xl mx-auto">
            Experience seamless peer-to-peer messaging with enhanced privacy,
            lightning-fast delivery, and a beautiful interface designed for modern communication.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
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
                className="bg-gradient-to-r from-purple-500 via-yellow-400 to-orange-400 text-black px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
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
          <p className="text-xl text-purple-200">Built for the future of communication</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[{
            icon: <Users className="h-8 w-8 text-white" />,
            title: 'Peer-to-Peer',
            desc: 'Direct communication between users without intermediaries, ensuring faster and more private conversations.',
          }, {
            icon: <Shield className="h-8 w-8 text-white" />,
            title: 'Privacy First',
            desc: 'Your conversations are private and secure with end-to-end encryption and no data mining.',
          }, {
            icon: <Zap className="h-8 w-8 text-white" />,
            title: 'Lightning Fast',
            desc: 'Experience instant message delivery with our optimized peer-to-peer infrastructure.',
          }].map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                {icon}
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
              <p className="text-purple-200">{desc}</p>
            </div>
          ))}
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
      <footer className="w-full border-t border-white/10 bg-transparent px-6 pt-10 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <MessageSquare className="h-6 w-6 text-purple-400 mr-2" />
              <span className="text-lg font-semibold text-white">Nullchat</span>
            </div>
            <p className="text-purple-300 text-sm">© 2025 Nullchat. Connecting the world.</p>
          </div>

          <div className="flex space-x-6 items-center justify-center">
            <a href="https://github.com/Al0kKumar" target="_blank" rel="noreferrer">
              <Github className="h-5 w-5 text-white hover:text-purple-400 transition" />
            </a>
            <a href="mailto:mishraalok189381@email.com">
              <Mail className="h-5 w-5 text-white hover:text-purple-400 transition" />
            </a>
            <a href="https://www.linkedin.com/in/alok-kumar09/" target="_blank" rel="noreferrer">
              <Linkedin className="h-5 w-5 text-white hover:text-purple-400 transition" />
            </a>
          </div>
        </div>

        <p className="mt-6 text-center text-purple-300 text-lg">
          Made with <span className="text-red-500">♥</span> by <span className="text-white font-semibold"> <a href='https://alok619.vercel.app'>Alok </a></span>
        </p>
      </footer>
    </div>
  );
};

export default Index;
