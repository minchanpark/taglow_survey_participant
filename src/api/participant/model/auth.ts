import type { PublicSurvey } from './publicSurvey';

export type ParticipantSession = Readonly<{
  userId: string;
  email: string;
}>;

export type SurveyAccessStatus =
  | 'allowed'
  | 'unauthenticated'
  | 'not_handong_email'
  | 'survey_not_found'
  | 'survey_closed'
  | 'already_submitted';

export type SurveyAccessResult = Readonly<{
  status: SurveyAccessStatus;
  survey?: PublicSurvey;
  session?: ParticipantSession;
  submittedResponseId?: string;
}>;
