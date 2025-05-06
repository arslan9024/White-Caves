
import React from 'react';
import './ContactUs.css';

export default function ContactUs() {
  const whatsappNumber = '+971XXXXXXXX'; // Replace with your actual WhatsApp number
  const emailAddress = 'info@whitecaves.ae';

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${emailAddress}`;
  };

  return (
    <div className="contact-us-container">
      <h2>Contact Us</h2>
      <p>Get in touch with us through your preferred communication channel</p>
      
      <div className="contact-methods">
        <button className="contact-button email" onClick={handleEmailClick}>
          <span className="icon">✉️</span>
          <div className="contact-info">
            <h3>Email Us</h3>
            <p>{emailAddress}</p>
          </div>
        </button>

        <button className="contact-button whatsapp" onClick={handleWhatsAppClick}>
          <span className="icon">💬</span>
          <div className="contact-info">
            <h3>WhatsApp</h3>
            <p>Click to chat with us</p>
          </div>
        </button>
      </div>
    </div>
  );
}
