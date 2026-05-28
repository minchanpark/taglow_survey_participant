import { create } from 'zustand';

import type { Locale } from '../api/participant';

type ParticipantLocaleState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useParticipantLocaleStore = create<ParticipantLocaleState>((set) => ({
  locale: 'ko',
  setLocale: (locale) => set({ locale }),
}));
