export default [
  {
    text: "ああ、旅人か... 富を求めているのか、それとも答えを?",
    options: [
      { label: "富", goto: 1 },
      { label: "答え", goto: 2 },
      { label: "やっぱいい", goto: null }
    ]
  },
  {
    text: "財宝は廃墟に眠る、常に守られている。だが近道を教えるとしたら、代償は？",
    options: [
      { label: "何もない", goto: null },
      { label: "場合による…", goto: 3 }
    ]
  },
  {
    text: "真実は刃だ。触れれば切れるぞ、旅人。",
    options: [
      { label: "やってみよう。", goto: null }
    ]
  },
  {
    text: "賢いな。光を嫌う者たちが落とす珍品を持って戻れ。",
    options: [
      { label: "了解。", goto: null }
    ]
  }
];
