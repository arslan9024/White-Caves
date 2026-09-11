import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

export type TestStatus = 'idle' | 'running' | 'passed' | 'failed';

export interface TestStep {
  id: string;
  name: string;
  status: TestStatus;
}

export const useFinanceEnginePlaywrightE2ELogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [steps, setSteps] = useState<TestStep[]>([
    { id: 'create', name: t.test_step_1, status: 'idle' },
    { id: 'approve', name: t.test_step_2, status: 'idle' },
    { id: 'pay', name: t.test_step_3, status: 'idle' },
    { id: 'reconcile', name: t.test_step_4, status: 'idle' },
  ]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runTests = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    
    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: 'idle' })));
    
    addLog('Starting Playwright E2E Suite...');

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Mark as running
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s));
      addLog(`Running step: ${step.name}...`);
      
      // Simulate network/test delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark as passed (simulate success)
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'passed' } : s));
      addLog(`Step passed: ${step.name} (coverage: 100%)`);
    }

    addLog('Playwright E2E Suite finished successfully. All tests passed.');
    setIsRunning(false);
  };

  return {
    t,
    isRtl,
    steps,
    logs,
    isRunning,
    runTests
  };
};
