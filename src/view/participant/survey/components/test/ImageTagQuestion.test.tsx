import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { PublicQuestion } from '../../../../../api/participant';
import { publishedSurveyFixture } from '../../../../../test/fixtures/publicSurveyFixture';
import { renderWithProviders } from '../../../../../test/renderWithProviders';
import { ImageTagQuestion } from '../ImageTagQuestion';

describe('ImageTagQuestion', () => {
  const question: PublicQuestion = {
    id: 'question-image',
    surveyId: 'survey-1',
    sectionId: 'section-facility',
    questionKey: 'facility_image_tag',
    questionType: 'image_tag',
    title: { ko: '사진에서 위치를 선택해주세요.' },
    orderIndex: 0,
    isRequired: false,
    metricType: 'none',
    config: {
      assetId: 'asset-1',
      maxTags: 2,
      tagTypes: ['냉난방', '소음'],
    },
    validation: {},
  };

  it('uses admin-configured tag categories for image tag points', async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <ImageTagQuestion
        question={question}
        assets={publishedSurveyFixture.assets}
        locale="ko"
        fallbackLocale="ko"
        value={{}}
        onChange={onChange}
      />,
    );

    fireEvent.pointerDown(await screen.findByRole('img', { name: '위치를 선택할 시설 이미지' }), {
      clientX: 10,
      clientY: 10,
    });

    expect(onChange).toHaveBeenCalledWith({
      points: [
        expect.objectContaining({
          tagType: '냉난방',
        }),
      ],
    });
  });

  it('renders only admin-configured tag categories in the editor', async () => {
    renderWithProviders(
      <ImageTagQuestion
        question={question}
        assets={publishedSurveyFixture.assets}
        locale="ko"
        fallbackLocale="ko"
        value={{
          points: [
            {
              assetId: 'asset-1',
              xRatio: 0.5,
              yRatio: 0.5,
              tagType: '냉난방',
              textValue: '',
            },
          ],
        }}
        onChange={vi.fn()}
      />,
    );

    expect(await screen.findByRole('button', { name: '냉난방' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '소음' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '위험' })).not.toBeInTheDocument();
  });
});
