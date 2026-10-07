import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  PhoneCall, 
  Mail, 
  CreditCard, 
  Wrench, 
  XCircle, 
  ChevronDown,
  ArrowLeft
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    category: 'Payment Help',
    icon: CreditCard,
    questions: [
      { q: "How do I pay my invoice?", a: "You can pay your invoice online through the 'Invoices' tab on your dashboard using a credit card, debit card, or net banking." },
      { q: "Are there any hidden charges?", a: "No, all charges are strictly upfront. The final invoice reflects exactly what was agreed upon before the service started." }
    ]
  },
  {
    category: 'Service Help',
    icon: Wrench,
    questions: [
      { q: "How long does a typical service take?", a: "Most standard services are completed within 1-2 hours. Complex repairs may take longer, which the technician will communicate." },
      { q: "Do I need to be home during the service?", a: "Yes, an adult must be present to authorize the work and ensure access to the required areas." }
    ]
  },
  {
    category: 'Cancellation Help',
    icon: XCircle,
    questions: [
      { q: "How can I cancel a service request?", a: "You can cancel a request from the 'My Requests' tab up to 2 hours before the scheduled time without any penalty." },
      { q: "Will I be charged for a late cancellation?", a: "Cancellations made within 2 hours of the scheduled time may incur a nominal cancellation fee." }
    ]
  }
];

export default function HelpSupport() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-6 font-sans antialiased text-text-primary">
      
      {/* Top Navigation - Full Width */}
      <div className="flex items-center justify-between">
        <Link 
          to="/customer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-[10px] font-black uppercase text-text-secondary tracking-wider">
          Help & Support
        </span>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: FAQ */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-primary border border-border-subtle rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-6 border-b border-border-subtle bg-surface-secondary">
              <h1 className="text-xl font-extrabold tracking-tight text-text-primary flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-brand-accent" />
                Frequently Asked Questions
              </h1>
              <p className="text-xs text-text-secondary font-semibold mt-1">
                Find quick answers to common questions about our services.
              </p>
            </div>
            
            <div className="p-6 space-y-8">
              {FAQ_ITEMS.map((section, sIdx) => {
                const Icon = section.icon;
                return (
                  <div key={sIdx} className="space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-wider text-text-secondary flex items-center gap-2 border-b border-border-subtle pb-2">
                      <Icon className="w-4 h-4" /> {section.category}
                    </h2>
                    
                    <div className="space-y-3">
                      {section.questions.map((faq, fIdx) => {
                        const index = `${sIdx}-${fIdx}`;
                        const isExpanded = expandedIndex === index;
                        return (
                          <div 
                            key={fIdx} 
                            className={`border border-border-subtle rounded-xl overflow-hidden transition-all duration-200 ${isExpanded ? 'bg-surface-secondary' : 'bg-surface-primary hover:border-brand-accent/50'}`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleAccordion(index)}
                              className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                            >
                              <span className="text-xs font-bold text-text-primary pr-4">{faq.q}</span>
                              <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180 text-brand-accent' : ''}`} />
                            </button>
                            {isExpanded && (
                              <div className="px-5 pb-4 text-xs text-text-secondary font-medium leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                {faq.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Contact Company */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-primary border border-border-subtle rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-text-primary border-b border-border-subtle pb-3 mb-4">
              Contact Company
            </h2>
            
            <p className="text-xs text-text-secondary font-semibold mb-6">
              Need immediate assistance? Our support team is available 24/7.
            </p>

            <div className="space-y-4">
              <a href="tel:+18001234567" className="flex items-center gap-4 p-4 rounded-xl border border-border-subtle hover:bg-surface-secondary hover:border-brand-accent transition-all group">
                <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-text-secondary uppercase">Call Us</div>
                  <div className="text-sm font-extrabold text-text-primary">1-800-123-4567</div>
                </div>
              </a>

              <a href="mailto:support@fieldops.com" className="flex items-center gap-4 p-4 rounded-xl border border-border-subtle hover:bg-surface-secondary hover:border-brand-accent transition-all group">
                <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-text-secondary uppercase">Email Us</div>
                  <div className="text-sm font-extrabold text-text-primary">support@fieldops.com</div>
                </div>
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-border-subtle">
              <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4">
                <h3 className="text-xs font-bold text-brand-accent mb-1">Business Hours</h3>
                <p className="text-[11px] text-text-secondary font-medium">
                  Monday - Friday: 8:00 AM - 8:00 PM<br/>
                  Saturday - Sunday: 9:00 AM - 5:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
