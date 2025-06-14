import { getLanguage } from '../i18n.js';

export async function loadSnealerDialogue() {
  const lang = getLanguage().toLowerCase();
  const fallback = 'en';

  try {
    const module = await import(`./snealer_${lang}_dialogue.js`);
    return module.default;
  } catch (err) {
    const fallbackModule = await import(`./snealer_${fallback}_dialogue.js`);
    return fallbackModule.default;
  }
}
