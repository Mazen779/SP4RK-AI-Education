import { useState } from "react";
import { uploadLessonMaterials } from "../../lib/lessonUploadApi";

export default function LessonMaterialUpload() {
  const [subject, setSubject] = useState("math");
  const [lessonId, setLessonId] = useState("math_6_1");
  const [lessonTitle, setLessonTitle] = useState("Area Between Curves");
  const [lessonFile, setLessonFile] = useState(null);
  const [examplesFile, setExamplesFile] = useState(null);
  const [exercisesFile, setExercisesFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleUpload() {
    setError("");
    setResult(null);
    if (!subject.trim() || !lessonId.trim() || !lessonTitle.trim()) {
      setError("Please fill subject, lesson ID, and lesson title.");
      return;
    }
    if (!lessonFile && !examplesFile && !exercisesFile) {
      setError("Please upload at least one file.");
      return;
    }
    try {
      setLoading(true);
      const data = await uploadLessonMaterials({
        subject,
        lessonId,
        lessonTitle,
        lessonFile,
        examplesFile,
        exercisesFile,
      });
      setResult(data);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Upload Lesson Materials</h1>
        <p className="mt-2 text-zinc-600">
          Upload the full lesson, examples, and exercises separately for better RAG accuracy.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700">Lesson ID</label>
          <input
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700">Lesson Title</label>
          <input
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <FileBox
          title="Full Lesson File"
          description="Definitions, explanation, rules, and lesson text."
          file={lessonFile}
          onChange={setLessonFile}
        />
        <FileBox
          title="Examples File"
          description="Only solved examples from the lesson."
          file={examplesFile}
          onChange={setExamplesFile}
        />
        <FileBox
          title="Exercises File"
          description="Only questions / exercises from the lesson."
          file={exercisesFile}
          onChange={setExercisesFile}
        />
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
          Upload completed successfully.
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleUpload}
        disabled={loading}
        className="mt-8 rounded-2xl bg-zinc-900 px-6 py-3 font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload lesson materials"}
      </button>
    </div>
  );
}

function FileBox({ title, description, file, onChange }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
      <div className="text-lg font-bold text-zinc-900">{title}</div>
      <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-600">{description}</p>
      <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-6 text-center transition hover:bg-zinc-50">
        <span className="text-sm font-semibold text-zinc-800">{file ? file.name : "Choose PDF"}</span>
        <span className="mt-1 text-xs text-zinc-500">PDF recommended</span>
        <input
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}
