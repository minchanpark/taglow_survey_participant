import { useQuery } from '@tanstack/react-query';

import { useParticipantApiController } from '../controller/participantApiControllerProvider';
import { participantQueryKeys } from './queryKeys';

export function useDuplicateSubmissionQuery(args: {
  surveyId?: string;
  participantUserId?: string;
}) {
  const controller = useParticipantApiController();
  const surveyId = args.surveyId ?? '';
  const participantUserId = args.participantUserId ?? '';

  return useQuery({
    queryKey: participantQueryKeys.duplicateSubmission(surveyId, participantUserId),
    queryFn: () =>
      controller.checkDuplicateSubmission({
        surveyId,
        participantUserId,
      }),
    enabled: Boolean(args.surveyId && args.participantUserId),
  });
}

