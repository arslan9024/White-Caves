import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import './NewsletterSignup.css';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubscribed(true);
    setIsSubmitting(false);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <div className="newsletter-icon">
            <Mail size={40} />
          </div>
          <h2 className="newsletter-title">Stay Updated with Dubai Real Estate</h2>
          <p className="newsletter-subtitle">
            Get exclusive property listings, market insights, and investment opportunities delivered
            to your inbox
          </p>

          {isSubscribed ? (
            <div className="success-message" role="alert" aria-live="polite">
              <CheckCircle size={24} />
              <span>Thank you for subscribing! Check your inbox for the latest updates.</span>
            </div>
          ) : (
            <form
              className="newsletter-form"
              onSubmit={handleSubmit}
              aria-label="Newsletter subscription form"
            >
              <div className="input-wrapper">
                {/* Phase 25 a11y: visually-hidden label satisfies WCAG 1.3.1 */}
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <Mail size={20} className="input-icon" aria-hidden="true" />
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="newsletter-input"
                  aria-required="true"
                  aria-label="Email address for newsletter subscription"
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                className="subscribe-btn"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Subscribing...</span>
                ) : (
                  <>
                    <Send size={18} aria-hidden="true" />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </form>
          )}

          <p className="privacy-note">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  );
}
