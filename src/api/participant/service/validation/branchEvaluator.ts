export type BranchOperator = 'eq' | 'neq' | 'in' | 'not_in' | 'lt' | 'lte' | 'gt' | 'gte';

export type BranchRule = Readonly<{
  questionKey: string;
  operator: BranchOperator;
  value: unknown;
}>;

export function evaluateBranchRule(args: {
  rule: BranchRule;
  values: Record<string, unknown>;
}): boolean {
  const actual = args.values[args.rule.questionKey];
  const expected = args.rule.value;

  switch (args.rule.operator) {
    case 'eq':
      return actual === expected;
    case 'neq':
      return actual !== expected;
    case 'in':
      return Array.isArray(expected) && expected.includes(actual);
    case 'not_in':
      return Array.isArray(expected) && !expected.includes(actual);
    case 'lt':
      return compareNumber(actual, expected, (a, b) => a < b);
    case 'lte':
      return compareNumber(actual, expected, (a, b) => a <= b);
    case 'gt':
      return compareNumber(actual, expected, (a, b) => a > b);
    case 'gte':
      return compareNumber(actual, expected, (a, b) => a >= b);
    default:
      return false;
  }
}

function compareNumber(actual: unknown, expected: unknown, compare: (actual: number, expected: number) => boolean): boolean {
  if (typeof actual !== 'number' || typeof expected !== 'number') {
    return false;
  }

  return compare(actual, expected);
}

