import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const glow = keyframes`0%,100%{box-shadow:0 0 8px rgba(245,158,11,0.2)}50%{box-shadow:0 0 20px rgba(245,158,11,0.5)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0A0614,#0F172A);border:2px solid rgba(245,158,11,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.06);border-bottom:1px solid rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const VaultIcon = styled.div`
  width:80px;height:80px;border-radius:50%;margin:0 auto;
  background:linear-gradient(135deg,rgba(245,158,11,0.2),rgba(239,68,68,0.1));
  border:2px solid rgba(245,158,11,0.4);
  display:flex;align-items:center;justify-content:center;font-size:2.5rem;
  animation:${glow} 3s ease-in-out infinite;
`;
const SecretBadge = styled.div`text-align:center;font-size:.72rem;color:#64748B;margin-top:-4px`;

const FilterRow = styled.div`display:flex;gap:6px;flex-wrap:wrap`;
const FilterBtn = styled.button<{$active:boolean}>`
  padding:4px 12px;border-radius:999px;border:1px solid ${p=>p.$active?'rgba(245,158,11,0.5)':'rgba(100,116,139,0.25)'};
  background:${p=>p.$active?'rgba(245,158,11,0.1)':'transparent'};
  color:${p=>p.$active?'#F59E0B':'#64748B'};font-size:.68rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;
  transition:all .15s;
`;

const ListingCard = styled.div`
  padding:14px 16px;border-radius:12px;
  background:rgba(15,23,42,0.8);border:1px solid rgba(245,158,11,0.15);
  cursor:pointer;transition:all .2s;&:hover{border-color:rgba(245,158,11,0.35);background:rgba(15,23,42,0.9)}
`;
const ListingHead = styled.div`display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px`;
const ListingType = styled.div`font-size:.65rem;font-weight:800;padding:2px 8px;border-radius:5px;background:rgba(245,158,11,0.12);color:#F59E0B`;
const ListingTitle = styled.div`font-size:.82rem;font-weight:700;color:#E2E8F0;margin-bottom:3px`;
const ListingDetails = styled.div`display:flex;gap:12px;margin-top:6px`;
const ListingDetail = styled.div`font-size:.68rem;color:#64748B`;
const ListingPrice = styled.div`font-size:.9rem;font-weight:900;color:#F59E0B`;
const PrivateTag = styled.div`font-size:.6rem;font-weight:700;color:#94A3B8;display:flex;align-items:center;gap:3px;margin-top:4px`;

const LISTINGS = [
  {type:'PENTHOUSE',title:'Sky Penthouse — Burj Khalifa View, DIFC',price:'AED 65,000,000',beds:5,baths:6,sqft:8200,private:true,tag:'🤫 Off-Market'},
  {type:'VILLA',title:'Private Island Villa — Palm Jumeirah West',price:'AED 180,000,000',beds:8,baths:9,sqft:18000,private:true,tag:'🤫 Off-Market'},
  {type:'MANSION',title:'Emirates Hills Signature Estate',price:'AED 95,000,000',beds:7,baths:8,sqft:14500,private:false,tag:'📋 NDA Required'},
  {type:'PENTHOUSE',title:'Downtown Sky Residences Duplex',price:'AED 42,000,000',beds:4,baths:5,sqft:5800,private:false,tag:'📋 NDA Required'},
];

export const OffMarketLeadRouter: FC = () => {
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState<number|null>(null);

  const filtered = filter==='ALL'?LISTINGS:LISTINGS.filter(l=>l.type===filter);

  return (
    <Wrap data-testid="off-market-lead-router">
      <Head>
        <Title>🏰 Off-Market Exclusive Lead Router</Title>
        <div style={{fontSize:'.7rem',color:'#F59E0B',fontWeight:700}}>UHNW Vault</div>
      </Head>
      <Body>
        <VaultIcon>🏰</VaultIcon>
        <SecretBadge>🔒 Level 5 Access Required · NDA Mandatory Before Disclosure</SecretBadge>

        <FilterRow>
          {['ALL','PENTHOUSE','VILLA','MANSION'].map(f=>(
            <FilterBtn key={f} $active={filter===f} onClick={()=>setFilter(f)}>{f}</FilterBtn>
          ))}
        </FilterRow>

        {filtered.map((l,i)=>(
          <ListingCard key={i} onClick={()=>setSelected(i===selected?null:i)}>
            <ListingHead>
              <div>
                <ListingType>{l.type}</ListingType>
              </div>
              <ListingPrice>{l.price}</ListingPrice>
            </ListingHead>
            <ListingTitle>{l.title}</ListingTitle>
            <PrivateTag>🔐 {l.tag}</PrivateTag>
            {selected===i && (
              <ListingDetails>
                <ListingDetail>🛏 {l.beds} Beds</ListingDetail>
                <ListingDetail>🚿 {l.baths} Baths</ListingDetail>
                <ListingDetail>📐 {l.sqft.toLocaleString()} sqft</ListingDetail>
              </ListingDetails>
            )}
          </ListingCard>
        ))}
      </Body>
    </Wrap>
  );
};
export default OffMarketLeadRouter;
