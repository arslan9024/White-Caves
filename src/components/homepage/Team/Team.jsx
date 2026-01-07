import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Team.css';

const teamMembers = [
  {
    name: 'Ahmed Al Rashid',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: '20+ years experience in Dubai real estate market',
    skills: ['Strategic Planning', 'Market Analysis', 'Leadership'],
    social: { linkedin: '#', twitter: '#', email: 'ahmed@whitecaves.com' }
  },
  {
    name: 'Sarah Thompson',
    role: 'Head of Sales',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Specializing in luxury villa transactions',
    skills: ['Negotiations', 'Client Relations', 'Sales'],
    social: { linkedin: '#', twitter: '#', email: 'sarah@whitecaves.com' }
  },
  {
    name: 'Mohammed Hassan',
    role: 'Senior Property Consultant',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Expert in off-plan investments',
    skills: ['Investment', 'Property Valuation', 'Market Trends'],
    social: { linkedin: '#', twitter: '#', email: 'mohammed@whitecaves.com' }
  },
  {
    name: 'Elena Rodriguez',
    role: 'Marketing Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    bio: 'Digital marketing strategist',
    skills: ['Digital Marketing', 'Branding', 'Strategy'],
    social: { linkedin: '#', twitter: '#', email: 'elena@whitecaves.com' }
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function Team() {
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
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index}
              className="team-card"
              variants={cardVariants}
              whileHover={{ y: -10 }}
            >
              <div className="team-image-wrapper">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="team-image"
                />
                <div className="team-overlay">
                  <div className="team-social">
                    <motion.a 
                      href={member.social.linkedin}
                      whileHover={{ scale: 1.2 }}
                      className="social-link"
                    >
                      <Linkedin size={18} />
                    </motion.a>
                    <motion.a 
                      href={member.social.twitter}
                      whileHover={{ scale: 1.2 }}
                      className="social-link"
                    >
                      <Twitter size={18} />
                    </motion.a>
                    <motion.a 
                      href={`mailto:${member.social.email}`}
                      whileHover={{ scale: 1.2 }}
                      className="social-link"
                    >
                      <Mail size={18} />
                    </motion.a>
                  </div>
                </div>
              </div>
              
              <div className="team-content">
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
                
                <div className="team-skills">
                  {member.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
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
          <h3>Join Our Team</h3>
          <p>We're always looking for talented individuals to join our growing team</p>
          <Link to="/careers" className="btn btn-outline">
            View Open Positions
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
