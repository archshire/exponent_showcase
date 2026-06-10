# K_GAME_PRD_1.0_CONSTITUTIONAL_STATE

## Table of Contents

- [Document Metadata](#document-metadata)
- [Project Intent](#project-intent)
- [Core Philosophy](#core-philosophy)
- [Locked Truths](#locked-truths)
- [Dependency Map](#dependency-map)
- [Unresolved Issues](#unresolved-issues)
- [Ambiguity Severity Register](#ambiguity-severity-register)
- [Accepted Uncertainty](#accepted-uncertainty)
- [Warning Registry](#warning-registry)
- [Artifact Alignment Review](#artifact-alignment-review)
- [Implementation Recommendations And Rationale](#implementation-recommendations-and-rationale)
- [Clarification Frontier](#clarification-frontier)
- [Suggested Next Reasoning Focus](#suggested-next-reasoning-focus)
- [Traceability Index](#traceability-index)

## Document Metadata

```yaml
artifact_type: constitutional_state
protocol: KRYSTALIZE
protocol_version: 1
session_id: KRYS-game_logic-001
project_name: game_logic
source_document: docs/game/GAME_LOGIC.md
created_at: 2026-05-26
updated_at: 2026-05-28
status: reset_active
reset_mode: overwrite
```

## Project Intent

### Current Intent Statement

The human wants to build a VS mental-sum game that is engaging and exciting.

The human has forgotten much of what is inside the current `game_logic` artifact, so renewed artifact interpretation must be grounded in this current big-picture intent rather than assuming the prior artifact state is authoritative by itself.

### Intent Scope

The current stabilized scope is a competitive mental-sum game experience.

The game should support both PvP and PvC:

- PvP: player vs player.
- PvC: player vs computer.

### Source References

- `docs/game/GAME_LOGIC.md`

## Core Philosophy

### Guiding Principles

- Human intent must contextualize artifact interpretation.
- KRYSTALIZE remains a clarification protocol.
- The active session should proceed with one active clarification question at a time.

### Non-Goals

- This reset does not implement game logic.
- This reset does not adversarially evaluate game viability.
- This reset does not finalize governance decisions.

### Philosophical Constraints

- Do not treat the existing artifact as sufficient semantic truth without renewed human framing.
- Do not collapse unresolved ambiguity into certainty.

## Locked Truths

| ID | Locked Truth | Source | Date Locked | Notes |
| --- | --- | --- | --- | --- |
| LT-001 | The active KRYSTALIZE target is `game_logic`. | Human reset flow | 2026-05-26 | Session overwritten into `KRYS-game_logic-001`. |
| LT-002 | The source artifact for future clarification is `docs/game/GAME_LOGIC.md`. | Repository artifact | 2026-05-26 | Deep analysis is paused until human intent is restated. |
| LT-003 | The intended game is a VS mental-sum game. | Human restatement | 2026-05-26 | "VS" requires clarification. |
| LT-004 | The intended experience should be engaging and exciting. | Human restatement | 2026-05-26 | Engagement/excitement are intent-level goals, not yet mechanics. |
| LT-005 | The game should support both PvP and PvC. | Human clarification | 2026-05-26 | PvP means player vs player; PvC means player vs computer. |
| LT-006 | The player should feel rushed, clever, under pressure, hungry for a comeback, rewarded for mastery, surprised by twists, and locked in a duel. | Human clarification | 2026-05-26 | Game logic and mechanics should enable these feelings. |
| LT-007 | Fast-answer pressure is always present. | Human clarification | 2026-05-26 | Speed is a baseline pressure, not an optional mechanic. |
| LT-008 | Stronger mental-sum players are expected to pursue streaks. | Human clarification | 2026-05-26 | Streaks express mastery and momentum. |
| LT-009 | Revenge exists to give the player receiving a streak a comeback path. | Human clarification | 2026-05-26 | Revenge counters runaway streak dominance. |
| LT-010 | Defense exists to disrupt a streak. | Human clarification | 2026-05-26 | Defense is a streak-interruption mechanic. |
| LT-011 | `GAME_LOGIC.md` already contains a 5-second power-bar timer that supports fast-answer pressure. | `docs/game/GAME_LOGIC.md:72-90` | 2026-05-26 | Aligns with speed pressure. |
| LT-012 | `GAME_LOGIC.md` already contains streak multipliers. | `docs/game/GAME_LOGIC.md:135-143` | 2026-05-26 | Aligns with mastery streaks. |
| LT-013 | `GAME_LOGIC.md` already contains a revenge mechanic triggered by opponent streaks. | `docs/game/GAME_LOGIC.md:147-167` | 2026-05-26 | Aligns with comeback threat. |
| LT-014 | `GAME_LOGIC.md` already contains defense that nullifies attack and resets attacker streak. | `docs/game/GAME_LOGIC.md:106-119`, `docs/game/GAME_LOGIC.md:214-223` | 2026-05-26 | Aligns with defense disrupting streaks. |
| LT-015 | Successful DEFEND stuns the attacking opponent for 1.5 seconds and prevents them from answering during the stun. | Human clarification | 2026-05-26 | Defense creates a short initiative window. |
| LT-016 | Successful DEFEND should give the blocker advantage to answer questions in succession and build streaks. | Human clarification | 2026-05-26 | Defense is a momentum reversal, not only a block. |
| LT-017 | After a stunned player recovers and comes under a barrage of attacks, they may use DEFEND to disrupt the opponent. | Human clarification | 2026-05-26 | Defense creates alternating comeback windows. |
| LT-018 | DEFEND can only be used once every 2 turns: if used this turn, it cannot be used next turn. | Human clarification | 2026-05-26 | Cooldown rule is clarified at intent level. |
| LT-019 | A player's revenge gauge activates after they receive a 1.4x attack hit from an opponent. | Human clarification | 2026-05-26 | This means the player has been hit by a 5-hit opponent streak. |
| LT-020 | Streak damage progresses as first hit 1.0x, second hit 1.1x, and so on until the 1.4x hit. | Human clarification | 2026-05-26 | Aligns with current streak table through 5 hits. |
| LT-021 | An activated revenge gauge resets after the player successfully answers correctly. | Human clarification | 2026-05-26 | Correct answer consumes the revenge opportunity. |
| LT-022 | Revenge attack either hits with the full 100% damage bonus or, if blocked, resets. | Human clarification | 2026-05-26 | Revenge does not persist after a blocked revenge attack. |
| LT-023 | Streak multiplier caps at 1.4x attack damage. | Human clarification | 2026-05-26 | Streaks beyond 5 hits do not continue increasing the multiplier. |
| LT-024 | Base attack damage is derived from the power bar value captured when Enter is pressed. | `docs/game/GAME_LOGIC.md:72-83`, `docs/game/GAME_LOGIC.md:98-102`, `docs/game/GAME_LOGIC.md:127-130` | 2026-05-26 | Current artifact defines power bar range as 0 to 30 damage. |
| LT-025 | For now, attack power increases over a 5-second period. | Human clarification | 2026-05-26 | The power bar is time-based. |
| LT-026 | A moving indicator travels over the attack power bar. | Human clarification | 2026-05-26 | The exact visual form of the indicator is not yet named. |
| LT-027 | The attack power range is intended to be 1 to 30. | Human clarification | 2026-05-26 | This refines the artifact's previous 0 to 30 range. |
| LT-028 | Where the moving indicator lands when the player presses Enter on a correct answer becomes the attack power. | Human clarification | 2026-05-26 | Captured attack power is the base value for damage calculation. |
| LT-029 | Actual damage is calculated from captured attack power using streak multipliers and revenge damage. | Human clarification | 2026-05-26 | Separates attack power from final damage. |
| LT-030 | The attack power bar begins at 1. | Human clarification | 2026-05-26 | `-1HP` was corrected to `1`. |
| LT-031 | Game logic needs to be written in TypeScript and transferred to the Excalibur game engine for animation. | Human implementation note | 2026-05-26 | Downstream implementation constraint; not an immediate architecture decision. |
| LT-032 | The moving attack-power indicator increases linearly from 1 to 30 over 5 seconds. | Human clarification | 2026-05-26 | Bar motion is a simple linear ramp. |
| LT-033 | Revenge damage is conceptually calculated as `attackPower x 2`. | Human clarification | 2026-05-26 | Revenge is a clean +100% comeback spike, not a stacked multiplier burst. |
| LT-034 | Revenge should be visually represented as `+100% DMG`. | Human clarification | 2026-05-26 | Visual language should reinforce comeback feeling. |
| LT-035 | A revenge attack serves as the beginning attack of a streak sequence; the next consecutive attack is 1.1x. | Human clarification | 2026-05-26 | Revenge does not combine with any multiplier stronger than the beginning streak position. |
| LT-036 | A streak multiplier can reset when interrupted by a successful block, by the streaking player pressing DEFEND, by a wrong answer, or by the opponent attacking. | Human clarification | 2026-05-26 | Streaks are fragile pressure chains, not persistent buffs. |
| LT-037 | DEFEND can serve three functions: predicting an incoming revenge attack, disrupting an incoming streak barrage, and acting as a turn-level defensive resource. | Human clarification | 2026-05-26 | DEFEND is tactical, reactive, and resource-bound. |
| LT-038 | A player who presses DEFEND breaks their own streak. | Human clarification | 2026-05-26 | DEFEND carries an offensive opportunity cost. |
| LT-039 | DEFEND can be used to predict an incoming revenge attack. | Human clarification | 2026-05-26 | Predictive blocking should be supported by the rule model. |
| LT-040 | DEFEND can be used to disrupt an incoming barrage of streak attacks. | Human clarification | 2026-05-26 | Defensive comeback rhythm applies during sustained pressure. |
| LT-041 | If a player presses DEFEND but does not successfully block an incoming attack, their own streak resets and they cannot block again for that question round. | Human clarification | 2026-05-26 | Mistimed defense consumes the block opportunity without adding an extra vulnerability window. |
| LT-042 | If a player gives a wrong answer, all benefit buffs reset. | Human clarification | 2026-05-26 | Wrong answers are a major momentum loss. |
| LT-043 | If a player gives a wrong answer, they enter a 1-second vulnerability window where they cannot do anything, including defending or answering again. | Human clarification | 2026-05-26 | Wrong answer creates a short loss-of-control punishment state. |
| LT-044 | During the wrong-answer vulnerability state, the player's status bar shows `MISSED!`. | Human clarification | 2026-05-26 | Feedback should be immediate and visible. |
| LT-045 | Incoming opponent damage during `MISSED!` uses the normal attack formula with no special damage effect. | Human clarification | 2026-05-26 | The inability to act is punishment enough. |
| LT-046 | Each fight round lasts 60 seconds. | Human clarification | 2026-05-26 | Fight-round ties are evaluated at round end, not continuously. |
| LT-047 | Each match consists of at least 2 fight rounds. | Human clarification | 2026-05-26 | The first player to win 2 rounds wins the match. |
| LT-048 | The first player to win 2 fight rounds wins the match. | Human clarification | 2026-05-26 | Match victory is round-win based. |
| LT-049 | Each fight round consists of multiple question rounds. | Human clarification | 2026-05-26 | Question rounds are the repeated combat loop inside the 60-second fight round. |
| LT-050 | Each question round should resolve with HP loss for at least one player except when both players answer at the same time. | Human clarification | 2026-05-26 | Question rounds should maintain damage pressure. |
| LT-051 | If both players take no action by the end of the attack timer, both receive `-10 HP` and status `SHOCK!`. | Human clarification | 2026-05-26 | This replaces the artifact's previous `-20 HP` timeout behavior. |
| LT-052 | If both players answer at the same time, no immediate HP damage is applied in that question round. | Human clarification | 2026-05-26 | Same-time answers are the only no-immediate-damage question-round outcome. |
| LT-053 | Same-time answers create an `Additional DMG` carryover: the current attack damage is added to the next question and resolved in that question round. | Human clarification | 2026-05-26 | Same-time answers defer damage rather than canceling it. |
| LT-054 | During `Additional DMG`, streak and revenge buffs do not reset and are applied to the stacked damage. | Human clarification | 2026-05-26 | Same-time answers preserve pressure state. |
| LT-055 | Ties happen if both players have the same HP at the end of a 60-second fight round. | Human clarification | 2026-05-26 | Equal HP is a terminal round-end check, not an immediate condition. |
| LT-056 | If a tie happens on the 3rd fight round, a Final round is initiated. | Human clarification | 2026-05-26 | Final round exists as tie-breaker after round 3 tie. |
| LT-057 | If the Final round also ends in a tie, both players lose. | Human clarification | 2026-05-26 | Final unresolved tie produces mutual loss. |
| LT-058 | `Additional DMG` from same-time answers is one shared additional damage value applied to the next question round. | Human clarification | 2026-05-26 | Same-time answers raise the shared stakes of the next exchange rather than tracking separate carryovers. |
| LT-059 | There is one shared attack power bar that increments from 1 to 30 over 5 seconds. | Human correction | 2026-05-26 | Attack power is not captured from separate per-player bars. |
| LT-060 | Both players share the same attack power bar. | Human correction | 2026-05-26 | Same-time answers use the same current attack value. |
| LT-061 | The attack goes to whoever answers first. | Human correction | 2026-05-26 | Normal attack ownership is first-correct-answer based. |
| LT-062 | Same-time answers are detected when the second valid answer occurs within 0.15 seconds / 150ms of the first valid answer. | Human clarification | 2026-05-26 | Example: if one player answers at 1.00s and the other answers from 1.00s through 1.15s, they count as answering together. |
| LT-063 | If the second valid answer occurs after the 150ms same-time window, the first valid answer wins the attack. | Human clarification | 2026-05-26 | Defines the boundary between `Additional DMG` and normal first-answer attack ownership. |
| LT-064 | `docs/game/GAME_LOGIC.md` has been synchronized with the clarified core mechanics. | Artifact update | 2026-05-26 | Updated match lifecycle, shared power bar, streak, revenge, DEFEND, `MISSED!`, `Additional DMG`, and same-time threshold rules. |
| LT-065 | Question type strongly determines gameplay experience. | Human clarification | 2026-05-26 | Question selection is a game-feel mechanism, not only content generation. |
| LT-066 | At the beginning of a fight round, a spinner determines the question mode. | Human clarification | 2026-05-26 | Spinner result shapes the questions that follow. |
| LT-067 | The CPU spins the question-mode spinner. | Human clarification | 2026-05-26 | Exact meaning of CPU authority in PvP remains to clarify. |
| LT-068 | Spinner options include addition, subtraction, subtraction + addition, and `?`. | Human clarification | 2026-05-26 | `?` is a special mode. |
| LT-069 | `?` mode is only available in PvP. | Human clarification | 2026-05-26 | This mode is excluded from PvC. |
| LT-070 | `?` mode includes addition + subtraction, addition of two 3-digit numbers, and reaction-based actions. | Human clarification | 2026-05-26 | `?` mode introduces high-variance question/action content. |
| LT-071 | Reaction-based `?` mode actions require players to press a sequence of 4 to 9 numbers to score an attack. | Human clarification | 2026-05-26 | This introduces a non-arithmetic execution challenge. |
| LT-072 | Addition questions use numbers from 1 to 30. | Human clarification | 2026-05-26 | Addition has normal and easy tiers. |
| LT-073 | Addition questions have normal and easy tiers. | Human clarification | 2026-05-26 | Easy questions can support comeback opportunities. |
| LT-074 | Easier questions should sometimes be given to a player nearing or in revenge mode to give them a comeback chance. | Human clarification | 2026-05-26 | Difficulty can support comeback pacing. |
| LT-075 | Subtraction questions use numbers from 1 to 100. | Human clarification | 2026-05-26 | Subtraction follows the same tier concept as addition. |
| LT-076 | Subtraction questions have normal and easy tiers. | Human clarification | 2026-05-26 | Easier questions can support disadvantaged players. |
| LT-077 | Easier questions should be available to disadvantaged players when they are on revenge or streak. | Human clarification | 2026-05-26 | Exact "disadvantaged" criteria remains to clarify. |
| LT-078 | Mixed questions are chained sums using addition and subtraction over numbers from 1 to 30. | Human clarification | 2026-05-26 | Mixed mode may contain add-only, subtraction-only, or both. |
| LT-079 | Mixed questions can sometimes include addition only, subtraction only, or both addition and subtraction. | Human clarification | 2026-05-26 | Mixed mode has internal variety. |
| LT-080 | The spinner result applies to the entire 60-second fight round. | Human clarification | 2026-05-26 | Question mode remains stable for the fight round. |
| LT-081 | The spinner is used again for the next fight round/match segment to create gameplay variety. | Human clarification | 2026-05-26 | Variety comes from changing modes between fight rounds rather than every question. |
| LT-082 | Easy-tier questions should be probability-weighted rather than mandatory. | Human clarification | 2026-05-26 | Comeback assistance should not be guaranteed. |
| LT-083 | Baseline easy-tier chance is 40%. | Human clarification | 2026-05-26 | Applies when no comeback assistance condition is active. |
| LT-084 | If a player has active revenge, easy-tier chance increases from 40% to 60%. | Human clarification | 2026-05-26 | Supports revenge comeback opportunity. |
| LT-085 | If a player is one hit away from revenge, easy-tier chance increases from 40% to 60%. | Human clarification | 2026-05-26 | Supports near-revenge comeback setup. |
| LT-086 | If a player's HP is half or less than half of their opponent's HP, easy-tier chance increases to 65%. | Human clarification | 2026-05-26 | Stronger assistance for severe HP disadvantage. |
| LT-087 | When multiple easy-tier probability conditions apply, use the highest applicable easy-tier probability unless later clarified otherwise. | Inference from non-stacking probabilities | 2026-05-26 | Prevents accidental probability stacking beyond stated values. |
| LT-088 | Easy-tier addition questions are addition sums between numbers 1 to 15. | Human clarification | 2026-05-26 | Narrows addition operands for easy-tier prompts. |
| LT-089 | Normal-tier addition questions use the full 1 to 30 operand range. | Human clarification | 2026-05-26 | Completes addition mode easy/normal operand ranges. |
| LT-090 | Easy-tier subtraction questions use numbers 1 to 40. | Human clarification | 2026-05-26 | Narrows subtraction operands for easy-tier prompts. |
| LT-091 | Subtraction answers may be negative. | Human clarification | 2026-05-26 | Subtraction operands do not need to be ordered to avoid negative results. |
| LT-092 | Normal-tier subtraction questions use the full 1 to 100 operand range. | Human clarification | 2026-05-26 | Completes subtraction mode easy/normal operand ranges. |
| LT-093 | Normal-tier subtraction also allows negative answers. | Human clarification | 2026-05-26 | Negative subtraction answers are valid across subtraction tiers. |
| LT-094 | Mixed-mode questions use numbers from 1 to 50. | Human clarification | 2026-05-27 | Mixed-mode difficulty should not be derived from separate easy/normal numeric ranges. |
| LT-095 | Mixed-mode questions are three-term chained arithmetic prompts. | Human correction | 2026-05-27 | Examples include `22 + 9 + 18`, `31 - 5 + 11`, `17 + 8 + 5`, and `-6 + 28 - 3`. |
| LT-096 | Difficult mixed-mode questions contain two 2-digit numbers and one 1-digit number. | Human correction | 2026-05-27 | Difficulty comes from managing two larger terms in a three-term chain. |
| LT-097 | Easy mixed-mode questions contain one 2-digit number and two 1-digit numbers. | Human correction | 2026-05-27 | Easy mode reduces cognitive load by reducing the number of 2-digit terms. |
| LT-098 | The prior four-number interpretation of mixed mode is rejected. | Human correction | 2026-05-27 | Mixed mode should not be interpreted as two 2-digit numbers plus two 1-digit numbers in one prompt. |
| LT-099 | Mixed-mode questions may start with a negative number. | Human clarification | 2026-05-27 | Examples such as `-6 + 28 - 3` are valid prompt shapes. |
| LT-100 | Mixed-mode operation signs are chosen randomly from `+` and `-`. | Human clarification | 2026-05-27 | The generator should not enforce fixed sign patterns such as exactly one addition and one subtraction. |
| LT-101 | `?` mode reaction-based actions appear randomly. | Human clarification | 2026-05-27 | The arcade-like task exists to add variety to gameplay, not to scale by comeback state. |
| LT-102 | `?` mode reaction sequence length is random within the existing 4 to 9 number range. | Human clarification | 2026-05-27 | Sequence length should not be derived from comeback or difficulty state. |
| LT-103 | In `?` mode reaction-based actions, the player who completes the number sequence first gets the attack. | Human clarification | 2026-05-27 | Attack ownership is completion-race based rather than arithmetic-answer based for this action type. |
| LT-104 | In `?` mode, reaction-based arcade tasks appear 30% of the time. | Human clarification | 2026-05-27 | Reaction tasks are frequent enough to add variety but not dominate `?` mode. |
| LT-105 | The remaining 70% of `?` mode content splits 60% mixed addition/subtraction and 40% addition of two 3-digit numbers. | Human clarification | 2026-05-27 | Within total `?` mode content, this implies 42% mixed addition/subtraction and 28% two-3-digit addition if interpreted proportionally. |
| LT-106 | `?` mode addition of two 3-digit numbers uses the full 100 to 999 range for both operands. | Human clarification | 2026-05-27 | Completes the two-3-digit addition generator at intent level. |
| LT-107 | The clarified PvP question-generation rules are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Added fight-round spinner, difficulty probabilities, addition/subtraction tiers, mixed mode, and PvP-only `?` mode rules. |
| LT-108 | PVC serves to onboard players so they become familiar with the game mechanics. | Human clarification | 2026-05-27 | PVC is not only an alternate opponent mode; it has a teaching function. |
| LT-109 | PVC serves as practice so players can use their skills on real players. | Human clarification | 2026-05-27 | PVC should support skill transfer into PvP. |
| LT-110 | PVC CPU character visuals may be used as loose planning inspiration but do not need to be strictly followed. | Human clarification | 2026-05-27 | Visual concepts are suggestive, not binding specifications. |
| LT-111 | The first PVC CPU character should introduce the streak mechanic. | Human clarification | 2026-05-27 | The first onboarding opponent has a mechanic-specific training purpose. |
| LT-112 | A first-pass PVC CPU 1 streak trainer scaffold is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records CPU 1 as the first onboarding opponent focused on streak proficiency. |
| LT-113 | CPU 1 uses a scripted tutorial sequence before normal PVC behavior is clarified. | Human clarification | 2026-05-27 | The first opponent teaches through controlled demonstration rather than an ordinary fight from the start. |
| LT-114 | CPU 1 first teaches guided attacks at 5 power and 30 power. | Human clarification | 2026-05-27 | Player sees how attack power maps into HP deduction. |
| LT-115 | CPU 1 teaches no-action `SHOCK!` by allowing or forcing a no-attack demonstration. | Human clarification | 2026-05-27 | Player learns both players lose 10 HP if no attack is dealt. |
| LT-116 | CPU 1 demonstrates a 5-hit CPU streak that fills and activates the player's revenge gauge. | Human clarification | 2026-05-27 | Player experiences streak danger and revenge activation. |
| LT-117 | CPU 1 guides the player into a full-power revenge attack after revenge activates. | Human clarification | 2026-05-27 | Player learns the `+100% DMG` revenge payoff. |
| LT-118 | CPU 1 then prompts the player to build a 5-hit streak. | Human clarification | 2026-05-27 | Tutorial culminates in player streak practice. |
| LT-119 | CPU 1 should use a visible task tracker with incomplete/tick completion state. | Human clarification | 2026-05-27 | Tutorial objectives should be explicit on screen. |
| LT-120 | The detailed CPU 1 tutorial sequence is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now includes guided attack, shock, CPU streak, revenge, and player streak tutorial steps. |
| LT-121 | After CPU 1's scripted tutorial, the fight continues into a simplified practice fight. | Human clarification | 2026-05-27 | CPU 1 is not lesson-only; it transitions into practice. |
| LT-122 | DEFEND is not available in CPU 1's simplified practice fight. | Human clarification | 2026-05-27 | CPU 1 keeps focus on attacking, revenge, and streaks without DEFEND complexity. |
| LT-123 | Each player should have an attack status bar showing attack buffs such as revenge gauge and streak multiplier. | Human clarification | 2026-05-27 | Attack-state visibility supports player understanding. |
| LT-124 | Each player should have a DEFEND button that also serves as a DEFEND status space. | Human clarification | 2026-05-27 | DEFEND availability and outcomes are communicated through the button/status area. |
| LT-125 | DEFEND button visual state should be bold/bright when available and greyed/faint when unavailable. | Human clarification | 2026-05-27 | Availability must be legible at a glance. |
| LT-126 | On successful DEFEND, the DEFEND status space should show `SUCCESS`. | Human clarification | 2026-05-27 | Successful defensive feedback should appear in the DEFEND/status space. |
| LT-127 | On wrong answer, the DEFEND/status space should show `Miss!`. | Human clarification | 2026-05-27 | Wrong-answer feedback should be visibly surfaced. |
| LT-128 | CPU 1 post-tutorial flow and player status display rules are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now includes simplified practice fight and status display rules. |
| LT-129 | During CPU 1's simplified practice fight, CPU attacks with moderate frequency. | Human clarification | 2026-05-27 | CPU 1 should provide resistance without overwhelming the first-opponent practice role. |
| LT-130 | During CPU 1's simplified practice fight, CPU attacks often enough to interrupt and reset the player's streak. | Human clarification | 2026-05-27 | Player should practice rebuilding streak momentum, not only free streak construction. |
| LT-131 | CPU 1 simplified practice resistance is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records moderate CPU pressure and player streak interruption. |
| LT-132 | CPU 1 is cleared only when the player totally defeats the CPU. | Human clarification | 2026-05-27 | Completion requires defeating the opponent, not only completing tutorial steps or building one streak. |
| LT-133 | CPU 1's game screen objective should state that the player must totally defeat the CPU. | Human clarification | 2026-05-27 | The completion condition should be visible as the active state objective. |
| LT-134 | CPU 1 completion criteria are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records total CPU defeat as the clear condition. |
| LT-135 | Superseded: CPU 1 was previously framed with a player-loss retry path after the scripted tutorial. | Human clarification | 2026-05-27 | Superseded by LT-167 and LT-168; player cannot experience defeat in CPU 1. |
| LT-136 | Superseded: CPU 1 failure/retry handling was previously synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Superseded by LT-169; source spec now removes player-loss retry framing. |
| LT-137 | After the player clears CPU 1, the player moves on to CPU 2 immediately. | Human clarification | 2026-05-27 | PVC progression advances without requiring or prioritizing replaying CPU 1. |
| LT-138 | CPU 1 clear progression is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records immediate transition to CPU 2 after CPU 1 clear. |
| LT-139 | CPU 2 should introduce the DEFEND mechanic. | Human clarification | 2026-05-27 | The second PVC opponent has a mechanic-specific training purpose. |
| LT-140 | A first-pass PVC CPU 2 DEFEND trainer scaffold is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records CPU 2 as the next onboarding opponent focused on DEFEND. |
| LT-141 | DEFEND lasts 1 second. | Human clarification | 2026-05-27 | DEFEND has a fixed active window. |
| LT-142 | During the 1-second DEFEND window, the player cannot do anything except resolve DEFEND against an incoming attack. | Human clarification | 2026-05-27 | DEFEND is an action commitment, not an answer-and-block overlap. |
| LT-143 | CPU 2 first teaches defending against a normal attack. | Human clarification | 2026-05-27 | DEFEND onboarding begins with the simplest defensive scenario. |
| LT-144 | CPU 2's first two scripted actions demonstrate CPU DEFEND: CPU defends, player is told to attack, player attacks, and CPU DEFEND/status space shows `SUCCESS`. | Human clarification | 2026-05-27 | Player first observes DEFEND working against their attack. |
| LT-145 | CPU 2's third scripted action teaches player DEFEND: objective tells player to press DEFEND, CPU attacks, and player DEFEND/status space flashes `SUCCESS`. | Human clarification | 2026-05-27 | Player then performs DEFEND successfully. |
| LT-146 | CPU 2 initial DEFEND tutorial and 1-second DEFEND duration are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records DEFEND timing and CPU 2's first three scripted actions. |
| LT-147 | CPU 2 should teach DEFEND cooldown / alternate-turn availability after the first three scripted DEFEND actions. | Human clarification | 2026-05-27 | Player should learn that DEFEND cannot be spammed every question round. |
| LT-148 | CPU 2 should teach that DEFEND can disrupt a streak. | Human clarification | 2026-05-27 | DEFEND should be learned as a streak-interruption tool, not only a normal block. |
| LT-149 | CPU 2 should teach that DEFEND can turn revenge pressure into advantage. | Human clarification | 2026-05-27 | DEFEND should be learned as a momentum conversion tool. |
| LT-150 | The streak-disruption and revenge-advantage DEFEND lessons should be two scripted events. | Human clarification | 2026-05-27 | The higher-order DEFEND uses should be explicitly demonstrated, not left to unscripted discovery. |
| LT-151 | CPU 2 follow-up DEFEND lessons are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now includes cooldown, streak disruption, and revenge advantage lesson placeholders. |
| LT-152 | CPU 2's cooldown lesson should highlight that DEFEND is greyed out and unavailable for 1 turn after use. | Human clarification | 2026-05-27 | Player learns alternate-turn availability through visible UI state, not forced failed input. |
| LT-153 | CPU 2 cooldown lesson detail is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records guided DEFEND cooldown visibility. |
| LT-154 | CPU 2's streak-disruption lesson should script the CPU to successfully build a visible 3-4 hit streak before prompting the player to DEFEND. | Human clarification | 2026-05-27 | Player should feel and recognize the opponent streak before learning to interrupt it. |
| LT-155 | CPU 2 streak-disruption setup is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records the visible scripted streak build-up. |
| LT-156 | CPU 2's revenge-advantage scripted event should make the player receive streak damage that activates the player's revenge gauge. | Human clarification | 2026-05-27 | The comeback lesson should begin from a real revenge activation state. |
| LT-157 | CPU 2 revenge-advantage activation setup is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records scripted streak damage leading to revenge activation. |
| LT-158 | After the player's revenge gauge activates in CPU 2's revenge-advantage scripted event, the screen should freeze and prompt the player to press DEFEND. | Human clarification | 2026-05-27 | The player receives an explicit teaching pause at the comeback pivot. |
| LT-159 | After the player presses DEFEND during the frozen prompt, the tutorial may resume/continue into the next beat. | Human clarification | 2026-05-27 | DEFEND input gates continuation of the scripted lesson. |
| LT-160 | CPU 2 revenge-advantage DEFEND prompt is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records the freeze-and-prompt continuation beat. |
| LT-161 | Immediately after the player presses DEFEND in CPU 2's revenge-advantage scripted event, the tutorial should prompt the player to answer and release the revenge attack. | Human clarification | 2026-05-27 | DEFEND directly bridges into the revenge counterattack. |
| LT-162 | CPU 2 revenge-advantage counterattack prompt is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records the DEFEND-to-revenge release beat. |
| LT-163 | After CPU 2's scripted DEFEND lessons, the player should enter a simplified DEFEND practice fight. | Human clarification | 2026-05-27 | Player should practice the lesson after scripted onboarding. |
| LT-164 | CPU 2's simplified DEFEND practice fight must be cleared by totally defeating CPU 2. | Human clarification | 2026-05-27 | Mastery is demonstrated through victory, not tutorial completion alone. |
| LT-165 | During CPU 2's simplified DEFEND practice fight, CPU 2 should have a higher chance of dealing streak damage so the player's revenge meter is more likely to activate. | Human clarification | 2026-05-27 | Practice should reinforce revenge activation and DEFEND-based comeback play. |
| LT-166 | CPU 2 practice fight behavior and clear condition are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records post-scripted CPU 2 practice and completion. |
| LT-167 | Superseded: the player should not be able to experience defeat during CPU 1 or CPU 2. | Human clarification | 2026-05-27 | Superseded by LT-170; player defeat is now allowed so stakes are felt early. |
| LT-168 | Superseded: during CPU 1 and CPU 2, player HP deductions may be shown visually and then restored. | Human clarification | 2026-05-27 | Superseded by LT-170; damage can now result in player loss. |
| LT-169 | Superseded: CPU 1 and CPU 2 no-player-defeat onboarding behavior was synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Superseded by LT-174; source spec now restores player-loss possibility. |
| LT-170 | The player can lose CPU 1 and CPU 2 so that stakes are felt early. | Human clarification | 2026-05-27 | Familiarisation should still carry consequence and tension. |
| LT-171 | After the player passes a CPU 1 or CPU 2 scripted sequence, replay attempts may skip the scripted sequence and start from the non-scripted practice fight. | Human clarification | 2026-05-27 | Players should not be forced through completed tutorial scripting on replay. |
| LT-172 | The fight menu should provide an option to replay the tutorial with scripted sequences. | Human clarification | 2026-05-27 | Tutorial replay remains available when the player wants mechanic instruction again. |
| LT-173 | CPU 1 and CPU 2 still retain scripted tutorial sequences for mechanic teaching. | Human clarification | 2026-05-27 | Stakes-aware loss does not remove instructional onboarding. |
| LT-174 | CPU 1 and CPU 2 stakes-aware replay behavior is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records player-loss possibility, skip-script replay, and menu tutorial replay. |
| LT-175 | CPU 1 and CPU 2 can teach the player the core mechanics needed to begin playing. | Human clarification | 2026-05-27 | The first two CPU fights may be sufficient for basic onboarding. |
| LT-176 | `Additional DMG`, wrong-answer punishment, spinner/question-mode adaptation, PvP-only `?` reaction sequences, and full match/tie structure may be discovered by the player rather than explicitly taught by CPU 1 or CPU 2. | Human clarification | 2026-05-27 | These mechanics are not considered severe enough to handicap the player if initially unknown. |
| LT-177 | Quit/round-abandon handling for PVC and PvP is a valid game-logic topic to clarify. | Human clarification | 2026-05-27 | Quitting affects rules, player expectations, and implementation behavior. |
| LT-178 | The constitutional logs are intended to preserve gameplay intent so it can later be translated into TypeScript and fleshed out in Excalibur. | Human clarification | 2026-05-27 | Documentation supports future AI/agent implementation rather than being an end in itself. |
| LT-179 | CPU 1/CPU 2 discoverable-mechanics boundary is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records what CPU 1/2 teach versus what players may discover. |
| LT-180 | If a player quits PVC before completing the scripted tutorial sequence, the game should remember that the tutorial is incomplete and replay the scripted sequence when that PVC fight restarts. | Human clarification | 2026-05-27 | Tutorial completion state must persist across interrupted PVC attempts. |
| LT-181 | If a player quits PVC after completing the scripted tutorial sequence, the current PVC match is voided and should not count toward statistics. | Human clarification | 2026-05-27 | Practice abandonment should not pollute match statistics after tutorial completion. |
| LT-182 | In PvP, the game should attempt to detect which player disconnected. | Human clarification | 2026-05-27 | Disconnect accountability depends on identifying the dropped side. |
| LT-183 | A detected PvP disconnect should be logged in the disconnecting player's record as `D/C`. | Human clarification | 2026-05-27 | Disconnects should remain visible even when match stats are voided. |
| LT-184 | A PvP game affected by disconnect should have match stats voided and marked invalid. | Human clarification | 2026-05-27 | Disconnected-game performance should not count as valid match statistics. |
| LT-185 | A player's `D/C` stat should be published/visible when another player is preparing to fight them. | Human clarification | 2026-05-27 | Public disconnect history acts as a soft deterrent and encourages match completion. |
| LT-186 | A server-authoritative implementation can usually detect which client connection dropped, but may not always prove whether the disconnect was intentional or network-caused. | Assistant implementation clarification | 2026-05-27 | Detection is possible at connection level; intent attribution remains limited. |
| LT-187 | Quit/disconnect handling is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records PVC quit behavior, PvP disconnect records, and unresolved thresholds/grace windows. |
| LT-188 | A dedicated stats/logging section is needed later. | Human clarification | 2026-05-27 | Player records and published stats require their own clarification pass. |
| LT-189 | Any detected dropped PvP connection should count as `D/C`. | Human clarification | 2026-05-27 | Disconnect recording should be simple and immediate. |
| LT-190 | PvP disconnect handling should not include a reconnection grace window before recording `D/C`. | Human clarification | 2026-05-27 | The threshold is immediate detection rather than delayed recovery. |
| LT-191 | PvP immediate `D/C` threshold is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records no grace window for detected PvP dropped connections. |
| LT-192 | Explicit player quit should use a separate event label from detected connection drop. | Human clarification | 2026-05-27 | The player action should be distinguishable from an involuntary or technical disconnect. |
| LT-193 | A quit button should be available somewhere on the PvP fight screen. | Human clarification | 2026-05-27 | Explicit quit should be a deliberate visible action, not only browser/app closure. |
| LT-194 | Pressing the PvP quit button should show a warning before confirming quit. | Human clarification | 2026-05-27 | Player should understand the consequences before exiting. |
| LT-195 | The PvP quit warning should tell the player that match stats will be voided and the quit will add to their `D/C` count. | Human clarification | 2026-05-27 | The warning makes the accountability cost explicit. |
| LT-196 | Explicit quit and detected connection drop have separate event labels, but both contribute to the player's `D/C` count. | Human clarification | 2026-05-27 | Public accountability can aggregate both while preserving event detail. |
| LT-197 | PvP explicit quit labeling and warning behavior is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records quit button, warning, and `D/C` consequence. |
| LT-198 | PVC should have an explicit quit button. | Human clarification | 2026-05-27 | PVC quitting should be a deliberate player action. |
| LT-199 | PVC quit warning should tell the player only that match stats will be voided. | Human clarification | 2026-05-27 | PVC quit does not carry the same public `D/C` warning as PvP. |
| LT-200 | Pressing quit during PVC or PvP should freeze the game screen. | Human clarification | 2026-05-27 | Quit confirmation interrupts active play. |
| LT-201 | Quit warning messages should display in front of the question and block question visibility. | Human clarification | 2026-05-27 | Prevents the quit overlay from being used while still reading the question. |
| LT-202 | In PvP, the opponent's screen should show a message that the opponent pressed quit. | Human clarification | 2026-05-27 | The non-quitting player should understand why the game has frozen. |
| LT-203 | The number of times a player presses quit during a match should be logged. | Human clarification | 2026-05-27 | Quit-button use itself is a tracked behavior. |
| LT-204 | If a player presses quit for the 3rd time in a match without actually quitting, show an escalation warning that pressing quit again will automatically forfeit the game and result in a loss. | Human clarification | 2026-05-27 | Prevents abuse of the quit button to disrupt opponent momentum. |
| LT-205 | PVC/PvP quit button freeze, overlay, opponent message, and anti-abuse behavior are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records quit UI and quit-count logging rules. |
| LT-206 | The 3rd-quit warning and 4th-press automatic forfeit rule applies only to PvP matches. | Human clarification | 2026-05-27 | There is no incentive to abuse the quit button in PVC mode. |
| LT-207 | PvP match entry may support inviting online friends through a friend list. | Human future note | 2026-05-27 | Candidate PvP entry flow for later matchmaking/lobby discussion. |
| LT-208 | PvP match entry may support starting a room and waiting for other players to join. | Human future note | 2026-05-27 | Candidate PvP room flow for later clarification. |
| LT-209 | Open PvP rooms may be shown in a game room lobby. | Human future note | 2026-05-27 | Candidate lobby visibility behavior for later clarification. |
| LT-210 | PvP match entry may support joining an existing room. | Human future note | 2026-05-27 | Candidate PvP entry flow for later clarification. |
| LT-211 | PvP quit anti-abuse scope and PvP match-entry notes are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records PvP-only anti-abuse scope and deferred room/lobby candidates. |
| LT-212 | Explicit confirmed quit should use the internal event label `QUIT_CONFIRMED`. | Human clarification | 2026-05-27 | Distinguishes deliberate quit from technical disconnect. |
| LT-213 | Detected dropped connection should use the internal event label `CONNECTION_DROPPED`. | Human clarification | 2026-05-27 | Distinguishes technical disconnect from deliberate quit. |
| LT-214 | Both `QUIT_CONFIRMED` and `CONNECTION_DROPPED` contribute to the player's public `D/C` count. | Human clarification | 2026-05-27 | Internal detail is preserved while public accountability remains aggregated. |
| LT-215 | PvP quit/disconnect event labels are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records exact internal labels. |
| LT-216 | The next clarification branch is PvP rooms / match entry rather than stats/logging or CPU progression. | Human clarification | 2026-05-27 | Human selected PvP rooms as the active topic. |
| LT-217 | PvP room/match entry candidate flows are promoted from deferred notes into the active PvP rooms section of `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now treats friend invites, room creation, lobby visibility, and joining rooms as active room-entry concepts. |
| LT-218 | Superseded: every created PvP room should be visible in the public lobby by default. | Human clarification | 2026-05-27 | Superseded by LT-253; players now choose public or private when creating a room. |
| LT-219 | The player side should have an invite section that opens a dropdown showing online friends. | Human clarification | 2026-05-27 | Friend invites should be accessible from the PvP room flow. |
| LT-220 | A player should be able to invite an online friend from the invite dropdown. | Human clarification | 2026-05-27 | Friend invites act as a social shortcut into PvP. |
| LT-221 | Friends can be added from a post-match results page using an add friend button. | Human clarification | 2026-05-27 | Friend relationships can originate from opponents after a match. |
| LT-222 | The post-match results page should later show match stats and grading. | Human future note | 2026-05-27 | Results page needs separate clarification later. |
| LT-223 | When a player sends a friend request, the receiving player's screen should show a popup notifying them that a friend request was sent. | Human clarification | 2026-05-27 | Friend request receipt should be visible immediately. |
| LT-224 | The receiving player can check their friend list and accept or decline the friend request. | Human clarification | 2026-05-27 | Friend request response happens from the friend list. |
| LT-225 | On the sender's friend list, a sent friend request should show status `waiting for response`. | Human clarification | 2026-05-27 | Pending request state should be visible to sender. |
| LT-226 | If a friend request is accepted, the friend's status becomes visible to the sender. | Human clarification | 2026-05-27 | Accepted friendship unlocks online/offline visibility. |
| LT-227 | If a friend request is declined, the sender's friend status space should show `request declined`. | Human clarification | 2026-05-27 | Decline feedback should be visible to sender. |
| LT-228 | The sender can click an `X` box to delete the `request declined` message. | Human clarification | 2026-05-27 | Decline feedback can be dismissed. |
| LT-229 | PvP public-room, invite dropdown, and friend-request flow are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records lobby visibility and friend request lifecycle. |
| LT-230 | When a player is detected to join a PvP room, both players should receive a ready button. | Human clarification | 2026-05-27 | Match start requires both players to acknowledge readiness. |
| LT-231 | A PvP room advances only after both players press ready. | Human clarification | 2026-05-27 | Prevents one player or room creator from starting the match unilaterally. |
| LT-232 | After both PvP room players press ready, a 3-second countdown timer replaces the ready button on both players' screens. | Human clarification | 2026-05-27 | Countdown gives both players a synchronized transition into the match. |
| LT-233 | After the 3-second countdown completes, the match page loads. | Human clarification | 2026-05-27 | Defines the room-to-match transition. |
| LT-234 | PvP room ready/start flow is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records ready buttons, shared countdown, and match-page load. |
| LT-235 | If one player leaves the PvP room before both players press ready, the room should remain open in the lobby. | Human clarification | 2026-05-27 | Pre-ready departure should not close the room. |
| LT-236 | If one player leaves before both players are ready, another player should be able to join the same room. | Human clarification | 2026-05-27 | Public lobby rooms remain available until a match starts. |
| LT-237 | PvP pre-ready room departure behavior is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records persistent lobby room behavior before ready completion. |
| LT-238 | If one player leaves after both players press ready and the 3-second countdown has started, cancel the countdown. | Human clarification | 2026-05-27 | Prevents loading into a broken match. |
| LT-239 | After countdown cancellation from player departure, return the remaining player to the room. | Human clarification | 2026-05-27 | Remaining player stays in the room rather than being pushed into match or lobby. |
| LT-240 | PvP countdown departure behavior is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records countdown cancellation and return-to-room behavior. |
| LT-241 | If the room creator/host leaves before the match starts, room ownership should transfer to the remaining player. | Human clarification | 2026-05-27 | Room ownership transfer keeps the public room alive. |
| LT-242 | If the room creator/host leaves before the match starts, the public room should stay alive. | Human clarification | 2026-05-27 | Host departure should not destroy the room before match start. |
| LT-243 | PvP pre-match host-transfer behavior is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records ownership transfer when host leaves before match start. |
| LT-244 | Before match start, the room creator/host can kick or remove the other player from the room. | Human clarification | 2026-05-27 | Host has room-management authority before the match begins. |
| LT-245 | Before match start, the room creator/host can close or delete the room. | Human clarification | 2026-05-27 | Host can end the room before match start. |
| LT-246 | Before match start, the room creator/host can rename the room. | Human clarification | 2026-05-27 | Host can change room presentation in the lobby. |
| LT-247 | Before match start, the room creator/host can use invite-only controls. | Human clarification | 2026-05-27 | Host can manage invitation behavior before match start. |
| LT-248 | Host controls do not override the rule that match start requires both players to press ready. | Human/assistant clarification | 2026-05-27 | Ready/start consent remains mutual even with host controls. |
| LT-249 | PvP pre-match host controls are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records host kick, close/delete, rename, and invite-only controls. |
| LT-250 | Superseded: invite-only PvP rooms remain visible in the public lobby. | Human clarification | 2026-05-27 | Superseded by LT-256; private/invite-only rooms are not visible in the public lobby. |
| LT-251 | Invite-only PvP rooms restrict joining to invited players. | Human clarification | 2026-05-27 | Still valid for private rooms. |
| LT-252 | Superseded: PvP invite-only visibility/join behavior was synchronized as visible-but-restricted. | Artifact update | 2026-05-27 | Superseded by LT-258; source spec now records public/private room creation choices. |
| LT-253 | When a player starts a PvP room, the player should choose whether the room is public or private. | Human clarification | 2026-05-27 | Room visibility/access mode is selected at creation. |
| LT-254 | Public PvP rooms are visible in the public lobby. | Human clarification | 2026-05-27 | Public rooms remain discoverable by all players. |
| LT-255 | Public PvP rooms can be joined from the public lobby. | Human clarification | 2026-05-27 | Public room listing supports join-existing-room flow. |
| LT-256 | Private PvP rooms are not visible in the public lobby. | Human clarification | 2026-05-27 | Invite-only rooms should not be public-lobby items. |
| LT-257 | Private PvP rooms can be joined only through invitation. | Human clarification | 2026-05-27 | Private rooms preserve invite-only access. |
| LT-258 | PvP public/private room creation model is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records public/private choice at room creation and supersedes visible invite-only model. |
| LT-259 | Invited players for private PvP rooms should receive a direct notification/invite popup. | Human clarification | 2026-05-27 | Private room invitations should be pushed to the invited player. |
| LT-260 | Private PvP room direct invite notification is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records pushed invite delivery for private rooms. |
| LT-261 | Private PvP room invite popups should include accept and decline actions. | Human clarification | 2026-05-27 | Invited player can respond directly from the popup. |
| LT-262 | Private PvP room invite popup response actions are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records accept/decline actions on private room invite popup. |
| LT-263 | Accepting a private room invite should take the invited player directly into the room immediately. | Human clarification | 2026-05-27 | Accepting the invite performs the room-entry transition without extra navigation. |
| LT-264 | Private PvP room invite accept behavior is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records direct entry on private invite accept. |
| LT-265 | Declining a private room invite should notify the host that the invite was declined. | Human clarification | 2026-05-27 | Host receives clear feedback instead of waiting indefinitely. |
| LT-266 | Private PvP room invite decline behavior is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records host notification on declined private invite. |
| LT-267 | The active clarification branch should continue with post-match results. | Human clarification | 2026-05-27 | PvP room rules are stable enough to move into results-page semantics. |
| LT-268 | The winning player's post-match results screen should display `WIN!`. | Human clarification | 2026-05-27 | Results screen should give immediate victory closure. |
| LT-269 | The post-match performance section should show accuracy score as a percentage of correct submitted answers out of submitted answer attempts. | Human clarification | 2026-05-27, refined 2026-05-28 | Accuracy records mental-sum performance without punishing no-answer, timeout, or unable-to-act pressure states. |
| LT-270 | The post-match performance section should show a player type classification. | Human clarification | 2026-05-27 | Player type summarizes the style of attacks used during the match. |
| LT-271 | Player type classifications include `Streaker`, `Strategist`, `Avenger`, `Vanilla`, and `Wrongster`. | Human clarification | 2026-05-27 | Classifications distinguish streak-heavy, block-follow-up, revenge-heavy, normal, and high-error winning styles. |
| LT-272 | The post-match performance section should show longest streak. | Human clarification | 2026-05-27 | Longest streak captures peak pressure output. |
| LT-273 | The post-match rewards section should show earnings and coins earned. | Human clarification | 2026-05-27 | Superseded by LT-322 through LT-325: result screen now uses `Reward` with formula breakdown. |
| LT-274 | Superseded: an in-game economy and shop concept was previously under consideration. | Human future note | 2026-05-27, refined 2026-05-28 | Superseded by LT-578 through LT-582 for current Version 1 shop offerings. |
| LT-275 | Candidate future shop items may include match modifiers that advantage the player or penalize the opponent. | Human future note | 2026-05-27, refined 2026-05-28 | Modifier examples remain future notes only; modifiers are not part of the current Version 1 shop. |
| LT-276 | Match modifier governance remains deferred. | Warning-linked clarification | 2026-05-27, refined 2026-05-28 | PvP fairness, consent, ranking, records, and rewards may depend on modifier scope if modifiers are revisited later. |
| LT-277 | Post-match results and economy notes are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records winning results display, performance fields, reward fields, and unresolved shop concept. |
| LT-278 | Match modifiers should be allowed in PVC and explicit modifier-enabled matches. | Human clarification | 2026-05-27 | Modifier cards are permitted only in scoped modes rather than normal PvP. |
| LT-279 | Match modifiers should be logged for future development rather than included in the immediate stage. | Human clarification | 2026-05-27 | Including modifiers now may make development messy. |
| LT-280 | Alternative coin shop purchases remain unresolved. | Human question | 2026-05-27 | The economy still needs satisfying things players can buy if modifier cards are deferred. |
| LT-281 | Modifier scope and deferral are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records PVC / explicit modifier-enabled scope and immediate deferral. |
| LT-282 | Coins should function as currency for building game identity. | Human clarification | 2026-05-27 | Economy should support player self-expression rather than immediate match advantage. |
| LT-283 | Every player starts with a default generated name using the pattern `unknown_duelist_<number_id>`. | Human clarification | 2026-05-27 | New players begin with an anonymous duel identity. |
| LT-284 | Name change is a locked identity feature. | Human clarification | 2026-05-27 | Players can spend earned coins to choose their own name. |
| LT-285 | Avatar pictures can be unlocked. | Human clarification | 2026-05-27 | Avatar identity is another coin-based expression path. |
| LT-286 | Other identity-building purchases remain unresolved. | Human future note | 2026-05-27 | Additional identity shop items can be designed later. |
| LT-287 | Identity economy rules are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records coins as identity currency, default names, name change, and avatar unlocks. |
| LT-288 | Every name change requires coins. | Human clarification | 2026-05-27 | Name identity should be earned rather than given for free. |
| LT-289 | The player's first name-change opportunity should come from earnings from the first two tutorial matches. | Human clarification | 2026-05-27 | Tutorial earnings create the first identity-upgrade moment. |
| LT-290 | After the first two tutorial matches, the player can be prompted to unlock and change their name. | Human clarification | 2026-05-27 | Onboarding should lead naturally into identity customization. |
| LT-291 | Name-change cost timing is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records coin-required name changes and post-tutorial prompt timing. |
| LT-292 | The first two tutorial matches should guarantee enough coins for the player's first name change. | Human clarification | 2026-05-27 | First identity upgrade is a guaranteed onboarding reward rather than a performance gate. |
| LT-293 | Guaranteed first name-change affordability is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records guaranteed tutorial earnings for first name change. |
| LT-294 | Multiple players may use the same display name. | Human clarification | 2026-05-27 | Display names do not need to be globally unique. |
| LT-295 | Hidden number ID remains unique for each player. | Human clarification | 2026-05-27 | Unique identity is preserved behind duplicate display names. |
| LT-296 | Avatar identity should be friendly to all players. | Human clarification | 2026-05-27 | Avatar tone should avoid exclusionary or hostile identity framing. |
| LT-297 | Avatar form should consider Excalibur engine resources, cute theme animations, friendly tone, and Version 1 implementation weight. | Human future note | 2026-05-27 | Avatar direction is noted but not fully specified. |
| LT-298 | Display-name uniqueness and avatar direction are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records duplicate display names with unique hidden IDs and early avatar art constraints. |
| LT-299 | Version 1 avatars should use simple unlockable icon badges. | Human clarification | 2026-05-27 | Icon badges are lightweight and fit the current implementation stage. |
| LT-300 | Static profile pictures should be earned identity items unlockable through coins. | Human clarification | 2026-05-27 | Static pictures become a richer identity reward beyond initial badges. |
| LT-301 | Animated mascots should be earned identity items unlockable through coins. | Human clarification | 2026-05-27 | Animated mascots become a higher-expression identity reward. |
| LT-302 | Version 1 avatar format is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records icon badges first, with profile pictures and mascots as coin unlocks. |
| LT-303 | The game MVP is owned by the game developer and lives inside the game tab. | Human clarification | 2026-05-27 | Team handoff should treat the game as one application section, not the whole site. |
| LT-304 | Other teammates own surrounding application areas such as starting web page/site sections, webhooks, and database. | Human clarification | 2026-05-27 | Game work must expose integration needs to those teammates. |
| LT-305 | The starting web page includes items such as About, while Game is one item/tab among them. | Human clarification | 2026-05-27 | Game MVP should integrate into the wider navigation/site shell. |
| LT-306 | The game MVP should provide specific handoff requirements for navigation/web, webhook, and database teammates. | Human clarification | 2026-05-27 | Teammates need clear contracts for their parts without owning game logic. |
| LT-307 | Team integration context is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records game-tab ownership and integration handoff areas. |
| LT-308 | Integration contracts should wait until unresolved game design and gameplay rules are clarified further. | Human clarification | 2026-05-27 | Shared ground truth should precede external handoff. |
| LT-309 | Current markdown files are the source of shared semantic truth for the game. | Human clarification | 2026-05-27 | Markdown captures mutual understanding before implementation. |
| LT-310 | Intended workflow is markdown ground truth -> TypeScript logic -> Excalibur adaptation -> integration contracts. | Human clarification | 2026-05-27 | Implementation should follow stabilized semantics rather than premature integration. |
| LT-311 | Clarification-to-implementation order is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records that integration planning should not outrun game logic clarification. |
| LT-312 | The next ground-truth clarification branch should be post-match results. | Human clarification | 2026-05-27 | Results connect match meaning, stats, rewards, and replay motivation. |
| LT-313 | Losing player post-match results should show the same performance categories as winning results. | Human clarification | 2026-05-27 | Losing players still receive a performance mirror. |
| LT-314 | Losing player results should include accuracy, player type, longest streak, earnings, and coins. | Human clarification | 2026-05-27 | Superseded by LT-322 through LT-325: losing-side results now use `Reward` with formula breakdown. |
| LT-315 | Losing player earnings and coins should be lower than winning player earnings and coins. | Human clarification | 2026-05-27 | Superseded by LT-324: loser receives smaller outcome bonus. |
| LT-316 | Losing player results should include generic encouraging improvement tips. | Human clarification | 2026-05-27 | Defeat should coach and motivate rather than only punish. |
| LT-317 | Initial improvement tips include strategy, timing, Defend cooldown, rounding, streak awareness, Defend disruption, and avoiding calculator reliance. | Human clarification | 2026-05-27 | First tip pool captures mechanics and mental-math advice. |
| LT-318 | Losing-side post-match results are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records losing stats, lower rewards, and example improvement tips. |
| LT-319 | Winner coin rewards are calculated as `(number of correct questions x 10) + 50`. | Human clarification | 2026-05-27 | Winner reward combines performance with a victory bonus. |
| LT-320 | Loser coin rewards are calculated as `(number of correct questions x 10) + 25`. | Human clarification | 2026-05-27 | Loser reward uses the same performance base with a smaller participation/outcome bonus. |
| LT-321 | Post-match coin formula is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records winner and loser coin formulas. |
| LT-322 | Result screen should replace separate `earnings` and `coins earned` labels with `Reward`. | Human clarification | 2026-05-27 | Reward display should be simpler and less duplicative. |
| LT-323 | Result screen should show reward breakdown as `<correct questions> correct questions x 10 coins + <outcome bonus> coins`. | Human clarification | 2026-05-27 | Players can understand why they received the reward amount. |
| LT-324 | Winner outcome bonus is `50 coins`; loser outcome bonus is `25 coins`. | Human clarification | 2026-05-27 | Outcome bonus explains the winner/loser reward difference. |
| LT-325 | Reward label and breakdown are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now replaces earnings/coins labels with Reward and formula breakdown. |
| LT-326 | Losing player result tip should be randomly selected from the tip pool. | Human clarification | 2026-05-27 | Losing-side coaching is generic/random rather than context-driven for now. |
| LT-327 | Winning player post-match screen should include a challenge quote. | Human clarification | 2026-05-27 | Winner-side result screen should motivate continued play after victory. |
| LT-328 | Initial winner challenge quotes include win-streak, 100-win surprise, challenging parents, calculator, and 10-second duel prompts. | Human clarification | 2026-05-27 | First winner quote pool creates playful challenge energy. |
| LT-329 | Result quote behavior is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records random loser tips and winner challenge quotes. |
| LT-330 | Winning player challenge quote should be randomly selected from the challenge quote pool. | Human clarification | 2026-05-27 | Winner-side feedback remains lightweight and not performance-aware for now. |
| LT-331 | Winner quote selection behavior is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records random winner challenge quote selection. |
| LT-332 | Result screen should show reward as `Reward: <correct questions> (tick) questions x 10 coins + <outcome bonus> coins (<bonus label>) = <total reward> coins`. | Human clarification | 2026-05-27 | Players should see both the formula and final total in one readable line. |
| LT-333 | Winner reward display example is `Reward: 13 (tick) questions x 10 coins + 50 coins (win bonus) = 180 coins`. | Human clarification | 2026-05-27 | Winner result copy now has a concrete formatting example. |
| LT-334 | Reward total display format is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now includes the final reward total and bonus label. |
| LT-335 | Loser reward outcome bonus should be labeled `match bonus`. | Human clarification | 2026-05-27 | Loser reward wording should stay neutral rather than punitive or patronizing. |
| LT-336 | Loser reward bonus label is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records `match bonus` as the loser bonus label. |
| LT-337 | PvC rewards should not use the same reward formula as PvP rewards. | Human clarification | 2026-05-27 | Practice rewards should be lower than competitive rewards. |
| LT-338 | PvC rewards should grant `5 coins` per correct question. | Human clarification | 2026-05-27 | PvC correct-answer reward is half of PvP correct-answer reward. |
| LT-339 | PvC winner bonus should be `10 coins`. | Human clarification | 2026-05-27 | PvC victory still gives a small completion reward. |
| LT-340 | PvC loser bonus should be `0 coins`. | Human clarification | 2026-05-27 | PvC losing rewards come only from correctly answered questions. |
| LT-341 | Reward correct-question count should total all correctly answered questions across the whole match, including all rounds in that match. | Human clarification | 2026-05-27 | Reward calculation must use match-level performance rather than round-level performance. |
| LT-342 | PvC reward formula and match-wide correct-question scope are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now distinguishes PvP and PvC reward formulas. |
| LT-343 | Voided matches should show `Reward: 0 coins`. | Human clarification | 2026-05-27 | Visible zero reward deters disconnecting or quitting from a match. |
| LT-344 | Voided match result screens should include a quote selected from a voided-match quote pool. | Human clarification | 2026-05-27 | Voided match feedback should reinforce completion and stable connection behavior. |
| LT-345 | Initial voided-match quote pool includes stable connection, finishing what was started, and avoiding D/C prompts. | Human clarification | 2026-05-27 | First D/C feedback copy is captured for result screen implementation. |
| LT-346 | Voided match reward and quote behavior are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records visible zero reward and voided-match quote examples. |
| LT-347 | Voided-match quote should be randomly selected from the voided-match quote pool. | Human clarification | 2026-05-27 | Voided match feedback follows the same random pool model as other result quotes. |
| LT-348 | Voided-match random quote selection is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records random voided-match quote selection. |
| LT-349 | Explicit quits and dropped connections should use the same voided-match quote pool. | Human clarification | 2026-05-27 | Both abandonment paths share the same result-screen quote behavior. |
| LT-350 | Shared voided-match quote pool behavior is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records one shared quote pool for explicit quits and dropped connections. |
| LT-351 | PvP post-match results screen should include an `Add Friend` button. | Human clarification | 2026-05-27 | Results screen should support turning opponents into future social connections. |
| LT-352 | PvP post-match results screen should include a `Replay` button. | Human clarification | 2026-05-27 | Results screen should support immediate rematch flow. |
| LT-353 | When a player presses `Replay`, that player becomes the replay initiator and sees a `15` second countdown timer with `waiting...`. | Human clarification | 2026-05-27 | Initiator needs visible feedback while waiting for opponent agreement. |
| LT-354 | The non-initiating player's side should show the same replay waiting appearance with `waiting...`. | Human clarification | 2026-05-27 | Both players should understand a rematch request is pending. |
| LT-355 | If the other player presses `Replay` during the waiting period, a `3` second countdown starts before the match begins. | Human clarification | 2026-05-27 | Mutual replay agreement should transition quickly into rematch start. |
| LT-356 | PvP post-match Add Friend and Replay behavior are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records results-screen social and rematch actions. |
| LT-357 | If the `15` second replay waiting timer expires before the other player presses `Replay`, the `Replay` button should grey out. | Human clarification | 2026-05-27 | Replay request expiry should be visually clear. |
| LT-358 | After replay waiting timer expiry, players can no longer replay from that result screen. | Human clarification | 2026-05-27 | Expired rematch requests should not remain actionable. |
| LT-359 | Post-match results screen should include a `Back` button that returns the player to the PvP lobby. | Human clarification | 2026-05-27 | Players need a clear route out of the results screen after replay expires or when they do not want a rematch. |
| LT-360 | Replay timeout and post-match Back behavior are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records replay expiry and lobby return. |
| LT-361 | Opening the `Game` tab should first present `1P` and `2P` options. | Human clarification | 2026-05-27 | First game navigation fork separates solo and multiplayer play. |
| LT-362 | The `1P` option should offer `Tutorial` and `Duel CPU` paths. | Human clarification | 2026-05-27 | Solo mode separates mechanic teaching from CPU battles. |
| LT-363 | Players should choose one `1P` path at a time. | Human clarification | 2026-05-27 | Tutorial and CPU duel are distinct entry choices. |
| LT-364 | The `Tutorial` path uses the already clarified tutorial structure. | Human clarification | 2026-05-27 | Existing CPU 1 and CPU 2 tutorial work remains valid. |
| LT-365 | The `Duel CPU` path should include additional CPU characters beyond tutorial opponents, but those characters remain unresolved. | Human clarification | 2026-05-27 | PvC content beyond onboarding is acknowledged without inventing CPU roles. |
| LT-366 | The `2P` option should take the player to the PvP room lobby. | Human clarification | 2026-05-27 | Multiplayer entry routes through the already clarified lobby/room model. |
| LT-367 | The PvP room lobby should allow a player to start a private room, start a public room, or join available public rooms. | Human clarification | 2026-05-27 | Lobby actions connect first navigation fork to PvP room flow. |
| LT-368 | Initial game tab navigation is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records first game screen, 1P paths, and 2P lobby entry. |
| LT-369 | `Duel CPU` is separate from `Tutorial` within the `1P` option. | Human clarification | 2026-05-27 | Prevents tutorial CPU flow from being collapsed into CPU duel mode. |
| LT-370 | `Duel CPU` initially gives access to two CPU opponents. | Human clarification | 2026-05-27 | Establishes available starting PvC content. |
| LT-371 | `Duel CPU` has four additional CPU opponents that must be unlocked with coins. | Human clarification | 2026-05-27 | Establishes PvC progression and coin sink. |
| LT-372 | Locked Duel CPU opponents can be unlocked using coins earned from repeated fights against available CPU opponents or from PvP fights. | Human clarification | 2026-05-27 | PvC and PvP both contribute to solo roster progression. |
| LT-373 | Locked Duel CPU unlock costs begin at `500`, then `1000`, then `1500` coins. | Human clarification | 2026-05-27 | First three unlock costs are defined. |
| LT-374 | The fourth locked Duel CPU opponent unlock cost remains unresolved. | Accepted uncertainty | 2026-05-27 | Human supplied three unlock costs for four locked opponents. |
| LT-375 | `Maki` is a Duel CPU opponent with `Vanilla` fighter type. | Human clarification | 2026-05-27 | Defines first available non-tutorial CPU identity. |
| LT-376 | `Maki` attacks with `1.2x` damage at all times and cannot build streaks. | Human clarification | 2026-05-27 | Maki's pressure comes from constant moderate damage rather than streaks. |
| LT-377 | `Maki` answers between `2` and `3` seconds with `70%` probability. | Human clarification | 2026-05-27 | Defines Maki's answer timing behavior. |
| LT-378 | `Maki` activates block when the player is on a streak greater than `3x` with `70%` probability. | Human clarification | 2026-05-27 | Defines Maki's anti-streak behavior. |
| LT-379 | `Kander` is a Duel CPU opponent with `Streak` fighter type. | Human clarification | 2026-05-27 | Defines second available non-tutorial CPU identity. |
| LT-380 | `Kander` attempts to attack with streaks `70%` of the time. | Human clarification | 2026-05-27 | Kander's pressure comes from streak-building behavior. |
| LT-381 | `Kander` answers between `1` and `2` seconds with `70%` probability. | Human clarification | 2026-05-27 | Defines Kander's faster answer timing behavior. |
| LT-382 | `Kander` activates block when the player is on a streak greater than `3x` with `70%` probability. | Human clarification | 2026-05-27 | Defines Kander's anti-streak behavior. |
| LT-383 | Maki and Kander Duel CPU profiles are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records first two Duel CPU profiles and unlock economy. |
| LT-384 | Maki's fallback attack behavior is to attack normally in the `2` to `3` second window. | Human clarification | 2026-05-27 | Defines Maki's remaining non-primary attack behavior. |
| LT-385 | Kander's fallback attack behavior is to attack normally in the `2` to `3` second window. | Human clarification | 2026-05-27 | Defines Kander's remaining non-primary attack behavior. |
| LT-386 | Maki and Kander fallback attack behavior is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records normal attack fallback windows for both CPU profiles. |
| LT-387 | If Maki's block condition is met but block does not activate, Maki does not block and continues attacking normally. | Human clarification | 2026-05-27 | Defines Maki's non-block fallback behavior. |
| LT-388 | If Kander's block condition is met but block does not activate, Kander does not block and continues attacking normally. | Human clarification | 2026-05-27 | Defines Kander's non-block fallback behavior. |
| LT-389 | Maki and Kander block fallback behavior is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records failed block-roll behavior for both CPU profiles. |
| LT-390 | Maki and Kander are the two initially available Duel CPU opponents. | Human clarification | 2026-05-27 | Defines the starting Duel CPU roster state. |
| LT-391 | Initial Duel CPU availability is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now explicitly lists Maki and Kander as initially available. |
| LT-392 | Fourth locked Duel CPU opponent unlock cost is `3000` coins. | Human clarification | 2026-05-27 | Completes the four-step locked CPU coin ladder. |
| LT-393 | Locked Duel CPU opponents must be unlocked successively. | Human clarification | 2026-05-27 | Players cannot skip to later CPU opponents only because they have enough coins. |
| LT-394 | Unlocking a Duel CPU opponent requires beating the preceding required CPU opponent or opponents and having enough coins. | Human clarification | 2026-05-27 | CPU unlock progression is both mastery-gated and coin-gated. |
| LT-395 | `Fury` is the first locked Duel CPU opponent and costs `500` coins to unlock. | Human clarification | 2026-05-27 | Defines first locked CPU identity and cost. |
| LT-396 | To unlock `Fury`, players must beat `Maki`, beat `Kander`, and have enough coins. | Human clarification | 2026-05-27 | Fury unlock requires clearing the initial Duel CPU roster first. |
| LT-397 | `Fury` is an `Avenge` fighter type. | Human clarification | 2026-05-27 | Defines Fury's fighter identity. |
| LT-398 | Fury's revenge gauge is constantly filled and cannot empty. | Human clarification | 2026-05-27 | Fury's defining mechanic is persistent revenge state. |
| LT-399 | Fury cannot do streak attacks. | Human clarification | 2026-05-27 | Fury pressure comes from revenge/defense rather than streaks. |
| LT-400 | Fury successfully blocks all kinds of attacks `80%` of the time and gets hit `20%` of the time. | Human clarification | 2026-05-27 | Defines Fury's defensive reliability. |
| LT-401 | Fury attempts to take advantage of the player's wrong-answer vulnerability window. | Human clarification | 2026-05-27 | Fury punishes mistakes after wrong answers. |
| LT-402 | After successfully blocking the player's attack, Fury attempts to maximize attack damage at attack power `30`. | Human clarification | 2026-05-27 | Fury's counterattack aims for maximum base attack power. |
| LT-403 | Fury has a `50%` chance to score a critical hit when attacking at attack power `30`. | Human clarification | 2026-05-27 | Fury's strongest punish can spike damage. |
| LT-404 | Fury critical hit does `200%` revenge damage. | Human clarification | 2026-05-27 | Critical damage is tied to Fury's revenge attack identity. |
| LT-405 | Harder questions appear `60%` of the time for all match rounds when fighting Fury. | Human clarification | 2026-05-27 | Fury fight modifies question difficulty pressure. |
| LT-406 | Sequential Duel CPU unlock rules and Fury profile are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records full unlock-cost ladder and Fury as first locked CPU. |
| LT-407 | Fury critical hit is described as standard revenge-style damage. | Human clarification | 2026-05-27 | Fury critical damage should feel like the existing revenge damage language. |
| LT-408 | If Fury attacks at attack power `30` and scores a critical hit, the intended damage outcome is `90`. | Human clarification | 2026-05-27 | Concrete damage example provides implementation target despite unresolved wording. |
| LT-409 | Fury critical damage formula wording was previously unresolved because `200% of 30` equals `60`, while the intended example said `90`; this is resolved by interpreting the label as `+200% DMG`. | [WARNING :: CONTRADICTION] | 2026-05-27 | Formula wording is resolved by base attack plus a `200%` bonus. |
| LT-410 | Fury critical hit example and formula warning are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec preserves the earlier formula tension and concrete outcome. |
| LT-411 | Fury critical damage should be implemented as `attackPower x 3`. | Human clarification | 2026-05-27 | Base attack plus `+200% DMG` equals triple attack power. |
| LT-412 | Fury critical hit should be displayed as `+200% DMG`. | Human clarification | 2026-05-27 | Player-facing wording communicates the bonus rather than total percentage. |
| LT-413 | Fury critical example: attack power `20` becomes `60`; attack power `30` becomes `90`. | Human clarification | 2026-05-27 | Concrete examples anchor the formula. |
| LT-414 | Fury critical damage formula is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records `attackPower x 3` and `+200% DMG`. |
| LT-415 | Fighter 5 is `Peasy`. | Human clarification | 2026-05-27 | Defines one additional locked Duel CPU identity after Fury. |
| LT-416 | `Peasy` is an expert `Streak` fighter type. | Human clarification | 2026-05-27 | Peasy is a stronger streak-specialist CPU archetype. |
| LT-417 | Peasy constantly uses streaks to damage opponents. | Human clarification | 2026-05-27 | Peasy's pressure comes from repeated streak offense. |
| LT-418 | Peasy answers between `0` and `1` second with `80%` probability. | Human clarification | 2026-05-27 | Defines Peasy's extremely fast answer timing behavior. |
| LT-419 | Peasy successfully blocks the player's attack `50%` of the time. | Human clarification | 2026-05-27 | Defines Peasy's defensive disruption chance. |
| LT-420 | Peasy's main mode is to do streak attacks, block the player's attempt to break its streak by answering, then unload another barrage of streaks. | Human clarification | 2026-05-27 | Defines Peasy's streak-maintenance loop. |
| LT-421 | Peasy attempts to take advantage of the player's wrong-answer vulnerability window. | Human clarification | 2026-05-27 | Peasy punishes wrong answers as part of its pressure profile. |
| LT-422 | Peasy profile is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records fighter 5 profile. |
| LT-423 | Fighter 4 is `Shi-eld`. | Human clarification | 2026-05-27 | Defines the locked roster slot before Peasy. |
| LT-424 | `Shi-eld` is a block specialist. | Human clarification | 2026-05-27 | Shi-eld's identity centers on defense. |
| LT-425 | Shi-eld blocks the player's attacks `90%` of the time. | Human clarification | 2026-05-27 | Defines Shi-eld's normal defensive reliability. |
| LT-426 | Shi-eld attacks when it scores a successful block. | Human clarification | 2026-05-27 | Shi-eld's attack trigger is tied to successful defense. |
| LT-427 | Shi-eld will not block attacks given after the `2.5` second mark `90%` of the time. | Human clarification | 2026-05-27 | Defines Shi-eld's hidden timing vulnerability. |
| LT-428 | Shi-eld would rather take end-of-turn damage than attack `90%` of the time. | Human clarification | 2026-05-27 | Defines Shi-eld's defensive bias and passivity. |
| LT-429 | Shi-eld attacks `10%` of the time to surprise the player opponent. | Human clarification | 2026-05-27 | Preserves rare surprise attacks despite defensive identity. |
| LT-430 | Shi-eld profile is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records fighter 4 profile. |
| LT-431 | Fighter 6 is `Skore`. | Human clarification | 2026-05-27 | Defines the final locked Duel CPU roster slot. |
| LT-432 | Skore can change the question type, including addition, subtraction, and chained type. | Human clarification | 2026-05-27 | Skore disrupts the player's expected question flow without using `?` mode. |
| LT-433 | Questions given when fighting Skore are always hard. | Human clarification | 2026-05-27 | Skore creates a high-difficulty question environment. |
| LT-434 | Skore can activate revenge mode after just `1` hit. | Human clarification | 2026-05-27 | Skore has accelerated revenge access. |
| LT-435 | Skore's attack starts at `1.2x` attack. | Human clarification | 2026-05-27 | Skore begins with elevated attack pressure. |
| LT-436 | Skore has `200 HP`. | Human clarification | 2026-05-27 | Skore has a larger health pool than standard opponents. |
| LT-437 | Skore tries to attack using streaks `70%` of the time. | Human clarification | 2026-05-27 | Skore combines streak pressure with question manipulation. |
| LT-438 | Skore profile is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records fighter 6 profile. |
| LT-439 | Skore should not use `?` mode. | Human clarification | 2026-05-27 | Preserves the earlier global rule that `?` mode is PvP-only. |
| LT-440 | Shi-eld unlock cost is `1000` coins and requires defeating Fury first. | Human clarification | 2026-05-27 | Defines second locked CPU unlock requirement. |
| LT-441 | Peasy unlock cost is `1500` coins and requires defeating Shi-eld first. | Human clarification | 2026-05-27 | Defines third locked CPU unlock requirement. |
| LT-442 | Skore unlock cost is `3000` coins and requires defeating Peasy first. | Human clarification | 2026-05-27 | Defines final locked CPU unlock requirement. |
| LT-443 | Sequential Duel CPU unlock chain is `Maki/Kander -> Fury -> Shi-eld -> Peasy -> Skore`, with coin costs required at each locked step. | Human clarification | 2026-05-27 | Full Duel CPU progression chain is now explicit. |
| LT-444 | Skore `?` mode removal and locked CPU unlock chain are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now preserves PvP-only `?` mode and maps locked CPU costs/prerequisites. |
| LT-445 | When Skore has revenge mode, Skore tries to maximize it by blocking a player attack and scoring attack power `30`. | Human clarification | 2026-05-27 | Defines Skore's revenge-mode priority as targeting the maximum attack bar value. |
| LT-446 | When Skore does not have revenge mode, Skore answers between `0` and `1.5` seconds with `80%` probability to score streak damage. | Human clarification | 2026-05-27 | Defines Skore's non-revenge answer timing and streak pressure behavior. |
| LT-447 | Skore revenge-mode behavior and answer timing are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records Skore's revenge and non-revenge combat rhythm. |
| LT-448 | In the remaining `20%` outside Skore's non-revenge `0-1.5s` answer timing pattern, Skore blocks. | Human clarification | 2026-05-27 | Defines Skore's non-revenge fallback action. |
| LT-449 | Skore's block has no recovery. | Human clarification | 2026-05-27 | Skore can immediately return to block pressure. |
| LT-450 | Skore can block as many times as it wants without penalty. | Human clarification | 2026-05-27 | Skore has a CPU-specific unlimited block rule. |
| LT-451 | Skore's no-recovery unlimited block is a Skore-specific CPU behavior and does not change normal player DEFEND cooldown/recovery rules. | Boundary clarification | 2026-05-27 | Preserves existing DEFEND governance while allowing Skore exception. |
| LT-452 | Skore fallback block behavior is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records Skore's block exception and boundary. |
| LT-453 | Skore's revenge-mode `maximum damage` means trying to score attack power `30`. | Human clarification | 2026-05-27 | Clarifies that Skore targets the maximum attack bar value rather than a separate damage formula. |
| LT-454 | Skore maximum-damage clarification is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records attack power `30` as Skore's revenge target. |
| LT-455 | Skore changes question type randomly after every `3` questions. | Human clarification | 2026-05-27 | Defines Skore's question-type disruption cadence. |
| LT-456 | Skore question-type change rule is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records random mode switching after every 3 questions. |
| LT-457 | Duel CPU profiles are stable enough for now to move back to game-page navigation. | Human clarification | 2026-05-27 | Remaining CPU edge cases may be deferred while navigation is clarified for MVP planning. |
| LT-458 | After choosing `1P`, a separate `1P Menu` page should open. | Human clarification | 2026-05-27 | Separates first game choice from solo-mode subnavigation. |
| LT-459 | The `1P Menu` should include `Tutorial`, `Duel CPU`, and `Stats`. | Human clarification | 2026-05-27 | Defines the main solo-mode menu options. |
| LT-460 | `Duel CPU` should open a CPU character fight selection screen. | Human clarification | 2026-05-27 | Defines the next screen for solo CPU battles. |
| LT-461 | If the selected CPU fighter is available, the fight screen loads. | Human clarification | 2026-05-27 | Available CPU selection flows into combat. |
| LT-462 | If the selected CPU fighter is locked or unavailable, the game should show a message explaining the criteria required to fight that fighter. | Human clarification | 2026-05-27 | Locked fighter feedback should tell the player how to unlock the fight. |
| LT-463 | `Stats` should show player stats. | Human clarification | 2026-05-27 | Defines the solo menu stats destination. |
| LT-464 | Initial stats include number of wins, longest streak, longest-streak match/opponent/date, total accuracy score, number of matches played, D/C count, coins earned, and number of times each CPU opponent has been defeated. | Human clarification | 2026-05-27 | Establishes first stats surface without exhausting the analytics schema. |
| LT-465 | Additional stats may be added later. | Accepted uncertainty | 2026-05-27 | The stats list is expandable. |
| LT-466 | `1P Menu`, CPU fighter selection, and Stats navigation are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records the 1P navigation branch. |
| LT-467 | After choosing `2P`, a separate `2P Menu` page should open. | Human clarification | 2026-05-27 | Multiplayer navigation has its own page rather than expanding on the first game screen. |
| LT-468 | The `2P Menu` should include `Start Private Room` and `Start Public Room`. | Human clarification | 2026-05-27 | Defines the first multiplayer menu options. |
| LT-469 | Both `Start Private Room` and `Start Public Room` should bring the player to the room lobby. | Human clarification | 2026-05-27 | Both room creation paths route into lobby context. |
| LT-470 | Private rooms allow the player to invite a friend from the player's friend list to the game. | Human clarification | 2026-05-27 | Private room purpose is friend invitation. |
| LT-471 | `2P Menu` navigation is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records the 2P menu branch. |
| LT-472 | The room lobby should show a room list. | Human clarification | 2026-05-27 | Clarifies that the lobby is primarily a room-browsing surface. |
| LT-473 | When a player chooses a room from the room list, the player joins that room. | Human clarification | 2026-05-27 | Defines the lobby-to-room transition trigger. |
| LT-474 | After a player joins a room, the game should open a separate room-ready page. | Human clarification | 2026-05-27 | Separates room browsing from pre-match readiness. |
| LT-475 | The separate room-ready page allows the two players in the room to press the ready button. | Human clarification | 2026-05-27 | Places the already clarified ready flow on its own page. |
| LT-476 | Room lobby and room-ready page separation is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now distinguishes room list browsing from two-player readiness. |
| LT-477 | The room-ready page should show `Player ___ VS Player ___`. | Human clarification | 2026-05-27 | Gives the pre-match room a direct duel framing. |
| LT-478 | The room-ready page should place the ready button in the middle. | Human clarification | 2026-05-27 | Makes match commitment visually central. |
| LT-479 | Room-ready page basic display is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records the basic room-ready UI. |
| LT-480 | When only the room creator is in the room-ready page, the page should show `Player ___ VS Waiting...`. | Human clarification | 2026-05-27 | Clarifies the one-player waiting state before an opponent joins. |
| LT-481 | When another player joins, `Waiting...` should be replaced with the opponent player's name. | Human clarification | 2026-05-27 | Defines the transition from waiting state to two-player duel framing. |
| LT-482 | Room-ready waiting-state display is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records creator waiting behavior. |
| LT-483 | Pre-match host controls should appear inside a host-options menu on the room-ready page. | Human clarification | 2026-05-27 | Keeps the room-ready page visually clean while preserving host authority. |
| LT-484 | Host-options menu placement is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records where pre-match host controls live. |
| LT-485 | While only one player is in the room-ready page, the ready button should be disabled. | Human clarification | 2026-05-27 | Prevents a player from readying before an opponent is present while preserving visible flow. |
| LT-486 | One-player ready-button disabled state is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records ready-button availability during waiting state. |
| LT-487 | After both players press ready, the 3-second countdown should appear above the ready button. | Human clarification | 2026-05-27 | Keeps the countdown close to the action players already focused on. |
| LT-488 | Room-ready countdown placement is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records countdown placement. |
| LT-489 | Each public room row/card should show the room name. | Human clarification | 2026-05-27 | Lets players identify the room before joining. |
| LT-490 | Each public room row/card should show the host/player name. | Human clarification | 2026-05-27 | Lets players identify who created or occupies the room. |
| LT-491 | Each public room row/card should show player count, such as `1/2`. | Human clarification | 2026-05-27 | Shows whether a room has space to join. |
| LT-492 | Each public room row/card should include a `Join` button. | Human clarification | 2026-05-27 | Provides the direct room-entry action. |
| LT-493 | Public room row/card content is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-27 | Source spec now records MVP room-list fields. |
| LT-494 | After choosing `2P`, a separate VS option page should open. | Human clarification | 2026-05-28 | Supersedes the earlier direct private/public room menu with a broader multiplayer entry page. |
| LT-495 | The VS option page should include `Quick Match`. | Human clarification | 2026-05-28 | Adds automatic room assignment as a fast multiplayer path. |
| LT-496 | The VS option page should include `Enter Game Lobby`. | Human clarification | 2026-05-28 | Keeps manual room browsing as a deliberate multiplayer path. |
| LT-497 | All pages should have a `Back` button that returns players to the previous page. | Human clarification | 2026-05-28 | Establishes universal navigation recovery. |
| LT-498 | Quick Match should show a `Finding a match...` page while the system searches for an available room. | Human clarification | 2026-05-28 | Gives the system time to search while keeping the player oriented. |
| LT-499 | Quick Match should assign the player to the available lobby room that was created earliest. | Human clarification | 2026-05-28 | Defines deterministic room assignment priority for quick match. |
| LT-500 | If Quick Match finds no available room because all rooms are full or no rooms exist, the game should tell the player that no available rooms were found. | Human clarification | 2026-05-28 | Clarifies failed quick-match feedback. |
| LT-501 | After Quick Match finds no available room, the game should ask whether the player wants to start a VS room. | Human clarification | 2026-05-28 | Converts failed matchmaking into room creation. |
| LT-502 | After Quick Match finds no available room, the game should present `Private Match` and `Public Match` options. | Human clarification | 2026-05-28 | Defines available room creation paths after failed matchmaking. |
| LT-503 | The game lobby should host a maximum of `100` rooms for now. | Human clarification | 2026-05-28 | Provisional capacity limit for MVP planning. |
| LT-504 | If `100` rooms have already been created, the game should show that the lobby has the maximum number of rooms and tell the player to come back later. | Human clarification | 2026-05-28 | Defines max-room failure feedback. |
| LT-505 | When a player starts a room, the room should stay in `waiting` state for `2` minutes. | Human clarification | 2026-05-28 | Prevents inactive open rooms from lingering indefinitely. |
| LT-506 | If no player joins within `2` minutes, the game should automatically close the room and tell the creator that the room was closed because no player joined. | Human clarification | 2026-05-28 | Defines waiting-room expiry behavior. |
| LT-507 | When a room has two players and both players press ready, the lobby should show that room as `in-game`. | Human clarification | 2026-05-28 | Lets other players distinguish active matches from joinable rooms. |
| LT-508 | In-game room rows should show a `View` option to other players. | Human clarification | 2026-05-28 | Adds spectator entry from the lobby. |
| LT-509 | Selecting `View` should allow the player to view the current game. | Human clarification | 2026-05-28 | Defines spectator action behavior at intent level. |
| LT-510 | Each game should allow a maximum of `10` viewers for now. | Human clarification | 2026-05-28 | Provisional viewer cap for MVP planning. |
| LT-511 | VS option page, Quick Match, lobby capacity, room expiry, and View Match behavior are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-28 | Source spec now records the expanded 2P navigation and lobby behavior. |
| LT-512 | The game lobby should not have a fixed connected-player cap for MVP. | Human clarification | 2026-05-28 | Avoids imposing an unvalidated hard access limit before technical capacity is known. |
| LT-513 | Idle lobby users should be removed from the lobby after `10` minutes of inactivity. | Human clarification | 2026-05-28 | Adds soft protection against inactive connections without hard-capping active players. |
| LT-514 | Lobby connected-player cap decision is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-28 | Source spec now records no fixed MVP lobby-player cap and idle cleanup. |
| LT-515 | Spectator view should be live. | Human clarification | 2026-05-28 | Preserves real-time viewing of match pressure. |
| LT-516 | Live spectator view is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-28 | Source spec now records spectator timing behavior. |
| LT-517 | Spectator `View` mode should be read-only. | Human clarification | 2026-05-28 | Preserves match fairness and avoids spectator disruption. |
| LT-518 | Spectators should not be able to interact during a live match. | Human clarification | 2026-05-28 | Keeps spectators outside the active duel. |
| LT-519 | Read-only spectator mode is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-28 | Source spec now records spectator interaction boundaries. |
| LT-520 | Spectators should see the same full player game UI in read-only mode. | Human clarification | 2026-05-28 | Keeps spectator display aligned with the player match view while disabling input. |
| LT-521 | Spectator full-UI display is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-28 | Source spec now records spectator UI scope. |
| LT-522 | Quick Match should not confirm that a room is found until that room space is allocated to the waiting player. | Human clarification | 2026-05-28 | Prevents false-positive match assignment. |
| LT-523 | If another player joins an inspected room first, Quick Match should recognize that the room is unavailable and continue searching. | Human clarification | 2026-05-28 | Handles room race conditions during automatic assignment. |
| LT-524 | Each room should only be inspected by one Quick Match process at a time. | Human clarification | 2026-05-28 | Prevents two Quick Match searches from competing for the same room. |
| LT-525 | If the player presses `Back` while `Finding a match...` is active, finding a match is cancelled and the player returns to the previous page. | Human clarification | 2026-05-28 | Defines cancellation behavior during matchmaking. |
| LT-526 | If a room becomes full while a player is clicking `Join`, the join attempt fails and the player remains outside the room. | Human clarification | 2026-05-28 | Treats the late joiner as too slow without disrupting the room. |
| LT-527 | If a room auto-closes at the same time another player tries to join, room closing takes priority and the joining player receives `could not join room`. | Human clarification | 2026-05-28 | Defines room expiry/join race behavior. |
| LT-528 | If a match already has the maximum number of viewers, the `View` option should be greyed out. | Human clarification | 2026-05-28 | Prevents players from expecting entry into a full spectator slot. |
| LT-529 | If a player tries to view a full spectator room anyway, show a message saying the room has the maximum number of viewers and to try viewing another room. | Human clarification | 2026-05-28 | Defines feedback for viewer-cap failure. |
| LT-530 | If a match ends while a player is trying to enter as a spectator, return a message saying `Match has ended!`. | Human clarification | 2026-05-28 | Defines match-ended spectator entry failure. |
| LT-531 | If no rooms are open, the lobby should show `No rooms open at the moment.` | Human clarification | 2026-05-28 | Defines empty lobby message. |
| LT-532 | If the host closes the room while another player is inside but not ready, return the other player to the lobby with `Host has closed the room.` | Human clarification | 2026-05-28 | Defines host-close behavior before match start. |
| LT-533 | If a player disconnects during a PvP match, all players should return to the game lobby with `A player D/C the game.` | Human clarification | 2026-05-28 | Defines mid-game disconnect navigation and messaging. |
| LT-534 | Multiplayer lobby edge cases are synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-28 | Source spec now records Quick Match, Join, View, empty lobby, host close, and mid-game D/C edge behavior. |
| LT-535 | MVP player profile data should include hidden unique player ID. | Human accepted recommendation | 2026-05-28 | Preserves identity uniqueness behind display names. |
| LT-536 | MVP player profile data should include display name. | Human accepted recommendation | 2026-05-28 | Supports visible player identity. |
| LT-537 | MVP player profile data should include coin balance. | Human accepted recommendation | 2026-05-28 | Supports rewards and identity purchases. |
| LT-538 | MVP player profile data should include unlocked CPU opponents. | Human accepted recommendation | 2026-05-28 | Supports Duel CPU progression. |
| LT-539 | MVP player profile data should include unlocked badges/avatar items. | Human accepted recommendation | 2026-05-28 | Supports identity unlock economy. |
| LT-540 | MVP player profile data should include total matches played, wins, losses, and D/C count. | Human accepted recommendation | 2026-05-28 | Supports stats and public accountability. |
| LT-541 | MVP player profile data should include total correct answers and total questions answered. | Human accepted recommendation | 2026-05-28 | Supports accuracy tracking. |
| LT-542 | MVP player profile data should include longest streak record. | Human accepted recommendation | 2026-05-28 | Supports stats page and achievement-style feedback. |
| LT-543 | MVP player profile data should include friend list and pending friend requests. | Human accepted recommendation | 2026-05-28 | Supports social invites and friend request lifecycle. |
| LT-544 | MVP player profile data baseline is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-28 | Source spec now records the minimum player profile data set. |
| LT-545 | Match record persistence should use one central match record as the source of truth. | Human accepted recommendation | 2026-05-28 | Prevents duplicated match data from drifting between player profiles. |
| LT-546 | Each completed or voided match should be saved once under a central `match_id`. | Human accepted recommendation | 2026-05-28 | Gives each match a single authoritative record. |
| LT-547 | Player profiles should store lightweight match references rather than duplicate full match records. | Human accepted recommendation | 2026-05-28 | Lets players access history without duplicating full match payloads. |
| LT-548 | Player match history should be built from central `match_id` references. | Human accepted recommendation | 2026-05-28 | Supports profile history while preserving central match truth. |
| LT-549 | Match record persistence model is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-28 | Source spec now records central match records plus player references. |
| LT-550 | MVP central match record should include identity fields: `match_id`, `match_mode`, `match_type`, `match_status`, and `void_reason`. | Human accepted recommendation | 2026-05-28 | Identifies match kind, validity, and voiding state. |
| LT-551 | MVP central match record should include participant fields: `player_ids`, `display_names_at_match_time`, `cpu_opponent_id`, and `cpu_opponent_name`. | Human accepted recommendation | 2026-05-28 | Preserves who participated and supports PVC history. |
| LT-552 | MVP central match record should include outcome fields: `winner_id`, `loser_id`, `rounds_played`, `round_wins_by_player`, `final_hp_by_player`, and `final_round_score`. | Human accepted recommendation | 2026-05-28 | Supports results display and match history. |
| LT-553 | MVP central match record should include performance fields: `correct_answers_by_player`, `total_questions_by_player`, `accuracy_by_player`, `longest_streak_by_player`, and `player_type_by_player`. | Human accepted recommendation | 2026-05-28 | Supports stats, grading, and player-type display. |
| LT-572 | Accuracy denominator counts submitted answer attempts, not every question opportunity. | Human clarification | 2026-05-28 | Correct and wrong submitted answers count; no-answer, timeout/no-action, stunned lockout, and DEFEND-only situations do not count unless an answer is submitted. |
| LT-573 | `MISSED!` counts against accuracy because it is caused by a wrong submitted answer. | Human clarification | 2026-05-28 | Wrong-answer punishment remains both a competency stat event and an in-game vulnerability event. |
| LT-574 | Detailed question logs should persist under the central `match_id`. | Human clarification | 2026-05-28 | Question-level evidence supports future sensemaking without cluttering player profiles. |
| LT-575 | Match question logs should record the question asked, which player got it correct, the timing of correctness, who won the question round, and the winning timing. | Human clarification | 2026-05-28 | Preserves enough traceability for later replay, debugging, stat audit, analytics, and possible anti-cheat review. |
| LT-576 | The database handoff document should include both recommended schema details and rationale for why each design choice exists. | Human clarification | 2026-05-28 | The database teammate needs reasoning, not just table names, so they can preserve intent while implementing. |
| LT-577 | `docs/game/handoff/GAME_DATABASE_HANDOFF.md` is the current teammate-facing database handoff artifact for the game MVP. | Artifact update | 2026-05-28 | Handoff now captures SQL-first recommendations, table names, column guidance, types, nullability, relationships, indexes, JSONB use, ORM guidance, and migration structure. |
| LT-578 | The Version 1 shop should first be introduced after the player defeats the second CPU tutorial opponent. | Human clarification | 2026-05-28 | The shop appears after core onboarding mechanics have been taught. |
| LT-579 | The first available Version 1 shop item is `Change Duelist Name`. | Human clarification | 2026-05-28 | The first shop moment supports identity building rather than match advantage. |
| LT-580 | Version 1 shop CPU unlock items are CPU opponents 3 through 6: `Fury`, `Shi-eld`, `Peasy`, and `Skore`. | Human clarification | 2026-05-28 | The shop also supports Duel CPU progression through existing coin-gated unlock rules. |
| LT-581 | Gameplay-affecting match modifiers are held off for now and should not be part of the current Version 1 shop offerings. | Human clarification | 2026-05-28 | Preserves normal PvP as skill-first and avoids adding modifier complexity to the MVP. |
| LT-582 | Icon badges, static profile pictures, animated mascots, and other identity purchases remain future shop expansion candidates unless explicitly added later. | Boundary clarification | 2026-05-28 | Earlier identity ideas are preserved without expanding the current shop beyond name change and CPU unlocks. |
| LT-583 | Shop items and purchases should persist. | Human clarification | 2026-05-28 | Purchased identity changes and CPU unlock progression must survive sessions. |
| LT-584 | CPU opponent unlock shop items are one-time unlocks. | Human clarification | 2026-05-28 | A CPU unlock should become a persistent owned state such as `Fury unlocked == true`. |
| LT-585 | `Change Duelist Name` is a repeatable shop purchase with no purchase limit if the player can pay. | Human clarification | 2026-05-28 | Name changing is identity customization rather than a finite unlock. |
| LT-586 | The first name change costs `100` coins. | Human clarification | 2026-05-28 | Establishes the guaranteed first identity purchase cost after tutorial onboarding. |
| LT-587 | Subsequent name changes cost `1000` coins each. | Human clarification | 2026-05-28 | Repeated identity changes remain possible but more expensive. |
| LT-588 | Player-type thresholds are locked as Version 1 MVP defaults while remaining tunable after playtesting. | Human accepted recommendation | 2026-05-28 | Result-screen classification can be implemented now without treating thresholds as permanent design truth. |
| LT-589 | Player-type classification uses priority order: `Wrongster`, `Avenger`, `Strategist`, `Streaker`, then `Vanilla`. | Human accepted recommendation | 2026-05-28 | Prevents multiple labels from competing when one match satisfies several patterns. |
| LT-590 | `Wrongster` applies if the player wins and wrong-answer rate is greater than `70%`. | Human accepted recommendation | 2026-05-28 | Preserves the original high-error winning identity. |
| LT-591 | `Avenger` applies if revenge attacks are the largest special damage source or the player uses revenge attacks at least `3` times in the match. | Human accepted recommendation | 2026-05-28 | Captures revenge-heavy comeback identity. |
| LT-592 | `Strategist` applies if attacks after successful DEFEND/block outcomes make up at least `35%` of successful attacks. | Human accepted recommendation | 2026-05-28 | Captures defense-into-counterattack identity. |
| LT-593 | `Streaker` applies if the player reaches a streak of `4+`, or more than `40%` of successful attacks occur inside streak sequences. | Human accepted recommendation | 2026-05-28 | Captures sustained momentum pressure without overlabeling isolated short streaks. |
| LT-594 | `Vanilla` applies if none of the higher-priority labels apply and the player mostly uses normal attacks/blocks. | Human accepted recommendation | 2026-05-28 | Provides a fallback for normal-style play. |
| LT-595 | An isolated 3-hit streak should not automatically disqualify `Vanilla`; repeated 3-hit behavior may be treated as Streaker-leaning during playtest tuning. | Boundary clarification | 2026-05-28 | Resolves the threshold gap between old `Vanilla` wording and the new `Streaker` MVP threshold. |
| LT-596 | For Version 1, the `Shop` option should only appear in the `1P Menu`. | Human clarification | 2026-05-28 | Shop is currently tied to solo onboarding, identity, and Duel CPU progression rather than PvP flow. |
| LT-597 | The `Shop` option should not appear in the `2P` menu or PvP lobby for now. | Human clarification | 2026-05-28 | Preserves PvP as skill-first and avoids surfacing shop purchases inside competitive matchmaking. |
| LT-598 | Recommended Version 1 shop screen behavior includes coin balance, purchasable item list, lock criteria, owned state, confirmation, insufficient-coin feedback, immediate state update, and Back to `1P Menu`. | Recommendation | 2026-05-28 | Gives the shop enough UX shape for implementation without over-designing the screen layout. |
| LT-599 | Recommended name-change shop behavior includes text input, visible current cost, duplicate display-name allowance, hidden ID preservation, display-name update, and coin ledger recording. | Recommendation | 2026-05-28 | Aligns name-change UI with identity and persistence rules already clarified. |
| LT-600 | Before CPU 2 is defeated, the `Shop` option should remain hidden; after CPU 2 is defeated, it appears in the `1P Menu`. | Recommendation | 2026-05-28 | Preserves the shop as a post-onboarding progression feature rather than an initial menu distraction. |
| LT-601 | Future modifier governance is held off until the MVP is stable. | Human clarification | 2026-05-28 | Prevents deferred match-advantage systems from distracting from the core MVP. |
| LT-602 | Internal engagement analytics should be captured for future sense-making. | Human clarification / recommendation | 2026-05-28 | The team needs data to understand what engages players before tuning deferred systems. |
| LT-603 | Engagement analytics should be player-linked but not shown to the player by default. | Human clarification / recommendation | 2026-05-28 | These signals are for product/design sense-making, not public profile identity. |
| LT-604 | Recommended engagement dimensions include session/retention, mode engagement, match completion, combat mechanic usage, learning friction, economy engagement, social engagement, and navigation friction. | Recommendation | 2026-05-28 | Gives the MVP a broad but structured internal engagement matrix. |
| LT-605 | Recommended engagement persistence uses raw `player_activity_events` plus summarized `player_engagement_metrics`. | Recommendation | 2026-05-28 | Preserves detailed evidence while giving the team fast internal aggregates. |
| LT-606 | `docs/game/handoff/GAME_REALTIME_SERVER_HANDOFF.md` is the current teammate-facing handoff artifact for realtime multiplayer server work. | Artifact update | 2026-05-28 | The repo already has `apps/server` with Express and `socket.io`, making realtime server work a distinct handoff from database and webhooks. |
| LT-607 | The realtime server handoff serves the `apps/server` area. | Repository alignment | 2026-05-28 | `apps/server` is the existing backend target for room coordination, socket sync, PvP authority, spectators, disconnects, and capacity behavior. |
| LT-608 | Realtime server work is distinct from webhook work unless the team explicitly assigns both to the same teammate. | Boundary clarification | 2026-05-28 | Most MVP multiplayer behavior is live socket/server coordination rather than external notification delivery. |
| LT-609 | `docs/game/GAME_MVP_READINESS_CHECKLIST.md` is the current MVP readiness and handoff orientation artifact. | Artifact update | 2026-05-28 | The checklist summarizes stable areas, handoff artifacts, intentional deferrals, and the next recommended build-planning step. |
| LT-610 | The game MVP is ready to move toward implementation planning, while exact TypeScript names, Excalibur bindings, socket payloads, ORM migrations, capacity validation, webhooks, modifiers, and anti-staleness depth remain intentionally deferred. | Readiness summary | 2026-05-28 | Clarified ground truth is sufficient for planning, but not every implementation detail needs to be frozen before coding. |
| LT-611 | Leaderboard is part of the MVP stats surface. | Human clarification | 2026-05-28 | Competitive ranking is core to the game experience and should not be omitted from MVP planning. |
| LT-612 | Leaderboard ranking priority is win rate first, accuracy second, and current win streak third. | Human clarification | 2026-05-28 | Establishes deterministic ranking without inventing an additional score. |
| LT-613 | Leaderboard should display rank, player identity, win rate, accuracy, and current win streak. | Human clarification | 2026-05-28 | Matches the desired top-rank presentation with three stat columns. |
| LT-614 | Leaderboard should show the player's own current rank at the top. | Human clarification | 2026-05-28 | Keeps the player oriented even if they are outside the visible top page. |
| LT-615 | Leaderboard should show top `20` by default, page down by `20`, and support browsing up to rank `100`. | Human clarification | 2026-05-28 | Defines MVP pagination scope. |
| LT-616 | Leaderboard should update after every valid completed match. | Human clarification | 2026-05-28 | Ranking should reflect current player outcomes. |
| LT-617 | Voided matches should not improve leaderboard performance stats. | Boundary clarification | 2026-05-28 | Preserves the rule that voided match performance is invalid while D/C accountability remains separate. |
| LT-618 | `Leaderboard` should be an option in the VS option page / `2P` menu alongside `Quick Match` and `Enter Game Lobby`. | Human clarification | 2026-05-28 | Places leaderboard in the multiplayer competitive surface rather than hiding it in solo stats. |
| LT-619 | The leaderboard page should include a `Back` button returning to the VS option page. | Recommendation | 2026-05-28 | Preserves the established navigation pattern and keeps the player in the 2P branch. |
| LT-620 | MVP leaderboard should rank PvP matches only. | Human clarification | 2026-05-28 | Leaderboard sits in the 2P competitive surface; PvC/Duel CPU ranking would distort competitive comparison. |
| LT-621 | PvC/Duel CPU leaderboard is deferred for future development. | Human clarification | 2026-05-28 | Preserves the possibility of a separate PvC leaderboard later without mixing it into MVP PvP ranking. |
| LT-622 | Players should complete at least `10` valid PvP matches before appearing on the leaderboard. | Human clarification | 2026-05-28 | Reduces unstable early rankings from tiny sample sizes. |
| LT-623 | Mutual final-round loss should not change leaderboard win/loss rate. | Human clarification | 2026-05-28 | A mutual loss does not add a leaderboard win or leaderboard loss and should not affect the win-rate denominator. |
| LT-624 | `GAME_LOGIC.md` is the canonical game logic source filename going forward. | Human clarification | 2026-05-28 | Human renamed the source spec in caps and instructed future references to stick with that filename. |
| LT-625 | Leaderboard eligibility and win-rate denominator are distinct: `pvp_matches_played` controls eligibility, while `pvp_decisive_matches` controls win-rate calculation. | Boundary clarification | 2026-05-28 | Mutual final-round losses may count as completed PvP matches for eligibility but not as win/loss-rate events. |
| LT-554 | MVP central match record should include reward fields: `reward_by_player`, `reward_breakdown_by_player`, `coins_awarded_by_player`, and `stats_valid`. | Human accepted recommendation | 2026-05-28 | Supports coin updates, result breakdowns, and voided-match handling. |
| LT-555 | MVP central match record should include disconnect/quit fields: `dc_or_quit_by_player`, `quit_press_count_by_player`, and `disconnect_event_type`. | Human accepted recommendation | 2026-05-28 | Supports D/C accountability and quit audit behavior. |
| LT-556 | MVP central match record should include timing fields: `started_at`, `ended_at`, and `duration_seconds`. | Human accepted recommendation | 2026-05-28 | Supports history, duration display, and later analysis. |
| LT-557 | MVP central match record field set is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-28 | Source spec now records the baseline central match fields. |
| LT-558 | Public pre-match profile should show display name. | Human accepted recommendation | 2026-05-28 | Provides visible identity before PvP. |
| LT-559 | Public pre-match profile should show hidden unique number ID as a short tag, such as `#1042`. | Human accepted recommendation | 2026-05-28 | Disambiguates duplicate display names without exposing full internal profile data. |
| LT-560 | Public pre-match profile should show selected badge/avatar. | Human accepted recommendation | 2026-05-28 | Shows earned identity expression. |
| LT-561 | Public pre-match profile should show total matches played, win rate, D/C count or D/C rate, and current win streak if any. | Human accepted recommendation | 2026-05-28 | Provides lightweight trust and challenge signals. |
| LT-562 | Public pre-match profile should not show coin balance, full match history, friend list, pending friend requests, exact total correct answers/questions, unlock inventory, or detailed rewards/economy data. | Human accepted recommendation | 2026-05-28 | Preserves privacy and avoids noisy pre-match disclosure. |
| LT-563 | Public pre-match profile visibility is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-28 | Source spec now records pre-match profile visibility boundaries. |
| LT-564 | Each friend list row should show display name, short unique ID tag, selected badge/avatar, and online status. | Human accepted recommendation | 2026-05-28 | Gives enough identity and availability context for friend navigation. |
| LT-565 | Friend online status values should include `online`, `in match`, and `offline`. | Human accepted recommendation | 2026-05-28 | Supports invite eligibility and presence display. |
| LT-566 | Friend request status should show `pending` or `declined` where relevant. | Human accepted recommendation | 2026-05-28 | Keeps request state visible. |
| LT-567 | Friend list row actions should include `Invite` when a friend is online and available. | Human accepted recommendation | 2026-05-28 | Supports private room invite flow. |
| LT-568 | Friend list row actions should include `View` profile when a friend is not inviteable. | Human accepted recommendation | 2026-05-28 | Provides a non-invite action for unavailable friends. |
| LT-569 | Friend list row actions should include `Accept` / `Decline` for incoming friend requests. | Human accepted recommendation | 2026-05-28 | Supports request response flow. |
| LT-570 | Friend list row actions should include `Cancel Request` or `Dismiss` for pending or declined outgoing requests. | Human accepted recommendation | 2026-05-28 | Supports outgoing request cleanup. |
| LT-571 | MVP friend list display is synchronized into `docs/game/GAME_LOGIC.md`. | Artifact update | 2026-05-28 | Source spec now records friend list row fields and actions. |

## Dependency Map

| ID | Dependent Item | Depends On | Severity Tier | Status | Blocking? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-001 | Renewed game_logic clarification | Both PvP and PvC support | Tier 1 | clarified | no | VS identity is now both player-vs-player and player-vs-computer. |
| DEP-002 | Engagement/excitement analysis | Pressure, streak, revenge, and defense loop | Tier 2 | partially clarified | yes | Core loop is emerging; stale-risk concern is deferred. |
| DEP-003 | Engine architecture interpretation | Whether engine is neutral duel core with combatant driver types layered above it | Tier 3 | clarified | no | Recommended architecture is now a neutral two-combatant TypeScript core with combatant driver types. |
| DEP-004 | Long-term depth layer | Concern that question-answer competition may become stale | Tier 2 | deferred | no | Human explicitly asked to leave this for later discussion. |
| DEP-005 | Defense skill expression | Prediction, barrage disruption, own-streak cost, failed-block question lockout, stun, initiative window, and alternate-turn cooldown | Tier 2 | clarified | no | DEFEND can serve all three timing/resource functions and is constrained by streak break, per-question lockout on failed block, and alternate-turn use. |
| DEP-011 | Wrong-answer punishment | Buff reset, 1-second vulnerability, no actions, `MISSED!` status, and normal incoming damage | Tier 2 | clarified | no | Wrong answer is a short control-loss state and momentum reset, not a bonus-damage state. |
| DEP-006 | Round lifecycle interpretation | 60-second fight rounds, question-round damage pressure, shared same-time `Additional DMG`, 150ms same-time threshold, and round-end tie checks | Tier 2 | clarified | no | Main lifecycle, carryover ownership, and same-time threshold are clarified at intent level. |
| DEP-007 | Revenge ownership and activation | Receiving a 1.4x hit from opponent streak | Tier 2 | clarified | no | Revenge belongs to the player receiving the opponent's streak damage. |
| DEP-008 | Revenge/streak exact implementation | 1.4x cap, revenge reset behavior, and non-stacking revenge formula | Tier 3 | clarified | no | Revenge is `attackPower x 2`, displays as `+100% DMG`, and starts a new streak sequence. |
| DEP-009 | Attack power bar semantics | Shared moving indicator, 5-second linear progression, 1 to 30 attack power | Tier 3 | clarified | no | One shared bar starts at 1 and increases linearly to 30 over 5 seconds. |
| DEP-010 | Implementation pathway | TypeScript logic and Excalibur animation transfer | Tier 3 | partially clarified | yes | Domain/presentation boundary is clarified; exact Excalibur scene and Actor bindings remain deferred. |
| DEP-012 | Artifact synchronization | Clarified core mechanics -> `docs/game/GAME_LOGIC.md` | Tier 2 | clarified | no | Source spec has been updated with stabilized mechanics. |
| DEP-013 | Mental-sum question contract | Fight-round-level spinner mode, question families, probability-weighted difficulty tiers, addition/subtraction tiers, mixed-mode structure, comeback assistance, and PvP-only `?` mode | Tier 2 | clarified | no | Synchronized into `docs/game/GAME_LOGIC.md`. |
| DEP-014 | PVC purpose and design boundary | Onboarding, practice, skill transfer into PvP, CPU 1 scripted tutorial sequence, simplified practice fights, immediate CPU 2 progression, CPU 2 DEFEND focus, Duel CPU roster, and CPU unlock ladder | Tier 2 | clarified for MVP planning | no | CPU 1/CPU 2 onboarding and Duel CPU progression are stable enough for domain architecture; exact tuning remains later. |

## Unresolved Issues

| ID | Issue | Type | Severity Tier | Impact | Required Action | Reasoning Status | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-001 | The meaning of "VS" is now clarified as both PvP and PvC. | ambiguity | Tier 1 | Artifact analysis can now assume both player-vs-player and player-vs-computer must be supported. | clarified | Locked. | closed |
| UI-002 | Core excitement centers on speed pressure, mastery streaks, comeback revenge, defensive streak disruption, same-time clashes, and wrong-answer pressure. | ambiguity | Tier 2 | The core loop is now synchronized into the source artifact. | clarified | Locked in `GAME_LOGIC.md`. | closed |
| UI-003 | Engine model for supporting both PvP and PvC is clarified as a recommended neutral two-combatant TypeScript core with combatant driver types layered around it. | ambiguity | Tier 3 | PvP, PVC, tutorial, Duel CPU, and spectator modes can share combat rules while differing in action-driver behavior. | clarified | Locked as implementation recommendation, not gameplay authority. | closed |
| UI-004 | The game may become stale if it is only question-answer competition. | ambiguity | Tier 2 | Long-term depth may need additional layers beyond the basic loop. | defer | Human requested later discussion. | deferred |
| UI-005 | Artifact alternated between player/player framing and `Player/CPU` wording. | intent drift/ambiguity | Tier 2 | Source spec now uses neutral player language compatible with both PvP and PvC. | clarified | Synchronized into `GAME_LOGIC.md`. | closed |
| UI-006 | Fight-round tie condition is clarified as same HP at the end of a 60-second fight round, not immediate equal HP. | contradiction | Tier 2 | The immediate tie contradiction is resolved and synchronized into `GAME_LOGIC.md`. | clarified | Locked. | closed |
| UI-007 | Defense is clarified as a multi-function momentum tool: predictive revenge block, barrage disruption, own-streak sacrifice, 1.5s stun on success, initiative window, and alternate-turn cooldown. | ambiguity | Tier 2 | Defense can now be modeled as both a tactical prediction and pressure interrupter with a real opportunity cost. | clarified | Locked at intent level. | closed |
| UI-008 | Revenge belongs to the player receiving opponent streak damage and activates after a received 1.4x hit. | ambiguity | Tier 2 | Comeback ownership is now stable. | clarified | Locked. | closed |
| UI-009 | Revenge formula and reset semantics are clarified at intent level. | ambiguity | Tier 3 | Engine can encode revenge as a separate `attackPower x 2` attack that resets after use/block and begins the next streak sequence. | clarified | Locked. | closed |
| UI-010 | Attack power source is the shared moving indicator's linear position from 1 to 30 over 5 seconds, captured on correct Enter press. | ambiguity | Tier 3 | Power source, movement curve, and shared ownership are now clarified. | clarified | closed |
| UI-011 | Human said attack damage starts from `-1HP`, while also describing a range of 1 to 30. | ambiguity | Tier 3 | Human corrected this to start from 1. | clarified | closed |
| UI-012 | TypeScript logic must transfer cleanly into Excalibur animation by keeping domain state as combat truth and Excalibur as presentation/input/animation. | unresolved dependency | Tier 3 | Pure game logic remains separable from rendering/animation concerns, while exact scene bindings remain deferred. | partially clarified | Boundary clarified; exact Excalibur bindings remain deferred. | open |
| UI-013 | Mistimed DEFEND and wrong-answer consequences are clarified at intent level. | ambiguity | Tier 2 | Failed defense costs own streak and block availability for the question round; wrong answers reset buffs and create a 1-second `MISSED!` no-action state with normal incoming damage. | clarified | Locked. | closed |
| UI-014 | Question mode is selected by a spinner at the beginning of a fight round and applies to the full 60-second fight round. | ambiguity | Tier 2 | Question type becomes part of fight-round identity and pacing. | clarified | Locked at intent level. | closed |
| UI-015 | Comeback-aware question difficulty is probability-weighted: 40% baseline easy, 60% for active/near revenge, and 65% for severe HP disadvantage. | ambiguity | Tier 2 | Easier questions support comeback chances without mandating assistance every time. | clarified | Locked at intent level. | closed |
| UI-016 | Easy-tier addition questions are clarified as addition sums between numbers 1 to 15. | ambiguity | Tier 2 | Addition easy-tier generation can now be implemented. | clarified | Locked. | closed |
| UI-017 | Normal-tier addition questions use numbers 1 to 30. | ambiguity | Tier 2 | Addition normal-tier generation can now be implemented. | clarified | Locked. | closed |
| UI-018 | Easy-tier subtraction questions use numbers 1 to 40 and allow negative answers. | ambiguity | Tier 2 | Subtraction easy-tier generation can now be implemented. | clarified | Locked. | closed |
| UI-019 | Normal-tier subtraction questions use numbers 1 to 100 and allow negative answers. | ambiguity | Tier 2 | Subtraction normal-tier generation can now be implemented. | clarified | Locked. | closed |
| UI-020 | Mixed-mode questions use three-term chains with tier difficulty determined by how many terms are 2-digit numbers. | ambiguity | Tier 2 | Mixed-mode generation can now distinguish easy and difficult prompts at intent level. | clarified | Locked at intent level. | closed |
| UI-021 | Mixed-mode prompts may begin with a negative number. | ambiguity | Tier 2 | Mixed prompt formatting can include negative leading terms. | clarified | Locked. | closed |
| UI-022 | Mixed-mode operation signs are randomly chosen from `+` and `-`. | ambiguity | Tier 2 | Mixed-mode sign selection can now be implemented without pattern enforcement. | clarified | Locked. | closed |
| UI-023 | `?` mode reaction-based actions appear randomly, use random 4 to 9 digit sequence lengths, and award the attack to the first player to complete input. | ambiguity | Tier 2 | Reaction task generation and ownership can now be modeled at intent level. | clarified | Locked. | closed |
| UI-024 | `?` mode reaction-based arcade tasks appear 30% of the time. | ambiguity | Tier 2 | `?` mode content distribution is partially clarified. | clarified | Locked. | closed |
| UI-025 | The remaining 70% of `?` mode content splits 60% mixed addition/subtraction and 40% two-3-digit addition. | ambiguity | Tier 2 | `?` mode content distribution is now clarified at intent level. | clarified | Locked. | closed |
| UI-026 | `?` mode two-3-digit addition uses operands from 100 to 999. | ambiguity | Tier 2 | `?` mode two-3-digit addition generation can now be implemented. | clarified | Locked. | closed |
| UI-027 | The PvP question-generation contract is synchronized into `GAME_LOGIC.md`. | unresolved dependency | Tier 2 | Source spec now contains the stabilized PvP question mode rules. | clarified | Locked. | closed |
| UI-028 | PVC purpose is onboarding plus practice for transfer into real-player PvP. | ambiguity | Tier 2 | PVC should be evaluated by how well it teaches mechanics and prepares players for PvP. | clarified | CPU 1/CPU 2 onboarding and Duel CPU practice branches are now substantially clarified. | closed |
| UI-029 | The first PVC CPU character should train the streak mechanic. | ambiguity | Tier 2 | CPU 1 is now designed around streak/revenge onboarding, scripted tutorial, simplified practice, and total-defeat completion. | clarified | Locked through CPU 1 tutorial/practice sequence. | closed |
| UI-030 | CPU 1 scripted tutorial sequence is clarified through guided attacks, shock, CPU streak, revenge, and player streak task. | ambiguity | Tier 2 | CPU 1 onboarding flow can now be implemented as a tutorial script at intent level. | clarified | Locked at sequence level. | closed |
| UI-031 | CPU 1 should use a task tracker with completion ticks. | ambiguity | Tier 3 | Tutorial UI should explicitly show the player what to do next. | clarified | Locked at intent level. | closed |
| UI-032 | CPU 1 continues into a simplified practice fight without DEFEND after the scripted tutorial. | ambiguity | Tier 2 | CPU 1 post-tutorial flow is now clarified at intent level. | clarified | Locked. | closed |
| UI-033 | Player status display includes attack status bars and DEFEND/status spaces. | ambiguity | Tier 3 | UI can communicate attack buffs, DEFEND availability, DEFEND success, and misses. | clarified | Locked at intent level. | closed |
| UI-034 | CPU 1 simplified practice fight includes moderate CPU attacks that can interrupt and reset player streaks. | ambiguity | Tier 2 | CPU 1 practice resistance is now clarified at intent level. | clarified | Locked. | closed |
| UI-035 | CPU 1 completion requires totally defeating the CPU, and that objective should be displayed on the game screen. | ambiguity | Tier 2 | CPU 1 clear condition and objective visibility are now clarified. | clarified | Locked. | closed |
| UI-036 | If the player loses to CPU 1 after the scripted tutorial, they retry only the simplified practice fight. | contradiction | Tier 2 | Superseded by no-player-defeat onboarding clarification. | superseded | Player cannot experience defeat in CPU 1 or CPU 2. | closed |
| UI-037 | After CPU 1 is cleared, the player moves on to CPU 2 immediately. | ambiguity | Tier 2 | PVC progression after CPU 1 is now clarified. | clarified | Locked. | closed |
| UI-038 | CPU 2 should introduce the DEFEND mechanic. | ambiguity | Tier 2 | CPU 2 now has normal DEFEND demonstration, cooldown lesson, streak-disruption lesson, revenge-advantage lesson, simplified practice, and total-defeat completion. | clarified | Locked through CPU 2 tutorial/practice sequence. | closed |
| UI-039 | DEFEND lasts 1 second and locks out non-DEFEND actions during that window. | ambiguity | Tier 2 | DEFEND timing can now be implemented at intent level. | clarified | Locked. | closed |
| UI-040 | CPU 2 first teaches DEFEND against normal attacks through two CPU DEFEND demonstrations and one player DEFEND demonstration. | ambiguity | Tier 2 | CPU 2 initial tutorial sequence is clarified at intent level. | clarified | Locked at sequence level. | closed |
| UI-041 | CPU 2 should teach DEFEND cooldown/alternate-turn availability, streak disruption, and revenge-advantage conversion after the initial DEFEND demonstrations. | ambiguity | Tier 2 | CPU 2 follow-up curriculum is now clarified at intent level. | clarified | Cooldown, streak-disruption setup, revenge-advantage scripted chain, practice fight, and clear condition locked. | closed |
| UI-042 | CPU 2 cooldown lesson should teach DEFEND unavailability through greyed/faint button state for 1 turn. | ambiguity | Tier 2 | The cooldown lesson now has a clear player-facing teaching method. | clarified | Locked. | closed |
| UI-043 | CPU 2 streak-disruption lesson should let CPU build a visible 3-4 hit streak before prompting DEFEND. | ambiguity | Tier 2 | The streak-disruption lesson now has a clear dramatic setup. | clarified | Locked. | closed |
| UI-044 | CPU 2 revenge-advantage event should activate the player's revenge gauge through scripted streak damage. | ambiguity | Tier 2 | The revenge-advantage lesson now starts from a real comeback state. | clarified | Locked. | closed |
| UI-045 | CPU 2 revenge-advantage event should freeze after revenge activation and prompt player DEFEND before continuing. | ambiguity | Tier 2 | The comeback pivot now has an explicit teaching pause. | clarified | Locked. | closed |
| UI-046 | CPU 2 revenge-advantage event should immediately prompt answer/revenge attack after player DEFEND. | ambiguity | Tier 2 | The comeback chain now resolves into player counterattack. | clarified | Locked. | closed |
| UI-047 | CPU 2 should continue into a simplified DEFEND practice fight cleared by totally defeating CPU 2. | ambiguity | Tier 2 | CPU 2 now has a clear post-tutorial mastery test. | clarified | Locked. | closed |
| UI-048 | CPU 2 practice should increase CPU streak-damage likelihood to activate player revenge more often. | ambiguity | Tier 2 | Practice remains aligned with the revenge-advantage lesson. | clarified | Locked. | closed |
| UI-049 | CPU 1 and CPU 2 should not allow player defeat; HP deductions are visualized and then restored. | intent_change | Tier 2 | Superseded by renewed stakes-aware onboarding intent. | superseded | Player can lose CPU 1 and CPU 2. | closed |
| UI-050 | CPU 1 and CPU 2 allow player defeat to create stakes while preserving scripted tutorials. | ambiguity | Tier 2 | Stakes-aware onboarding is now clarified. | clarified | Locked. | closed |
| UI-051 | After scripted sequences are passed, CPU 1/CPU 2 replays may skip scripts and start from practice. | ambiguity | Tier 2 | Replay pacing avoids forcing repeated tutorial sequences. | clarified | Locked. | closed |
| UI-052 | Fight menu should allow replaying scripted tutorials. | ambiguity | Tier 2 | Tutorial access remains available after scripted sequences are skipped by default. | clarified | Locked. | closed |

## Ambiguity Severity Register

Severity affects questioning priority, escalation priority, and clarification frontier ordering. Severity does not create governance authority.

| Tier | Meaning | Active Items | Notes |
| --- | --- | --- | --- |
| Tier 1 | Constitutional / Identity destabilizing |  | VS identity clarified as both PvP and PvC. |
| Tier 2 | Structural dependency destabilizing | UI-004 | Core combat, PvP question generation, PVC onboarding, PvP rooms, results, and persistence baseline are substantially clarified; anti-staleness depth remains deferred. |
| Tier 3 | Implementation destabilizing | UI-012 | Engine model is now recommended as a neutral two-combatant TypeScript core; exact Excalibur scene bindings remain to be encoded. |
| Tier 4 | Cosmetic / Low-risk |  | Pending renewed artifact pass. |

## Accepted Uncertainty

| ID | Uncertainty | Rationale for Acceptance | Scope | Revisit Trigger |
| --- | --- | --- | --- | --- |
| AU-001 | Prior unresolved semantic history may no longer be present in the active artifacts. | Human selected overwrite during KRYSTALIZE RESET. | Active `game_logic` artifacts. | Human reopens prior topics or requests recovery from git/history. |
| AU-002 | The game may need "something more" to avoid becoming stale. | Human explicitly asked to leave this for later discussion. | Long-term game depth beyond basic pressure/streak/revenge/defense loop. | Revisit after basic mechanics and current artifact are clarified. |

## Warning Registry

Warnings must use exact KRYSTALIZE syntax.

Allowed warning syntax:

```text
[WARNING :: CONTRADICTION]
[WARNING :: AMBIGUITY]
[WARNING :: INTENT_CHANGE_DETECTED]
[WARNING :: UNRESOLVED_DEPENDENCY]
[WARNING :: SESSION_OVERWRITE]
```

| ID | Warning Syntax | Severity Tier | Issue | Implications | Warning-Linked Rationale | Clarification or Deferral Requested | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| W-001 | [WARNING :: SESSION_OVERWRITE] | Tier 1 | Current session was overwritten by human instruction. | Constitutional artifacts may be replaced, unresolved semantic history may be lost, and semantic traceability continuity may break. | Required by KRYSTALIZE RESET overwrite behavior. | Proceed with renewed human intent framing. | acknowledged |
| W-002 | [WARNING :: INTENT_CHANGE_DETECTED] | Tier 2 | Artifact used `Player/CPU` in timeout damage while current intent requires both PvP and PvC. | Actor model could have drifted toward PvC-only if names were implemented literally. | `GAME_LOGIC.md` now uses neutral player language. | resolved | closed |
| W-003 | [WARNING :: CONTRADICTION] | Tier 2 | Fight round says equal HP means tie while players start each round at equal HP. | Fight rounds could terminate immediately if interpreted literally. | Human clarified ties happen when both players have the same HP at the end of a 60-second fight round. | resolved | closed |
| W-004 | [WARNING :: AMBIGUITY] | Tier 2 | DEFEND disrupts streaks, but its timing skill was underspecified. | Defense could have become too easy, too random, or too weak depending on timing model. | Human clarified DEFEND can serve predictive, barrage-disrupting, and turn-level resource functions. | resolved | closed |
| W-005 | [WARNING :: AMBIGUITY] | Tier 2 | Revenge ownership was ambiguous between comeback protection and streak reward. | Damage/comeback economy could have become confusing if revenge ownership stayed unstable. | Human clarified revenge activates for the player who receives a 1.4x hit from opponent streak. | resolved | closed |
| W-006 | [WARNING :: CONTRADICTION] | Tier 3 | Fury critical hit was described as `200% of 30` resulting in `90` damage. | Implementing literal percentage math would produce `60`, while following the example produces `90`. | Human clarified the intended meaning is `+200% DMG`: base attack plus a `200%` bonus. | Implement Fury critical as `attackPower x 3` and display `+200% DMG`. | resolved |
| W-007 | [WARNING :: UNRESOLVED_DEPENDENCY] | Tier 2 | Lobby and spectator capacity limits are provisional rather than technically validated. | Actual server performance, websocket behavior, database load, and gameplay smoothness may require different room/player/viewer caps. | Human intentionally set `100` rooms and `10` viewers as initial limits while noting uncertainty; fixed lobby-player cap is deferred in favor of idle cleanup. | Defer technical validation to architecture/load-testing pass; preserve current values as MVP design placeholders. | open |

## Artifact Alignment Review

### Matches Intended Core Loop

| ID | Intended Loop Element | Artifact Support | Source | Status |
| --- | --- | --- | --- | --- |
| AM-001 | Fast-answer pressure | Shared 5-second power bar, first-answer ownership, and 150ms same-time window. | `docs/game/GAME_LOGIC.md:94`, `docs/game/GAME_LOGIC.md:251`, `docs/game/GAME_LOGIC.md:296` | aligned |
| AM-002 | Mastery streaks | Streak multiplier table rewards consecutive success and caps at x1.4. | `docs/game/GAME_LOGIC.md:185` | aligned |
| AM-003 | Revenge comeback | Receiving a x1.4 hit grants revenge; revenge attack is `attackPower x 2`. | `docs/game/GAME_LOGIC.md:210` | aligned |
| AM-004 | Defense disrupts streak | DEFEND can nullify attack, stun attacker, reset attacker streak, and costs own streak. | `docs/game/GAME_LOGIC.md:132`, `docs/game/GAME_LOGIC.md:319` | aligned |
| AM-005 | Stats observe outcomes | Engine defines rules; UI displays; stats observe. | `docs/game/GAME_LOGIC.md:483` | aligned |

### Contradictions Or Drift

| ID | Issue | Source | Why It Matters | Status |
| --- | --- | --- | --- | --- |
| CD-001 | `Player/CPU` wording appeared inside a ruleset that must support both PvP and PvC. | prior artifact | Resolved by synchronizing `GAME_LOGIC.md` with neutral player language. | clarified |
| CD-002 | Equal HP tie condition conflicted with starting equal HP. | prior artifact | Resolved in `GAME_LOGIC.md`: equal HP only creates tie at fight-round end. | clarified |

### Underspecified Mechanics

| ID | Mechanic | Missing Clarification | Source | Status |
| --- | --- | --- | --- | --- |
| US-001 | DEFEND timing | Intent supports predictive revenge blocking, barrage disruption, and turn-level resource use; failed block resets own streak and prevents another block for that question round. | `docs/game/GAME_LOGIC.md:106-119`, `docs/game/GAME_LOGIC.md:214-234` | clarified |
| US-002 | Streak beyond 5 | Multiplier caps at 1.4x; artifact should explicitly say this. | `docs/game/GAME_LOGIC.md:135-143`, `docs/game/GAME_LOGIC.md:286-287` | clarified |
| US-003 | Revenge behavior | Intent is clarified: `attackPower x 2`, shown as `+100% DMG`, reset after use/block, and next consecutive attack becomes 1.1x. | `docs/game/GAME_LOGIC.md:151-167` | clarified |
| US-004 | Question/answer contract | Spinner modes, difficulty probabilities, arithmetic tiers, mixed mode, and PvP-only `?` mode are now synchronized into the source spec. | `docs/game/GAME_LOGIC.md` | clarified |
| US-005 | Status durations | `MISSED!` is clarified as 1 second; `STUNNED` is clarified as 1.5 seconds; `SHOCK!` and `Additional DMG` are status display outcomes without clarified display duration. | `docs/game/GAME_LOGIC.md:73`, `docs/game/GAME_LOGIC.md:286`, `docs/game/GAME_LOGIC.md:337` | partially clarified |
| US-006 | Same-time answer carryover | `Additional DMG` is one shared carryover value applied to the next question round; it derives from the shared current attack value when the second valid answer occurs within 150ms of the first valid answer. | `docs/game/GAME_LOGIC.md:197-205` | clarified |

### Deferred

| ID | Deferred Topic | Reason Deferred | Status |
| --- | --- | --- | --- |
| DF-001 | Additional anti-staleness layer beyond question-answer competition. | Human explicitly asked to leave it for later. | deferred |

## Implementation Recommendations And Rationale

This section consolidates implementation recommendations that have emerged from the clarified constitutional terrain.

These recommendations are not new game authorities. They do not override locked gameplay intent, human authority, or future implementation discoveries. They exist to help future TypeScript, Excalibur, database, and integration work preserve the meaning already clarified.

### Boundary Rule

| ID | Boundary | Rationale |
| --- | --- | --- |
| IRB-001 | Constitutional rules define what the game must mean and do; implementation recommendations describe how the current team may encode that intent. | Prevents implementation convenience from silently rewriting game semantics. |
| IRB-002 | Recommendations may be revised during implementation if the rationale is preserved and the human accepts the change. | Keeps engineering flexible without losing traceability. |
| IRB-003 | Runtime state, database persistence, and Excalibur presentation should remain conceptually separate. | Prevents combat logic, saved records, and animation/UI concerns from becoming tangled. |

### Recommendation Register

| ID | Recommendation | Status | Rationale |
| --- | --- | --- | --- |
| IR-001 | Use pure TypeScript domain logic as the source of truth for combat, question generation, match resolution, rewards, and profile/stat updates. | recommended | The same game rules must work across PvP, PvC, tutorials, CPU duels, and Excalibur scenes. |
| IR-002 | Treat Excalibur as the presentation, input, animation, and scene layer rather than the owner of combat rules. | recommended | Excalibur Actors should display and animate results; they should not become the place where core damage, DEFEND, revenge, streak, or reward rules are hidden. |
| IR-003 | Use runtime TypeScript structures for current-match computation and persistence-specific structures for database records. | recommended | Current-match state changes quickly and contains timing/status details that should not all be saved as long-term records. |
| IR-004 | Persist one central match record per completed, voided, or forfeited match; player profiles store lightweight match references. | locked recommendation | This preserves a single source of truth while allowing each player profile to show match history. |
| IR-005 | Persist derived player profile summaries separately from raw match runtime state. | recommended | Profile screens need fast access to totals, unlocks, D/C count, win/loss data, and coin balance without replaying every match record. |
| IR-006 | Use mapper functions between runtime results and database records. | recommended | A mapper layer preserves the difference between what the engine computes now and what the database must remember later. |
| IR-007 | Prefer a hybrid architecture: plain TypeScript types plus pure functions/state reducers for domain logic, with lightweight classes or Excalibur Actors only where they serve scene or animation needs. | recommended | This keeps logic testable while still fitting naturally into Excalibur's scene/actor model. |
| IR-008 | Persist lightweight question-round logs under each central `match_id`. | locked recommendation | The human clarified that question logs are useful for future sensemaking and should live under match details rather than player profiles. |

### Runtime Structures

These structures are recommended for computation during an active match. They are not database tables by default.

| Structure | Purpose | Persistence Guidance |
| --- | --- | --- |
| `MatchRuntimeState` | Active match state, including mode, players, current fight round, timers, question round, and scores. | Runtime only; saved indirectly through `MatchRecord` at match end. |
| `FightRoundState` | Current 60-second fight round, round timer, spinner mode, HP state, and round outcome. | Runtime only; summarize into match record. |
| `QuestionRoundState` | Current prompt, correct answer, attack-power timing, same-time window, `Additional DMG`, and action resolution. | Runtime only, but each resolved question round should produce a persisted `MatchQuestionLog` under `match_id`. |
| `PlayerCombatState` | HP, streak count, revenge state, DEFEND availability, stun/miss status, and active buffs. | Runtime only; summarize final/aggregate values into match record/profile. |
| `PowerBarState` | Shared 1-to-30 linear attack-power bar over 5 seconds. | Runtime only. |
| `RoundResolution` | Result of one question-round resolution: attacker, defender, damage, block state, same-time state, shock state, and status changes. | Runtime result that feeds match summary stats and persisted match question logs. |

### Runtime vs Persistence Classification

This classification is intended to prevent accidental database overreach. A structure can be useful in TypeScript without being appropriate to store permanently.

| Object / Structure | Category | Save In Database? | Reason |
| --- | --- | --- | --- |
| `MatchRuntimeState` | runtime structure | no | Represents the living match and includes changing timers, current prompt, transient statuses, and current combat state. |
| `FightRoundState` | runtime structure | no | Exists while a 60-second fight round is active; only final round outcome and summary values should persist. |
| `QuestionRoundState` | runtime structure | no as full state | Needed to resolve one prompt/action cycle; persisted output should be a lightweight `MatchQuestionLog`, not the entire live state. |
| `PlayerCombatState` | runtime structure | no | HP, active revenge, DEFEND cooldown, stun/miss windows, and streak state change constantly and should reset by match/round rules. |
| `PowerBarState` | runtime structure | no | Pure timing/animation/combat capture state; final captured attack power may appear in match question logs but not profile data. |
| `RoundResolution` | runtime result | no as full state | Useful for applying UI updates and aggregating stats; should feed match summaries and lightweight match question logs. |
| `PlayerProfile` | persisted record | yes | Stores stable player-facing progression and stats such as coin balance, unlocks, D/C count, wins/losses, and total accuracy values. |
| `MatchRecord` | persisted record | yes | Central source of truth for completed, voided, or forfeited matches. |
| `MatchQuestionLog` | persisted child record | yes | Stores question-round evidence under `match_id`: question asked, correct player(s), timing, winner, and winning timing. |
| `PlayerMatchRef` | persisted reference | yes | Lets each player profile point to central match records without duplicating them. |
| `CoinLedgerEntry` | persisted audit record | yes | Preserves why coins were earned or spent. |
| `FriendRequest` | persisted social record | yes | Friend request state must survive navigation and sessions. |
| `Friendship` | persisted social record | yes | Accepted friend relationships must persist for friend lists and private invites. |
| `PublicProfileView` | derived view / DTO | no as source of truth | Generated from profile/player data for pre-match display; may be cached later, but canonical data lives elsewhere. |
| `PostMatchResultView` | derived view / DTO | no as source of truth | Generated from `MatchRecord`, rewards, and profile updates for display after a match. |
| `ProfileUpdatePatch` | mapper output | no as source of truth | Computed from a match result and applied to `player_profiles`; not itself a permanent gameplay object. |

### Old TypeScript Structure Mapping

The earlier screenshot-style types are useful as a starting vocabulary, but they should be reinterpreted through the current clarified architecture.

| Prior Type | Recommended Treatment | Rationale |
| --- | --- | --- |
| `GameState` | Rename/expand into `MatchRuntimeState`; runtime only. | The old shape captured one active player-vs-CPU match but does not cover PvP, spectators, match status, tutorials, or network state. |
| `Player` | Split into persisted identity/profile data and runtime `PlayerCombatState`. | A player's display name, hidden ID, coins, and unlocks persist; HP, status, action time, revenge, and DEFEND cooldown are combat state. |
| `Status` | Keep as runtime combat/status union. | Values like `NORMAL`, `DEFEND`, `STUNNED`, `SHOCKED`, `DRAW`, or `MISSED` are temporary match states. |
| `Action` | Keep as runtime input/action union. | `ATTACK`, `DEFEND`, `NONE`, and later quit/skip-like actions are match events, not profile data. |
| `RoundResult` | Treat as `RoundResolution` or `QuestionRoundResolution`; runtime result. | It should drive UI, stat aggregation, match-level summaries, and lightweight match question logs. |
| `RoundLog` | Reinterpret as persisted `MatchQuestionLog` under `match_id`. | Question logs are now locked for future sensemaking, but should remain match-scoped rather than profile-scoped. |
| `MatchStats` | Split into persisted match summary and aggregated profile stats. | Accuracy, longest streak, player type, and correct-question counts appear in `MatchRecord`; profile totals update from those records. |
| `Playstyle` | Persist per match as `player_type_by_player`; optionally aggregate later. | The result screen needs player type for each match; long-term favorite style can be derived later. |

### Persisted Object Sketches

These sketches describe what should persist conceptually. Exact database syntax, nullable constraints, indexes, migrations, and ORM models remain implementation decisions.

```ts
type Player = {
  player_id: string;
  hidden_number_id: number;
  display_name: string;
  created_at: string;
};
```

```ts
type PlayerProfile = {
  player_id: string;
  coin_balance: number;
  selected_badge_id: string | null;
  selected_avatar_id: string | null;
  total_matches_played: number;
  wins: number;
  losses: number;
  dc_count: number;
  total_correct_answers: number;
  total_questions_answered: number;
  longest_streak: number;
  longest_streak_match_id: string | null;
  current_win_streak: number;
};
```

```ts
type PlayerUnlock = {
  player_id: string;
  unlock_type: 'cpu_opponent' | 'badge' | 'avatar' | 'profile_picture' | 'mascot';
  unlock_id: string;
  unlocked_at: string;
};
```

```ts
type CoinLedgerEntry = {
  entry_id: string;
  player_id: string;
  amount: number;
  reason: 'match_reward' | 'name_change' | 'unlock_purchase';
  related_match_id?: string;
  created_at: string;
};
```

```ts
type MatchRecord = {
  match_id: string;
  match_mode: 'PVP' | 'PVC';
  match_type: 'tutorial' | 'duel_cpu' | 'public_pvp' | 'private_pvp' | 'quick_match';
  match_status: 'completed' | 'voided' | 'forfeited';
  void_reason: 'connection_dropped' | 'quit_confirmed' | 'none';

  player_ids: string[];
  display_names_at_match_time: Record<string, string>;

  cpu_opponent_id?: string;
  cpu_opponent_name?: string;

  winner_id: string | null;
  loser_id: string | null;

  rounds_played: number;
  round_wins_by_player: Record<string, number>;
  final_hp_by_player: Record<string, number>;
  final_round_score: string;

  correct_answers_by_player: Record<string, number>;
  total_questions_by_player: Record<string, number>;
  accuracy_by_player: Record<string, number>;
  longest_streak_by_player: Record<string, number>;
  player_type_by_player: Record<string, string>;

  reward_by_player: Record<string, number>;
  reward_breakdown_by_player: Record<string, string>;
  coins_awarded_by_player: Record<string, number>;

  stats_valid: boolean;

  dc_or_quit_by_player: Record<string, boolean>;
  quit_press_count_by_player: Record<string, number>;
  disconnect_event_type: 'connection_dropped' | 'quit_confirmed' | 'none';

  started_at: string;
  ended_at: string;
  duration_seconds: number;
};
```

```ts
type MatchQuestionLog = {
  log_id: string;
  match_id: string;
  fight_round_number: number;
  question_round_number: number;
  question_id: string;
  question_text: string;
  correct_answer: number | string;
  question_mode: string;
  correct_player_ids: string[];
  correct_answer_time_ms_by_player: Record<string, number>;
  question_winner_player_id: string | null;
  winning_time_ms: number | null;
  outcome: 'attack_won' | 'same_time' | 'shock' | 'blocked' | 'no_winner';
};
```

```ts
type PlayerMatchRef = {
  player_id: string;
  match_id: string;
  played_at: string;
  result: 'win' | 'loss' | 'voided' | 'forfeited';
};
```

```ts
type FriendRequest = {
  request_id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  responded_at?: string;
};
```

```ts
type Friendship = {
  player_a_id: string;
  player_b_id: string;
  created_at: string;
};
```

### Runtime Structure Sketches

These sketches are intentionally separate from the database objects.

```ts
type MatchRuntimeState = {
  matchId: string;
  mode: 'PVP' | 'PVC';
  matchType: 'tutorial' | 'duel_cpu' | 'public_pvp' | 'private_pvp' | 'quick_match';
  players: Record<string, PlayerCombatState>;
  currentFightRound: FightRoundState;
  roundsWonByPlayer: Record<string, number>;
  matchClockStatus: 'active' | 'paused' | 'finished' | 'voided';
};
```

```ts
type PlayerCombatState = {
  playerId: string;
  hp: number;
  streakCount: number;
  revengeActive: boolean;
  defendAvailable: boolean;
  defendLockedForQuestion: boolean;
  status: 'normal' | 'defending' | 'stunned' | 'missed' | 'shocked';
  statusEndsAtMs: number | null;
};
```

```ts
type QuestionRoundState = {
  questionId: string;
  prompt: string;
  correctAnswer: number | string;
  mode: 'addition' | 'subtraction' | 'mixed' | 'question_mark';
  powerBar: PowerBarState;
  additionalDamageCarryover: number;
  firstValidAnswerAtMs: number | null;
  firstValidAnswerPlayerId: string | null;
  sameTimeWindowMs: 150;
};
```

```ts
type PowerBarState = {
  minPower: 1;
  maxPower: 30;
  durationMs: 5000;
  startedAtMs: number;
};
```

### Mapper Responsibility

Mapper functions should translate runtime outcomes into persisted records and display DTOs.

| Mapper | Input | Output | Purpose |
| --- | --- | --- | --- |
| `toMatchRecord` | Final `MatchRuntimeState` plus aggregate stats | `MatchRecord` | Saves the central match truth after completed, voided, or forfeited matches. |
| `toMatchQuestionLogs` | Resolved question-round history for a match | `MatchQuestionLog[]` | Saves question-level evidence under the central `match_id` for future sensemaking and audit. |
| `toPlayerProfileUpdates` | `MatchRecord` and existing profiles | profile update patches | Updates wins/losses, D/C counts, coins, accuracy totals, longest streak, and current win streak. |
| `toCoinLedgerEntries` | `MatchRecord` rewards | `CoinLedgerEntry[]` | Audits match reward coin changes. |
| `toPublicProfileView` | `Player` plus `PlayerProfile` | public profile DTO | Shows only pre-match public identity/trust fields. |
| `toPostMatchResultView` | `MatchRecord` plus updated profile context | post-match DTO | Shows result screen stats, reward breakdown, quote, Add Friend, Replay, and Back actions. |

### Internal Game Events

Internal game events are named moments the game logic should recognize. They are not webhook contracts yet.

These events may later feed database persistence, server events, UI updates, notifications, analytics, or webhook handoff. For now, they are kept inside the constitution as implementation-facing event boundaries.

| Event | Category | When It Occurs | Likely Consumers Later |
| --- | --- | --- | --- |
| `match.started` | match lifecycle | A match begins after the required ready/countdown/tutorial start condition. | runtime engine, UI, server, match record initialization |
| `match.round_started` | match lifecycle | A 60-second fight round begins. | runtime engine, UI, question spinner, optional analytics |
| `match.round_ended` | match lifecycle | A fight round ends and round winner/tie state is determined. | runtime engine, UI, match record aggregation |
| `match.completed` | match lifecycle | A match ends with a valid winner/loser or mutual loss outcome. | database, rewards, profile updates, results screen |
| `match.voided` | match lifecycle/accountability | A match is invalidated because of disconnect, quit, or another voiding condition. | database, D/C records, results screen, deterrence messaging |
| `match.forfeited` | match lifecycle/accountability | A player forfeits under clarified rules such as repeated PvP quit abuse. | database, profile stats, results screen, accountability logic |
| `player.disconnected` | player/accountability | The game detects that a player connection dropped during PvP. | server, database, D/C count, lobby return flow |
| `player.quit_pressed` | player/accountability | A player presses the quit button before confirming quit. | UI overlay, quit press count, anti-abuse logic |
| `player.quit_confirmed` | player/accountability | A player confirms quitting a match. | server, database, D/C count, void/forfeit logic |
| `reward.coins_awarded` | economy | Match rewards are calculated and applied. | database, coin ledger, profile updates, results screen |
| `friend.request_sent` | social | A player sends a friend request. | database, recipient notification/UI |
| `friend.request_accepted` | social | A recipient accepts a friend request. | database, friend list updates, notifications |
| `cpu_opponent.unlocked` | progression | A player unlocks a CPU opponent through prerequisite wins and coin cost. | database, profile/progression UI |
| `profile.name_changed` | identity/economy | A player spends coins to change display name. | database, coin ledger, profile UI |

### Internal Event Boundary Notes

| ID | Boundary | Rationale |
| --- | --- | --- |
| IEB-001 | Internal events are not necessarily one-to-one with webhooks. | Some events may stay local to the game runtime or server and never become external notifications. |
| IEB-002 | Internal events should carry enough context to update persistence or UI later, but exact payloads remain deferred. | Prevents premature webhook/API design while preserving future integration needs. |
| IEB-003 | Match lifecycle events should be generated from the authoritative TypeScript domain logic, not from visual animation completion alone. | Prevents Excalibur presentation timing from becoming the source of truth for match state. |
| IEB-004 | Accountability events such as disconnects and quits should be server-validated where possible. | The game client can request or display behavior, but D/C accountability should not rely only on client claims. |

### UI/Page Flow Map

The Game tab page flow is consolidated as a player-facing navigation map.

This map describes screen transitions and visible states. It does not alter combat rules, persistence rules, or server authority.

| Flow Area | Stabilized Page Path | Key Notes |
| --- | --- | --- |
| Game entry | `Game` tab -> `1P` / `2P` | First fork separates solo/tutorial content from multiplayer VS content. |
| 1P menu | `1P` -> `Tutorial` / `Duel CPU` / `Shop` / `Stats` | Solo page opens separately from the initial Game entry; Version 1 shop appears only here. |
| Tutorial | `Tutorial` -> CPU 1 -> CPU 2 | CPU 1 teaches streak/revenge; CPU 2 teaches DEFEND. Clearing CPU 1 immediately moves to CPU 2. |
| Duel CPU | `Duel CPU` -> CPU selection -> fight or locked criteria message | Maki and Kander start available; Fury, Shi-eld, Peasy, and Skore unlock successively with coins and prerequisite clears. |
| Shop | `Shop` -> name change / CPU unlock purchases -> `Back` to `1P Menu` | Unlocks after CPU 2; contains `Change Duelist Name` and CPU unlocks only for Version 1. |
| Stats | `Stats` -> player records page | Shows wins, longest streak with match/opponent/date, total accuracy, matches played, D/C, coin progression, and CPU defeat counts. |
| 2P entry | `2P` -> VS option page | VS option page contains `Quick Match`, `Enter Game Lobby`, and `Leaderboard`. |
| Quick Match | `Quick Match` -> `Finding a match...` -> earliest available public room or room creation prompt | Allocation must be confirmed before success; Back cancels search. |
| Leaderboard | `Leaderboard` -> leaderboard page -> `Back` to VS option page | Shows player rank at top, top 20 by default, and paginates by 20 up to rank 100. |
| Lobby | `Enter Game Lobby` -> room list | Public rooms show room name, host/player, player count, and Join; empty lobby shows `No rooms open at the moment.` |
| Room creation | public room / private room | Public rooms are visible and joinable; private rooms are hidden and use direct friend invites with Accept/Decline. |
| Room ready | room list/join/create -> room-ready page -> ready countdown -> match page | Shows `Player ___ VS Player ___` or `Player ___ VS Waiting...`; ready is disabled until two players are present. |
| Match page | match load -> active fight UI | Shows HP, attack status, DEFEND/status, shared attack bar, question, timer, status, and quit button. Tutorial adds task objectives and completion ticks. |
| Spectator view | lobby `View` -> live read-only match UI | Same full player UI, read-only, maximum `10` viewers per match. |
| Results | match end -> results page -> replay/add friend/back | Results show performance, reward, quote; PvP includes Add Friend, Replay, and Back to lobby. |

### UI/Page Flow Boundary Notes

| ID | Boundary | Rationale |
| --- | --- | --- |
| UIB-001 | Page flow is a navigation contract, not a combat authority. | Combat outcomes remain governed by the engine rules. |
| UIB-002 | All valid pages should provide a `Back` action where returning to the previous page is coherent. | Human clarified broad Back-button behavior for navigation. |
| UIB-003 | Earlier direct `2P -> Start Private Room / Start Public Room` language is superseded by `2P -> VS option page`, while public/private room creation remains available through lobby or failed Quick Match paths. | Preserves later clarified flow without deleting the room-type distinction. |
| UIB-004 | Spectator UI shares the player match UI but must remain read-only. | Keeps presentation reuse while preserving interaction boundaries. |
| UIB-005 | Quit overlays freeze the match and block question visibility. | Prevents the quit warning from becoming a question-preview exploit. |

### Stats Calculation Consolidation

Stats calculation is consolidated for MVP planning.

Stats observe engine outcomes. Stats should not decide combat outcomes.

### Stats Validity

| Match Condition | Performance Stats | Rewards | Accountability |
| --- | --- | --- | --- |
| Valid completed match | valid | calculated from correct answers and outcome | normal win/loss/profile updates |
| Voided match | invalid | `0 coins` | D/C or quit accountability remains valid where applicable |
| PvP `CONNECTION_DROPPED` | invalid match performance | `0 coins` | responsible player gains D/C count |
| PvP `QUIT_CONFIRMED` | invalid match performance | `0 coins` | quitting player gains D/C count |
| PvC quit | invalid match performance | `0 coins` | no PvP D/C count; incomplete tutorial state persists if applicable |
| Forced PvP forfeit from repeated quit-button abuse | invalid match performance | offending player receives `Reward: 0 coins`; non-offending winner uses normal winner reward formula unless later abuse risk is found | offending player receives valid loss and `D/C +1`; non-offending player receives valid win |

### Match-Level Stat Formulas

| Stat | Formula / Rule | Status |
| --- | --- | --- |
| `correct_answers_by_player` | Count correct answers submitted across the whole match. Same-time correct answers count for both players. Reaction task success counts for the winning player. | consolidated |
| `total_questions_by_player` | Count submitted answer attempts accepted for accuracy scoring. Correct and wrong submitted answers count; no-answer, timeout/no-action, stunned lockout, and DEFEND-only situations do not count unless an answer is submitted. | consolidated |
| `accuracy_by_player` | `correct_answers_by_player / total_questions_by_player * 100` | consolidated |
| `longest_streak_by_player` | Highest consecutive successful attack streak reached in the match, using existing streak reset rules. | consolidated |
| `player_type_by_player` | Result-screen classification using Wrongster, Avenger, Strategist, Streaker, or Vanilla. | Version 1 MVP thresholds locked; playtest tuning allowed |
| `reward_by_player` | PvP/PvC reward formula or `0` for voided matches. | consolidated |
| `stats_valid` | `true` for valid completed matches; `false` for voided matches and forced quit-abuse forfeits. | consolidated |

### Player Type Initial Classification

Player-type classification uses Version 1 MVP thresholds.

Classification priority:

1. `Wrongster` if the player wins and wrong-answer rate is greater than `70%`.
2. `Avenger` if revenge attacks are the player's largest special damage source, or the player uses revenge attacks at least `3` times in the match.
3. `Strategist` if attacks after successful DEFEND/block outcomes make up at least `35%` of successful attacks.
4. `Streaker` if the player reaches a streak of `4+`, or more than `40%` of successful attacks occur inside streak sequences.
5. `Vanilla` if none of the higher-priority labels apply and the player mostly uses normal attacks/blocks.

An isolated 3-hit streak does not automatically disqualify `Vanilla`.

Repeated 3-hit behavior may be treated as Streaker-leaning during playtest tuning, but Version 1 MVP uses the `4+` hard threshold unless the `40%` streak-sequence rule is met.

### Profile-Level Aggregate Stats

| Profile Stat | Calculation / Source | Notes |
| --- | --- | --- |
| `total_matches_played` | Count valid completed match outcomes. | Forced quit-abuse forfeits count as valid win/loss outcomes but do not count as valid performance-stat matches. |
| `wins` | Count valid completed matches won. | Mutual final-round loss does not count as win. |
| `losses` | Count valid completed matches lost. | Mutual final-round loss count remains low-risk to clarify later. |
| `dc_count` | Count PvP `QUIT_CONFIRMED` and `CONNECTION_DROPPED` events assigned to the player. | D/C count remains valid even when match stats are voided. |
| `total_correct_answers` | Sum correct answers from valid match records. | Supports lifetime accuracy. |
| `total_questions_answered` | Sum submitted answer attempts accepted for accuracy scoring from valid match records. | Correct and wrong submitted answers count; no-answer and unable-to-act moments do not. |
| `total_accuracy_score` | `total_correct_answers / total_questions_answered * 100` | Public exact totals remain hidden. |
| `longest_streak` | Highest `longest_streak_by_player` across valid match records. | Store linked match ID, opponent, and date. |
| `current_win_streak` | Consecutive valid completed wins since last valid loss. | Voided matches should not reset by default. |
| leaderboard eligibility | `pvp_matches_played >= 10` | PvP only; valid completed PvP matches control eligibility. |
| leaderboard win rate | `pvp_wins / pvp_decisive_matches * 100` | Primary leaderboard sort value; PvP only; mutual final-round loss is excluded from this denominator. |
| leaderboard accuracy | `pvp_correct_answers / pvp_questions_answered * 100` | Secondary leaderboard sort value; PvP only. |
| leaderboard current win streak | `pvp_current_win_streak` | Tertiary leaderboard sort value; PvP only. |
| `coin_balance` | Sum coin ledger gains and spends. | Current spendable currency. |
| lifetime coins earned | Sum positive coin ledger entries. | Derive from `coin_ledger`; does not need to duplicate `coin_balance`. |
| CPU opponent defeat counts | Count valid PvC wins by `cpu_opponent_id`. | Supports Stats page entries such as times defeated Maki/Kander/etc. |

### Stats Calculation Open Edges

| ID | Open Edge | Severity Tier | Reason |
| --- | --- | --- | --- |
| SC-002 | Player-type threshold tuning after playtesting. | Tier 3 | Version 1 MVP thresholds are locked, but observed play may reveal better tuning values. |

### Persistence Schema Candidates

These are recommended database tables or collections for teammate handoff. Exact SQL/ORM syntax remains a later implementation decision.

| Table / Collection | Stores | Rationale |
| --- | --- | --- |
| `players` | Stable player identity: internal player ID, hidden unique number ID, display name, timestamps. | Separates core identity from profile progression. |
| `player_profiles` | Coin balance, selected badge/avatar, total wins/losses, matches played, D/C count, accuracy totals, longest streak summary, current win streak. | Supports stats, public profile summaries, and progression without recomputing from every match. |
| `player_unlocks` | CPU opponents, badges, avatars, profile pictures, mascots, and future identity unlocks. | Supports coin-based identity growth and CPU progression gates. |
| `coin_ledger` | Coin gains and spends with reason and optional match reference. | Keeps economy changes auditable. |
| `match_records` | Central authoritative record for completed, voided, or forfeited matches. | Preserves match history, result screens, rewards, D/C accountability, and later analytics. |
| `player_match_refs` | Lightweight player-to-match references with result and date. | Lets profiles show match history without duplicating full match records. |
| `player_activity_events` | Internal player-linked engagement activity events. | Supports future sense-making about retention, mode usage, feature engagement, and friction without exposing these signals to players. |
| `player_engagement_metrics` | Internal summarized engagement metrics by player. | Gives fast internal aggregates for product/design review while raw events remain available for deeper analysis. |
| `leaderboard_view` | Derived leaderboard rows from player/profile aggregates. | Supports top-20 display, pagination up to top 100, and player rank without duplicating match records. |
| `friend_requests` | Pending, accepted, declined, cancelled, and dismissed friend request states. | Supports the social request lifecycle already clarified. |
| `friendships` | Accepted friend relationships between players. | Supports friend lists, online status display, and private invites. |
| `room_events` | Optional future lobby/room audit records. | Useful later for debugging lobby edge cases, not required as MVP core persistence. |
| `match_question_logs` | Persisted child records under `match_id`: question asked, correct player(s), correctness timing, question-round winner, and winning timing. | Supports future sensemaking, replay/debugging, stat audit, analytics, and possible anti-cheat review without duplicating full records into player profiles. |

### Realtime Server Handoff

`docs/game/handoff/GAME_REALTIME_SERVER_HANDOFF.md` maps the game constitution into the existing `apps/server` responsibility area.

It covers:

- PvP room coordination.
- Quick Match allocation and locking.
- ready countdown sync.
- server-authoritative PvP match state.
- spectator admission/read-only sync.
- quit and D/C accountability.
- capacity protection.
- socket event sketches.
- database persistence touchpoints.
- webhook boundaries.

This handoff is separate from `docs/game/handoff/GAME_DATABASE_HANDOFF.md`.

It does not define database tables and does not replace Excalibur rendering work.

### MVP Readiness Checklist

`docs/game/GAME_MVP_READINESS_CHECKLIST.md` summarizes implementation readiness.

It marks the following as ready enough for MVP implementation planning:

- core combat rules.
- match lifecycle.
- question generation.
- tutorial CPU 1 and CPU 2.
- Duel CPU opponents.
- 1P and 2P page flows.
- post-match results.
- player profile/stats.
- Version 1 shop.
- database handoff.
- realtime server handoff.

It preserves the following as intentionally deferred:

- future modifier governance.
- anti-staleness/deeper gameplay layer.
- exact TypeScript implementation names.
- exact Excalibur scene/Actor bindings.
- exact socket payload schemas.
- exact ORM/migration syntax.
- completed technical capacity validation.
- separate webhook handoff.

### Suggested Code Organization

| Area | Suggested Contents | Rationale |
| --- | --- | --- |
| `domain/` | `types.ts`, `matchState.ts`, `combatRules.ts`, `questionGenerator.ts`, `matchReducer.ts`, `rewardRules.ts` | Keeps TypeScript game rules portable and testable. |
| `excalibur/` | Scenes, Actors, UI widgets, animation timing, input binding, visual status displays. | Keeps rendering and interaction in the game engine layer. |
| `persistence/` | `matchRecordMapper.ts`, `profileUpdateMapper.ts`, `publicProfileMapper.ts`, DTO definitions. | Converts runtime results into database-facing records and public-facing views. |
| `network/` | PvP room events, ready state, Quick Match events, spectator read-only sync, disconnect events. | Keeps multiplayer transport concerns out of combat rules. |

### TypeScript Domain Architecture

The recommended TypeScript domain architecture is a neutral two-combatant duel core.

This is an implementation recommendation, not a new gameplay authority. It exists to preserve the already clarified rule set across PvP, PVC, tutorials, Duel CPU, spectators, and Excalibur presentation.

### TypeScript Domain Ownership

| Domain Area | Owns | Boundary |
| --- | --- | --- |
| Match runtime state | Active match, fight-round, question-round, combatant, status, and power-bar state. | Runtime state should not be saved wholesale as database schema. |
| Combat rules | Damage, streaks, revenge, DEFEND, stun, `MISSED!`, `SHOCK!`, same-time, and `Additional DMG`. | Excalibur should animate results, not recompute combat truth. |
| Question generation | Spinner mode, arithmetic families, difficulty probability, and PvP-only `?` mode. | Visual spinner animation remains presentation. |
| Match reducer | Domain actions -> new state plus internal events. | Reducer should not directly write to database or emit external webhooks. |
| Tutorial scripts | CPU 1/CPU 2 scripted objectives, freeze prompts, and task gates. | Tutorial scripts should call shared combat rules rather than duplicate damage logic. |
| CPU controllers | Maki, Kander, Fury, Shi-eld, Peasy, Skore, and tutorial CPU decision policies. | CPU controllers choose actions; combat rules resolve outcomes. |
| Reward/stat rules | PvP/PvC reward formulas, stat validity, player type, profile aggregate patches. | Persistence mappers apply/save results later. |
| Internal events | Named runtime events such as `match.started`, `match.completed`, `player.quit_pressed`, and `reward.coins_awarded`. | Internal events are not webhook contracts yet. |

### Recommended Domain Modules

| Module | Purpose |
| --- | --- |
| `domain/types.ts` | Shared IDs, enums, unions, and foundational domain types. |
| `domain/matchState.ts` | Match, fight-round, question-round, combatant, and power-bar runtime shapes. |
| `domain/combatRules.ts` | Pure combat resolution functions. |
| `domain/questionGenerator.ts` | Question-mode and difficulty generation. |
| `domain/matchReducer.ts` | State transition reducer for domain actions. |
| `domain/tutorialScripts.ts` | Scripted CPU 1 and CPU 2 onboarding flows. |
| `domain/cpuControllers.ts` | Duel CPU and tutorial CPU action selection policies. |
| `domain/rewardRules.ts` | Reward calculations and void/forfeit reward handling. |
| `domain/statsRules.ts` | Match-level and profile-level stat calculations. |
| `domain/events.ts` | Internal game event names and payload sketches. |

### Domain Runtime Type Sketches

These sketches are references for later implementation.

```ts
type MatchMode = "PVP" | "PVC";

type MatchType =
  | "tutorial"
  | "duel_cpu"
  | "public_pvp"
  | "private_pvp"
  | "quick_match";

type CombatantDriverType =
  | "human_local"
  | "human_remote"
  | "cpu"
  | "tutorial_script"
  | "spectator_readonly";
```

```ts
type MatchRuntimeState = {
  matchId: string;
  mode: MatchMode;
  matchType: MatchType;
  combatants: Record<string, CombatantRuntimeState>;
  drivers: Record<string, CombatantDriverType>;
  currentFightRound: FightRoundRuntimeState;
  roundsWonByCombatant: Record<string, number>;
  matchStatus: "active" | "paused" | "completed" | "voided" | "forfeited";
  internalEvents: GameDomainEvent[];
};
```

### TypeScript/Excalibur Boundary

| Boundary | Rule |
| --- | --- |
| Source of truth | TypeScript domain state owns combat truth. |
| Presentation | Excalibur renders, animates, and collects input. |
| Active in-game keyboard input | During active in-game play, only number keys, `-`, `Spacebar`, and `Enter` should be accepted. All other keys should be disabled or ignored. |
| Animation lag | Visual dramatization may lag state changes, but cannot alter domain outcomes. |
| Spectator mode | Spectator view reads the same match state but has no interactive controller. |
| Persistence | Mappers convert final runtime outcomes into match records, profile updates, coin ledger entries, and result views. |

### TypeScript Architecture Rationale

| ID | Rationale |
| --- | --- |
| TSA-001 | A neutral two-combatant core prevents PvP, PVC, tutorial, and CPU duel modes from drifting into separate rule implementations. |
| TSA-002 | Combatant driver types let human, CPU, tutorial, and spectator behavior differ without changing combat rules. This does not refer to physical game controllers; player input remains keyboard unless later changed. |
| TSA-003 | Reducer-style domain actions make timing-sensitive actions such as answers, DEFEND, quit, disconnect, and timer expiry traceable. |
| TSA-004 | Keeping Excalibur outside combat authority preserves portability and testability. |
| TSA-005 | Runtime state, derived result state, and persisted database records remain separate to avoid over-saving transient combat details. |
| TSA-006 | The active-match keyboard whitelist protects match focus and prevents unrelated keys from creating hidden actions or UI drift during combat. |

### Excalibur Mapping Notes

These notes come from a first-pass review of official Excalibur documentation.

They are implementation guidance only. They do not create gameplay authority.

| Game Need | Excalibur Concept | Mapping Rationale |
| --- | --- | --- |
| Engine shell and canvas loop | `Engine` | Excalibur's central game container can host the canvas, update loop, and scene switching. |
| Page-like game states | `Scene` | Scenes can represent match, tutorial, CPU duel, spectator, and possibly canvas-native menu/result states. |
| Visible match objects | `Actor` | Actors are recommended visual objects and can represent combatants, power indicators, damage text, and animated effects. |
| Match HUD | `ScreenElement`, Actor HUD, or HTML overlay | Excalibur supports in-canvas HUD elements, while docs recommend HTML first for polished UI. |
| Menus/lobby/results | HTML/React UI preferred unless canvas-native presentation is needed | The broader app already has web navigation; not everything must be inside Excalibur. |
| Keyboard-only active match input | `engine.input.keyboard` | Official keyboard APIs can inspect pressed/held/released keys and enforce the active-match whitelist. |
| Tutorial visual sequences | Actions, Timers, Scene state | Excalibur Actions and Timers can stage prompts, delays, freezes, and animations while domain scripts preserve truth. |
| Attack/status animation | Actor graphics, Actions, Animation | Excalibur can animate domain events without owning combat outcomes. |
| Responsive canvas | Display Modes, Screen/Viewport APIs | Excalibur supports fit/fill modes, resolution/viewport handling, coordinate conversion, and HiDPI considerations. |
| Asset loading | Loader / DefaultLoader | Excalibur has built-in loading flows for images, audio, fonts, and other loadable resources. |

### Excalibur Source References

| Area | URL |
| --- | --- |
| Overview | `https://excaliburjs.com/docs/` |
| Quick Start | `https://excaliburjs.com/docs/quick-start/` |
| Engine | `https://excaliburjs.com/docs/engine/` |
| Scenes | `https://excaliburjs.com/docs/scenes/` |
| Actors | `https://excaliburjs.com/docs/actors/` |
| Keyboard | `https://excaliburjs.com/docs/keyboard/` |
| HTML UI | `https://excaliburjs.com/docs/html/` |
| Screen Elements | `https://excaliburjs.com/docs/screen-elements/` |
| Actions | `https://excaliburjs.com/docs/actions/` |
| Timers | `https://excaliburjs.com/docs/timers/` |
| Animation | `https://excaliburjs.com/docs/animation/` |
| Display Modes | `https://excaliburjs.com/docs/displaymodes/` |
| Screen / Viewport | `https://excaliburjs.com/docs/screens/` |
| Loaders | `https://excaliburjs.com/docs/loaders/` |

### Excalibur Implementation Boundary

| Boundary | Rule |
| --- | --- |
| Excalibur can implement match presentation. | Scenes, Actors, HUD elements, animations, keyboard input, and canvas rendering are appropriate Excalibur responsibilities. |
| Excalibur should not replace domain truth. | Combat, rewards, stats, and match outcomes remain domain/server-owned. |
| Excalibur is not the PvP backend. | Room allocation, D/C detection, matchmaking, persistence, and server-validated accountability require server/database layers. |
| HTML UI remains valid. | Lobby, results, profile, friend list, and shop screens may be web UI outside the canvas. |
| Official docs should be consulted during implementation. | Exact APIs, class names, and scene/actor patterns should be verified against the current Excalibur version. |

### Current Recommendation Rationale

| ID | Recommendation Link | Rationale |
| --- | --- | --- |
| IRR-001 | IR-001, IR-002 | The game logic must later transfer into Excalibur animation without making animation the source of truth. |
| IRR-002 | IR-003, IR-006 | The old TypeScript shapes shown by the human are useful as runtime objects, but most should not be saved directly as database records. |
| IRR-003 | IR-004, IR-005 | Central match records plus lightweight profile references preserve traceability while keeping profile views efficient. |
| IRR-004 | IR-007 | A pure functional core reduces the risk of PvP, PvC, tutorial, CPU, and spectator paths implementing subtly different combat rules. |
| IRR-005 | IR-008 | Persisting lightweight question logs is justified because the human identified future sensemaking as a concrete need; this should remain scoped under `match_id` instead of becoming profile clutter or full runtime-state persistence. |

## Clarification Frontier

The active clarification frontier records one active clarification question while preserving adjacent unresolved branches and blocked questions.

### Active Clarification Question

| Priority | Active Question | Severity Tier | Why It Matters | Dependency Impact | Reasoning Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Which remaining UI/page-flow detail should be clarified next before implementation handoff? | Tier 3 | Core stats, shop, persistence, and player-type thresholds are now stable enough to move back toward user-facing flow polish. | This affects how much implementation ambiguity remains before TypeScript/Excalibur work begins. | Awaiting next human-selected branch. |

### Adjacent Unresolved Branches

| ID | Branch | Severity Tier | Relationship to Active Question | Blocked Until |
| --- | --- | --- | --- | --- |
| BR-001 | Dedicated stats/logging model | Tier 2 | Defines player records, public stats, hidden/internal stats, match-validity rules, match-scoped question logs, and MVP player-type thresholds. | Playtest tuning remains after MVP implementation. |
| BR-011 | UI/page flow implementation details | Tier 3 | Page flow is consolidated, but exact component boundaries and route file names remain implementation choices. | TypeScript/Excalibur implementation pass. |
| BR-006 | Shop modifier governance | Tier 1 | Defines modifier-enabled mode rules, consent, ranking effects, records, and reward validity. | Future development pass. |
| BR-007 | Identity shop purchases | Tier 2 | Defines name changes, avatar unlocks, and other identity-building purchases. | Human clarifies name-change access. |
| BR-004 | TypeScript to Excalibur implementation | Tier 3 | Logic should remain portable into game-engine animation. | Domain/presentation boundary is clarified; exact scene bindings remain. |
| BR-002 | Engine model for PvP/PvC support | Tier 3 | Architecture follows clarified semantic intent through neutral combatants and combatant driver types. | Closed as implementation recommendation; may reopen during coding if needed. |
| BR-003 | Anti-staleness depth layer | Tier 2 | Important, but explicitly deferred by human. | Basic mechanics are clarified further. |
| BR-008 | Dedicated database handoff artifact | Tier 3 | Converts persistence recommendations into teammate-facing schema guidance. | Created as `docs/game/handoff/GAME_DATABASE_HANDOFF.md`; exact SQL migrations and ORM implementation remain teammate implementation work. |
| BR-009 | TypeScript domain model artifact | Tier 3 | Converts runtime recommendations into code-facing type/module guidance. | Ready for handoff artifact if human wants it. |
| BR-010 | Webhook/server event handoff | Tier 3 | Converts internal game events into teammate-facing server/webhook contract. | Internal game event payloads and game ground truth are stable enough. |

### Blocked Questions

| ID | Blocked Question | Depends On | Severity Tier | Reasoning Status |
| --- | --- | --- | --- | --- |
| BQ-001 | What additional depth layer prevents staleness? | Human deferral | Tier 2 | Deferred by human. |
| BQ-002 | Should the core engine be a neutral two-slot duel engine? | Actor naming drift and PvP/PvC support | Tier 3 | Clarified as a recommended neutral two-combatant TypeScript core with combatant driver types. |
| BQ-003 | Exact display duration for `SHOCK!` and `Additional DMG`. | UI/status presentation | Tier 4 | Deferred until UI/animation pass. |
| BQ-004 | Exact TypeScript/Excalibur encoding of DEFEND and status timing. | Domain/presentation implementation | Tier 3 | Domain boundary clarified; exact Excalibur bindings deferred until coding. |
| BQ-005 | PVC progression after CPU 2. | Tutorial onboarding and Duel CPU roster | Tier 2 | Clarified for MVP planning through Duel CPU selection, Maki/Kander availability, and sequential locked CPU progression. |
| BQ-006 | Dedicated stats/logging model. | Human selected stats calculation as current branch. | Tier 2 | Active; initial consolidation completed, remaining edge cases preserved. |
| BQ-007 | PvP room/lobby matchmaking flow. | Human noted for later discussion. | Tier 2 | Deferred until matchmaking/lobby clarification. |
| BQ-008 | Post-match results page stats, grading, and add-friend UI. | Human noted results page for later discussion. | Tier 2 | Deferred until results/stats clarification. |

## Suggested Next Reasoning Focus

Decide whether to generate a teammate-facing TypeScript/domain handoff artifact.

Conversational reflection: the architecture now has its spine. The game logic can live in a testable TypeScript domain core, while Excalibur becomes the vivid layer that shows and animates that truth.

## Traceability Index

| Trace ID | Related Item | Source | Linked Journal Entry | Notes |
| --- | --- | --- | --- | --- |
| TR-001 | Reset overwrite | Human instruction: "yes overwrite session" | RESET-001 | Active artifacts reset into `KRYS-game_logic-001`. |
| TR-002 | Database handoff artifact | Human requested database handoff guidance with recommendations and rationale. | CJ-142 | `docs/game/handoff/GAME_DATABASE_HANDOFF.md` created as SQL-first teammate handoff. |
