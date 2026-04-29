import React from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardBody } from "../components/ui/Card";
import { SectionTitle } from "../components/layout/SectionTitle";
import LessonMaterialUpload from "../components/upload/LessonMaterialUpload";

export function SettingsPage() {
  const groups = [
    ["الملف الشخصي", ["الاسم", "الصورة الرمزية", "معلومات الحساب"]],
    ["المدرسة والصف", ["اسم المدرسة", "الصف الدراسي", "المرحلة"]],
    ["تفضيلات الذكاء الاصطناعي", ["نمط الإجابة المفضل", "اللغة", "أسلوب التوجيه"]],
    ["الواجهة", ["الوضع الداكن/الفاتح", "الكثافة البصرية", "اختصارات لوحة المفاتيح"]],
    ["الأمان", ["تسجيل الخروج", "الأجهزة المتصلة", "حماية الحساب"]],
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardBody>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">الإعدادات</h2>
          <p className="mt-2 text-sm text-zinc-600">واجهة إعدادات نظيفة وقابلة للتوسع لاحقًا لربط الملف الشخصي، المدرسة، وتفضيلات الذكاء الاصطناعي.</p>
        </CardBody>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        {groups.map(([title, items]) => (
          <Card key={title}>
            <CardBody>
              <SectionTitle title={title} />
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-3xl border border-zinc-200 p-4">
                    <span className="text-sm text-zinc-800">{item}</span>
                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <LessonMaterialUpload />
    </div>
  );
}

