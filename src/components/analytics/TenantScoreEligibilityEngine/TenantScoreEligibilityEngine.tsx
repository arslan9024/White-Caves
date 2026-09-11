import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const InputGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px`;
const Field = styled.div`display:flex;flex-direction:column;gap:4px`;
const Label = styled.label`font-size:.7rem;color:#94A3B8;font-weight:600`;
const Input = styled.input`padding:8px 10px;border-radius:7px;border:1px solid rgba(16,185,129,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#10B981}`;
const Select = styled.select`padding:8px 10px;border-radius:7px;border:1px solid rgba(16,185,129,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;width:100%;outline:none;&:focus{border-color:#10B981}`;

const ScoreCard = styled.div<{$score:number}>`padding:20px;border-radius:14px;text-align:center;background:${p=>p.$score>=75?'rgba(16,185,129,0.08)':p.$score>=50?'rgba(245,158,11,0.07)':'rgba(239,68,68,0.07)'};border:2px solid ${p=>p.$score>=75?'rgba(16,185,129,0.3)':p.$score>=50?'rgba(245,158,11,0.25)':'rgba(239,68,68,0.25)'}`;
const ScoreNum = styled.div<{$score:number}>`font-size:2.5rem;font-weight:900;color:${p=>p.$score>=75?'#10B981':p.$score>=50?'#F59E0B':'#EF4444'}`;
const ScoreLab = styled.div`font-size:.72rem;color:#64748B;margin-top:4px`;
const ScoreGrade = styled.div<{$score:number}>`font-size:.85rem;font-weight:700;margin-top:6px;color:${p=>p.$score>=75?'#10B981':p.$score>=50?'#F59E0B':'#EF4444'}`;

const BreakdownList = styled.div`display:flex;flex-direction:column;gap:5px`;
const BRow = styled.div`display:flex;justify-content:space-between;padding:6px 12px;border-radius:7px;background:rgba(15,23,42,0.5);border:1px solid rgba(100,116,139,0.1)`;
const BL = styled.div`font-size:.7rem;color:#64748B`;
const BV = styled.div<{$ok:boolean}>`font-size:.7rem;font-weight:700;color:${p=>p.$ok?'#10B981':'#EF4444'}`;

export const TenantScoreEligibilityEngine: FC = () => {
  const [income, setIncome] = useState('25000');
  const [employment, setEmployment] = useState('employed');
  const [creditHistory, setCreditHistory] = useState('clean');
  const [chequeHistory, setChequeHistory] = useState('none');
  const [residency, setResidency] = useState('uae');

  const incomeNum = parseFloat(income)||0;
  const rentThreshold = incomeNum * 3; // 3x monthly salary rule
  const scoreComponents = [
    {label:'Monthly Income',val:incomeNum>=15000?30:incomeNum>=8000?20:10,max:30,ok:incomeNum>=15000},
    {label:'Employment Type',val:{employed:25,self:18,retired:12,student:5}[employment]||0,max:25,ok:employment==='employed'},
    {label:'Credit History',val:{clean:20,minor:12,major:0}[creditHistory]||0,max:20,ok:creditHistory==='clean'},
    {label:'Cheque History',val:{none:15,one:8,multiple:0}[chequeHistory]||0,max:15,ok:chequeHistory==='none'},
    {label:'UAE Residency',val:{uae:10,expat:8,tourist:0}[residency]||0,max:10,ok:residency!=='tourist'},
  ];
  const totalScore = scoreComponents.reduce((a,c)=>a+c.val,0);
  const grade = totalScore>=80?'AAA — Excellent':totalScore>=65?'AA — Good':totalScore>=50?'A — Acceptable':'B — High Risk';

  return (
    <Wrap data-testid="tenant-score-eligibility-engine">
      <Head>
        <Title>🏷️ Tenant Score Eligibility Engine</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>AI-Powered</div>
      </Head>
      <Body>
        <InputGrid>
          <Field><Label>Monthly Salary (AED)</Label><Input type="number" value={income} onChange={e=>setIncome(e.target.value)} /></Field>
          <Field><Label>Employment Type</Label>
            <Select value={employment} onChange={e=>setEmployment(e.target.value)}>
              <option value="employed">Salaried — Full Time</option>
              <option value="self">Self-Employed</option>
              <option value="retired">Retired</option>
              <option value="student">Student</option>
            </Select>
          </Field>
          <Field><Label>Credit History</Label>
            <Select value={creditHistory} onChange={e=>setCreditHistory(e.target.value)}>
              <option value="clean">Clean Record</option>
              <option value="minor">Minor Issues</option>
              <option value="major">Major Issues / Defaults</option>
            </Select>
          </Field>
          <Field><Label>Bounced Cheque History</Label>
            <Select value={chequeHistory} onChange={e=>setChequeHistory(e.target.value)}>
              <option value="none">None</option>
              <option value="one">1 Incident</option>
              <option value="multiple">Multiple</option>
            </Select>
          </Field>
        </InputGrid>

        <ScoreCard $score={totalScore}>
          <ScoreNum $score={totalScore}>{totalScore}</ScoreNum>
          <ScoreLab>Tenant Eligibility Score (out of 100)</ScoreLab>
          <ScoreGrade $score={totalScore}>{grade}</ScoreGrade>
          <div style={{fontSize:'.68rem',color:'#64748B',marginTop:4}}>Max affordable rent: AED {rentThreshold.toLocaleString()}/month</div>
        </ScoreCard>

        <BreakdownList>
          {scoreComponents.map((c,i)=>(
            <BRow key={i}>
              <BL>{c.label}</BL>
              <BV $ok={c.ok}>{c.val}/{c.max} pts {c.ok?'✓':'✗'}</BV>
            </BRow>
          ))}
        </BreakdownList>
      </Body>
    </Wrap>
  );
};
export default TenantScoreEligibilityEngine;
