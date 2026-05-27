import type { DraftStorage, SurveyDraft } from './draftStorage';
import { isSurveyDraft } from './draftStorage';

const DB_NAME = 'taglow-survey-participant';
const STORE_NAME = 'drafts';
const DB_VERSION = 1;

export class IndexedDbDraftStorage implements DraftStorage {
  async loadDraft(key: string): Promise<SurveyDraft | null> {
    const db = await openDraftDatabase();
    const value = await requestToPromise<unknown>(db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(key));
    db.close();
    return isSurveyDraft(value) ? value : null;
  }

  async saveDraft(key: string, draft: SurveyDraft): Promise<void> {
    const db = await openDraftDatabase();
    await requestToPromise(db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(draft, key));
    db.close();
  }

  async removeDraft(key: string): Promise<void> {
    const db = await openDraftDatabase();
    await requestToPromise(db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(key));
    db.close();
  }
}

function openDraftDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

