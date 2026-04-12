import styled from 'styled-components';
import { theme } from '../styles/theme';

const { shadows, transitions, colors, radius } = theme;

export const CompanyProfileSection = styled.section`
  padding: 5rem 2rem;
  background: var(--bg-secondary, #f8f9fa);

  [data-theme='dark'] & {
    background: var(--bg-secondary, #1a1a2e);
  }
`;

export const CompanyProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const CompanyProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--primary-color, ${colors.primary});

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const CompanyLogoLarge = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: ${radius.xxl};
  box-shadow: ${shadows.luxuryElevated};
`;

export const CompanyProfileTitle = styled.div`
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary, #1a1a2e);
    margin: 0 0 0.5rem 0;

    [data-theme='dark'] & {
      color: var(--text-primary, #ffffff);
    }
  }
`;

export const CompanyTagline = styled.p`
  font-size: 1.25rem;
  color: var(--primary-color, ${colors.primary});
  font-weight: 500;
  margin: 0;
`;

export const CompanyProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

export const ProfileCard = styled.div`
  background: var(--card-bg, #ffffff);
  border-radius: ${radius.xxl};
  padding: 2rem;
  box-shadow: ${shadows.luxuryCard};
  transition: transform ${transitions.durations.standard} ${transitions.easing.easeOut}, box-shadow ${transitions.durations.standard} ${transitions.easing.easeOut};

  [data-theme='dark'] & {
    background: var(--card-bg, ${colors.background.darkSecondary});
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.luxuryHover};
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary, #1a1a2e);
    margin: 0 0 0.75rem 0;

    [data-theme='dark'] & {
      color: var(--text-primary, #ffffff);
    }
  }

  p {
    font-size: 0.95rem;
    color: var(--text-secondary, #6b7280);
    line-height: 1.6;
    margin: 0;

    [data-theme='dark'] & {
      color: var(--text-secondary, #a0a0a0);
    }
  }
`;

export const ProfileCardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

export const CompanyServicesOverview = styled.div`
  background: var(--card-bg, #ffffff);
  border-radius: ${radius.xxl};
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: ${shadows.luxuryCard};

  [data-theme='dark'] & {
    background: var(--card-bg, ${colors.background.darkSecondary});
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary, #1a1a2e);
    margin: 0 0 1.5rem 0;
    text-align: center;

    [data-theme='dark'] & {
      color: var(--text-primary, #ffffff);
    }
  }
`;

export const ServicesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

export const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary, #f8f9fa);
  border-radius: ${radius.lg};
  transition: background 0.2s ease;

  [data-theme='dark'] & {
    background: var(--bg-tertiary, #1a1a2e);
  }

  &:hover {
    background: var(--primary-light, rgba(212, 175, 55, 0.1));
  }

  span:last-child {
    font-size: 0.9rem;
    color: var(--text-primary, #1a1a2e);
    font-weight: 500;

    [data-theme='dark'] & {
      color: var(--text-primary, #ffffff);
    }
  }
`;

export const ServiceIcon = styled.span`
  font-size: 1.25rem;
`;

export const CompanyStatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    var(--primary-color, ${colors.primary}),
    var(--primary-dark, ${colors.primaryDark})
  );
  border-radius: ${radius.xxl};

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StatBlock = styled.div`
  text-align: center;
  color: white;
`;

export const StatNumber = styled.span`
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

export const StatLabel = styled.span`
  display: block;
  font-size: 0.9rem;
  opacity: 0.9;
`;

export const CompanyContactInfo = styled.div`
  background: var(--card-bg, #ffffff);
  border-radius: ${radius.xxl};
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: ${shadows.luxuryCard};

  [data-theme='dark'] & {
    background: var(--card-bg, ${colors.background.darkSecondary});
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary, ${colors.text.primary});
    margin: 0 0 1.5rem 0;

    [data-theme='dark'] & {
      color: var(--text-primary, ${colors.text.inverse});
    }
  }
`;

export const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  div {
    flex: 1;

    strong {
      display: block;
      color: var(--text-primary, #1a1a2e);
      margin-bottom: 0.25rem;

      [data-theme='dark'] & {
        color: var(--text-primary, #ffffff);
      }
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-secondary, #6b7280);

      [data-theme='dark'] & {
        color: var(--text-secondary, #a0a0a0);
      }
    }
  }
`;

export const ContactIcon = styled.span`
  font-size: 1.5rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
`;

export const CompanyProfileCTA = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

export const DownloadProfileBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(
    135deg,
    var(--primary-color, ${colors.primary}),
    var(--primary-dark, ${colors.primaryDark})
  );
  color: white;
  border: none;
  border-radius: ${radius.lg};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${transitions.durations.standard} ${transitions.easing.easeOut};

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.luxuryGlow};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const DownloadHint = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary, #6b7280);

  [data-theme='dark'] & {
    color: var(--text-secondary, #a0a0a0);
  }
`;
