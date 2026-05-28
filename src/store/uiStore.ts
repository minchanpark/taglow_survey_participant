import { create } from 'zustand';

type UiState = {
  bottomActionVisible: boolean;
  setBottomActionVisible: (visible: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  bottomActionVisible: true,
  setBottomActionVisible: (bottomActionVisible) => set({ bottomActionVisible }),
}));
