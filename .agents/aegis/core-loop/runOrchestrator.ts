import { turingOrchestrator } from './turingOrchestrator.ts';

(async () => {
  try {
    await turingOrchestrator.processPlans();
    console.log('processPlans completed');
  } catch (e) {
    console.error('Error during processPlans:', e);
  }
})();

