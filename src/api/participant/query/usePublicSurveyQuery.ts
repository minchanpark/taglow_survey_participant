import { useQuery } from '@tanstack/react-query';

import { useParticipantApiController } from '../controller/participantApiControllerProvider';
import { participantQueryKeys } from './queryKeys';

export function usePublicSurveyQuery(publicSlug: string | undefined) {
  const controller = useParticipantApiController();

  return useQuery({
    queryKey: participantQueryKeys.publicSurvey(publicSlug ?? ''),
    queryFn: () => controller.getPublicSurvey(publicSlug ?? ''),
    enabled: Boolean(publicSlug),
  });
}

