import { getAllSkills as getPlayerSkills } from './skills.js';
import { getAllEnemySkills } from './enemy_skills.js';
import { getAllPassives } from './passive_skills.js';

let skillInfoList = null;

function buildList() {
  if (skillInfoList) return skillInfoList;
  skillInfoList = [];
  const playerSkills = getPlayerSkills();
  Object.values(playerSkills).forEach(s => {
    skillInfoList.push({
      id: s.id,
      name: s.name,
      description: s.description || '',
      type: s.statuses || s.cleanse ? 'status' : 'active',
      origin: 'player',
    });
  });
  const enemySkills = getAllEnemySkills();
  Object.values(enemySkills).forEach(s => {
    skillInfoList.push({
      id: s.id,
      name: s.name,
      description: s.description || '',
      type: s.statuses || s.applies ? 'status' : 'active',
      origin: 'enemy',
    });
  });
  const passives = getAllPassives();
  Object.values(passives).forEach(p => {
    skillInfoList.push({
      id: p.id,
      name: p.name,
      description: p.description || '',
      type: 'passive',
      origin: 'player',
    });
  });
  return skillInfoList;
}

export function loadSkillInfo() {
  return buildList();
}

export function getAllSkillsInfo() {
  return buildList();
}

export function getSkillInfo(id) {
  return buildList().find(s => s.id === id);
}
