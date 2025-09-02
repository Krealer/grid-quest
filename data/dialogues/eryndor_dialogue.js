export const eryndorDialogue = [
  {
    text: 'The lands are littered with things the monsters leave behind. Most overlook them. I do not.',
    options: [
      { label: 'What can I do with them?', goto: 1 },
      { label: 'Oh? Cool.', goto: null }
    ]
  },
  {
    text: "Bone fragments carry resilience. Goblin gear? Primitive, but layered. Together, there's potential.",
    options: [
      { label: 'Ooh! Sounds cool!', goto: null },
      {
        label: 'On the mission!',
        goto: null,
        condition: (state) =>
          !(
            (state.inventory['bone_fragment'] || 0) >= 1 &&
            (state.inventory['goblin_gear'] || 0) >= 1
          )
      },
      {
        label: 'Can you tell me more?',
        goto: 2,
        condition: (state) =>
          (state.inventory['bone_fragment'] || 0) >= 1 &&
          (state.inventory['goblin_gear'] || 0) >= 1
      }
    ]
  },
  {
    text: "If you give me one of each, I'll make you a Defense Potion I. It'll boost your endurance for a while.",
    options: [
      {
        label: "Yeah, let's do this!",
        goto: null,
        onChoose: async () => {
          const { removeItem, addItem } = await import('../../scripts/inventory.js');
          const { loadItems, getItemData } = await import('../../scripts/item_loader.js');
          await loadItems();
          removeItem('bone_fragment', 1);
          removeItem('goblin_gear', 1);
          const data = getItemData('defense_potion_I');
          if (data) addItem({ ...data, id: 'defense_potion_I', quantity: 1 });
        }
      },
      { label: 'Cool!', goto: null }
    ]
  }
];
