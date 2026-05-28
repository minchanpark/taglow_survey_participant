import { QuestionShell } from './QuestionShell';
import type { QuestionComponentProps } from './questionComponentTypes';
import './TextQuestion.css';

type TextValue = {
  topicValue?: string;
  spaceValue?: string;
  opinionType?: string;
  textValue?: string;
};

const opinionTypes = [
  { value: 'discomfort', label: '불편' },
  { value: 'improvement', label: '개선' },
  { value: 'praise', label: '칭찬' },
  { value: 'question', label: '문의' },
  { value: 'other', label: '기타' },
];

export function TextQuestion(props: QuestionComponentProps<unknown>) {
  const value = readTextValue(props.value);

  return (
    <QuestionShell question={props.question} locale={props.locale} fallbackLocale={props.fallbackLocale} error={props.error}>
      <div className="text-question">
        <div className="text-question__chips" aria-label="의견 유형">
          {opinionTypes.map((item) => (
            <button
              key={item.value}
              type="button"
              className={value.opinionType === item.value ? 'is-selected' : ''}
              onClick={() => props.onChange({ ...value, opinionType: item.value })}
            >
              {item.label}
            </button>
          ))}
        </div>
        <textarea
          value={value.textValue ?? ''}
          placeholder="의견을 한 문장 이상 적어주세요."
          onChange={(event) => props.onChange({ ...value, textValue: event.target.value })}
        />
      </div>
    </QuestionShell>
  );
}

function readTextValue(value: unknown): TextValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as TextValue) : {};
}
