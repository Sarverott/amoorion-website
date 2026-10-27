import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateContentSchema,
  mergeContentWithDefaults,
  createGitCommitPayload,
  formatCommitDate,
} from './content-parser';
import { DEFAULT_SITE_CONTENT } from '../data/default-content';

test('validateContentSchema correctly approves valid default content', () => {
  const result = validateContentSchema(DEFAULT_SITE_CONTENT);
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
});

test('validateContentSchema catches missing required fields', () => {
  const invalidContent = {
    brand: { name: 'Amoorion' }, // missing logoText
    hero: {}, // missing title and subtitle
  };
  const result = validateContentSchema(invalidContent);
  assert.equal(result.valid, false);
  assert.ok(result.errors.length >= 3);
  assert.ok(result.errors.some((err) => err.includes('logoText')));
  assert.ok(result.errors.some((err) => err.includes('hero.title')));
});

test('mergeContentWithDefaults merges partial edits safely', () => {
  const custom = {
    hero: {
      ...DEFAULT_SITE_CONTENT.hero,
      title: 'Custom Hero Title',
    },
  };
  const merged = mergeContentWithDefaults(custom, DEFAULT_SITE_CONTENT);
  assert.equal(merged.hero.title, 'Custom Hero Title');
  assert.equal(merged.brand.name, DEFAULT_SITE_CONTENT.brand.name);
  assert.equal(merged.featuresSection.cards.length, DEFAULT_SITE_CONTENT.featuresSection.cards.length);
});

test('createGitCommitPayload creates valid base64 payload with commit message', () => {
  const payload = createGitCommitPayload(DEFAULT_SITE_CONTENT, 'Test commit message', 'main', 'abc123sha');
  assert.equal(payload.branch, 'main');
  assert.equal(payload.sha, 'abc123sha');
  assert.equal(payload.message, 'Test commit message');
  
  // Verify base64 decoded content is valid JSON
  const decoded = Buffer.from(payload.content, 'base64').toString('utf8');
  const parsed = JSON.parse(decoded);
  assert.equal(parsed.brand.name, 'Amoorion');
});

test('formatCommitDate returns human readable string', () => {
  const formatted = formatCommitDate('2026-10-27T06:00:00Z');
  assert.ok(formatted.includes('2026') || formatted.includes('Oct'));
});
