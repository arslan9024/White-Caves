import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;

const Title = styled.h2`margin:0 0 8px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;
const SubTitle = styled.div`font-size:.7rem;color:#64748B;margin-bottom:24px`;

const Grid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:20px`;

const ThemeBox = styled.div<{$active:boolean}>`
  padding:16px;border-radius:12px;cursor:pointer;transition:all .15s;
  background:${p=>p.$active?'rgba(59,130,246,0.1)':'rgba(30,41,59,0.5)'};
  border:2px solid ${p=>p.$active?'#3B82F6':'rgba(100,116,139,0.2)'};
  &:hover{border-color:${p=>p.$active?'#3B82F6':'rgba(100,116,139,0.4)'}}
`;

const PreviewCard = styled.div<{$dark:boolean}>`
  width:100%;height:80px;border-radius:8px;margin-bottom:12px;
  background:${p=>p.$dark?'#0F172A':'#F8FAFC'};
  border:1px solid ${p=>p.$dark?'#1E293B':'#E2E8F0'};
  padding:10px;display:flex;flex-direction:column;gap:6px;
`;
const PLine = styled.div<{$dark:boolean;$w:string}>`height:6px;width:${p=>p.$w};border-radius:3px;background:${p=>p.$dark?'#334155':'#CBD5E1'}`;
const PBtn = styled.div`height:16px;width:40px;border-radius:4px;background:#3B82F6;margin-top:auto;align-self:flex-end`;

const TName = styled.div`font-size:.8rem;font-weight:700;color:#E2E8F0;text-align:center`;

const AccentRow = styled.div`display:flex;gap:12px;margin-top:24px;padding-top:24px;border-top:1px solid rgba(100,116,139,0.15)`;
const AccentCol = styled.div`display:flex;flex-direction:column;gap:12px`;
const AccentTitle = styled.div`font-size:.75rem;font-weight:700;color:#94A3B8`;
const Colors = styled.div`display:flex;gap:10px`;
const ColorBtn = styled.div<{$color:string;$active:boolean}>`
  width:28px;height:28px;border-radius:50%;background:${p=>p.$color};cursor:pointer;
  border:2px solid ${p=>p.$active?'#FFF':'transparent'};
  box-shadow:${p=>p.$active?'0 0 0 2px '+p.$color:'none'};
  transition:all .15s;&:hover{transform:scale(1.1)}
`;

export const AppearanceThemeSelector: FC = () => {
  const [theme, setTheme] = useState<'dark'|'light'>('dark');
  const [accent, setAccent] = useState('#3B82F6');

  return (
    <Wrap data-testid="appearance-theme-selector">
      <Title>🎨 Appearance</Title>
      <SubTitle>Customize how White Caves looks on your device.</SubTitle>

      <Grid>
        <ThemeBox $active={theme==='dark'} onClick={()=>setTheme('dark')}>
          <PreviewCard $dark={true}>
            <PLine $dark={true} $w="60%"/>
            <PLine $dark={true} $w="40%"/>
            <PBtn style={{background:accent}}/>
          </PreviewCard>
          <TName>Dark Mode</TName>
        </ThemeBox>
        <ThemeBox $active={theme==='light'} onClick={()=>setTheme('light')}>
          <PreviewCard $dark={false}>
            <PLine $dark={false} $w="60%"/>
            <PLine $dark={false} $w="40%"/>
            <PBtn style={{background:accent}}/>
          </PreviewCard>
          <TName>Light Mode</TName>
        </ThemeBox>
      </Grid>

      <AccentRow>
        <AccentCol>
          <AccentTitle>Accent Color</AccentTitle>
          <Colors>
            {['#3B82F6','#8B5CF6','#F43F5E','#10B981','#F59E0B'].map(c=>(
              <ColorBtn key={c} $color={c} $active={accent===c} onClick={()=>setAccent(c)}/>
            ))}
          </Colors>
        </AccentCol>
      </AccentRow>
    </Wrap>
  );
};
export default AppearanceThemeSelector;
