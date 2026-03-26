import React from "react";
import { Card, CardBody } from "../components/ui/Card";
import { SectionTitle } from "../components/layout/SectionTitle";
import { cn } from "../lib/cn";

export function ProgressPage({ subjects }) {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr,1fr]">
        <Card>
          <CardBody>
            <SectionTitle title="التقدم في المواد" />
            <div className="space-y-4">
              {subjects.map((s) => (
                <div key={s.id} className="rounded-3xl border border-zinc-200 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2.5 w-2.5 rounded-full", s.accent.solid)} />
                      <span className="text-sm font-medium text-zinc-900">{s.name}</span>
                    </div>
                    <span className="text-sm text-zinc-500">{s.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-100">
                    <div className={cn("h-2 rounded-full", s.accent.solid)} style={{ width: `${s.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <SectionTitle title="نظرة ذكية" />
            <div className="space-y-3">
              {[
                ["نقطة قوة", "أداؤك في القراءة التحليلية ممتاز ومستقر."],
                ["يحتاج مراجعة", "الدوال الأساسية ما زالت تحتاج تمارين إضافية."],
                ["اقتراح", "خصص 20 دقيقة يوميًا للمراجعة المتكررة القصيرة."],
              ].map(([k, v]) => (
                <div key={k} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="mb-1 text-xs font-medium text-zinc-500">{k}</div>
                  <div className="text-sm leading-7 text-zinc-800">{v}</div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["أكثر الدروس استخدامًا", "حل المعادلات الخطية"],
          ["آخر جلسات المراجعة", "مراجعة متعددة الدروس · الرياضيات"],
          ["اقتراحات تحسين الدراسة", "خفف الجلسات الطويلة وزد الجلسات القصيرة المتكررة"],
        ].map(([t, v]) => (
          <Card key={t}>
            <CardBody>
              <SectionTitle title={t} />
              <div className="text-sm leading-7 text-zinc-700">{v}</div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

