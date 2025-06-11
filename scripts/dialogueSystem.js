import { addItem, removeItem, inventory } from './inventory.js';
import { updateInventoryUI } from './inventory_ui.js';
import { loadItems, getItemData } from './item_loader.js';
import { unlockSkillsFromItem, getAllSkills } from './skills.js';
import {
  dialogueMemory,
  setMemory,
  giveBlueprint,
  triggerUpgrade,
  triggerReroll
} from './dialogue_state.js';
import { getQuests, completeQuest } from './quest_state.js';
import { showError } from './errorPrompt.js';
import { loadJson } from './dataService.js';
import { gameState } from './game_state.js';

let dialogueLines = {};
let dataLoaded = false;

async function loadDialogData() {
  if (dataLoaded) return;
  const data = await loadJson('data/dialog.json');
  if (data) {
    dialogueLines = data;
  } else {
    showError('Failed to load dialogue');
  }
  dataLoaded = true;
}

export async function showDialogue(keyOrText, callback = () => {}) {
  await loadDialogData();
  const text = dialogueLines[keyOrText] || keyOrText || '';

  const overlay = document.createElement('div');
  overlay.id = 'dialogue-overlay';
  overlay.innerHTML = `
    <div class="dialogue-box">
      <div class="dialogue-text"></div>
      <div class="dialogue-advance">\u2192</div>
    </div>`;
  document.body.appendChild(overlay);
  const textEl = overlay.querySelector('.dialogue-text');
  const advance = overlay.querySelector('.dialogue-advance');
  advance.style.display = 'none';

  let index = 0;
  const speed = gameState.settings?.dialogueAnim === false ? 0 : 30; // ms per character

  function typeNext() {
    if (index < text.length) {
      textEl.textContent += text.charAt(index);
      index++;
      setTimeout(typeNext, speed);
    } else {
      advance.style.display = 'block';
      overlay.querySelector('.dialogue-box').classList.add('finished');
    }
  }
  typeNext();

  function finish() {
    if (index < text.length) {
      textEl.textContent = text;
      index = text.length;
      advance.style.display = 'block';
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
  await loadDialogData();
  const text = dialogueLines[keyOrText] || keyOrText || '';

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

  let index = 0;
  const speed = gameState.settings?.dialogueAnim === false ? 0 : 30;

  function typeNext() {
    if (index < text.length) {
      textEl.textContent += text.charAt(index);
      index++;
      setTimeout(typeNext, speed);
    } else {
      showChoices();
    }
  }
  typeNext();

  function finishTyping() {
    if (index < text.length) {
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
    choicesEl.style.display = 'flex';
    choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'dialogue-choice';
      btn.textContent = choice.label;
      btn.addEventListener('click', () => choose(i));
      choicesEl.appendChild(btn);
      buttons.push(btn);
    });
    updateSelection();
  }

  document.addEventListener('keydown', keyHandler);
  overlay.addEventListener('click', finishTyping);
}

export async function startDialogueTree(dialogue, index = 0) {
  if (!Array.isArray(dialogue) || index == null) return;
  const entry = dialogue[index];
  if (!entry) return;
  const state = {
    inventory: {},
    memory: dialogueMemory,
    quests: getQuests(),
  };
  inventory.forEach(it => {
    state.inventory[it.id] = it.quantity || 1;
  });
  const validOptions = (entry.options || []).filter(opt => {
    if (typeof opt.condition === 'function') {
      try {
        return opt.condition(state);
      } catch {
        return false;
      }
    }
    return true;
  });
  const choices = validOptions.map(opt => ({
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
      if (opt.give) {
        await loadItems();
        const item = getItemData(opt.give);
        if (item) {
          addItem({ ...item, id: opt.give });
          updateInventoryUI();
          const unlocked = unlockSkillsFromItem(opt.give);
          unlocked.forEach(id => {
            const skill = getAllSkills()[id];
            if (skill) {
              showDialogue(`You've learned a new skill: ${skill.name}!`);
            }
          });
        }
      }
      if (opt.giveBlueprint) {
        giveBlueprint(opt.giveBlueprint);
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
        startDialogueTree(dialogue, opt.goto);
      }
    }
  }));

  if (choices.length > 0) {
    showDialogueWithChoices(entry.text, choices);
  } else {
    showDialogue(entry.text);
  }
}
