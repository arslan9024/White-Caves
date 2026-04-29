import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail, Phone, Star } from 'lucide-react';
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
    </section>
  );
};

export default Team;
