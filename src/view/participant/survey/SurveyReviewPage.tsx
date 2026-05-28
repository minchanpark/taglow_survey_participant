import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ParticipantApiError, useParticipantSessionQuery, usePublicSurveyQuery, useSubmissionMutation } from '../../../api/participant';
import { LocalStorageDraftStorage } from '../../../api/participant/service/draft/localStorageDraftStorage';
import { Button, ButtonLink } from '../../../components/Button';
import { Message } from '../../../components/Message';
import { useParticipantDraftStore } from '../../../store/participantDraftStore';
import { useParticipantLocaleStore } from '../../../store/participantLocaleStore';
import { useParticipantProgressStore } from '../../../store/participantProgressStore';
import { buildSubmissionAnswers, extractRespondentProfile, findMissingRequiredQuestions } from '../../../utils/answerNormalizer';
import { buildDraftKey } from '../../../utils/draftKey';
import { readLocalizedText, resolveSurveyDefaultLocale } from '../../../utils/i18nText';
import './SurveyReviewPage.css';

export function SurveyReviewPage() {
  const { publicSlug = '' } = useParams();
  const navigate = useNavigate();
  const surveyQuery = usePublicSurveyQuery(publicSlug);
  const sessionQuery = useParticipantSessionQuery();
  const submitMutation = useSubmissionMutation();
  const survey = surveyQuery.data;
  const session = sessionQuery.data;
  const { values, clearDraftValues } = useParticipantDraftStore();
  const { locale } = useParticipantLocaleStore();
  const { setReviewVisited } = useParticipantProgressStore();
  const storage = useMemo(() => new LocalStorageDraftStorage(), []);
  const defaultLocale = resolveSurveyDefaultLocale(survey);
  const displayLocale = locale ?? defaultLocale;

  if (!survey || !session) {
    return null;
  }

  const missingBySection = survey.sections.map((section) => ({
    section,
    missing: findMissingRequiredQuestions(section, values),
  }));
  const missingTotal = missingBySection.reduce((sum, item) => sum + item.missing.length, 0);
  const imageTagCount = Object.values(values).reduce<number>((sum, value) => {
    if (typeof value !== 'object' || value === null || !('points' in value)) {
      return sum;
    }

    const points = (value as { points?: unknown }).points;
    return sum + (Array.isArray(points) ? points.length : 0);
  }, 0);

  const submit = async () => {
    setReviewVisited(true);

    if (missingTotal > 0) {
      return;
    }

    try {
      await submitMutation.mutateAsync({
        surveyId: survey.id,
        participantUserId: session.userId,
        participantEmail: session.email,
        locale: displayLocale,
        profile: extractRespondentProfile(survey, values),
        answers: buildSubmissionAnswers(survey, values),
        rawPayload: values,
      });
      await storage.removeDraft(buildDraftKey({ surveyId: survey.id, participantUserId: session.userId }));
      clearDraftValues();
      navigate(`/survey/${publicSlug}/complete`);
    } catch (error) {
      if (error instanceof ParticipantApiError && error.code === 'ALREADY_SUBMITTED') {
        navigate(`/survey/${publicSlug}/already-submitted`);
      }
    }
  };

  return (
    <main className="survey-review-page">
      <header className="survey-review-page__header">
        <p>제출 전 검토</p>
        <h1>응답 내용을 확인해주세요.</h1>
      </header>

      {missingTotal > 0 ? (
        <Message tone="warning" title={`${missingTotal}개의 필수 문항이 남아 있습니다.`}>
          <p>누락된 섹션으로 이동해 답변을 완료해주세요.</p>
        </Message>
      ) : (
        <Message tone="success" title="필수 문항을 모두 답했습니다.">
          <p>제출 후에는 이 화면에서 수정할 수 없습니다.</p>
        </Message>
      )}

      <section className="survey-review-page__summary">
        <div>
          <span>{survey.sections.length}</span>
          <p>섹션</p>
        </div>
        <div>
          <span>{buildSubmissionAnswers(survey, values).length}</span>
          <p>응답</p>
        </div>
        <div>
          <span>{imageTagCount}</span>
          <p>위치 표시</p>
        </div>
      </section>

      <section className="survey-review-page__sections">
        {missingBySection.map(({ section, missing }) => (
          <article key={section.id}>
            <div>
              <h2>{readLocalizedText(section.title, displayLocale, defaultLocale)}</h2>
              <p>{missing.length > 0 ? `${missing.length}개 문항이 남아 있습니다.` : '완료되었습니다.'}</p>
            </div>
            <ButtonLink variant={missing.length > 0 ? 'secondary' : 'tertiary'} href={`/survey/${publicSlug}/sections/${section.sectionKey}`}>
              {missing.length > 0 ? '답변하기' : '수정'}
            </ButtonLink>
          </article>
        ))}
      </section>

      {submitMutation.isError ? (
        <Message tone="error" title="제출하지 못했습니다.">
          <p>네트워크 상태를 확인한 뒤 다시 시도해주세요. 작성 중인 응답은 유지됩니다.</p>
        </Message>
      ) : null}

      <div className="survey-review-page__bottom">
        <Button fullWidth disabled={submitMutation.isPending || missingTotal > 0} onClick={submit}>
          {submitMutation.isPending ? '제출 중' : '최종 제출'}
        </Button>
      </div>
    </main>
  );
}
