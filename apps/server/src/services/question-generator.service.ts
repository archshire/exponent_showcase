// ---------------------------------------------------------------------------
// Public domain types
// ---------------------------------------------------------------------------

export type GameMode = 'pvp' | 'pvc' | 'tutorial';

export type QuestionType =
  | 'addition'
  | 'subtraction'
  | 'mixed_addition_subtraction';

export type Difficulty = 'easy' | 'medium';

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
  // Prompt-entry animation is intentionally not question truth. PRD 3.1 keeps
  // MVP prompts immediate; future visual polish should stay presentation-only.
}

export interface GeneratedQuestion {
  questionType: QuestionType;
  difficulty: Difficulty;
  prompt: string;
  promptParts: readonly PromptPart[];
  expectedAnswer: number | string;
  operands?: readonly number[];
  operators?: readonly ArithmeticOperator[];
  // TODO(live-match-contract):
  // Live Match will eventually wrap this generated question with runtime fields
  // such as match_id, room_id, question start timestamp, 6s deadline, and
  // server event names. Do not add those runtime fields here unless the
  // generator itself truly owns them.
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
// PRD selection weights
// ---------------------------------------------------------------------------

const PVP_QUESTION_TYPE_WEIGHTS: readonly WeightedOption<QuestionType>[] = [
  { value: 'addition', weight: 33 },
  { value: 'subtraction', weight: 33 },
  { value: 'mixed_addition_subtraction', weight: 33 },
];

const PVC_QUESTION_TYPE_WEIGHTS: readonly WeightedOption<QuestionType>[] = [
  { value: 'addition', weight: 33 },
  { value: 'subtraction', weight: 33 },
  { value: 'mixed_addition_subtraction', weight: 33 },
];

const ACTIVE_MVP_DIFFICULTY: Difficulty = 'easy';

// Future medium re-enable point:
// const DIFFICULTY_WEIGHTS: readonly WeightedOption<Difficulty>[] = [
//   { value: 'easy', weight: 50 },
//   { value: 'medium', weight: 50 },
// ];

// ---------------------------------------------------------------------------
// Public question generation API
// ---------------------------------------------------------------------------

export function selectRoundQuestionConfig(options: {
  mode: GameMode;
  rng?: RandomSource;
}): RoundQuestionConfig {
  const rng = options.rng ?? Math.random;

  return {
    questionType: selectQuestionType(options.mode, rng),
    difficulty: ACTIVE_MVP_DIFFICULTY,
  };
}

// TODO(matchmaking/live-match):
// Live Match should call this module after round prep chooses the round's
// question type and difficulty. This module should not know about rooms,
// sockets, player sessions, HP, DEFEND, revenge state, or persistence.
// It should only return prompt truth and expected answers.

export function generateQuestion(options: QuestionGenerationOptions): GeneratedQuestion {
  const rng = options.rng ?? Math.random;
  const questionType = options.questionType ?? selectQuestionType(options.mode, rng);
  const difficulty = resolveDifficulty(options, rng);

  assertQuestionTypeAllowedForMode(options.mode, questionType);

  switch (questionType) {
    case 'addition':
      return generateAdditionQuestion(difficulty, rng, questionType);
    case 'subtraction':
      return generateSubtractionQuestion(difficulty, rng);
    case 'mixed_addition_subtraction':
      return generateMixedQuestion(difficulty, rng, questionType);
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

function selectQuestionType(mode: GameMode, rng: RandomSource): QuestionType {
  if (mode === 'tutorial') {
    return 'addition';
  }

  if (mode === 'pvp') {
    return pickWeighted(PVP_QUESTION_TYPE_WEIGHTS, rng);
  }

  return pickWeighted(PVC_QUESTION_TYPE_WEIGHTS, rng);
}

function resolveDifficulty(_options: QuestionGenerationOptions, _rng: RandomSource): Difficulty {
  // MVP temporary rule: every generated question is Easy.
  // Medium remains documented below but is intentionally unavailable for now.
  return ACTIVE_MVP_DIFFICULTY;

  // Future medium re-enable point:
  // if (options.comebackEasyArmed === true) {
  //   return 'easy';
  // }
  //
  // if (options.forceDifficulty !== undefined) {
  //   return options.forceDifficulty;
  // }
  //
  // if (options.cpuMediumQuestionChance !== undefined && rng() < options.cpuMediumQuestionChance) {
  //   return 'medium';
  // }
  //
  // return options.difficulty ?? pickWeighted(DIFFICULTY_WEIGHTS, rng);
}

// ---------------------------------------------------------------------------
// Standard arithmetic generators
// ---------------------------------------------------------------------------

function generateAdditionQuestion(
  difficulty: Difficulty,
  rng: RandomSource,
  questionType: QuestionType,
): GeneratedQuestion {
  const [left, right] = [randomInt(1, 20, rng), randomInt(1, 20, rng)];
  // Future medium re-enable point:
  // const [left, right] =
  //   difficulty === 'easy'
  //     ? [randomInt(1, 20, rng), randomInt(1, 20, rng)]
  //     : [randomInt(1, 50, rng), randomInt(1, 50, rng)];
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
  const [left, right] = [randomInt(1, 20, rng), randomInt(1, 20, rng)];
  // Future medium re-enable point:
  // const [left, right] =
  //   difficulty === 'easy'
  //     ? [randomInt(1, 20, rng), randomInt(1, 20, rng)]
  //     : [randomInt(1, 50, rng), randomInt(1, 50, rng)];
  const operators: ArithmeticOperator[] = ['-'];

  return buildArithmeticQuestion({
    questionType: 'subtraction',
    difficulty,
    operands: [left, right],
    operators,
    expectedAnswer: left - right,
  });
}

function generateMixedQuestion(
  difficulty: Difficulty,
  rng: RandomSource,
  questionType: QuestionType,
): GeneratedQuestion {
  const operands = generateMixedOperands(difficulty, rng);
  const operators: ArithmeticOperator[] = [randomOperator(rng), randomOperator(rng)];

  return buildArithmeticQuestion({
    questionType,
    difficulty,
    operands,
    operators,
    expectedAnswer: applyMixedOperators(operands, operators),
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
// Mixed arithmetic helpers
// ---------------------------------------------------------------------------

function generateMixedOperands(_difficulty: Difficulty, rng: RandomSource): number[] {
  const max = 20;
  // Future medium re-enable point:
  // const max = difficulty === 'easy' ? 20 : 50;
  return [randomInt(1, max, rng), randomInt(1, max, rng), randomInt(1, max, rng)];
}

function applyMixedOperators(
  operands: readonly number[],
  operators: readonly ArithmeticOperator[],
): number {
  const firstOperand = operands[0];
  const secondOperand = operands[1];
  const thirdOperand = operands[2];
  const firstOperator = operators[0];
  const secondOperator = operators[1];

  if (
    firstOperand === undefined ||
    secondOperand === undefined ||
    thirdOperand === undefined ||
    firstOperator === undefined ||
    secondOperator === undefined
  ) {
    throw new Error('Mixed questions require three operands and two operators.');
  }

  const firstStep =
    firstOperator === '+' ? firstOperand + secondOperand : firstOperand - secondOperand;
  return secondOperator === '+' ? firstStep + thirdOperand : firstStep - thirdOperand;
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

function randomOperator(rng: RandomSource): ArithmeticOperator {
  return rng() < 0.5 ? '+' : '-';
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
