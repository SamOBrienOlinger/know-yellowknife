import test from'node:test';import assert from'node:assert/strict';import{readFile,readdir,access}from'node:fs/promises';import{resolve,dirname}from'node:path';import{fileURLToPath}from'node:url';const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');const pages=(await readdir(root)).filter(name=>name.endsWith('.html'));
test('required pages exist',()=>{for(const name of['index.html','learn.html','quiz.html','about.html','contact.html','privacy.html','accessibility.html','404.html'])assert.ok(pages.includes(name),name)});
for(const page of pages)test(`${page} has valid local file references`,async()=>{const html=await readFile(resolve(root,page),'utf8');const refs=[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match=>match[1]).filter(ref=>!ref.startsWith('http')&&!ref.startsWith('#')&&!ref.startsWith('mailto:'));for(const ref of refs){const clean=ref.split('#')[0].split('?')[0];if(!clean)continue;await assert.doesNotReject(access(resolve(root,clean)),`${page} -> ${ref}`)}});
test('legacy subject text is absent from production pages',async()=>{for(const page of pages){const html=(await readFile(resolve(root,page),'utf8')).toLowerCase();assert.equal(html.includes('lgbt'),false,`${page} contains legacy subject text`)}});

test('homepage uses the responsive Yellowknife city and landscape illustration', async () => {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');
  assert.match(html, /hero-yellowknife-v3\.webp/);
  assert.match(html, /width="1774" height="887"/);
  assert.match(html, /Yellowknife's downtown among northern lakes/);

  const image = await readFile(resolve(root, 'assets/images/hero-yellowknife-v3.webp'));
  assert.equal(image.subarray(0, 4).toString(), 'RIFF');
  assert.equal(image.subarray(8, 12).toString(), 'WEBP');
  assert.ok(image.length > 50_000, 'hero illustration should not be truncated');
});

test('hidden quiz controls remain hidden despite component display styles', async () => {
  const css = await readFile(resolve(root, 'assets/css/styles.css'), 'utf8');
  assert.match(css, /\[hidden\]\{display:none!important\}/);
});

test('mobile navigation has a visible label and keyboard escape handling', async () => {
  for (const name of ['index.html', 'learn.html', 'quiz.html', 'about.html', 'contact.html', 'privacy.html', 'accessibility.html']) {
    const html = await readFile(resolve(root, name), 'utf8');
    assert.match(html, /class="nav-toggle-label">Menu</, `${name} needs a visible menu label`);
  }
  const script = await readFile(resolve(root, 'assets/js/main.js'), 'utf8');
  assert.match(script, /event\.key === 'Escape'/);
  assert.match(script, /toggle\.focus\(\)/);
});

test('homepage pathways use descriptive cards without sequence numbers', async () => {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /class="card-number"/);
  assert.match(html, /class="card card-learn"/);
  assert.match(html, /class="card card-quiz"/);
  assert.match(html, /class="card card-connect"/);
});

test('accessibility safeguards cover zoom, touch targets and user preferences', async () => {
  const css = await readFile(resolve(root, 'assets/css/styles.css'), 'utf8');
  assert.match(css, /text-size-adjust:100%/);
  assert.match(css, /min-height:44px/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /prefers-contrast:more/);
  assert.match(css, /forced-colors:active/);
});
