import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, BadgeCheck } from 'lucide-react';
import { TIMING } from '../../../constants/app';
import './Testimonials.css';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  property: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'James Richardson',
    role: 'Property Investor',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    rating: 5,
    text: 'White Caves made my property investment journey in Dubai seamless. Their team\'s expertise in the luxury market is unmatched. I found my perfect villa in Palm Jumeirah within weeks.',
    property: 'Palm Jumeirah Villa'
  },
  {
    id: 2,
    name: 'Maria Santos',
    role: 'Business Executive',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    rating: 5,
    text: 'Professional, knowledgeable, and incredibly responsive. The team at White Caves helped me find the perfect apartment in Downtown Dubai with stunning Burj Khalifa views.',
    property: 'Downtown Dubai Apartment'
  },
  {
    id: 3,
    name: 'Ahmed Al Mansouri',
    role: 'CEO, Tech Startup',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 5,
    text: 'I\'ve worked with many real estate agencies, but White Caves stands out for their attention to detail and deep understanding of the Dubai market. Highly recommended!',
    property: 'Emirates Hills Estate'
  },
  {
    id: 4,
    name: 'Sophie Chen',
    role: 'Entrepreneur',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    rating: 5,
    text: 'From the first consultation to the final handover, White Caves provided exceptional service. Their virtual tour technology helped me finalize my purchase from overseas.',
    property: 'Dubai Marina Penthouse'
  }
];

interface Variants {
  [key: string]: {
    x: number | number[];
    opacity: number;
  };
}

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [autoplay, setAutoplay] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Progress bar tick
  useEffect(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    const resetTimer = setTimeout(() => setProgress(0), 0);
    if (!autoplay) return;
    const tickMs = 50;
    const totalMs = TIMING.CAROUSEL_AUTOPLAY as number;
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (tickMs / totalMs) * 100;
        return next >= 100 ? 100 : next;
      });
    }, tickMs);
    return () => {
      clearTimeout(resetTimer);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [autoplay, activeIndex]);

  // Advance slide
  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, TIMING.CAROUSEL_AUTOPLAY);
    return () => clearInterval(timer);
  }, [autoplay]);

  const navigateCarousel = (dir: number): void => {
    setAutoplay(false);
    setProgress(0);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setAutoplay(true), TIMING.CAROUSEL_RESUME);
    setDirection(dir);
    setActiveIndex((prev) => {
      if (dir === 1) return (prev + 1) % testimonials.length;
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  };

  const variants: Variants = {
    enter: {
      x: direction > 0 ? 300 : -300,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: direction < 0 ? 300 : -300,
      opacity: 0
    }
  };

  const current = testimonials.find((_, index) => index === activeIndex) ?? testimonials[0];

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Testimonials</span>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Hear from satisfied clients who found their dream properties with White Caves
          </p>
          <div className="divider" />
        </motion.div>

        {/* Screen-reader live region */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {`Testimonial ${activeIndex + 1} of ${testimonials.length}: ${current.name}, ${current.role}`}
        </div>

        <div className="testimonials-carousel" role="region" aria-label="Client testimonials">
          <motion.button 
            className="carousel-nav prev"
            onClick={() => navigateCarousel(-1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </motion.button>

          <div className="carousel-content">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                className="testimonial-card"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {/* Gold watermark quote mark */}
                <span className="testimonial-watermark" aria-hidden="true">&ldquo;</span>

                {/* Verified Client badge */}
                <div className="verified-badge">
                  <BadgeCheck size={14} aria-hidden="true" />
                  <span>Verified Client</span>
                </div>

                <div className="quote-icon">
                  <Quote size={40} />
                </div>
                
                <div className="testimonial-rating">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={`star-${i}`} size={20} fill="#FFB300" color="#FFB300" />
                  ))}
                </div>

                <blockquote className="testimonial-text">
                  &ldquo;{current.text}&rdquo;
                </blockquote>

                <div className="testimonial-footer">
                  <img 
                    src={current.avatar} 
                    alt={current.name}
                    className="testimonial-avatar"
                    loading="lazy"
                  />
                  <div className="testimonial-author">
                    <h4 className="author-name">{current.name}</h4>
                    <p className="author-role">{current.role}</p>
                    <p className="author-property">{current.property}</p>
                  </div>
                </div>

                {/* Autoplay progress bar */}
                <div className="testimonial-progress-track" aria-hidden="true">
                  <motion.div
                    className="testimonial-progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.button 
            className="carousel-nav next"
            onClick={() => navigateCarousel(1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

        <div className="carousel-indicators" role="tablist" aria-label="Testimonial navigation">
          {testimonials.map((testimonial, index) => (
            <motion.button
              key={testimonial.name}
              className={`indicator ${index === activeIndex ? 'active' : ''}`}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
                setProgress(0);
                setAutoplay(false);
              }}
              whileHover={{ scale: 1.2 }}
              aria-label={`Go to testimonial ${index + 1}: ${testimonial.name}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              role="tab"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;

