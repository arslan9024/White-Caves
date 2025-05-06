
import React from 'react';
import './FeaturedAgents.css';

export default function FeaturedAgents() {
  const agents = [
    {
      name: "Sarah Johnson",
      specialization: "Luxury Villas",
      experience: "10+ years",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      languages: ["English", "Arabic"]
    },
    {
      name: "Michael Chen",
      specialization: "Downtown Properties",
      experience: "8 years",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      languages: ["English", "Chinese", "Arabic"]
    },
    {
      name: "Aisha Al-Rashid",
      specialization: "Waterfront Properties",
      experience: "12 years",
      photo: "https://randomuser.me/api/portraits/women/68.jpg",
      languages: ["Arabic", "English", "French"]
    }
  ];

  return (
    <section className="featured-agents">
      <h2>Meet Our Expert Agents</h2>
      <div className="agents-grid">
        {agents.map((agent, index) => (
          <div key={index} className="agent-card">
            <img src={agent.photo} alt={agent.name} className="agent-photo" />
            <h3>{agent.name}</h3>
            <p className="specialization">{agent.specialization}</p>
            <p className="experience">{agent.experience} experience</p>
            <div className="languages">
              {agent.languages.map(lang => (
                <span key={lang} className="language-tag">{lang}</span>
              ))}
            </div>
            <button className="contact-agent">Contact Agent</button>
          </div>
        ))}
      </div>
    </section>
  );
}
