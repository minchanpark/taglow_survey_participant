import type { PublicQuestion } from '../../../../api/participant';

export type QuestionRenderBlock =
  | Readonly<{
      type: 'question';
      question: PublicQuestion;
    }>
  | Readonly<{
      type: 'scale_group';
      id: string;
      groupTitle: string;
      questions: PublicQuestion[];
    }>;

export function buildQuestionRenderBlocks(questions: PublicQuestion[]): QuestionRenderBlock[] {
  const blocks: QuestionRenderBlock[] = [];
  let index = 0;

  while (index < questions.length) {
    const question = questions[index];
    const groupTitle = readScaleDisplayGroup(question);

    if (!groupTitle) {
      blocks.push({ type: 'question', question });
      index += 1;
      continue;
    }

    const groupQuestions: PublicQuestion[] = [];
    let cursor = index;

    while (cursor < questions.length && readScaleDisplayGroup(questions[cursor]) === groupTitle) {
      groupQuestions.push(questions[cursor]);
      cursor += 1;
    }

    if (groupQuestions.length < 2) {
      blocks.push({ type: 'question', question });
      index += 1;
      continue;
    }

    blocks.push({
      type: 'scale_group',
      id: `${groupQuestions[0].id}-scale-group`,
      groupTitle,
      questions: groupQuestions,
    });
    index = cursor;
  }

  return blocks;
}

export function getQuestionRenderBlockId(block: QuestionRenderBlock): string {
  return block.type === 'scale_group' ? block.id : block.question.id;
}

function readScaleDisplayGroup(question: PublicQuestion): string | undefined {
  if (question.questionType !== 'scale') {
    return undefined;
  }

  const displayGroup = question.config.displayGroup;
  return typeof displayGroup === 'string' && displayGroup.trim().length > 0 ? displayGroup.trim() : undefined;
}
