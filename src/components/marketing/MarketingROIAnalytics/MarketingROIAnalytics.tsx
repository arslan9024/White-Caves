import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const KPIGrid = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px`;
const Card = styled.div`background:linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9));border:1px solid rgba(100,116,139,0.3);padding:16px;border-radius:12px`;
const CVal = styled.div`font-size:1.4rem;font-weight:900;color:#F43F5E`;
const CLab = styled.div`font-size:.7rem;color:#94A3B8;margin-top:4px;text-transform:uppercase;letter-spacing:1px`;

const Table = styled.table`width:100%;border-collapse:collapse;text-align:left`;
const TH = styled.th`padding:12px;font-size:.65rem;color:#94A3B8;border-bottom:1px solid rgba(100,116,139,0.2);text-transform:uppercase`;
const TD = styled.td`padding:14px 12px;border-bottom:1px solid rgba(100,116,139,0.1);font-size:.85rem;color:#E2E8F0;font-weight:600`;

const ROAS = styled.span<{$good:boolean}>`color:${p=>p.$good?'#10B981':'#EF4444'}`;

export const MarketingROIAnalytics: FC = () => {
  return (
    <Wrap data-testid="marketing-roi-analytics">
      <Title>📈 Marketing ROI & Channel Performance</Title>
      
      <KPIGrid>
        <Card><CVal>AED 45,000</CVal><CLab>Total Spend (MTD)</CLab></Card>
        <Card><CVal style={{color:'#38BDF8'}}>342</CVal><CLab>Total Leads</CLab></Card>
        <Card><CVal style={{color:'#10B981'}}>AED 131</CVal><CLab>Avg Cost Per Lead</CLab></Card>
        <Card><CVal style={{color:'#F59E0B'}}>8.4x</CVal><CLab>Overall ROAS</CLab></Card>
      </KPIGrid>

      <Table>
        <thead>
          <tr>
            <TH>Channel</TH>
            <TH>Spend (AED)</TH>
            <TH>Leads</TH>
            <TH>CPL (AED)</TH>
            <TH>Deals Closed</TH>
            <TH>ROAS</TH>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TD>Google Ads (Search)</TD>
            <TD>15,000</TD>
            <TD>85</TD>
            <TD>176</TD>
            <TD>4</TD>
            <TD><ROAS $good={true}>12.5x</ROAS></TD>
          </tr>
          <tr>
            <TD>Meta (Facebook/IG)</TD>
            <TD>20,000</TD>
            <TD>190</TD>
            <TD>105</TD>
            <TD>2</TD>
            <TD><ROAS $good={true}>4.2x</ROAS></TD>
          </tr>
          <tr>
            <TD>PropertyFinder Promoted</TD>
            <TD>10,000</TD>
            <TD>67</TD>
            <TD>149</TD>
            <TD>3</TD>
            <TD><ROAS $good={true}>9.1x</ROAS></TD>
          </tr>
        </tbody>
      </Table>
    </Wrap>
  );
};
export default MarketingROIAnalytics;
