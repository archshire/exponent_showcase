// ---------------------------------------------------------------------------
// Public domain types
// ---------------------------------------------------------------------------

export type GameMode = 'pvp' | 'pvc' | 'tutorial';

export type QuestionType =
  | 'addition'
  | 'subtraction'
  | 'mixed_addition_subtraction'
  | 'mystery';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type MysterySubtype =
  | 'reaction_sequence'
  | 'mixed_addition_subtraction'
  | 'three_digit_addition';

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
  cpuHardQuestionChance?: number;
  forceHardDifficulty?: boolean;
  // TODO(live-match):
  // When CPU Opponent and Live Match are wired together, replace direct
  // CPU-pressure flags with a clearer handoff shape if needed, for example:
  // `cpuQuestionPressure?: { hardQuestionChance?: number; forceHard?: boolean }`.
  // For now these simple flags keep question generation lightweight and testable.
}

export interface RoundQuestionConfig {
  questionType: QuestionType;
  difficulty: Difficulty;
}

export interface PromptPart {
  kind: PromptPartKind;
  value: string;
  // TODO(active-match-presentation):
  // The PRD allows prompt parts to fly in from top or bottom during
  // `question.constructing`. Direction is visual-only, so Live Match may either
  // add direction metadata later or let the browser generate it locally.
  // Keep gameplay question truth independent from that presentation detail.
}

export interface GeneratedQuestion {
  questionType: QuestionType;
  difficulty: Difficulty;
  prompt: string;
  promptParts: readonly PromptPart[];
  expectedAnswer: number | string;
  operands?: readonly number[];
  operators?: readonly ArithmeticOperator[];
  mysterySubtype?: MysterySubtype;
  reactionSequence?: readonly number[];
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
  { value: 'addition', weight: 30 },
  { value: 'subtraction', weight: 30 },
  { value: 'mixed_addition_subtraction', weight: 25 },
  { value: 'mystery', weight: 15 },
];

const PVC_QUESTION_TYPE_WEIGHTS: readonly WeightedOption<QuestionType>[] = [
  { value: 'addition', weight: 33 },
  { value: 'subtraction', weight: 33 },
  { value: 'mixed_addition_subtraction', weight: 33 },
];

const DIFFICULTY_WEIGHTS: readonly WeightedOption<Difficulty>[] = [
  { value: 'easy', weight: 33 },
  { value: 'medium', weight: 33 },
  { value: 'hard', weight: 33 },
];

const MYSTERY_SUBTYPE_WEIGHTS: readonly WeightedOption<MysterySubtype>[] = [
  { value: 'reaction_sequence', weight: 30 },
  { value: 'mixed_addition_subtraction', weight: 42 },
  { value: 'three_digit_addition', weight: 28 },
];

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
    difficulty: pickWeighted(DIFFICULTY_WEIGHTS, rng),
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
    case 'mystery':
      return generateMysteryQuestion(difficulty, rng);
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
  if (mode !== 'pvp' && questionType === 'mystery') {
    throw new Error('Mystery question type is PvP-only.');
  }

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

function resolveDifficulty(options: QuestionGenerationOptions, rng: RandomSource): Difficulty {
  if (options.comebackEasyArmed === true) {
    return 'easy';
  }

  if (options.forceDifficulty !== undefined) {
    return options.forceDifficulty;
  }

  // TODO(cpu-opponent):
  // Fury, Skore, and future CPU profiles can pressure difficulty through these
  // flags. Keep the CPU personality rules in CPU Opponent/config, then pass only
  // the resulting question-pressure instruction into this generator.
  if (options.forceHardDifficulty === true) {
    return 'hard';
  }

  if (options.cpuHardQuestionChance !== undefined && rng() < options.cpuHardQuestionChance) {
    return 'hard';
  }

  return options.difficulty ?? pickWeighted(DIFFICULTY_WEIGHTS, rng);
}

// ---------------------------------------------------------------------------
// Standard arithmetic generators
// ---------------------------------------------------------------------------

