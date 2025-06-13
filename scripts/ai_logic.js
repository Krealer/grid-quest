export function chooseBestSkill(skills = [], ally, isOnCooldown = () => false) {
  if (!Array.isArray(skills) || skills.length === 0) return null;
  const usable = skills.filter((s) => !isOnCooldown(s));
  if (usable.length === 0) return null;
  function getType(skill) {
    if (skill.aiType) return skill.aiType;
    const id = skill.id?.toLowerCase() || '';
    const name = skill.name?.toLowerCase() || '';
    if (id.includes('heal') || name.includes('heal')) return 'healing';
    if (skill.category === 'defensive') return 'buff';
    return 'attack';
  }
  const order = { healing: 0, buff: 1, attack: 2 };
  usable.sort((a, b) => (order[getType(a)] || 3) - (order[getType(b)] || 3));
  return usable[0];
}
