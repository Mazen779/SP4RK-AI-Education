const API_BASE = "http://127.0.0.1:8010";

export async function uploadLessonMaterials({
  subject,
  lessonId,
  lessonTitle,
  lessonFile,
  examplesFile,
  exercisesFile,
}) {
  const formData = new FormData();
  formData.append("subject", subject);
  formData.append("lesson_id", lessonId);
  formData.append("lesson_title", lessonTitle);
  if (lessonFile) formData.append("lesson_file", lessonFile);
  if (examplesFile) formData.append("examples_file", examplesFile);
  if (exercisesFile) formData.append("exercises_file", exercisesFile);

  const response = await fetch(`${API_BASE}/upload-lesson-material`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upload failed: ${response.status} ${text}`);
  }

  return response.json();
}
