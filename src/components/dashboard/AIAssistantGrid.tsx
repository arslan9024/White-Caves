import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AI_ASSISTANTS_REGISTRY } from '../../store/slices/aiAssistant/registry';
import type { RootState } from '../../store/store';

const useAssistantStatus = (assistantId: string): 'online' | 'standby' | 'offline' => {
  const selectedAssistant = useSelector((state: RootState) => state.sidebar.selectedAssistant);
  if (selectedAssistant === assistantId) return 'online';
  const assistant = AI_ASSISTANTS_REGISTRY[assistantId];
  if (assistant?.metrics?.systemHealth === 'optimal') return 'standby';
  return 'offline';
};

interface AssistantCardProps {
  id: string;
  name: string;
  title: string;
  department: string;
  description: string;
  avatar: string;
  onOpen: (assistantId: string) => void;
}

const AssistantCard: FC<AssistantCardProps> = ({
  id,
  name,
  title,
  department,
  description,
  avatar,
  onOpen,
}) => {
  const status = useAssistantStatus(id);
  return (
    <article className="dashboard-assistant-card">
      <div className="dashboard-assistant-card__header">
        <span>{avatar}</span>
        <div>
          <strong>{name}</strong>
          <small>{title}</small>
        </div>
        <span className={`dashboard-assistant-card__status dashboard-assistant-card__status--${status}`}>
          {status}
        </span>
      </div>
      <p>{description}</p>
      <div className="dashboard-assistant-card__footer">
        <span>{department}</span>
        <button type="button" onClick={() => onOpen(id)}>
          Open
        </button>
      </div>
    </article>
  );
};

interface AIAssistantGridProps {
  onOpenAssistant: (assistantId: string) => void;
}

const AIAssistantGrid: FC<AIAssistantGridProps> = ({ onOpenAssistant }) => {
  const assistants = useMemo(
    () =>
      Object.values(AI_ASSISTANTS_REGISTRY).map(item => ({
        id: item.id,
        name: item.name,
        title: item.title,
        department: item.department,
        description: item.description,
        avatar: item.avatar,
      })),
    []
  );

  return (
    <section className="dashboard-assistant-grid" aria-label="AI assistants">
      <div className="dashboard-assistant-grid__header">
        <h3>AI assistants</h3>
      </div>
      <div className="dashboard-assistant-grid__list">
        {assistants.map(assistant => (
          <AssistantCard key={assistant.id} {...assistant} onOpen={onOpenAssistant} />
        ))}
      </div>
    </section>
  );
};

export default AIAssistantGrid;
