import { initialiseTranslationControl } from './translation.js?v=20260819';

const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('#site-menu');

if (toggle && menu) {
  const label = toggle.querySelector('.nav-toggle-label');
  const icon = toggle.querySelector('.nav-toggle-icon');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    if (label) label.textContent = open ? 'Close' : 'Menu';
    if (icon) icon.textContent = open ? '×' : '☰';
  }

  toggle.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  const desktopMenu = window.matchMedia('(min-width: 761px)');
  desktopMenu.addEventListener('change', event => {
    if (event.matches) setMenu(false);
  });
}

const page = document.body.dataset.page;
const current = document.querySelector(`[data-nav="${page}"]`);
if (current) current.setAttribute('aria-current', 'page');

document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.rel = 'noopener noreferrer';
});

const projectLinks = document.querySelector('.site-footer .footer-grid > div:last-child ul');
if (projectLinks && !projectLinks.querySelector('a[href="accessibility.html"]')) {
  const item = document.createElement('li');
  const link = document.createElement('a');
  link.href = 'accessibility.html';
  link.textContent = 'Accessibility';
  item.append(link);
  projectLinks.prepend(item);
}

initialiseTranslationControl(menu);
