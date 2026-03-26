import React, { useState } from "react";
import { AlertCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardBody } from "../components/ui/Card";
import { SectionTitle } from "../components/layout/SectionTitle";
import { Tabs } from "../components/ui/Tabs";
import { cn } from "../lib/cn";
import { PromptComposer } from "../components/chat/PromptComposer";

export function LessonPage({ subject, lesson, chatMessages, uploadedFiles }) {
  const [tab, setTab] = useState("الشرح");
  const tabs = ["الشرح", "الأمثلة", "الشات", "الملفات", "التدريب"];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardBody>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-zinc-700">
                <span className={cn("h-2.5 w-2.5 rounded-full", subject.accent.solid)} />
                {subject.name}
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">{lesson.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">{lesson.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["فهم المفهوم", "حل تدريجي", "تطبيق على أمثلة", "الاستعداد للاختبار"].map((goal) => (
                  <span key={goal} className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[11px] text-zinc-700">
                    {goal}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-zinc-200 p-4 text-center">
              <div className="text-xs text-zinc-500">مستوى الإتقان</div>
              <div className="mt-2 text-3xl font-semibold text-zinc-950">{lesson.mastery}%</div>
            </div>
          </div>

          <div className="mt-6">
            <Tabs value={tab} onChange={setTab} items={tabs} />
          </div>
        </CardBody>
      </Card>

      {tab === "الشرح" && (
        <div className="grid gap-6 xl:grid-cols-[1.2fr,1fr]">
          <Card>
            <CardBody>
              <SectionTitle title="شرح الدرس" />
              <div className="space-y-4 text-sm leading-8 text-zinc-700">
                <p>
                  هذا القسم مصمم ليكون شرحًا نظيفًا ومرنًا يمكن لاحقًا ربطه بالكتاب أو المحتوى الرسمي. نعرض الفكرة الأساسية أولًا، ثم
                  نبني الأمثلة، ثم نضيف ملاحظات مهمة تساعد الطالب على تثبيت الفهم.
                </p>
                <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="mb-2 font-medium text-zinc-900">النقاط الرئيسية</div>
                  <ul className="list-disc space-y-1 pr-5 marker:text-zinc-400">
                    <li>تعريف واضح للمفهوم.</li>
                    <li>خطوات التفكير قبل الحل.</li>
                    <li>أين يخطئ الطلاب غالبًا.</li>
                  </ul>
                </div>
                <div className="rounded-3xl border border-zinc-200 p-4">
                  <div className="mb-2 font-medium text-zinc-900">ملاحظات</div>
                  <p>يمكن لاحقًا إدراج معادلات، رسوم، أو مقتطفات موثقة من الكتاب الدراسي مع دعم الإحالات الذكية داخل نفس التجربة.</p>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <SectionTitle title="مهارات مرتبطة" />
              <div className="space-y-3">
                {["الفهم المفاهيمي", "التحليل المنطقي", "حل التمارين", "التذكر السريع قبل الاختبار"].map((skill) => (
                  <div key={skill} className="rounded-3xl border border-zinc-200 p-4 text-sm text-zinc-700">
                    {skill}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {tab === "الأمثلة" && (
        <Card>
          <CardBody>
            <SectionTitle title="أمثلة مرتبة" />
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="rounded-3xl border border-zinc-200 p-4">
                  <div className="mb-2 text-sm font-medium text-zinc-900">مثال {n}</div>
                  <p className="text-sm leading-7 text-zinc-600">
                    مثال تطبيقي مبسط مع توضيح الخطوات، ويمكن تحويله لاحقًا إلى وضع خطوة بخطوة أو أسئلة تدريبية مباشرة.
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {tab === "الشات" && (
        <div className="grid gap-6 xl:grid-cols-[1.6fr,0.9fr]">
          <Card className="overflow-hidden">
            <div className="border-b border-zinc-200 p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className={cn("rounded-full px-3 py-1.5 text-[11px] font-medium", subject.accent.soft, subject.accent.text)}>{subject.name}</span>
                <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-[11px] font-medium text-zinc-700">{lesson.title}</span>
                <span className="rounded-full border border-zinc-200 px-3 py-1.5 text-[11px] text-zinc-600">يعتمد على محتوى الدرس</span>
              </div>
              <p className="text-xs leading-6 text-zinc-500">
                أي سؤال هنا يجب أن يبقى ضمن الدرس أو مواضيعه القريبة. عند الخروج عن النطاق يظهر تنبيه ذكي وغير مزعج.
              </p>
            </div>

            <div className="space-y-4 p-4 md:p-5">
              {chatMessages.map((m, i) => (
                <div key={i} className="flex">
                  <div className={cn("max-w-[90%] rounded-[24px] p-4", m.role === "assistant" ? "border border-zinc-200 bg-white" : "bg-zinc-950 text-white")}>
                    <div className={cn("whitespace-pre-line text-sm leading-8", m.role === "assistant" ? "text-zinc-800" : "text-white")}>{m.content}</div>
                    {m.note ? (
                      <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs leading-6 text-zinc-600">{m.note}</div>
                    ) : null}
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 px-1 text-xs text-zinc-400">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="h-2 w-2 rounded-full bg-zinc-400" />
                المساعد يكتب الآن...
              </div>
            </div>

            <div className="border-t border-zinc-200 p-4">
              <PromptComposer compact />
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardBody>
                <SectionTitle title="المرفقات" />
                <div className="space-y-3">
                  <div className="rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-5 text-center text-sm text-zinc-500">اسحب وأفلت صورة، صفحة كتاب، أو PDF هنا</div>
                  {uploadedFiles.slice(0, 2).map((f) => (
                    <div key={f.id} className="rounded-3xl border border-zinc-200 p-4">
                      <div className="text-sm font-medium text-zinc-900">{f.name}</div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {f.type} · {f.time}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button className="rounded-2xl border border-zinc-200 px-3 py-2 text-xs text-zinc-700">استخدمه في هذه المحادثة</button>
                        <button className="rounded-2xl border border-zinc-200 px-3 py-2 text-xs text-zinc-700">استخرج الأسئلة</button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <SectionTitle title="تنبيه نطاق الدرس" />
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                  <div className="mb-1 flex items-center gap-2 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    توجيه نطاقي لطيف
                  </div>
                  إذا خرج السؤال عن هذا الدرس بشكل كبير، سيقترح النظام الانتقال إلى درس أنسب أو فتح محادثة عامة.
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {tab === "الملفات" && (
        <Card>
          <CardBody>
            <SectionTitle title="ملفات الدرس" />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {uploadedFiles.map((f) => (
                <div key={f.id} className="rounded-3xl border border-zinc-200 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-900">
                    <FileText className="h-4 w-4 text-zinc-700" />
                    {f.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {f.type} · {f.time}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {tab === "التدريب" && (
        <Card>
          <CardBody>
            <SectionTitle title="التدريب الذكي" />
            <div className="grid gap-4 xl:grid-cols-[1fr,1fr]">
              <div className="rounded-3xl border border-zinc-200 p-5">
                <div className="mb-3 text-sm font-medium text-zinc-900">مستوى التدريب</div>
                <div className="flex flex-wrap gap-2">
                  {["سهل", "متوسط", "صعب"].map((lvl, i) => (
                    <button key={lvl} className={cn("rounded-full px-4 py-2 text-sm", i === 1 ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-700")}>
                      {lvl}
                    </button>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button className="rounded-2xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white">ولّد لي سؤال جديد</button>
                  <button className="rounded-2xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700">اختبرني</button>
                  <button className="rounded-2xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700">صحح إجابتي</button>
                </div>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="mb-2 text-sm font-medium text-zinc-900">سؤال تدريبي</div>
                <p className="text-sm leading-7 text-zinc-700">اكتب هنا سؤالًا متدرجًا بحسب مستوى الطالب، مع إمكانية كشف التلميح أولًا ثم الحل خطوة بخطوة لاحقًا.</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

    </div>
  );
}

