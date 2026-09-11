import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;align-items:center;gap:8px`;
const Badge = styled.span`background:rgba(59,130,246,0.15);color:#3B82F6;padding:2px 8px;border-radius:10px;font-size:.65rem`;

const ScrollX = styled.div`overflow-x:auto;padding-bottom:12px;&::-webkit-scrollbar{height:4px}&::-webkit-scrollbar-thumb{background:rgba(59,130,246,0.3);border-radius:2px}`;

const ChartArea = styled.div`min-width:600px;height:240px;position:relative;margin-top:20px`;
const GridLine = styled.div<{y:number}>`position:absolute;left:0;right:0;top:${p=>p.y}%;height:1px;background:rgba(100,116,139,0.1)`;
const YLabel = styled.div<{y:number}>`position:absolute;left:0;top:${p=>p.y}%;transform:translateY(-50%);font-size:.6rem;color:#64748B`;

const BarsWrap = styled.div`position:absolute;left:40px;right:0;top:0;bottom:20px;display:flex;justify-content:space-between;align-items:flex-end;padding:0 10px`;
const MonthCol = styled.div`display:flex;flex-direction:column;align-items:center;width:30px;height:100%;justify-content:flex-end;position:relative`;
const BarPositive = styled.div<{h:number}>`width:12px;background:linear-gradient(to top, #10B981, #34D399);border-radius:3px 3px 0 0;height:${p=>p.h}%;transition:all .3s`;
const BarNegative = styled.div<{h:number}>`width:12px;background:linear-gradient(to bottom, #EF4444, #F87171);border-radius:0 0 3px 3px;height:${p=>p.h}%;position:absolute;top:100%;transition:all .3s`;
const XLabel = styled.div`font-size:.6rem;color:#94A3B8;position:absolute;bottom:-20px`;

const SummaryRow = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:24px;border-top:1px solid rgba(100,116,139,0.15);padding-top:20px`;
const Stat = styled.div``;
const SVal = styled.div<{$color:string}>`font-size:1.1rem;font-weight:800;color:${p=>p.$color}`;
const SLab = styled.div`font-size:.65rem;color:#64748B;margin-top:4px;font-weight:600`;

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DATA = [
  { in: 12000, out: 2000 },
  { in: 12000, out: 2000 },
  { in: 12000, out: 8500 }, // Service charge hit
  { in: 12000, out: 2000 },
  { in: 12000, out: 2000 },
  { in: 12000, out: 2000 },
  { in: 12000, out: 2000 },
  { in: 12000, out: 3500 }, // Maintenance hit
  { in: 12000, out: 2000 },
  { in: 12000, out: 2000 },
  { in: 12000, out: 2000 },
  { in: 12000, out: 2000 },
];

const MAX_VAL = 15000;

export const CashFlowProjector: FC = () => {
  const totalIn = DATA.reduce((sum, d) => sum + d.in, 0);
  const totalOut = DATA.reduce((sum, d) => sum + d.out, 0);
  
  return (
    <Wrap data-testid="cash-flow-projector">
      <Title>📉 12-Month Cash Flow Projector <Badge>Portfolio View</Badge></Title>
      
      <ScrollX>
        <ChartArea>
          {[0, 25, 50, 75, 100].map(pct => (
            <React.Fragment key={pct}>
              <GridLine y={100 - pct} />
              <YLabel y={100 - pct}>{pct === 0 ? '0' : `${(MAX_VAL * pct / 100 / 1000)}k`}</YLabel>
            </React.Fragment>
          ))}
          
          <BarsWrap>
            {DATA.map((d, i) => (
              <MonthCol key={i}>
                <BarPositive h={(d.in / MAX_VAL) * 100} />
                <BarNegative h={(d.out / MAX_VAL) * 100} />
                <XLabel>{MONTHS[i]}</XLabel>
              </MonthCol>
            ))}
          </BarsWrap>
        </ChartArea>
      </ScrollX>

      <SummaryRow>
        <Stat><SVal $color="#10B981">AED {totalIn.toLocaleString()}</SVal><SLab>Total Inflows (Rent)</SLab></Stat>
        <Stat><SVal $color="#EF4444">AED {totalOut.toLocaleString()}</SVal><SLab>Total Outflows (Exp)</SLab></Stat>
        <Stat><SVal $color="#3B82F6">AED {(totalIn - totalOut).toLocaleString()}</SVal><SLab>Net Cash Flow</SLab></Stat>
        <Stat><SVal $color="#F59E0B">AED 24,000</SVal><SLab>Reserve Target</SLab></Stat>
      </SummaryRow>
    </Wrap>
  );
};
export default CashFlowProjector;
