import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "sp4rk-locale";

export const translations = {
  ar: {
    brand: "SP4RK AI",
    brandTagline: "تعلّم ذكي",
    nav: {
      home: "الرئيسية",
      subjects: "المواد",
      tasks: "المهام",
      library: "المكتبة",
      progress: "التقدم",
      studyPlan: "خطة الدراسة",
      joinGame: "انضم للعبة",
      navigation: "التنقل",
      subjectsSection: "المواد",
      recent: "أحدث المحادثات",
      newChat: "+ محادثة جديدة",
      settings: "الإعدادات",
    },
    home: {
      subtitle: "ابدأ التعلم بذكاء — اسأل أو أكمل دروسك",
      searchPlaceholder: "اسأل عن درس، ارفع صورة، أو اطلب شرح خطوة بخطوة...",
      generalMode: "عام",
      modes: { explain: "شرح", stepByStep: "خطوة بخطوة", test: "وضع الاختبار" },
      modeGeneral: "عام",
      hint: "يمكنك رفع صورة أو ملف للحصول على شرح أدق",
      quickChips: ["اشرح هذا الدرس", "اختبرني", "حل هذه المسألة", "راجع معي"],
      reviewPill: "راجع معي",
      analyzeImagePill: "حلل هذي الصورة",
      organizeStudyPill: "نظم دراستي",
      continueTitle: "أكمل من حيث توقفت",
      continueHint: "نظام ذكي يعيدك لآخر خطوة في كل مادة",
      viewAll: "عرض الكل",
      progress: "التقدم",
      continue: "متابعة",
      subjectsTitle: "المواد",
      resumeNow: "استئناف الآن",
      stoppedAt: "توقفت عند:",
      hintNeedsReview: "يحتاج مراجعة",
      hintAlmostComplete: "قريب من الإكمال",
      hintGoodProgress: "تقدم جيد",
      continueLesson: "متابعة الدرس",
      openChat: "فتح المحادثة",
      navToHero: "الانتقال إلى قسم الترحيب والبحث",
      navToContinue: "الانتقال إلى قسم أكمل من حيث توقفت",
      navToSubjects: "الانتقال إلى قسم المواد",
      shortcutsSectionTitle: "اختصارات سريعة",
      shortcutTasksTitle: "المهام",
      shortcutTasksHint: "مهامك ومحادثاتك التعليمية",
      shortcutProgressTitle: "تقدم الطالب",
      shortcutProgressHint: "متابعة أدائك وخططك الدراسية",
      navToShortcuts: "الانتقال إلى قسم الاختصارات السريعة",
      navToContinueFromShortcuts: "العودة إلى قسم أكمل من حيث توقفت",
      shortcutProgressChartSubtitle: "متوسط أدائك عبر الأسابيع الأخيرة (تجريبي)",
      shortcutProgressOpen: "التقدم",
      shortcutProgressAvgLabel: "المتوسط العام",
      shortcutProgressTrendLabel: "تحسّن",
      shortcutProgressChartAria: "رسم بياني لمتوسط أداء الطالب خلال الأسابيع الأخيرة",
      shortcutTasksOpenAll: "عرض الكل",
      shortcutTasksEmpty: "لا توجد مهام أو محادثات حديثة بعد.",
      shortcutTasksPrimaryCta: "فتح المهام والمحادثات",
    },
    titles: {
      home: "الرئيسية",
      chat: "المحادثات",
      library: "المكتبة",
      progress: "التقدم",
      settings: "الإعدادات",
    },
    profile: {
      school: "مدرسة الإبداع · الصف التاسع",
    },
    upload: {
      image: "رفع صورة",
      file: "رفع ملف",
      document: "إرفاق مستند",
    },
    sidebarChat: {
      startReview: "بدء مراجعة",
      quickTest: "اختبار سريع",
      uploadFile: "رفع ملف",
      searchChats: "ابحث في المحادثات…",
      shortcutsLabel: "اختصارات",
      emptyHistory: "لا محادثات بعد.",
      deleteHistoryItem: "حذف من السجل",
    },
    chatComposer: {
      placeholder: "اسأل عن أي شيء في دراستك…",
      attachImage: "إرفاق صورة",
      attachFile: "إرفاق ملف",
      addAttachments: "إضافة مرفقات",
      voiceInput: "إدخال صوتي",
      send: "إرسال",
      removeFileAria: "إزالة الملف",
      removeImageAria: "إزالة الصورة",
      defaultLongPlaceholder:
        "اسأل سؤالك... ارفع صورة لمسألة، ملف PDF، أو ابدأ مراجعة ذكية داخل المادة أو الدرس",
      voice: "صوت",
    },
    chat: {
      assistantStub: "تم استلام رسالتك. يمكنك متابعة المحادثة من هنا.",
      thinking: "لحظة... عم فكر.",
      errorFallback: "صار خطأ أثناء الاتصال بالذكاء الاصطناعي. جرّب مرة تانية.",
    },
    chatWelcome: {
      brandLine: "SP4RK Education",
      headline: "مساعد تعلم ذكي يتكيف معك",
      subheadline:
        "اطرح سؤالك، ارفع ملفًا أو صورة، أو اختر إجراءً سريعًا للبدء. نصمّم الإجابات لتناسب مستواك وأهدافك الدراسية.",
      quickStartSection: "ابدأ بسرعة",
      cards: {
        explainSimple: {
          title: "اشرح لي فكرة",
          description: "شرح مبسط يناسب مستواك",
          prompt: "اشرح لي هذا المفهوم بطريقة مبسطة تناسب مستواي",
        },
        quickQuiz: {
          title: "أنشئ اختبار",
          description: "اختبر نفسك بأسئلة ذكية",
          prompt: "أنشئ لي اختبارًا سريعًا من 5 أسئلة مع مستوى مناسب",
        },
        lessonPlan: {
          title: "أنشئ خطة درس",
          description: "نظّم أهدافك لمادة أو درس",
          prompt: "أنشئ لي خطة درس واضحة ومنظمة لهذا الموضوع",
        },
        weeklyPlan: {
          title: "أنشئ خطة مذاكرة",
          description: "جدول أسبوعي ذكي ومنظم",
          prompt: "أنشئ لي خطة مذاكرة أسبوعية ذكية",
        },
        analyzeHw: {
          title: "حلّل صورة",
          description: "ارفع صورة واحصل على شرح واضح",
          prompt: "سأرفع صورة، حللها واشرحها لي خطوة بخطوة",
        },
      },
    },
    historyLabels: {
      image: "صورة",
      file: "ملف",
      chat: "محادثة",
      attachments: "مرفقات",
    },
  },
  en: {
    brand: "SP4RK AI",
    brandTagline: "Smart learning",
    nav: {
      home: "Home",
      subjects: "Subjects",
      tasks: "Tasks",
      library: "Library",
      progress: "Progress",
      studyPlan: "Study Plan",
      joinGame: "Join Game",
      navigation: "Navigation",
      subjectsSection: "Subjects",
      recent: "Recent chats",
      newChat: "+ New Chat",
      settings: "Settings",
    },
    home: {
      subtitle: "Start learning smart — ask or pick up your lessons",
      searchPlaceholder: "Ask about a lesson, upload an image, or request step-by-step help...",
      generalMode: "General",
      modes: { explain: "Explain", stepByStep: "Step-by-Step", test: "Test Mode" },
      modeGeneral: "General",
      hint: "Upload an image or file for more accurate explanations",
      quickChips: ["Explain this lesson", "Test me", "Solve this problem", "Review with me"],
      reviewPill: "Review with me",
      analyzeImagePill: "Analyze this image",
      organizeStudyPill: "Organize my study",
      continueTitle: "Continue where you left off",
      continueHint: "A smart path back to your last step in each subject",
      viewAll: "View all",
      progress: "Progress",
      continue: "Continue",
      subjectsTitle: "Subjects",
      resumeNow: "Resume Now",
      stoppedAt: "You stopped at:",
      hintNeedsReview: "Needs review",
      hintAlmostComplete: "Almost complete",
      hintGoodProgress: "Good progress",
      continueLesson: "Continue lesson",
      openChat: "Open chat",
      navToHero: "Go to greeting and search section",
      navToContinue: "Go to continue learning section",
      navToSubjects: "Go to subjects section",
      shortcutsSectionTitle: "Quick shortcuts",
      shortcutTasksTitle: "Tasks",
      shortcutTasksHint: "Your tasks and learning chats",
      shortcutProgressTitle: "Student progress",
      shortcutProgressHint: "Track performance and study plans",
      navToShortcuts: "Go to quick shortcuts section",
      navToContinueFromShortcuts: "Back to continue learning section",
      shortcutProgressChartSubtitle: "Your weekly performance trend (sample)",
      shortcutProgressOpen: "Progress",
      shortcutProgressAvgLabel: "Overall average",
      shortcutProgressTrendLabel: "Improvement",
      shortcutProgressChartAria: "Chart of student average performance over recent weeks",
      shortcutTasksOpenAll: "View all",
      shortcutTasksEmpty: "No recent tasks or chats yet.",
      shortcutTasksPrimaryCta: "Open tasks & chats",
    },
    titles: {
      home: "Home",
      chat: "Chats",
      library: "Library",
      progress: "Progress",
      settings: "Settings",
    },
    profile: {
      school: "Al-Ibdaa School · Grade 9",
    },
    upload: {
      image: "Upload Image",
      file: "Upload File",
      document: "Attach Document",
    },
    sidebarChat: {
      startReview: "Start review",
      quickTest: "Quick test",
      uploadFile: "Upload file",
      searchChats: "Search chats…",
      shortcutsLabel: "Shortcuts",
      emptyHistory: "No chats yet.",
      deleteHistoryItem: "Remove from history",
    },
    chatComposer: {
      placeholder: "Ask anything about your studies…",
      attachImage: "Attach image",
      attachFile: "Attach file",
      addAttachments: "Add attachments",
      voiceInput: "Voice input",
      send: "Send",
      removeFileAria: "Remove file",
      removeImageAria: "Remove image",
      defaultLongPlaceholder:
        "Ask your question... upload an image of a problem, a PDF, or start a smart review within a subject or lesson.",
      voice: "Voice",
    },
    chat: {
      assistantStub: "Message received. You can continue the conversation here.",
      thinking: "One moment... thinking.",
      errorFallback: "Something went wrong while contacting AI. Please try again.",
    },
    chatWelcome: {
      brandLine: "SP4RK Education",
      headline: "A smart learning assistant that adapts to you",
      subheadline:
        "Ask a question, upload a file or image, or pick a quick action to start. We tailor answers to your level and goals.",
      quickStartSection: "Quick start",
      cards: {
        explainSimple: {
          title: "Explain an idea",
          description: "A simple explanation for your level",
          prompt: "Explain this concept in a simple way that fits my level",
        },
        quickQuiz: {
          title: "Create a quiz",
          description: "Test yourself with smart questions",
          prompt: "Create a quick quiz with 5 questions at an appropriate level",
        },
        lessonPlan: {
          title: "Create a lesson plan",
          description: "Organize goals for a subject or lesson",
          prompt: "Create a clear, structured lesson plan for this topic",
        },
        weeklyPlan: {
          title: "Create a study plan",
          description: "A smart, organized weekly schedule",
          prompt: "Create a smart weekly study plan for me",
        },
        analyzeHw: {
          title: "Analyze an image",
          description: "Upload a photo and get a clear explanation",
          prompt: "I will upload an image—analyze it and explain it step by step",
        },
      },
    },
    historyLabels: {
      image: "Image",
      file: "File",
      chat: "Chat",
      attachments: "Attachments",
    },
  },
};

function getGreeting(locale, now = new Date()) {
  const h = now.getHours();
  if (locale === "ar") {
    if (h >= 5 && h < 12) return "صباح الخير";
    if (h >= 12 && h < 18) return "أهلاً";
    return "مساء الخير";
  }
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 18) return "Hello";
  return "Good evening";
}

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s === "ar" || s === "en") return s;
    } catch {
      /* ignore */
    }
    return "ar";
  });

  const setLocale = useCallback((next) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useMemo(() => translations[locale] || translations.ar, [locale]);
  const dir = locale === "ar" ? "rtl" : "ltr";

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      dir,
      t,
      greeting: () => getGreeting(locale),
      studentName: "Sama Jumah",
      studentNameShort: "SJ",
    }),
    [locale, setLocale, t]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
