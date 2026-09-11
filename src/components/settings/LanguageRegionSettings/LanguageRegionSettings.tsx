import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const Field = styled.div`margin-bottom:20px`;
const Label = styled.label`display:block;font-size:.75rem;color:#94A3B8;font-weight:600;margin-bottom:8px`;
const Select = styled.select`width:100%;padding:12px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.9rem;outline:none;appearance:none;cursor:pointer`;

const BtnPrimary = styled.button`padding:10px 20px;background:#3B82F6;color:#FFF;border:none;border-radius:8px;font-weight:700;font-size:.85rem;cursor:pointer;margin-top:10px;width:100%`;

export const LanguageRegionSettings: FC = () => {
  return (
    <Wrap data-testid="language-region-settings">
      <Title>🌍 Language & Region</Title>
      
      <Field>
        <Label>System Language</Label>
        <Select defaultValue="en">
          <option value="en">English (UK)</option>
          <option value="en-us">English (US)</option>
          <option value="ar">العربية (Arabic)</option>
          <option value="ru">Русский (Russian)</option>
          <option value="zh">中文 (Chinese)</option>
        </Select>
      </Field>

      <Field>
        <Label>Timezone</Label>
        <Select defaultValue="gst">
          <option value="gst">(UTC+04:00) Gulf Standard Time (Dubai)</option>
          <option value="utc">(UTC+00:00) Coordinated Universal Time</option>
          <option value="est">(UTC-05:00) Eastern Time</option>
        </Select>
      </Field>

      <Field>
        <Label>Date Format</Label>
        <Select defaultValue="dmy">
          <option value="dmy">DD/MM/YYYY (24/09/2026)</option>
          <option value="mdy">MM/DD/YYYY (09/24/2026)</option>
          <option value="ymd">YYYY-MM-DD (2026-09-24)</option>
        </Select>
      </Field>

      <Field>
        <Label>Default Currency Display</Label>
        <Select defaultValue="aed">
          <option value="aed">AED (Dirham)</option>
          <option value="usd">USD (Dollar)</option>
          <option value="eur">EUR (Euro)</option>
        </Select>
      </Field>

      <BtnPrimary>Save Preferences</BtnPrimary>
    </Wrap>
  );
};
export default LanguageRegionSettings;
