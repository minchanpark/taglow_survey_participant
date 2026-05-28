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
  setValues: (values) => set((state) => (areDraftValuesEqual(state.values, values) ? state : { values })),
  patchValue: (questionId, value) =>
    set((state) =>
      areUnknownValuesEqual(state.values[questionId], value) ? state : { values: { ...state.values, [questionId]: value } },
    ),
  setDraftStatus: (draftStatus) => set((state) => (state.draftStatus === draftStatus ? state : { draftStatus })),
  setLastSavedAt: (lastSavedAt) => set((state) => (state.lastSavedAt === lastSavedAt ? state : { lastSavedAt })),
  setRestoreDraftUpdatedAt: (restoreDraftUpdatedAt) =>
    set((state) => (state.restoreDraftUpdatedAt === restoreDraftUpdatedAt ? state : { restoreDraftUpdatedAt })),
  hydrateDraft: ({ values, updatedAt }) =>
    set((state) => {
      if (
        areDraftValuesEqual(state.values, values) &&
        state.draftStatus === 'saved' &&
        state.lastSavedAt === updatedAt &&
        state.restoreDraftUpdatedAt === undefined
      ) {
        return state;
      }

      return {
        values,
        draftStatus: 'saved',
        lastSavedAt: updatedAt,
        restoreDraftUpdatedAt: undefined,
      };
    }),
  clearDraftValues: () =>
    set((state) => {
      if (
        areDraftValuesEqual(state.values, {}) &&
        state.draftStatus === 'idle' &&
        state.lastSavedAt === undefined &&
        state.restoreDraftUpdatedAt === undefined
      ) {
        return state;
      }

      return { values: {}, draftStatus: 'idle', lastSavedAt: undefined, restoreDraftUpdatedAt: undefined };
    }),
}));

function areDraftValuesEqual(left: Record<string, unknown>, right: Record<string, unknown>): boolean {
  return areUnknownValuesEqual(left, right);
}

function areUnknownValuesEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true;
  }

  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
      return false;
    }

    return left.every((item, index) => areUnknownValuesEqual(item, right[index]));
  }

  if (isRecord(left) || isRecord(right)) {
    if (!isRecord(left) || !isRecord(right)) {
      return false;
    }

    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);

    if (leftKeys.length !== rightKeys.length) {
      return false;
    }

    return leftKeys.every((key) => Object.hasOwn(right, key) && areUnknownValuesEqual(left[key], right[key]));
  }

  return false;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
