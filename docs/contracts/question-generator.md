# Question Generator Contract

## Purpose

The Question Generator creates question truth for active gameplay: prompt text, prompt parts, question type, difficulty, and expected answer.

It is an internal backend contract. The browser, React, Next.js, and Excalibur do not call it directly.

## Owner

Primary owner: `apps/server/src/services/question-generator.service.ts`

Shared TypeScript contract: `packages/shared/src/contracts/question-generator.contract.ts`

Called by: Live Match Module.

## Does Not Own

Question Generator does not own rooms, Socket.IO sessions, HP, damage, DEFEND, revenge, winners, persistence, or Excalibur animation.

Those belong to Live Match, Match Summary, or frontend presentation.

## PRD 3.1 Generator Shape

Available question types:

| Type | Selection Weight |
| --- | --- |
| Addition | `33` |
| Subtraction | `33` |
| Mixed addition/subtraction | `33` |

Available difficulties:

| Difficulty | Selection Weight |
| --- | --- |
| Easy | `50` |
| Medium | `50` |

Tutorial mode uses addition only.

Mystery / `?` mode, reaction sequence typing, three-digit mystery addition, and Hard difficulty are not part of the PRD 3.1 generator.

## Generator Rules

| Type | Easy | Medium |
| --- | --- | --- |
| Addition | two operands from `1` to `20` | two operands from `1` to `50` |
| Subtraction | two operands from `1` to `20` | two operands from `1` to `50` |
| Mixed addition/subtraction | three terms from `1` to `20` | three terms from `1` to `50` |

Additional rules:

- Mixed addition/subtraction remains exactly three terms.
- The first number must not be negative.
- Negative answers are allowed.
- Zero subtraction answers are allowed when operands are equal.
- Question type and difficulty are selected once per fight round.

## Main Inputs

`generateQuestion(options)` receives:

| Field | Meaning |
| --- | --- |
| `mode` | `pvp`, `pvc`, or `tutorial`. Controls allowed question types. |
| `questionType` | Optional explicit type. If omitted, the generator selects from PRD 3.1 weights. |
| `difficulty` | Optional explicit difficulty. If omitted, the generator selects from PRD 3.1 weights. |
| `forceDifficulty` | Optional explicit Easy/Medium override from Live Match. |
| `comebackEasyArmed` | Forces Easy difficulty when comeback rule applies. |
| `cpuMediumQuestionChance` | Optional CPU pressure chance to use Medium difficulty. |
| `rng` | Optional deterministic random source for tests. |

`selectRoundQuestionConfig(options)` receives:

| Field | Meaning |
| --- | --- |
| `mode` | Selects PvP/PvC/tutorial question pool. |
| `rng` | Optional deterministic random source for tests. |

`validateAnswer(question, submittedAnswer)` receives:

| Field | Meaning |
| --- | --- |
| `question.expectedAnswer` | The server-owned expected answer. |
| `submittedAnswer` | The player or CPU submitted answer as text. |

## Main Outputs

`generateQuestion(options)` returns:

| Field | Meaning |
| --- | --- |
| `questionType` | Selected question type. |
| `difficulty` | Selected difficulty. |
| `prompt` | Full display prompt. |
| `promptParts` | Ordered prompt pieces for presentation. |
| `expectedAnswer` | Authoritative answer used by Live Match. |
| `operands` | Arithmetic operands. |
| `operators` | Arithmetic operators. |

`validateAnswer(...)` returns:

| Field | Meaning |
| --- | --- |
| `isCorrect` | Whether the normalized submitted answer matches expected answer. |
| `normalizedSubmittedAnswer` | Parsed answer value, or `null` when invalid. |
| `expectedAnswer` | Echoes the expected answer for the caller. |

## Rejections / Errors

The generator should reject invalid mode/type combinations:

- Tutorial questions use addition only.

Invalid answer text normalizes to `null` and does not match the expected answer.

## Integration Flow

1. Live Match starts round prep and chooses question type/difficulty.
2. Live Match calls Question Generator.
3. Question Generator returns prompt truth.
4. Live Match wraps the question with runtime data such as `matchId`, `roomId`, timestamps, deadline, and sequence number.
5. Live Match emits realtime events to the browser.

## Notes

- Prompt fly-in direction is visual-only and may be added by Live Match or generated locally by the browser.
- CPU former-Hard pressure is represented as Medium pressure through `cpuMediumQuestionChance`.
