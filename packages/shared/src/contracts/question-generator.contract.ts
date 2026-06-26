import type { GameMode } from './common.contract';

// ---------------------------------------------------------------------------
// Question Generator contract
// ---------------------------------------------------------------------------
//
// Live Match uses these shapes when asking the backend question generator for
// prompt truth and when validating submitted answers.

export type QuestionType =
  | 'addition'
  | 'subtraction';

export type Difficulty = 'easy' | 'medium';

export type ArithmeticOperator = '+' | '-';

export type PromptPartKind = 'operand' | 'operator';

export interface QuestionGenerationRequest {
  mode: GameMode;
  questionType?: QuestionType;
  difficulty?: Difficulty;
  comebackEasyArmed?: boolean;
  cpuMediumQuestionChance?: number;
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
}

export interface AnswerValidationContract {
  isCorrect: boolean;
  normalizedSubmittedAnswer: number | string | null;
  expectedAnswer: number | string;
}
