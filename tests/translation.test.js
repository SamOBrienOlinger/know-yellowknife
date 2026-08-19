import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildTranslationUrl, indigenousLanguageOptions, translationLanguages } from '../assets/js/translation.js';

test('translation control offers the requested languages', () => {
  assert.deepEqual(translationLanguages.map(language => language.code), ['fr', 'tl', 'pa']);
  assert.deepEqual(translationLanguages.map(language => language.label), ['French', 'Filipino (Tagalog)', 'Punjabi']);
  assert.equal(translationLanguages.filter(language => language.direction === 'ltr').length, 3);
});

test('translation links preserve the source page and target language', () => {
  const url = new URL(buildTranslationUrl('tl', 'https://example.com/learn.html#place'));
  assert.equal(url.origin, 'https://translate.google.com');
  assert.equal(url.searchParams.get('sl'), 'en');
  assert.equal(url.searchParams.get('tl'), 'tl');
  assert.equal(url.searchParams.get('u'), 'https://example.com/learn.html#place');
  assert.equal(new URL(buildTranslationUrl('iu', 'https://example.com/')).searchParams.get('tl'), 'iu');
  assert.throws(() => buildTranslationUrl('xx', 'https://example.com/'));
});

test('translation panel includes Yellowknife Indigenous language access', () => {
  assert.deepEqual(indigenousLanguageOptions.map(language => language.code), ['dgr', 'scs', 'iu']);
  assert.deepEqual(indigenousLanguageOptions.map(language => language.label), ['Tłı̨chǫ', 'Dene Kǝdǝ́', 'Inuktut (Inuktitut)']);
  assert.deepEqual(indigenousLanguageOptions.filter(language => language.translate).map(language => language.code), ['iu']);
  assert.ok(indigenousLanguageOptions.filter(language => !language.translate).every(language => language.url.startsWith('https://www.ece.gov.nt.ca/')));
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
  assert.match(source, /Google provides automated Inuktut translation/);
  assert.match(source, /Dene Kǝdǝ́ \(North Slavey\)/);
  assert.match(source, /Wıı̀lıı̀deh dialect/);
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
