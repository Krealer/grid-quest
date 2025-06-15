export default {
  id: 'echo',
  name: 'Эхо Имени',
  dialogue: [
    {
      id: 1,
      text: 'Шепот твоего имени эхом разносится из тумана.',
      options: [
        { text: 'Прислушаться', goto: 2 },
        { text: 'Игнорировать', goto: null }
      ]
    },
    {
      id: 2,
      text: 'Эхо говорит голосом, не совсем похожим на твой...',
      options: [
        { text: 'Кто ты?', goto: 3 },
        { text: 'Уйти', goto: null }
      ]
    },
    {
      id: 3,
      text: 'Я — то, что осталось от забытых имён. И ты можешь исчезнуть.',
      options: [
        { text: 'Что ты имеешь в виду?', goto: null },
        { text: 'Уйти', goto: null }
      ]
    }
  ]
};
