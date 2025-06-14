export default [
  {
    text: "Ah, een zwerver... Op zoek naar rijkdom of antwoorden?",
    options: [
      { label: "Rijkdom", goto: 1 },
      { label: "Antwoorden", goto: 2 },
      { label: "Laat maar", goto: null }
    ]
  },
  {
    text: "Rijkdom ligt in ruïnes, altijd bewaakt. Maar zeg me – wat geef je voor een kortere weg?",
    options: [
      { label: "Niets", goto: null },
      { label: "Hangt ervan af...", goto: 3 }
    ]
  },
  {
    text: "De waarheid is een mes. Je kunt jezelf eraan snijden, zwerver.",
    options: [
      { label: "Ik waag het.", goto: null }
    ]
  },
  {
    text: "Wijs. Kom terug met iets zeldzaams, iets wat wordt achtergelaten door zij die het licht haten.",
    options: [
      { label: "Begrepen.", goto: null }
    ]
  }
];
