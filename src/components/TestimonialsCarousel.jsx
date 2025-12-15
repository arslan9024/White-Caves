import React, { useState, useEffect } from 'react';
import './TestimonialsCarousel.css';

const testimonials = [
  {
    id: 1,
    name: "James Wilson",
    role: "Property Investor, UK",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
    rating: 5,
    text: "White Caves made my Dubai property investment journey incredibly smooth. Their market knowledge and professional approach exceeded all expectations. I now own two apartments in Downtown Dubai.",
    property: "Purchased: Penthouse in Downtown Dubai"
  },
  {
    id: 2,
    name: "Fatima Al-Zahra",
    role: "Business Owner, UAE",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
    rating: 5,
    text: "After searching for months, White Caves found us the perfect family villa in Arabian Ranches. The team handled everything from viewing to EJARI registration. Truly exceptional service!",
    property: "Purchased: 5BR Villa in Arabian Ranches"
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Tech Executive, Singapore",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
    rating: 5,
    text: "The White Caves team's expertise in Dubai's luxury market is unmatched. They helped me secure a stunning Palm Jumeirah villa with incredible sea views. Highly recommended!",
    property: "Purchased: Beachfront Villa in Palm Jumeirah"
  },
  {
    id: 4,
    name: "Elena Petrov",
    role: "Consultant, Russia",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
    rating: 5,
    text: "I relocated to Dubai for work and White Caves made finding the perfect apartment effortless. Great communication, transparent process, and beautiful properties to choose from.",
    property: "Rented: 2BR Apartment in Dubai Marina"
  },
  {
    id: 5,
    name: "Ahmed Hassan",
    role: "Doctor, Egypt",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
    rating: 5,
    text: "As a first-time property buyer in Dubai, I had many questions. The White Caves team patiently guided me through every step. Now I'm a proud owner of a townhouse in JVC!",
    property: "Purchased: 4BR Townhouse in JVC"
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2>What Our Clients Say</h2>
          <p>Trusted by investors and homeowners across the globe</p>
        </div>

        <div className="carousel-wrapper">
          <button className="carousel-btn prev" onClick={goToPrev}>‹</button>
          
          <div className="carousel-track">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`testimonial-card ${index === currentIndex ? 'active' : ''} ${
                  index === (currentIndex - 1 + testimonials.length) % testimonials.length ? 'prev' : ''
                } ${
                  index === (currentIndex + 1) % testimonials.length ? 'next' : ''
                }`}
                style={{
                  transform: `translateX(${(index - currentIndex) * 100}%) scale(${index === currentIndex ? 1 : 0.85})`,
                  opacity: Math.abs(index - currentIndex) <= 1 ? 1 : 0,
                  zIndex: index === currentIndex ? 2 : 1
                }}
              >
                <div className="quote-icon">"</div>
                <p className="testimonial-text">{testimonial.text}</p>
                <p className="property-purchased">{testimonial.property}</p>
                <div className="testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.name} className="author-image" />
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="carousel-btn next" onClick={goToNext}>›</button>
        </div>

        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        <div className="trust-indicators">
          <div className="trust-item">
            <span className="trust-number">500+</span>
            <span className="trust-label">Happy Clients</span>
          </div>
          <div className="trust-item">
            <span className="trust-number">4.9/5</span>
            <span className="trust-label">Average Rating</span>
          </div>
          <div className="trust-item">
            <span className="trust-number">AED 2B+</span>
            <span className="trust-label">Properties Sold</span>
          </div>
        </div>
      </div>
    </section>
  );
}
