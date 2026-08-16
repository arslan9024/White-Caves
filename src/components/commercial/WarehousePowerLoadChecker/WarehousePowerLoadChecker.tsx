/**
 * WarehousePowerLoadChecker — Wave 54 GOAL-085
 * Industrial warehouse & logistics park electrical power load (kW / KVA) and civil zoning checker
 * White Caves Real Estate LLC — Industrial & Logistics Suite
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

const Tag = styled.span`
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FLabel = styled.label`
  font-size: 0.68rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
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
  width: 100%;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const EvaluationBox = styled.div<{ $suitable: boolean }>`
  padding: 16px;
  border-radius: 12px;
  background: ${p => p.$suitable ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'};
  border: 1.5px solid ${p => p.$suitable ? '#10B981' : '#EF4444'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const WarehousePowerLoadChecker: FC = () => {
  const [warehouseZone, setWarehouseZone] = useState('Dubai South Logistics City (DWC)');
  const [allocatedPowerKw, setAllocatedPowerKw] = useState('450');
  const [requiredPowerKw, setRequiredPowerKw] = useState('320');
  const [industrialUsage, setIndustrialUsage] = useState('Cold Storage & Pharmaceutical Logistics');

  const allocated = Number(allocatedPowerKw) || 0;
  const required = Number(requiredPowerKw) || 0;
  const isSuitable = allocated >= required;

  return (
    <Wrap data-testid="warehouse-power-load-checker">
      <Head>
        <Title>⚡ Industrial Warehouse Electrical Power Load & Zoning Validator</Title>
        <Tag>DEWA INDUSTRIAL AUDIT</Tag>
      </Head>
      <Body>
        <FormGrid>
          <Field>
            <FLabel>Industrial Zone Location</FLabel>
            <Select value={warehouseZone} onChange={e => setWarehouseZone(e.target.value)}>
              <option value="Dubai South Logistics City (DWC)">Dubai South Logistics City (DWC)</option>
              <option value="Jebel Ali Free Zone (JAFZA)">Jebel Ali Free Zone (JAFZA)</option>
              <option value="Dubai Industrial City (DIC)">Dubai Industrial City (DIC)</option>
              <option value="Al Quoz Industrial Area 3">Al Quoz Industrial Area 3</option>
              <option value="Ras Al Khor Industrial">Ras Al Khor Industrial</option>
            </Select>
          </Field>
          <Field>
            <FLabel>DEWA Connected Power (kW)</FLabel>
            <Input type="number" value={allocatedPowerKw} onChange={e => setAllocatedPowerKw(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Tenant Peak Load Required (kW)</FLabel>
            <Input type="number" value={requiredPowerKw} onChange={e => setRequiredPowerKw(e.target.value)} />
          </Field>
          <Field style={{ gridColumn: 'span 3' }}>
            <FLabel>Industrial Activity & Operations Category</FLabel>
            <Select value={industrialUsage} onChange={e => setIndustrialUsage(e.target.value)}>
              <option value="Cold Storage & Pharmaceutical Logistics">Cold Storage & Pharmaceutical Logistics (High Continuous Load)</option>
              <option value="Light Manufacturing & Assembly">Light Manufacturing & Assembly (Medium Load)</option>
              <option value="E-Commerce Fulfillment Center">E-Commerce Fulfillment Center (Automation / Sorters)</option>
              <option value="General Dry Storage Warehouse">General Dry Storage Warehouse (Low Base Load)</option>
            </Select>
          </Field>
        </FormGrid>

        <EvaluationBox $suitable={isSuitable}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
              Electrical Capacity Compatibility
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
              {isSuitable ? '✓ Fully Compatible — Adequate Power Headroom' : '⚠️ Insufficient Connected Load — DEWA Upgrade Required'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#CBD5E1', marginTop: '4px' }}>
              Surplus Power Capacity: <strong style={{ color: isSuitable ? '#10B981' : '#EF4444' }}>{allocated - required} kW</strong> ({(allocated * 1.25).toFixed(0)} KVA Equivalent)
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: isSuitable ? '#10B981' : '#EF4444' }}>
              {isSuitable ? 'APPROVED' : 'UPGRADE REQ.'}
            </div>
          </div>
        </EvaluationBox>
      </Body>
    </Wrap>
  );
};

export default WarehousePowerLoadChecker;
