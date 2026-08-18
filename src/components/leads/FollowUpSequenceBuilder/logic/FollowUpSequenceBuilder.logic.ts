/** FollowUpSequenceBuilder.logic.ts */
import { useState, useCallback } from 'react';

export interface SequenceStep {
  id: string; day: number;
  channel: 'whatsapp' | 'email' | 'call' | 'task';
  message: string;
}

const DEFAULT_SEQUENCE: SequenceStep[] = [
  { id: 's1', day: 0, channel: 'whatsapp', message: 'Hi! Thanks for your interest. Here are 3 properties matching your search 🏠' },
  { id: 's2', day: 2, channel: 'call', message: 'Follow-up call to discuss requirements' },
  { id: 's3', day: 5, channel: 'email', message: 'Send market report for selected area' },
  { id: 's4', day: 7, channel: 'whatsapp', message: 'Share new listing that just came on market' },
  { id: 's5', day: 14, channel: 'task', message: 'Reassess lead — update stage' },
];

const CHANNEL_COLORS: Record<string, string> = {
  whatsapp: '#22c55e', email: '#3b82f6', call: '#ef4444', task: '#f59e0b',
};

export function useFollowUpSequenceBuilderLogic() {
  const [steps, setSteps] = useState<SequenceStep[]>(DEFAULT_SEQUENCE);

  const removeStep = useCallback((id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addStep = useCallback(() => {
    const newId = `s${Date.now()}`;
    const lastDay = steps[steps.length - 1]?.day ?? 0;
    setSteps((prev) => [
      ...prev,
      { id: newId, day: lastDay + 7, channel: 'whatsapp', message: 'New follow-up message' },
    ]);
  }, [steps]);

  return { steps, removeStep, addStep, CHANNEL_COLORS };
}
