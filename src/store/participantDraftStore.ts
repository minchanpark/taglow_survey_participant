import { create } from 'zustand';

import type { Locale } from '../api/participant';

export type DraftSaveStatus = 'idle' | 'restore_available' | 'saving' | 'saved' | 'error';

type ParticipantDraftState = {
  values: Record<string, unknown>;
  draftStatus: DraftSaveStatus;
  lastSavedAt?: string;
  restoreDraftUpdatedAt?: string;
  setValues: (values: Record<string, unknown>) => void;
  patchValue: (questionId: string, value: unknown) => void;
  setDraftStatus: (status: DraftSaveStatus) => void;
  setLastSavedAt: (updatedAt: string | undefined) => void;
  setRestoreDraftUpdatedAt: (updatedAt: string | undefined) => void;
  hydrateDraft: (args: { values: Record<string, unknown>; locale: Locale; currentSectionId?: string; updatedAt?: string }) => void;
  clearDraftValues: () => void;
};

export const useParticipantDraftStore = create<ParticipantDraftState>((set) => ({
  values: {},
  draftStatus: 'idle',
  lastSavedAt: undefined,
  restoreDraftUpdatedAt: undefined,
  setValues: (values) => set({ values }),
  patchValue: (questionId, value) => set((state) => ({ values: { ...state.values, [questionId]: value } })),
  setDraftStatus: (draftStatus) => set({ draftStatus }),
  setLastSavedAt: (lastSavedAt) => set({ lastSavedAt }),
  setRestoreDraftUpdatedAt: (restoreDraftUpdatedAt) => set({ restoreDraftUpdatedAt }),
  hydrateDraft: ({ values, updatedAt }) =>
    set({
      values,
      draftStatus: 'saved',
      lastSavedAt: updatedAt,
      restoreDraftUpdatedAt: undefined,
    }),
  clearDraftValues: () => set({ values: {}, draftStatus: 'idle', lastSavedAt: undefined, restoreDraftUpdatedAt: undefined }),
}));
