import turingOrchestrator from '../aegis/core-loop/turingOrchestrator.ts';

(async () => {
  console.log('[runProcessPlans] Starting plan processing...');
  await turingOrchestrator.processPlans();
})();

