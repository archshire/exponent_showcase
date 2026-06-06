import type { GameMode } from './common.contract';

// ---------------------------------------------------------------------------
// Question Generator contract
// ---------------------------------------------------------------------------
//
// Live Match uses these shapes when asking the backend question generator for
// prompt truth and when validating submitted answers.

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

export interface QuestionGenerationRequest {
  mode: GameMode;
  questionType?: QuestionType;
  difficulty?: Difficulty;
  comebackEasyArmed?: boolean;
  cpuHardQuestionChance?: number;
  forceHardDifficulty?: boolean;
}

export interface RoundQuestionConfigContract {
  questionType: QuestionType;
  difficulty: Difficulty;
}

export interface PromptPartContract {
  kind: PromptPartKind;
  value: string;
}

export interface GeneratedQuestionContract {
  questionType: QuestionType;
  difficulty: Difficulty;
  prompt: string;
  promptParts: readonly PromptPartContract[];
  expectedAnswer: number | string;
  operands?: readonly number[];
  operators?: readonly ArithmeticOperator[];
  mysterySubtype?: MysterySubtype;
  reactionSequence?: readonly number[];
}

export interface AnswerValidationContract {
  isCorrect: boolean;
  normalizedSubmittedAnswer: number | string | null;
  expectedAnswer: number | string;
}
