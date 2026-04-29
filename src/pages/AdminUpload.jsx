import { useState } from "react";

export default function AdminUpload() {
  const [lessonFile, setLessonFile] = useState(null);
  const [examplesFile, setExamplesFile] = useState(null);
  const [exercisesFile, setExercisesFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("subject", "math");
    formData.append("lesson_id", "math_6_1");
    if (lessonFile) formData.append("lesson_file", lessonFile);
    if (examplesFile) formData.append("examples_file", examplesFile);
    if (exercisesFile) formData.append("exercises_file", exercisesFile);

    const res = await fetch("http://127.0.0.1:8010/upload-lesson-material", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log(data);
    alert("Upload done ✅");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>📚 Upload Lesson Material</h2>
      <label>📘 Lesson (Theory / Explanation)</label>
      <br />
      <input type="file" onChange={(e) => setLessonFile(e.target.files?.[0] ?? null)} />
      <br />
      <br />
      <label>📗 Examples (Solved Examples)</label>
      <br />
      <input type="file" onChange={(e) => setExamplesFile(e.target.files?.[0] ?? null)} />
      <br />
      <br />
      <label>📕 Exercises (Questions)</label>
      <br />
      <input type="file" onChange={(e) => setExercisesFile(e.target.files?.[0] ?? null)} />
      <br />
      <br />
      <button onClick={handleUpload}>🚀 Upload</button>
    </div>
  );
}
