import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
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

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay]);

  const navigate = (dir) => {
    setAutoplay(false);
    setDirection(dir);
    setActiveIndex((prev) => {
      if (dir === 1) return (prev + 1) % testimonials.length;
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const current = testimonials[activeIndex];

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

        <div className="testimonials-carousel">
          <motion.button 
            className="carousel-nav prev"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
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
                <div className="quote-icon">
                  <Quote size={40} />
                </div>
                
                <div className="testimonial-rating">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="#FFB300" color="#FFB300" />
                  ))}
                </div>

                <blockquote className="testimonial-text">
                  "{current.text}"
                </blockquote>

                <div className="testimonial-footer">
                  <img 
                    src={current.avatar} 
                    alt={current.name}
                    className="testimonial-avatar"
                  />
                  <div className="testimonial-author">
                    <h4 className="author-name">{current.name}</h4>
                    <p className="author-role">{current.role}</p>
                    <p className="author-property">{current.property}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.button 
            className="carousel-nav next"
            onClick={() => navigate(1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => {
                setAutoplay(false);
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
            />
          ))}
        </div>

        <motion.div 
          className="review-invitation"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="review-box">
            <h3>Share Your Experience!</h3>
            <p>Had a great experience with White Caves? We'd love to hear from you!</p>
            <div className="star-invite">
              <span className="star-text">Rate us:</span>
              <a href="https://g.page/r/whitecaves/review" target="_blank" rel="noopener noreferrer" className="star-link">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={28} fill="#FFB300" color="#FFB300" className="star-icon" />
                ))}
              </a>
            </div>
            <p className="review-note">Your feedback helps us serve you better!</p>
          </div>
        </motion.div>

        <div className="client-logos">
          <motion.div 
            className="logos-track"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="trusted-by">Trusted by leading companies worldwide</span>
            <div className="logos-container">
              <div className="logo-placeholder">RERA Licensed</div>
              <div className="logo-placeholder">DLD Registered</div>
              <div className="logo-placeholder">Dubai Chamber</div>
              <div className="logo-placeholder">UAE Certified</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