function generateAdditionQuestion(
  difficulty: Difficulty,
  rng: RandomSource,
  questionType: QuestionType,
): GeneratedQuestion {
  const [left, right] =
    difficulty === 'easy'
      ? [randomInt(1, 20, rng), randomInt(1, 20, rng)]
      : difficulty === 'medium'
        ? [randomInt(11, 50, rng), randomInt(11, 50, rng)]
        : shuffledPair(randomInt(11, 99, rng), randomInt(100, 999, rng), rng);
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
  const [left, right] =
    difficulty === 'easy'
      ? [randomInt(1, 50, rng), randomInt(1, 50, rng)]
      : difficulty === 'medium'
        ? [randomInt(1, 100, rng), randomInt(1, 100, rng)]
        : shuffledPair(randomInt(11, 99, rng), randomInt(100, 999, rng), rng);
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
// PvP-only mystery question generators
// ---------------------------------------------------------------------------

function generateMysteryQuestion(difficulty: Difficulty, rng: RandomSource): GeneratedQuestion {
  const mysterySubtype = pickWeighted(MYSTERY_SUBTYPE_WEIGHTS, rng);

  if (mysterySubtype === 'reaction_sequence') {
    return generateReactionSequenceQuestion(difficulty, rng);
  }

  if (mysterySubtype === 'three_digit_addition') {
    return generateThreeDigitAdditionQuestion(difficulty, rng);
  }

  return {
    ...generateMixedQuestion(difficulty, rng, 'mystery'),
    mysterySubtype,
  };
}

function generateReactionSequenceQuestion(
  difficulty: Difficulty,
  rng: RandomSource,
): GeneratedQuestion {
  const length =
    difficulty === 'easy'
      ? randomInt(4, 5, rng)
      : difficulty === 'medium'
        ? randomInt(6, 7, rng)
        : randomInt(8, 9, rng);
  const sequence = Array.from({ length }, () => randomInt(0, 9, rng));
  const promptParts = sequence.map((value) => ({
    kind: 'operand' as const,
    value: value.toString(),
  }));

  return {
    questionType: 'mystery',
    difficulty,
    mysterySubtype: 'reaction_sequence',
    prompt: promptParts.map((part) => part.value).join(' '),
    promptParts,
    expectedAnswer: sequence.join(''),
    reactionSequence: sequence,
  };
}

function generateThreeDigitAdditionQuestion(
  difficulty: Difficulty,
  rng: RandomSource,
): GeneratedQuestion {
  const max = difficulty === 'easy' ? 399 : difficulty === 'medium' ? 699 : 999;
  const left = randomInt(100, max, rng);
  const right = randomInt(100, max, rng);
  const operators: ArithmeticOperator[] = ['+'];

  return {
    ...buildArithmeticQuestion({
      questionType: 'mystery',
      difficulty,
      operands: [left, right],
      operators,
      expectedAnswer: left + right,
    }),
    mysterySubtype: 'three_digit_addition',
  };
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

function generateMixedOperands(difficulty: Difficulty, rng: RandomSource): number[] {
  if (difficulty === 'easy') {
    return shuffle([randomSignedInt(1, 9, rng), randomInt(10, 99, rng), randomInt(1, 9, rng)], rng);
  }

  if (difficulty === 'medium') {
    return shuffle([randomInt(10, 99, rng), randomInt(10, 99, rng), randomInt(1, 9, rng)], rng);
  }

  return shuffle(
    [randomSignedInt(10, 99, rng), randomInt(10, 99, rng), randomInt(10, 99, rng)],
    rng,
  );
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

function randomSignedInt(minAbs: number, maxAbs: number, rng: RandomSource): number {
  const value = randomInt(minAbs, maxAbs, rng);
  return rng() < 0.5 ? -value : value;
}

function shuffledPair(first: number, second: number, rng: RandomSource): [number, number] {
  return rng() < 0.5 ? [first, second] : [second, first];
}

function shuffle<T>(values: T[], rng: RandomSource): T[] {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index, rng);
    const currentValue = values[index];
    const swapValue = values[swapIndex];

    if (currentValue === undefined || swapValue === undefined) {
      throw new Error('Cannot shuffle an undefined value.');
    }

    values[index] = swapValue;
    values[swapIndex] = currentValue;
  }

  return values;
}
