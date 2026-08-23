/**
 * ChatSentimentAnalyzer — Wave 51 GOAL-057
 * Customer sentiment score analyzer on inbound WhatsApp chat histories
 * White Caves Real Estate LLC — Communications & AI Sentiment Suite
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

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChatItem = styled.div<{ $sentiment: 'positive' | 'urgent' | 'frustrated' }>`
  padding: 12px 14px;
  border-radius: 10px;
  background: ${p => p.$sentiment === 'frustrated' ? 'rgba(239, 68, 68, 0.08)' : p.$sentiment === 'urgent' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)'};
  border: 1px solid ${p => p.$sentiment === 'frustrated' ? 'rgba(239, 68, 68, 0.3)' : p.$sentiment === 'urgent' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CName = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #FFF;
`;

const CExcerpt = styled.div`
  font-size: 0.72rem;
  color: #94A3B8;
  font-style: italic;
`;

const ScoreSection = styled.div`
  text-align: right;
`;

const ScoreVal = styled.div<{ $sentiment: 'positive' | 'urgent' | 'frustrated' }>`
  font-size: 1.1rem;
  font-weight: 900;
  color: ${p => p.$sentiment === 'frustrated' ? '#EF4444' : p.$sentiment === 'urgent' ? '#F59E0B' : '#10B981'};
`;

export const ChatSentimentAnalyzer: FC = () => {
  const [chats, setChats] = useState([
    { id: '1', client: 'Tariq Mansour', excerpt: '"The penthouse viewing was exquisite, ready to submit Form F today!"', sentiment: 'positive' as const, score: '+94 (Very High Intent)', action: 'Fast-track Form F' },
    { id: '2', client: 'Sergei Volkov', excerpt: '"Need confirmation on the crypto payment rate lock ASAP before bank closes!"', sentiment: 'urgent' as const, score: '+78 (High Urgency)', action: 'Escalate to Desk' },
    { id: '3', client: 'Michael Davies', excerpt: '"Why has the Ejari certificate not been delivered? It has been 48 hours!"', sentiment: 'frustrated' as const, score: '-42 (At Risk)', action: 'Manager Call' },
  ]);

  return (
    <Wrap data-testid="chat-sentiment-analyzer">
      <Head>
        <Title>🧠 WhatsApp Inbound NLP Sentiment & Intent Analyzer</Title>
        <Tag>NINA NLP TELEMETRY</Tag>
      </Head>
      <Body>
        <div style={{ fontSize: '0.72rem', color: 'var(--color-94a3b8, #94A3B8)' }}>
          Real-time customer sentiment telemetry classifying inbound conversations into Intent, Urgency, and Churn Risk to trigger proactive executive interventions.
        </div>

        <ChatList>
          {chats.map(c => (
            <ChatItem key={c.id} $sentiment={c.sentiment}>
              <CInfo>
                <CName>{c.client}</CName>
                <CExcerpt>{c.excerpt}</CExcerpt>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #CBD5E1)', fontWeight: 700, marginTop: '2px' }}>
                  Recommended Action: <span style={{ color: 'var(--accent-red, #EF4444)' }}>{c.action}</span>
                </div>
              </CInfo>
              <ScoreSection>
                <ScoreVal $sentiment={c.sentiment}>{c.score}</ScoreVal>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary, #64748B)', textTransform: 'uppercase', fontWeight: 700 }}>Sentiment Index</div>
              </ScoreSection>
            </ChatItem>
          ))}
        </ChatList>
      </Body>
    </Wrap>
  );
};

export default ChatSentimentAnalyzer;
