import { create } from 'zustand';

type ImageTaggingState = {
  editingQuestionId?: string;
  editingPointIndex?: number;
  setEditingPoint: (questionId: string | undefined, pointIndex?: number) => void;
  clearEditingPoint: () => void;
};

export const useImageTaggingStore = create<ImageTaggingState>((set) => ({
  editingQuestionId: undefined,
  editingPointIndex: undefined,
  setEditingPoint: (editingQuestionId, editingPointIndex) => set({ editingQuestionId, editingPointIndex }),
  clearEditingPoint: () => set({ editingQuestionId: undefined, editingPointIndex: undefined }),
}));
