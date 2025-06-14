export default [
  {
    text: "آه، متجول... تبحث عن ثروة أم إجابات؟",
    options: [
      { label: "الثروة", goto: 1 },
      { label: "الإجابات", goto: 2 },
      { label: "لا شيء", goto: null }
    ]
  },
  {
    text: "الثروات في الخراب، محمية دائمًا. لكن قل لي - ماذا ستعطيني مقابل اختصار الطريق؟",
    options: [
      { label: "لا شيء", goto: null },
      { label: "يعتمد...", goto: 3 }
    ]
  },
  {
    text: "الحقيقة شفرة. قد تجرح نفسك بها، أيها المتجول.",
    options: [
      { label: "سأجازف.", goto: null }
    ]
  },
  {
    text: "حكيم. عد إلي بشيء نادر، شيء يسقطه من يكرهون النور.",
    options: [
      { label: "حسنًا.", goto: null }
    ]
  }
];
