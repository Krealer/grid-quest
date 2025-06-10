export const echoData = {
  fogbound_fragment: {
    id: 'fogbound_fragment',
    flag: 'echo_fogbound_intro',
    text: [
      'Fog remembers what we forget.',
      'But not all of it returns whole.',
      'Your shape is still being drawn.'
    ]
  }
};

export function getEchoData(id) {
  return echoData[id];
}
