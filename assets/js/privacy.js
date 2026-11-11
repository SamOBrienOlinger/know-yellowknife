/* First-party consent controls. No external scripts, telemetry or identifiers. */
const SITE = 'know-yellowknife';
const SCORE_KEYS = ['kykQuizHighScore', 'kykQuizSchema'];
const CONSENT_KEY = `${SITE}:privacy:v1`;
const VERSION = '2026-11-11.1';
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
let memory = null;
let banner;
let dialog;
let pendingTranslation = null;
let returnFocus = null;

function storedChoice() {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch { return null; }
}
function valid(choice) {
  return choice && choice.version === VERSION && Number.isFinite(choice.at) &&
    choice.at <= Date.now() && Date.now() - choice.at < MAX_AGE &&
    typeof choice.translation === 'boolean' && typeof choice.preferences === 'boolean';
}
function clearScores() {
  SCORE_KEYS.forEach(key => { try { localStorage.removeItem(key); } catch { /* Storage may be disabled. */ } });
}
function choice() {
  const saved = memory || storedChoice();
  if (valid(saved)) return saved;
  memory = null;
  clearScores();
  return null;
}
export const privacy = Object.freeze({
  allowed: purpose => ['translation', 'preferences'].includes(purpose) && choice()?.[purpose] === true,
  get: key => {
    if (!SCORE_KEYS.includes(key) || !privacy.allowed('preferences')) return null;
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set: (key, value) => {
    if (!SCORE_KEYS.includes(key) || !privacy.allowed('preferences')) return false;
    try { localStorage.setItem(key, String(value)); return true; } catch { return false; }
  },
  open: () => openSettings(),
  clearScores,
});

function remember(translation, preferences) {
  memory = { version: VERSION, at: Date.now(), translation: translation === true, preferences: preferences === true };
  let persistent = true;
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(memory)); } catch { persistent = false; }
  if (!memory.preferences) clearScores();
  if (banner) banner.hidden = true;
  const destination = memory.translation ? pendingTranslation : null;
  pendingTranslation = null;
  closeSettings();
  window.dispatchEvent(new CustomEvent('siteprivacychange', { detail: { ...memory } }));
  const status = document.getElementById('privacy-status');
  if (status) status.textContent = persistent ? 'Privacy choices saved. Change them using Cookie settings.' : 'Choice applied for this page only because browser storage is unavailable.';
  if (destination) window.open(destination, '_blank', 'noopener,noreferrer');
}
function closeSettings() {
  if (dialog?.open) dialog.close();
  else if (dialog) dialog.removeAttribute('open');
  if (returnFocus?.isConnected) returnFocus.focus();
}
function openSettings(destination = null) {
  if (!dialog) return;
  pendingTranslation = destination;
  returnFocus = document.activeElement;
  const current = choice();
  dialog.querySelector('[name="translation"]').checked = current?.translation === true;
  dialog.querySelector('[name="preferences"]').checked = current?.preferences === true;
  dialog.querySelector('[data-translation-request]').hidden = !destination;
  if (!dialog.open) {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  dialog.querySelector('[data-close]').focus();
}
function translationURL(link) {
  try {
    const url = new URL(link.href, location.href);
    return url.protocol === 'https:' && url.hostname === 'translate.google.com' && url.pathname === '/translate' ? url.href : null;
  } catch { return null; }
}
// Capture before the site's menu handlers. Ordinary social/source links are not trackers.
document.addEventListener('click', event => {
  const link = event.target.closest?.('a');
  const destination = link && translationURL(link);
  if (destination && !privacy.allowed('translation')) {
    event.preventDefault();
    event.stopImmediatePropagation();
    openSettings(destination);
  }
}, true);

function initialise() {
  if (document.getElementById('site-privacy-controls')) return;
  const style = document.createElement('style');
  style.textContent = `
    .privacy-ui{font:16px/1.5 system-ui,sans-serif;color:#182b32;text-align:left;letter-spacing:normal;box-sizing:border-box}
    .privacy-ui *, .privacy-ui *::before,.privacy-ui *::after{box-sizing:border-box}
    .privacy-ui [hidden],.privacy-ui[hidden]{display:none!important}
    .privacy-ui a{color:#075d66;text-decoration:underline}.privacy-ui p{margin:.65rem 0}
    .privacy-ui h2{font:700 1.35rem/1.3 system-ui,sans-serif;color:#182b32;margin:0 0 .75rem}
    .privacy-ui button{font:inherit;line-height:1.3;min-height:44px;padding:.6rem .9rem;border:2px solid #176269;border-radius:.5rem;background:#fff;color:#124f55;cursor:pointer;margin:0;white-space:normal}
    .privacy-ui button:hover{background:#eaf5f3}.privacy-ui :focus-visible{outline:3px solid #b05300;outline-offset:3px}
    .privacy-actions{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem}.privacy-actions button{flex:1 1 10rem}
    #site-privacy-controls{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.75rem;padding:1rem;background:#f2f7f6;color:#182b32;width:100%;clear:both}
    #site-privacy-banner{position:fixed;z-index:2147483000;bottom:max(1rem,env(safe-area-inset-bottom));left:1rem;right:1rem;max-width:48rem;max-height:70vh;overflow:auto;margin:auto;padding:1.15rem;border:2px solid #176269;border-radius:.75rem;background:#fff;box-shadow:0 8px 40px #0003}
    #site-privacy-dialog{width:calc(100% - 2rem);max-width:42rem;max-height:85vh;overflow:auto;padding:1.3rem;border:2px solid #176269;border-radius:.75rem;background:#fff;z-index:2147483100}
    #site-privacy-dialog::backdrop{background:#102d39aa}#site-privacy-dialog label{display:block;padding:.85rem 0;border-top:1px solid #b9c9cb;cursor:pointer}
    #site-privacy-dialog input{width:1.25rem;height:1.25rem;margin-right:.65rem;vertical-align:middle}#site-privacy-dialog small{display:block;margin-top:.35rem;font-size:.9rem}
    #privacy-status{flex-basis:100%;text-align:center;font-size:.9rem;margin:0}.privacy-close{display:block;margin-left:auto!important;margin-bottom:.75rem!important}
    @media(max-width:480px){#site-privacy-banner{left:.5rem;right:.5rem;padding:.85rem}.privacy-actions{gap:.4rem}.privacy-actions button{flex-basis:100%}}
    @media(prefers-reduced-motion:reduce){.privacy-ui *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
  `;
  document.head.append(style);
  const controls = document.createElement('div');
  controls.id = 'site-privacy-controls';
  controls.className = 'privacy-ui';
  controls.innerHTML = '<a href="privacy.html">Privacy &amp; cookies</a><button type="button" data-settings>Cookie settings</button><button type="button" data-clear>Clear saved quiz score</button><p id="privacy-status" role="status" aria-live="polite"></p>';
  (document.querySelector('footer.site-footer') || document.body).append(controls);
  controls.querySelector('[data-settings]').addEventListener('click', () => openSettings());
  controls.querySelector('[data-clear]').addEventListener('click', () => {
    clearScores();
    window.dispatchEvent(new Event('siteprivacyclear'));
    document.getElementById('privacy-status').textContent = 'Saved quiz score cleared for this site.';
  });
  banner = document.createElement('section');
  banner.id = 'site-privacy-banner';
  banner.className = 'privacy-ui';
  banner.setAttribute('aria-labelledby', 'privacy-banner-title');
  banner.innerHTML = '<h2 id="privacy-banner-title">Your privacy choices</h2><p>Optional score-saving and Google Translate are off until you choose. You can use the site and quiz without them. Your choice is saved on this browser for up to 180 days. No advertising or analytics is enabled by these controls.</p><a href="privacy.html">Read the privacy and cookie notice</a><div class="privacy-actions"><button type="button" data-reject>Reject optional</button><button type="button" data-settings>Choose settings</button><button type="button" data-accept>Accept optional</button></div>';
  banner.hidden = !!choice();
  banner.querySelector('[data-reject]').addEventListener('click', () => remember(false, false));
  banner.querySelector('[data-accept]').addEventListener('click', () => remember(true, true));
  banner.querySelector('[data-settings]').addEventListener('click', () => openSettings());
  document.body.append(banner);
  dialog = document.createElement('dialog');
  dialog.id = 'site-privacy-dialog';
  dialog.className = 'privacy-ui';
  dialog.setAttribute('aria-labelledby', 'privacy-dialog-title');
  dialog.innerHTML = '<button class="privacy-close" type="button" data-close>Close without changing</button><h2 id="privacy-dialog-title">Cookie and privacy settings</h2><p>Necessary: a first-party browser-storage record remembers these choices for up to 180 days. It contains the notice version, time and permissions, not an advertising identifier.</p><p data-translation-request hidden>You selected a translated page. Allow Google Translate below to continue to Google in a new tab, or reject optional services to stay here.</p><label><input type="checkbox" name="translation">Allow Google Translate<small>Only when you select a language, the public page address and content are sent to Google. Google receives connection data such as your IP address and may use cookies on its own website. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google privacy notice</a>. Revoking this permission stops future translation links here; it cannot remove cookies from Google or close tabs already opened.</small></label><label><input type="checkbox" name="preferences">Remember my quiz score on this device<small>Optional local browser storage. No account is created and the score is not sent to the site operator. Switching this off removes this site’s saved score. The quiz still works without saving.</small></label><p>Change or withdraw choices at any time using Cookie settings. <a href="privacy.html">Full privacy notice and storage names</a>.</p><div class="privacy-actions"><button type="button" data-reject>Reject optional</button><button type="button" data-save>Save selected choices</button></div>';
  dialog.querySelector('[data-close]').addEventListener('click', () => { pendingTranslation = null; closeSettings(); });
  dialog.querySelector('[data-reject]').addEventListener('click', () => remember(false, false));
  dialog.querySelector('[data-save]').addEventListener('click', () => remember(dialog.querySelector('[name="translation"]').checked, dialog.querySelector('[name="preferences"]').checked));
  dialog.addEventListener('cancel', () => { pendingTranslation = null; });
  document.body.append(dialog);
  const recheck = () => {
    if (!choice()) { banner.hidden = false; window.dispatchEvent(new Event('siteprivacychange')); }
  };
  window.addEventListener('storage', event => {
    if (event.key === CONSENT_KEY || event.key === null) { memory = null; if (!privacy.allowed('preferences')) clearScores(); banner.hidden = !!choice(); window.dispatchEvent(new Event('siteprivacychange')); }
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) recheck(); });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
else initialise();
