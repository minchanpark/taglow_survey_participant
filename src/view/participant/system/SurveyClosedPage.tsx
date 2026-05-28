import { useParams } from 'react-router-dom';

import { SystemStatePage } from './SystemStatePage';
import './css/SurveyClosedPage.css';

export function SurveyClosedPage() {
  const { publicSlug = '' } = useParams();

  return (
    <SystemStatePage
      eyebrow="응답 종료"
      title="지금은 응답할 수 없는 설문입니다."
      description="설문이 종료되었거나 아직 공개되지 않았습니다."
      actionHref={`/survey/${publicSlug}`}
      actionLabel="설문 상태 다시 확인"
    />
  );
}
