import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const glow = keyframes`0%,100%{box-shadow:0 0 20px rgba(245,158,11,0.2)}50%{box-shadow:0 0 40px rgba(245,158,11,0.5)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:linear-gradient(135deg,#0A0A14,#0F0F1E);border:2px solid rgba(245,158,11,0.3);border-radius:20px;overflow:hidden;animation:${glow} 3s ease-in-out infinite`;
const Head = styled.div`padding:14px 20px;background:rgba(245,158,11,0.06);border-bottom:1px solid rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;font-size:.9rem;font-weight:700;color:#FFF`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:16px`;

const ToggleRow = styled.div`display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-radius:14px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2)`;
const ToggleLabel = styled.div``;
const ToggleTitle = styled.div`font-size:.82rem;font-weight:700;color:#FFF;margin-bottom:2px`;
const ToggleSub = styled.div`font-size:.65rem;color:#64748B`;
const Toggle = styled.div<{$on:boolean}>`
  width:52px;height:28px;border-radius:14px;background:${p=>p.$on?'#F59E0B':'rgba(100,116,139,0.3)'};
  cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;
`;
const ToggleKnob = styled.div<{$on:boolean}>`
  width:22px;height:22px;border-radius:50%;background:#FFF;position:absolute;top:3px;
  left:${p=>p.$on?'27px':'3px'};transition:left .2s;box-shadow:0 2px 8px rgba(0,0,0,.2);
`;

const TaskList = styled.div`display:flex;flex-direction:column;gap:6px`;
const TaskRow = styled.div<{$done:boolean;$running:boolean}>`
  display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;
  background:${p=>p.$running?'rgba(245,158,11,0.08)':p.$done?'rgba(16,185,129,0.07)':'rgba(15,23,42,0.5)'};
  border:1px solid ${p=>p.$running?'rgba(245,158,11,0.25)':p.$done?'rgba(16,185,129,0.2)':'rgba(100,116,139,0.1)'};
`;
const TaskIcon = styled.div<{$running:boolean}>`
  font-size:.85rem;flex-shrink:0;
  animation:${p=>p.$running?spin:''} 1s linear infinite;
`;
const TaskInfo = styled.div`flex:1`;
const TaskTitle = styled.div`font-size:.73rem;font-weight:700;color:#CBD5E1`;
const TaskMeta = styled.div`font-size:.62rem;color:#64748B;margin-top:2px`;
const TaskStatus = styled.div<{$done:boolean;$running:boolean}>`font-size:.62rem;font-weight:700;color:${p=>p.$running?'#F59E0B':p.$done?'#10B981':'#475569'}`;

const AUTOPILOT_TASKS = [
  {icon:'📧',title:'Morning Follow-Up Emails',meta:'Sent to 12 warm leads · Personalised AI content',done:true,running:false},
  {icon:'💬',title:'WhatsApp Broadcast',meta:'Sending to 287 contacts · DAMAC Lagoons update',done:false,running:true},
  {icon:'📊',title:'CRM Lead Score Update',meta:'Re-scoring 148 leads based on new signals',done:false,running:true},
  {icon:'📅',title:'Viewing Reminders',meta:'3 viewings today · Reminders scheduled 2hr before',done:true,running:false},
  {icon:'📋',title:'Daily Activity Report',meta:'Scheduled for 18:00 · Auto-sent to manager',done:false,running:false},
  {icon:'🔍',title:'New Lead Assignment',meta:'8 Property Finder leads queued · Auto-assigning by area',done:false,running:false},
];

export const AgentAutopilotDashboard: FC = () => {
  const [enabled, setEnabled] = useState(true);

  return (
    <Wrap data-testid="agent-autopilot-dashboard">
      <Head>
        <Title>🤖 Agent Autopilot</Title>
        <div style={{fontSize:'.7rem',color:enabled?'#F59E0B':'#64748B',fontWeight:700}}>{enabled?'⚡ RUNNING':'⬜ PAUSED'}</div>
      </Head>
      <Body>
        <ToggleRow>
          <ToggleLabel>
            <ToggleTitle>AI Autopilot Mode</ToggleTitle>
            <ToggleSub>{enabled?'Actively handling tasks, follow-ups, and CRM updates':'Click to enable — AI will manage your daily workflow'}</ToggleSub>
          </ToggleLabel>
          <Toggle $on={enabled} onClick={()=>setEnabled(p=>!p)}>
            <ToggleKnob $on={enabled}/>
          </Toggle>
        </ToggleRow>

        {enabled && (
          <>
            <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:700}}>📋 Active Tasks Today</div>
            <TaskList>
              {AUTOPILOT_TASKS.map((t,i)=>(
                <TaskRow key={i} $done={t.done} $running={t.running}>
                  <TaskIcon $running={t.running}>{t.running?'⟳':t.done?'✅':t.icon}</TaskIcon>
                  <TaskInfo>
                    <TaskTitle>{t.title}</TaskTitle>
                    <TaskMeta>{t.meta}</TaskMeta>
                  </TaskInfo>
                  <TaskStatus $done={t.done} $running={t.running}>
                    {t.running?'Running...':t.done?'Done':'Queued'}
                  </TaskStatus>
                </TaskRow>
              ))}
            </TaskList>
          </>
        )}

        {!enabled && (
          <div style={{textAlign:'center',padding:'20px',color:'#64748B',fontSize:'.78rem'}}>
            🤖 Autopilot is paused.<br/>
            <span style={{fontSize:'.68rem',color:'#475569'}}>Enable to automate follow-ups, lead scoring, and CRM updates.</span>
          </div>
        )}
      </Body>
    </Wrap>
  );
};
export default AgentAutopilotDashboard;
