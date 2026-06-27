// ---------------------------------------------------------------------------
// Public domain types
// ---------------------------------------------------------------------------

export type GameMode = 'pvp' | 'pvc' | 'tutorial';

export type QuestionType =
  | 'addition'
  | 'subtraction';

export type Difficulty = 'very_easy' | 'easy' | 'very_hard';

export type ArithmeticOperator = '+' | '-';

export type PromptPartKind = 'operand' | 'operator';

export type RandomSource = () => number;

export interface QuestionGenerationOptions {
  mode: GameMode;
  rng?: RandomSource;
  questionType?: QuestionType;
  difficulty?: Difficulty;
  forceDifficulty?: Difficulty;
  comebackEasyArmed?: boolean;
  cpuMediumQuestionChance?: number;
}

export interface RoundQuestionConfig {
  questionType: QuestionType;
  difficulty: Difficulty;
}

export interface PromptPart {
  kind: PromptPartKind;
  value: string;
  // Prompt-entry animation is intentionally not question truth. Prompts
  // stay immediate; future visual polish should stay presentation-only.
}

export interface GeneratedQuestion {
  questionType: QuestionType;
  difficulty: Difficulty;
  prompt: string;
  promptParts: readonly PromptPart[];
  expectedAnswer: number | string;
  operands?: readonly number[];
  operators?: readonly ArithmeticOperator[];
  // Note: Live Match wraps this with runtime fields (matchId, roomId, timestamps,
  // deadline). Keep those out of here — the generator owns prompt truth only.
}

export interface AnswerValidationResult {
  isCorrect: boolean;
  normalizedSubmittedAnswer: number | string | null;
  expectedAnswer: number | string;
}

interface WeightedOption<T> {
  value: T;
  weight: number;
}

// ---------------------------------------------------------------------------
// Question type selection weights
// ---------------------------------------------------------------------------

const QUESTION_TYPE_WEIGHTS: readonly WeightedOption<QuestionType>[] = [
  { value: 'addition', weight: 50 },
  { value: 'subtraction', weight: 50 },
];

// ---------------------------------------------------------------------------
// Public question generation API
// ---------------------------------------------------------------------------

export function selectRoundQuestionConfig(options: {
  mode: GameMode;
  rng?: RandomSource;
  difficulty?: Difficulty;
}): RoundQuestionConfig {
  const rng = options.rng ?? Math.random;
  const difficulty = options.difficulty ?? 'easy';

  return {
    questionType: selectQuestionType(options.mode, difficulty, rng),
    difficulty,
  };
}

// Pure question generator: Live Match calls this after round prep picks the
// type/difficulty. It knows nothing about rooms, sockets, sessions, HP, DEFEND,
// revenge, or persistence — it returns prompt truth and expected answers only.

export function generateQuestion(options: QuestionGenerationOptions): GeneratedQuestion {
  const rng = options.rng ?? Math.random;
  const difficulty = resolveDifficulty(options, rng);
  const questionType = options.questionType ?? selectQuestionType(options.mode, difficulty, rng);

  assertQuestionTypeAllowedForMode(options.mode, questionType);

  switch (questionType) {
    case 'addition':
      return generateAdditionQuestion(difficulty, rng, questionType);
    case 'subtraction':
      return generateSubtractionQuestion(difficulty, rng);
  }
}

export function validateAnswer(
  question: Pick<GeneratedQuestion, 'expectedAnswer'>,
  submittedAnswer: string,
): AnswerValidationResult {
  const normalizedSubmittedAnswer = normalizeSubmittedAnswer(
    submittedAnswer,
    typeof question.expectedAnswer,
  );

  return {
    isCorrect: normalizedSubmittedAnswer === question.expectedAnswer,
    normalizedSubmittedAnswer,
    expectedAnswer: question.expectedAnswer,
  };
}

// ---------------------------------------------------------------------------
// Mode and difficulty selection rules
// ---------------------------------------------------------------------------

function assertQuestionTypeAllowedForMode(mode: GameMode, questionType: QuestionType): void {
  if (mode === 'tutorial' && questionType !== 'addition') {
    throw new Error('Tutorial questions use addition only.');
  }
}

