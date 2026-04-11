import {
  Atom,
  BookMarked,
  BookOpen,
  FlaskConical,
  Globe2,
  Languages,
  Sigma,
} from "lucide-react";

/** Seven curriculum subjects — unique accent + icon per item */
export const homeSubjectsCatalog = [
  {
    id: "ar-lang",
    ar: "اللغة العربية",
    en: "Arabic Language",
    accent: {
      solid: "bg-rose-500",
      soft: "bg-rose-50",
      text: "text-rose-800",
      border: "border-rose-200/80",
      glow: "from-rose-400/20 via-rose-200/10 to-transparent",
    },
    Icon: BookMarked,
  },
  {
    id: "en-lang",
    ar: "اللغة الإنجليزية",
    en: "English Language",
    accent: {
      solid: "bg-indigo-500",
      soft: "bg-indigo-50",
      text: "text-indigo-800",
      border: "border-indigo-200/80",
      glow: "from-indigo-400/20 via-indigo-200/10 to-transparent",
    },
    Icon: Languages,
  },
  {
    id: "math",
    ar: "الرياضيات",
    en: "Mathematics",
    accent: {
      solid: "bg-blue-600",
      soft: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200/80",
      glow: "from-blue-400/20 via-blue-200/10 to-transparent",
    },
    Icon: Sigma,
  },
  {
    id: "physics",
    ar: "الفيزياء",
    en: "Physics",
    accent: {
      solid: "bg-violet-500",
      soft: "bg-violet-50",
      text: "text-violet-800",
      border: "border-violet-200/80",
      glow: "from-violet-400/20 via-violet-200/10 to-transparent",
    },
    Icon: Atom,
  },
  {
    id: "chemistry",
    ar: "الكيمياء",
    en: "Chemistry",
    accent: {
      solid: "bg-emerald-500",
      soft: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200/80",
      glow: "from-emerald-400/20 via-emerald-200/10 to-transparent",
    },
    Icon: FlaskConical,
  },
  {
    id: "islamic",
    ar: "التربية الإسلامية",
    en: "Islamic Education",
    accent: {
      solid: "bg-amber-600",
      soft: "bg-amber-50",
      text: "text-amber-900",
      border: "border-amber-200/80",
      glow: "from-amber-400/20 via-amber-200/10 to-transparent",
    },
    Icon: BookOpen,
  },
  {
    id: "social",
    ar: "الدراسات الاجتماعية",
    en: "Social Studies",
    accent: {
      solid: "bg-sky-600",
      soft: "bg-sky-50",
      text: "text-sky-900",
      border: "border-sky-200/80",
      glow: "from-sky-400/20 via-sky-200/10 to-transparent",
    },
    Icon: Globe2,
  },
];

/** Map 7-card catalog ids to existing `subjects` ids in mockData */
export function catalogIdToSubjectId(catalogId) {
  const map = {
    "ar-lang": "arabic",
    "en-lang": "english",
    math: "math",
    physics: "science",
    chemistry: "science",
    islamic: "arabic",
    social: "science",
  };
  return map[catalogId] || "math";
}
