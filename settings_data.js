export default {
  gridCoordinates: {
    default: false,
    description: 'Show (x, y) when hovering over a tile'
  },
  movementSpeed: {
    default: 'normal',
    description: 'Player tile transition speed'
  },
  combatSpeed: {
    default: 'normal',
    description: 'Speed of combat animations'
  },
  colorblind: {
    default: false,
    description: 'High contrast grid visuals'
  },
  tileLabels: {
    default: false,
    description: 'Overlay names on tiles'
  },
  dialogueAnim: {
    default: true,
    description: 'Type out dialogue text'
  },
  tapToSkip: {
    default: true,
    description: 'Tap anywhere to skip dialogue'
  },
  notifySkip: {
    default: false,
    description:
      'Disables non-essential auto-messages like trap warnings and water healing.'
  },
  language: {
    default: 'en',
    description: 'UI language code'
  },
  centerMode: {
    default: false,
    description: 'Keeps the player centered on mobile in portrait'
  }
};
