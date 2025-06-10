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
      'You stand at the edge of something unfinished.',
      'Voices echo backwards in time… but remember nothing.',
      'The verge remembers what you try to forget.'
    ]
  },
  breach_fragment: {
    id: 'breach_fragment',
    flag: 'echo_frag_breach',
    text: [
      'Time fractured here before it even tried to hold together.',
      'They watched, but not from beyond — from underneath.',
      'The breach is not an accident. It is an attempt.'
    ]
  }
};

export function getEchoData(id) {
  return echoData[id];
}
