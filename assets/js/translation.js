export const translationLanguages = Object.freeze([
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', direction: 'rtl' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', direction: 'ltr' },
  { code: 'nl', label: 'Dutch', nativeLabel: 'Nederlands', direction: 'ltr' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', direction: 'ltr' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano', direction: 'ltr' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', direction: 'ltr' }
]);

export const buildTranslationUrl = (language, pageUrl) => {
  if (!translationLanguages.some(item => item.code === language)) {
    throw new Error('Unsupported translation language');
  }

  const url = new URL('https://translate.google.com/translate');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', language);
  url.searchParams.set('u', pageUrl);
  return url.href;
};

export const initialiseTranslationControl = menu => {
  if (location.hostname.endsWith('.translate.goog')) {
    const target = new URLSearchParams(location.search).get('_x_tr_tl');
    const language = translationLanguages.find(item => item.code === target);
    if (language) {
      document.documentElement.lang = language.code;
      document.documentElement.dir = language.direction;
    }
    return;
  }

  if (!menu || menu.querySelector('.translate-menu')) return;

  const item = document.createElement('li');
  item.className = 'translate-menu notranslate';
  item.setAttribute('translate', 'no');

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'translate-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'translation-panel');
  toggle.setAttribute('aria-haspopup', 'true');
  toggle.textContent = 'Translate';

  const panel = document.createElement('div');
  panel.id = 'translation-panel';
  panel.className = 'translation-panel';
  panel.hidden = true;

  const heading = document.createElement('p');
  heading.className = 'translation-heading';
  heading.textContent = 'Translate this page';

  const introduction = document.createElement('p');
  introduction.className = 'translation-introduction';
  introduction.textContent = 'Choose a language. A translated copy will open in a new tab.';

  const list = document.createElement('ul');
  list.className = 'translation-options';

  translationLanguages.forEach(language => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'translation-link';
    link.href = buildTranslationUrl(language.code, location.href);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.hreflang = language.code;
    link.lang = language.code;
    link.textContent = `${language.nativeLabel} — ${language.label}`;

    const newTab = document.createElement('span');
    newTab.className = 'sr-only';
    newTab.textContent = ' (opens in a new tab)';
    link.append(newTab);
    listItem.append(link);
    list.append(listItem);
  });

  const note = document.createElement('p');
  note.className = 'translation-note';
  note.textContent = 'Machine translation by Google may contain errors.';

  panel.append(heading, introduction, list, note);
  item.append(toggle, panel);
  menu.append(item);

  const closePanel = returnFocus => {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });

  list.addEventListener('click', () => closePanel(false));
  document.addEventListener('click', event => {
    if (!panel.hidden && !item.contains(event.target)) closePanel(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) closePanel(true);
  });
};
