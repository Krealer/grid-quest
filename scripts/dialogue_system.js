import { inventory } from './inventory.js';
import { updateInventoryUI } from './inventory_ui.js';
import { getAllSkills } from './skills.js';
import { getPlayerState } from './player_state.js';
import {
  dialogueMemory,
  setMemory,
  triggerUpgrade,
  triggerReroll
} from './dialogue_state.js';
import { getQuests, completeQuest } from './quest_state.js';
import { gameState } from './game_state.js';
import { t } from './i18n.js';

const dialogueLines = {};

export async function showDialogue(keyOrText, callback = () => {}) {
  const raw = dialogueLines[keyOrText] || keyOrText || '';
  const text = raw;

  const overlay = document.createElement('div');
  overlay.id = 'dialogue-overlay';
  overlay.innerHTML = `
    <div class="dialogue-box">
      <div class="dialogue-text"></div>
    </div>`;
  document.body.appendChild(overlay);
  const textEl = overlay.querySelector('.dialogue-text');

  let index = 0;
  const speed = gameState.settings?.dialogueAnim === false ? 0 : 30; // ms per character

  function typeNext() {
    if (index < text.length) {
      textEl.textContent += text.charAt(index);
      index++;
      setTimeout(typeNext, speed);
    } else {
      overlay.querySelector('.dialogue-box').classList.add('finished');
    }
  }
  typeNext();

  function finish() {
    if (index < text.length) {
      if (gameState.settings?.tapToSkip === false) return;
      textEl.textContent = text;
      index = text.length;
      overlay.querySelector('.dialogue-box').classList.add('finished');
    } else {
      cleanup();
      callback();
    }
  }

  function keyHandler(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      finish();
    }
  }

  function cleanup() {
    overlay.removeEventListener('click', finish);
    document.removeEventListener('keydown', keyHandler);
    overlay.remove();
  }

  overlay.addEventListener('click', finish);
  document.addEventListener('keydown', keyHandler);
}

export async function showDialogueWithChoices(keyOrText, choices = []) {
  const raw = dialogueLines[keyOrText] || keyOrText || '';
  const text = raw;

  const overlay = document.createElement('div');
  overlay.id = 'dialogue-overlay';
  overlay.innerHTML = `
    <div class="dialogue-box">
      <div class="dialogue-text"></div>
      <div class="dialogue-choices" style="display:none"></div>
    </div>`;
  document.body.appendChild(overlay);
  const textEl = overlay.querySelector('.dialogue-text');
  const choicesEl = overlay.querySelector('.dialogue-choices');
  let choicesRendered = false;

  let index = 0;
  const speed = gameState.settings?.dialogueAnim === false ? 0 : 30;
  let typingTimeout;

  function typeNext() {
    if (index < text.length) {
      textEl.textContent += text.charAt(index);
      index++;
      typingTimeout = setTimeout(typeNext, speed);
    } else {
      showChoices();
    }
  }
  typeNext();

  function finishTyping() {
    if (index < text.length) {
      if (gameState.settings?.tapToSkip === false) return;
      clearTimeout(typingTimeout);
      textEl.textContent = text;
      index = text.length;
      showChoices();
    }
  }

  function choose(idx) {
    cleanup();
    const choice = choices[idx];
    if (!choice) return;
    if (typeof choice.next === 'string') {
      showDialogue(choice.next, choice.callback);
    } else if (choice.next && choice.next.key) {
      showDialogueWithChoices(choice.next.key, choice.next.choices || []);
      if (typeof choice.callback === 'function') choice.callback();
    } else {
      if (typeof choice.callback === 'function') choice.callback();
    }
  }

  function keyHandler(e) {
    if (index < text.length) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        finishTyping();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      selected = (selected + 1) % choices.length;
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      selected = (selected - 1 + choices.length) % choices.length;
      updateSelection();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(selected);
    }
  }

  function cleanup() {
    document.removeEventListener('keydown', keyHandler);
    overlay.remove();
  }

  let selected = 0;
  let buttons = [];

  function updateSelection() {
    buttons.forEach((b, i) => {
      if (i === selected) {
        b.classList.add('selected');
        b.focus();
      } else {
        b.classList.remove('selected');
      }
    });
  }

  function showChoices() {
    if (choicesRendered) return;
    choicesRendered = true;
    choicesEl.style.display = 'flex';
    choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'dialogue-choice';
      let labelText = '[Missing Label]';
      if (choice && typeof choice.label === 'object' && choice.label.label) {
        labelText = choice.label.label;
      } else if (choice && typeof choice.label === 'string') {
        labelText = choice.label;
      }
      btn.textContent = labelText;
      btn.addEventListener('click', () => choose(i));
      choicesEl.appendChild(btn);
      buttons.push(btn);
    });
    updateSelection();
  }

  document.addEventListener('keydown', keyHandler);
  overlay.addEventListener('click', finishTyping);
}

function buildState() {
  const state = {
    player: getPlayerState(),
    inventory: {},
    memory: dialogueMemory,
    quests: getQuests()
  };
  inventory.forEach((it) => {
    state.inventory[it.id] = it.quantity || 1;
  });
  return state;
}

