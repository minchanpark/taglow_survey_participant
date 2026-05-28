import './css/ProgressBar.css';

type ProgressBarProps = {
  value: number;
  max: number;
  label?: string;
};

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const safeMax = Math.max(max, 1);
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const percent = Math.round((safeValue / safeMax) * 100);

  return (
    <div className="ui-progress" aria-label={label}>
      <div className="ui-progress__meta">
        {label ? <span>{label}</span> : <span>진행률</span>}
        <span>{percent}%</span>
      </div>
      <div className="ui-progress__track" aria-hidden="true">
        <div className="ui-progress__bar" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
