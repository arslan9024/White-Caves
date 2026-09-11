import React, { FC, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const slideDown = keyframes`from{opacity:0;transform:translateY(-8px);max-height:0}to{opacity:1;transform:translateY(0);max-height:400px}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;max-width:720px;margin:0 auto`;
const SectionTitle = styled.h2`font-size:1.4rem;font-weight:900;margin:0 0 6px;color:#FFF;text-align:center`;
const SectionSub = styled.p`font-size:.8rem;color:#64748B;margin:0 0 24px;text-align:center`;

const AccordionWrap = styled.div`display:flex;flex-direction:column;gap:8px`;
const Item = styled.div<{$open:boolean}>`
  border-radius:14px;overflow:hidden;
  background:${p=>p.$open?'rgba(59,130,246,0.06)':'rgba(15,23,42,0.8)'};
  border:1px solid ${p=>p.$open?'rgba(59,130,246,0.3)':'rgba(100,116,139,0.15)'};
  transition:all .2s;
`;
const ItemHeader = styled.div`
  display:flex;align-items:center;gap:12px;padding:16px 18px;cursor:pointer;
  user-select:none;
  &:hover{background:rgba(59,130,246,0.04)}
`;
const ItemIcon = styled.div`font-size:1.1rem;flex-shrink:0`;
const ItemQ = styled.div`font-size:.82rem;font-weight:700;color:#CBD5E1;flex:1`;
const ChevronBtn = styled.div<{$open:boolean}>`
  font-size:.75rem;color:#64748B;transition:transform .3s;
  transform:${p=>p.$open?'rotate(180deg)':'rotate(0)'};
`;
const ItemBody = styled.div<{$open:boolean}>`
  overflow:hidden;
  max-height:${p=>p.$open?'400px':'0'};
  animation:${p=>p.$open?css`${slideDown} .3s ease`:'none'};
  transition:max-height .3s ease;
`;
const ItemText = styled.div`padding:0 18px 16px 52px;font-size:.78rem;color:#94A3B8;line-height:1.65`;
const ItemLink = styled.a`color:#60A5FA;font-weight:700;text-decoration:none;&:hover{text-decoration:underline}`;

const FAQS = [
  {icon:'🏠',q:'Can foreigners buy property in Dubai?',a:'Yes — Dubai allows 100% foreign freehold ownership in designated areas (Freehold Zones). Popular areas include Palm Jumeirah, Dubai Marina, Downtown, Business Bay, and JVC. No residency requirement is needed to buy property.'},
  {icon:'💰',q:'What are the buying costs and DLD fees?',a:'The main costs are: DLD Transfer Fee (4% of purchase price), Agency Commission (2%), DLD Registration Fee (AED 4,200 for properties over AED 500K), Trustee Office Fee (AED 4,000), and Valuation Fee (~AED 3,500). Total transaction costs are typically 7–8% of the property price.'},
  {icon:'🏗️',q:'What is off-plan property and is it safe?',a:'Off-plan means buying a property before it is built, directly from a developer at pre-launch prices. Dubai has a strong escrow law (RERA Law 8/2007) that requires developers to place buyer funds in escrow accounts, significantly protecting buyers. Major developers like EMAAR, DAMAC, and Nakheel have strong track records.'},
  {icon:'📋',q:'What is Ejari and why is it important?',a:'Ejari is the official online system for registering tenancy contracts with the Real Estate Regulatory Agency (RERA). It is mandatory for all residential tenancy agreements in Dubai. Ejari registration is required to connect utilities (DEWA), apply for a UAE driving licence, and serves as legal proof of tenancy.'},
  {icon:'🏦',q:'Can expats get a mortgage in Dubai?',a:'Yes — UAE banks offer mortgages to eligible expats. The maximum LTV is 80% for expats on a first property up to AED 5M (75% over AED 5M). You will need a minimum 3-month UAE bank statement, salary certificate, valid passport/Emirates ID, and a credit bureau check. Rates typically start from 3.25% p.a.'},
  {icon:'🤝',q:'What is the role of a RERA-registered agent?',a:'A RERA-certified agent is licensed by the Real Estate Regulatory Agency to represent buyers, sellers, and landlords in Dubai. They must hold a valid BRN (Broker Registration Number), use Form A/B/F contracts, advertise on ORN-verified portals, and comply with anti-money-laundering regulations.'},
  {icon:'📈',q:'How has the Dubai market performed in 2026?',a:'Dubai real estate has seen exceptional growth in 2026: YTD transaction volume surpassed AED 186 billion (up 22% YoY), with off-plan deals accounting for 62% of sales. Palm Jumeirah villas appreciated 12.4%, while JVC apartments led affordable gains at 14.2%. Rental yields remain strong at 6–9% net in most areas.'},
];

export const HomepageFAQAccordion: FC = () => {
  const [open, setOpen] = useState<number|null>(0);

  return (
    <Wrap data-testid="homepage-faq-accordion">
      <SectionTitle>Frequently Asked Questions</SectionTitle>
      <SectionSub>Everything you need to know about buying or renting in Dubai</SectionSub>

      <AccordionWrap>
        {FAQS.map((f,i)=>(
          <Item key={i} $open={open===i}>
            <ItemHeader onClick={()=>setOpen(open===i?null:i)}>
              <ItemIcon>{f.icon}</ItemIcon>
              <ItemQ>{f.q}</ItemQ>
              <ChevronBtn $open={open===i}>▼</ChevronBtn>
            </ItemHeader>
            <ItemBody $open={open===i}>
              <ItemText>
                {f.a}
                {i===0&&<><br/><br/><ItemLink href="#">Browse freehold areas →</ItemLink></>}
              </ItemText>
            </ItemBody>
          </Item>
        ))}
      </AccordionWrap>
    </Wrap>
  );
};
export default HomepageFAQAccordion;
