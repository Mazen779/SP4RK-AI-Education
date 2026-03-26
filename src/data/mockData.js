export const subjects = [
  {
    id: "math",
    name: "الرياضيات",
    accent: { solid: "bg-blue-500", soft: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    progress: 74,
    lessons: 18,
    chats: 24,
    files: 12,
    description: "الجبر، المعادلات، الدوال، وحل المسائل خطوة بخطوة.",
  },
  {
    id: "science",
    name: "العلوم",
    accent: { solid: "bg-emerald-500", soft: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    progress: 61,
    lessons: 14,
    chats: 16,
    files: 9,
    description: "المفاهيم العلمية الأساسية، التجارب، والتحليل المفاهيمي.",
  },
  {
    id: "arabic",
    name: "العربية",
    accent: { solid: "bg-orange-400", soft: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    progress: 83,
    lessons: 11,
    chats: 10,
    files: 7,
    description: "النصوص، القواعد، الفهم، والتحليل بأسلوب واضح ومنظم.",
  },
  {
    id: "english",
    name: "الإنجليزية",
    accent: { solid: "bg-violet-500", soft: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
    progress: 69,
    lessons: 13,
    chats: 18,
    files: 8,
    description: "المفردات، القواعد، القراءة، والمحادثة التعليمية.",
  },
];

export const lessonsBySubject = {
  math: [
    { id: "m1", title: "حل المعادلات الخطية", desc: "فهم المعادلات ذات الخطوة الواحدة والمتعددة.", mastery: 82, chats: 6, review: false },
    { id: "m2", title: "المتباينات", desc: "التمثيل والحل والتطبيقات العملية.", mastery: 61, chats: 3, review: true },
    { id: "m3", title: "الدوال الأساسية", desc: "قراءة الدوال ورسمها وفهم سلوكها.", mastery: 48, chats: 8, review: true },
    { id: "m4", title: "الكسور الجبرية", desc: "تبسيط وحل وتطبيقات تدريبية.", mastery: 73, chats: 4, review: false },
  ],
  science: [
    { id: "s1", title: "الخلايا ووظائفها", desc: "مكونات الخلية والتمييز بين الأنواع.", mastery: 77, chats: 5, review: false },
    { id: "s2", title: "التفاعلات الكيميائية", desc: "المفاهيم الأساسية والمعادلات البسيطة.", mastery: 55, chats: 6, review: true },
    { id: "s3", title: "الطاقة والحرارة", desc: "أنواع الطاقة وانتقال الحرارة.", mastery: 68, chats: 2, review: false },
  ],
  arabic: [
    { id: "a1", title: "أسلوب الاستفهام", desc: "التراكيب والأساليب الوظيفية.", mastery: 88, chats: 2, review: false },
    { id: "a2", title: "النص القرائي", desc: "الفكرة العامة والتفاصيل والتحليل.", mastery: 71, chats: 3, review: false },
  ],
  english: [
    { id: "e1", title: "Past Simple vs Present Perfect", desc: "الفروق والاستخدامات والأمثلة.", mastery: 63, chats: 4, review: true },
    { id: "e2", title: "Reading Comprehension", desc: "استراتيجيات الفهم والإجابة.", mastery: 79, chats: 3, review: false },
  ],
};

export const quickPrompts = [
  "اشرح لي هذا الدرس بطريقة بسيطة",
  "اختبرني في آخر درس",
  "حلل هذه الصورة",
  "أعطني أسئلة تدريبية",
  "راجع معي الوحدة الحالية",
  "اشرح لي خطوة بخطوة",
];

export const aiModes = ["الشرح", "التبسيط", "خطوة بخطوة", "تلميح فقط", "التدريب", "الاختبار", "المراجعة", "تحليل الإجابة"];

export const recentChats = [
  { id: 1, title: "مراجعة سريعة قبل اختبار الجبر", type: "مادة", time: "منذ 18 دقيقة", favorite: true },
  { id: 2, title: "شرح سؤال من صورة الواجب", type: "صورة", time: "منذ ساعة", favorite: false },
  { id: 3, title: "أسئلة تدريبية على التفاعلات الكيميائية", type: "درس", time: "اليوم", favorite: false },
  { id: 4, title: "كيف أنظم وقتي قبل الاختبارات؟", type: "عام", time: "أمس", favorite: true },
];

export const uploadedFiles = [
  { id: 1, name: "Algebra_Unit_3_Notes.pdf", type: "PDF", time: "منذ 20 دقيقة", subject: "الرياضيات" },
  { id: 2, name: "Science_Worksheet_2.jpg", type: "IMG", time: "منذ 3 ساعات", subject: "العلوم" },
  { id: 3, name: "Arabic_Summary.docx", type: "DOC", time: "أمس", subject: "العربية" },
];

export const reviewSessions = [
  { title: "مراجعة متعددة الدروس", meta: "الرياضيات · 3 دروس", score: "جاهزة للاختبار" },
  { title: "جلسة تبسيط مفاهيم", meta: "العلوم · الطاقة والحرارة", score: "تحتاج متابعة" },
  { title: "تدريب قواعد", meta: "الإنجليزية · الأزمنة", score: "تحسن ممتاز" },
];

export const chatMessages = [
  {
    role: "assistant",
    content:
      "مرحبًا، أنا مساعدك التعليمي. يمكنني شرح المفاهيم، تدريبك، أو مراجعة الدروس معك بأسلوب واضح ومنظم. داخل المواد والدروس سأعتمد أساسًا على المحتوى الدراسي والكتاب المرتبط.",
    note: null,
  },
  { role: "user", content: "اشرح لي الفرق بين المعادلة والمتباينة بشكل بسيط مع مثال." },
  {
    role: "assistant",
    content:
      "المعادلة تبحث عن قيمة تجعل الطرفين متساويين، مثل: 2x + 1 = 7. أما المتباينة فهي تقارن بين الطرفين دون تساوٍ دائم، مثل: 2x + 1 > 7.\n\nفي المعادلة نبحث عن قيمة أو قيم محددة، بينما في المتباينة قد نحصل على مجموعة قيم تحقق الشرط.\n\nمثال سريع:\n- المعادلة: 2x + 1 = 7 ⟵ الحل x = 3\n- المتباينة: 2x + 1 > 7 ⟵ الحل x > 3",
    note: "ملاحظة: المثال السابق ضمن المفهوم الأساسي للدرس الحالي.",
  },
];

export const bookLibrary = [
  { id: 1, title: "كتاب الرياضيات - الفصل الثاني", subject: "الرياضيات", grade: "الصف التاسع", cover: "RM", accent: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: 2, title: "دليل العلوم المبسط", subject: "العلوم", grade: "الصف التاسع", cover: "SC", accent: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: 3, title: "مهارات القراءة والتحليل", subject: "العربية", grade: "الصف التاسع", cover: "AR", accent: "bg-orange-50 text-orange-700 border-orange-200" },
  { id: 4, title: "English Practice Book", subject: "الإنجليزية", grade: "الصف التاسع", cover: "EN", accent: "bg-violet-50 text-violet-700 border-violet-200" },
];

