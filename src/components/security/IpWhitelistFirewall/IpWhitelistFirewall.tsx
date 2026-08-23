/**
 * IpWhitelistFirewall — Wave 55 GOAL-095
 * Zero-trust IP whitelist firewall for administrative CRM login
 * White Caves Real Estate LLC — Security Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(239, 68, 68, 0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(239, 68, 68, 0.05);
  border-bottom: 1px solid rgba(239, 68, 68, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: #FFF;
  font-size: 0.92rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ShieldTag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.25);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AddRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr auto;
  gap: 8px;
  align-items: center;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const AddBtn = styled.button`
  padding: 8px 14px;
  border-radius: 7px;
  border: none;
  background: #EF4444;
  color: #FFF;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  &:hover { filter: brightness(1.1); }
`;

const IpList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const IpCard = styled.div`
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const IpInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IpAddress = styled.span`
  font-family: monospace;
  font-size: 0.82rem;
  font-weight: 700;
  color: #FFF;
`;

const IpLabel = styled.span`
  font-size: 0.72rem;
  color: #94A3B8;
`;

const DeleteBtn = styled.button`
  background: transparent;
  border: none;
  color: #EF4444;
  cursor: pointer;
  font-size: 0.85rem;
  &:hover { filter: brightness(1.3); }
`;

export const IpWhitelistFirewall: FC = () => {
  const [ips, setIps] = useState([
    { id: '1', ip: '194.187.168.22', label: 'White Caves HQ (Downtown Office)', role: 'Executive (L5)' },
    { id: '2', ip: '82.178.44.102', label: 'Managing Director Dedicated VPN', role: 'Superuser' },
    { id: '3', ip: '213.42.155.80', label: 'Emaar Square Branch Terminal', role: 'Broker Staff' },
  ]);

  const [newIp, setNewIp] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newRole, setNewRole] = useState('Broker Staff');

  const handleAdd = () => {
    if (!newIp) return;
    setIps(prev => [...prev, { id: String(Date.now()), ip: newIp, label: newLabel || 'Designated Terminal', role: newRole }]);
    setNewIp('');
    setNewLabel('');
  };

  const handleDelete = (id: string) => {
    setIps(prev => prev.filter(ip => ip.id !== id));
  };

  return (
    <Wrap data-testid="ip-whitelist-firewall">
      <Head>
        <Title>🛡️ Zero-Trust Administrative IP Whitelist Firewall</Title>
        <ShieldTag>ACTIVE DEFENSE</ShieldTag>
      </Head>
      <Body>
        <AddRow>
          <Input 
            value={newIp} 
            onChange={e => setNewIp(e.target.value)} 
            placeholder="IP Address (e.g. 194.187.168.22)" 
          />
          <Input 
            value={newLabel} 
            onChange={e => setNewLabel(e.target.value)} 
            placeholder="Location / Device Description" 
          />
          <Select value={newRole} onChange={e => setNewRole(e.target.value)}>
            <option value="Executive (L5)">Executive (L5)</option>
            <option value="Superuser">Superuser</option>
            <option value="Broker Staff">Broker Staff</option>
          </Select>
          <AddBtn onClick={handleAdd}>+ Add Whitelist IP</AddBtn>
        </AddRow>

        <IpList>
          {ips.map(item => (
            <IpCard key={item.id}>
              <IpInfo>
                <span style={{ fontSize: '1rem' }}>🌐</span>
                <IpAddress>{item.ip}</IpAddress>
                <IpLabel>{item.label}</IpLabel>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red, #EF4444)' }}>
                  {item.role}
                </span>
              </IpInfo>
              <DeleteBtn onClick={() => handleDelete(item.id)} title="Revoke IP Access">🗑</DeleteBtn>
            </IpCard>
          ))}
        </IpList>
      </Body>
    </Wrap>
  );
};

export default IpWhitelistFirewall;
