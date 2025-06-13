import { krealer1Dialogue } from '../scripts/dialogue/krealer_dialogues.js';

test('krealer1Dialogue first line matches expectation', () => {
  expect(krealer1Dialogue[0].text).toMatch('Doubt is a weapon');
});
