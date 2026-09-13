// src/pages/QuotationPage.tsx - 6 STARS HOSPITALITY Official Quotation Engine Page
import React from 'react';
import { QuoteCalculator } from '../components/quote/QuoteCalculator';
import { Calculator, HelpCircle, CheckCircle2, FileText, Clock } from 'lucide-react';

export const QuotationPage: React.FC = () => {
  const faqs = [
    {
      q: 'Is this quotation binding or an estimate?',
      a: 'This quotation is an estimate based on your selected dates and apartment specifications. Final pricing and availability are confirmed by our concierge team upon reservation review.'
    },
    {
      q: 'What amenities and utilities are included in the quote?',
      a: 'All quotation rates include 24/7 uninterrupted industrial generator backup, 100 Mbps fiber internet, scheduled housekeeping, access to The Centaurus heated swimming pool and fitness gym, reserved parking, and round-the-clock security.'
    },
    {
      q: 'Can I request extended monthly or annual corporate leases?',
      a: 'Yes. Select "Monthly" or "Annual" in the duration toggle above. Preferential volume tariffs of up to 25% are automatically calculated for extended executive and diplomatic occupancies.'
    },
    {
      q: 'How does the printable specification sheet work?',
      a: 'Once your parameters are set, click "Print / PDF Sheet" to generate an official 6 Stars Hospitality specification summary detailing unit dimensions, bedroom layout, inclusions, and payment guidelines.'
    },
    {
      q: 'What identification is required upon arrival?',
      a: 'Valid Government National Identity Cards (CNIC) for Pakistani residents or valid Passports with valid Pakistani Visas for international visitors are required at reception upon key handover.'
    },
    {
      q: 'Can I request bespoke concierge services or airport transfers?',
      a: 'Absolutely. You can select airport pickup/drop-off, private chef dining, grocery provisioning, and additional housekeeping directly in the calculator add-ons or notify our concierge via WhatsApp.'
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold-500/10 border border-brand-gold-500/25 text-brand-gold-600 dark:text-brand-gold-400 text-xs font-bold uppercase tracking-widest mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Real-Time Estimation Engine</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-foreground dark:text-white tracking-tight">
          Instant Quotation & Spec Sheets
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground dark:text-slate-400 mt-3 leading-relaxed">
          Configure your stay parameters below to generate an immediate digital quotation estimate with optional chauffeured airport transfers, extra bedding, and VIP concierge services.
        </p>

        {/* Value Pillars */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs text-muted-foreground dark:text-slate-300">
          <span className="px-3 py-1.5 rounded-xl bg-card dark:bg-charcoal-900 border border-border dark:border-charcoal-800 flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-brand-gold-500" />
            <span className="text-card-foreground dark:text-slate-200">Instant Rate Computation</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-card dark:bg-charcoal-900 border border-border dark:border-charcoal-800 flex items-center gap-2 shadow-sm">
            <FileText className="w-4 h-4 text-brand-gold-500" />
            <span className="text-card-foreground dark:text-slate-200">Downloadable Spec Sheets</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-card dark:bg-charcoal-900 border border-border dark:border-charcoal-800 flex items-center gap-2 shadow-sm">
            <Clock className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span className="text-card-foreground dark:text-slate-200">Immediate WhatsApp Concierge Verification</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Calculator */}
      <QuoteCalculator />

      {/* FAQ Section */}
      <div className="mt-20 pt-16 border-t border-border dark:border-charcoal-800 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-brand-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-widest block mb-1">
            Rental Guidance & Policies
          </span>
          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground dark:text-white">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-card dark:bg-charcoal-900/60 p-6 rounded-2xl border border-border dark:border-charcoal-800 hover:border-brand-gold-500/30 transition-colors shadow-sm">
              <h4 className="font-heading font-bold text-sm text-card-foreground dark:text-white mb-2.5 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-brand-gold-500 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-muted-foreground dark:text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
