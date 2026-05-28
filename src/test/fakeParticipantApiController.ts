import type {
  DuplicateSubmissionCommand,
  DuplicateSubmissionResult,
  ParticipantApiController,
  ParticipantSession,
  PublicSurvey,
  SignInCommand,
  SubmissionCommand,
  SubmissionResult,
  SurveyAccessResult,
  SurveyAsset,
} from '../api/participant';
import { publishedSurveyFixture } from './fixtures/publicSurveyFixture';

type FakeControllerOverrides = Partial<{
  session: ParticipantSession | null;
  survey: PublicSurvey;
  duplicate: DuplicateSubmissionResult;
  submitResult: SubmissionResult;
}>;

export function createFakeParticipantApiController(overrides: FakeControllerOverrides = {}): ParticipantApiController {
  const session = Object.hasOwn(overrides, 'session') ? overrides.session ?? null : { userId: 'user-1', email: 'student@handong.ac.kr' };
  const survey = overrides.survey ?? publishedSurveyFixture;
  const duplicate = overrides.duplicate ?? { alreadySubmitted: false };
  const submitResult = overrides.submitResult ?? { responseId: 'response-1', submittedAt: '2026-05-28T00:00:00.000Z' };

  return {
    async getCurrentSession() {
      return session;
    },
    async signInWithGoogle(_command: SignInCommand) {
      return undefined;
    },
    async signOut() {
      return undefined;
    },
    async getPublicSurvey() {
      return survey;
    },
    async checkAccess(): Promise<SurveyAccessResult> {
      if (!session) {
        return { status: 'unauthenticated', survey };
      }

      if (duplicate.alreadySubmitted) {
        return { status: 'already_submitted', survey, session, submittedResponseId: duplicate.responseId };
      }

      return { status: 'allowed', survey, session };
    },
    async checkDuplicateSubmission(_command: DuplicateSubmissionCommand) {
      return duplicate;
    },
    async getAssetUrl(_asset: SurveyAsset) {
      return 'https://example.com/asset.jpg';
    },
    async submitSurvey(_command: SubmissionCommand) {
      return submitResult;
    },
  };
}
