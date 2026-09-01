"use client";

import { useEffect, useRef, useState } from "react";
import { ResumeDocument } from "@/components/resume/resume-document";
import type { Resume } from "@/features/resume/resume.types";

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

export function ResumePreview({ resume }: { resume: Resume }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.55);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const update = () => {
      const width = node.clientWidth;
      setScale(Math.min(1, Math.max(0.35, width / A4_WIDTH)));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="print-hidden w-full">
      <div
        className="relative mx-auto overflow-hidden rounded-sm border bg-white shadow-lg"
        style={{ height: A4_HEIGHT * scale }}
      >
        <div
          className="origin-top-left"
          style={{
            width: A4_WIDTH,
            minHeight: A4_HEIGHT,
            transform: `scale(${scale})`,
          }}
        >
          <div
            className="bg-white"
            style={{ width: A4_WIDTH, minHeight: A4_HEIGHT }}
            data-testid="resume-preview"
          >
            <ResumeDocument resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResumePrintRoot({ resume }: { resume: Resume }) {
  return (
    <div id="resume-print-root" className="print-only hidden">
      <ResumeDocument resume={resume} />
    </div>
  );
}
