import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Star, Phone } from 'lucide-react';
import { heroItemVariants } from './logic/HERO.logic';

export interface LuxuryTrustStripProps {
  copy: {
    trustLabel: string;
    reraLicensed: string;
    verifiedProperties: string;
    fiveStarRated: string;
    support247: string;
  };
}

export const LuxuryTrustStrip: FC<LuxuryTrustStripProps> = ({ copy }) => {
  return (
    <motion.div
      className="luxury-hero__trust-strip"
      variants={heroItemVariants}
      role="group"
      aria-label={copy.trustLabel}
    >
      <div className="luxury-hero__trust-badge">
        <Shield size={14} aria-hidden="true" />
        <span>{copy.reraLicensed}</span>
      </div>
      <div className="luxury-hero__trust-divider" aria-hidden="true" />
      <div className="luxury-hero__trust-badge">
        <Award size={14} aria-hidden="true" />
        <span>{copy.verifiedProperties}</span>
      </div>
      <div className="luxury-hero__trust-divider" aria-hidden="true" />
      <div className="luxury-hero__trust-badge">
        <Star size={14} aria-hidden="true" />
        <span>{copy.fiveStarRated}</span>
      </div>
      <div className="luxury-hero__trust-divider" aria-hidden="true" />
      <div className="luxury-hero__trust-badge">
        <Phone size={14} aria-hidden="true" />
        <span>{copy.support247}</span>
      </div>
    </motion.div>
  );
};

export default LuxuryTrustStrip;
