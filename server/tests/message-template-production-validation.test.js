import MessageTemplateService from '../services/MessageTemplateService.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   ${error.message}`);
  }
}

console.log('\n📦 Message Template Production Validation Tests\n');

test('All default templates pass production validation', () => {
  const result = MessageTemplateService.validateAllTemplatesForProduction();

  assert(result.summary.total_templates >= 7, 'Expected at least the default template set');
  assert(result.summary.invalid_templates === 0, 'Expected default templates to be production valid');
});

test('Validation catches undeclared body variables', () => {
  MessageTemplateService.createTemplate({
    id: 'invalid_validation_template',
    name: 'Invalid Validation Template',
    category: 'custom',
    body: 'Hello {{candidate_name}}, use {{undeclared_var}} now.',
    variables: ['candidate_name'],
    enabled: true
  });

  const validation = MessageTemplateService.validateTemplateForProduction('invalid_validation_template');
  assert(validation.valid === false, 'Expected template with undeclared variable to be invalid');
  assert(
    validation.issues.some(issue => issue.includes('Variables used in body but not declared')),
    'Expected undeclared variable issue'
  );

  MessageTemplateService.deleteTemplate('invalid_validation_template');
});

console.log(`\n✅ ${passedTests}/${totalTests} production validation tests passed\n`);
process.exit(passedTests === totalTests ? 0 : 1);
