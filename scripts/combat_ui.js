export function setupTabs(overlay) {
  const skillContainer = overlay.querySelector('.skill-buttons');
  const itemContainer = overlay.querySelector('.item-buttons');
  const skillsTabBtn = overlay.querySelector('.skills-tab');
  const itemsTabBtn = overlay.querySelector('.items-tab');
  if (!skillContainer || !itemContainer || !skillsTabBtn || !itemsTabBtn) return;

  function showSkills() {
    skillContainer.classList.remove('hidden');
    itemContainer.classList.add('hidden');
    skillsTabBtn.classList.add('selected');
    itemsTabBtn.classList.remove('selected');
  }

  function showItems() {
    itemContainer.classList.remove('hidden');
    skillContainer.classList.add('hidden');
    itemsTabBtn.classList.add('selected');
    skillsTabBtn.classList.remove('selected');
  }

  skillsTabBtn.addEventListener('click', showSkills);
  itemsTabBtn.addEventListener('click', showItems);

  // default
  showSkills();
}
