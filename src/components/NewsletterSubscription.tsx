import React, { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

const NewsletterSubscription: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }
    setIsSubmitting(true);
    // Optimistic UI — mark as submitted immediately, backend wired in a later phase
    setSubmitted(true);
    setEmail('');
    timerRef.current = setTimeout(() => setSubmitted(false), 5000);
    // Simulate async API call in background (non-blocking)
    setTimeout(() => setIsSubmitting(false), 600);
  };

  return (
    <section
      className="newsletter-section"
      aria-label="Newsletter subscription"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2E5A4F 100%)',
        padding: '4rem 1rem',
      }}
    >
      <div className="container" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(227, 30, 36, 0.15)',
              marginBottom: '1.25rem',
            }}
          >
            <Mail size={26} color="#E31E24" />
          </div>

          <h2
            style={{
              color: '#fff',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            Stay Updated on Dubai Real Estate
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Get exclusive property alerts, off-plan launches, and Dubai market insights delivered to
            your inbox — no spam, unsubscribe any time.
          </p>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 1.5rem',
              textAlign: 'left',
              display: 'inline-block',
            }}
          >
            {[
              'First access to new property listings',
              'Weekly market analysis & trends',
              'Investment tips from experts',
              'Exclusive subscriber offers',
            ].map(benefit => (
              <li
                key={benefit}
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  marginBottom: '0.4rem',
                  fontSize: '0.9rem',
                }}
              >
                ✓ {benefit}
              </li>
            ))}
          </ul>

          <p
            style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: '1.25rem' }}
          >
            Join <strong style={{ color: '#C9A84C' }}>12,000+</strong> subscribers
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: '#10B981',
                fontWeight: 600,
                fontSize: '1.05rem',
              }}
              role="status"
            >
              <CheckCircle2 size={22} />
              Thank you for subscribing! We'll be in touch.
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}
              aria-busy={isSubmitting}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={isSubmitting}
                aria-label="Email address for newsletter"
                style={{
                  flex: '1 1 260px',
                  padding: '0.75rem 1.1rem',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 8,
                  background: '#E31E24',
                  color: '#fff',
                  fontWeight: 600,
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.95rem',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? 'Subscribing…' : 'Subscribe'}
                {!isSubmitting && <ArrowRight size={16} />}
              </motion.button>
            </form>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              role="alert"
              style={{ color: '#f87171', marginTop: '0.5rem', fontSize: '0.875rem' }}
            >
              {error}
            </motion.p>
          )}

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: '1rem' }}>
            By subscribing you agree to our{' '}
            <a href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Privacy Policy
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSubscription;
