import React from 'react';
import { CheckCircle2, BarChart3, Users2, BellRing, TrendingUp, Clock } from 'lucide-react';
import dashboardImg from '../assets/dashboard-ss.png';

const About = () => {
  const highlights = [
    {
      title: "Real-time Project Overview",
      desc: "Track progress with visual bars and status indicators like 'Active' or 'Completed'.",
      icon: <BarChart3 className="text-blue-500" />
    },
    {
      title: "Smart Task Prioritization",
      desc: "Organize tasks by High, Medium, or Low priority to tackle urgent work first.",
      icon: <CheckCircle2 className="text-green-500" />
    },
    {
      title: "Recent Activity Stream",
      desc: "See who did what and when with a live activity feed of all task updates.",
      icon: <BellRing className="text-orange-500" />
    },
    {
      title: "Team Collaboration",
      desc: "Manage roles and memberships efficiently within your dedicated project workspace.",
      icon: <Users2 className="text-purple-500" />
    }
  ];

  return (
    <section id="about" className="relative py-28 px-6 bg-white dark:bg-zinc-900 overflow-hidden">
      
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 dark:bg-blue-950/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100/30 dark:bg-purple-950/20 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300 mb-6 animate-fade-in-up">
            <BarChart3 className="w-4 h-4" />
            <span>Why Teams Choose Us</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up animation-delay-100">
            Powerful Management, <span className="text-blue-600">Simplified.</span>
          </h2>
          <p className="text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in-up animation-delay-200">
            Humne ProjectVerse ko is tarah design kiya hai ki aapka focus sirf kaam par rahe, tools par nahi.
          </p>
        </div>

        {/* Feature Row with Dashboard Image */}
        <div className="grid lg:grid-cols-5 gap-16 items-center">
          
          {/* Left Side: Text Details */}
          <div className="lg:col-span-2 space-y-10">
            {highlights.map((item, index) => (
              <div 
                key={index} 
                className="flex gap-5 group animate-slide-in-left"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="mt-1 transform transition-transform group-hover:scale-110 group-hover:rotate-6 duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="pt-6 animate-fade-in animation-delay-600">
              <div className="flex items-center gap-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-gradient-to-r from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-800/50 w-fit px-5 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <CheckCircle2 className="size-5 text-green-500" />
                Trusted by modern agile teams
              </div>
            </div>
          </div>

          {/* Right Side: Dashboard Image with Floating Cards */}
          <div className="lg:col-span-3">
            <div className="relative group">
              
              {/* Animated Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse-slow"></div>
              
              {/* Image Container */}
              <div className="relative rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden bg-white dark:bg-zinc-950 transform transition-all duration-500 group-hover:scale-[1.02] animate-fade-in-up animation-delay-300">
                <img 
                  src={dashboardImg} 
                  alt="ProjectVerse Dashboard Overview" 
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Floating Card 1: Project Completion */}
              <div className="absolute -bottom-6 -left-4 hidden md:block bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow-2xl border-2 border-zinc-100 dark:border-zinc-700 animate-float animation-delay-500 hover:scale-105 transition-transform cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="size-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                    65%
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Average</p>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Project Completion</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 2: Active Tasks */}
              <div className="absolute -top-6 -right-4 hidden lg:block bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-2xl border-2 border-zinc-100 dark:border-zinc-700 animate-float animation-delay-700 hover:scale-105 transition-transform cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="text-white size-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100">24</p>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Active Tasks</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 3: Time Saved */}
              {/* <div className="absolute top-1/3 -left-8 hidden xl:block bg-white dark:bg-zinc-800 px-4 py-3 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-700 animate-float animation-delay-900 hover:scale-105 transition-transform cursor-pointer">
                <div className="flex items-center gap-2">
                  <Clock className="text-orange-500 size-5" />
                  <div>
                    <p className="text-lg font-black text-zinc-800 dark:text-zinc-100">12hrs</p>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Saved/Week</p>
                  </div>
                </div>
              </div> */}

              {/* Floating Card 4: Team Growth */}
              {/* <div className="absolute bottom-1/4 -right-6 hidden xl:block bg-gradient-to-br from-purple-500 to-pink-500 px-4 py-3 rounded-xl shadow-xl animate-float animation-delay-1100 hover:scale-105 transition-transform cursor-pointer">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-white size-5" />
                  <div>
                    <p className="text-lg font-black text-white">+156%</p>
                    <p className="text-xs font-semibold text-white/90">Team Growth</p>
                  </div>
                </div>
              </div> */}

            </div>
          </div>

        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulseSlow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }

        .animation-delay-900 {
          animation-delay: 0.9s;
        }

        .animation-delay-1100 {
          animation-delay: 1.1s;
        }
      `}</style>
    </section>
  );
};

export default About;