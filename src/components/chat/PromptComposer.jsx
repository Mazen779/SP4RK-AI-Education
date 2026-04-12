import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ArrowUp, Image as ImageIcon, Mic, Paperclip, Plus, Send, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { useLocale } from "../../lib/locale.jsx";
import { Button } from "../ui/Button";
import { PendingImagePreview } from "./PendingImagePreview";

export const PromptComposer = forwardRef(function PromptComposer(
  { compact = false, variant = "default", message, onMessageChange, onSubmit, onSend },
  ref
) {
  const { dir, t, locale } = useLocale();
  const tc = t.chatComposer;

  const [attachments] = useState([
    { name: "Math_worksheet.jpg", type: "IMG" },
    { name: "Unit3_notes.pdf", type: "PDF" },
  ]);

  const [internalMessage, setInternalMessage] = useState("");
  const isControlled = variant === "chat" && message !== undefined && onMessageChange !== undefined;
  const chatValue = isControlled ? message : internalMessage;
  function setChatValue(next) {
    if (isControlled) onMessageChange(next);
    else setInternalMessage(next);
  }

  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const attachMenuRef = useRef(null);
  const chatTextareaRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceBaseTextRef = useRef("");
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const frameRef = useRef(null);
  const lastSpeechAtRef = useRef(0);

  function cleanupAudioMeter() {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setVoiceLevel(0);
  }

  function stopVoiceCapture() {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognitionRef.current = null;
      recognition.stop();
    }
    cleanupAudioMeter();
    setIsListening(false);
  }

  async function startAudioMeter() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const context = new AudioCtx();
    audioContextRef.current = context;
    const analyser = context.createAnalyser();
    analyser.fftSize = 1024;
    analyserRef.current = analyser;
    const source = context.createMediaStreamSource(stream);
    source.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    const silenceThreshold = 0.02;
    const silenceMs = 3000;
    lastSpeechAtRef.current = Date.now();

    const tick = () => {
      if (!analyserRef.current || !recognitionRef.current) return;
      analyserRef.current.getByteTimeDomainData(data);
      let sumSquares = 0;
      for (let i = 0; i < data.length; i += 1) {
        const normalized = (data[i] - 128) / 128;
        sumSquares += normalized * normalized;
      }
      const rms = Math.sqrt(sumSquares / data.length);
      if (rms > silenceThreshold) lastSpeechAtRef.current = Date.now();
      setVoiceLevel(Math.min(1, rms * 6));
      if (Date.now() - lastSpeechAtRef.current >= silenceMs) {
        stopVoiceCapture();
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  }

  function trySubmit() {
    const trimmed = chatValue.trim();
    if (!trimmed && pendingFiles.length === 0) return;

    if (onSend && pendingFiles.length === 0 && trimmed) {
      void Promise.resolve(onSend(trimmed)).finally(() => {
        setChatValue("");
        setPendingFiles([]);
        if (imageInputRef.current) imageInputRef.current.value = "";
        if (fileInputRef.current) fileInputRef.current.value = "";
      });
      return;
    }

    onSubmit?.({ text: chatValue, files: [...pendingFiles] });
    setChatValue("");
    setPendingFiles([]);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePendingFile(index) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function addPickedFile(e) {
    const f = e.target.files?.[0];
    if (f) setPendingFiles((prev) => [...prev, f]);
    e.target.value = "";
    setAttachMenuOpen(false);
  }

  useEffect(() => {
    if (!attachMenuOpen) return;
    const onPointerDown = (e) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target)) {
        setAttachMenuOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setAttachMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [attachMenuOpen]);

  useEffect(() => {
    return () => {
      stopVoiceCapture();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        if (variant === "chat") chatTextareaRef.current?.focus();
      },
      openImagePicker: () => {
        if (variant === "chat") imageInputRef.current?.click();
      },
    }),
    [variant]
  );

  function handleVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      stopVoiceCapture();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = locale === "ar" ? "ar-SA" : "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let liveTranscript = "";
      for (let i = 0; i < event.results.length; i += 1) {
        const chunk = event.results[i]?.[0]?.transcript || "";
        if (!chunk) continue;
        liveTranscript += `${liveTranscript ? " " : ""}${chunk.trim()}`;
      }
      const transcript = liveTranscript.trim();
      if (!transcript) return;
      lastSpeechAtRef.current = Date.now();
      const base = voiceBaseTextRef.current || "";
      setChatValue(`${base}${base.trim() ? " " : ""}${transcript}`);
    };
    recognition.onerror = () => {
      stopVoiceCapture();
    };
    recognition.onend = () => {
      cleanupAudioMeter();
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    voiceBaseTextRef.current = String(chatValue || "").trim();
    setIsListening(true);
    recognition.start();
    startAudioMeter().catch(() => {
      cleanupAudioMeter();
    });
  }

  if (variant === "chat") {
    return (
      <div className="w-full max-w-none">
        {pendingFiles.length > 0 ? (
          <div className="mb-2 flex flex-wrap items-end gap-2" dir={dir}>
            {pendingFiles.map((file, idx) =>
              file.type.startsWith("image/") ? (
                <PendingImagePreview
                  key={`${file.name}-${file.size}-${idx}`}
                  file={file}
                  onRemove={() => removePendingFile(idx)}
                  removeLabel={tc?.removeImageAria}
                />
              ) : (
                <span
                  key={`${file.name}-${file.size}-${idx}`}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-[var(--spark-r-md)] border border-[var(--spark-chat-border)] bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    className="shrink-0 rounded-md p-0.5 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-700"
                    onClick={() => removePendingFile(idx)}
                    aria-label={`${tc?.removeFileAria || "Remove"} ${file.name}`}
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </span>
              )
            )}
          </div>
        ) : null}

        <div
          dir="ltr"
          className={cn(
            "flex w-full items-center gap-1 rounded-[var(--spark-r-pill)] border border-[var(--spark-chat-border)] bg-[var(--spark-chat-surface)]",
            "px-2 py-1 shadow-[var(--spark-shadow-sm),var(--spark-shadow-inset)]",
            "transition-[box-shadow,border-color] duration-[var(--spark-duration)] ease-[var(--spark-ease-out)]",
            "focus-within:border-[var(--spark-chat-border-hover)] focus-within:shadow-[var(--spark-shadow-md)]",
            "md:gap-1.5 md:px-3 md:py-1.5"
          )}
        >
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--spark-chat-accent)] text-white shadow-[var(--spark-shadow-xs)] transition-[transform,box-shadow] hover:bg-zinc-900 hover:shadow-[var(--spark-shadow-sm)] active:scale-[0.96] md:h-9 md:w-9"
            aria-label={tc?.send}
            onClick={() => trySubmit()}
          >
            <Send className="h-4 w-4 md:h-[18px] md:w-[18px]" strokeWidth={2} />
          </button>

          <textarea
            ref={chatTextareaRef}
            dir={dir}
            rows={1}
            value={chatValue}
            onChange={(e) => setChatValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                trySubmit();
              }
            }}
            className="min-h-[32px] max-h-[120px] w-full min-w-0 flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-normal text-zinc-900 outline-none placeholder:text-zinc-400 md:min-h-[36px] md:py-2 md:text-[15px]"
            placeholder={tc?.placeholder}
          />

          <button
            type="button"
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-[var(--spark-chat-accent-softer)] hover:text-zinc-800 md:h-9 md:w-9",
              isListening && "bg-[var(--spark-chat-accent-softer)] text-zinc-800"
            )}
            aria-label={tc?.voiceInput}
            onClick={handleVoiceInput}
          >
            {isListening ? (
              <div className="flex h-5 items-end gap-[2px] md:h-[22px]">
                {[0.55, 0.8, 1, 0.7].map((factor, idx) => {
                  const barHeight = Math.max(4, Math.round((6 + voiceLevel * 14) * factor));
                  return (
                    <span
                      key={idx}
                      className="w-[2px] rounded-full bg-zinc-700 transition-[height] duration-75"
                      style={{ height: `${barHeight}px` }}
                    />
                  );
                })}
              </div>
            ) : (
              <Mic className="h-5 w-5 md:h-[22px] md:w-[22px]" strokeWidth={1.75} />
            )}
          </button>

          <div className="relative shrink-0" ref={attachMenuRef}>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              tabIndex={-1}
              onChange={addPickedFile}
            />
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              tabIndex={-1}
              onChange={addPickedFile}
            />

            <button
              type="button"
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-[var(--spark-chat-accent-softer)] hover:text-zinc-800 md:h-9 md:w-9",
                attachMenuOpen && "bg-[var(--spark-chat-accent-softer)] text-zinc-800"
              )}
              aria-label={tc?.addAttachments}
              aria-expanded={attachMenuOpen}
              aria-haspopup="menu"
              onClick={() => setAttachMenuOpen((o) => !o)}
            >
              <Plus className="h-5 w-5 md:h-[22px] md:w-[22px]" strokeWidth={1.75} />
            </button>

            {attachMenuOpen ? (
              <div
                role="menu"
                dir={dir}
                className="absolute bottom-full right-0 z-50 mb-2 min-w-[12.5rem] overflow-hidden rounded-[var(--spark-r-lg)] border border-[var(--spark-chat-border)] bg-[var(--spark-chat-surface)] py-1 shadow-[var(--spark-shadow-lg)]"
              >
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-start text-sm text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:bg-zinc-50 focus-visible:outline-none"
                  onClick={() => {
                    imageInputRef.current?.click();
                  }}
                >
                  <ImageIcon className="h-4 w-4 shrink-0 text-zinc-500" strokeWidth={1.75} />
                  {tc?.attachImage}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-start text-sm text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:bg-zinc-50 focus-visible:outline-none"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                >
                  <Paperclip className="h-4 w-4 shrink-0 text-zinc-500" strokeWidth={1.75} />
                  {tc?.attachFile}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[28px] border border-zinc-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]",
        compact ? "p-3" : "p-4 md:p-5"
      )}
    >
      <textarea
        rows={compact ? 2 : 3}
        dir={dir}
        className="w-full resize-none bg-transparent text-sm leading-7 text-zinc-900 outline-none placeholder:text-zinc-400"
        placeholder={tc?.defaultLongPlaceholder}
      />

      {!compact ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {attachments.map((a) => (
            <div key={a.name} className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-[11px] text-zinc-700">
              <span className="rounded bg-white px-1.5 py-0.5 text-[10px]">{a.type}</span>
              {a.name}
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm">
          <ImageIcon className="h-4 w-4" />
          {t.upload?.image}
        </Button>
        <Button variant="secondary" size="sm">
          <Paperclip className="h-4 w-4" />
          {t.upload?.file}
        </Button>
        <Button variant="secondary" size="sm">
          <Mic className="h-4 w-4" />
          {tc?.voice}
        </Button>

        <div className="mr-auto flex items-center gap-2">
          <Button size="sm">
            <ArrowUp className="h-4 w-4" />
            {tc?.send}
          </Button>
        </div>
      </div>
    </div>
  );
});

PromptComposer.displayName = "PromptComposer";
