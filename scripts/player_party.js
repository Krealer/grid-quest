export const playerParty = {
  members: [],
  activeIndex: 0
};

export function initParty(list = []) {
  playerParty.members = Array.isArray(list) ? list : [list];
  playerParty.activeIndex = 0;
}

export function getActiveMember() {
  return playerParty.members[playerParty.activeIndex] || null;
}

export function setActiveIndex(idx) {
  if (typeof idx === 'number' && idx >= 0 && idx < playerParty.members.length) {
    playerParty.activeIndex = idx;
  }
}

export function nextMember() {
  if (playerParty.members.length === 0) return null;
  playerParty.activeIndex = (playerParty.activeIndex + 1) % playerParty.members.length;
  return getActiveMember();
}

export default playerParty;
