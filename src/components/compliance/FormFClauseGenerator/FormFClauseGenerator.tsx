import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(245,158,11,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.05);border-bottom:1px solid rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const ClauseCard = styled.div`padding:14px 16px;border-radius:11px;background:rgba(15,23,42,0.7);border:1px solid rgba(245,158,11,0.2)`;
const ClauseHeader = styled.div`display:flex;align-items:center;justify-content:space-between;margin-bottom:8px`;
const ClauseNum = styled.div`font-size:.72rem;font-weight:800;color:#F59E0B;background:rgba(245,158,11,0.12);padding:2px 8px;border-radius:5px`;
const ClauseTitle = styled.div`font-size:.8rem;font-weight:700;color:#CBD5E1`;
const ClauseText = styled.div`font-size:.72rem;color:#64748B;line-height:1.55`;
const ClauseStatus = styled.div<{$included:boolean}>`font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:5px;background:${p=>p.$included?'rgba(16,185,129,0.15)':'rgba(100,116,139,0.15)'};color:${p=>p.$included?'#10B981':'#64748B'};cursor:pointer;transition:all .15s`;

const GenBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#D97706,#F59E0B);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

const CLAUSES = [
  { num: '1.1', title: 'Sale Price Agreement', text: 'The Seller agrees to sell the Property to the Buyer for a total consideration of AED [PRICE], payable as detailed herein.', init: true },
  { num: '2.1', title: 'Completion Date', text: 'Legal completion and title transfer shall occur on [DATE] at the DLD Trustee Office, subject to NOC issuance.', init: true },
  { num: '3.1', title: 'Deposit Forfeiture Clause', text: 'Should the Buyer default, the 10% deposit (AED [DEPOSIT]) shall be forfeited to the Seller as liquidated damages.', init: true },
  { num: '3.2', title: 'Seller Penalty Clause', text: 'Should the Seller withdraw, the Seller shall refund double the deposit (AED [DEPOSIT×2]) to the Buyer within 14 days.', init: false },
  { num: '4.1', title: 'Service Charge Clearance', text: 'The Seller warrants that all outstanding service charges, maintenance fees, and municipality fees are cleared prior to transfer.', init: true },
  { num: '5.1', title: 'Vacant Possession', text: 'The Property shall be delivered vacant and in its current condition on the Completion Date, unless agreed otherwise.', init: false },
  { num: '6.1', title: 'Mortgage Discharge', text: 'The Seller shall discharge any mortgage/charge registered on the Property no later than 5 business days before completion.', init: true },
  { num: '7.1', title: 'Governing Law', text: 'This Agreement shall be governed by the laws of the Emirate of Dubai and the UAE, and disputes referred to Dubai Courts.', init: true },
];

export const FormFClauseGenerator: FC = () => {
  const [included, setIncluded] = useState<Set<string>>(new Set(CLAUSES.filter(c=>c.init).map(c=>c.num)));
  const [generated, setGenerated] = useState(false);

  const toggle = (num: string) => setIncluded(prev => {
    const n = new Set(prev); n.has(num) ? n.delete(num) : n.add(num); return n;
  });

  return (
    <Wrap data-testid="form-f-clause-generator">
      <Head>
        <Title>📄 Form F — MOU Clause Generator</Title>
        <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>{included.size}/8 Clauses</div>
      </Head>
      <Body>
        {CLAUSES.map(c => (
          <ClauseCard key={c.num}>
            <ClauseHeader>
              <ClauseNum>§ {c.num}</ClauseNum>
              <ClauseTitle>{c.title}</ClauseTitle>
              <ClauseStatus $included={included.has(c.num)} onClick={()=>toggle(c.num)}>
                {included.has(c.num)?'✓ Included':'+ Add'}
              </ClauseStatus>
            </ClauseHeader>
            <ClauseText>{c.text}</ClauseText>
          </ClauseCard>
        ))}
        <GenBtn onClick={()=>setGenerated(true)}>
          {generated ? `✅ Form F Generated — ${included.size} Clauses` : `⚖️ Generate Form F MOU (${included.size} clauses)`}
        </GenBtn>
      </Body>
    </Wrap>
  );
};
export default FormFClauseGenerator;
