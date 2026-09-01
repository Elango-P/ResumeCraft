"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useResumeStore } from "./resume.store";

const SAVE_DELAY_MS = 700;

function subscribe() {
  return () => undefined;
}

export function useClientReady() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function useAutoSave() {
  const drafts = useResumeStore((state) => state.drafts);
  const draftOrder = useResumeStore((state) => state.draftOrder);
  const activeDraftId = useResumeStore((state) => state.activeDraftId);
  const isDirty = useResumeStore((state) => state.isDirty);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated || !isDirty) return;
    useResumeStore.getState().setSaving(true);
    const timer = window.setTimeout(() => {
      useResumeStore.getState().persistNow();
    }, SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [drafts, draftOrder, activeDraftId, isDirty, hasHydrated]);
}

export function useUnsavedChangesWarning() {
  const isDirty = useResumeStore((state) => state.isDirty);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty, hasHydrated]);
}

export function useHydrateResumeStore() {
  useEffect(() => {
    useResumeStore.getState().hydrate();
  }, []);
}
