import React, { useCallback, useState } from 'react';
import {
  CompanyProfileSection,
  CompanyProfileContainer,
  CompanyProfileHeader,
  CompanyLogoLarge,
  CompanyProfileTitle,
  CompanyTagline,
  CompanyProfileGrid,
  ProfileCard,
  ProfileCardIcon,
  CompanyServicesOverview,
  ServicesList,
  ServiceItem,
  ServiceIcon,
  CompanyStatsBar,
  StatBlock,
  StatNumber,
  StatLabel,
  CompanyContactInfo,
  ContactGrid,
  ContactItem,
  ContactIcon,
  CompanyProfileCTA,
  DownloadProfileBtn,
  DownloadHint,
} from './CompanyProfile.styles';

export default function CompanyProfile() {
  const [downloadMsg, setDownloadMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleDownloadPDF = useCallback(async () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    const baseUrl = import.meta.env.BASE_URL || '/';
    const pdfUrl = `${baseUrl}White-Caves-Company-Profile.pdf`.replace('//', '/');

    try {
      // Verify the file exists before attempting download
      const response = await fetch(pdfUrl, { method: 'HEAD' });
      if (!response.ok) {
        setDownloadMsg({
          type: 'error',
          text: 'Company profile PDF is not available at this time. Please contact support.',
        });
        return;
      }

      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'White-Caves-Company-Profile.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadMsg({ type: 'success', text: 'Download started!' });
    } catch {
      setDownloadMsg({
        type: 'error',
        text: 'Unable to download the company profile. Please check your connection and try again.',
      });
    }
  }, []);

  return (
    <CompanyProfileSection id="company-profile">
      <CompanyProfileContainer>
        <CompanyProfileHeader>
          <CompanyLogoLarge
            src={`${import.meta.env.BASE_URL || '/'}company-logo.jpg`}
            alt="White Caves Real Estate"
          />
          <CompanyProfileTitle>
            <h2>White Caves Real Estate LLC</h2>
            <CompanyTagline>Dubai&apos;s Premier Luxury Property Partner</CompanyTagline>
          </CompanyProfileTitle>
        </CompanyProfileHeader>

        <CompanyProfileGrid>
          <ProfileCard>
            <ProfileCardIcon>🏢</ProfileCardIcon>
            <h3>Who We Are</h3>
            <p>
              White Caves Real Estate is a leading Dubai-based real estate agency specializing in
              luxury residential and commercial properties across the UAE. With over 15 years of
              experience, we&apos;ve built a reputation for excellence, integrity, and exceptional
              client service.
            </p>
          </ProfileCard>

          <ProfileCard>
            <ProfileCardIcon>🎯</ProfileCardIcon>
            <h3>Our Mission</h3>
            <p>
              To provide unparalleled real estate services that exceed expectations, connecting
              discerning clients with their dream properties while ensuring transparent, efficient,
              and personalized transactions.
            </p>
          </ProfileCard>

          <ProfileCard>
            <ProfileCardIcon>🌟</ProfileCardIcon>
            <h3>Our Vision</h3>
            <p>
              To be the most trusted and innovative real estate company in the UAE, setting industry
              standards for customer satisfaction, technological advancement, and sustainable
              business practices.
            </p>
          </ProfileCard>

          <ProfileCard>
            <ProfileCardIcon>📋</ProfileCardIcon>
            <h3>RERA Licensed</h3>
            <p>
              Fully licensed and regulated by the Real Estate Regulatory Agency (RERA) and Dubai
              Land Department (DLD), ensuring complete compliance with UAE real estate laws and
              regulations.
            </p>
          </ProfileCard>
        </CompanyProfileGrid>

        <CompanyServicesOverview>
          <h3>Our Services</h3>
          <ServicesList>
            <ServiceItem>
              <ServiceIcon>🏠</ServiceIcon>
              <span>Property Sales & Purchases</span>
            </ServiceItem>
            <ServiceItem>
              <ServiceIcon>🔑</ServiceIcon>
              <span>Residential Rentals</span>
            </ServiceItem>
            <ServiceItem>
              <ServiceIcon>🏗️</ServiceIcon>
              <span>Off-Plan Investments</span>
            </ServiceItem>
            <ServiceItem>
              <ServiceIcon>🏢</ServiceIcon>
              <span>Commercial Properties</span>
            </ServiceItem>
            <ServiceItem>
              <ServiceIcon>📄</ServiceIcon>
              <span>Property Management</span>
            </ServiceItem>
            <ServiceItem>
              <ServiceIcon>💼</ServiceIcon>
              <span>Investment Advisory</span>
            </ServiceItem>
            <ServiceItem>
              <ServiceIcon>🏖️</ServiceIcon>
              <span>Holiday Homes</span>
            </ServiceItem>
            <ServiceItem>
              <ServiceIcon>📊</ServiceIcon>
              <span>Market Analysis</span>
            </ServiceItem>
          </ServicesList>
        </CompanyServicesOverview>

        <CompanyStatsBar>
          <StatBlock>
            <StatNumber>500+</StatNumber>
            <StatLabel>Properties Listed</StatLabel>
          </StatBlock>
          <StatBlock>
            <StatNumber>1000+</StatNumber>
            <StatLabel>Happy Clients</StatLabel>
          </StatBlock>
          <StatBlock>
            <StatNumber>15+</StatNumber>
            <StatLabel>Years Experience</StatLabel>
          </StatBlock>
          <StatBlock>
            <StatNumber>50+</StatNumber>
            <StatLabel>Expert Agents</StatLabel>
          </StatBlock>
        </CompanyStatsBar>

        <CompanyContactInfo>
          <h3>Contact Information</h3>
          <ContactGrid>
            <ContactItem>
              <ContactIcon>📍</ContactIcon>
              <div>
                <strong>Head Office</strong>
                <p>Office D-72, El-Shaye-4, Port Saeed, Deira, Dubai, UAE</p>
              </div>
            </ContactItem>
            <ContactItem>
              <ContactIcon>📞</ContactIcon>
              <div>
                <strong>Phone</strong>
                <p>+971-56-361-6136</p>
              </div>
            </ContactItem>
            <ContactItem>
              <ContactIcon>📱</ContactIcon>
              <div>
                <strong>WhatsApp</strong>
                <p>+971-56-361-6136</p>
              </div>
            </ContactItem>
            <ContactItem>
              <ContactIcon>✉️</ContactIcon>
              <div>
                <strong>Email</strong>
                <p>admin@whitecaves.com</p>
              </div>
            </ContactItem>
          </ContactGrid>
        </CompanyContactInfo>

        <CompanyProfileCTA>
          {downloadMsg && (
            <div
              role={downloadMsg.type === 'error' ? 'alert' : 'status'}
              data-testid="company-profile-msg"
              style={{
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '12px',
                background: downloadMsg.type === 'error' ? '#fdecea' : '#e8f5e9',
                borderLeft: `4px solid ${downloadMsg.type === 'error' ? '#f44336' : '#4caf50'}`,
                color: downloadMsg.type === 'error' ? '#b71c1c' : '#2e7d32',
              }}
            >
              {downloadMsg.type === 'success' ? '✅ ' : '⚠️ '}
              {downloadMsg.text}
            </div>
          )}
          <DownloadProfileBtn onClick={handleDownloadPDF}>
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Company Profile (PDF)
          </DownloadProfileBtn>
          <DownloadHint>Get our complete company brochure with detailed information</DownloadHint>
        </CompanyProfileCTA>
      </CompanyProfileContainer>
    </CompanyProfileSection>
  );
}
