export const echoData = {
  fogbound_fragment: {
    id: 'fogbound_fragment',
    flag: 'echo_fogbound_intro',
    text: [
      'Fog remembers what we forget.',
      'But not all of it returns whole.',
      'Your shape is still being drawn.'
    ]
  },
  verge_whispers: {
    id: 'verge_whispers',
    flag: 'echo_verge_triggered',
    text: [
      'A faint whisper rides the rain-soaked breeze.',
      "Something ancient stirs beyond the water's edge."
    ]
  }
};

export function getEchoData(id) {
  return echoData[id];
}
