import React from 'react';
import {
  ContactContainer,
  ContactTitle,
  ContactText,
  ContactMethods,
} from './ContactUs.styles';
import { Config } from '../config/constants';

export default function ContactUs() {
  return (
    <ContactContainer>
      <ContactTitle>Contact {Config.COMPANY.NAME}</ContactTitle>
      <ContactText>📍 {Config.COMPANY.ADDRESS}</ContactText>
      <ContactText>📧 {Config.COMPANY.EMAIL}</ContactText>
      <ContactText>📞 Office: {Config.COMPANY.PHONE}</ContactText>
      <ContactText>📱 Mobile: {Config.COMPANY.PHONE}</ContactText>
      <ContactText>🌐 www.whitecaves.com</ContactText>
      <ContactText>🕐 Mon - Fri: 9:00 AM - 6:00 PM</ContactText>
      <ContactText>🕐 Sat: 10:00 AM - 4:00 PM</ContactText>
      
      <ContactMethods>
        {/* Contact buttons would go here if defined */}
      </ContactMethods>
    </ContactContainer>
  );
}
