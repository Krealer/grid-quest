export default {
  id: 'echo',
  name: '名の残響',
  dialogue: [
    {
      id: 1,
      text: '霧の中からあなたの名を囁く声がこだまする。',
      options: [
        { text: '耳を傾ける', goto: 2 },
        { text: '無視する', goto: null }
      ]
    },
    {
      id: 2,
      text: 'そのこだまは、あなたとは少し違う声色で語りかける…',
      options: [
        { text: 'あなたは誰？', goto: 3 },
        { text: '立ち去る', goto: null }
      ]
    },
    {
      id: 3,
      text: '私は忘れられた名の残滓。あなたもいずれ消えゆくかもしれない。',
      options: [
        { text: 'どういう意味だ？', goto: null },
        { text: '立ち去る', goto: null }
      ]
    }
  ]
};
