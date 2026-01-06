import React from 'react';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Users,
  Shield,
  Zap,
  Github,
  Linkedin,
  Mail,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-zinc-900 to-neutral-950">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-green-400 mr-3" />
            <span className="text-2xl font-bold text-white tracking-wide">
              Nullchat
            </span>
          </div>

          <div className="space-x-4 flex flex-wrap justify-center">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-zinc-200 hover:bg-white/10"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 text-black font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24 flex-1">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Messaging Without
            <br />
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Middlemen
            </span>
          </h1>

          <p className="text-xl text-zinc-300 mb-12 max-w-2xl mx-auto">
            Peer-to-peer chat built for privacy extremists. No surveillance.
            No compromises. Just fast, encrypted communication.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 text-black px-10 py-5 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Chatting
              </Button>
            </Link>

            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-green-400/40 text-green-300 hover:bg-green-400/10 px-10 py-5 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Nullchat?
          </h2>
          <p className="text-zinc-400 text-lg">
            Built for people who don’t trust platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Users className="h-8 w-8 text-black" />,
              title: 'Peer-to-Peer',
              desc: 'Direct user-to-user communication. No servers spying on your conversations.',
            },
            {
              icon: <Shield className="h-8 w-8 text-black" />,
              title: 'Privacy First',
              desc: 'End-to-end encryption by default. We don’t log. We don’t track.',
            },
            {
              icon: <Zap className="h-8 w-8 text-black" />,
              title: 'Instant Delivery',
              desc: 'Optimized P2P infrastructure for real-time messaging.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-zinc-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center bg-white/5 backdrop-blur-xl rounded-3xl p-14 border border-white/10 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Take Back Your Privacy
          </h2>

          <p className="text-zinc-400 text-lg mb-10">
            Join users who refuse to be the product.
          </p>

          <Link to="/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 text-black px-14 py-5 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 px-6 pt-10 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <MessageSquare className="h-6 w-6 text-green-400 mr-2" />
              <span className="text-lg font-semibold text-white">
                Nullchat
              </span>
            </div>
            <p className="text-zinc-500 text-sm">
              © 2025 Nullchat. No middlemen.
            </p>
          </div>

          <div className="flex space-x-6 items-center justify-center">
            <a
              href="https://github.com/Al0kKumar"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-5 w-5 text-zinc-400 hover:text-green-400 transition" />
            </a>
            <a href="mailto:mishraalok189381@email.com">
              <Mail className="h-5 w-5 text-zinc-400 hover:text-green-400 transition" />
            </a>
            <a
              href="https://www.linkedin.com/in/alok-kumar09/"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="h-5 w-5 text-zinc-400 hover:text-green-400 transition" />
            </a>
          </div>
        </div>

        <p className="mt-6 text-center text-zinc-500 text-sm">
          Made with <span className="text-green-400">▲</span> by{' '}
          <a
            href="https://alok619.vercel.app"
            className="text-white font-semibold hover:text-green-400"
          >
            Alok
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
