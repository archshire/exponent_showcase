# Issue: Implement Question Generator Service

## Feature Description

Implement the backend Question Generator Module for the MVP.

The generator provides the shared prompt, expected answer, selected question type, selected difficulty, and prompt-part data used by Live Match and the Excalibur presentation layer.

## Problem / Use Case

Live Match needs a deterministic backend-owned source for arithmetic prompts before PvP, PvC, CPU behavior, and Excalibur presentation can be mapped cleanly.

Without this module:

- Live Match cannot request the next shared prompt.
- CPU behavior cannot evaluate the same prompt as the player.
- Excalibur cannot receive stable prompt parts for `question.constructing`.
- Tests cannot validate the PRD question rules independently from match runtime.

## Proposed Solution

Create `apps/server/src/services/question-generator.service.ts` as a pure TypeScript service with:

- fight-round question type selection by game mode.
- fight-round difficulty selection.
- addition, subtraction, mixed addition/subtraction, and PvP-only mystery generation.
- tutorial addition-only behavior.
- PvC mystery-mode rejection.
- comeback Easy difficulty priority.
- CPU hard-question hooks.
- expected-answer derivation.
- prompt-part output for future `question.constructing` presentation events.
- answer validation helper for Live Match.

## Acceptance Criteria

- [ ] File is named `question-generator.service.ts`.
- [ ] PvP question type selection supports Addition 30%, Subtraction 30%, Mixed 25%, and Mystery 15%.
- [ ] PvC question type selection supports Addition, Subtraction, and Mixed only.
- [ ] Tutorial mode generates addition questions only.
- [ ] Difficulty selection supports Easy, Medium, and Hard.
- [ ] Comeback Easy overrides CPU hard-question pressure for the next generated prompt.
- [ ] Addition generators match PRD operand ranges.
- [ ] Subtraction generators match PRD operand ranges and allow negative answers.
- [ ] Mixed addition/subtraction generators produce three-term prompts and allow negative starting operands.
- [ ] PvP mystery mode supports reaction sequence, mixed subtype, and two 3-digit addition subtype.
- [ ] Generated questions include `prompt`, `promptParts`, `expectedAnswer`, `questionType`, `difficulty`, and subtype metadata where relevant.
- [ ] Answer validation accepts numeric answers including negatives and supports reaction-sequence string answers.
- [ ] Service is pure and does not own timers, HP, damage, persistence, WebSockets, or Excalibur presentation.

## PRD References

- `docs/game/PRD.md#feature-question-generation-and-difficulty`
- `docs/game/PRD.md#feature-architecture-features`

## Implementation Notes

This issue prepares the later CPU Opponent and Live Match work.

The Question Generator should not decide answer ordering, attack power, damage, DEFEND, revenge, round winners, match winners, Aura, or persistence. Those belong to Live Match and Match Summary.

## Priority

High
