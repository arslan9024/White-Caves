import React, { useState } from 'react';
import './ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <p>Get in touch with Dubai's premier luxury real estate experts</p>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-grid">
          <div className="contact-info-section">
            <h2>White Caves Real Estate LLC</h2>
            <p className="company-tagline">Your Gateway to Luxury Living in Dubai</p>

            <div className="contact-cards">
              <div className="contact-card">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Office Address</h3>
                  <p>Office D-72, El-Shaye-4</p>
                  <p>Port Saeed, Deira</p>
                  <p>Dubai, United Arab Emirates</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Phone Numbers</h3>
                  <p><strong>Office:</strong> +971 56 361 6136</p>
                  <p><strong>Mobile:</strong> +971 56 361 6136</p>
                  <p><strong>WhatsApp:</strong> +971 56 361 6136</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Email Addresses</h3>
                  <p><strong>General:</strong> admin@whitecaves.com</p>
                  <p><strong>Sales:</strong> sales@whitecaves.com</p>
                  <p><strong>Leasing:</strong> leasing@whitecaves.com</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Business Hours</h3>
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                  <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                  <p><strong>Sunday:</strong> By Appointment Only</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Online Presence</h3>
                  <p><strong>Website:</strong> www.whitecaves.com</p>
                  <p><strong>Instagram:</strong> @whitecaves.realestate</p>
                  <p><strong>LinkedIn:</strong> White Caves Real Estate</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>License Information</h3>
                  <p><strong>RERA Certified</strong></p>
                  <p><strong>DED Licensed</strong></p>
                  <p><strong>Dubai Land Department Registered</strong></p>
                </div>
              </div>
            </div>

            <div className="quick-links">
              <h3>Quick Actions</h3>
              <div className="quick-links-grid">
                <a href="tel:+971563616136" className="quick-link">
                  <span className="quick-icon">📞</span>
                  Call Office
                </a>
                <a href="https://wa.me/971563616136" target="_blank" rel="noopener noreferrer" className="quick-link whatsapp">
                  <span className="quick-icon">💬</span>
                  WhatsApp
                </a>
                <a href="mailto:admin@whitecaves.com" className="quick-link">
                  <span className="quick-icon">✉️</span>
                  Send Email
                </a>
                <a href="https://maps.google.com/?q=Port+Saeed+Dubai" target="_blank" rel="noopener noreferrer" className="quick-link">
                  <span className="quick-icon">📍</span>
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send Us a Message</h2>
            <p>Have a question or need assistance? Fill out the form below and we'll get back to you within 24 hours.</p>

            {submitted && (
              <div className="success-message">
                Thank you for your message! We'll get back to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+971 XX XXX XXXX"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="buy">Buying a Property</option>
                  <option value="sell">Selling a Property</option>
                  <option value="rent">Renting a Property</option>
                  <option value="landlord">Landlord Services</option>
                  <option value="investment">Investment Opportunities</option>
                  <option value="offplan">Off-Plan Projects</option>
                  <option value="career">Career Opportunities</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="map-section">
          <h2>Find Us</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.5678927463876!2d55.3367!3d25.2697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDE2JzEwLjkiTiA1NcKwMjAnMTIuMSJF!5e0!3m2!1sen!2sae!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="White Caves Location"
            />
          </div>
          <p className="map-address">
            Office D-72, El-Shaye-4, Port Saeed, Deira, Dubai, UAE
          </p>
        </div>
      </div>
    </div>
  );
}
