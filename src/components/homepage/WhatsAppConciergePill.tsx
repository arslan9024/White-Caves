import React, { FC, useState } from 'react';
import { MessageSquare, PhoneCall, X, Calendar, Sparkles, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP_NUMBER = '971585919024';

interface InquiryOption {
  icon: typeof Calendar;
  title: string;
  message: string;
}

const INQUIRY_OPTIONS: InquiryOption[] = [
  {
    icon: Calendar,
    title: 'Book Private Villa Viewing',
    message:
      'Hello White Caves! I would like to schedule a private VIP viewing for a luxury property.',
  },
  {
    icon: Sparkles,
    title: 'Off-Plan Investment Launches',
    message:
      'Hello! Please share latest developer off-plan launches (Emaar, Nakheel, Sobha) with payment plans.',
  },
  {
    icon: Building,
    title: 'List My Property for Sale/Rent',
    message:
      'Hello White Caves, I am a landlord interested in listing my property with your RERA-licensed agency.',
  },
];

export const WhatsAppConciergePill: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openWhatsApp = (customMessage: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(customMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-80 bg-slate-900/95 border border-red-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-slate-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold text-white">VIP Concierge Desk</h4>
                  <p className="text-[11px] text-slate-400">White Caves Real Estate LLC</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close concierge menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2.5 flex flex-col gap-1.5">
              {INQUIRY_OPTIONS.map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => openWhatsApp(opt.message)}
                    className="flex items-center gap-3 w-full p-2.5 rounded-xl bg-slate-800/60 hover:bg-red-500/15 border border-slate-700/50 hover:border-red-500/40 text-left transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                      {opt.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                openWhatsApp(
                  'Hello White Caves! I would like to speak directly with a luxury property advisor.'
                )
              }
              className="mt-1 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Open Direct WhatsApp Chat
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-4 rounded-full shadow-2xl shadow-red-500/30 border border-red-400/30 hover:brightness-110 transition-all"
        aria-label="Open luxury property WhatsApp concierge"
      >
        <div className="relative">
          <PhoneCall className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
        </div>
        <span className="text-xs md:text-sm font-extrabold tracking-wide hidden sm:inline">
          VIP Concierge
        </span>
      </motion.button>
    </div>
  );
};

export default WhatsAppConciergePill;
