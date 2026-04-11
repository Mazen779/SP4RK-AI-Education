export function getArabicGreeting(now = new Date()) {
  const h = now.getHours();
  if (h >= 5 && h < 12) return "صباح الخير";
  if (h >= 12 && h < 18) return "أهلاً";
  return "مساء الخير";
}

