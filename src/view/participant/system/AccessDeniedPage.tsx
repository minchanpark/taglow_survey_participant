import { useParams } from 'react-router-dom';

import { SystemStatePage } from './SystemStatePage';
import './AccessDeniedPage.css';

export function AccessDeniedPage() {
  const { publicSlug = '' } = useParams();

  return (
    <SystemStatePage
      eyebrow="접근 제한"
      title="학교 Google 계정으로 다시 로그인해주세요."
      description="이 설문은 한동대학교 계정(@handong.ac.kr)으로만 참여할 수 있습니다."
      actionHref={`/survey/${publicSlug}/login`}
      actionLabel="다시 로그인하기"
    />
  );
}
