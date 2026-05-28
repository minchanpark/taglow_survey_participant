export const participantQueryKeys = {
  session: ['participant', 'session'] as const,
  publicSurvey: (publicSlug: string, authScope: string = 'unknown') =>
    ['participant', 'survey', publicSlug, authScope] as const,
  duplicateSubmission: (surveyId: string, participantUserId: string) =>
    ['participant', 'survey', surveyId, 'duplicate', participantUserId] as const,
  assetUrl: (assetId: string) => ['participant', 'assetUrl', assetId] as const,
};
