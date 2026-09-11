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
  durationMs?: number;
}

export const useFinanceEngineVitestUnitTestsLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  const [isRunning, setIsRunning] = useState(false);
  const [coverage, setCoverage] = useState(0);
  const [steps, setSteps] = useState<TestStep[]>([
    { id: 'vat', name: t.test_step_1, status: 'idle' },
    { id: 'double_entry', name: t.test_step_2, status: 'idle' },
    { id: 'payroll', name: t.test_step_3, status: 'idle' },
  ]);

  const runTests = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCoverage(0);
    
    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: 'idle', durationMs: undefined })));
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Mark as running
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s));
      
      // Simulate test execution delay
      const delay = 600 + Math.random() * 400;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Mark as passed
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'passed', durationMs: Math.round(delay) } : s));
      
      // Update coverage progressively
      setCoverage(prev => prev + 31);
    }
    
    setCoverage(94); // Final coverage above 80%

    setIsRunning(false);
  };

  return {
    t,
    isRtl,
    steps,
    isRunning,
    coverage,
    runTests
  };
};
