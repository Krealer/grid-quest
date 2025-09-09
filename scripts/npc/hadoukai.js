import { showDialogue } from '../dialogueSystem.js';

const lines = [
  'The tides whisper secrets to those who listen.',
  'Ripples carry news from distant shores.',
  'Still waters reflect the wanderer\'s soul.'
];

export function interact() {
  const line = lines[Math.floor(Math.random() * lines.length)];
  showDialogue(line);
}

