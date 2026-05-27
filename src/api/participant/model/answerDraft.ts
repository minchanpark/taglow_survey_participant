import type { MetricType, QuestionType } from './question';

export type AnswerType = QuestionType;

export type ImageTagPoint = Readonly<{
  assetId: string;
  xRatio: number;
  yRatio: number;
  tagType: string;
  severity?: number;
  textValue: string;
}>;

export type AnswerDraft = Readonly<{
  questionId: string;
  answerType: AnswerType;
  metricType?: MetricType;
  scoreValue?: number;
  textValue?: string;
  choiceValue?: string;
  valueJson?: Record<string, unknown>;
  tagPoints?: ImageTagPoint[];
}>;

export type AnswerInput = Readonly<{
  surveyId: string;
  sectionId: string;
  questionId: string;
  answerType: AnswerType;
  metricType?: MetricType;
  topicKey?: string;
  spaceKey?: string;
  scoreValue?: number;
  textValue?: string;
  choiceValue?: string;
  assetId?: string;
  tagPosition?: Readonly<{
    xRatio: number;
    yRatio: number;
  }>;
  tagType?: string;
  severity?: number;
  valueJson?: Record<string, unknown>;
}>;

