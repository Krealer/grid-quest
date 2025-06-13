/* Internationalization utilities */

import en from './locales/en.json' assert { type: 'json' };
import nl from './locales/nl.json' assert { type: 'json' };
import ja from './locales/ja.json' assert { type: 'json' };
import ar from './locales/ar.json' assert { type: 'json' };
import ru from './locales/ru.json' assert { type: 'json' };

const translations = { en, nl, ja, ar, ru };
const availableLocales = Object.keys(translations);
let currentLang = 'en';

export function hasLocale(lang) {
  return availableLocales.includes(lang);
}

export function setLanguage(lang) {
  if (!hasLocale(lang)) return;
  currentLang = lang;
  localStorage.setItem('language', lang);
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  applyTranslations();
}

export function getLanguage() {
  return currentLang;
}

export function t(key) {
  const value = translations[currentLang]?.[key] ?? translations.en?.[key];
  if (!value) {
    console.warn('[Translation Missing]:', key);
    return '[Missing Translation]';
  }
  return value;
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
