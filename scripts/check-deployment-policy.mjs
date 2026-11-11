/**
 * Fail closed if the v0.1 deployment exclusion becomes unexpectedly broad.
 * This tests the repository configuration, not whether Vercel enforced a deployment decision.
 */
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const rules = config.git?.deploymentEnabled;

assert.ok(rules && typeof rules === 'object' && !Array.isArray(rules),
  'Expected branch-specific git.deploymentEnabled rules');
assert.deepEqual(rules, { 'work/*': false },
  'Only the work/* branch family should be excluded in this pilot');
assert.ok(!Object.hasOwn(rules, 'main'),
  'The production branch should retain normal Git deployment behavior');
assert.ok(!Object.hasOwn(rules, 'review/*'),
  'Review branches must remain eligible for previews');

console.log('Deployment configuration verified: work/* excluded; other branches use Vercel defaults.');
