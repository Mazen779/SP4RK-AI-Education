import React from "react";
import { AlertCircle, Bolt, Brain, CalendarClock, ChartLine, CheckCircle2, Clock3, Flame, GraduationCap, Lightbulb, Target } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/cn";

function PanelSection({ title, children }) {
  return (
    <Card className="border-zinc-200/90 bg-white/95">
      <CardBody className="space-y-3 p-4">
        <h4 className="text-xs font-semibold tracking-wide text-zinc-500">{title}</h4>
        {children}
      </CardBody>
    </Card>
  );
}

export function ContextPanel({ page, subject, lesson, uploadedFiles }) {
  const sectionsByPage = {
    home: (
      <>
        <PanelSection title="AI Focus">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-900">
              <Lightbulb className="h-4 w-4 text-zinc-700" />
              اقتراح اليوم
            </div>
            <p className="text-xs leading-6 text-zinc-600">ابدأ جلسة مراجعة 15 دقيقة في الدوال الأساسية ثم اختبر نفسك بسؤالين.</p>
          </div>
          <button className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50">ابدأ الآن</button>
        </PanelSection>

        <PanelSection title="Study Streak">
          <div className="flex items-center justify-between rounded-2xl border border-zinc-200 p-3">
            <div>
              <p className="text-xs text-zinc-500">الاستمرارية</p>
              <p className="mt-1 text-xl font-semibold text-zinc-900">12 يوم</p>
            </div>
            <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={cn("h-2 rounded-full", i < 5 ? "bg-zinc-900" : "bg-zinc-200")} />
            ))}
          </div>
        </PanelSection>
      </>
    ),
    subject: (
      <>
        <PanelSection title="Subject Scope">
          <Badge className={cn(subject?.accent.soft, subject?.accent.text)}>داخل مادة {subject?.name}</Badge>
          <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-6 text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            أي سؤال خارج المادة سيتم توجيهه بلطف للشات العام أو المادة المناسبة.
          </div>
        </PanelSection>
        <PanelSection title="Quick Review">
          {["بطاقات سريعة", "اختبار قصير", "تلخيص الوحدة"].map((item) => (
            <button key={item} className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-right text-xs font-medium text-zinc-700 hover:bg-zinc-50">
              {item}
            </button>
          ))}
        </PanelSection>
      </>
    ),
    lesson: (
      <>
        <PanelSection title="Lesson Objectives">
          {["فهم المفهوم", "حل تدريجي", "تطبيق ذكي"].map((goal) => (
            <div key={goal} className="flex items-center gap-2 rounded-xl border border-zinc-200 p-2 text-xs text-zinc-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" />
              {goal}
            </div>
          ))}
        </PanelSection>
        <PanelSection title="Scope Hint">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs leading-6 text-zinc-700">
            المحادثة مرتبطة بالدرس <span className="font-semibold text-zinc-900">{lesson?.title}</span> ضمن مادة{" "}
            <span className="font-semibold text-zinc-900">{subject?.name}</span>.
          </div>
        </PanelSection>
      </>
    ),
    library: (
      <>
        <PanelSection title="Resource Filters">
          {["كتب أساسية", "مراجعات سريعة", "ملفات مرفوعة"].map((item) => (
            <button key={item} className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-right text-xs font-medium text-zinc-700 hover:bg-zinc-50">
              {item}
            </button>
          ))}
        </PanelSection>
        <PanelSection title="Today Plan">
          <div className="flex items-center gap-2 text-xs text-zinc-700">
            <CalendarClock className="h-4 w-4 text-zinc-500" />
            قراءة 20 دقيقة + محادثة تلخيص
          </div>
        </PanelSection>
      </>
    ),
    progress: (
      <>
        <PanelSection title="Performance Insights">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 p-2 text-xs text-zinc-700">
            <ChartLine className="h-4 w-4 text-zinc-500" />
            تقدم ثابت خلال آخر أسبوع
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 p-2 text-xs text-zinc-700">
            <Target className="h-4 w-4 text-zinc-500" />
            أولوية اليوم: الدوال الأساسية
          </div>
        </PanelSection>
        <PanelSection title="AI Recommendations">
          <div className="flex items-center gap-2 text-xs text-zinc-700">
            <Brain className="h-4 w-4 text-zinc-500" />
            اختبر نفسك بعد كل جلسة تعلم
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-700">
            <Clock3 className="h-4 w-4 text-zinc-500" />
            جلسات قصيرة متكررة أفضل من جلسة طويلة
          </div>
        </PanelSection>
      </>
    ),
    settings: (
      <>
        <PanelSection title="Account Health">
          <div className="flex items-center gap-2 text-xs text-zinc-700">
            <GraduationCap className="h-4 w-4 text-zinc-500" />
            الملف الدراسي مكتمل بنسبة 84%
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-700">
            <Bolt className="h-4 w-4 text-zinc-500" />
            فعّل اختصارات لوحة المفاتيح للإنتاجية
          </div>
        </PanelSection>
      </>
    ),
  };

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-[300px] shrink-0 space-y-3 overflow-auto lg:block">
      {sectionsByPage[page] ?? null}
    </aside>
  );
}

