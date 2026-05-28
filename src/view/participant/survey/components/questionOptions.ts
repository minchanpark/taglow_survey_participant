import type { Locale, PublicQuestion, QuestionOption } from '../../../../api/participant';
import { readOptionLabel } from '../../../../utils/i18nText';

export function getQuestionOptions(question: PublicQuestion): QuestionOption[] {
  return Array.isArray(question.config.options) ? question.config.options : [];
}

export function getDisplayOptions(question: PublicQuestion, locale: Locale, fallbackLocale: Locale) {
  return getQuestionOptions(question).map((option) => ({
    value: option.value,
    label: readOptionLabel(option, locale, fallbackLocale),
  }));
}

export function getDefaultOptions(questionType: PublicQuestion['questionType']) {
  switch (questionType) {
    case 'experience':
      return [
        { value: 'used', label: '이용해봤다' },
        { value: 'heard_not_used', label: '들어봤지만 이용하지 않았다' },
        { value: 'never_heard', label: '처음 들어봤다' },
        { value: 'not_applicable', label: '해당 없음' },
      ];
    default:
      return [];
  }
}
