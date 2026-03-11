import React, { memo } from 'react';
import * as S from './TimelineView.styles';

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  time?: string;
  color?: string;
  tags?: string[];
  size?: 'small' | 'medium' | 'large';
}

interface TimelineViewProps {
  events: TimelineEvent[];
  orientation?: 'vertical' | 'horizontal';
}

/**
 * TimelineView - Event Timeline Component
 * 
 * Displays a chronological timeline of events with markers, descriptions,
 * and tags. Perfect for process flows, activity logs, or project milestones.
 * 
 * @example
 * <TimelineView
 *   events={[
 *     {
 *       id: '1',
 *       title: 'Project Started',
 *       description: 'Initial project setup',
 *       time: '2026-03-01',
 *       color: '#3b82f6',
 *       tags: ['Setup', 'Important']
 *     }
 *   ]}
 * />
 */
const TimelineView = memo(({ events, orientation = 'vertical' }: TimelineViewProps) => {
  return (
    <S.TimelineContainer>
      {events.map((event) => (
        <S.TimelineEvent key={event.id}>
          <S.TimelineMarker
            color={event.color}
            size={event.size || 'medium'}
            role="img"
            aria-label={event.title}
          >
            ●
          </S.TimelineMarker>

          <S.TimelineContent>
            <S.TimelineTitle>{event.title}</S.TimelineTitle>
            {event.time && <S.TimelineTime>{event.time}</S.TimelineTime>}
            {event.description && (
              <S.TimelineDescription>{event.description}</S.TimelineDescription>
            )}
            {event.tags && event.tags.length > 0 && (
              <S.TimelineTags>
                {event.tags.map((tag, idx) => (
                  <S.TimelineTag
                    key={idx}
                    color={event.color}
                  >
                    {tag}
                  </S.TimelineTag>
                ))}
              </S.TimelineTags>
            )}
          </S.TimelineContent>
        </S.TimelineEvent>
      ))}
    </S.TimelineContainer>
  );
});

TimelineView.displayName = 'TimelineView';

export default TimelineView;
