import turingOrchestrator from '../aegis/core-loop/turingOrchestrator';

(async () => {
  console.log('[runLogPlans] Invoking orchestrator to list plans...');
  await turingOrchestrator.logPlans();
})();
