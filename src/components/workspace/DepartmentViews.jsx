import React from 'react';
import { DEPARTMENTS } from '../../data/departments';
import { KPICard, GridLayout, ContentPanel } from '../dashboard/DashboardComponents';

/**
 * STAGE 2 (AEGIS): 10 Departmental Upgrades
 * Red & White Themed Layouts
 */

// ─── Base Card ──────────────────────────────────────────────────────────────
const DeptCard = ({ title, value, subtext, icon, trend, positive }) => (
  <KPICard
    id={title.toLowerCase().replace(/\s/g, '-')}
    label={title}
    value={value}
    subtext={subtext}
    icon={icon}
    trend={trend}
    positive={positive}
  />
);

const DeptLayout = ({ departmentId, title, children }) => {
  const dept = DEPARTMENTS.find(d => d.id === departmentId);
  return (
    <div className="ws-dept-layout" style={{ '--local-accent': dept?.accentColor }}>
      <div className="ws-dept-header">
        <h2 style={{ color: dept?.accentColor }}>{title}</h2>
        <span className="ws-dept-ai">AI Assistant: {dept?.aiAssistant}</span>
      </div>
      <ContentPanel>
        <GridLayout columns={4}>{children}</GridLayout>
      </ContentPanel>
    </div>
  );
};

// ─── 1. Sales ───────────────────────────────────────────────────────────────
export const SalesView = () => (
  <DeptLayout departmentId="sales" title="Sales & Pipeline (Clara/Sophia)">
    <DeptCard title="Active Leads" value="142" subtext="In Qualification" icon="🎯" trend="↑ 12%" positive />
    <DeptCard title="Pipeline Value" value="AED 4.2M" subtext="Expected this month" icon="💰" trend="↑ 5%" positive />
    <DeptCard title="Conversion Rate" value="18.4%" subtext="Lead to Deal" icon="📈" trend="↓ 1.2%" />
    <DeptCard title="Avg Closing Time" value="14 Days" subtext="From Lead Creation" icon="⏱️" />
  </DeptLayout>
);

// ─── 2. Operations ──────────────────────────────────────────────────────────
export const OperationsView = () => (
  <DeptLayout departmentId="operations" title="Operations & Property Management">
    <DeptCard title="Total Units" value="9,378" subtext="DAMAC Hills 2" icon="🏢" />
    <DeptCard title="Active Maintenance" value="47" subtext="Critical Tickets" icon="🔧" trend="↑ 4" />
    <DeptCard title="Occupancy Rate" value="94.2%" subtext="Across portfolio" icon="🔑" trend="↑ 0.5%" positive />
    <DeptCard title="Upcoming Handovers" value="12" subtext="Next 7 Days" icon="📦" />
  </DeptLayout>
);

// ─── 3. Communications ──────────────────────────────────────────────────────
export const CommunicationsView = () => (
  <DeptLayout departmentId="communications" title="Communications (Nadia CRM)">
    <DeptCard title="Active WhatsApps" value="23" subtext="Registered Numbers" icon="📱" />
    <DeptCard title="Avg Response Time" value="4m 12s" subtext="SLA: < 5m" icon="⚡" trend="↓ 30s" positive />
    <DeptCard title="Messages Sent" value="12,450" subtext="Today" icon="💬" />
    <DeptCard title="SLA Breaches" value="2" subtext="Needs Attention" icon="⚠️" />
  </DeptLayout>
);

// ─── 4. Finance ─────────────────────────────────────────────────────────────
export const FinanceView = () => (
  <DeptLayout departmentId="finance" title="Finance & Ledger">
    <DeptCard title="Escrow Balance" value="AED 12.5M" subtext="Available Funds" icon="🏦" />
    <DeptCard title="Multi-Currency" value="5 Active" subtext="AED/USD/EUR/GBP/INR" icon="💱" />
    <DeptCard title="Pending Milestones" value="8" subtext="Awaiting Clearance" icon="⏳" />
    <DeptCard title="Monthly Revenue" value="AED 850K" subtext="Recognized" icon="📊" trend="↑ 15%" positive />
  </DeptLayout>
);

