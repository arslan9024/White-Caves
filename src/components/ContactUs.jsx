import React from 'react';
import {
  ContactContainer,
  ContactTitle,
  ContactText,
  ContactMethods,
} from './ContactUs.styles';

export default function ContactUs() {
  return (
    <ContactContainer>
      <ContactTitle>Contact White Caves Real Estate LLC</ContactTitle>
      <ContactText>📍 Office D-72, El-Shaye-4, Port Saeed, Dubai</ContactText>
      <ContactText>📧 admin@whitecaves.com</ContactText>
      <ContactText>📞 Office: +971 56 361 6136</ContactText>
      <ContactText>📱 Mobile: +971 56 361 6136</ContactText>
      <ContactText>🌐 www.whitecaves.com</ContactText>
      <ContactText>🕐 Mon - Fri: 9:00 AM - 6:00 PM</ContactText>
      <ContactText>🕐 Sat: 10:00 AM - 4:00 PM</ContactText>
      
      <ContactMethods>
        {/* Contact buttons would go here if defined */}
      </ContactMethods>
    </ContactContainer>
  );
}
