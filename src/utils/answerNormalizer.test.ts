import { describe, expect, it } from 'vitest';

import { publishedSurveyFixture } from '../test/fixtures/publicSurveyFixture';
import { buildSubmissionAnswers, extractRespondentProfile } from './answerNormalizer';

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

  it('aggregates individual profile question answers into respondent profile columns', () => {
    const profileSurvey = {
      ...publishedSurveyFixture,
      sections: [
        {
          ...publishedSurveyFixture.sections[0],
          questions: [
            {
              ...publishedSurveyFixture.sections[0].questions[0],
              id: 'question-gender',
              questionKey: 'gender',
              title: { ko: '성별' },
            },
            {
              ...publishedSurveyFixture.sections[0].questions[0],
              id: 'question-semester',
              questionKey: 'semester_group',
              title: { ko: '학기' },
              orderIndex: 1,
            },
          ],
        },
      ],
    };
    const values = {
      'question-gender': { gender: 'female' },
      'question-semester': { semesterGroup: '3_4' },
    };

    expect(extractRespondentProfile(profileSurvey, values)).toEqual(
      expect.objectContaining({
        gender: 'female',
        semesterGroup: '3_4',
      }),
    );
    expect(buildSubmissionAnswers(profileSurvey, values)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          questionId: 'question-gender',
          answerType: 'profile',
          valueJson: { gender: 'female' },
        }),
        expect.objectContaining({
          questionId: 'question-semester',
          answerType: 'profile',
          valueJson: { semesterGroup: '3_4' },
        }),
      ]),
    );
  });
});
