import type { LocalizedText } from './publicSurvey';
import type { PublicQuestion } from './question';

export type PublicSurveySection = Readonly<{
  id: string;
  surveyId: string;
  sectionKey: string;
  title: LocalizedText;
  description?: LocalizedText;
  orderIndex: number;
  sectionType: string;
  settings: Record<string, unknown>;
  questions: PublicQuestion[];
}>;

