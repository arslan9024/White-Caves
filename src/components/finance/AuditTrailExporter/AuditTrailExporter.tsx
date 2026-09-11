import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const FilterRow = styled.div`display:flex;gap:6px;flex-wrap:wrap`;
const FBtn = styled.button<{$active:boolean}>`padding:4px 12px;border-radius:999px;border:1px solid ${p=>p.$active?'rgba(16,185,129,0.5)':'rgba(100,116,139,0.25)'};background:${p=>p.$active?'rgba(16,185,129,0.1)':'transparent'};color:${p=>p.$active?'#10B981':'#64748B'};font-size:.68rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s`;

const AuditTable = styled.div`display:flex;flex-direction:column;gap:4px`;
const AuditRow = styled.div`display:grid;grid-template-columns:auto 1fr auto auto;gap:10px;align-items:center;padding:8px 12px;border-radius:8px;background:rgba(15,23,42,0.6);border:1px solid rgba(100,116,139,0.1);&:hover{background:rgba(15,23,42,0.9)}`;
const AuditTime = styled.div`font-size:.62rem;color:#475569;font-family:'Courier New',monospace;white-space:nowrap`;
const AuditAction = styled.div`font-size:.72rem;color:#94A3B8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap`;
const AuditUser = styled.div`font-size:.65rem;font-weight:700;color:#60A5FA;white-space:nowrap`;
const AuditType = styled.div<{$type:string}>`font-size:.6rem;font-weight:700;padding:2px 7px;border-radius:4px;white-space:nowrap;background:${p=>({READ:'rgba(59,130,246,0.1)',WRITE:'rgba(245,158,11,0.1)',DELETE:'rgba(239,68,68,0.1)',EXPORT:'rgba(16,185,129,0.1)'}[p.$type]||'rgba(100,116,139,0.1)')};color:${p=>({READ:'#60A5FA',WRITE:'#F59E0B',DELETE:'#EF4444',EXPORT:'#10B981'}[p.$type]||'#64748B')}`;

const LOG = [
  {time:'2026-09-07 08:42:11',action:'Landlord payout batch dispatched — 4 transfers',user:'Victoria.C',type:'WRITE'},
  {time:'2026-09-07 08:39:02',action:'Security deposit refund processed — AED 12,500',user:'System',type:'WRITE'},
  {time:'2026-09-07 08:31:55',action:'Form F MOU clause generator — Contract #WC-2025-884',user:'Ahmed.R',type:'WRITE'},
  {time:'2026-09-07 08:28:14',action:'AML screening — Mohammed Al Farsi — CLEAR',user:'Sofia.K',type:'READ'},
  {time:'2026-09-07 08:21:08',action:'DLD fee calculation — AED 3.5M transaction',user:'Jaime.T',type:'READ'},
  {time:'2026-09-07 08:18:33',action:'Client data export — full portfolio report (CSV)',user:'Admin',type:'EXPORT'},
  {time:'2026-09-07 08:11:47',action:'RERA Form A barcode scanned — Permit TRK-2025-88421',user:'Victoria.C',type:'READ'},
  {time:'2026-09-07 08:02:19',action:'Tenant record deleted — expired tenancy',user:'Admin',type:'DELETE'},
];

const ExportBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#059669,#10B981);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

export const AuditTrailExporter: FC = () => {
  const [filter, setFilter] = useState('ALL');
  const [exported, setExported] = useState<'none'|'csv'|'excel'>('none');

  const filtered = filter==='ALL'?LOG:LOG.filter(l=>l.type===filter);

  return (
    <Wrap data-testid="audit-trail-exporter">
      <Head>
        <Title>📋 Corporate Audit Trail Exporter</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>CSV · Excel XML</div>
      </Head>
      <Body>
        <FilterRow>
          {['ALL','READ','WRITE','DELETE','EXPORT'].map(f=>(
            <FBtn key={f} $active={filter===f} onClick={()=>setFilter(f)}>{f}</FBtn>
          ))}
        </FilterRow>

        <AuditTable>
          {filtered.map((l,i)=>(
            <AuditRow key={i}>
              <AuditTime>{l.time.split(' ')[1]}</AuditTime>
              <AuditAction>{l.action}</AuditAction>
              <AuditUser>{l.user}</AuditUser>
              <AuditType $type={l.type}>{l.type}</AuditType>
            </AuditRow>
          ))}
        </AuditTable>

        <div style={{display:'flex',gap:8}}>
          <ExportBtn onClick={()=>setExported('csv')} style={{flex:1}}>
            {exported==='csv'?'✅ CSV Downloaded':'📥 Export CSV'}
          </ExportBtn>
          <ExportBtn onClick={()=>setExported('excel')} style={{flex:1,background:'linear-gradient(90deg,#1D4ED8,#3B82F6)'}}>
            {exported==='excel'?'✅ Excel Downloaded':'📊 Export Excel XML'}
          </ExportBtn>
        </div>
      </Body>
    </Wrap>
  );
};
export default AuditTrailExporter;
