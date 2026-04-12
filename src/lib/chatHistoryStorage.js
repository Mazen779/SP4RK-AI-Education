const STORAGE_KEY = "spark-chat-history-v1";
const MAX_SESSIONS = 80;

export function loadChatHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveChatHistory(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)));
  } catch {
    /* ignore quota */
  }
}

export function formatRelativeTime(iso, locale = "ar") {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const isEn = locale === "en";
  if (minutes < 1) return isEn ? "Now" : "الآن";
  if (minutes < 60) return isEn ? `${minutes}m ago` : `منذ ${minutes} د`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return isEn ? `${hours}h ago` : `منذ ${hours} س`;
  const days = Math.floor(hours / 24);
  if (days < 7) return isEn ? `${days}d ago` : `منذ ${days} يوم`;
  return d.toLocaleDateString(isEn ? "en" : "ar", { day: "numeric", month: "short" });
}

/** وقت مختصر لسطر القائمة */
export function formatRelativeTimeShort(iso, locale = "ar") {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const isEn = locale === "en";
  if (minutes < 1) return isEn ? "Now" : "الآن";
  if (minutes < 60) return isEn ? `${minutes}m` : `${minutes}د`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return isEn ? `${hours}h` : `${hours}س`;
  const days = Math.floor(hours / 24);
  if (days < 7) return isEn ? `${days}d` : `${days}ي`;
  return d.toLocaleDateString(isEn ? "en" : "ar", { day: "numeric", month: "short" });
}

function defaultHistoryLabels() {
  return { image: "صورة", file: "ملف", chat: "محادثة", attachments: "مرفقات" };
}

/** @param {{ image: string, file: string, chat: string, attachments: string }} labels */
function resolveHistoryLabels(labels) {
  return labels && typeof labels === "object" ? { ...defaultHistoryLabels(), ...labels } : defaultHistoryLabels();
}

