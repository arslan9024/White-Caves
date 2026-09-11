import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.85);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;

const TableScroll = styled.div`overflow-x:auto;&::-webkit-scrollbar{height:3px}&::-webkit-scrollbar-thumb{background:rgba(59,130,246,0.3);border-radius:2px}`;
const Table = styled.table`width:100%;border-collapse:collapse;min-width:520px`;
const TH = styled.th`padding:10px 14px;font-size:.62rem;font-weight:700;color:#64748B;text-align:left;border-bottom:1px solid rgba(100,116,139,0.1);white-space:nowrap;background:rgba(15,23,42,0.5)`;
const TD = styled.td<{$center?:boolean}>`padding:10px 14px;font-size:.73rem;color:#94A3B8;border-bottom:1px solid rgba(100,116,139,0.06);text-align:${p=>p.$center?'center':'left'}`;
const PropNameCell = styled.div`font-size:.78rem;font-weight:700;color:#E2E8F0;margin-bottom:2px`;
const PropAreaCell = styled.div`font-size:.62rem;color:#64748B`;
const WinnerBadge = styled.div`font-size:.58rem;font-weight:800;padding:2px 7px;border-radius:4px;background:rgba(16,185,129,0.15);color:#10B981;display:inline-block`;
const ValueCell = styled.div<{$best?:boolean}>`font-weight:${p=>p.$best?900:600};color:${p=>p.$best?'#10B981':'#94A3B8'}`;
const YieldCell = styled.div<{$color:string}>`font-weight:800;color:${p=>p.$color}`;

const StarRow = styled.div`display:flex;gap:1px`;
const Star = styled.span<{$filled:boolean}>`font-size:.65rem;color:${p=>p.$filled?'#F59E0B':'rgba(245,158,11,0.2)'}`;

interface Prop {name:string;area:string;price:string;size:string;psf:string;yield_:string;floor:string;view:string;rating:number;beds:string}
const PROPS: Prop[] = [
  {name:'Marina Heights 14B',area:'Dubai Marina',price:'AED 2.45M',size:'1,450 sqft',psf:'AED 1,690',yield_:'7.2%',floor:'32nd',view:'Sea + Marina',rating:4,beds:'2BR'},
  {name:'The Cayan Tower 8C',area:'Dubai Marina',price:'AED 2.62M',size:'1,380 sqft',psf:'AED 1,899',yield_:'6.8%',floor:'18th',view:'Marina',rating:5,beds:'2BR'},
  {name:'Princess Tower 44A',area:'Dubai Marina',price:'AED 2.29M',size:'1,510 sqft',psf:'AED 1,517',yield_:'7.8%',floor:'44th',view:'Sea + Palm',rating:4,beds:'2BR'},
];

const BEST_PSF = 'AED 1,517'; const BEST_YIELD = '7.8%'; const BEST_PRICE = 'AED 2.29M';

export const PropertyComparisonTable: FC = () => (
  <Wrap data-testid="property-comparison-table">
    <Head>
      <HeadTitle>⚖️ Side-by-Side Comparison</HeadTitle>
      <WinnerBadge>🏆 Best value highlighted</WinnerBadge>
    </Head>
    <TableScroll>
      <Table>
        <thead>
          <tr>
            <TH>Property</TH>
            <TH>Price</TH>
            <TH>Size</TH>
            <TH>PSF</TH>
            <TH>Net Yield</TH>
            <TH>Floor</TH>
            <TH>View</TH>
            <TH style={{ textAlign: 'center' }}>Rating</TH>
          </tr>
        </thead>
        <tbody>
          {PROPS.map((p,i)=>(
            <tr key={i}>
              <TD><PropNameCell>{p.name}</PropNameCell><PropAreaCell>📍 {p.area} · {p.beds}</PropAreaCell></TD>
              <TD><ValueCell $best={p.price===BEST_PRICE}>{p.price}</ValueCell></TD>
              <TD><ValueCell>{p.size}</ValueCell></TD>
              <TD><ValueCell $best={p.psf===BEST_PSF}>{p.psf} {p.psf===BEST_PSF&&<WinnerBadge>Best</WinnerBadge>}</ValueCell></TD>
              <TD><YieldCell $color={p.yield_===BEST_YIELD?'#10B981':parseFloat(p.yield_)>=7?'#F59E0B':'#94A3B8'}>{p.yield_} {p.yield_===BEST_YIELD&&'▲'}</YieldCell></TD>
              <TD><ValueCell>{p.floor}</ValueCell></TD>
              <TD><ValueCell>{p.view}</ValueCell></TD>
              <TD $center>
                <StarRow style={{justifyContent:'center'}}>
                  {[1,2,3,4,5].map(s=><Star key={s} $filled={s<=p.rating}>★</Star>)}
                </StarRow>
              </TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableScroll>
  </Wrap>
);
export default PropertyComparisonTable;
