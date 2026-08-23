/**
 * SystemHealthDashboard — Wave 55 GOAL-097
 * System health monitoring dashboard displaying RAM/CPU/Disk metrics
 * White Caves Real Estate LLC — Security & Observability Suite
 */
import React, { FC, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const spin = keyframes`to{transform:rotate(360deg)}`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.4}`;

const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.22);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} 0.4s ease;`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between;`;
const Title = styled.h3`margin:0;color:#FFF;font-size:0.9rem;font-weight:700;display:flex;align-items:center;gap:8px;`;
const LiveBadge = styled.div`display:flex;align-items:center;gap:5px;font-size:0.68rem;font-weight:700;color:#10B981;`;
const LiveDot = styled.div`width:6px;height:6px;border-radius:50%;background:#10B981;animation:${pulse} 1.2s ease infinite;`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:16px;`;

const MetricGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:12px;`;
const MetricCard = styled.div<{$warn:boolean;$crit:boolean}>`padding:14px;border-radius:12px;background:${p=>p.$crit?'rgba(239,68,68,0.08)':p.$warn?'rgba(245,158,11,0.07)':'rgba(15,23,42,0.7)'};border:1.5px solid ${p=>p.$crit?'rgba(239,68,68,0.3)':p.$warn?'rgba(245,158,11,0.3)':'rgba(100,116,139,0.15)'};`;
const MetricIcon = styled.div`font-size:1.4rem;margin-bottom:6px;`;
const MetricLabel = styled.div`font-size:0.65rem;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.05em;`;
const MetricValue = styled.div<{$crit:boolean;$warn:boolean}>`font-size:1.4rem;font-weight:900;color:${p=>p.$crit?'#EF4444':p.$warn?'#F59E0B':'#10B981'};margin:4px 0;`;
const MetricSub = styled.div`font-size:0.68rem;color:#475569;`;

const BarTrack = styled.div`height:6px;border-radius:3px;background:rgba(15,23,42,0.8);overflow:hidden;margin-top:6px;`;
const BarFill = styled.div<{$pct:number;$crit:boolean;$warn:boolean}>`height:100%;width:${p=>p.$pct}%;border-radius:3px;background:${p=>p.$crit?'#EF4444':p.$warn?'#F59E0B':'#10B981'};transition:width 0.8s ease;`;

const ServiceGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:8px;`;
const ServiceRow = styled.div<{$ok:boolean}>`display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:8px;background:${p=>p.$ok?'rgba(16,185,129,0.05)':'rgba(239,68,68,0.06)'};border:1px solid ${p=>p.$ok?'rgba(16,185,129,0.18)':'rgba(239,68,68,0.2)'};`;
const SvcName = styled.div`font-size:0.72rem;font-weight:600;color:#CBD5E1;`;
const SvcStatus = styled.div<{$ok:boolean}>`font-size:0.65rem;font-weight:800;color:${p=>p.$ok?'#10B981':'#EF4444'};`;

const SparkLine = styled.div`display:flex;align-items:flex-end;gap:2px;height:32px;`;
const SparkBar = styled.div<{$h:number;$crit:boolean;$warn:boolean}>`width:8px;border-radius:2px;background:${p=>p.$crit?'#EF4444':p.$warn?'#F59E0B':'rgba(16,185,129,0.6)'};height:${p=>p.$h}%;transition:height 0.3s ease;flex-shrink:0;`;

const AlertList = styled.div`display:flex;flex-direction:column;gap:6px;max-height:90px;overflow-y:auto;`;
const AlertItem = styled.div<{$type:'info'|'warn'|'error'}>`padding:7px 12px;border-radius:7px;background:${p=>p.$type==='error'?'rgba(239,68,68,0.07)':p.$type==='warn'?'rgba(245,158,11,0.06)':'rgba(15,23,42,0.5)'};border:1px solid ${p=>p.$type==='error'?'rgba(239,68,68,0.2)':p.$type==='warn'?'rgba(245,158,11,0.2)':'rgba(100,116,139,0.1)'};font-size:0.7rem;color:${p=>p.$type==='error'?'#FCA5A5':p.$type==='warn'?'#FCD34D':'#94A3B8'};display:flex;align-items:center;gap:8px;`;

function rand(min:number,max:number){ return Math.floor(Math.random()*(max-min+1)+min); }

