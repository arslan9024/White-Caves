require('ts-node').register({ transpileOnly: true });
const { default: turingOrchestrator } = require('../aegis/core-loop/turingOrchestrator');
(async () => {
  console.log('[runLogPlans] Invoking orchestrator to list plans...');
  await turingOrchestrator.logPlans();
})();