function selectQuestionType(mode: GameMode, _difficulty: Difficulty, rng: RandomSource): QuestionType {
  if (mode === 'tutorial') return 'addition';
  return pickWeighted(QUESTION_TYPE_WEIGHTS, rng);
}

function resolveDifficulty(options: QuestionGenerationOptions, _rng: RandomSource): Difficulty {
  return options.forceDifficulty ?? options.difficulty ?? 'easy';
}

// ---------------------------------------------------------------------------
// Standard arithmetic generators
// ---------------------------------------------------------------------------

function generateAdditionQuestion(
  difficulty: Difficulty,
  rng: RandomSource,
  questionType: QuestionType,
): GeneratedQuestion {
  const max = difficulty === 'very_easy' ? 10 : 20;
  const [left, right] = [randomInt(1, max, rng), randomInt(1, max, rng)];
  const operators: ArithmeticOperator[] = ['+'];

  return buildArithmeticQuestion({
    questionType,
    difficulty,
    operands: [left, right],
    operators,
    expectedAnswer: left + right,
  });
}

function generateSubtractionQuestion(difficulty: Difficulty, rng: RandomSource): GeneratedQuestion {
  const max = difficulty === 'very_easy' ? 10 : 20;
  const [left, right] = [randomInt(1, max, rng), randomInt(1, max, rng)];
  const operators: ArithmeticOperator[] = ['-'];

  return buildArithmeticQuestion({
    questionType: 'subtraction',
    difficulty,
    operands: [left, right],
    operators,
    expectedAnswer: left - right,
  });
}

// ---------------------------------------------------------------------------
// Prompt construction helpers
// ---------------------------------------------------------------------------

function buildArithmeticQuestion(options: {
  questionType: QuestionType;
  difficulty: Difficulty;
  operands: readonly number[];
  operators: readonly ArithmeticOperator[];
  expectedAnswer: number;
}): GeneratedQuestion {
  const promptParts = buildArithmeticPromptParts(options.operands, options.operators);

  return {
    questionType: options.questionType,
    difficulty: options.difficulty,
    prompt: promptParts.map((part) => part.value).join(' '),
    promptParts,
    expectedAnswer: options.expectedAnswer,
    operands: options.operands,
    operators: options.operators,
  };
}

function buildArithmeticPromptParts(
  operands: readonly number[],
  operators: readonly ArithmeticOperator[],
): PromptPart[] {
  if (operands.length !== operators.length + 1) {
    throw new Error('Arithmetic prompts require one more operand than operator.');
  }

  const firstOperand = operands[0];
  if (firstOperand === undefined) {
    throw new Error('Arithmetic prompts require at least one operand.');
  }

  const parts: PromptPart[] = [{ kind: 'operand', value: firstOperand.toString() }];

  for (let index = 0; index < operators.length; index += 1) {
    const operator = operators[index];
    const operand = operands[index + 1];

    if (operator === undefined || operand === undefined) {
      throw new Error('Arithmetic prompt parts cannot contain undefined values.');
    }

    parts.push({ kind: 'operator', value: operator });
    parts.push({ kind: 'operand', value: operand.toString() });
  }

  return parts;
}

// ---------------------------------------------------------------------------
// Answer normalization and random helpers
// ---------------------------------------------------------------------------

function normalizeSubmittedAnswer(
  submittedAnswer: string,
  expectedType: string,
): number | string | null {
  const trimmedAnswer = submittedAnswer.trim();

  if (expectedType === 'string') {
    return trimmedAnswer;
  }

  if (!/^-?\d+$/.test(trimmedAnswer)) {
    return null;
  }

  return Number(trimmedAnswer);
}

function pickWeighted<T>(options: readonly WeightedOption<T>[], rng: RandomSource): T {
  const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
  const target = rng() * totalWeight;
  let cumulative = 0;

  for (const option of options) {
    cumulative += option.weight;
    if (target < cumulative) {
      return option.value;
    }
  }

  const fallback = options[options.length - 1];
  if (fallback === undefined) {
    throw new Error('Cannot pick from an empty weighted option list.');
  }

  return fallback.value;
}

function randomInt(min: number, max: number, rng: RandomSource): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}
