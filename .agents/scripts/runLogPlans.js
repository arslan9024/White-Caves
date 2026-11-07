require('ts-node').register();
const { default: turingOrchestrator } = require('../aegis/core-loop/turingOrchestrator');
(async () => {
  console.log('[runLogPlans] Invoking orchestrator to list plans...');
  await turingOrchestrator.logPlans();
})();
