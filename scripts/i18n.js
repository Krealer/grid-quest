import en from './locales/en.json' assert { type: 'json' };
import nl from './locales/nl.json' assert { type: 'json' };
import ja from './locales/ja.json' assert { type: 'json' };
import ar from './locales/ar.json' assert { type: 'json' };
import ru from './locales/ru.json' assert { type: 'json' };

const locales = { en, nl, ja, ar, ru };

let currentLang = 'en';

export function hasLocale(lang) {
  return Object.prototype.hasOwnProperty.call(locales, lang);
}

export function setLanguage(lang) {
  if (locales[lang]) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    applyTranslations();
  }
}

export function getLanguage() {
  return currentLang;
}

export function t(key) {
  return locales[currentLang][key] || key;
}

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });
}

// initialize language from storage or browser
const stored = localStorage.getItem('language');
if (stored && hasLocale(stored)) {
  setLanguage(stored);
} else {
  const userLang = navigator.language.slice(0, 2);
  if (hasLocale(userLang)) setLanguage(userLang);
}
