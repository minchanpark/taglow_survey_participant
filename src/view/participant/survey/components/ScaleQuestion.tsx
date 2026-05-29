import { QuestionShell } from './QuestionShell';
import type { QuestionComponentProps } from './questionComponentTypes';
import { LowScoreFollowUp } from './LowScoreFollowUp';
import './css/ScaleQuestion.css';

type ScaleValue = {
  scoreValue?: number;
  lowScoreReason?: string;
  lowScoreText?: string;
};

export function ScaleQuestion(props: QuestionComponentProps<unknown>) {
  const value = readScaleValue(props.value);
  const threshold = typeof props.question.config.lowScoreThreshold === 'number' ? props.question.config.lowScoreThreshold : 2;

  return (
    <QuestionShell question={props.question} locale={props.locale} fallbackLocale={props.fallbackLocale} error={props.error}>
      <div className="scale-question">
        <div className="scale-question__labels">
          <span>1 매우 낮음</span>
          <span>5 매우 높음</span>
        </div>
        <div className="scale-question__buttons">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              className={value.scoreValue === score ? 'is-selected' : ''}
              onClick={() => props.onChange(score <= threshold ? { ...value, scoreValue: score } : { scoreValue: score })}
            >
              {score}
            </button>
          ))}
        </div>
        <LowScoreFollowUp
          scoreValue={value.scoreValue}
          threshold={threshold}
          reason={value.lowScoreReason}
          text={value.lowScoreText}
          onChange={(next) => props.onChange({ ...value, ...next })}
        />
      </div>
    </QuestionShell>
  );
}

function readScaleValue(value: unknown): ScaleValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as ScaleValue) : {};
}
