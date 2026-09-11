import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(59,130,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(59,130,246,0.05);border-bottom:1px solid rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const DocList = styled.div`display:flex;flex-direction:column;gap:7px`;
const DocCard = styled.div<{$status:'approved'|'pending'|'rejected'|'missing'}>`
  display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:10px;
  background:${p=>({approved:'rgba(16,185,129,0.07)',pending:'rgba(245,158,11,0.07)',rejected:'rgba(239,68,68,0.07)',missing:'rgba(100,116,139,0.05)'}[p.$status])};
  border:1px solid ${p=>({approved:'rgba(16,185,129,0.25)',pending:'rgba(245,158,11,0.2)',rejected:'rgba(239,68,68,0.2)',missing:'rgba(100,116,139,0.1)'}[p.$status])};
`;
const DocIcon = styled.div`font-size:.95rem;flex-shrink:0`;
const DocInfo = styled.div`flex:1`;
const DocName = styled.div`font-size:.76rem;font-weight:700;color:#CBD5E1`;
const DocSub = styled.div`font-size:.65rem;color:#64748B;margin-top:2px`;
const DocStatus = styled.div<{$status:'approved'|'pending'|'rejected'|'missing'}>`
  font-size:.63rem;font-weight:700;padding:3px 9px;border-radius:5px;flex-shrink:0;
  background:${p=>({approved:'rgba(16,185,129,0.15)',pending:'rgba(245,158,11,0.12)',rejected:'rgba(239,68,68,0.12)',missing:'rgba(100,116,139,0.1)'}[p.$status])};
  color:${p=>({approved:'#10B981',pending:'#F59E0B',rejected:'#EF4444',missing:'#64748B'}[p.$status])};
`;
const UploadBtn = styled.button`padding:4px 10px;border-radius:6px;border:1px solid rgba(59,130,246,0.3);background:rgba(59,130,246,0.08);color:#60A5FA;font-size:.65rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;&:hover{background:rgba(59,130,246,0.18)}`;

const ProgressSummary = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:8px`;
const PSCard = styled.div<{$color:string}>`padding:10px;border-radius:8px;background:rgba(15,23,42,0.6);border:1px solid ${p=>p.$color}20;text-align:center`;
const PSVal = styled.div<{$color:string}>`font-size:.88rem;font-weight:900;color:${p=>p.$color}`;
const PSLab = styled.div`font-size:.6rem;color:#64748B;margin-top:2px`;

const DOCS = [
  {icon:'🪪',name:'Emirates ID (Both sides)',sub:'Required for all UAE buyers',status:'approved' as const},
  {icon:'🛂',name:'Valid Passport',sub:'Must be valid > 6 months',status:'approved' as const},
  {icon:'🏦',name:'Bank Statements (6 months)',sub:'Account activity & balance',status:'pending' as const},
  {icon:'💼',name:'Salary Certificate / NOC',sub:'Employer letterhead required',status:'pending' as const},
  {icon:'🏠',name:'No Objection Certificate (NOC)',sub:'From developer for off-plan',status:'missing' as const},
  {icon:'📄',name:'SPA Draft Review',sub:'Sales & Purchase Agreement',status:'missing' as const},
  {icon:'🔍',name:'AML Compliance Check',sub:'FATF & CBUAE screening',status:'approved' as const},
  {icon:'❌',name:'Source of Funds Declaration',sub:'Required > AED 3M transactions',status:'rejected' as const},
];

export const DocumentKycChecklist: FC = () => {
  const [uploaded, setUploaded] = useState(new Set<number>());

  const counts = {
    approved: DOCS.filter((d,i)=>d.status==='approved'||uploaded.has(i)).length,
    pending: DOCS.filter((d,i)=>d.status==='pending'&&!uploaded.has(i)).length,
    rejected: DOCS.filter(d=>d.status==='rejected').length,
    missing: DOCS.filter((d,i)=>d.status==='missing'&&!uploaded.has(i)).length,
  };

  return (
    <Wrap data-testid="document-kyc-checklist">
      <Head>
        <Title>📁 Document & KYC Checklist</Title>
        <div style={{fontSize:'.7rem',color:'#3B82F6',fontWeight:700}}>UAE PDPL Compliant</div>
      </Head>
      <Body>
        <ProgressSummary>
          <PSCard $color="#10B981"><PSVal $color="#10B981">{counts.approved}</PSVal><PSLab>Approved</PSLab></PSCard>
          <PSCard $color="#F59E0B"><PSVal $color="#F59E0B">{counts.pending}</PSVal><PSLab>Pending</PSLab></PSCard>
          <PSCard $color="#EF4444"><PSVal $color="#EF4444">{counts.rejected}</PSVal><PSLab>Rejected</PSLab></PSCard>
          <PSCard $color="#64748B"><PSVal $color="#64748B">{counts.missing}</PSVal><PSLab>Missing</PSLab></PSCard>
        </ProgressSummary>

        <DocList>
          {DOCS.map((doc,i) => {
            const effectiveStatus = uploaded.has(i)?'approved':doc.status;
            return (
              <DocCard key={i} $status={effectiveStatus}>
                <DocIcon>{doc.icon}</DocIcon>
                <DocInfo><DocName>{doc.name}</DocName><DocSub>{doc.sub}</DocSub></DocInfo>
                {(effectiveStatus==='missing'||effectiveStatus==='pending')&&!uploaded.has(i) && (
                  <UploadBtn onClick={()=>setUploaded(prev=>{const n=new Set(prev);n.add(i);return n})}>Upload</UploadBtn>
                )}
                <DocStatus $status={effectiveStatus}>
                  {{approved:'✓ APPROVED',pending:'⏳ PENDING',rejected:'✗ REJECTED',missing:'○ MISSING'}[effectiveStatus]}
                </DocStatus>
              </DocCard>
            );
          })}
        </DocList>
      </Body>
    </Wrap>
  );
};
export default DocumentKycChecklist;
