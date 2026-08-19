import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildTranslationUrl, translationLanguages } from '../assets/js/translation.js';

test('translation control offers the requested languages', () => {
  assert.deepEqual(translationLanguages.map(language => language.code), ['ar', 'fr', 'nl', 'de', 'it', 'es']);
  assert.equal(translationLanguages.find(language => language.code === 'ar').direction, 'rtl');
  assert.equal(translationLanguages.filter(language => language.direction === 'ltr').length, 5);
});

test('translation links preserve the source page and target language', () => {
  const url = new URL(buildTranslationUrl('ar', 'https://example.com/learn.html#place'));
  assert.equal(url.origin, 'https://translate.google.com');
  assert.equal(url.searchParams.get('sl'), 'en');
  assert.equal(url.searchParams.get('tl'), 'ar');
  assert.equal(url.searchParams.get('u'), 'https://example.com/learn.html#place');
  assert.throws(() => buildTranslationUrl('xx', 'https://example.com/'));
});

test('translation control is keyboard accessible and privacy preserving by default', async () => {
  const source = await readFile(new URL('../assets/js/translation.js', import.meta.url), 'utf8');
  assert.match(source, /aria-expanded/);
  assert.match(source, /aria-controls/);
  assert.match(source, /Escape/);
  assert.match(source, /target = '_blank'/);
  assert.match(source, /noopener noreferrer/);
  assert.doesNotMatch(source, /translate_a\/element\.js/);
  assert.match(source, /document\.documentElement\.dir = language\.direction/);
});

test('privacy page explains the optional translation service', async () => {
  const privacy = await readFile(new URL('../privacy.html', import.meta.url), 'utf8');
  assert.match(privacy, /Google Translate/);
  assert.match(privacy, /only when you choose/);
  assert.match(privacy, /new tab/);
});

test('translation controls retain visible focus and a mobile layout', async () => {
  const styles = await readFile(new URL('../assets/css/styles.css', import.meta.url), 'utf8');
  assert.match(styles, /\.translate-toggle:focus-visible/);
  assert.match(styles, /\.translation-link:focus-visible/);
  assert.match(styles, /@media\(max-width:760px\).*\.translate-menu/s);
});
