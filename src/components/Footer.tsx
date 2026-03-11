import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';
import * as S from './Footer.styles';

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <S.FooterContainer>
      <S.FooterContent>
        <S.FooterBrand>
          <S.FooterLogo src="/company-logo.jpg" alt="White Caves Real Estate LLC" />
          <S.FooterTagline>Your trusted partner in Dubai luxury real estate since 2010</S.FooterTagline>
          <S.FooterContact>
            <p><S.ContactIcon>📍</S.ContactIcon> Office D-72, El-Shaye-4, Port Saeed, Dubai</p>
            <p><S.ContactIcon>📞</S.ContactIcon> Office: +971 4 335 0592</p>
            <p><S.ContactIcon>📱</S.ContactIcon> Mobile: +971 56 361 6136</p>
            <p><S.ContactIcon>📧</S.ContactIcon> admin@whitecaves.com</p>
            <p><S.ContactIcon>🌐</S.ContactIcon> www.whitecaves.com</p>
          </S.FooterContact>
          <S.FooterApps>
            <S.AppsTitle>Contact us on:</S.AppsTitle>
            <S.AppButtons>
              <S.AppBtn href="https://wa.me/971563616136" target="_blank" rel="noopener noreferrer" platform="whatsapp">
                <span>WhatsApp</span>
              </S.AppBtn>
              <S.AppBtn href="botim://call?number=+971563616136" platform="botim">
                <span>Botim</span>
              </S.AppBtn>
              <S.AppBtn href="https://gochat.me/+971563616136" target="_blank" rel="noopener noreferrer" platform="gochat">
                <span>GoChat</span>
              </S.AppBtn>
            </S.AppButtons>
          </S.FooterApps>
        </S.FooterBrand>
        
        <S.FooterSection>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </S.FooterSection>
        
        <S.FooterSection>
          <h3>Property Types</h3>
          <ul>
            <li><Link to="/properties?type=villa">Villas</Link></li>
            <li><Link to="/properties?type=apartment">Apartments</Link></li>
            <li><Link to="/properties?type=penthouse">Penthouses</Link></li>
            <li><Link to="/properties?type=townhouse">Townhouses</Link></li>
            <li><Link to="/properties?type=commercial">Commercial</Link></li>
            <li><Link to="/properties?type=offplan">Off-Plan</Link></li>
          </ul>
        </S.FooterSection>
        
        <S.FooterSection>
          <h3>Popular Areas</h3>
          <ul>
            <li><Link to="/properties?location=palm-jumeirah">Palm Jumeirah</Link></li>
            <li><Link to="/properties?location=downtown">Downtown Dubai</Link></li>
            <li><Link to="/properties?location=emirates-hills">Emirates Hills</Link></li>
            <li><Link to="/properties?location=dubai-marina">Dubai Marina</Link></li>
            <li><Link to="/properties?location=jumeirah">Jumeirah</Link></li>
            <li><Link to="/properties?location=business-bay">Business Bay</Link></li>
          </ul>
        </S.FooterSection>
        
        <S.FooterSection>
          <h3>Connect With Us</h3>
          <SocialLinks />
          <S.FooterRating>
            <p>Love our service? Leave us a review!</p>
            <S.StarRatingFooter>
              <a href="https://g.page/r/whitecaves/review" target="_blank" rel="noopener noreferrer">
                ★★★★★
              </a>
            </S.StarRatingFooter>
          </S.FooterRating>
          <S.FooterRERA>
            <S.Badge type="rera">RERA Licensed</S.Badge>
            <S.Badge type="dld">Dubai Land Department Registered</S.Badge>
          </S.FooterRERA>
        </S.FooterSection>
      </S.FooterContent>
      
      <S.FooterBottom>
        <S.FooterBottomContent>
          <p>© {currentYear} White Caves Real Estate LLC. All rights reserved.</p>
          <S.FooterLegal>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </S.FooterLegal>
        </S.FooterBottomContent>
      </S.FooterBottom>
    </S.FooterContainer>
  );
};

export default Footer;
