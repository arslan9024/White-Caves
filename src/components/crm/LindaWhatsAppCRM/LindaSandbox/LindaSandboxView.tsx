// FILE: src/components/crm/LindaWhatsAppCRM/LindaSandbox/LindaSandboxView.tsx
/**
 * White Caves Real Estate LLC - AI Linda WhatsApp Interactive Simulator View
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Send, Bot, User, CheckCheck, Calendar, Sparkles, Building2, ShieldCheck, RotateCcw } from 'lucide-react';
import { useLindaSandbox } from './LindaSandbox.logic';

export const LindaSandboxView: FC = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    activeBooking,
    handleSendMessage,
    handleQuickPrompt,
    handleClearHistory,
  } = useLindaSandbox();

  return (
    <div className="flex flex-col h-[650px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl" data-testid="linda-sandbox-root">
      {/* 1. Header: WhatsApp Simulator Identity */}
      <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold">
              <Bot size={20} />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">AI Linda · WhatsApp Lead Concierge</h3>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Live Bilingual Sandbox
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Instant 60-Sec Lead Scoring · Multi-Account Sync · DLD Underwrite
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearHistory}
          title="Reset Conversation"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* 2. Interactive Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-500 font-mono uppercase tracking-wider flex-shrink-0">Quick Prompts:</span>
        <button
          type="button"
          onClick={() => handleQuickPrompt('Looking for 4BR villa in DAMAC Hills 2 under AED 3.5M')}
          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap cursor-pointer transition-colors"
        >
          🏡 4BR Villa DAMAC Hills 2
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt('ابحث عن فيلا 5 غرف في دبي مع مسبح خاص')}
          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-300 font-arabic whitespace-nowrap cursor-pointer transition-colors"
        >
          🇦🇪 فيلا 5 غرف (عربي)
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt('Schedule a VIP viewing tomorrow morning')}
          className="px-2.5 py-1 rounded-full bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 whitespace-nowrap cursor-pointer transition-colors"
        >
          📅 Schedule VIP Viewing
        </button>
      </div>

      {/* 3. Chat Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        {messages.map(msg => {
          const isLinda = msg.sender === 'linda';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isLinda ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-md ${
                  isLinda
                    ? 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-sm'
                    : 'bg-emerald-700 text-white rounded-tr-sm'
                }`}
                dir={msg.language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="font-sans whitespace-pre-wrap">{msg.text}</div>

                {/* Suggested Property Cards Attached to Linda's Message */}
                {msg.suggestedProperties && msg.suggestedProperties.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                      Matched Inventory & DLD Underwriting:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.suggestedProperties.map(prop => (
                        <div
                          key={prop.id}
                          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{prop.title}</span>
                              <ShieldCheck size={13} className="text-emerald-400 flex-shrink-0" />
                            </div>
                            <div className="text-[11px] text-slate-400">{prop.location}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              Est. 4% DLD Fee: AED {prop.estDldFee.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-red-400 block">
                              AED {prop.priceAed.toLocaleString()}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                              Verified
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* VIP Viewing Booking Card */}
                {msg.viewingInvite && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-emerald-400 font-mono font-bold">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        VIP Viewing Confirmed
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                        {msg.viewingInvite.status}
                      </span>
                    </div>
                    <div className="text-white font-semibold">{msg.viewingInvite.propertyTitle}</div>
                    <div className="text-[11px] text-slate-400">
                      Time: {msg.viewingInvite.date} ({msg.viewingInvite.timeSlot})
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Escort: {msg.viewingInvite.agentLead}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-500 font-mono">
                  <span>{msg.timestamp}</span>
                  {isLinda && <CheckCheck size={12} className="text-sky-400" />}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono px-3 py-2 bg-slate-900/60 rounded-xl w-32 border border-slate-800">
            <Sparkles size={12} className="animate-spin text-emerald-400" />
            <span>Linda is typing…</span>
          </div>
        )}
      </div>

      {/* 4. Input Footer Deck */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="Type client message in English or Arabic (e.g. 4BR villa in DAMAC Hills 2)..."
          data-testid="linda-sandbox-input"
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
        />
        <button
          type="submit"
          data-testid="linda-sandbox-send-btn"
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-md"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};

export default LindaSandboxView;
