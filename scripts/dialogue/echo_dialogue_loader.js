import { getLanguage } from '../i18n.js';

export async function loadEchoDialogue() {
  const lang = getLanguage().toLowerCase();
  const fallback = 'en';
  try {
    const module = await import(`./echo_${lang}_dialogue.js`);
    return module.default;
  } catch (err) {
    const fallbackModule = await import(`./echo_${fallback}_dialogue.js`);
    return fallbackModule.default;
  }
}
