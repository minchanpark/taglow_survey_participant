import type { AnswerInput } from '../../model/answerDraft';
import type { PublicQuestion } from '../../model/question';

export type AttentionCheckValidationResult = Readonly<{
  passed: boolean;
  expectedValue?: string | number;
  actualValue?: string | number;
}>;

export function validateAttentionCheck(args: {
  question: PublicQuestion;
  answer: AnswerInput;
}): AttentionCheckValidationResult {
  const expectedValue = args.question.config.expectedValue;
  const actualValue = args.answer.choiceValue ?? args.answer.scoreValue;

  return {
    expectedValue,
    actualValue,
    passed: expectedValue === undefined || actualValue === expectedValue,
  };
}