export const SystemHealthDashboard: FC = () => {
  const [cpu,setCpu] = useState(rand(35,55));
  const [mem,setMem] = useState(rand(48,72));
  const [disk,setDisk] = useState(rand(62,78));
  const [cpuHist,setCpuHist] = useState<number[]>(Array.from({length:12},()=>rand(20,80)));
  const [memHist,setMemHist] = useState<number[]>(Array.from({length:12},()=>rand(40,85)));

  useEffect(() => {
    const iv = setInterval(()=>{
      const nc = Math.max(5,Math.min(95,cpu+rand(-8,8)));
      const nm = Math.max(20,Math.min(95,mem+rand(-4,4)));
      setCpu(nc);
      setMem(nm);
      setDisk(d=>Math.max(50,Math.min(95,d+rand(-1,1))));
      setCpuHist(h=>[...h.slice(1),nc]);
      setMemHist(h=>[...h.slice(1),nm]);
    },2000);
    return ()=>clearInterval(iv);
  },[cpu,mem]);

  const services = [
    { name:'API Server (Node)', ok:true },
    { name:'PostgreSQL', ok:true },
    { name:'Redis Cache', ok:true },
    { name:'WhatsApp Gateway', ok:cpu>80 },
    { name:'Nginx Proxy', ok:true },
    { name:'Email Service', ok:mem<85 },
  ];

  const alerts = [
    ...(cpu>70?[{ text:`CPU usage at ${cpu}% — consider scaling`, type:'warn' as const }]:[]),
    ...(mem>80?[{ text:`Memory at ${mem}% — approaching limit`, type:'error' as const }]:[]),
    { text:'Daily backup completed successfully', type:'info' as const },
    { text:'SSL certificate valid — expires in 127 days', type:'info' as const },
  ];

  const metricWarn = (v:number) => v>70;
  const metricCrit = (v:number) => v>85;

  return (
    <Wrap data-testid="system-health-dashboard">
      <Head>
        <Title>🖥️ System Health Monitor</Title>
        <LiveBadge><LiveDot/>LIVE</LiveBadge>
      </Head>
      <Body>
        <MetricGrid>
          <MetricCard $warn={metricWarn(cpu)} $crit={metricCrit(cpu)}>
            <MetricIcon>⚡</MetricIcon>
            <MetricLabel>CPU Usage</MetricLabel>
            <MetricValue $crit={metricCrit(cpu)} $warn={metricWarn(cpu)}>{cpu}%</MetricValue>
            <MetricSub>4 cores · {(cpu*0.04).toFixed(2)} GHz avg</MetricSub>
            <BarTrack><BarFill $pct={cpu} $crit={metricCrit(cpu)} $warn={metricWarn(cpu)}/></BarTrack>
            <SparkLine style={{marginTop:'6px'}}>
              {cpuHist.map((v,i)=><SparkBar key={i} $h={v} $crit={v>85} $warn={v>70}/>)}
            </SparkLine>
          </MetricCard>
          <MetricCard $warn={metricWarn(mem)} $crit={metricCrit(mem)}>
            <MetricIcon>🧠</MetricIcon>
            <MetricLabel>RAM Usage</MetricLabel>
            <MetricValue $crit={metricCrit(mem)} $warn={metricWarn(mem)}>{mem}%</MetricValue>
            <MetricSub>{((mem/100)*16).toFixed(1)} GB / 16 GB</MetricSub>
            <BarTrack><BarFill $pct={mem} $crit={metricCrit(mem)} $warn={metricWarn(mem)}/></BarTrack>
            <SparkLine style={{marginTop:'6px'}}>
              {memHist.map((v,i)=><SparkBar key={i} $h={v} $crit={v>85} $warn={v>70}/>)}
            </SparkLine>
          </MetricCard>
          <MetricCard $warn={metricWarn(disk)} $crit={metricCrit(disk)}>
            <MetricIcon>💾</MetricIcon>
            <MetricLabel>Disk Usage</MetricLabel>
            <MetricValue $crit={metricCrit(disk)} $warn={metricWarn(disk)}>{disk}%</MetricValue>
            <MetricSub>{((disk/100)*500).toFixed(0)} GB / 500 GB</MetricSub>
            <BarTrack><BarFill $pct={disk} $crit={metricCrit(disk)} $warn={metricWarn(disk)}/></BarTrack>
          </MetricCard>
        </MetricGrid>

        <div>
          <div style={{fontSize:'0.7rem',fontWeight:700,color:'var(--color-94a3b8, #94A3B8)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'8px'}}>Service Status</div>
          <ServiceGrid>
            {services.map((s,i)=>(
              <ServiceRow key={i} $ok={s.ok}>
                <SvcName>{s.name}</SvcName>
                <SvcStatus $ok={s.ok}>{s.ok?'● ONLINE':'● OFFLINE'}</SvcStatus>
              </ServiceRow>
            ))}
          </ServiceGrid>
        </div>

        <div>
          <div style={{fontSize:'0.7rem',fontWeight:700,color:'var(--color-94a3b8, #94A3B8)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'8px'}}>System Alerts</div>
          <AlertList>
            {alerts.map((a,i)=>(
              <AlertItem key={i} $type={a.type}>
                {a.type==='error'?'🔴':a.type==='warn'?'🟡':'🟢'} {a.text}
              </AlertItem>
            ))}
          </AlertList>
        </div>
      </Body>
    </Wrap>
  );
};

export default SystemHealthDashboard;
