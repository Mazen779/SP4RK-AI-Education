import React from "react";
import { BookOpen, FileText, MessageSquare, Sparkles } from "lucide-react";
import { Card, CardBody } from "../components/ui/Card";
import { SectionTitle } from "../components/layout/SectionTitle";
import { cn } from "../lib/cn";
import { PromptComposer } from "../components/chat/PromptComposer";

export function HomePage({
  subjects,
  quickPrompts,
  reviewSessions,
  uploadedFiles,
  recentChats,
  setPage,
  setSelectedSubject,
}) {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card className="overflow-hidden border-zinc-200 bg-[radial-gradient(circle_at_top_right,_rgba(0,0,0,0.04),_transparent_30%),linear-gradient(to_bottom,_white,_#fafafa)]">
        <CardBody className="p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-medium text-zinc-700">
                <Sparkles className="h-3.5 w-3.5" />
                تجربة تعليمية ذكية ومركزة
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 md:text-4xl">مرحبًا عبد الهادي، ماذا تريد أن تتعلم اليوم؟</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600 md:text-[15px]">
                منصة تعليمية حديثة تركّز على الفهم، المراجعة، والتدريب الذكي. ابدأ سؤالًا عامًا، ادخل مادة محددة، أو راجع درسًا بذكاء اصطناعي يعتمد على مصادر المادة.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:w-[320px]">
              <div className="rounded-3xl border border-zinc-200 bg-white p-4">
                <div className="text-xs text-zinc-500">جلسات هذا الأسبوع</div>
                <div className="mt-2 text-2xl font-semibold text-zinc-950">18</div>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-white p-4">
                <div className="text-xs text-zinc-500">الدروس النشطة</div>
                <div className="mt-2 text-2xl font-semibold text-zinc-950">7</div>
              </div>
            </div>
          </div>

          <PromptComposer />

          <div className="mt-4 flex flex-wrap gap-2">
            {quickPrompts.map((p) => (
              <button key={p} className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50">
                {p}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
        <Card>
          <CardBody>
            <SectionTitle title="أكمل من حيث توقفت" action="عرض الكل" />
            <div className="grid gap-3">
              {[subjects[0], subjects[1], subjects[3]].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSubject(s.id);
                    setPage("subject");
                  }}
                  className="flex items-center gap-4 rounded-3xl border border-zinc-200 p-4 text-right transition hover:bg-zinc-50"
                >
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", s.accent.soft)}>
                    <BookOpen className={cn("h-5 w-5", s.accent.text)} />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <p className="font-medium text-zinc-900">{s.name}</p>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", s.accent.soft, s.accent.text)}>{s.progress}%</span>
                    </div>
                    <p className="text-sm text-zinc-500">آخر نشاط: مراجعة سريعة + محادثة مرتبطة بالوحدة الحالية</p>
                    <div className="mt-3 h-2 rounded-full bg-zinc-100">
                      <div className={cn("h-2 rounded-full", s.accent.solid)} style={{ width: `${s.progress}%` }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <SectionTitle title="اقتراحات الذكاء الاصطناعي" />
            <div className="space-y-3">
              {[
                "يبدو أنك تحتاج مراجعة إضافية في الدوال الأساسية قبل الاختبار القادم.",
                "لديك ملف رياضيات جديد، هل تريد تلخيصه واستخراج الأسئلة منه؟",
                "آخر أداء قوي لك كان في القراءة التحليلية. هل نوسّع التدريب؟",
              ].map((tip, i) => (
                <div key={i} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-700">
                    <Sparkles className="h-4 w-4" />
                    اقتراح ذكي
                  </div>
                  <p className="text-sm leading-7 text-zinc-700">{tip}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,1fr,1fr]">
        <Card>
          <CardBody>
            <SectionTitle title="موادك" action="إدارة العرض" />
            <div className="grid gap-3 md:grid-cols-2">
              {subjects.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSubject(s.id);
                    setPage("subject");
                  }}
                  className="rounded-3xl border border-zinc-200 p-4 text-right hover:bg-zinc-50"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className={cn("rounded-2xl px-3 py-1 text-xs font-medium", s.accent.soft, s.accent.text)}>{s.name}</div>
                    <span className={cn("h-2.5 w-2.5 rounded-full", s.accent.solid)} />
                  </div>
                  <p className="mb-4 text-sm leading-7 text-zinc-600">{s.description}</p>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{s.lessons} درس</span>
                    <span>{s.chats} محادثة</span>
                    <span>{s.files} ملف</span>
                  </div>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <SectionTitle title="آخر المحادثات" action="فتح صفحة المحادثات" />
            <div className="space-y-3">
              {recentChats.map((c) => (
                <button key={c.id} onClick={() => setPage("chat")} className="flex w-full items-start gap-3 rounded-3xl border border-zinc-200 p-3 text-right hover:bg-zinc-50">
                  <div className="mt-0.5 rounded-2xl bg-zinc-100 p-2">
                    <MessageSquare className="h-4 w-4 text-zinc-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900">{c.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {c.type} · {c.time}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <SectionTitle title="جلسات المراجعة الأخيرة" />
            <div className="space-y-3">
              {reviewSessions.map((r, i) => (
                <div key={i} className="rounded-3xl border border-zinc-200 p-4">
                  <div className="mb-1 text-sm font-medium text-zinc-900">{r.title}</div>
                  <div className="text-xs text-zinc-500">{r.meta}</div>
                  <div className="mt-3 inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-700">{r.score}</div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <Card>
          <CardBody>
            <SectionTitle title="آخر الملفات المرفوعة" action="فتح الملفات" />
            <div className="space-y-3">
              {uploadedFiles.map((f) => (
                <div key={f.id} className="flex items-center gap-3 rounded-3xl border border-zinc-200 p-3">
                  <div className="rounded-2xl bg-zinc-100 p-2.5">
                    <FileText className="h-4 w-4 text-zinc-700" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-zinc-900">{f.name}</div>
                    <div className="text-xs text-zinc-500">
                      {f.subject} · {f.type} · {f.time}
                    </div>
                  </div>
                  <button className="rounded-2xl border border-zinc-200 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50">استخدمه</button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <SectionTitle title="حالات الواجهة" />
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-3xl border border-dashed border-zinc-200 p-4">
                <div className="mb-2 text-xs font-medium text-zinc-500">Empty state</div>
                <div className="rounded-2xl bg-zinc-50 p-4 text-center text-sm text-zinc-500">لا توجد محادثات محفوظة لهذه المادة بعد</div>
              </div>
              <div className="rounded-3xl border border-dashed border-zinc-200 p-4">
                <div className="mb-2 text-xs font-medium text-zinc-500">Loading state</div>
                <div className="space-y-2">
                  <div className="h-4 animate-pulse rounded-full bg-zinc-100" />
                  <div className="h-4 w-4/5 animate-pulse rounded-full bg-zinc-100" />
                  <div className="h-16 animate-pulse rounded-2xl bg-zinc-100" />
                </div>
              </div>
              <div className="rounded-3xl border border-dashed border-zinc-200 p-4">
                <div className="mb-2 text-xs font-medium text-zinc-500">Quick actions</div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-[11px]">/new-chat</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-[11px]">/review</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-[11px]">/quiz</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

