import React from 'react';
import { Wrench } from 'lucide-react';

export default function Footer() {
  const links = ['Features', 'How It Works', 'Solutions', 'Contact', 'Privacy', 'Terms'];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Wrench className="w-4.5 h-4.5" />
            </div>
            <span className="text-lg font-bold text-white">FieldOps</span>
          </div>

          <p className="text-xs text-slate-400">
            Smart field service management for modern businesses.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            {links.map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-white transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
          © 2026 FieldOps. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
