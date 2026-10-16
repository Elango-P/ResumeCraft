"use client";

import { create } from "zustand";
import { createDemoResume } from "./demo-resume";
import { persistedResumeStateSchema } from "./resume.schema";
import type {
  Experience,
  PersistedResumeState,
  Resume,
  SectionId,
  TemplateId,
} from "./resume.types";
import {
  cloneResume,
  createEmptyResume,
  createId,
  STORAGE_KEY,
} from "./resume.utils";

interface ResumeStore {
  drafts: Record<string, Resume>;
  draftOrder: string[];
  activeDraftId: string;
  activeSection: SectionId;
  hasHydrated: boolean;
  isDirty: boolean;
  lastSavedAt: string | null;
  isSaving: boolean;
  previewOpen: boolean;
  hydrate: () => void;
  persistNow: () => void;
  setSaving: (value: boolean) => void;
  setActiveSection: (section: SectionId) => void;
  setPreviewOpen: (open: boolean) => void;
  getActiveResume: () => Resume;
  updateResume: (updater: (resume: Resume) => Resume) => void;
  setTemplate: (templateId: TemplateId) => void;
  createDraft: (mode?: "blank" | "demo" | "duplicate") => string;
  switchDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
  resetDemo: () => void;
  duplicateExperience: (id: string) => void;
  importResumeDraft: (resume: Resume) => string;
}

function seedState(): Pick<
  ResumeStore,
  "drafts" | "draftOrder" | "activeDraftId" | "lastSavedAt"
> {
  const demo = createDemoResume();
  return {
    drafts: { [demo.id]: demo },
    draftOrder: [demo.id],
    activeDraftId: demo.id,
    lastSavedAt: null,
  };
}

function readPersisted(): PersistedResumeState | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    const result = persistedResumeStateSchema.safeParse(parsed);
    if (!result.success) return null;
    const { drafts, draftOrder, activeDraftId } = result.data;
    const validOrder = draftOrder.filter((id) => drafts[id]);
    if (validOrder.length === 0) return null;
    const active = drafts[activeDraftId] ? activeDraftId : validOrder[0];
    return {
      ...result.data,
      draftOrder: validOrder,
      activeDraftId: active,
    };
  } catch {
    return null;
  }
}

function writePersisted(state: PersistedResumeState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  ...seedState(),
  activeSection: "personal",
  hasHydrated: false,
  isDirty: false,
  isSaving: false,
  previewOpen: false,

  hydrate: () => {
    const persisted = readPersisted();
    if (persisted) {
      set({
        drafts: persisted.drafts,
        draftOrder: persisted.draftOrder,
        activeDraftId: persisted.activeDraftId,
        lastSavedAt: persisted.lastSavedAt,
        hasHydrated: true,
        isDirty: false,
      });
      return;
    }
    set({ hasHydrated: true, isDirty: false });
  },

  persistNow: () => {
    if (typeof window === "undefined") return;
    const now = new Date().toISOString();
    const { drafts, draftOrder, activeDraftId } = get();
    writePersisted({
      version: 1,
      drafts,
      draftOrder,
      activeDraftId,
      lastSavedAt: now,
    });
    set({ lastSavedAt: now, isDirty: false, isSaving: false });
  },

  setSaving: (value) => set({ isSaving: value }),
  setActiveSection: (section) => set({ activeSection: section }),
  setPreviewOpen: (open) => set({ previewOpen: open }),

  getActiveResume: () => {
    const { drafts, activeDraftId } = get();
    return drafts[activeDraftId] ?? createDemoResume();
  },

  updateResume: (updater) => {
    set((state) => {
      const current = state.drafts[state.activeDraftId];
      if (!current) return state;
      const next = updater({
        ...current,
        updatedAt: new Date().toISOString(),
      });
      return {
        drafts: { ...state.drafts, [state.activeDraftId]: next },
        isDirty: true,
      };
    });
  },

  setTemplate: (templateId) => {
    get().updateResume((resume) => ({ ...resume, templateId }));
  },

  createDraft: (mode = "blank") => {
    const id = createId();
    let resume: Resume;
    if (mode === "demo") {
      resume = { ...createDemoResume(), id };
    } else if (mode === "duplicate") {
      resume = cloneResume(get().getActiveResume());
    } else {
      resume = createEmptyResume({ id });
    }
    set((state) => ({
      drafts: { ...state.drafts, [resume.id]: resume },
      draftOrder: [resume.id, ...state.draftOrder],
      activeDraftId: resume.id,
      isDirty: true,
      activeSection: "personal",
    }));
    return resume.id;
  },

  switchDraft: (id) => {
    if (!get().drafts[id]) return;
    set({ activeDraftId: id, activeSection: "personal", isDirty: true });
  },

  deleteDraft: (id) => {
    set((state) => {
      if (state.draftOrder.length <= 1) return state;
      const drafts = { ...state.drafts };
      delete drafts[id];
      const draftOrder = state.draftOrder.filter((draftId) => draftId !== id);
      const activeDraftId =
        state.activeDraftId === id ? draftOrder[0] : state.activeDraftId;
      return { drafts, draftOrder, activeDraftId, isDirty: true };
    });
  },

  resetDemo: () => {
    const demo = createDemoResume();
    set((state) => ({
      drafts: { ...state.drafts, [state.activeDraftId]: { ...demo, id: state.activeDraftId } },
      isDirty: true,
      activeSection: "personal",
    }));
  },

  duplicateExperience: (id) => {
    get().updateResume((resume) => {
      const item = resume.experience.find((entry) => entry.id === id);
      if (!item) return resume;
      const copy: Experience = { ...item, id: createId() };
      const index = resume.experience.findIndex((entry) => entry.id === id);
      const experience = [...resume.experience];
      experience.splice(index + 1, 0, copy);
      return { ...resume, experience };
    });
  },

  importResumeDraft: (resume: Resume) => {
    const id = resume.id || createId();
    const imported: Resume = {
      ...resume,
      id,
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      drafts: { ...state.drafts, [id]: imported },
      draftOrder: [id, ...state.draftOrder.filter((d) => d !== id)],
      activeDraftId: id,
      isDirty: true,
      activeSection: "personal",
    }));
    get().persistNow();
    return id;
  },
}));
