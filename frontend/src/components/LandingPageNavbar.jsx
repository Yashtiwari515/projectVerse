import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Check localStorage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return 'dark';
    }
    return 'light';
  });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg shadow-lg' 
            : 'bg-white dark:bg-zinc-900'
        } border-b border-gray-200 dark:border-zinc-800`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 group z-50">
              <Logo className="h-12 w-auto transform transition-transform duration-300 group-hover:scale-110" />
            </Link>

            {/* Middle: Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
              <a 
                href="#home" 
                className="relative text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#about" 
                className="relative text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#contact" 
                className="relative text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            {/* Right: Theme Toggle + CTA */}
            <div className="flex items-center gap-4">
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all duration-300 group"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="size-5 text-gray-700 dark:text-zinc-300 transform transition-transform group-hover:rotate-12" />
                ) : (
                  <Sun className="size-5 text-yellow-500 transform transition-transform group-hover:rotate-90" />
                )}
              </button>

              {/* Desktop CTA Button */}
              <Link 
                to="/sign-in" 
                className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Try Now
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="size-6 text-gray-700 dark:text-zinc-300" />
                ) : (
                  <Menu className="size-6 text-gray-700 dark:text-zinc-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 py-6 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 space-y-4">
            <a 
              href="#home" 
              onClick={closeMenu}
              className="block py-3 px-4 rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-semibold"
            >
              Home
            </a>
            <a 
              href="#about" 
              onClick={closeMenu}
              className="block py-3 px-4 rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-semibold"
            >
              About
            </a>
            <a 
              href="#contact" 
              onClick={closeMenu}
              className="block py-3 px-4 rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-semibold"
            >
              Contact
            </a>
            
            {/* Mobile CTA Button */}
            <Link 
              to="/sign-in" 
              onClick={closeMenu}
              className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg"
            >
              Try Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content jump */}
      <div className="h-[73px]"></div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @supports (backdrop-filter: blur(10px)) {
          nav {
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;