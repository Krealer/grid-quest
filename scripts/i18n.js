/* Internationalization utilities */

const availableLocales = ['en', 'nl', 'ja', 'ar', 'ru'];
const locales = {};
let currentLang = 'en';

async function loadLocale(lang) {
  if (locales[lang] || !availableLocales.includes(lang)) return;
  try {
    if (typeof fetch === 'function') {
      const url = new URL(`./locales/${lang}.json`, import.meta.url);
      const res = await fetch(url);
      if (res.ok) {
        locales[lang] = await res.json();
        return;
      }
    }
    const mod = await import(`./locales/${lang}.json`, { assert: { type: 'json' } });
    locales[lang] = mod.default;
  } catch {
    locales[lang] = {};
  }
}

export function hasLocale(lang) {
  return availableLocales.includes(lang);
}

export async function setLanguage(lang) {
  if (!hasLocale(lang)) return;
  currentLang = lang;
  localStorage.setItem('language', lang);
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  await loadLocale('en');
  if (lang !== 'en') await loadLocale(lang);
  applyTranslations();
}

export function getLanguage() {
  return currentLang;
}

export function t(key) {
  const langStrings = locales[currentLang] || {};
  if (Object.prototype.hasOwnProperty.call(langStrings, key)) {
    return langStrings[key];
  }
  const enStrings = locales.en || {};
  if (Object.prototype.hasOwnProperty.call(enStrings, key)) {
    return enStrings[key];
  }
  console.warn(`Missing translation key: ${key}`);
  return '[Missing Translation]';
}

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
}

const stored = localStorage.getItem('language');
if (stored && hasLocale(stored)) {
  setLanguage(stored);
} else {
  const userLang = navigator.language.slice(0, 2);
  if (hasLocale(userLang)) setLanguage(userLang);
  else setLanguage('en');
}
