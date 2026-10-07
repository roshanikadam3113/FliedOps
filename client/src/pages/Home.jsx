import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import LiveCounterStrip from '../components/sections/LiveCounterStrip';
import Workflow from '../components/sections/Workflow';
import CoreFeatures from '../components/sections/CoreFeatures';
import ProductExperience from '../components/sections/ProductExperience';
import About from '../components/sections/About';
import FinalCTA from '../components/sections/FinalCTA';

export default function Home() {
  return (
    <div className="min-h-screen bg-page-bg text-text-primary selection:bg-brand-accent selection:text-white flex flex-col font-sans antialiased">
      {/* 1. Header Navbar */}
      <Navbar />

      {/* Main Landing Page Sequence */}
      <main className="flex-grow">
        {/* 2. Hero Section */}
        <Hero />

        {/* 2.5 Live Metrics */}
        <LiveCounterStrip />

        {/* 3. HOW FIELDOPS WORKS */}
        <Workflow />

        {/* 4. CORE FEATURES */}
        <CoreFeatures />

        {/* 5. One Platform. Three Experiences. */}
        <ProductExperience />

        {/* 6. ABOUT FIELDOPS Section */}
        <About />

        {/* 7. Final Conversion CTA */}
        <FinalCTA />
      </main>

      {/* 8. Theme-aware Footer */}
      <Footer />
    </div>
  );
}
