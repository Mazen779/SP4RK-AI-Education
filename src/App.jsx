import React, { useMemo, useState } from "react";
import { BarChart3, CheckSquare, Folder, History, LayoutGrid, Library, MessageSquare, Settings, Star, Zap } from "lucide-react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import {
  aiModes,
  bookLibrary,
  chatMessages,
  lessonsBySubject,
  quickPrompts,
  recentChats,
  reviewSessions,
  subjects,
  uploadedFiles,
} from "./data/mockData";
import { HomePage } from "./pages/Home";
import { SubjectPage } from "./pages/Subject";
import { LessonPage } from "./pages/Lesson";
import { ChatPage } from "./pages/Chat";
import { LibraryPage } from "./pages/Library";
import { ProgressPage } from "./pages/Progress";
import { SettingsPage } from "./pages/Settings";

export default function App() {
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("math");
  const currentSubject = useMemo(() => subjects.find((s) => s.id === selectedSubject) || subjects[0], [selectedSubject]);
  const [selectedLesson, setSelectedLesson] = useState("m1");
  const currentLesson = useMemo(() => {
    const list = lessonsBySubject[selectedSubject] || [];
    return list.find((l) => l.id === selectedLesson) || list[0] || { title: 'درس جديد', desc: 'ابدأ من هنا', mastery: 0 };
  }, [selectedSubject, selectedLesson]);

  const navItems = [
    { key: "home", label: "الشات العام", icon: MessageSquare, route: "home" },
    { key: "library", label: "مكتبة الكتب", icon: Library, route: "library" },
    { key: "files", label: "الملفات", icon: Folder, badge: "3", route: "chat" },
    { key: "chat", label: "المحادثات", icon: LayoutGrid, route: "chat" },
    { key: "favorites", label: "المفضلة", icon: Star, route: "chat" },
    { key: "review", label: "المراجعة السريعة", icon: Zap, route: "chat" },
    { key: "history", label: "السجل", icon: History, route: "chat" },
    { key: "tasks", label: "المهام", icon: CheckSquare, badge: "5", route: "chat" },
    { key: "progress", label: "التقدم", icon: BarChart3, route: "progress" },
    { key: "settings", label: "الإعدادات", icon: Settings, route: "settings" },
  ];

  let title = 'الرئيسية';
  if (page === 'subject') title = currentSubject.name;
  if (page === 'lesson') title = currentLesson.title;
  if (page === 'chat') title = 'المحادثات';
  if (page === 'library') title = 'المكتبة';
  if (page === 'progress') title = 'التقدم';
  if (page === 'settings') title = 'الإعدادات';

  return (
    <div dir="rtl" className="min-h-screen bg-[#fafaf8] text-zinc-900 antialiased">
      <div className="flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          navItems={navItems}
          page={page}
          setPage={setPage}
          subjects={subjects}
          recentChats={recentChats}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          setSelectedLesson={setSelectedLesson}
          lessonsBySubject={lessonsBySubject}
        />

        <div className="min-w-0 flex-1">
          <TopBar title={title} onToggleSidebar={() => setSidebarOpen(true)} />

          {page === "home" && (
            <HomePage
              subjects={subjects}
              quickPrompts={quickPrompts}
              reviewSessions={reviewSessions}
              uploadedFiles={uploadedFiles}
              recentChats={recentChats}
              setPage={setPage}
              setSelectedSubject={setSelectedSubject}
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
          {page === "chat" && <ChatPage aiModes={aiModes} recentChats={recentChats} chatMessages={chatMessages} />}
          {page === "library" && <LibraryPage bookLibrary={bookLibrary} />}
          {page === "progress" && <ProgressPage subjects={subjects} />}
          {page === "settings" && <SettingsPage />}
        </div>
      </div>
    </div>
  );
}
