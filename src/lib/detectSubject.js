export function detectSubjectIdFromText(text, subjects) {
  const t = (text || "").toLowerCase();
  if (!t.trim()) return null;

  const rules = [
    { id: "math", keywords: ["رياضيات", "جبر", "معادلة", "متباينة", "دالة", "كسور", "algebra", "math"] },
    { id: "science", keywords: ["علوم", "خلية", "طاقة", "حرارة", "تفاعل", "كيمياء", "science"] },
    { id: "arabic", keywords: ["عربي", "العربية", "نحو", "بلاغة", "نص", "قرائي", "arabic"] },
    { id: "english", keywords: ["انجليزي", "الإنجليزية", "english", "past", "present", "grammar", "reading"] },
  ];

  for (const r of rules) {
    if (r.keywords.some((k) => t.includes(k.toLowerCase()))) return r.id;
  }

  // fallback: match subject names
  for (const s of subjects || []) {
    if (s?.name && t.includes(String(s.name).toLowerCase())) return s.id;
  }

  return null;
}

