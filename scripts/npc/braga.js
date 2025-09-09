import { showDialogue } from '../dialogueSystem.js';

const lines = [
  'The flames dance restlessly.',
  'Warmth is a luxury in these ruins.',
  'Careful — fire has a mind of its own.'
];

export function interact() {
  const line = lines[Math.floor(Math.random() * lines.length)];
  showDialogue(line);
}

