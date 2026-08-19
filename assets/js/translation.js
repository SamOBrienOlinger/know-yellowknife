export const translationLanguages = Object.freeze([
  { code: 'fr', label: 'French', nativeLabel: 'Français', direction: 'ltr' },
  { code: 'tl', label: 'Filipino (Tagalog)', nativeLabel: 'Filipino', direction: 'ltr' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ', direction: 'ltr' }
]);

export const indigenousLanguageOptions = Object.freeze([
  {
    code: 'dgr',
    label: 'Tłı̨chǫ',
    context: 'Wıı̀lıı̀deh dialect resources',
    url: 'https://www.ece.gov.nt.ca/en/services/indigenous-language-resources/tlicho-resources'
  },
  {
    code: 'scs',
    label: 'Dene Kǝdǝ́',
    context: 'North Slavey resources',
    url: 'https://www.ece.gov.nt.ca/en/dene-kede'
  },
  {
    code: 'iu',
    label: 'Inuktut (Inuktitut)',
    context: 'Translate this page',
    direction: 'ltr',
    translate: true
  }
]);

export const buildTranslationUrl = (language, pageUrl) => {
  const supportedLanguages = [
    ...translationLanguages,
    ...indigenousLanguageOptions.filter(item => item.translate)
  ];

  if (!supportedLanguages.some(item => item.code === language)) {
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
    const language = [
      ...translationLanguages,
      ...indigenousLanguageOptions.filter(item => item.translate)
    ].find(item => item.code === target);
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
  introduction.textContent = 'Choose one of Yellowknife’s three most-spoken home languages after English, based on the 2021 Census. A translated copy will open in a new tab.';

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

  const indigenousHeading = document.createElement('p');
  indigenousHeading.className = 'translation-subheading';
  indigenousHeading.textContent = 'Yellowknife Indigenous languages';

  const indigenousIntroduction = document.createElement('p');
  indigenousIntroduction.className = 'translation-introduction';
  indigenousIntroduction.textContent = 'Access Tłı̨chǫ, Dene Kǝdǝ́ (North Slavey) and Inuktut (Inuktitut). Google provides automated Inuktut translation; the other links open official GNWT language resources.';

  const indigenousList = document.createElement('ul');
  indigenousList.className = 'translation-options indigenous-language-options';

  indigenousLanguageOptions.forEach(language => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.className = `translation-link ${language.translate ? 'indigenous-translation-link' : 'language-resource-link'}`;
    link.href = language.translate ? buildTranslationUrl(language.code, location.href) : language.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.hreflang = language.translate ? language.code : 'en';
    if (language.translate) link.lang = language.code;
    link.textContent = `${language.label} — ${language.context}`;

    const newTab = document.createElement('span');
    newTab.className = 'sr-only';
    newTab.textContent = ' (opens in a new tab)';
    link.append(newTab);
    listItem.append(link);
    indigenousList.append(listItem);
  });

  const note = document.createElement('p');
  note.className = 'translation-note';
  note.textContent = 'Machine translation by Google may contain errors.';

  panel.append(heading, introduction, list, indigenousHeading, indigenousIntroduction, indigenousList, note);
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
