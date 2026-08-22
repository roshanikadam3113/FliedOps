import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CTA({ onOpenAuthModal }) {
  return (
    <section className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 text-center space-y-5">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to simplify your field operations?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Bring customers, technicians, and operations together with FieldOps.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => onOpenAuthModal('get-started')}
              className="px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
