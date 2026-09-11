import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const Table = styled.table`width:100%;border-collapse:collapse;text-align:left`;
const TH = styled.th`padding:12px;font-size:.65rem;color:#94A3B8;border-bottom:1px solid rgba(100,116,139,0.2);text-transform:uppercase`;
const TD = styled.td`padding:14px 12px;border-bottom:1px solid rgba(100,116,139,0.1)`;

const EventName = styled.div`font-size:.85rem;color:#E2E8F0;font-weight:700`;
const EventDesc = styled.div`font-size:.65rem;color:#64748B;margin-top:4px`;

const ToggleSwitch = styled.div<{$on:boolean}>`width:36px;height:20px;background:${p=>p.$on?'#10B981':'rgba(100,116,139,0.3)'};border-radius:10px;position:relative;cursor:pointer;transition:all .2s;display:inline-block;vertical-align:middle;
  &::after{content:'';position:absolute;width:14px;height:14px;background:#FFF;border-radius:50%;top:3px;left:${p=>p.$on?'19px':'3px'};transition:all .2s;}
`;

type Prefs = { id:string; name:string; desc:string; email:boolean; push:boolean; wa:boolean };

const INITIAL: Prefs[] = [
  { id: 'lead', name: 'New Lead Assignment', desc: 'When a new lead is assigned to you', email: true, push: true, wa: true },
  { id: 'viewing', name: 'Viewing Reminders', desc: '2 hours before scheduled viewings', email: false, push: true, wa: true },
  { id: 'doc', name: 'Document Signatures', desc: 'When a client signs a contract', email: true, push: true, wa: false },
  { id: 'finance', name: 'Commission Payout', desc: 'When your commission split is approved', email: true, push: false, wa: false },
];

export const NotificationPreferencesPanel: FC = () => {
  const [prefs, setPrefs] = useState(INITIAL);

  const toggle = (id:string, channel: 'email'|'push'|'wa') => {
    setPrefs(p => p.map(x => x.id === id ? { ...x, [channel]: !x[channel] } : x));
  };

  return (
    <Wrap data-testid="notification-prefs-panel">
      <Title>🔔 Notification Preferences</Title>
      
      <Table>
        <thead>
          <tr>
            <TH>Event</TH>
            <TH style={{textAlign:'center'}}>Email</TH>
            <TH style={{textAlign:'center'}}>Push</TH>
            <TH style={{textAlign:'center'}}>WhatsApp</TH>
          </tr>
        </thead>
        <tbody>
          {prefs.map(p => (
            <tr key={p.id}>
              <TD><EventName>{p.name}</EventName><EventDesc>{p.desc}</EventDesc></TD>
              <TD style={{textAlign:'center'}}><ToggleSwitch $on={p.email} onClick={()=>toggle(p.id,'email')} /></TD>
              <TD style={{textAlign:'center'}}><ToggleSwitch $on={p.push} onClick={()=>toggle(p.id,'push')} /></TD>
              <TD style={{textAlign:'center'}}><ToggleSwitch $on={p.wa} onClick={()=>toggle(p.id,'wa')} /></TD>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrap>
  );
};
export default NotificationPreferencesPanel;
