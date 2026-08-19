import test from'node:test';import assert from'node:assert/strict';import{readFile,readdir,access}from'node:fs/promises';import{resolve,dirname}from'node:path';import{fileURLToPath}from'node:url';const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');const pages=(await readdir(root)).filter(name=>name.endsWith('.html'));
test('required pages exist',()=>{for(const name of['index.html','learn.html','quiz.html','about.html','contact.html','privacy.html','accessibility.html','404.html'])assert.ok(pages.includes(name),name)});
for(const page of pages)test(`${page} has valid local file references`,async()=>{const html=await readFile(resolve(root,page),'utf8');const refs=[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match=>match[1]).filter(ref=>!ref.startsWith('http')&&!ref.startsWith('#')&&!ref.startsWith('mailto:'));for(const ref of refs){const clean=ref.split('#')[0].split('?')[0];if(!clean)continue;await assert.doesNotReject(access(resolve(root,clean)),`${page} -> ${ref}`)}});
test('legacy subject text is absent from production pages',async()=>{for(const page of pages){const html=(await readFile(resolve(root,page),'utf8')).toLowerCase();assert.equal(html.includes('lgbt'),false,`${page} contains legacy subject text`)}});

test('homepage uses the responsive Yellowknife city and landscape illustration', async () => {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');
  assert.match(html, /hero-yellowknife-v5\.webp/);
  assert.match(html, /width="1774" height="887"/);
  assert.match(html, /Yellowknife's downtown among northern lakes/);

  const image = await readFile(resolve(root, 'assets/images/hero-yellowknife-v5.webp'));
  assert.equal(image.subarray(0, 4).toString(), 'RIFF');
  assert.equal(image.subarray(8, 12).toString(), 'WEBP');
  assert.ok(image.length > 50_000, 'hero illustration should not be truncated');
});

test('site branding consistently uses KYK instead of YK', async () => {
  for (const page of pages) {
    const html = await readFile(resolve(root, page), 'utf8');
    assert.doesNotMatch(html, />YK</, `${page} contains the former YK brand mark`);
  }

  for (const name of ['index.html', 'learn.html', 'quiz.html', 'about.html', 'contact.html', 'privacy.html', 'accessibility.html']) {
    const html = await readFile(resolve(root, name), 'utf8');
    assert.match(html, /class="brand-mark" aria-hidden="true">KYK</, `${name} needs the KYK brand mark`);
  }
});

test('hidden quiz controls remain hidden despite component display styles', async () => {
  const css = await readFile(resolve(root, 'assets/css/styles.css'), 'utf8');
  assert.match(css, /\[hidden\]\{display:none!important\}/);
});

test('mobile navigation has a visible label and keyboard escape handling', async () => {
  for (const name of ['index.html', 'learn.html', 'quiz.html', 'about.html', 'contact.html', 'privacy.html', 'accessibility.html']) {
    const html = await readFile(resolve(root, name), 'utf8');
    assert.match(html, /class="nav-toggle-label">Menu</, `${name} needs a visible menu label`);
    assert.match(html, /assets\/js\/main\.js\?v=20260819/, `${name} needs the current shared module version`);
  }
  const script = await readFile(resolve(root, 'assets/js/main.js'), 'utf8');
  assert.match(script, /event\.key === 'Escape'/);
  assert.match(script, /toggle\.focus\(\)/);
  assert.match(script, /translation\.js\?v=20260819/);
});

test('homepage pathways use descriptive cards without sequence numbers', async () => {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /class="card-number"/);
  assert.match(html, /class="card card-learn"/);
  assert.match(html, /class="card card-quiz"/);
  assert.match(html, /class="card card-connect"/);
});

test('quiz introduction has no decorative number badge', async () => {
  const html = await readFile(resolve(root, 'quiz.html'), 'utf8');
  assert.doesNotMatch(html, /class="quiz-icon"/);
});

test('accessibility safeguards cover zoom, touch targets and user preferences', async () => {
  const css = await readFile(resolve(root, 'assets/css/styles.css'), 'utf8');
  assert.match(css, /text-size-adjust:100%/);
  assert.match(css, /min-height:44px/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /prefers-contrast:more/);
  assert.match(css, /forced-colors:active/);
});

test('responsive layout preserves gutters and compact component actions', async () => {
  const css = await readFile(resolve(root, 'assets/css/styles.css'), 'utf8');
  assert.match(css, /--gutter:clamp\(1rem,4vw,2rem\)/);
  assert.match(css, /\.container\{width:min\(calc\(100% - \(var\(--gutter\) \* 2\)\),var\(--max\)\)\}/);
  assert.match(css, /\.callout\{width:min\(calc\(100% - \(var\(--gutter\) \* 2\)\),var\(--max\)\);margin-block:2\.75rem;padding:1\.6rem/);
  assert.match(css, /\.callout h2\{font-size:clamp\(1\.8rem,7\.5vw,2\.1rem\);max-width:100%\}/);
  assert.match(css, /\.callout \.button\{width:auto;align-self:flex-start/);
  assert.match(css, /#question-text\{font-size:clamp\(1\.65rem,7vw,1\.9rem\)/);
});

test('about page credits Sam Tim Solutions with accessible profile links', async () => {
  const html = await readFile(resolve(root, 'about.html'), 'utf8');
  assert.match(html, /id="sam-tim-solutions">Sam Tim Solutions</);
  assert.match(html, /provides services in a private capacity in response to bespoke briefs/);
  assert.match(html, /educate and empower individuals, families and communities/);
  assert.match(html, /href="https:\/\/share\.google\/zgwtj8LFfnwQGIv5n"[^>]+aria-label="Sam Tim Solutions on LinkedIn/);
  assert.match(html, /href="https:\/\/github\.com\/SamOBrienOlinger"[^>]+aria-label="Sam O’Brien-Olinger on GitHub/);
  assert.match(html, /<svg aria-hidden="true"/);
});

test('every standard site footer includes the linked developer credit', async () => {
  for (const name of ['index.html', 'learn.html', 'quiz.html', 'about.html', 'contact.html', 'privacy.html', 'accessibility.html']) {
    const html = await readFile(resolve(root, name), 'utf8');
    assert.match(
      html,
      /class="container developer-credit">Designed and developed by <a href="about\.html#sam-tim-solutions">Sam Tim Solutions<\/a>\.<\/p>/,
      `${name} needs the Sam Tim Solutions developer credit`,
    );
  }
});
