// FILE: src/components/crm/ArcherCRM.data.js
export const SCORED_LEADS = [
  {
    id: 1,
    name: 'Ahmad Al Rashidi',
    score: 94,
    budget: 'AED 3.5M',
    source: 'WhatsApp',
    interest: 'Palm Jumeirah Villa',
    velocity: 'High',
    change: +4,
  },
  {
    id: 2,
    name: 'Priya Nair',
    score: 88,
    budget: 'AED 1.8M',
    source: 'Web Form',
    interest: 'Dubai Marina Apt',
    velocity: 'High',
    change: +12,
  },
  {
    id: 3,
    name: 'James Whitmore',
    score: 76,
    budget: 'AED 5M+',
    source: 'Referral',
    interest: 'Emirates Hills',
    velocity: 'Medium',
    change: -3,
  },
  {
    id: 4,
    name: 'Fatima Al Suwaidi',
    score: 71,
    budget: 'AED 2.2M',
    source: 'Portal',
    interest: 'Downtown Dubai',
    velocity: 'Medium',
    change: +8,
  },
  {
    id: 5,
    name: 'Chen Wei',
    score: 62,
    budget: 'AED 900K',
    source: 'Social',
    interest: 'JVC Studio',
    velocity: 'Low',
    change: -1,
  },
  {
    id: 6,
    name: 'Sara Müller',
    score: 55,
    budget: 'AED 1.2M',
    source: 'Email',
    interest: 'Business Bay',
    velocity: 'Low',
    change: +2,
  },
  {
    id: 7,
    name: 'Ravi Patel',
    score: 48,
    budget: 'AED 750K',
    source: 'Cold',
    interest: 'Al Barsha',
    velocity: 'Low',
    change: -5,
  },
];

export const SCORING_FACTORS = [
  { factor: 'Enquiry Channel', weight: 20, description: 'WhatsApp direct = high intent signal' },
  {
    factor: 'Budget Specificity',
    weight: 18,
    description: 'Precise AED figure vs. "flexible" range',
  },
  {
    factor: 'Community Match',
    weight: 22,
    description: 'Desired area vs. available inventory overlap',
  },
  {
    factor: 'Engagement Velocity',
    weight: 25,
    description: 'Response time, message count, viewing requests',
  },
  {
    factor: 'Historical Patterns',
    weight: 15,
    description: 'Similar lead profile win-rate from past data',
  },
];

export const QUEUE_STATS = [
  { label: 'Hot Leads (80+)', value: 2, color: 'var(--error-color)' },
  { label: 'Warm Leads (60–79)', value: 3, color: '#F97316' },
  { label: 'Cold Leads (<60)', value: 2, color: '#6B7280' },
];

export const getScoreColor = score => {
  if (score >= 80) return '#E31E24';
  if (score >= 60) return '#F97316';
  return '#6B7280';
};

export const getVelocityBadge = v => {
  const map = { High: '#22C55E', Medium: '#F59E0B', Low: '#6B7280' };
  // eslint-disable-next-line security/detect-object-injection
  return map[v] || '#6B7280';
};
