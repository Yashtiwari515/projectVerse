import React from 'react';
import { Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="relative bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-zinc-900 border-t border-gray-200 dark:border-zinc-800 pt-16 pb-8 px-6 overflow-hidden">
      
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100/20 dark:bg-blue-950/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-purple-100/20 dark:bg-purple-950/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 group mb-4">
              <Logo className="h-12 w-auto transform transition-transform duration-300 group-hover:scale-110" /> 
            </Link>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              The next generation of project management. Built for speed, collaboration, and simplicity.
            </p>
            
            {/* Small badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Live & Ready
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#home" className="group flex items-center gap-2 text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                  <span className="transform transition-transform group-hover:translate-x-1">Home</span>
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </li>
              <li>
                <a href="#about" className="group flex items-center gap-2 text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                  <span className="transform transition-transform group-hover:translate-x-1">Features</span>
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </li>
              <li>
                <Link to="/sign-in" className="group flex items-center gap-2 text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                  <span className="transform transition-transform group-hover:translate-x-1">Sign In</span>
                  <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="group flex items-center gap-3 text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Mail className="size-4 text-blue-500" />
                </div>
                <span className="transform transition-transform group-hover:translate-x-1">
                  support@projectverse.com
                </span>
              </li>
              <li className="group flex items-center gap-3 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Github className="size-4 text-gray-700 dark:text-zinc-300" />
                </div>
                <span className="transform transition-transform group-hover:translate-x-1">
                  github.com/projectverse
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Follow Us</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-500 mb-4">
              Stay updated with our latest features and releases
            </p>
            <div className="flex gap-3">
              <a 
                href="https://linkedin.com/in/tiwariyash515" 
                target="_blank" 
                rel="noreferrer"
                className="group relative"
              >
                <div className="absolute inset-0 bg-blue-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:border-blue-500 group-hover:shadow-lg">
                  <Linkedin className="size-5 text-gray-600 dark:text-zinc-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </a>
              
              <a 
                href="https://github.com/Yashtiwari515" 
                target="_blank" 
                rel="noreferrer"
                className="group relative"
              >
                <div className="absolute inset-0 bg-gray-900 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:border-gray-900 dark:group-hover:border-white group-hover:shadow-lg">
                  <Github className="size-5 text-gray-600 dark:text-zinc-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="border-t border-gray-200 dark:border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 dark:text-zinc-500">
            © {new Date().getFullYear()} ProjectVerse. All rights reserved. Made with ❤️ in India
          </p>
          <div className="flex gap-6 text-xs">
            <span className="text-gray-500 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-300 hover:underline">
              Privacy Policy
            </span>
            <span className="text-gray-500 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-300 hover:underline">
              Terms of Service
            </span>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;