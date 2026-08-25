import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import LiveCounterStrip from '../components/sections/LiveCounterStrip';
import Workflow from '../components/sections/Workflow';
import ProductExperience from '../components/sections/ProductExperience';
import About from '../components/sections/About';
import FinalCTA from '../components/sections/FinalCTA';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#0F172A] selection:bg-[#F97316] selection:text-white flex flex-col font-sans antialiased">
      {/* 1. Header Navbar */}
      <Navbar />

      {/* Main Landing Page Sequence */}
      <main className="flex-grow">
        {/* 2. Hero Section & Circular Service Hub */}
        <Hero />

        {/* 3. Operational Counter Strip */}
        <LiveCounterStrip />

        {/* 4. HOW FIELDOPS WORKS (6-Stage Connected Operational Workflow) */}
        <Workflow />

        {/* 5. One Platform. Three Experiences. (Interactive Product UI Showcase) */}
        <ProductExperience />

        {/* 6. ABOUT FIELDOPS Section */}
        <About />

        {/* 7. Final Conversion CTA */}
        <FinalCTA />
      </main>

      {/* 8. Dark Enterprise Footer */}
      <Footer />
    </div>
  );
}
