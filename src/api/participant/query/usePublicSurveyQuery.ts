import { useQuery } from '@tanstack/react-query';

import { useParticipantApiController } from '../controller/participantApiControllerProvider';
import { participantQueryKeys } from './queryKeys';
import { useParticipantSessionQuery } from './useParticipantSessionQuery';

export function usePublicSurveyQuery(publicSlug: string | undefined) {
  const controller = useParticipantApiController();
  const sessionQuery = useParticipantSessionQuery();
  const authScope = sessionQuery.data?.userId ?? 'anonymous';

  return useQuery({
    queryKey: participantQueryKeys.publicSurvey(publicSlug ?? '', authScope),
    queryFn: () => controller.getPublicSurvey(publicSlug ?? ''),
    enabled: Boolean(publicSlug) && !sessionQuery.isPending,
  });
}
