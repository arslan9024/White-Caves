import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const PostList = styled.div`display:flex;flex-direction:column;gap:16px`;
const Post = styled.div<{$imp?:boolean}>`
  background:rgba(30,41,59,0.5);border-radius:12px;padding:20px;
  border-left:4px solid ${p=>p.$imp?'#F43F5E':'#3B82F6'};
`;
const PHeader = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:12px`;
const PTitle = styled.div`font-size:1rem;font-weight:800;color:#E2E8F0`;
const PDate = styled.div`font-size:.7rem;color:#94A3B8`;
const PBody = styled.div`font-size:.85rem;color:#CBD5E1;line-height:1.5`;

export const InternalAnnouncementBoard: FC = () => {
  return (
    <Wrap data-testid="internal-announcement-board">
      <Title>📢 Company Announcements</Title>
      
      <PostList>
        <Post $imp={true}>
          <PHeader>
            <PTitle>🏆 Agent of the Month (August 2026)</PTitle>
            <PDate>Posted 2 days ago</PDate>
          </PHeader>
          <PBody>
            Congratulations to <strong>Ivan Petrov</strong> for closing 4 off-plan units in Dubai Creek Harbour, generating over AED 1.2M in commission revenue! The trophy and bonus will be presented at this Thursday's team meeting.
          </PBody>
        </Post>
        
        <Post>
          <PHeader>
            <PTitle>📝 New DLD Compliance Regulation</PTitle>
            <PDate>Posted 1 week ago</PDate>
          </PHeader>
          <PBody>
            Attention all secondary market agents: RERA has updated the Form F requirements. All MOUs must now include the new anti-money laundering addendum signed by both buyer and seller. Please check the training library for the updated PDF.
          </PBody>
        </Post>
      </PostList>
    </Wrap>
  );
};
export default InternalAnnouncementBoard;
