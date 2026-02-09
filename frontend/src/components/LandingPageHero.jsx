import { Link } from 'react-router-dom';
import { CheckCircle, Users, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative py-20 px-6 text-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-zinc-950 overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-950/50 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-8 animate-fade-in">
          <Zap className="w-4 h-4" />
          <span>Your All-in-One Project Workspace</span>
        </div>

        {/* Main Heading with Gradient */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight animate-slide-up">
          Manage Projects with{' '}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Zero Friction
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl text-gray-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
          The complete workspace for startups and small teams to track tasks, collaborate seamlessly, 
          and ship faster — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-slide-up animation-delay-400">
          <Link 
            to="/sign-up" 
            className="group px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Get Started Free
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <a 
            href="#about" 
            className="px-8 py-4 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-xl font-bold text-lg text-gray-900 dark:text-white hover:border-blue-600 dark:hover:border-blue-500 transition-all hover:scale-105 active:scale-95"
          >
            See How It Works
          </a>
        </div>

        {/* Feature Pills - Floating Cards */}
        <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
          
          {/* Feature 1 */}
          <div className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900 animate-float animation-delay-500 cursor-pointer">
            <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg group-hover:scale-110 transition-transform">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="font-semibold text-gray-800 dark:text-zinc-200">Task Management</span>
          </div>

          {/* Feature 2 */}
          <div className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900 animate-float animation-delay-700 cursor-pointer">
            <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-semibold text-gray-800 dark:text-zinc-200">Team Collaboration</span>
          </div>

          {/* Feature 3 */}
          <div className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900 animate-float animation-delay-900 cursor-pointer">
            <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="font-semibold text-gray-800 dark:text-zinc-200">Lightning Fast</span>
          </div>

        </div>

      </div>

      {/* Add these custom animations to your global CSS or Tailwind config */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }

        .animation-delay-900 {
          animation-delay: 0.9s;
        }

        .delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </section>
  );
};

export default Hero;