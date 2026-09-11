import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const tick = keyframes`from{opacity:1}to{opacity:.4}`;

const Wrap = styled.div`
  padding:20px;border-radius:18px;background:rgba(15,23,42,0.85);
  border:1px solid rgba(100,116,139,0.15);font-family:'Inter',sans-serif;
  animation:${fadeIn} .4s ease;
`;
const TopRow = styled.div`display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px`;
const CityLabel = styled.div`font-size:.65rem;font-weight:700;color:#64748B;letter-spacing:.5px;text-transform:uppercase`;
const DayLabel = styled.div`font-size:.72rem;color:#94A3B8;margin-top:2px`;
const TempBlock = styled.div`text-align:right`;
const TempVal = styled.div`font-size:2rem;font-weight:900;color:#F59E0B;line-height:1`;
const TempDesc = styled.div`font-size:.68rem;color:#64748B;margin-top:2px`;

const ClockRow = styled.div`margin-bottom:14px;text-align:center`;
const ClockTime = styled.div`font-size:2.2rem;font-weight:900;color:#E2E8F0;font-family:'Courier New',monospace;letter-spacing:2px`;
const ClockSep = styled.span`animation:${tick} 1s ease-in-out infinite`;
const TimeZone = styled.div`font-size:.65rem;color:#475569;margin-top:2px;text-align:center`;

const MetricRow = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px`;
const Metric = styled.div`text-align:center;padding:8px;border-radius:9px;background:rgba(30,41,59,0.5)`;
const MetVal = styled.div`font-size:.82rem;font-weight:800;color:#CBD5E1`;
const MetLab = styled.div`font-size:.58rem;color:#64748B;margin-top:2px`;

const DayNightBadge = styled.div<{$day:boolean}>`
  display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:999px;margin-top:10px;
  background:${p=>p.$day?'rgba(245,158,11,0.1)':'rgba(99,102,241,0.1)'};
  border:1px solid ${p=>p.$day?'rgba(245,158,11,0.25)':'rgba(99,102,241,0.25)'};
  font-size:.65rem;font-weight:700;color:${p=>p.$day?'#F59E0B':'#818CF8'};
`;

export const DashboardWeatherLocationCard: FC = () => {
  const [time, setTime] = useState(new Date());
  useEffect(()=>{const i=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(i);},[]);

  const h = time.getHours();
  const m = String(time.getMinutes()).padStart(2,'0');
  const s = String(time.getSeconds()).padStart(2,'0');
  const hStr = String(h%12||12).padStart(2,'0');
  const ampm = h<12?'AM':'PM';
  const isDay = h>=6&&h<20;
  const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][time.getDay()];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <Wrap data-testid="dashboard-weather-location-card">
      <TopRow>
        <div>
          <CityLabel>📍 Dubai, UAE · DIFC</CityLabel>
          <DayLabel>{dayName}, {time.getDate()} {monthNames[time.getMonth()]} 2026</DayLabel>
        </div>
        <TempBlock>
          <TempVal>38°C</TempVal>
          <TempDesc>☀️ Sunny</TempDesc>
        </TempBlock>
      </TopRow>

      <ClockRow>
        <ClockTime>{hStr}<ClockSep>:</ClockSep>{m}<ClockSep>:</ClockSep>{s} {ampm}</ClockTime>
        <TimeZone>Gulf Standard Time (GST) · UTC+4</TimeZone>
      </ClockRow>

      <div style={{textAlign:'center'}}>
        <DayNightBadge $day={isDay}>
          {isDay?'☀️ Daylight Hours':'🌙 Night Mode'} · {isDay?'Sunset 18:52':'Sunrise 06:14'}
        </DayNightBadge>
      </div>

      <MetricRow>
        <Metric><MetVal>95%</MetVal><MetLab>💧 Humidity</MetLab></Metric>
        <Metric><MetVal>7 km/h</MetVal><MetLab>🌬️ Wind</MetLab></Metric>
        <Metric><MetVal>UV 11</MetVal><MetLab>☀️ UV Index</MetLab></Metric>
      </MetricRow>
    </Wrap>
  );
};
export default DashboardWeatherLocationCard;
