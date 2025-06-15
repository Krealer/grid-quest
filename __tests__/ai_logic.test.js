import { chooseBestSkill } from '../scripts/ai_logic.js';

test('returns null for empty skills', () => {
  expect(chooseBestSkill([])).toBeNull();
});

test('filters on cooldown skills', () => {
  const skills = [{ id: 'fire' }, { id: 'heal_self' }];
  const onCd = (s) => s.id === 'heal_self';
  const result = chooseBestSkill(skills, null, onCd);
  expect(result.id).toBe('fire');
});

test('prioritizes healing then buff then attack', () => {
  const skills = [
    { id: 'slash', category: 'offensive' },
    { id: 'heal_spell', name: 'Heal Spell' },
    { id: 'defend', category: 'defensive' }
  ];
  const result = chooseBestSkill(skills);
  expect(result.id).toBe('heal_spell');
});
