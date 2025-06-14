import { getLanguage } from '../i18n.js';

export async function loadEryndorDialogue() {
  const lang = getLanguage().toLowerCase();
  const fallback = 'en';
  try {
    const module = await import(`../npc-dialogues/eryndor_${lang}_dialogue.js`);
    return module.eryndorDialogue || module.default;
  } catch (err) {
    const fallbackModule = await import(`../npc-dialogues/eryndor_${fallback}_dialogue.js`);
    return fallbackModule.eryndorDialogue || fallbackModule.default;
  }
}
