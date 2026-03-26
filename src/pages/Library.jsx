import React from "react";
import { Card, CardBody } from "../components/ui/Card";
import { SectionTitle } from "../components/layout/SectionTitle";
import { cn } from "../lib/cn";

export function LibraryPage({ bookLibrary }) {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardBody>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">المكتبة</h2>
              <p className="mt-2 text-sm text-zinc-600">الكتب، المراجع، الملفات المساعدة، وأوراق العمل المرتبطة بالطالب.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-full bg-zinc-950 px-4 py-2 text-sm text-white">الكل</button>
              <button className="rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-700">حسب المادة</button>
              <button className="rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-700">ملفات مرفوعة</button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {bookLibrary.map((book) => (
              <div key={book.id} className="rounded-[28px] border border-zinc-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-sm">
                <div className={cn("mb-4 flex h-44 items-center justify-center rounded-[24px] border text-2xl font-semibold", book.accent)}>
                  {book.cover}
                </div>
                <div className="text-sm font-medium text-zinc-900">{book.title}</div>
                <div className="mt-1 text-xs text-zinc-500">
                  {book.subject} · {book.grade}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="rounded-2xl bg-zinc-950 px-3 py-2 text-xs font-medium text-white">افتح</button>
                  <button className="rounded-2xl border border-zinc-200 px-3 py-2 text-xs text-zinc-700">ابدأ محادثة</button>
                  <button className="rounded-2xl border border-zinc-200 px-3 py-2 text-xs text-zinc-700">اسأل عنه</button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

