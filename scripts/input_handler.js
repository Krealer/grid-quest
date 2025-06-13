export const inputHandler = {
  onSkill: null,
  onTarget: null,
  onAlly: null,
  init() {
    document.addEventListener('click', (e) => {
      const skillBtn = e.target.closest('[data-skill-id]');
      if (skillBtn && this.onSkill) {
        this.onSkill(skillBtn.dataset.skillId, skillBtn, e);
        return;
      }
      const combatant = e.target.closest('.combatant.selectable');
      if (combatant && this.onTarget) {
        const index = Number(combatant.dataset.index);
        const isPlayer = combatant.closest('.player-team') !== null;
        this.onTarget({ index, isPlayer, element: combatant }, e);
        return;
      }
      const ally = e.target.closest('.ally-portrait');
      if (ally && this.onAlly) {
        const parent = ally.parentElement;
        const index = Array.prototype.indexOf.call(parent.children, ally);
        this.onAlly(index, ally, e);
      }
    });
  },
  setSkillHandler(fn) {
    this.onSkill = fn;
  },
  setTargetHandler(fn) {
    this.onTarget = fn;
  },
  setAllyHandler(fn) {
    this.onAlly = fn;
  }
};

export default inputHandler;
