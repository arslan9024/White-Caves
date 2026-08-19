/**
 * MobileDashboardPage.style.ts — Style Layer
 */

import styled from 'styled-components';

export const PageRoot = styled.div`
  min-height: 100dvh;
  background: #f8fafc;
  padding-bottom: 80px; /* clearance for bottom nav */
  font-family: 'Inter', sans-serif;
`;

export const HeaderBar = styled.header`
  background: #ef4444;
  padding: 16px 16px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const GreetingText = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0;
`;

export const DateText = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
`;

export const NotifBadge = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  position: relative;
`;

export const NotifDot = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fbbf24;
  border: 2px solid #ef4444;
`;

export const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  padding: 16px 16px 8px;
  margin: 0;
`;

export const ActivityList = styled.ul`
  list-style: none;
  padding: 0 16px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ActivityItem = styled.li`
  background: #fff;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid #f1f5f9;
`;

export const ActivityIconBox = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${({ $color }) => $color}18;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ActivityBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ActivityTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ActivityDetail = styled.p`
  font-size: 12px;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ActivityTime = styled.span`
  font-size: 11px;
  color: #94a3b8;
  flex-shrink: 0;
`;
