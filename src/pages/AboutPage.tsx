import React, { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Trophy,
  Users,
  Heart,
  Shield,
  Star,
  TrendingUp,
  Award,
  Globe,
  Handshake,
  CheckCircle2,
} from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import PublicLayout from '../components/layout/PublicLayout';
import PageHeroBanner from '../components/layout/PageHeroBanner';
import PageMeta from '../components/seo/PageMeta';
import './AboutPage.css';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVar: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

interface Milestone {
  year: string;
  title: string;
  desc: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Ahmed Al Rashid',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: '20+ years experience in Dubai real estate market',
  },
  {
    name: 'Sarah Thompson',
    role: 'Head of Sales',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Specializing in luxury villa transactions',
  },
  {
    name: 'Mohammed Hassan',
    role: 'Senior Property Consultant',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Expert in off-plan investments',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Marketing Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    bio: 'Digital marketing strategist',
  },
];

const milestones: Milestone[] = [
  { year: '2009', title: 'Company Founded', desc: 'Started as a boutique agency in Dubai Marina' },
  { year: '2012', title: '100th Property Sold', desc: 'Reached our first major milestone' },
  { year: '2015', title: 'Expanded to Abu Dhabi', desc: 'Opened our second office in the capital' },
  { year: '2018', title: '500+ Happy Clients', desc: 'Growing trust in the luxury market' },
  {
    year: '2021',
    title: 'Digital Transformation',
    desc: 'Launched virtual tours and online platform',
  },
  { year: '2024', title: 'Market Leader', desc: "Recognized as Dubai's premier luxury agency" },
];

const awards = [
  { text: 'Best Luxury Real Estate Agency — Dubai 2024', Icon: Trophy },
  { text: 'Excellence in Customer Service Award 2023', Icon: Star },
  { text: 'Top 10 Real Estate Companies in UAE 2023', Icon: Award },
  { text: 'Innovation in Property Technology 2022', Icon: TrendingUp },
];

const values = [
  {
    Icon: Shield,
    title: 'Integrity',
    desc: 'Transparent dealings and honest advice in every transaction',
  },
  { Icon: Star, title: 'Excellence', desc: 'Exceeding client expectations with premium service' },
  {
    Icon: Heart,
    title: 'Passion',
    desc: 'Deeply passionate about connecting people with their dream homes',
  },
  {
    Icon: Globe,
    title: 'Global Reach',
    desc: 'Serving clients from 40+ countries across the world',
  },
  { Icon: Handshake, title: 'Trust', desc: 'Building lasting relationships through reliability' },
  { Icon: Users, title: 'Community', desc: 'Giving back to the Dubai community we call home' },
];

const AboutPage: FC = () => {
  useDocumentTitle('About Us');

  return (
    <PublicLayout>
      <div className="about-page">
        <PageMeta
          title="About White Caves | Dubai Luxury Real Estate"
          description="Learn about White Caves Real Estate LLC, our Dubai market expertise, and our luxury property mission."
          canonicalPath="/about"
          ogType="website"
        />

        <PageHeroBanner
          badge="About Us"
          title="About White Caves"
          subtitle="Dubai's Premier Luxury Real Estate Agency — trusted by clients since 2009"
          theme="charcoal"
          breadcrumbs={[{ label: 'About Us' }]}
          stat={{ value: '15+', label: 'Years of Trust' }}
        />

        {/* ── Intro ─────────────────────────────────────────────────── */}
        <section className="about-intro">
          <div className="container">
            <div className="intro-grid">
              <motion.div
                className="intro-content"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
              >
                <span className="about-section-tag">Our Story</span>
                <h2>Your Gateway to Luxury Living in Dubai</h2>
                <p>
                  White Caves Real Estate LLC is a leading luxury real estate agency headquartered
                  in Dubai, United Arab Emirates. With over 15 years of experience in the market, we
                  specialize in high-end residential and commercial properties across the emirate.
                </p>
                <p>
                  Our team of experienced professionals is dedicated to providing exceptional
                  service to buyers, sellers, landlords, and tenants. We understand that real estate
                  is more than just transactions — it&apos;s about finding the perfect home or
                  investment that matches your lifestyle and goals.
                </p>
                <div className="about-divider" />
                <div className="intro-stats">
                  {[
                    { value: '500+', label: 'Properties Sold' },
                    { value: '1000+', label: 'Happy Clients' },
                    { value: '15+', label: 'Years Experience' },
                    { value: '50+', label: 'Expert Agents' },
                  ].map(s => (
                    <div key={s.label} className="intro-stat">
                      <span className="intro-stat-value">{s.value}</span>
                      <span className="intro-stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="intro-image"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800"
                  alt="White Caves Office"
                  loading="lazy"
                />
                <div className="intro-image-badge">
                  <CheckCircle2 size={18} />
                  <span>RERA Certified Agency</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Values ────────────────────────────────────────────────── */}
        <section className="values-section">
          <div className="container">
            <motion.div
              className="about-section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <span className="about-section-tag">What We Stand For</span>
              <h2 className="about-section-title">Our Core Values</h2>
              <p className="about-section-subtitle">
                The principles that guide every interaction and decision at White Caves
              </p>
              <div className="about-divider" />
            </motion.div>

            <motion.div
              className="values-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {values.map(({ Icon, title, desc }) => (
                <motion.div
                  key={title}
                  className="value-card"
                  variants={cardVar}
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                >
                  <div className="value-icon-wrapper">
                    <Icon size={26} strokeWidth={1.8} />
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Team ──────────────────────────────────────────────────── */}
        <section className="team-section">
          <div className="container">
            <motion.div
              className="about-section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <span className="about-section-tag">The People</span>
              <h2 className="about-section-title">Meet Our Team</h2>
              <p className="about-section-subtitle">
                Expert professionals dedicated to your success
              </p>
              <div className="about-divider" />
            </motion.div>

            <motion.div
              className="team-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {teamMembers.map(member => (
                <motion.div
                  key={member.name}
                  className="team-card"
                  variants={cardVar}
                  whileHover={{ y: -8 }}
                >
                  <div className="team-image">
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      width={300}
                      height={300}
                    />
                    <div className="team-overlay">
                      <Users size={20} className="team-overlay-icon" />
                      <span>{member.role}</span>
                    </div>
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <p className="role">{member.role}</p>
                    <p className="bio">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Milestones ────────────────────────────────────────────── */}
        <section className="milestones-section">
          <div className="container">
            <motion.div
              className="about-section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <span className="about-section-tag about-section-tag--light">Our Journey</span>
              <h2 className="about-section-title milestones-title">Company Timeline</h2>
              <div className="about-divider about-divider--light" />
            </motion.div>

            <motion.div
              className="milestones-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {milestones.map(ms => (
                <motion.div key={ms.year} className="milestone-card" variants={cardVar}>
                  <div className="milestone-year">{ms.year}</div>
                  <h4>{ms.title}</h4>
                  <p>{ms.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Awards ────────────────────────────────────────────────── */}
        <section className="awards-section">
          <div className="container">
            <motion.div
              className="about-section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <span className="about-section-tag">Recognition</span>
              <h2 className="about-section-title">Awards &amp; Certifications</h2>
              <div className="about-divider" />
            </motion.div>

            <motion.div
              className="awards-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {awards.map(({ text, Icon }) => (
                <motion.div
                  key={text}
                  className="award-card"
                  variants={cardVar}
                  whileHover={{ y: -6, boxShadow: '0 16px 36px rgba(0,0,0,0.1)' }}
                >
                  <div className="award-icon-wrapper">
                    <Icon size={26} strokeWidth={1.7} />
                  </div>
                  <p>{text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
