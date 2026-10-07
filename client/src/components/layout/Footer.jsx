import React from 'react';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const platformLinks = [
    { name: 'Core Features', href: '#features' },
    { name: 'How It Works', href: '#workflow' },
    { name: 'Interactive Preview', href: '#product-experience' },
  ];

  const companyLinks = [
    { name: 'Why FieldOps', href: '#about' },
    { name: 'Sign In', path: '/login' },
    { name: 'Get Started', path: '/register' },
  ];

  return (
    <footer id="footer" className="bg-surface-secondary border-t border-border-subtle pt-12 pb-8 text-text-secondary">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-border-subtle">
          
          {/* Left: Brand Logo & Description */}
          <div className="md:col-span-6 space-y-4">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold shadow-2xs group-hover:bg-brand-accent-hover transition-colors">
                <Activity className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-text-primary">
                FIELDOPS
              </span>
            </a>

            <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
              Field service operations connected in one unified platform. From customer requests to technician dispatch and final invoicing.
            </p>
          </div>

          {/* Right: Navigation Columns */}
          <div className="md:col-span-6 grid grid-cols-2 gap-8">
            
            {/* Column 1: PLATFORM */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-primary">
                PLATFORM
              </h4>
              <ul className="space-y-3">
                {platformLinks.map((item, idx) => (
                  <li key={idx}>
                    <a href={item.href} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: COMPANY */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-primary">
                COMPANY
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((item, idx) => (
                  <li key={idx}>
                    {item.path ? (
                      <Link to={item.path} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                        {item.name}
                      </Link>
                    ) : (
                      <a href={item.href} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                        {item.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between text-sm text-text-secondary font-medium">
          <div>
            © 2026 FieldOps. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
