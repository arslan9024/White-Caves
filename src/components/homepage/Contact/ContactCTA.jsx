import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ContactCTA.css';

export default function ContactCTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'Call Us',
      value: '+971 4 335 0592',
      link: 'tel:+97143350592'
    },
    {
      icon: Mail,
      label: 'Email Us',
      value: 'admin@whitecaves.com',
      link: 'mailto:admin@whitecaves.com'
    },
    {
      icon: MapPin,
      label: 'Visit Us',
      value: 'Office D-72, El-Shaye-4, Port Saeed, Dubai',
      link: 'https://maps.google.com'
    }
  ];

  return (
    <section className="contact-cta-section" id="contact-cta">
      <div className="contact-bg-shapes">
        <div className="cta-shape cta-shape-1" />
        <div className="cta-shape cta-shape-2" />
      </div>
      
      <div className="container">
        <div className="contact-cta-grid">
          <motion.div 
            className="contact-info-side"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-tag">Get In Touch</span>
            <h2 className="cta-title">
              Ready to Find Your <span className="gradient-text">Dream Property?</span>
            </h2>
            <p className="cta-description">
              Let our experts guide you through Dubai's luxury real estate market. 
              Schedule a consultation today and take the first step toward your dream home.
            </p>

            <div className="contact-methods">
              {contactInfo.map((item, index) => (
                <motion.a 
                  key={index}
                  href={item.link}
                  className="contact-method-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="contact-method-icon">
                    <item.icon size={24} />
                  </div>
                  <div className="contact-method-content">
                    <span className="contact-method-label">{item.label}</span>
                    <span className="contact-method-value">{item.value}</span>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="quick-links">
              <Link to="/properties" className="quick-link">
                <ArrowRight size={16} />
                Browse Properties
              </Link>
              <Link to="/about" className="quick-link">
                <ArrowRight size={16} />
                About White Caves
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className="contact-form-side"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="contact-form-wrapper">
              <h3 className="form-title">Send Us a Message</h3>
              
              {submitted ? (
                <motion.div 
                  className="success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="success-icon">&#10003;</div>
                  <h4>Message Sent!</h4>
                  <p>We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <textarea
                      name="message"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="form-input form-textarea"
                    />
                  </div>
                  
                  <motion.button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <span className="loading-spinner" />
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
