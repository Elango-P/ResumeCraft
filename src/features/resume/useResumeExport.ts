"use client";

import { useCallback } from "react";

export function useResumeExport() {
  const printResume = useCallback(() => {
    window.print();
  }, []);

  return { printResume, downloadPdf: printResume };
}
