import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
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

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [autoplay, setAutoplay] = useState<boolean>(true);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay]);

  const navigate = (dir: number): void => {
    setAutoplay(false);
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

        <div className="carousel-indicators">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              className={`indicator ${index === activeIndex ? 'active' : ''}`}
              onClick={() => {
                setActiveIndex(index);
                setAutoplay(false);
              }}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
