import React from 'react';
import './ContactUs.css';

export default function ContactUs() {
  return (
    <div className="contact-info">
      <h2>Contact White Caves Real Estate LLC</h2>
      <p>📍 Office D-72, El-Shaye-4, Port Saeed, Dubai</p>
      <p>📧 admin@whitecaves.com</p>
      <p>📞 Office: +971 56 361 6136</p>
      <p>📱 Mobile: +971 56 361 6136</p>
      <p>🌐 www.whitecaves.com</p>
      <p>🕐 Mon - Fri: 9:00 AM - 6:00 PM</p>
      <p>🕐 Sat: 10:00 AM - 4:00 PM</p>
      
      <div className="contact-methods flex-center-x gap-lg">
        {/* Contact buttons would go here if defined */}
      </div>
    </div>
  );
}
