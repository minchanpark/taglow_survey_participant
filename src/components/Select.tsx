import type { SelectHTMLAttributes } from 'react';

import './css/Select.css';

type SelectOption = Readonly<{
  value: string;
  label: string;
}>;

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
};

export function Select({ label, options, helperText, error, id, ...selectProps }: SelectProps) {
  const selectId = id ?? selectProps.name ?? label;

  return (
    <label className="ui-select" htmlFor={selectId}>
      <span className="ui-select__label">{label}</span>
      <select id={selectId} className="ui-select__control" aria-invalid={Boolean(error)} {...selectProps}>
        <option value="">선택해주세요</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="ui-select__error">{error}</span> : null}
      {!error && helperText ? <span className="ui-select__helper">{helperText}</span> : null}
    </label>
  );
}
