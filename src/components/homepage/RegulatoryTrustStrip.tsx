import React, { FC } from 'react';
import { ShieldCheck, Award, FileCheck2, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegulatoryTrustStrip: FC = () => {
  const credentials = [
    {
      icon: ShieldCheck,
      title: 'RERA Certified Broker',
      badge: 'ORN 44483',
      subtext: 'Real Estate Regulatory Agency',
    },
    {
      icon: Award,
      title: 'DET Commercial License',
      badge: 'Lic. 1388443',
      subtext: 'Govt. of Dubai Economy & Tourism',
    },
    {
      icon: FileCheck2,
      title: 'Ejari Authorized Integration',
      badge: 'DLD Verified',
      subtext: 'Official Tenancy Registration Hub',
    },
    {
      icon: Building2,
      title: 'Prime Developer Direct',
      badge: 'Tier 1 Partner',
      subtext: 'Emaar, Nakheel, DAMAC, Sobha',
    },
  ];

  return (
    <section
      className="w-full bg-slate-950/80 border-y border-red-500/20 py-4 px-4 backdrop-blur-md"
      aria-label="Government and Regulatory Compliance Credentials"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 md:gap-8">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs uppercase tracking-widest font-extrabold text-slate-300">
            Regulated & Licensed in Dubai
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          {credentials.map((cred, idx) => {
            const Icon = cred.icon;
            return (
              <motion.div
                key={cred.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="flex items-center gap-2.5 bg-slate-900/60 border border-slate-800 hover:border-red-500/40 rounded-xl px-3 py-2 transition-all group"
              >
                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-100 truncate">{cred.title}</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {cred.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 truncate">{cred.subtext}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RegulatoryTrustStrip;
