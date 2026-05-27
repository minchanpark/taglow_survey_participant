import type { DraftStorage, SurveyDraft } from './draftStorage';
import { isSurveyDraft } from './draftStorage';

export class LocalStorageDraftStorage implements DraftStorage {
  constructor(private readonly storage: Storage = window.localStorage) {}

  async loadDraft(key: string): Promise<SurveyDraft | null> {
    const raw = this.storage.getItem(key);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      return isSurveyDraft(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  async saveDraft(key: string, draft: SurveyDraft): Promise<void> {
    this.storage.setItem(key, JSON.stringify(draft));
  }

  async removeDraft(key: string): Promise<void> {
    this.storage.removeItem(key);
  }
}

