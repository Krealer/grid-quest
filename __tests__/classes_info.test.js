/** @jest-environment jsdom */

let getClassInfo, getAllClasses;

beforeEach(async () => {
  ({ getClassInfo, getAllClasses } = await import('../scripts/classes_info.js'));
});

test('getClassInfo returns correct class data', () => {
  const warrior = getClassInfo('warrior');
  expect(warrior).toBeDefined();
  expect(warrior.name).toBe('Warrior');
});

test('getAllClasses returns array of classes', () => {
  const classes = getAllClasses();
  expect(Array.isArray(classes)).toBe(true);
  expect(classes.length).toBeGreaterThan(0);
});
