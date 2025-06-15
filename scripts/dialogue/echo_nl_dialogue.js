export default {
  id: 'echo',
  name: 'Echo van de Naam',
  dialogue: [
    {
      id: 1,
      text: 'Een fluistering van je naam weerklinkt uit de mist.',
      options: [
        { text: 'Luister', goto: 2 },
        { text: 'Negeer het', goto: null }
      ]
    },
    {
      id: 2,
      text: 'De echo spreekt in tonen die niet helemaal de jouwe zijn...',
      options: [
        { text: 'Wie ben je?', goto: 3 },
        { text: 'Weggaan', goto: null }
      ]
    },
    {
      id: 3,
      text: 'Ik ben wat overblijft van vergeten namen. Ook jij kunt vervagen.',
      options: [
        { text: 'Hoe bedoel je?', goto: null },
        { text: 'Weggaan', goto: null }
      ]
    }
  ]
};
