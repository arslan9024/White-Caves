import React, { useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  text: string;
  purchase: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'James Wilson',
    role: 'Property Investor',
    location: 'United Kingdom',
    text: 'White Caves made my Dubai property investment seamless and highly profitable. Their expertise is unmatched.',
    purchase: 'Purchased: Penthouse in Downtown Dubai',
    rating: 5,
  },
  {
    id: 2,
    name: 'Fatima Al-Zahra',
    role: 'First-time Buyer',
    location: 'UAE',
    text: 'The team guided me through every step of my first property purchase. Truly professional service.',
    purchase: 'Purchased: 2BR Apartment in Dubai Marina',
    rating: 5,
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Entrepreneur',
    location: 'Singapore',
    text: 'Outstanding support throughout the entire process. I found my dream villa thanks to White Caves.',
    purchase: 'Purchased: Villa in Palm Jumeirah',
    rating: 5,
  },
  {
    id: 4,
    name: 'Elena Petrov',
    role: 'Expat Professional',
    location: 'Russia',
    text: 'Relocating to Dubai was stress-free with their tenancy services. Highly recommended!',
    purchase: 'Leased: 3BR Apartment in JBR',
    rating: 5,
  },
  {
    id: 5,
    name: 'Ahmed Hassan',
    role: 'Business Owner',
    location: 'Egypt',
    text: 'Exceptional real estate professionals who truly care about client satisfaction and results.',
    purchase: 'Purchased: Office Space in DIFC',
    rating: 5,
  },
];

const TRUST_INDICATORS = [
  { value: '500+', label: 'Happy Clients' },
  { value: 'AED 2B+', label: 'Transactions' },
  { value: '10+', label: 'Years Experience' },
  { value: '98%', label: 'Satisfaction Rate' },
];

/**
 * TestimonialsCarousel — Auto-playing client testimonials carousel
 */
const TestimonialsCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goNext = () => setCurrent(prev => (prev + 1) % TESTIMONIALS.length);
  const goPrev = () => setCurrent(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section
      style={{
        padding: '5rem 2rem',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
      }}
    >
      {/* Header */}
      <h2
        style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#d4af37',
          marginBottom: '0.5rem',
        }}
      >
        What Our Clients Say
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Trusted by investors and homeowners across the globe
      </p>

      {/* Carousel */}
      <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
        {/* All testimonial cards (all rendered, current one prominent) */}
        {TESTIMONIALS.map(t => (
          <div
            key={t.id}
            className="TestimonialCard"
            style={{
              display: t.id === TESTIMONIALS[current].id ? 'block' : 'none',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 16,
              padding: '2.5rem',
              border: '1px solid rgba(212,175,55,0.2)',
              marginBottom: '1.5rem',
            }}
          >
            {/* Stars */}
            <div style={{ marginBottom: '1rem', color: 'var(--color-d4af37, #d4af37)' }}>
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>

            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              "{t.text}"
            </p>

            <p
              style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.75rem' }}
            >
              {t.purchase}
            </p>

            <div style={{ marginTop: '1.5rem' }}>
              <strong style={{ color: 'var(--color-d4af37, #d4af37)' }}>{t.name}</strong>
              <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 8 }}>
                {t.role} · {t.location}
              </span>
            </div>
          </div>
        ))}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <button
            onClick={goPrev}
            aria-label="Previous"
            style={{
              background: 'rgba(212,175,55,0.15)',
              border: '1px solid rgba(212,175,55,0.3)',
              color: '#d4af37',
              fontSize: '1.5rem',
              width: 44,
              height: 44,
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            ‹
          </button>

          {/* Dots */}
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: i === current ? '#d4af37' : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}

          <button
            onClick={goNext}
            aria-label="Next"
            style={{
              background: 'rgba(212,175,55,0.15)',
              border: '1px solid rgba(212,175,55,0.3)',
              color: '#d4af37',
              fontSize: '1.5rem',
              width: 44,
              height: 44,
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            ›
          </button>
        </div>
      </div>

      {/* Trust Indicators */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          marginTop: '3.5rem',
          flexWrap: 'wrap',
        }}
      >
        {TRUST_INDICATORS.map(ind => (
          <div key={ind.value}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-d4af37, #d4af37)' }}>{ind.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{ind.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
