import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:32px;color:#FFF`;
const Title = styled.h2`margin:0 0 32px;font-size:1.2rem;font-weight:900;text-align:center;text-transform:uppercase;letter-spacing:1px`;

const MatchArea = styled.div`display:flex;align-items:center;justify-content:space-between;position:relative`;

const Team = styled.div<{$align:'left'|'right'}>`text-align:${p=>p.$align};width:40%`;
const TName = styled.div<{$c:string}>`font-size:1.2rem;font-weight:900;color:${p=>p.$c};margin-bottom:8px`;
const TScore = styled.div`font-size:2.5rem;font-weight:900;color:#FFF;font-family:monospace`;

const VS = styled.div`width:50px;height:50px;border-radius:25px;background:#334155;display:flex;align-items:center;justify-content:center;font-weight:900;font-style:italic;color:#94A3B8;position:absolute;left:50%;transform:translateX(-50%)`;

const BarWrap = styled.div`width:100%;height:16px;background:#334155;border-radius:8px;margin-top:32px;display:flex;overflow:hidden`;
const LeftFill = styled.div<{w:number}>`width:${p=>p.w}%;height:100%;background:#38BDF8`;
const RightFill = styled.div<{w:number}>`width:${p=>p.w}%;height:100%;background:#F43F5E`;

export const TeamVersusMatchup: FC = () => {
  return (
    <Wrap data-testid="team-versus-matchup">
      <Title>🥊 Q3 Sales Throwdown 🥊</Title>
      
      <MatchArea>
        <Team $align="left">
          <TName $c="#38BDF8">Team Downtown</TName>
          <TScore>18.4M</TScore>
        </Team>
        
        <VS>VS</VS>
        
        <Team $align="right">
          <TName $c="#F43F5E">Team Marina</TName>
          <TScore>14.2M</TScore>
        </Team>
      </MatchArea>

      <BarWrap>
        <LeftFill w={56} />
        <RightFill w={44} />
      </BarWrap>
      <div style={{textAlign:'center',fontSize:'.75rem',color:'#94A3B8',marginTop:12}}>Team Downtown is leading by AED 4.2M! 5 days remaining.</div>
    </Wrap>
  );
};
export default TeamVersusMatchup;
