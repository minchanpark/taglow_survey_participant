import { useParams } from 'react-router-dom';

import { ButtonLink } from '../../../components/Button';
import { Message } from '../../../components/Message';
import './css/SurveyCompletePage.css';

export function SurveyCompletePage() {
  const { publicSlug = '' } = useParams();

  return (
    <main className="survey-complete-page">
      <section className="survey-complete-page__content">
        <p className="survey-complete-page__eyebrow">제출 완료</p>
        <h1>응답이 제출되었습니다.</h1>
        <p>남겨주신 의견은 개선 우선순위와 보고 자료를 만드는 데 활용됩니다.</p>
        <Message tone="success" title="참여해주셔서 감사합니다.">
          <p>제출 내용 수정이 필요한 경우 담당자에게 문의해주세요.</p>
        </Message>
        <ButtonLink variant="secondary" href={`/survey/${publicSlug}`}>
          설문 첫 화면으로
        </ButtonLink>
      </section>
    </main>
  );
}
