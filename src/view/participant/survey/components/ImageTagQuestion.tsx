import { useRef } from 'react';

import type { ImageTagPoint } from '../../../../api/participant';
import { useAssetUrlQuery } from '../../../../api/participant';
import { Button } from '../../../../components/Button';
import { calculateImageRatio } from '../../../../utils/imageRatio';
import { QuestionShell } from './QuestionShell';
import { getImageTagOptions } from './imageTagOptions';
import type { QuestionComponentProps } from './questionComponentTypes';
import './css/ImageTagQuestion.css';

type ImageTagValue = {
  points?: ImageTagPoint[];
};

export function ImageTagQuestion(props: QuestionComponentProps<unknown>) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const value = readImageTagValue(props.value);
  const points = value.points ?? [];
  const tagTypes = getImageTagOptions(props.question, props.locale, props.fallbackLocale);
  const asset =
    props.assets.find((item) => item.id === props.question.config.assetId) ??
    props.assets.find((item) => item.questionId === props.question.id || item.sectionId === props.question.sectionId);
  const assetUrlQuery = useAssetUrlQuery(asset);
  const maxTags = props.question.config.maxTags ?? props.question.validation.maxSelections ?? 5;

  const updatePoint = (index: number, patch: Partial<ImageTagPoint>) => {
    props.onChange({
      points: points.map((point, pointIndex) => (pointIndex === index ? { ...point, ...patch } : point)),
    });
  };

  const deletePoint = (index: number) => {
    props.onChange({ points: points.filter((_, pointIndex) => pointIndex !== index) });
  };

  const addPoint = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!asset || !imageRef.current || points.length >= maxTags) {
      return;
    }

    const ratio = calculateImageRatio({ clientX: event.clientX, clientY: event.clientY }, imageRef.current.getBoundingClientRect());
    props.onChange({
      points: [
        ...points,
        {
          assetId: asset.id,
          xRatio: ratio.xRatio,
          yRatio: ratio.yRatio,
          tagType: tagTypes[0].value,
          severity: 2,
          textValue: '',
        },
      ],
    });
  };

  return (
    <QuestionShell question={props.question} locale={props.locale} fallbackLocale={props.fallbackLocale} error={props.error}>
      <div className="image-tag-question">
        <p>사진에서 불편하거나 개선이 필요한 위치를 눌러주세요.</p>
        {!asset ? <p className="image-tag-question__error">연결된 이미지를 찾을 수 없습니다.</p> : null}
        {assetUrlQuery.isError ? <p className="image-tag-question__error">이미지를 불러오지 못했습니다. 다시 시도해주세요.</p> : null}
        <div className="image-tag-question__canvas">
          {assetUrlQuery.data ? (
            <>
              <img ref={imageRef} src={assetUrlQuery.data} alt="위치를 선택할 시설 이미지" onPointerDown={addPoint} />
              {points.map((point, index) => (
                <button
                  key={`${point.xRatio}-${point.yRatio}-${index}`}
                  type="button"
                  className="image-tag-question__pin"
                  style={{ left: `${point.xRatio * 100}%`, top: `${point.yRatio * 100}%` }}
                  aria-label={`${index + 1}번 위치`}
                >
                  {index + 1}
                </button>
              ))}
            </>
          ) : (
            <div className="image-tag-question__placeholder">이미지를 준비하고 있습니다.</div>
          )}
        </div>
        <p className="image-tag-question__count">
          {points.length}/{maxTags}개 위치
        </p>
        <div className="image-tag-question__points">
          {points.map((point, index) => (
            <article key={`${point.assetId}-${index}`}>
              <h3>{index + 1}번 위치</h3>
              <div className="image-tag-question__chips">
                {tagTypes.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={point.tagType === item.value ? 'is-selected' : ''}
                    onClick={() => updatePoint(index, { tagType: item.value })}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <label>
                <span>심각도</span>
                <select value={point.severity ?? 2} onChange={(event) => updatePoint(index, { severity: Number(event.target.value) })}>
                  <option value={1}>낮음</option>
                  <option value={2}>보통</option>
                  <option value={3}>높음</option>
                </select>
              </label>
              <textarea
                value={point.textValue}
                placeholder="어떤 부분인지 짧게 적어주세요."
                onChange={(event) => updatePoint(index, { textValue: event.target.value })}
              />
              <Button type="button" variant="danger" onClick={() => deletePoint(index)}>
                삭제
              </Button>
            </article>
          ))}
        </div>
      </div>
    </QuestionShell>
  );
}

function readImageTagValue(value: unknown): ImageTagValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as ImageTagValue) : {};
}
