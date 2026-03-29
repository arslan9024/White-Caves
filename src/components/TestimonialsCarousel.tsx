import React, { useState, useEffect, useRef } from 'react';
import * as S from './TestimonialsCarousel.styles';

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
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup resume timers on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    pauseAutoPlay();
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    pauseAutoPlay();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    pauseAutoPlay();
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <S.Star key={`star-${i}`} $filled={i < rating}>
          ★
        </S.Star>
      ));
  };

  return (
    <S.TestimonialsSection>
      <S.TestimonialsContainer>
        <S.TestimonialsHeader>
          <S.HeaderTitle>What Our Clients Say</S.HeaderTitle>
          <S.HeaderSubtitle>
            Trusted by investors and homeowners across the globe
          </S.HeaderSubtitle>
        </S.TestimonialsHeader>

        <S.CarouselWrapper>
          <S.CarouselBtn onClick={goToPrev}>‹</S.CarouselBtn>

          <S.CarouselTrack>
            {testimonials.map((testimonial, index) => (
              <S.TestimonialCard
                key={testimonial.id}
                $active={index === currentIndex}
                style={{
                  transform: `translateX(${(index - currentIndex) * 100}%) scale(${
                    index === currentIndex ? 1 : 0.85
                  })`,
                  opacity: Math.abs(index - currentIndex) <= 1 ? 1 : 0,
                  zIndex: index === currentIndex ? 2 : 1
                }}
              >
                <S.QuoteIcon>"</S.QuoteIcon>
                <S.TestimonialText>{testimonial.text}</S.TestimonialText>
                <S.PropertyPurchased>{testimonial.property}</S.PropertyPurchased>
                <S.TestimonialRating>
                  {renderStars(testimonial.rating)}
                </S.TestimonialRating>
                <S.TestimonialAuthor>
                  <S.AuthorImage
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                  <S.AuthorInfo>
                    <S.AuthorName>{testimonial.name}</S.AuthorName>
                    <S.AuthorRole>{testimonial.role}</S.AuthorRole>
                  </S.AuthorInfo>
                </S.TestimonialAuthor>
              </S.TestimonialCard>
            ))}
          </S.CarouselTrack>

          <S.CarouselBtn onClick={goToNext}>›</S.CarouselBtn>
        </S.CarouselWrapper>

        <S.CarouselDots>
          {testimonials.map((testimonial, index) => (
            <S.Dot
              key={testimonial.id}
              $active={index === currentIndex}
              onClick={() => goToSlide(index)}
            />
          ))}
        </S.CarouselDots>

        <S.TrustIndicators>
          <S.TrustItem>
            <S.TrustNumber>500+</S.TrustNumber>
            <S.TrustLabel>Happy Clients</S.TrustLabel>
          </S.TrustItem>
          <S.TrustItem>
            <S.TrustNumber>4.9/5</S.TrustNumber>
            <S.TrustLabel>Average Rating</S.TrustLabel>
          </S.TrustItem>
          <S.TrustItem>
            <S.TrustNumber>AED 2B+</S.TrustNumber>
            <S.TrustLabel>Properties Sold</S.TrustLabel>
          </S.TrustItem>
        </S.TrustIndicators>
      </S.TestimonialsContainer>
    </S.TestimonialsSection>
  );
}
