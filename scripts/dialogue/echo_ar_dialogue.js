export default {
  id: 'echo',
  name: 'صدى الاسم',
  dialogue: [
    {
      id: 1,
      text: 'همسة باسمك تتردد من بين الضباب.',
      options: [
        { text: 'استمع', goto: 2 },
        { text: 'تجاهله', goto: null }
      ]
    },
    {
      id: 2,
      text: 'الصدى يتحدث بنبرات ليست تماما كنبرتك...',
      options: [
        { text: 'من أنت؟', goto: 3 },
        { text: 'الرحيل', goto: null }
      ]
    },
    {
      id: 3,
      text: 'أنا ما تبقى من الأسماء المنسية. قد تتلاشى أنت أيضا.',
      options: [
        { text: 'ماذا تقصد؟', goto: null },
        { text: 'الرحيل', goto: null }
      ]
    }
  ]
};
