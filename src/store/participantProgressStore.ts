import { create } from 'zustand';

type ParticipantProgressState = {
  currentSectionKey?: string;
  completedSectionIds: string[];
  reviewVisited: boolean;
  setCurrentSectionKey: (sectionKey: string | undefined) => void;
  markSectionCompleted: (sectionId: string) => void;
  setReviewVisited: (reviewVisited: boolean) => void;
  resetProgress: () => void;
};

export const useParticipantProgressStore = create<ParticipantProgressState>((set) => ({
  currentSectionKey: undefined,
  completedSectionIds: [],
  reviewVisited: false,
  setCurrentSectionKey: (sectionKey) => set({ currentSectionKey: sectionKey }),
  markSectionCompleted: (sectionId) =>
    set((state) => ({
      completedSectionIds: state.completedSectionIds.includes(sectionId)
        ? state.completedSectionIds
        : [...state.completedSectionIds, sectionId],
    })),
  setReviewVisited: (reviewVisited) => set({ reviewVisited }),
  resetProgress: () => set({ currentSectionKey: undefined, completedSectionIds: [], reviewVisited: false }),
}));
