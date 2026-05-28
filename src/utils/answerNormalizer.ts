import type { AnswerInput, ImageTagPoint, PublicQuestion, PublicSurvey, PublicSurveySection, RespondentProfile } from '../api/participant';
import { validateAttentionCheck } from '../api/participant/service/validation/attentionCheckValidator';

export type NormalizedAnswerInput = Omit<AnswerInput, 'surveyId' | 'sectionId'>;

export function normalizeAnswerInput(question: PublicQuestion, value: unknown): NormalizedAnswerInput[] {
  if (!isAnsweredValue(question, value)) {
    return [];
  }

  const base = {
    questionId: question.id,
    answerType: question.questionType,
    metricType: question.metricType,
    topicKey: question.topicKey,
    spaceKey: question.spaceKey,
  };

  switch (question.questionType) {
    case 'profile':
      return [{ ...base, valueJson: readRecord(value) }];
    case 'experience':
      return [{ ...base, valueJson: readRecord(value) }];
    case 'scale': {
      const record = readRecord(value);
      return [
        {
          ...base,
          scoreValue: readNumber(record.scoreValue),
          valueJson: pickDefined({
            low_score_reason: readString(record.lowScoreReason),
            low_score_text: readString(record.lowScoreText),
          }),
        },
      ];
    }
    case 'single_choice':
      return [{ ...base, choiceValue: readString(value) }];
    case 'multi_select': {
      const record = readRecord(value);
      return [
        {
          ...base,
          valueJson: {
            selectedOptions: readStringArray(record.selectedOptions),
            otherText: readString(record.otherText) ?? null,
          },
        },
      ];
    }
    case 'ranking': {
      const record = readRecord(value);
      return [
        {
          ...base,
          valueJson: {
            rankedOptions: readRankingOptions(record.rankedOptions),
          },
        },
      ];
    }
    case 'text': {
      const record = readRecord(value);
      return [
        {
          ...base,
          textValue: readString(record.textValue),
          valueJson: pickDefined({
            topic_value: readString(record.topicValue),
            space_value: readString(record.spaceValue),
            opinion_type: readString(record.opinionType),
          }),
        },
      ];
    }
    case 'image_tag': {
      const points = readImageTagPoints(readRecord(value).points);
      return points.map((point) => ({
        ...base,
        assetId: point.assetId,
        tagPosition: {
          xRatio: point.xRatio,
          yRatio: point.yRatio,
        },
        tagType: point.tagType,
        severity: point.severity,
        textValue: point.textValue,
      }));
    }
    case 'attention_check': {
      const choiceValue = readString(value);
      const scoreValue = readNumber(value);
      const tentative: AnswerInput = {
        surveyId: question.surveyId,
        sectionId: question.sectionId,
        ...base,
        choiceValue,
        scoreValue,
      };
      const result = validateAttentionCheck({ question, answer: tentative });
      return [
        {
          ...base,
          choiceValue,
          scoreValue,
          valueJson: {
            expectedValue: result.expectedValue,
            actualValue: result.actualValue,
            passed: result.passed,
          },
        },
      ];
    }
    default:
      return [];
  }
}

export function buildSubmissionAnswers(survey: PublicSurvey, values: Record<string, unknown>): AnswerInput[] {
  return survey.sections.flatMap((section) =>
    section.questions.flatMap((question) =>
      normalizeAnswerInput(question, values[question.id]).map((answer) => ({
        surveyId: survey.id,
        sectionId: section.id,
        ...answer,
      })),
    ),
  );
}

export function extractRespondentProfile(survey: PublicSurvey, values: Record<string, unknown>): RespondentProfile {
  const profileQuestion = survey.sections.flatMap((section) => section.questions).find((question) => question.questionType === 'profile');
  const profile = readRecord(profileQuestion ? values[profileQuestion.id] : undefined);

  return {
    gender: readString(profile.gender),
    semesterGroup: readString(profile.semesterGroup),
    department: readString(profile.department),
    rc: readString(profile.rc),
    dormitory: readString(profile.dormitory),
    roomType: readString(profile.roomType),
    dormExperience: readString(profile.dormExperience),
    extra: pickDefined(profile),
  };
}

export function isAnsweredValue(question: PublicQuestion, value: unknown): boolean {
  switch (question.questionType) {
    case 'profile':
      return Object.values(readRecord(value)).some((item) => readString(item));
    case 'experience':
      return Boolean(readString(readRecord(value).experienceStatus));
    case 'scale':
      return typeof readNumber(readRecord(value).scoreValue) === 'number';
    case 'single_choice':
    case 'attention_check':
      return Boolean(readString(value)) || typeof readNumber(value) === 'number';
    case 'multi_select':
      return readStringArray(readRecord(value).selectedOptions).length > 0;
    case 'ranking':
      return readRankingOptions(readRecord(value).rankedOptions).length > 0;
    case 'text':
      return Boolean(readString(readRecord(value).textValue));
    case 'image_tag':
      return readImageTagPoints(readRecord(value).points).length > 0;
    default:
      return false;
  }
}

export function findMissingRequiredQuestions(section: PublicSurveySection, values: Record<string, unknown>): PublicQuestion[] {
  return section.questions.filter((question) => question.isRequired && !isAnsweredValue(question, values[question.id]));
}

function readRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function readNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.length > 0) : [];
}

function readRankingOptions(value: unknown): Array<{ rank: number; optionValue: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const record = readRecord(item);
      const rank = readNumber(record.rank);
      const optionValue = readString(record.optionValue);
      return rank && optionValue ? { rank, optionValue } : null;
    })
    .filter((item): item is { rank: number; optionValue: string } => Boolean(item));
}

function readImageTagPoints(value: unknown): ImageTagPoint[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
      const record = readRecord(item);
      const assetId = readString(record.assetId);
      const xRatio = readNumber(record.xRatio);
      const yRatio = readNumber(record.yRatio);
      const tagType = readString(record.tagType);
      const textValue = readString(record.textValue);

      if (!assetId || typeof xRatio !== 'number' || typeof yRatio !== 'number' || !tagType || !textValue) {
        return [];
      }

      const severity = readNumber(record.severity);
      const point: ImageTagPoint = {
        assetId,
        xRatio,
        yRatio,
        tagType,
        textValue,
      };

      return severity === undefined ? [point] : [{ ...point, severity }];
    });
}

function pickDefined(record: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined && value !== null && value !== ''));
}
