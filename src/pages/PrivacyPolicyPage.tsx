import React, { FC } from 'react';
import { useSEO, getCanonicalUrl } from '../hooks/useSEO';
import PublicLayout from '../components/layout/PublicLayout';
import './LegalPages.css';

const PrivacyPolicyPage: FC = () => {
  useSEO({
    title: 'Privacy Policy | White Caves Real Estate',
    description:
      'Learn how White Caves Real Estate protects your personal information and privacy.',
    canonicalUrl: getCanonicalUrl('/privacy-policy'),
  });

  return (
    <PublicLayout>
      <div className="legal-page">
        <div className="legal-container">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: January 2026</p>

          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              White Caves Real Estate LLC (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;, or
              &ldquo;Company&rdquo;) is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you visit
              our website, including any other media form, media channel, mobile website, or mobile
              application (collectively, the &ldquo;Site&rdquo;).
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may
              collect on the Site includes:
            </p>
            <ul>
              <li>
                <strong>Personal Data:</strong> Name, email address, phone number, mailing address,
                and property preferences
              </li>
              <li>
                <strong>Device Data:</strong> Browser type, IP address, and accessing pages
              </li>
              <li>
                <strong>Financial Information:</strong> Payment information collected through secure
                payment processors
              </li>
              <li>
                <strong>Cookies and Tracking:</strong> We use cookies to enhance user experience
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Use of Information</h2>
            <p>We use the information we collect in the following ways:</p>
            <ul>
              <li>To provide, operate, and maintain our services</li>
              <li>To improve, personalize, and expand our services</li>
              <li>To understand and analyze how you use our services</li>
              <li>To communicate with you about your account or property inquiries</li>
              <li>To process your transactions and send related information</li>
              <li>
                To email you regarding updates or informational materials related to our services
              </li>
              <li>To respond to your comments or inquiries</li>
              <li>For marketing and promotional purposes</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Disclosure of Your Information</h2>
            <p>We may share information we have collected about you in certain situations:</p>
            <ul>
              <li>
                <strong>By Law or to Protect Rights:</strong> If required by law or if we believe
                that disclosure is necessary to protect our rights
              </li>
              <li>
                <strong>Service Providers:</strong> We may disclose your information to service
                providers who assist us in operating our website and conducting our business
              </li>
              <li>
                <strong>Business Transfers:</strong> Your information may be transferred as part of
                our business merger, bankruptcy, sale of assets, or other business transaction
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Security</h2>
            <p>
              We use administrative, technical, and physical security measures to protect your
              personal information. However, no method of transmission over the internet or
              electronic storage is completely secure. While we strive to use commercially
              acceptable means to protect your information, we cannot guarantee its absolute
              security.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <p>
              White Caves Real Estate LLC
              <br />
              Office D-72, El-Shaye-4, Port Saeed, Dubai
              <br />
              Email: admin@whitecaves.com
              <br />
              Phone: +971 4 335 0592
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PrivacyPolicyPage;
