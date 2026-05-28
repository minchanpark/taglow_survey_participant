import { describe, expect, it } from 'vitest';

import { publishedSurveyFixture } from '../test/fixtures/publicSurveyFixture';
import { buildSubmissionAnswers } from './answerNormalizer';

describe('buildSubmissionAnswers', () => {
  it('normalizes scale and multi-select form values into submission answers', () => {
    const answers = buildSubmissionAnswers(publishedSurveyFixture, {
      'question-scale': {
        scoreValue: 2,
        lowScoreReason: 'low_quality',
        lowScoreText: '자주 고장납니다.',
      },
      'question-multi': {
        selectedOptions: ['cleanliness', 'quantity'],
      },
    });

    expect(answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          surveyId: 'survey-1',
          sectionId: 'section-facility',
          questionId: 'question-scale',
          answerType: 'scale',
          scoreValue: 2,
          topicKey: 'laundry',
          valueJson: {
            low_score_reason: 'low_quality',
            low_score_text: '자주 고장납니다.',
          },
        }),
        expect.objectContaining({
          questionId: 'question-multi',
          answerType: 'multi_select',
          valueJson: {
            selectedOptions: ['cleanliness', 'quantity'],
            otherText: null,
          },
        }),
      ]),
    );
  });
});
