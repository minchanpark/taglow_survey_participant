import { describe, expect, it } from 'vitest';

import { LocalStorageDraftStorage } from './localStorageDraftStorage';

describe('LocalStorageDraftStorage', () => {
  it('saves, loads, and removes a draft', async () => {
    const storage = new LocalStorageDraftStorage(window.localStorage);
    const key = 'taglow-survey-draft:test:user';
    const draft = {
      surveyId: 'test',
      participantUserId: 'user',
      locale: 'ko' as const,
      values: { q1: 'answer' },
      updatedAt: '2026-05-28T00:00:00.000Z',
      schemaVersion: 1,
    };

    await storage.saveDraft(key, draft);
    await expect(storage.loadDraft(key)).resolves.toEqual(draft);

    await storage.removeDraft(key);
    await expect(storage.loadDraft(key)).resolves.toBeNull();
  });

  it('returns null for corrupted draft JSON', async () => {
    const storage = new LocalStorageDraftStorage(window.localStorage);
    const key = 'taglow-survey-draft:broken:user';
    window.localStorage.setItem(key, '{broken');

    await expect(storage.loadDraft(key)).resolves.toBeNull();
  });
});
