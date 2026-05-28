import { useParams } from 'react-router-dom';

import { SystemStatePage } from './SystemStatePage';
import './css/SurveyNotFoundPage.css';

export function SurveyNotFoundPage() {
  const { publicSlug } = useParams();

  return (
    <SystemStatePage
      eyebrow="설문 없음"
      title="설문을 찾을 수 없습니다."
      description="주소가 잘못되었거나 공개되지 않은 설문일 수 있습니다."
      actionHref={publicSlug ? `/survey/${publicSlug}` : '/'}
      actionLabel="다시 확인하기"
    />
  );
}
