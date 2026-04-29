import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, CalendarDays, Gamepad2, Home, LayoutGrid, Library, ListTodo, Upload } from "lucide-react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { ContextPanel } from "./components/panels/ContextPanel";
import { useLocale } from "./lib/locale.jsx";
import { buildSessionFromMessages, loadChatHistory, saveChatHistory } from "./lib/chatHistoryStorage";
import {
  bookLibrary,
  chatMessages,
  lessonsBySubject,
  recentChats,
  subjects,
  uploadedFiles,
} from "./data/mockData";
import { HomePage } from "./pages/Home";
import { SubjectPage } from "./pages/Subject";
import { LessonPage } from "./pages/Lesson";
import { ChatPage } from "./pages/Chat";
import { LibraryPage } from "./pages/Library";
import { LessonMaterialsUploadPage } from "./pages/LessonMaterialsUpload";
import AdminUpload from "./pages/AdminUpload";
import { ProgressPage } from "./pages/Progress";
import { SettingsPage } from "./pages/Settings";

export default function App() {
  if (typeof window !== "undefined" && window.location.pathname === "/admin/upload") {
    return <AdminUpload />;
  }

  const { dir, t, locale } = useLocale();
  const [page, setPage] = useState("home");
  const [chatSessionKey, setChatSessionKey] = useState(0);
  const [activeChatMode, setActiveChatMode] = useState("general");
  const [chatHistory, setChatHistory] = useState(() => loadChatHistory());
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const activeChatMessagesRef = useRef([]);
  const activeSessionIdRef = useRef(null);
  const prevPageRef = useRef(page);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transitioningToChat, setTransitioningToChat] = useState(false);

  useEffect(() => {
    activeChatMessagesRef.current = activeChatMessages;
  }, [activeChatMessages]);
  useEffect(() => {
    activeSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  const persistCurrentSession = useCallback(() => {
    const msgs = activeChatMessagesRef.current;
    if (!msgs.length) return;
    const session = buildSessionFromMessages(msgs, activeSessionIdRef.current, {
      modeKey: activeChatMode,
    });
    setChatHistory((h) => {
      const idx = h.findIndex((s) => s.id === session.id);
      let next;
      if (idx >= 0) {
        next = [...h];
        next[idx] = session;
      } else {
        next = [session, ...h].slice(0, 80);
      }
      saveChatHistory(next);
      return next;
    });
  }, [activeChatMode]);

  function onNewChat() {
    persistCurrentSession();
    setActiveChatMessages([]);
    setActiveSessionId(null);
    setChatSessionKey((k) => k + 1);
    setPage("chat");
  }

  function onOpenSavedChat(session) {
    persistCurrentSession();
    setActiveChatMode(session.modeKey || "general");
    setActiveChatMessages(session.messages || []);
    setActiveSessionId(session.id);
    setChatSessionKey((k) => k + 1);
    setPage("chat");
  }

  function onSelectChatMode(mode) {
    persistCurrentSession();
    setActiveChatMode(mode);
    if (mode !== "general") {
      setSelectedSubject(mode);
      setSelectedLesson((lessonsBySubject[mode] || [])[0]?.id);
      const latest = chatHistory.find((s) => (s.modeKey || "general") === mode);
      setActiveChatMessages(latest?.messages || []);
      setActiveSessionId(latest?.id || null);
    } else {
      setActiveChatMessages([]);
      setActiveSessionId(null);
    }
    setChatSessionKey((k) => k + 1);
    setPage("chat");
  }

  function onDeleteSavedChat(sessionId) {
    setChatHistory((h) => {
      const next = h.filter((s) => s.id !== sessionId);
      saveChatHistory(next);
      return next;
    });
    if (activeSessionIdRef.current === sessionId) {
      setActiveChatMessages([]);
      setActiveSessionId(null);
      setChatSessionKey((k) => k + 1);
    }
  }

  useEffect(() => {
    if (prevPageRef.current === "chat" && page !== "chat") {
      persistCurrentSession();
      setActiveChatMessages([]);
      setActiveSessionId(null);
      setChatSessionKey((k) => k + 1);
    }
    prevPageRef.current = page;
  }, [page, persistCurrentSession]);

  const [selectedSubject, setSelectedSubject] = useState("math");
  const currentSubject = useMemo(() => subjects.find((s) => s.id === selectedSubject) || subjects[0], [selectedSubject]);
  const [selectedLesson, setSelectedLesson] = useState("m1");
  const currentLesson = useMemo(() => {
    const list = lessonsBySubject[selectedSubject] || [];
    return list.find((l) => l.id === selectedLesson) || list[0] || { title: 'درس جديد', desc: 'ابدأ من هنا', mastery: 0 };
  }, [selectedSubject, selectedLesson]);

  const navItems = useMemo(
    () => [
      { key: "home", label: t.nav.home, icon: Home, route: "home" },
      { key: "subjects", label: t.nav.subjects, icon: LayoutGrid, route: "subject", expandable: true },
      { key: "tasks", label: t.nav.tasks, icon: ListTodo, route: "chat" },
      { key: "library", label: t.nav.library, icon: Library, route: "library" },
      {
        key: "materialsUpload",
        label: locale === "en" ? "Lesson Materials Upload" : "رفع مواد الدرس",
        icon: Upload,
        route: "materialsUpload",
      },
      { key: "progress", label: t.nav.progress, icon: BarChart3, route: "progress" },
      { key: "studyPlan", label: t.nav.studyPlan, icon: CalendarDays, route: "progress" },
      { key: "joinGame", label: t.nav.joinGame, icon: Gamepad2, route: "chat" },
    ],
    [t, locale]
  );

  const isChatVariant = page === "chat" || transitioningToChat;
  const scopedChatHistory = useMemo(
    () => chatHistory.filter((s) => (s.modeKey || "general") === activeChatMode),
    [chatHistory, activeChatMode]
  );
  const chatModeLabel = useMemo(() => {
    if (activeChatMode === "math") return locale === "en" ? "Math mode" : "وضع الرياضيات";
    if (activeChatMode === "science") return locale === "en" ? "Science mode" : "وضع العلوم";
    if (activeChatMode === "english") return locale === "en" ? "English mode" : "وضع الإنجليزية";
    return locale === "en" ? "General mode" : "وضع عام";
  }, [activeChatMode, locale]);

  function enterChatFromHome() {
    setTransitioningToChat(false);
    setPage("chat");
  }

  const title = useMemo(() => {
    if (page === "subject") return currentSubject.name;
    if (page === "lesson") return currentLesson.title;
    if (page === "home") return t.titles.home;
    if (page === "chat") return `${t.titles.chat} · ${chatModeLabel}`;
    if (page === "library") return t.titles.library;
    if (page === "materialsUpload") return locale === "en" ? "Lesson Materials Upload" : "رفع مواد الدرس";
    if (page === "progress") return t.titles.progress;
    if (page === "settings") return t.titles.settings;
    return t.titles.home;
  }, [page, currentSubject.name, currentLesson.title, t, chatModeLabel, locale]);

  function handleToggleSidebar() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setSidebarCollapsed((v) => !v);
      return;
    }
    setSidebarOpen((v) => !v);
  }

  const pageTransition = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.24, ease: "easeInOut" },
    },
  };

  return (
    <div dir={dir} className="min-h-screen bg-[#fafaf8] text-zinc-900 antialiased">
      <div className="flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          collapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          navItems={navItems}
          page={page}
          setPage={setPage}
          onNewChat={onNewChat}
          variant={isChatVariant ? "chat" : "default"}
          onBack={() => setPage("home")}
          subjects={subjects}
          savedChats={scopedChatHistory}
          onOpenSavedChat={onOpenSavedChat}
          onDeleteSavedChat={onDeleteSavedChat}
          activeChatMode={activeChatMode}
          onSelectChatMode={onSelectChatMode}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          setSelectedLesson={setSelectedLesson}
          lessonsBySubject={lessonsBySubject}
        />

        <div
          className={
            page === "home"
              ? "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden h-svh transition-[padding] duration-300 lg:ps-[280px]"
              : page === "chat"
                ? "flex h-svh min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[var(--spark-chat-canvas)] transition-[padding] duration-300 lg:ps-[280px]"
                : "min-w-0 flex-1 transition-[padding] duration-300 lg:ps-[280px]"
          }
          style={{ paddingInlineStart: sidebarCollapsed ? 0 : undefined }}
        >
          <TopBar
            title={title}
            onToggleSidebar={handleToggleSidebar}
            sidebarCollapsed={sidebarCollapsed}
            variant={page === "chat" ? "chat" : "default"}
          />
          <div
            className={
              page === "home"
                ? "mx-auto flex min-h-0 w-full max-w-[1700px] flex-1 gap-6 overflow-hidden px-3 pb-3 pt-2 md:px-5 md:pb-4"
                : page === "chat"
                  ? "mx-auto flex min-h-0 w-full max-w-[1700px] flex-1 flex-col overflow-hidden px-0 pb-0 pt-0"
                  : "mx-auto flex w-full max-w-[1700px] gap-6 px-3 pb-4 pt-4 md:px-5"
            }
          >
            {/* Hide context panel on Home + Chat so main content uses full width */}
            {page !== "home" && page !== "chat" ? (
              <ContextPanel page={page} subject={currentSubject} lesson={currentLesson} uploadedFiles={uploadedFiles} />
            ) : null}
            <main
              className={
                page === "home"
                  ? "relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
                  : page === "chat"
                    ? "relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[var(--spark-chat-canvas)]"
                    : "relative min-w-0 flex-1"
              }
            >
              {/* Home → Chat premium transition overlay */}
              {transitioningToChat ? (
                <div className="pointer-events-none absolute inset-0 z-30 rounded-[28px] bg-white/40 backdrop-blur-sm will-change-transform" />
              ) : null}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={page}
                  initial={pageTransition.initial}
                  animate={pageTransition.animate}
                  exit={pageTransition.exit}
                  className="min-h-0 flex-1"
                >
                  {page === "home" && (
                    <HomePage
                      subjects={subjects}
                      recentChats={recentChats}
                      setPage={setPage}
                      setSelectedSubject={setSelectedSubject}
                      setSelectedLesson={setSelectedLesson}
                      lessonsBySubject={lessonsBySubject}
                      onEnterChat={enterChatFromHome}
                    />
                  )}
                  {page === "subject" && (
                    <SubjectPage
                      subject={currentSubject}
                      lessons={lessonsBySubject[selectedSubject] || []}
                      uploadedFiles={uploadedFiles}
                      setPage={setPage}
                      setSelectedLesson={setSelectedLesson}
                    />
                  )}
                  {page === "lesson" && (
                    <LessonPage
                      subject={currentSubject}
                      lesson={currentLesson}
                      chatMessages={chatMessages}
                      uploadedFiles={uploadedFiles}
                    />
                  )}
                  {page === "chat" && (
                    <ChatPage
                      key={chatSessionKey}
                      messages={activeChatMessages}
                      onMessagesChange={setActiveChatMessages}
                  chatMode={activeChatMode}
                  chatModeLabel={chatModeLabel}
                    />
                  )}
                  {page === "library" && <LibraryPage bookLibrary={bookLibrary} />}
                  {page === "materialsUpload" && <LessonMaterialsUploadPage />}
                  {page === "progress" && <ProgressPage subjects={subjects} />}
                  {page === "settings" && <SettingsPage />}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