// ─── 5. Marketing ───────────────────────────────────────────────────────────
export const MarketingView = () => (
  <DeptLayout departmentId="marketing" title="Marketing (Olivia AI)">
    <DeptCard title="Active Campaigns" value="14" subtext="Across Channels" icon="📢" />
    <DeptCard title="Avg Cost/Lead" value="AED 45" subtext="Google/Meta" icon="💸" trend="↓ AED 5" positive />
    <DeptCard title="Total Impressions" value="1.2M" subtext="Last 30 Days" icon="👁️" />
    <DeptCard title="Highest ROI Comm." value="Palm Jumeirah" subtext="24% ROI" icon="🌴" />
  </DeptLayout>
);

// ─── 6. Executive ───────────────────────────────────────────────────────────
export const ExecutiveView = () => (
  <DeptLayout departmentId="executive" title="Managing Director Cockpit">
    <DeptCard title="Company GWC" value="AED 18.2M" subtext="Year to Date" icon="👑" trend="↑ 22%" positive />
    <DeptCard title="Top Agent" value="S. Ahmed" subtext="AED 4.1M" icon="🌟" />
    <DeptCard title="Market Share" value="4.2%" subtext="Dubai Luxury Segment" icon="🌍" />
    <DeptCard title="Active Deals" value="84" subtext="Company Wide" icon="🤝" />
  </DeptLayout>
);

// ─── 7. Compliance ──────────────────────────────────────────────────────────
export const ComplianceView = () => (
  <DeptLayout departmentId="compliance" title="Compliance (Laila AI)">
    <DeptCard title="Audit Status" value="100%" subtext="No Findings" icon="🛡️" />
    <DeptCard title="KYC Completions" value="98.5%" subtext="Active Clients" icon="✅" />
    <DeptCard title="RERA Expiries" value="3" subtext="Next 30 Days" icon="📜" />
    <DeptCard title="Risk Level" value="Low" subtext="Continuous Monitoring" icon="🟢" />
  </DeptLayout>
);

// ─── 8. Technology ──────────────────────────────────────────────────────────
export const TechnologyView = () => (
  <DeptLayout departmentId="technology" title="Technology (Aurora)">
    <DeptCard title="Server Uptime" value="99.99%" subtext="Last 90 Days" icon="☁️" />
    <DeptCard title="Cache Size" value="1.2 GB" subtext="Redis Cluster" icon="🗄️" />
    <DeptCard title="API Latency" value="45ms" subtext="p95" icon="⚡" />
    <DeptCard title="Active Sockets" value="1,204" subtext="Realtime Connections" icon="🔌" />
  </DeptLayout>
);

// ─── 9. Legal ───────────────────────────────────────────────────────────────
export const LegalView = () => (
  <DeptLayout departmentId="legal" title="Legal (Evangeline)">
    <DeptCard title="Active Form 7s" value="42" subtext="Rent Increases" icon="⚖️" />
    <DeptCard title="Active Form 12s" value="18" subtext="Eviction Notices" icon="🚫" />
    <DeptCard title="Active Form 6s" value="5" subtext="Non-Renewals" icon="📝" />
    <DeptCard title="Pending Reviews" value="12" subtext="Awaiting Signature" icon="✍️" />
  </DeptLayout>
);

// ─── 10. Intelligence ───────────────────────────────────────────────────────
export const IntelligenceView = () => (
  <DeptLayout departmentId="intelligence" title="Intelligence (Sentinel)">
    <DeptCard title="IoT Alerts" value="4" subtext="Unusual Activity" icon="🚨" />
    <DeptCard title="Heatmap Hotspot" value="Dubai Marina" subtext="Highest Demand" icon="🔥" />
    <DeptCard title="Price Prediction" value="+5.2%" subtext="Next Quarter" icon="📈" />
    <DeptCard title="Sentinel Status" value="Active" subtext="Analyzing 10k data points" icon="🧠" />
  </DeptLayout>
);
