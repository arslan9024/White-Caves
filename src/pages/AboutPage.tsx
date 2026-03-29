import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import AppLayout from '../components/layout/AppLayout';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import './AboutPage.css';

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

interface AboutPageProps {}

const AboutPage: FC<AboutPageProps> = () => {
  useDocumentTitle('About Us');
  const teamMembers: TeamMember[] = [
    {
      name: "Ahmed Al Rashid",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      bio: "20+ years experience in Dubai real estate market"
    },
    {
      name: "Sarah Thompson",
      role: "Head of Sales",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      bio: "Specializing in luxury villa transactions"
    },
    {
      name: "Mohammed Hassan",
      role: "Senior Property Consultant",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      bio: "Expert in off-plan investments"
    },
    {
      name: "Elena Rodriguez",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      bio: "Digital marketing strategist"
    }
  ];

  const milestones: Milestone[] = [
    { year: "2009", title: "Company Founded", desc: "Started as a boutique agency in Dubai Marina" },
    { year: "2012", title: "100th Property Sold", desc: "Reached our first major milestone" },
    { year: "2015", title: "Expanded to Abu Dhabi", desc: "Opened our second office in the capital" },
    { year: "2018", title: "500+ Happy Clients", desc: "Growing trust in the luxury market" },
    { year: "2021", title: "Digital Transformation", desc: "Launched virtual tours and online platform" },
    { year: "2024", title: "Market Leader", desc: "Recognized as Dubai's premier luxury agency" }
  ];

  const awards: string[] = [
    "Best Luxury Real Estate Agency - Dubai 2024",
    "Excellence in Customer Service Award 2023",
    "Top 10 Real Estate Companies in UAE 2023",
    "Innovation in Property Technology 2022"
  ];

  return (
    <AppLayout>
      <div className="about-page">
        <section className="about-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>About White Caves</h1>
            <p>Dubai's Premier Luxury Real Estate Agency</p>
          </div>
        </section>

        <section className="about-intro">
          <div className="container">
            <div className="intro-grid">
              <div className="intro-content">
                <h2>Your Gateway to Luxury Living in Dubai</h2>
                <p>
                  White Caves Real Estate LLC is a leading luxury real estate agency 
                  headquartered in Dubai, United Arab Emirates. With over 15 years of 
                  experience in the market, we specialize in high-end residential and 
                  commercial properties across the emirate.
                </p>
                <p>
                  Our team of experienced professionals is dedicated to providing 
                  exceptional service to buyers, sellers, landlords, and tenants. 
                  We understand that real estate is more than just transactions – 
                  it's about finding the perfect home or investment that matches 
                  your lifestyle and goals.
                </p>
                <div className="intro-stats">
                  <div className="stat">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Properties Sold</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">1000+</span>
                    <span className="stat-label">Happy Clients</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">15+</span>
                    <span className="stat-label">Years Experience</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Expert Agents</span>
                  </div>
                </div>
              </div>
              <div className="intro-image">
                <img 
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800" 
                  alt="White Caves Office"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="team-section">
          <div className="container">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">Expert professionals dedicated to your success</p>
            <div className="team-grid">
              {teamMembers.map((member) => (
                <div key={member.name} className="team-card">
                  <div className="team-image">
                    <img src={member.image} alt={member.name} loading="lazy" width={300} height={300} />
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <p className="role">{member.role}</p>
                    <p className="bio">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="milestones-section">
          <div className="container">
            <h2 className="section-title">Our Journey</h2>
            <div className="timeline">
              {milestones.map((milestone) => (
                <div key={milestone.year} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3>{milestone.year}</h3>
                    <h4>{milestone.title}</h4>
                    <p>{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WhatsAppButton />
        <Footer />
      </div>
    </AppLayout>
  );
};

export default AboutPage;
