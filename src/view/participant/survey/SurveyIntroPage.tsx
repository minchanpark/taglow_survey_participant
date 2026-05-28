import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useParticipantSessionQuery, usePublicSurveyQuery } from '../../../api/participant';
import type { SurveyDraft } from '../../../api/participant/service/draft/draftStorage';
import { LocalStorageDraftStorage } from '../../../api/participant/service/draft/localStorageDraftStorage';
import { Button } from '../../../components/Button';
import { Message } from '../../../components/Message';
import { useParticipantDraftStore } from '../../../store/participantDraftStore';
import { useParticipantLocaleStore } from '../../../store/participantLocaleStore';
import { useParticipantProgressStore } from '../../../store/participantProgressStore';
import { buildDraftKey } from '../../../utils/draftKey';
import { formatShortDateTime } from '../../../utils/dateTime';
import { readLocalizedText, resolveSurveyDefaultLocale } from '../../../utils/i18nText';
import { DraftRestoreBanner } from './components/DraftRestoreBanner';
import './css/SurveyIntroPage.css';

const DRAFT_SCHEMA_VERSION = 1;

export function SurveyIntroPage() {
  const { publicSlug = '' } = useParams();
  const navigate = useNavigate();
  const surveyQuery = usePublicSurveyQuery(publicSlug);
  const sessionQuery = useParticipantSessionQuery();
  const { locale, setLocale } = useParticipantLocaleStore();
  const { hydrateDraft, clearDraftValues, setRestoreDraftUpdatedAt } = useParticipantDraftStore();
  const { setCurrentSectionKey, resetProgress } = useParticipantProgressStore();
  const [draft, setDraft] = useState<SurveyDraft | null>(null);
  const survey = surveyQuery.data;
  const session = sessionQuery.data;
  const defaultLocale = resolveSurveyDefaultLocale(survey);
  const displayLocale = locale ?? defaultLocale;
  const firstSection = survey?.sections[0];
  const storage = useMemo(() => new LocalStorageDraftStorage(), []);

  useEffect(() => {
    if (!survey || !session) {
      return;
    }

    const draftKey = buildDraftKey({ surveyId: survey.id, participantUserId: session.userId });
    void storage.loadDraft(draftKey).then((loadedDraft) => {
      if (!loadedDraft || loadedDraft.schemaVersion !== DRAFT_SCHEMA_VERSION) {
        return;
      }

      setDraft(loadedDraft);
      setRestoreDraftUpdatedAt(loadedDraft.updatedAt);
    });
  }, [session, setRestoreDraftUpdatedAt, storage, survey]);

  if (!survey) {
    return null;
  }

  const startFresh = async () => {
    if (survey && session) {
      await storage.removeDraft(buildDraftKey({ surveyId: survey.id, participantUserId: session.userId }));
    }

    clearDraftValues();
    resetProgress();
    setDraft(null);
    setCurrentSectionKey(firstSection?.sectionKey);
    navigate(firstSection ? `/survey/${publicSlug}/sections/${firstSection.sectionKey}` : `/survey/${publicSlug}/review`);
  };

  const restoreDraft = () => {
    if (!draft) {
      return;
    }

    const section = survey.sections.find((item) => item.id === draft.currentSectionId) ?? firstSection;
    hydrateDraft({
      values: draft.values,
      locale: draft.locale,
      currentSectionId: draft.currentSectionId,
      updatedAt: draft.updatedAt,
    });
    setLocale(draft.locale);
    setCurrentSectionKey(section?.sectionKey);
    navigate(section ? `/survey/${publicSlug}/sections/${section.sectionKey}` : `/survey/${publicSlug}/review`);
  };

  return (
    <main className="survey-intro-page">
      <header className="survey-intro-page__header">
        <p className="survey-intro-page__eyebrow">설문 안내</p>
        <h1>{readLocalizedText(survey.title, displayLocale, defaultLocale)}</h1>
        {survey.description ? <p>{readLocalizedText(survey.description, displayLocale, defaultLocale)}</p> : null}
      </header>

      {draft ? (
        <DraftRestoreBanner
          updatedAt={formatShortDateTime(draft.updatedAt)}
          onRestore={restoreDraft}
          onRestart={startFresh}
        />
      ) : null}

      <section className="survey-intro-page__card">
        <h2>응답 전 확인해주세요.</h2>
        <ul>
          <li>약 7~10분 정도 소요될 수 있습니다.</li>
          <li>내가 경험한 항목만 답하면 됩니다.</li>
          <li>시설 관련 의견은 사진이나 도면 위에 위치를 표시할 수 있습니다.</li>
          <li>제출 전 언제든 검토하고 수정할 수 있습니다.</li>
        </ul>
      </section>

      <section className="survey-intro-page__card">
        <h2>언어</h2>
        <div className="survey-intro-page__locale">
          <button type="button" className={displayLocale === 'ko' ? 'is-selected' : ''} onClick={() => setLocale('ko')}>
            한국어
          </button>
          <button type="button" className={displayLocale === 'en' ? 'is-selected' : ''} onClick={() => setLocale('en')}>
            English
          </button>
        </div>
      </section>

      <section className="survey-intro-page__sections">
        <h2>진행할 섹션</h2>
        {survey.sections.map((section, index) => (
          <Link key={section.id} to={`/survey/${publicSlug}/sections/${section.sectionKey}`}>
            <span>{index + 1}</span>
            {readLocalizedText(section.title, displayLocale, defaultLocale)}
          </Link>
        ))}
      </section>

      <div className="survey-intro-page__bottom">
        <Button fullWidth onClick={startFresh}>
          {draft ? '새로 시작하기' : '첫 섹션으로 이동'}
        </Button>
      </div>
    </main>
  );
}
