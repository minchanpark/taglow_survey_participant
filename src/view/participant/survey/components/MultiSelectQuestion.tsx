import { QuestionShell } from './QuestionShell';
import type { QuestionComponentProps } from './questionComponentTypes';
import { getDisplayOptions } from './questionOptions';
import './MultiSelectQuestion.css';

type MultiSelectValue = {
  selectedOptions?: string[];
  otherText?: string;
};

export function MultiSelectQuestion(props: QuestionComponentProps<unknown>) {
  const value = readMultiSelectValue(props.value);
  const selectedOptions = value.selectedOptions ?? [];
  const options = getDisplayOptions(props.question, props.locale, props.fallbackLocale);
  const maxSelections = props.question.validation.maxSelections ?? props.question.config.maxSelections;

  const toggle = (optionValue: string) => {
    const isSelected = selectedOptions.includes(optionValue);
    if (!isSelected && typeof maxSelections === 'number' && selectedOptions.length >= maxSelections) {
      return;
    }

    props.onChange({
      ...value,
      selectedOptions: isSelected ? selectedOptions.filter((item) => item !== optionValue) : [...selectedOptions, optionValue],
    });
  };

  return (
    <QuestionShell question={props.question} locale={props.locale} fallbackLocale={props.fallbackLocale} error={props.error}>
      <div className="multi-select-question">
        <p>{maxSelections ? `최대 ${maxSelections}개까지 선택할 수 있습니다.` : '해당하는 항목을 모두 선택해주세요.'}</p>
        <div className="multi-select-question__chips">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={selectedOptions.includes(option.value) ? 'is-selected' : ''}
              onClick={() => toggle(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        {selectedOptions.includes('other') ? (
          <input
            value={value.otherText ?? ''}
            placeholder="기타 내용을 적어주세요."
            onChange={(event) => props.onChange({ ...value, otherText: event.target.value })}
          />
        ) : null}
      </div>
    </QuestionShell>
  );
}

function readMultiSelectValue(value: unknown): MultiSelectValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as MultiSelectValue) : {};
}