function collapseSpaces(s) {
  return String(s ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

/** نص قصير للمعاينة: يدعم content كنص أو كائن (مثل solve). */
export function previewTextFromMessage(m) {
  if (!m) return "";
  if (m.role === "user") {
    const u = m.text ?? m.content;
    return typeof u === "string" ? u : "";
  }
  if (m.text != null && String(m.text).trim()) return String(m.text);
  const c = m.content;
  if (typeof c === "string") return c;
  if (c && typeof c === "object") {
    if (c.type === "clarification" || c.intent === "clarification") {
      const msg = String(c.message ?? c.text ?? c.question ?? c.body ?? "").trim();
      if (msg) return msg.length > 96 ? `${msg.slice(0, 93)}…` : msg;
      const opts = c.options;
      if (Array.isArray(opts) && opts.length) {
        const first = opts[0];
        const label =
          typeof first === "string"
            ? first
            : String(first?.label ?? first?.text ?? first?.title ?? "").trim();
        if (label) return label.length > 96 ? `${label.slice(0, 93)}…` : label;
      }
      return "Clarification";
    }
    const piece = c.final_answer ?? c.answer ?? c.explanation;
    if (piece == null) return "";
    if (typeof piece === "object" && piece.type === "fraction") {
      const n = String(piece.numerator ?? "").trim();
      const d = String(piece.denominator ?? "").trim();
      const s = (n && d ? `${n}/${d}` : n || d).trim();
      if (s) return s;
      return "";
    }
    if (String(piece).trim()) return String(piece);
  }
  return "";
}

/** عناوين قائمة سجل المحادثات: بضع كلمات فقط (مثل واجهات Recents). */
export const HISTORY_TITLE_WORDS = 4;
export const HISTORY_TITLE_CHARS = 32;

/**
 * عنوان قصير من أول رسالة (بدون نسخ الفقرة كاملة).
 */
export function summarizeToTitle(text, maxWords = HISTORY_TITLE_WORDS, maxChars = HISTORY_TITLE_CHARS) {
  const t = collapseSpaces(text);
  if (!t) return "";
  const words = t.split(" ");
  let acc = "";
  for (let i = 0; i < words.length && i < maxWords; i++) {
    const next = acc ? `${acc} ${words[i]}` : words[i];
    if (next.length > maxChars) {
      if (!acc) return `${words[i].slice(0, Math.max(1, maxChars - 1))}…`;
      break;
    }
    acc = next;
  }
  const done = acc.trim();
  const longer = t.length > done.length || words.length > maxWords;
  return longer ? `${done}…` : done;
}

/** سطر ثانٍ مختصر (آخر رسالة أو تتمة قصيرة). */
export function summarizeToPreview(text, maxWords = 10, maxChars = 68) {
  const t = collapseSpaces(text);
  if (!t) return "";
  const words = t.split(" ");
  let acc = "";
  for (let i = 0; i < words.length && i < maxWords; i++) {
    const next = acc ? `${acc} ${words[i]}` : words[i];
    if (next.length > maxChars) {
      if (!acc) return `${words[i].slice(0, Math.max(1, maxChars - 1))}…`;
      break;
    }
    acc = next;
  }
  const done = acc.trim();
  const longer = t.length > done.length || words.length > maxWords;
  return longer ? `${done}…` : done;
}

/**
 * عنوان ومعاينة للعرض من جلسة محفوظة (يدعم بيانات قديمة).
 * @param {{ title?: string, preview?: string, messages?: Array<{ role: string, text?: string, imageAttachments?: unknown[], fileNames?: string[] }> }} chat
 */
export function getHistoryTitleAndPreview(chat, labels) {
  const L = resolveHistoryLabels(labels);
  const msgs = chat.messages;
  const firstUser = msgs?.find((m) => m.role === "user");
  const firstUserText =
    firstUser?.text ?? (typeof firstUser?.content === "string" ? firstUser.content : "");
  let title = "";
  if (firstUserText?.trim()) {
    title = summarizeToTitle(firstUserText);
  } else if (firstUser?.imageAttachments?.length) {
    title = L.image;
  } else if (firstUser?.fileNames?.length) {
    title = L.file;
  } else {
    title = chat.title ? summarizeToTitle(String(chat.title)) : L.chat;
  }

  let preview = "";

  if (msgs?.length === 1 && firstUserText?.trim()) {
    const words = collapseSpaces(firstUserText).split(" ");
    if (words.length > HISTORY_TITLE_WORDS) {
      preview = summarizeToPreview(words.slice(HISTORY_TITLE_WORDS).join(" "));
    }
  } else {
    const last = msgs?.length ? msgs[msgs.length - 1] : null;
    const lastText = previewTextFromMessage(last);
    if (lastText?.trim()) {
      preview = summarizeToPreview(lastText);
    } else if (last?.imageAttachments?.length) {
      preview = L.image;
    } else if (last?.fileNames?.length) {
      preview = L.attachments;
    } else if (chat.preview) {
      preview = summarizeToPreview(String(chat.preview));
    }
  }

  if (preview && title && preview === title) preview = "";

  return { title, preview };
}

/** عنوان سطر واحد للعرض في الشريط الجانبي (قائمة فقط، بدون معاينة ثانية). */
export function getHistoryListTitle(chat, labels) {
  const L = resolveHistoryLabels(labels);
  const msgs = chat.messages;
  const firstUser = msgs?.find((m) => m.role === "user");
  const firstUserText =
    firstUser?.text ?? (typeof firstUser?.content === "string" ? firstUser.content : "");
  if (firstUserText?.trim()) return summarizeToTitle(firstUserText);
  if (firstUser?.imageAttachments?.length) return L.image;
  if (firstUser?.fileNames?.length) return L.file;
  if (chat.title) return summarizeToTitle(String(chat.title));
  return L.chat;
}

/**
 * @param {Array<{ id: string, role: string, text?: string, fileNames?: string[], imageAttachments?: { name: string, dataUrl: string }[] }>} messages
 * @param {string | null} existingId
 */
export function buildSessionFromMessages(messages, existingId = null, metadata = {}) {
  const firstUser = messages.find((m) => m.role === "user");
  const firstUserText =
    firstUser?.text ?? (typeof firstUser?.content === "string" ? firstUser.content : "");
  const title =
    (firstUserText?.trim() && summarizeToTitle(firstUserText)) ||
    (firstUser?.imageAttachments?.length ? "صورة" : null) ||
    (firstUser?.fileNames?.length ? "ملف" : null) ||
    "محادثة";

  let preview = "";
  if (messages.length === 1 && firstUserText?.trim()) {
    const words = collapseSpaces(firstUserText).split(" ");
    if (words.length > HISTORY_TITLE_WORDS) preview = summarizeToPreview(words.slice(HISTORY_TITLE_WORDS).join(" "));
  } else {
    const last = messages[messages.length - 1];
    const lastText = previewTextFromMessage(last);
    const previewRaw =
      lastText?.trim() ||
      (last?.imageAttachments?.length ? "صورة" : null) ||
      (last?.fileNames?.length ? "مرفقات" : null) ||
      "";
    preview =
      previewRaw && typeof previewRaw === "string" && previewRaw !== "صورة" && previewRaw !== "مرفقات"
        ? summarizeToPreview(previewRaw)
        : previewRaw || "";
  }
  const updatedAt = new Date().toISOString();
  return {
    id: existingId || crypto.randomUUID(),
    title,
    preview,
    type: "شات عام",
    modeKey: metadata.modeKey || "general",
    time: formatRelativeTime(updatedAt),
    updatedAt,
    messages: JSON.parse(JSON.stringify(messages)),
  };
}
