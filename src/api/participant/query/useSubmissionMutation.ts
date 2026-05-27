import { useMutation } from '@tanstack/react-query';

import { useParticipantApiController } from '../controller/participantApiControllerProvider';
import type { SubmissionCommand } from '../model/submission';

export function useSubmissionMutation() {
  const controller = useParticipantApiController();

  return useMutation({
    mutationFn: (command: SubmissionCommand) => controller.submitSurvey(command),
  });
}

