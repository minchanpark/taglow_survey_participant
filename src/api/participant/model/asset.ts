export type SurveyAsset = Readonly<{
  id: string;
  surveyId: string;
  sectionId?: string;
  questionId?: string;
  assetType: string;
  storageBucket: string;
  storagePath: string;
  metadata: Record<string, unknown>;
}>;