function checkCondition(cond, state) {
  if (!cond) return true;
  if (cond.hasItem) {
    const { item, quantity = 1 } = cond.hasItem;
    return (state.inventory[item] || 0) >= quantity;
  }
  return false;
}

function runArrayDialogue(dialogue, index) {
  if (!Array.isArray(dialogue) || index == null) return;
  const entry = dialogue[index];
  if (!entry) return;
  const state = buildState();
  const validOptions = (entry.options || []).filter((opt) => {
    if (typeof opt.condition === 'function') {
      try {
        return opt.condition(state);
      } catch {
        return false;
      }
    }
    return true;
  });
  const choices = validOptions.map((opt) => ({
    label: opt.label,
    callback: async () => {
      if (opt.memoryFlag) setMemory(opt.memoryFlag);
      if (typeof opt.onChoose === 'function') {
        try {
          await opt.onChoose();
        } catch (e) {
          console.error('onChoose error', e);
        }
      }
        if (opt.remove) {
          const { removeItems } = await import('./inventory.js');
          const toRemove = Array.isArray(opt.remove)
            ? opt.remove.reduce((acc, id) => {
                acc[id] = (acc[id] || 0) + 1;
                return acc;
              }, {})
            : typeof opt.remove === 'string'
            ? { [opt.remove]: 1 }
            : opt.remove;
          if (toRemove) {
            removeItems(toRemove);
            updateInventoryUI();
          }
        }
      if (opt.give) {
        const { giveItem, giveItems } = await import('./inventory.js');
        if (typeof opt.give === 'string') {
          await giveItem(opt.give);
        } else {
          await giveItems(opt.give);
        }
        updateInventoryUI();
      }
      if (opt.triggerUpgrade) {
        await triggerUpgrade(opt.triggerUpgrade);
      }
      if (opt.triggerReroll) {
        await triggerReroll(opt.triggerReroll);
      }
      if (opt.completeQuest) {
        completeQuest(opt.completeQuest);
      }
      if (opt.goto !== null && opt.goto !== undefined) {
        runArrayDialogue(dialogue, opt.goto);
      }
    }
  }));

  if (choices.length > 0) {
    showDialogueWithChoices(entry.text, choices);
  } else {
    showDialogue(entry.text);
  }
}

function runDialogueObject(tree, currentKey) {
  if (!tree || !tree.dialogue) return;
  let entry = tree.dialogue[currentKey];
  if (!entry) return;

  const state = buildState();

  if (entry.if && (entry.then || entry.else)) {
    const nextKey = checkCondition(entry.if, state) ? entry.then : entry.else;
    if (nextKey !== null && nextKey !== undefined) {
      runDialogueObject(tree, nextKey);
    }
    return;
  }

  const validOptions = (entry.options || []).filter((opt) => {
    if (opt.if) return checkCondition(opt.if, state);
    if (typeof opt.condition === 'function') {
      try {
        return opt.condition(state);
      } catch {
        return false;
      }
    }
    return true;
  });

  const choices = validOptions.map((opt) => ({
    label: typeof opt.text === 'string' ? t(opt.text) : opt.label,
    callback: async () => {
      if (opt.memoryFlag) setMemory(opt.memoryFlag);
      if (typeof opt.onChoose === 'function') {
        try {
          await opt.onChoose();
        } catch (e) {
          console.error('onChoose error', e);
        }
      }
      if (opt.give) {
        const { removeItems } = await import('./inventory.js');
        const toRemove = Array.isArray(opt.give)
          ? opt.give.reduce((acc, id) => {
              acc[id] = (acc[id] || 0) + 1;
              return acc;
            }, {})
          : typeof opt.give === 'string'
          ? { [opt.give]: 1 }
          : opt.give.item
          ? { [opt.give.item]: opt.give.quantity || 1 }
          : opt.give;
        if (toRemove) {
          removeItems(toRemove);
          updateInventoryUI();
        }
      }
      if (opt.receive) {
        const { giveItem, giveItems } = await import('./inventory.js');
        if (typeof opt.receive === 'string') {
          await giveItem(opt.receive);
        } else if (opt.receive.item) {
          await giveItem(opt.receive.item, opt.receive.quantity || 1);
        } else {
          await giveItems(opt.receive);
        }
        updateInventoryUI();
      }
      if (opt.triggerUpgrade) {
        await triggerUpgrade(opt.triggerUpgrade);
      }
      if (opt.triggerReroll) {
        await triggerReroll(opt.triggerReroll);
      }
      if (opt.completeQuest) {
        completeQuest(opt.completeQuest);
      }
      if (opt.goto !== null && opt.goto !== undefined) {
        runDialogueObject(tree, opt.goto);
      }
    }
  }));

  if (choices.length > 0) {
    showDialogueWithChoices(t(entry.text), choices);
  } else {
    showDialogue(t(entry.text));
  }
}

export async function startDialogueTree(dialogue, index = 0) {
  if (Array.isArray(dialogue)) {
    runArrayDialogue(dialogue, index);
    return;
  }

  if (dialogue && typeof dialogue === 'object' && dialogue.start && dialogue.dialogue) {
    const key = typeof index === 'string' ? index : dialogue.start;
    runDialogueObject(dialogue, key);
  }
}
