import { useQuery } from '@tanstack/react-query';

import { useParticipantApiController } from '../controller/participantApiControllerProvider';
import { participantQueryKeys } from './queryKeys';

export function useParticipantSessionQuery() {
  const controller = useParticipantApiController();

  return useQuery({
    queryKey: participantQueryKeys.session,
    queryFn: () => controller.getCurrentSession(),
  });
}

