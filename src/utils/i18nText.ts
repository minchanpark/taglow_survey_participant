import type { Locale, LocalizedText, PublicSurvey } from '../api/participant';
import type { QuestionOption } from '../api/participant/model/question';

export function readLocalizedText(
  text: LocalizedText | undefined,
  locale: Locale,
  fallbackLocale: Locale = 'ko',
): string {
  if (!text) {
    return '';
  }

  return text[locale] ?? text[fallbackLocale] ?? text.ko ?? text.en ?? '';
}

export function resolveSurveyDefaultLocale(survey: PublicSurvey | undefined): Locale {
  const defaultLocale = survey?.settings.defaultLocale ?? survey?.settings.default_locale;
  return defaultLocale === 'en' ? 'en' : 'ko';
}

export function readOptionLabel(option: QuestionOption, locale: Locale, fallbackLocale: Locale = 'ko'): string {
  return readLocalizedText(option.label, locale, fallbackLocale) || option.value;
}
