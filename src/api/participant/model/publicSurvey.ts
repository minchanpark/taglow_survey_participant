import type { SurveyAsset } from './asset';
import type { PublicSurveySection } from './section';

export type Locale = 'ko' | 'en';

export type LocalizedText = Readonly<{
  ko?: string;
  en?: string;
}>;

export type SurveyStatus = 'published' | 'closed' | 'archived';

export type PublicSurveySettings = Readonly<Record<string, unknown>>;

export type PublicSurvey = Readonly<{
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
  publicSlug: string;
  status: SurveyStatus;
  settings: PublicSurveySettings;
  sections: PublicSurveySection[];
  assets: SurveyAsset[];
  publishedAt?: string;
  closedAt?: string;
}>;

