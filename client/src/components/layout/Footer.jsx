import React from 'react';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const productLinks = [
    { name: 'Live Dispatch Console', href: '#workflow' },
    { name: 'Smart Assignment', href: '#workflow' },
    { name: 'Job Tracking', href: '#product-experience' },
    { name: 'Invoicing', href: '#product-experience' },
  ];

  const solutionLinks = [
    { name: 'Company Admin Portal', path: '/admin' },
    { name: 'Technician Mobile App', path: '/technician' },
    { name: 'Customer Tracking Hub', path: '/customer' },
  ];

  const resourceLinks = [
    { name: 'How It Works', href: '#workflow' },
    { name: 'Product Experiences', href: '#product-experience' },
  ];

  const companyLinks = [
    { name: 'About FieldOps', href: '#final-cta' },
    { name: 'Get Started', href: '#final-cta' },
  ];

  return (
    <footer id="footer" className="bg-[#0F172A] border-t border-[#334155] pt-10 pb-6 text-[#94A3B8]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Main Grid: Brand Logo & 4 Valid Link Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 border-b border-[#334155]">
          
          {/* Left: Brand Logo & Description */}
          <div className="lg:col-span-4 space-y-2">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded-full bg-[#F97316] flex items-center justify-center text-white font-bold shadow-2xs">
                <Activity className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-white">
                FIELDOPS
              </span>
            </a>

            <p className="text-[11px] text-[#94A3B8] max-w-xs leading-relaxed">
              Field service operations connected in one place.
            </p>
          </div>

          {/* Right: 4 Navigation Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            
            {/* Column 1: PRODUCT */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">
                PRODUCT
              </h4>
              <ul className="space-y-1.5">
                {productLinks.map((item, idx) => (
                  <li key={idx}>
                    <a href={item.href} className="text-[11px] text-[#94A3B8] hover:text-white transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: SOLUTIONS */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">
                SOLUTIONS
              </h4>
              <ul className="space-y-1.5">
                {solutionLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.path} className="text-[11px] text-[#94A3B8] hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: RESOURCES */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">
                RESOURCES
              </h4>
              <ul className="space-y-1.5">
                {resourceLinks.map((item, idx) => (
                  <li key={idx}>
                    <a href={item.href} className="text-[11px] text-[#94A3B8] hover:text-white transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: COMPANY */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">
                COMPANY
              </h4>
              <ul className="space-y-1.5">
                {companyLinks.map((item, idx) => (
                  <li key={idx}>
                    <a href={item.href} className="text-[11px] text-[#94A3B8] hover:text-white transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#94A3B8]">
          <div>
            © 2026 FieldOps. All rights reserved.
          </div>

          <div className="flex items-center gap-5">
            <a href="#final-cta" className="hover:text-white transition-colors">Privacy</a>
            <a href="#final-cta" className="hover:text-white transition-colors">Terms</a>
            <a href="#final-cta" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
