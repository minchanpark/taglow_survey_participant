import type { PropsWithChildren } from 'react';

import type { Locale, PublicQuestion } from '../../../../api/participant';
import { readLocalizedText } from '../../../../utils/i18nText';
import './QuestionShell.css';

type QuestionShellProps = PropsWithChildren<{
  question: PublicQuestion;
  locale: Locale;
  fallbackLocale: Locale;
  error?: string;
}>;

export function QuestionShell({ question, locale, fallbackLocale, error, children }: QuestionShellProps) {
  return (
    <section className="question-shell" aria-labelledby={`${question.id}-title`}>
      <div className="question-shell__header">
        <h2 id={`${question.id}-title`}>
          {readLocalizedText(question.title, locale, fallbackLocale)}
          {question.isRequired ? <span aria-label="필수"> *</span> : null}
        </h2>
        {question.description ? <p>{readLocalizedText(question.description, locale, fallbackLocale)}</p> : null}
      </div>
      {children}
      {error ? <p className="question-shell__error">{error}</p> : null}
    </section>
  );
}
