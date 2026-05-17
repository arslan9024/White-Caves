import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Twitter, Mail, Phone, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TopAgent } from '../../../store/slices/homepageSlice';
import './Team.css';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  skills: string[];
  social: {
    linkedin: string;
    twitter: string;
    email: string;
  };
  dealsCount?: number;
}

// Static fallback team members
const STATIC_TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Ahmed Al Rashid',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: '20+ years experience in Dubai real estate market',
    skills: ['Strategic Planning', 'Market Analysis', 'Leadership'],
    social: {
      linkedin: 'https://linkedin.com/company/whitecaves',
      twitter: 'https://twitter.com/whitecaves',
      email: 'ahmed@whitecaves.com',
    },
  },
  {
    name: 'Sarah Thompson',
    role: 'Head of Sales',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Specializing in luxury villa transactions',
    skills: ['Negotiations', 'Client Relations', 'Sales'],
    social: {
      linkedin: 'https://linkedin.com/company/whitecaves',
      twitter: 'https://twitter.com/whitecaves',
      email: 'sarah@whitecaves.com',
    },
  },
  {
    name: 'Mohammed Hassan',
    role: 'Senior Property Consultant',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Expert in off-plan investments',
    skills: ['Investment', 'Property Valuation', 'Market Trends'],
    social: {
      linkedin: 'https://linkedin.com/company/whitecaves',
      twitter: 'https://twitter.com/whitecaves',
      email: 'mohammed@whitecaves.com',
    },
  },
  {
    name: 'Elena Rodriguez',
    role: 'Marketing Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    bio: 'Digital marketing strategist',
    skills: ['Digital Marketing', 'Branding', 'Strategy'],
    social: {
      linkedin: 'https://linkedin.com/company/whitecaves',
      twitter: 'https://twitter.com/whitecaves',
      email: 'elena@whitecaves.com',
    },
  },
];

const DEPT_ROLES: Record<string, string> = {
  sales: 'Sales Agent',
  leasing: 'Leasing Specialist',
  management: 'Manager',
  marketing: 'Marketing Specialist',
  support: 'Client Support',
  finance: 'Finance Specialist',
};

interface TeamProps {
  topAgents?: TopAgent[];
  isLoading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Team = ({ topAgents, isLoading: _isLoading = false }: TeamProps) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Close modal on Escape
  useEffect(() => {
    if (!selectedMember) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedMember(null); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [selectedMember]);
  // Merge live agent data with static fallback
  const members: TeamMember[] =
    topAgents && topAgents.length > 0
      ? topAgents.map(agent => ({
          name: agent.name,
          role: DEPT_ROLES[agent.department] ?? 'Property Consultant',
          image:
            agent.photoUrl ?? `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400`,
          bio: `${agent.dealsCount} deals closed — ${agent.department} specialist`,
          skills: [
            agent.department.charAt(0).toUpperCase() + agent.department.slice(1),
            'Dubai Market',
            'RERA Licensed',
          ],
          social: {
            linkedin: 'https://linkedin.com/company/whitecaves',
            twitter: 'https://twitter.com/whitecaves',
            email: agent.email,
          },
          dealsCount: agent.dealsCount,
        }))
      : STATIC_TEAM_MEMBERS;

  return (
    <section className="team-section" id="team">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Our Team</span>
          <h2 className="section-title">Meet the Experts</h2>
          <p className="section-subtitle">
            Dedicated professionals committed to helping you find your perfect property
          </p>
          <div className="divider" />
        </motion.div>

        <motion.div
          className="team-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {members.map(member => (
            <motion.div
              key={member.name}
              className="team-card"
              variants={cardVariants}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedMember(member)}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              aria-label={`View ${member.name}'s profile`}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedMember(member); } }}
            >
              <div className="team-image-wrapper">
                <img
                  src={member.image}
                  alt={member.name}
                  className="team-image"
                  loading="lazy"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
                  }}
                />
                {/* Deals badge — shown when agent data is live */}
                {member.dealsCount !== undefined && member.dealsCount > 0 && (
                  <div
                    className="team-deals-badge"
                    aria-label={`${member.dealsCount} deals closed`}
                  >
                    <Star size={11} fill="currentColor" />
                    {member.dealsCount} Deals
                  </div>
                )}
                <div className="team-overlay">
                  <div className="team-social">
                    <motion.a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2 }}
                      className="social-link"
                      aria-label={`${member.name} LinkedIn profile`}
                    >
                      <Linkedin size={18} />
                    </motion.a>
                    <motion.a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2 }}
                      className="social-link"
                      aria-label={`${member.name} Twitter profile`}
                    >
                      <Twitter size={18} />
                    </motion.a>
                    <motion.a
                      href={`mailto:${member.social.email}`}
                      whileHover={{ scale: 1.2 }}
                      className="social-link"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail size={18} />
                    </motion.a>
                    <motion.a
                      href="/owner/whatsapp"
                      whileHover={{ scale: 1.2 }}
                      className="social-link social-link--whatsapp"
                      aria-label={`WhatsApp ${member.name}`}
                    >
                      <Phone size={18} />
                    </motion.a>
                  </div>
                </div>
              </div>

              <div className="team-content">
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>

                <div className="team-skills">
                  {member.skills.map(skill => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="team-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h3>Meet the Full Team</h3>
          <p>Discover our full leadership and advisory experts serving Dubai real estate clients</p>
          <Link to="/about" className="btn btn-outline">
            View Team Profiles
          </Link>
        </motion.div>
      </div>

      {/* Bio Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
            }}
            onClick={() => setSelectedMember(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedMember.name} profile`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              style={{
                background: '#fff', borderRadius: 16, padding: '2rem', maxWidth: 480,
                width: '100%', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMember(null)}
                aria-label="Close profile"
                style={{
                  position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none',
                  cursor: 'pointer', color: '#6b7280', padding: 4,
                }}
              >
                <X size={20} />
              </button>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #E31E24' }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{selectedMember.name}</h3>
                  <p style={{ margin: '0.2rem 0', color: '#E31E24', fontWeight: 600, fontSize: '0.9rem' }}>{selectedMember.role}</p>
                  {selectedMember.dealsCount !== undefined && selectedMember.dealsCount > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fef3c7', color: '#d97706', padding: '0.2rem 0.5rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
                      <Star size={10} fill="currentColor" /> {selectedMember.dealsCount} Deals
                    </span>
                  )}
                </div>
              </div>
              <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '1rem' }}>{selectedMember.bio}</p>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {selectedMember.skills.map(skill => (
                    <span key={skill} style={{ background: '#f3f4f6', color: '#374151', padding: '0.25rem 0.6rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 500 }}>{skill}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <a href={selectedMember.social.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.35rem 0.7rem', borderRadius: 8, background: '#e7f3ff', color: '#0077b5', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>
                  <Linkedin size={14} /> LinkedIn
                </a>
                <a href={`mailto:${selectedMember.social.email}`} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.35rem 0.7rem', borderRadius: 8, background: '#fef2f2', color: '#dc2626', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>
                  <Mail size={14} /> Email
                </a>
                <a href={selectedMember.social.twitter} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.35rem 0.7rem', borderRadius: 8, background: '#eff6ff', color: '#1d9bf0', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>
                  <Twitter size={14} /> Twitter
                </a>
              </div>
              <Link
                to="/contact"
                style={{
                  display: 'block', textAlign: 'center', padding: '0.75rem',
                  background: 'linear-gradient(135deg, #E31E24, #c01a1f)', color: '#fff',
                  borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
                }}
                onClick={() => setSelectedMember(null)}
              >
                Book Consultation
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Team;
