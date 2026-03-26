import React, { useState } from "react";
import { AlertCircle, BookOpen, NotebookPen, Search } from "lucide-react";
import { Card, CardBody } from "../components/ui/Card";
import { SectionTitle } from "../components/layout/SectionTitle";
import { Tabs } from "../components/ui/Tabs";
import { cn } from "../lib/cn";

export function SubjectPage({ subject, lessons, uploadedFiles, setPage, setSelectedLesson }) {
  const [tab, setTab] = useState("نظرة عامة");
  const tabs = ["نظرة عامة", "الدروس", "محادثات المادة", "ملفات المادة", "مراجعة المادة"];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card className="overflow-hidden">
        <div className={cn("border-b p-6 md:p-8", subject.accent.soft, subject.accent.border)}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[11px] font-medium text-zinc-700 backdrop-blur">
                <span className={cn("h-2.5 w-2.5 rounded-full", subject.accent.solid)} />
                مادة نشطة
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">{subject.name}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-700">{subject.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-2xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white" onClick={() => setPage("chat")}>
                ابدأ محادثة داخل المادة
              </button>
              <button className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700">
                محادثة متعددة الدروس
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {[
              { label: "التقدم", value: `${subject.progress}%` },
              { label: "الدروس", value: String(subject.lessons) },
              { label: "محادثات المادة", value: String(subject.chats) },
              { label: "الملفات", value: String(subject.files) },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/70 bg-white/80 p-4 backdrop-blur">
                <div className="text-xs text-zinc-500">{item.label}</div>
                <div className="mt-2 text-2xl font-semibold text-zinc-950">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <CardBody className="py-4">
          <Tabs value={tab} onChange={setTab} items={tabs} />
        </CardBody>
      </Card>

      {tab === "نظرة عامة" && (
        <div className="grid gap-6 xl:grid-cols-[1.2fr,1fr]">
          <Card>
            <CardBody>
              <SectionTitle title="آخر درس تمت دراسته" />
              <div className="rounded-3xl border border-zinc-200 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <div className={cn("rounded-2xl p-2", subject.accent.soft)}>
                    <NotebookPen className={cn("h-4 w-4", subject.accent.text)} />
                  </div>
                  <h4 className="font-medium text-zinc-900">{lessons[0]?.title || "لا يوجد"}</h4>
                </div>
                <p className="text-sm leading-7 text-zinc-600">{lessons[0]?.desc || "ابدأ أول درس داخل هذه المادة."}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    className="rounded-2xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
                    onClick={() => {
                      if (lessons[0]?.id) setSelectedLesson(lessons[0].id);
                      setPage("lesson");
                    }}
                  >
                    فتح الدرس
                  </button>
                  <button className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700" onClick={() => setPage("chat")}>
                    ابدأ محادثة
                  </button>
                </div>
              </div>
              <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                <div className="mb-1 flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4" />
                  حدود ذكية للمادة
                </div>
                أنت الآن داخل مادة {subject.name}. إذا طرحت سؤالًا عن مادة أخرى، ستحصل على تنبيه لطيف يوجّهك إلى المادة الصحيحة أو إلى الشات العام.
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <SectionTitle title="اقتراحات المراجعة" />
              <div className="space-y-3">
                {["راجع الدوال الأساسية قبل بدء الوحدة التالية.", "لديك درسان يحتاجان مراجعة خلال 48 ساعة.", "ابدأ جلسة متعددة الدروس للاستعداد للاختبار القصير."].map((i) => (
                  <div key={i} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
                    {i}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {tab === "الدروس" && (
        <Card>
          <CardBody>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <SectionTitle title="دروس المادة" />
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 px-3 py-2 text-xs text-zinc-600">
                  <Search className="h-4 w-4" />
                  ابحث داخل الدروس
                </div>
                {["الكل", "غير المكتمل", "الأكثر استخدامًا", "يحتاج مراجعة"].map((f) => (
                  <button key={f} className="rounded-full bg-zinc-100 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-200">
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="rounded-3xl border border-zinc-200 p-4 transition hover:bg-zinc-50">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", subject.accent.soft)}>
                      <BookOpen className={cn("h-5 w-5", subject.accent.text)} />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="font-medium text-zinc-900">{lesson.title}</h4>
                        {lesson.review ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">يحتاج مراجعة</span> : null}
                      </div>
                      <p className="text-sm leading-7 text-zinc-600">{lesson.desc}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                        <span>الإتقان: {lesson.mastery}%</span>
                        <span>محادثات: {lesson.chats}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setSelectedLesson(lesson.id);
                          setPage("lesson");
                        }}
                        className="rounded-2xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
                      >
                        افتح الدرس
                      </button>
                      <button className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700" onClick={() => setPage("chat")}>
                        ابدأ محادثة
                      </button>
                      <button className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700">راجع الدرس</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {tab === "ملفات المادة" && (
        <Card>
          <CardBody>
            <SectionTitle title="ملفات المادة" />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {uploadedFiles
                .filter((f) => f.subject === subject.name)
                .map((f) => (
                  <div key={f.id} className="rounded-3xl border border-zinc-200 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-2xl bg-zinc-100 p-2">PDF</div>
                      <span className="text-[11px] text-zinc-500">{f.time}</span>
                    </div>
                    <div className="text-sm font-medium text-zinc-900">{f.name}</div>
                    <div className="mt-1 text-xs text-zinc-500">{f.type}</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="rounded-2xl border border-zinc-200 px-3 py-2 text-xs text-zinc-700">استخدمه في المحادثة</button>
                      <button className="rounded-2xl border border-zinc-200 px-3 py-2 text-xs text-zinc-700">لخّص الملف</button>
                    </div>
                  </div>
                ))}
            </div>
          </CardBody>
        </Card>
      )}

      {tab === "مراجعة المادة" && (
        <Card>
          <CardBody>
            <SectionTitle title="محادثة متعددة الدروس" />
            <div className="grid gap-6 xl:grid-cols-[1fr,1.2fr]">
              <div>
                <div className="mb-3 text-sm font-medium text-zinc-900">اختر الدروس</div>
                <div className="space-y-2">
                  {lessons.slice(0, 4).map((lesson) => (
                    <label key={lesson.id} className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-3">
                      <input type="checkbox" defaultChecked={lesson.id !== lessons[3]?.id} className="h-4 w-4 rounded border-zinc-300" />
                      <span className="text-sm text-zinc-800">{lesson.title}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  {lessons.slice(0, 3).map((l) => (
                    <span key={l.id} className={cn("rounded-full px-3 py-1.5 text-[11px] font-medium", subject.accent.soft, subject.accent.text)}>
                      {l.title}
                    </span>
                  ))}
                </div>
                <p className="text-sm leading-7 text-zinc-700">
                  هذه المحادثة ستدمج عدة دروس من نفس المادة فقط، وهي مثالية للمراجعة قبل الاختبار، مع الحفاظ على حدود المادة وعدم خلطها بمواد أخرى.
                </p>
                <button className="mt-4 rounded-2xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white" onClick={() => setPage("chat")}>
                  ابدأ محادثة موحدة
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

