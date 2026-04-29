import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, MessageCircle, ArrowRight, LucideIcon, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Config } from '../../../config/constants';
import './ContactCTA.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiryType: 'buy' | 'sell' | 'rent' | 'invest' | 'general';
}

interface ContactInfo {
  icon: LucideIcon;
  label: string;
  value: string;
  link: string;
}

const INQUIRY_OPTIONS = [
  { value: 'buy',     label: 'I want to Buy' },
  { value: 'sell',    label: 'I want to Sell' },
  { value: 'rent',    label: 'I want to Rent' },
  { value: 'invest',  label: 'Investment Inquiry' },
  { value: 'general', label: 'General Inquiry' },
] as const;

const ContactCTA = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    inquiryType: 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const submitTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      clearTimeout(submitTimerRef.current);
    };
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    const trimmedName  = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    if (!trimmedName || !trimmedEmail) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    clearTimeout(submitTimerRef.current);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        trimmedName,
          email:       trimmedEmail,
          phone:       formData.phone.trim() || undefined,
          message:     formData.message.trim() || undefined,
          inquiryType: formData.inquiryType,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? `Server error ${response.status}`);
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '', inquiryType: 'general' });
      submitTimerRef.current = setTimeout(() => setSubmitted(false), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send. Please try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp pre-filled CTA
  const whatsappMessage = encodeURIComponent(
    `Hi White Caves! I'm interested in ${INQUIRY_OPTIONS.find(o => o.value === formData.inquiryType)?.label ?? 'a property'}. Please get in touch.`
  );
  const whatsappHref = `https://wa.me/${Config.COMPANY.PHONE.replace(/\D/g, '')}?text=${whatsappMessage}`;

  const contactInfo: ContactInfo[] = [
    {
      icon: Phone,
      label: 'Call Us',
      value: Config.COMPANY.PHONE,
      link: `tel:${Config.COMPANY.PHONE.replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      label: 'Email Us',
      value: Config.COMPANY.EMAIL,
      link: `mailto:${Config.COMPANY.EMAIL}`,
    },
    {
      icon: MapPin,
      label: 'Visit Us',
      value: 'Office D-72, El-Shaye-4, Port Saeed, Dubai',
      link: 'https://maps.google.com',
    },
  ];

  return (
    <section className="contact-cta-section dubai-luxury-theme" id="contact-cta">
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
                  key={item.label}
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
                <form onSubmit={handleSubmit} className="contact-form" aria-busy={isSubmitting}>
                  {/* Inquiry type dropdown */}
                  <div className="form-group">
                    <label htmlFor="contact-inquiry" className="sr-only">I'm interested in</label>
                    <select
                      id="contact-inquiry"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="form-input form-select"
                      disabled={isSubmitting}
                      aria-label="Inquiry type"
                    >
                      {INQUIRY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-name" className="sr-only">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="form-input"
                      aria-label="Your name"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-email" className="sr-only">Email Address</label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="form-input"
                        aria-label="Email address"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-phone" className="sr-only">Phone Number</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="form-input"
                        aria-label="Phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="contact-message" className="sr-only">Your Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder="Your Message..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      disabled={isSubmitting}
                      className="form-input"
                      aria-label="Your message"
                    />
                  </div>

                  {/* Error banner */}
                  {error && (
                    <motion.p
                      className="form-error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      role="alert"
                    >
                      {error}
                    </motion.p>
                  )}
                  
                  <div className="form-actions">
                    <motion.button 
                      type="submit"
                      className="form-submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="form-spinner" aria-hidden="true" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={18} />
                        </>
                      )}
                    </motion.button>

                    {/* WhatsApp quick-connect */}
                    <motion.a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="form-whatsapp"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      aria-label="Chat on WhatsApp"
                    >
                      <MessageSquare size={18} />
                      WhatsApp Us
                    </motion.a>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;

