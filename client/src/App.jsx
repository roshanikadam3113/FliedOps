import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Roles from './components/Roles';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('get-started');

  const handleOpenAuthModal = (mode = 'get-started') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col font-sans">
      <Navbar onOpenAuthModal={handleOpenAuthModal} />
      <main className="flex-grow">
        <Hero onOpenAuthModal={handleOpenAuthModal} />
        <ProblemSection />
        <Features />
        <HowItWorks />
        <Roles onOpenAuthModal={handleOpenAuthModal} />
        <CTA onOpenAuthModal={handleOpenAuthModal} />
      </main>
      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
