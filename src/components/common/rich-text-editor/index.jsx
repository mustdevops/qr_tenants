"use client";

import { useEffect, useRef } from "react";

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorContainerRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const initQuill = async () => {
      if (!editorContainerRef.current || quillRef.current) return;

      const Quill = (await import("quill")).default;

      if (!mounted || !editorContainerRef.current) return;

      const quill = new Quill(editorContainerRef.current, {
        theme: "snow",
        placeholder: placeholder || "Write here...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["link", "blockquote", "code-block"],
            ["clean"],
          ],
        },
      });

      quillRef.current = quill;

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        onChange?.(html === "<p><br></p>" ? "" : html);
      });
    };

    initQuill();

    return () => {
      mounted = false;
      quillRef.current = null;
    };
  }, [onChange, placeholder]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    const current = quill.root.innerHTML;
    const next = value || "";
    if (next !== current) {
      quill.clipboard.dangerouslyPasteHTML(next || "");
    }
  }, [value]);

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden shadow-sm">
      <div className="legal-quill min-h-[240px]">
        <div ref={editorContainerRef} className="min-h-[240px]" />
      </div>
    </div>
  );
}
