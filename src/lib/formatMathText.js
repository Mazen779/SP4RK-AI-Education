/** Unicode superscript digits U+2070–U+2079 */
const SUPER = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
/** Unicode subscript digits U+2080–U+2089 */
const SUB = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];

function mapDigits(str, table) {
  let out = "";
  for (const c of String(str)) {
    if (c >= "0" && c <= "9") out += table[Number(c)];
    else out += c;
  }
  return out;
}

/** Integer (optional leading + / -) → superscript digit string */
export function toSuperDigits(exp) {
  let s = String(exp);
  let sign = "";
  if (s.startsWith("-")) {
    sign = "⁻";
    s = s.slice(1);
  } else if (s.startsWith("+")) {
    s = s.slice(1);
  }
  return sign + mapDigits(s, SUPER);
}

function toSubDigits(str) {
  return mapDigits(str, SUB);
}

/**
 * تحويل نص رياضي عادي (مثل 4^2، x^10، 3/4) إلى رموز Unicode أنظف للعرض.
 * لا يستبدل LaTeX المعقد؛ مخصص للنصوص القادمة من الـ API كنص عادي.
 */
export function formatMathText(text = "") {
  let t = String(text);

  t = t.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");

  // sqrt(…)
  t = t.replace(/\bsqrt\s*\(/gi, "√(");

  // a**b → aᵇ (أس صحيح)
  t = t.replace(/(\d+)\s*\*\*\s*([+\-]?\d+)/g, (_, base, exp) => `${base}${toSuperDigits(exp)}`);

  // ^ exponent (مسافات اختيارية قبل ^)
  t = t.replace(/\s*\^([+\-]?\d+)/g, (_, exp) => toSuperDigits(exp));

  // simple numeric fractions: superscript num / subscript den (Unicode ⁄)
  t = t.replace(/\b(-?\d{1,5})\/(\d{1,5})\b(?!\/\d)/g, (_, nums, den) => {
    let neg = "";
    let num = nums;
    if (num.startsWith("-")) {
      neg = "−";
      num = num.slice(1);
    }
    if (!num) return `${neg}⁄${mapDigits(den, SUB)}`;
    const a = mapDigits(num, SUPER);
    const b = mapDigits(den, SUB);
    return `${neg}${a}⁄${b}`;
  });

  // multiplication between numbers: 2 * 3 or 2×3 cleanup
  t = t.replace(/(\d)\s*\*\s*(\d)/g, "$1·$2");

  t = t.replace(/\bpi\b/gi, "π");
  t = t.replace(/\b(inf|infinity)\b/gi, "∞");

  t = t.replace(/<=/g, "≤").replace(/>=/g, "≥").replace(/!=/g, "≠");
  t = t.replace(/->/g, "→").replace(/=>/g, "⇒");

  return t.trim();
}
