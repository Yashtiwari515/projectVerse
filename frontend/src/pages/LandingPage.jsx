import React from 'react';
import Navbar from '../components/LandingPageNavbar';
import Hero from '../components/LandingPageHero';
import Footer from '../components/LandingPageFooter';
import About from '../components/LandingPageAbout';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <Hero />
      <About /> 
      <Footer />
    </div>
  );
};

export default LandingPage;