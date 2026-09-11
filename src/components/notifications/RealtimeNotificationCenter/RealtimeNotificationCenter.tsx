import React, { FC, useState, useEffect, useRef } from 'react';
import { Radio } from 'lucide-react';
import { 
  CenterWrap, Header, Title, StatusBadge, 
  FeedList, FeedItem, FeedItemTitle, FeedItemMessage, FeedItemTime,
  TestControls, TestButton 
} from './RealtimeNotificationCenter.style';

interface NotificationEvent {
  id: string;
  type: 'alert' | 'assignment' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

export const RealtimeNotificationCenter: FC = () => {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate WebSocket connection
    const timer = setTimeout(() => {
      setConnected(true);
      addEvent('success', 'WebSocket Connected', 'Successfully connected to room:user:current');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new events arrive
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [events]);

  const addEvent = (type: NotificationEvent['type'], title: string, message: string) => {
    const newEvent: NotificationEvent = {
      id: Math.random().toString(36).substring(7),
      type,
      title,
      message,
      timestamp: new Date()
    };
    setEvents(prev => [...prev, newEvent].slice(-20)); // Keep last 20
  };

  const simulateAssignment = () => {
    addEvent('assignment', 'New Lead Assigned', 'You have been assigned a new lead from Property Finder.');
  };

  const simulateAlert = () => {
    addEvent('alert', 'SLA Warning', 'Lead #1042 is approaching the 2-hour response SLA limit.');
  };

  const simulateGlobal = () => {
    addEvent('info', 'System Broadcast', 'Scheduled maintenance will occur at 02:00 AM GST.');
  };

  return (
    <CenterWrap>
      <Header>
        <Title><Radio size={20} color={connected ? "#22C55E" : "#94A3B8"} /> Live Activity Feed</Title>
        <StatusBadge $connected={connected}>
          {connected ? 'WSS: CONNECTED' : 'WSS: CONNECTING...'}
        </StatusBadge>
      </Header>
      
      <FeedList ref={listRef}>
        {events.length === 0 && (
          <div style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
            Waiting for incoming events...
          </div>
        )}
        {events.map(ev => (
          <FeedItem key={ev.id} $type={ev.type}>
            <FeedItemTitle>{ev.title}</FeedItemTitle>
            <FeedItemMessage>{ev.message}</FeedItemMessage>
            <FeedItemTime>{ev.timestamp.toLocaleTimeString()}</FeedItemTime>
          </FeedItem>
        ))}
      </FeedList>

      <TestControls>
        <TestButton onClick={simulateAssignment} disabled={!connected}>Test Lead Assgn</TestButton>
        <TestButton onClick={simulateAlert} disabled={!connected}>Test SLA Alert</TestButton>
        <TestButton onClick={simulateGlobal} disabled={!connected}>Test Global Broadcast</TestButton>
      </TestControls>
    </CenterWrap>
  );
};
