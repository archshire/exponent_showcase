# K_GAME_PRD_1.0_CONSTITUTIONAL_JOURNAL

## Table of Contents

- [Document Metadata](#document-metadata)
- [Initial Intent](#initial-intent)
- [Clarification Sessions](#clarification-sessions)
- [Clarification Rationale Tracking](#clarification-rationale-tracking)
- [Warning Events](#warning-events)
- [Reset Events](#reset-events)
- [Intent Drift Events](#intent-drift-events)
- [Resolution Rationale](#resolution-rationale)
- [Deferred Issues](#deferred-issues)
- [Reopened Topics](#reopened-topics)
- [Governance Notes](#governance-notes)
- [Major Constitutional Shifts](#major-constitutional-shifts)
- [Traceability Index](#traceability-index)

## Document Metadata

```yaml
artifact_type: constitutional_journal
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

## Initial Intent

### Initial Statement

The human wants to build a VS mental-sum game that is engaging and exciting.

### Initial Context

The human invoked KRYSTALIZE RESET and selected overwrite for the active `game_logic` session.

## Clarification Sessions

### Session CJ-001

```yaml
session_id: CJ-001
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: reset overwrite and renewed initialization
```

#### Clarification Target

Reset active `game_logic` constitutional artifacts and restart clarification from human intent.

#### Ambiguity Severity

Tier 1.

#### Prioritization Rationale

Human intent must contextualize artifact interpretation before renewed deep analysis begins.

#### Traversal Layer

WHY.

#### Questions Asked

##### Active Clarification Question

In your own words, what are you trying to build with `game_logic`, what do you want stabilized or clarified, and what uncertainty do you currently feel exists?

##### Adjacent Branches Tracked Internally

- Artifact analysis of `docs/game/GAME_LOGIC.md`.

##### Blocked Questions

- Which game mechanics are locked, ambiguous, or unstable?

#### Human Responses

- The human has forgotten much of what is inside the current artifact.
- The big picture is to build a VS mental-sum game that is engaging and exciting.

#### Locked Outcomes

- Active KRYSTALIZE session is `KRYS-game_logic-001`.
- Prior active session was overwritten by human instruction.
- Renewed human intent is now recorded.
- The game is intended to be a VS mental-sum game.
- The desired experience should be engaging and exciting.
- VS means both PvP and PvC.
- PvP means player vs player.
- PvC means player vs computer.
- The player should feel rushed, clever, under pressure, hungry for a comeback, rewarded for mastery, surprised by twists, and locked in a duel.
- Game logic and mechanics should enable those feelings.
- Fast-answer pressure is always present.
- Better mental-sum players will pursue streaks.
- Revenge exists to give the receiving player a comeback path against streak momentum.
- Defense exists to disrupt a streak.
- Successful DEFEND stuns the attacking opponent for 1.5 seconds and prevents answers during stun.
- Successful DEFEND gives the blocker advantage to answer in succession and build streaks.
- After stun recovery, a player under a barrage can use DEFEND to disrupt the opponent.
- DEFEND can only be used once every 2 turns.
- Revenge gauge activates for the player who receives a 1.4x hit from an opponent.
- Receiving a 1.4x hit means the opponent has hit them 5 consecutive times.
- Revenge gauge resets after the player with active revenge answers correctly.
- Revenge attack either lands with the full 100% damage bonus or resets if blocked.
- Streak multiplier caps at 1.4x attack damage.
- Base attack damage is derived from the power bar value captured when Enter is pressed.
- Attack power increases over a 5-second period.
- A moving indicator travels over the attack power bar.
- Attack power range is intended to be 1 to 30.
- The indicator position captured on correct Enter press becomes attack power.
- Actual damage is calculated from attack power using streak multipliers and revenge damage.
- The attack power bar begins at 1.
- Game logic needs to be written in TypeScript and transferred to the Excalibur game engine for animation.
- The moving attack-power indicator increases linearly from 1 to 30 over 5 seconds.
- Revenge damage is conceptually calculated as `attackPower x 2`.
- Revenge should be visually represented as `+100% DMG`.
- Revenge begins a new streak sequence; the next consecutive attack after revenge is 1.1x.
- Revenge does not combine with a multiplier stronger than the beginning streak position.
- A streak multiplier can reset when interrupted by a successful block, by the streaking player pressing DEFEND, by a wrong answer, or by the opponent attacking.
- DEFEND can serve three functions: predicting an incoming revenge attack, disrupting an incoming streak barrage, and acting as a turn-level defensive resource.
- Pressing DEFEND breaks the player's own streak.
- DEFEND cannot be spammed and remains constrained to alternate-turn use.
- Failed DEFEND resets the player's own streak and prevents that player from blocking again for the current question round.
- Wrong answers reset all benefit buffs.
- Wrong answers create a 1-second vulnerability window where the player cannot do anything, including defending or answering again.
- The status bar should show `MISSED!` during the wrong-answer vulnerability state.
- Incoming opponent damage during `MISSED!` uses the normal attack formula with no special damage effect.
- Each fight round lasts 60 seconds.
- Each match consists of at least 2 fight rounds.
- The first player to win 2 fight rounds wins the match.
- Each fight round consists of multiple question rounds.
- Each question round should resolve with HP loss for at least one player except when both players answer at the same time.
- If both players take no action by the end of the attack timer, both receive `-10 HP` and status `SHOCK!`.
- If both players answer at the same time, no immediate HP damage is applied in that question round.
- Same-time answers create an `Additional DMG` carryover into the next question round.
- Streak and revenge buffs do not reset on same-time answers and are applied to stacked `Additional DMG`.
- Ties happen if both players have the same HP at the end of a 60-second fight round.
- If a tie happens on the 3rd fight round, a Final round is initiated.
- If the Final round also ends in a tie, both players lose.
- `Additional DMG` from same-time answers is one shared additional damage value applied to the next question round.
- There is one shared attack power bar that increments from 1 to 30 over 5 seconds.
- Both players share the same attack power bar.
- The attack goes to whoever answers first.
- Same-time answers are detected when the second valid answer occurs within 0.15 seconds / 150ms of the first valid answer.
- If one player answers at 1.00s and the other answers from 1.00s through 1.15s, they count as answering together.
- If the second valid answer occurs after the 150ms same-time window, the first valid answer wins the attack.
- `docs/game/GAME_LOGIC.md` has been synchronized with the clarified core mechanics.
- Question type strongly determines gameplay experience.
- At the beginning of a fight round, a spinner determines the question mode.
- Spinner options include addition, subtraction, subtraction + addition, and `?`.
- `?` mode is only available in PvP.
- Addition questions use numbers from 1 to 30 and have normal/easy tiers.
- Subtraction questions use numbers from 1 to 100 and have normal/easy tiers.
- Mixed questions are chained addition/subtraction sums using numbers from 1 to 30.
- Easier questions can support players nearing or in revenge mode and disadvantaged players.
- The spinner result applies to the entire 60-second fight round.
- The spinner is used again for the next fight round/match segment to create gameplay variety.
- Easy-tier questions are probability-weighted rather than mandatory.
- Baseline easy-tier chance is 40%.
- Active revenge or one-hit-from-revenge raises easy-tier chance to 60%.
- Having half or less than half of the opponent's HP raises easy-tier chance to 65%.
- Easy-tier addition questions are addition sums between numbers 1 to 15.
- Normal-tier addition questions use the full 1 to 30 operand range.
- Easy-tier subtraction questions use numbers 1 to 40.
- Subtraction answers may be negative.
- Normal-tier subtraction questions use the full 1 to 100 operand range.
- Normal-tier subtraction also allows negative answers.

#### Remaining Unresolved Issues

- Exact artifact alignment with the clarified pressure/streak/revenge/defense loop.
- Long-term "something more" depth layer, intentionally deferred.

#### Accepted Uncertainty

- Prior unresolved semantic history may no longer be present in the active artifacts due to overwrite.

#### Conversational Reflection Summary

The reset created a cleaner starting point, and the human has now supplied the renewed north star: a VS mental-sum game that feels engaging and exciting. VS identity is now clearer: the game should support both PvP and PvC. The core loop is also emerging: speed pressure, mastery streaks, revenge comebacks, and defense as disruption.

### Session CJ-002

```yaml
session_id: CJ-002
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: artifact alignment review against clarified core loop
```

#### Clarification Target

Read `docs/game/GAME_LOGIC.md` against the clarified loop: fast-answer pressure, mastery streaks, revenge comeback, and defense disruption.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

The basic mechanics were clear enough to inspect the existing artifact without solving the deferred anti-staleness concern.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should DEFEND be mainly a prediction/timing read, a quick reaction, or a limited resource decision?

##### Adjacent Branches Tracked Internally

- Actor naming for PvP/PvC support.
- Equal-HP tie semantics.
- Streak/revenge exact tuning.
- Question/answer contract.

##### Blocked Questions

- What additional depth layer prevents staleness?
- Should the engine be a neutral two-slot duel engine?
- When exactly should equal HP produce a tie?

#### Human Responses

- Pending.

#### Locked Outcomes

- The artifact already supports fast-answer pressure through the 5-second power bar.
- The artifact already supports mastery streaks through streak multipliers.
- The artifact already supports revenge comeback through the revenge mechanic.
- The artifact already supports defense disruption by nullifying attack and resetting attacker streak.

#### Remaining Unresolved Issues

- DEFEND timing and skill expression.
- Revenge ownership and activation after defense-led streak reversal.
- Player/CPU naming drift against PvP and PvC support.
- Equal-HP tie semantics.
- Streak cap and revenge stacking/refresh behavior.
- Mental-sum question/answer contract.

#### Accepted Uncertainty

- Anti-staleness depth remains deferred.

#### Conversational Reflection Summary

The artifact is not random scaffolding; it already carries the intended pressure, mastery, comeback, and disruption loop. The next useful clarification is how defense should feel, because it is the main interruption tool against streak momentum.

### Session CJ-003

```yaml
session_id: CJ-003
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: defense momentum reversal clarification
```

#### Clarification Target

Clarify DEFEND as a streak disruption and momentum reversal mechanic.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

Defense is the player-facing answer to being dominated by an opponent streak, so its meaning must be stable before tuning cooldowns, stun duration, revenge, or round flow.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

When you say the successful blocker can activate their revenge attack after their streak activates, should revenge belong to the player who was receiving the opponent's streak, or to any player who builds a streak after blocking?

##### Adjacent Branches Tracked Internally

- Exact DEFEND input window.
- Revenge activation/removal rules.
- Stun duration and answer lock.
- Turn definition for DEFEND cooldown.

##### Blocked Questions

- Should DEFEND be predictive, reactive, or committed at the start of a question turn?
- Does revenge stack, refresh, or remain boolean?

#### Human Responses

- DEFEND is to disrupt a streak.
- If successful, DEFEND should stun the other player for 1.5s and prevent them from answering.
- Successful DEFEND gives the blocker advantage to answer questions in succession and build streaks.
- After being stunned, if a player comes under a barrage of attacks, they can press DEFEND to disrupt the opponent.
- DEFEND can only be used once every 2 turns.

#### Locked Outcomes

- DEFEND is a momentum reversal mechanic.
- Successful DEFEND applies 1.5s stun to the attacking opponent.
- Stunned players cannot answer during stun.
- Successful blocker gets an initiative window to build streaks.
- DEFEND has a once-every-2-turn cooldown.

#### Remaining Unresolved Issues

- Later TypeScript-to-Excalibur integration boundary.
- Whether revenge stacks with the current streak multiplier.
- Exact DEFEND input timing model.
- Exact definition of "turn" for DEFEND cooldown.

#### Accepted Uncertainty

- None for this clarification step.

#### Conversational Reflection Summary

Defense now has a clear role: it is the brake and reversal against streak pressure. It gives the defender a moment to breathe and counter-pressure. The next clarification is revenge ownership, because the current phrasing could either preserve revenge as comeback-only or expand it into a streak reward after a successful block.

### Session CJ-004

```yaml
session_id: CJ-004
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: revenge activation and reset clarification
```

#### Clarification Target

Clarify revenge ownership, activation, and reset behavior.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

Revenge is the main comeback tool against streak dominance, so its ownership and consumption rules must be stable before damage tuning.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Does the streak multiplier cap at the fifth hit/1.4x, or should it continue increasing beyond five consecutive hits?

##### Adjacent Branches Tracked Internally

- Revenge reset implementation.
- Streak damage table.
- Blocked revenge attack behavior.

##### Blocked Questions

- Does revenge stack or refresh if the player keeps receiving streak damage?
- Is DEFEND predictive, reactive, or turn-committed?

#### Human Responses

- Revenge gauge activates after a player receives a 1.4x attack hit from an opponent.
- This means they have been hit 5 consecutive times.
- First hit is 1.0x damage, second hit is 1.1x damage, and so on.
- A player's revenge gauge resets after they successfully answer correctly when the gauge is activated.
- Revenge attack either hits with the full 100% damage bonus or resets if blocked.

#### Locked Outcomes

- Revenge belongs to the player receiving opponent streak damage.
- Revenge activates after receiving the opponent's 1.4x hit.
- Activated revenge is consumed/reset on correct answer.
- Blocked revenge attack resets revenge.

#### Remaining Unresolved Issues

- Whether streak multiplier caps at 1.4x after the fifth hit or continues beyond that.
- Whether revenge can refresh if the player continues receiving streak hits after activation.

#### Accepted Uncertainty

- None for this clarification step.

#### Conversational Reflection Summary

Revenge is now cleanly a comeback mechanic. It turns on when the player has clearly been dominated by a five-hit streak, and it gives one meaningful counterpunch that either lands hard or gets reset if blocked.

### Session CJ-005

```yaml
session_id: CJ-005
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: streak cap and attack damage source clarification
```

#### Clarification Target

Clarify whether streak damage caps at 1.4x and identify where attack damage is derived from in the artifact.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

Revenge activates at the 1.4x hit, so the streak cap determines whether streak pressure continues scaling beyond the comeback trigger.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

Should the power bar damage curve be linear over 5 seconds, or should it move in a more timing-skill-based pattern?

##### Adjacent Branches Tracked Internally

- Gauge movement curve.
- Exact base damage calculation.
- UI display of power bar value.

##### Blocked Questions

- Should revenge refresh if a player keeps receiving capped streak hits?

#### Human Responses

- Streak multiplier should cap at 1.4x attack damage.
- Human asked whether the document specifies where attack damage is derived from.

#### Locked Outcomes

- Streak multiplier caps at 1.4x.
- Current artifact derives base attack damage from the power bar value captured when Enter is pressed.

#### Remaining Unresolved Issues

- Exact power bar damage curve over the 5-second timer.
- Whether revenge refreshes after continued capped streak hits.

#### Accepted Uncertainty

- None for this clarification step.

#### Conversational Reflection Summary

The damage source is present in the artifact: power bar value becomes base damage. The cap is now stable too: streaks reward mastery up to 1.4x, then stop scaling so runaway streaks do not become mathematically absurd.

### Session CJ-006

```yaml
session_id: CJ-006
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: attack power bar clarification
```

#### Clarification Target

Clarify the distinction between attack power and actual damage.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

Attack power is the base input into the damage formula, so the bar's meaning must be stable before final damage calculation can be specified.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

When you said the attack damage starts from `-1HP`, did you mean `1HP`, or should the bar actually begin below zero?

##### Adjacent Branches Tracked Internally

- Power bar movement curve.
- Visual name/form of the moving indicator.
- Damage formula ordering for streak and revenge.

##### Blocked Questions

- Should the power bar move linearly or in a timing-skill pattern?

#### Human Responses

- For now, attack power increases over a 5-second period.
- A moving indicator should move over the attack power bar.
- Attack power range is 1 to 30.
- Where the indicator lands when the player presses Enter for the correct answer becomes the attack power.
- Actual damage is calculated using streak multipliers and revenge damage.

#### Locked Outcomes

- Attack power and actual damage are distinct concepts.
- Attack power is captured from the moving indicator on the bar.
- Captured attack power is transformed into actual damage by streak and revenge rules.

#### Remaining Unresolved Issues

- Whether `-1HP` was a typo for `1HP` or an intentional negative starting value.
- Exact movement curve of the attack power indicator.

#### Accepted Uncertainty

- The moving indicator's visual form/name remains unspecified.

#### Conversational Reflection Summary

The attack model now has a clean layered shape: answer correctly, capture attack power, then apply combat modifiers. That keeps the mental-sum action and the fighting-game drama connected without making them the same thing.

### Session CJ-007

```yaml
session_id: CJ-007
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: attack power starting value and Excalibur note
```

#### Clarification Target

Clarify attack power starting value and preserve downstream TypeScript/Excalibur implementation note.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

Attack power range must be exact before the bar can be implemented or animated.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

Should the moving indicator increase linearly from 1 to 30 over 5 seconds, or should it use a back-and-forth/timing-skill motion?

##### Adjacent Branches Tracked Internally

- TypeScript pure logic boundary.
- Excalibur animation mapping.
- Power bar movement curve.

##### Blocked Questions

- How should the TypeScript logic expose attack power state to Excalibur animation?

#### Human Responses

- The bar should begin from 1.
- All this logic needs to be in TypeScript and then transferred to Excalibur game engine for animation.

#### Locked Outcomes

- Attack power starts at 1.
- TypeScript and Excalibur integration is a downstream implementation constraint.

#### Remaining Unresolved Issues

- Exact indicator movement pattern over the 5-second window.
- Exact boundary between pure TypeScript logic and Excalibur animation.

#### Accepted Uncertainty

- Excalibur integration is noted but deferred until core mechanics stabilize.

#### Conversational Reflection Summary

The bar now has a clean minimum value. The implementation note is important: we should eventually keep combat math clean in TypeScript and let Excalibur animate the state, but the immediate game-feel question is how the indicator moves.

### Session CJ-008

```yaml
session_id: CJ-008
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: attack power indicator motion clarification
```

#### Clarification Target

Clarify how the attack-power indicator moves over the 5-second bar.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

Indicator movement determines how attack power is captured and how the TypeScript value maps to Excalibur animation.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

Should revenge damage be calculated as `attackPower × 2` only, or should it stack with the current streak multiplier as `attackPower × streakMultiplier × 2`?

##### Adjacent Branches Tracked Internally

- Final damage formula.
- Revenge damage ordering.
- TypeScript formula implementation.

##### Blocked Questions

- Exact shape of damage calculation function.

#### Human Responses

- The moving indicator should increase linearly.

#### Locked Outcomes

- Attack-power indicator increases linearly from 1 to 30 over 5 seconds.

#### Remaining Unresolved Issues

- Whether revenge stacks with streak multiplier or replaces it.

#### Accepted Uncertainty

- None for this clarification step.

#### Conversational Reflection Summary

The bar is now intentionally simple: it rewards waiting longer within the 5-second pressure window. The next thing to stabilize is the damage formula once revenge is involved.

### Session CJ-009

```yaml
session_id: CJ-009
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: revenge damage formula clarification
```

#### Clarification Target

Clarify whether revenge damage stacks with the current streak multiplier or operates as a separate comeback strike.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because the attack-power capture model is now stable, and actual damage calculation needs to know whether revenge stacks with streak pressure or resets the pressure curve.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

Should revenge damage be calculated as `attackPower x 2` only, or should it stack with the current streak multiplier as `attackPower x streakMultiplier x 2`?

##### Adjacent Branches Tracked Internally

- Final damage formula.
- Revenge visual feedback.
- Streak sequence after revenge.

##### Blocked Questions

- Exact TypeScript damage function shape.
- Excalibur animation events for revenge impact and follow-up streak state.

#### Human Responses

- Conceptually, revenge is `attackPower x 2`.
- Visually, revenge should be reflected as `+100% DMG`.
- Revenge serves as the beginning attack of the streak multiplier.
- The next attack after revenge is 1.1x.
- Revenge is not combined with any multiplier stronger than that.

#### Locked Outcomes

- Revenge is a separate comeback strike calculated as `attackPower x 2`.
- Revenge should be displayed as `+100% DMG`.
- Revenge begins a new streak sequence.
- The next consecutive attack after revenge is 1.1x.
- Revenge must not stack with a stronger existing streak multiplier.

#### Remaining Unresolved Issues

- Exact defense timing model remains unresolved.

#### Accepted Uncertainty

- Exact TypeScript function names and Excalibur animation bindings are deferred until mechanics are fully stabilized.

#### Conversational Reflection Summary

Revenge now has a clean emotional identity: it feels big because it displays as `+100% DMG`, but it does not become unfairly explosive by stacking with a high streak multiplier. It restarts pressure instead of multiplying runaway pressure.

### Session CJ-010

```yaml
session_id: CJ-010
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: defense function and streak reset clarification
```

#### Clarification Target

Clarify how DEFEND interacts with streak continuity and whether it should be predictive, reactive, or resource-based.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because defense is the primary interruption mechanism for streak pressure, and its cost determines whether comeback play feels tense, fair, and skillful.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should DEFEND be a predictive commitment, a reaction during an incoming attack window, or a turn-level resource action?

##### Adjacent Branches Tracked Internally

- Streak reset triggers.
- DEFEND cooldown.
- Revenge prediction.
- Barrage interruption.

##### Blocked Questions

- Exact failed-DEFEND consequence model.
- Exact TypeScript state transitions for defend availability.

#### Human Responses

- DEFEND can serve all three functions.
- A player can predict an incoming revenge attack and use DEFEND, but doing so breaks their own streak.
- A player can use DEFEND to disrupt an incoming barrage of streaks.
- DEFEND should not be spammable.
- DEFEND can only be used on alternate turns.
- Streak multipliers can reset after a successful block, after the streaking player presses block, after a wrong answer, or after the opponent attacks.

#### Locked Outcomes

- DEFEND supports predictive revenge blocking.
- DEFEND supports disruption of incoming streak barrages.
- DEFEND functions as an alternate-turn defensive resource.
- Pressing DEFEND breaks the player's own streak.
- Successful block can interrupt/reset the opponent's streak.
- Wrong answers reset streaks.
- Opponent attacks can reset the current player's streak.

#### Remaining Unresolved Issues

- Exact consequence of a failed or mistimed DEFEND remains unresolved.

#### Accepted Uncertainty

- The exact input window and animation timing for each DEFEND use case are deferred until the state machine is encoded.

#### Conversational Reflection Summary

DEFEND now has a meaningful cost: it can save you from a revenge hit or stop a barrage, but pressing it sacrifices your own momentum. That gives the mechanic teeth without letting players spam their way out of pressure.

### Session CJ-011

```yaml
session_id: CJ-011
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: failed defense and wrong-answer vulnerability clarification
```

#### Clarification Target

Clarify the consequence of a failed DEFEND and the punishment state caused by wrong answers.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because DEFEND and wrong-answer states both interrupt the pressure loop, and their consequences shape whether the game feels tense without becoming arbitrary.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

If a player presses DEFEND but does not successfully block an incoming attack, should the only penalties be own-streak reset and cooldown consumption, or should there be an additional vulnerability window?

##### Adjacent Branches Tracked Internally

- Failed block consequence.
- Wrong-answer state.
- Buff reset rules.
- Status bar feedback.

##### Blocked Questions

- Exact wrong-answer vulnerability damage behavior.
- Exact TypeScript status enum and timing transition names.

#### Human Responses

- Failed DEFEND resets the player's own streak.
- For that question round, the player cannot block again.
- Wrong answers reset all benefit buffs.
- Wrong answers create a 1-second vulnerability window.
- During that window, the player cannot do anything.
- During that window, the player cannot defend or answer again.
- The status bar should show `MISSED!`.

#### Locked Outcomes

- Failed DEFEND does not create a separate vulnerability window.
- Failed DEFEND resets the player's own streak.
- Failed DEFEND prevents another block for that question round.
- Wrong answer resets all benefit buffs.
- Wrong answer creates a 1-second no-action vulnerability state.
- Wrong-answer vulnerability prevents defending and answering.
- Wrong-answer vulnerability displays `MISSED!`.

#### Remaining Unresolved Issues

- Whether `MISSED!` vulnerability changes incoming damage or only disables action.

#### Accepted Uncertainty

- Exact implementation names for wrong-answer status and question-round block lockout are deferred.

#### Conversational Reflection Summary

Failed defense is now costly but not brutally punishing: it costs momentum and the block option for that question. Wrong answers are sharper: they wipe benefits and briefly leave the player unable to respond, which should make accuracy matter under pressure.

### Session CJ-012

```yaml
session_id: CJ-012
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: missed vulnerability damage clarification
```

#### Clarification Target

Clarify whether `MISSED!` vulnerability modifies incoming damage or only prevents player action.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because wrong-answer punishment affects fairness and comeback rhythm; adding bonus damage could turn a single mistake into a runaway punishment spiral.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

During the 1-second `MISSED!` vulnerability window, should incoming opponent damage use the normal attack formula, or should vulnerability add any special damage effect?

##### Adjacent Branches Tracked Internally

- Wrong-answer punishment severity.
- Damage formula consistency.
- Status effect implementation.

##### Blocked Questions

- Exact implementation of the `MISSED!` status.
- Whether to update `docs/game/GAME_LOGIC.md` now or clarify lifecycle/tie conditions first.

#### Human Responses

- Incoming damage during `MISSED!` should use the normal attack formula.
- The inability to do anything is punishment enough.

#### Locked Outcomes

- `MISSED!` does not add bonus incoming damage.
- Incoming attacks during `MISSED!` use the normal attack formula.
- `MISSED!` is an action-lock punishment, not a damage-amplification state.

#### Remaining Unresolved Issues

- Fight-round lifecycle and tie conditions remain unresolved.
- `docs/game/GAME_LOGIC.md` still needs synchronization with clarified mechanics.

#### Accepted Uncertainty

- Exact status implementation details remain deferred until artifact update or TypeScript implementation.

#### Conversational Reflection Summary

`MISSED!` now has a fair shape: the player loses agency for one second, but the opponent still has to earn damage through the normal attack system. That keeps mistakes meaningful without letting punishment snowball too cheaply.

### Session CJ-013

```yaml
session_id: CJ-013
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: fight-round lifecycle and tie condition clarification
```

#### Clarification Target

Clarify fight-round duration, match win condition, question-round damage expectations, same-time answer behavior, and tie handling.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the artifact's equal-HP tie condition conflicted with both players starting each fight round at equal HP, which could terminate rounds immediately if read literally.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should equal HP produce a fight-round tie only at terminal checks, such as timer end or simultaneous 0 HP, rather than immediately whenever both HP are equal?

##### Adjacent Branches Tracked Internally

- Fight-round duration.
- Match round win condition.
- Question-round damage guarantee.
- Same-time answer behavior.
- Final round tie handling.

##### Blocked Questions

- Exact `Additional DMG` ownership model.
- Artifact synchronization for round lifecycle.

#### Human Responses

- Each round lasts 60 seconds.
- Each match consists of at least 2 rounds.
- The first player to win 2 rounds wins the match.
- Each round consists of question rounds.
- Each question round will always resolve with HP loss for a player, except same-time answers.
- If both players do nothing by the end of the attack timer, both receive `-10 HP` and `SHOCK!`.
- The only time players do not receive damage in a question round is if they answer at the same time.
- Same-time answers create `Additional DMG`.
- Current attack damage is added to the next question and resolved there.
- The status reflects `Additional DMG`.
- Streaks and revenge buffs do not reset on same-time answers.
- Streaks and revenge buffs are applied to the stacked damage.
- Ties happen if both players have the same HP at the end of a round.
- If a tie happens on the 3rd round, a Final round is initiated.
- If there is a tie again, both players lose.

#### Locked Outcomes

- Fight rounds last 60 seconds.
- Match victory requires 2 fight-round wins.
- Equal HP only creates a tie at fight-round end.
- Same-time answers defer damage into `Additional DMG`.
- Same-time answers do not reset streak or revenge buffs.
- Timeout/no-action causes both players to lose `10 HP` and show `SHOCK!`.
- A 3rd-round tie initiates a Final round.
- A Final round tie causes both players to lose.

#### Remaining Unresolved Issues

- Whether `Additional DMG` is carried separately per player or as one shared value.
- How tied rounds before the 3rd round affect the match sequence remains implicit and may need artifact-level encoding.

#### Accepted Uncertainty

- Exact artifact wording and TypeScript state names are deferred until artifact synchronization.

#### Conversational Reflection Summary

The fight round now has a clean rhythm: 60 seconds of constant question-round pressure, with ties checked only at the end. Same-time answers are not dead air; they bank danger into the next exchange, which should keep the duel tense instead of letting simultaneous play reset the pressure.

### Session CJ-014

```yaml
session_id: CJ-014
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: additional damage ownership clarification
```

#### Clarification Target

Clarify whether `Additional DMG` from same-time answers is tracked per player or as one shared carryover value.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because same-time answer behavior preserves streak and revenge pressure, so the carryover ownership model affects fairness, implementation shape, and the emotional stakes of the next question.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

For same-time answers, is `Additional DMG` carried separately for each player's captured attack damage, or is there one shared additional-damage value applied to the next question round?

##### Adjacent Branches Tracked Internally

- Shared damage carryover.
- Damage calculation ordering.
- Streak/revenge modifier application.

##### Blocked Questions

- Exact calculation of the shared `Additional DMG` value.
- Artifact synchronization for same-time answer rules.

#### Human Responses

- `Additional DMG` should be one shared additional damage value applied to the next question round.

#### Locked Outcomes

- `Additional DMG` is not tracked separately per player.
- Same-time answers create one shared additional damage value.
- The shared value applies to the next question round.

#### Remaining Unresolved Issues

- Exact calculation of the shared `Additional DMG` value when both players captured different attack powers.

#### Accepted Uncertainty

- Exact formula for shared `Additional DMG` remains unresolved.

#### Conversational Reflection Summary

Shared `Additional DMG` makes a simultaneous answer feel like both players have loaded the next exchange with extra danger. It raises the room temperature of the duel without creating parallel hidden damage tracks.

### Session CJ-015

```yaml
session_id: CJ-015
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: shared attack power bar correction
```

#### Clarification Target

Correct the mistaken assumption that players might capture different attack powers during same-time answers.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the previous question assumed separate player-specific attack power captures, but the human's intended model uses one shared attack power bar for both players.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

When both players answer at the same time with different captured attack powers, how should the one shared `Additional DMG` value be calculated?

##### Adjacent Branches Tracked Internally

- Shared attack power bar.
- First-answer ownership.
- Same-time answer threshold.
- `Additional DMG` trigger.

##### Blocked Questions

- Exact same-time input threshold.
- Artifact synchronization for shared attack bar.

#### Human Responses

- There is one attack power bar.
- The attack power bar increments from 1 to 30 over 5 seconds.
- Both players share that attack bar.
- The attack goes to whoever answers first.

#### Locked Outcomes

- There are not separate attack power captures per player.
- Both players use one shared attack power bar.
- The shared attack power bar increments from 1 to 30 over 5 seconds.
- Normal attack ownership goes to the first player who answers.
- Same-time `Additional DMG` derives from the shared current attack value, not from separate player values.

#### Remaining Unresolved Issues

- Exact timing threshold for "same-time" answers remains unresolved.

#### Accepted Uncertainty

- The exact simultaneous-input threshold is deferred to the next clarification.

#### Conversational Reflection Summary

The attack model is now cleaner: both players are racing against the same rising attack value. Whoever answers first claims the current attack; if they truly answer together, the shared current value becomes the danger carried forward.

### Session CJ-016

```yaml
session_id: CJ-016
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: same-time answer threshold clarification
```

#### Clarification Target

Clarify the timing threshold that separates same-time answers from first-answer attack ownership.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the shared attack bar makes first-answer ownership central, so the engine needs a deterministic window for when two valid answers count as simultaneous.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

What timing window should count as "same time" before the game decides one player answered first?

##### Adjacent Branches Tracked Internally

- Same-time threshold.
- First-answer ownership.
- `Additional DMG` trigger.
- Network/input fairness.

##### Blocked Questions

- Artifact synchronization for answer resolution.
- Exact TypeScript input timing implementation.

#### Human Responses

- If a player answers at 1.00s and the other player answers between 1.00s and 1.15s, it should count as answering together.

#### Locked Outcomes

- Same-time answer threshold is 0.15 seconds / 150ms after the first valid answer.
- The 150ms threshold is inclusive for the example window from 1.00s through 1.15s.
- If the second valid answer occurs within that window, `Additional DMG` triggers.
- If the second valid answer occurs after that window, the first valid answer wins the attack.

#### Remaining Unresolved Issues

- `docs/game/GAME_LOGIC.md` still needs synchronization with clarified mechanics.
- Mental-sum question/answer contract remains underspecified.

#### Accepted Uncertainty

- Exact TypeScript implementation details for input timestamp comparison are deferred.

#### Conversational Reflection Summary

The duel now has a crisp clash window: close answers feel like a genuine simultaneous strike and bank danger into the next question; answers outside 150ms reward the faster player.

### Session CJ-017

```yaml
session_id: CJ-017
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: game_logic artifact synchronization
```

#### Clarification Target

Synchronize `docs/game/GAME_LOGIC.md` with the clarified mechanics.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This update was prioritized because core combat lifecycle, shared attack bar, revenge, DEFEND, wrong-answer punishment, and same-time answer rules had stabilized enough to replace outdated artifact rules.

#### Traversal Layer

WHAT.

#### Human Responses

- Human requested updating `GAME_LOGIC.md`.

#### Locked Outcomes

- `docs/game/GAME_LOGIC.md` now reflects the clarified mechanics.
- Outdated `0 -> 30` bar, `100ms` draw, `-20 HP` timeout, and immediate equal-HP tie semantics were removed.
- The spec now uses neutral player language compatible with both PvP and PvC.

#### Remaining Unresolved Issues

- Mental-sum question generation and answer validation contract remain underspecified.
- TypeScript state-machine names and Excalibur animation bindings remain deferred.
- Anti-staleness depth layer remains deferred.

#### Conversational Reflection Summary

The written game logic now matches the clarified duel: shared pressure bar, fast first-answer attacks, 150ms clashes, comeback revenge, costly defense, and end-of-round tie checks.

### Session CJ-018

```yaml
session_id: CJ-018
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: mental-sum question mode and difficulty clarification
```

#### Clarification Target

Clarify the role of question types, spinner-selected modes, arithmetic families, PvP-only special mode, and comeback-sensitive difficulty.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the human stated question type is important to gameplay experience, and the synchronized combat shell still needed question generation rules.

#### Traversal Layer

HOW.

#### Active Clarification Context

The user explained the intended question-mode system rather than answering a narrow question. KRYSTALIZE accepted this as direct clarification of the active mental-sum question contract.

#### Human Responses

- Question type at certain times determines gameplay experience.
- At the beginning of the round, there is a spinner.
- The CPU spins the spinner.
- Spinner options are addition, subtraction, subtraction + addition, and `?`.
- `?` mode includes addition + subtraction, addition of two 3-digit numbers, and reaction-based actions.
- Reaction-based actions require players to press a sequence of 4 to 9 numbers to score an attack.
- `?` mode is only available in PvP.
- Addition questions use numbers from 1 to 30.
- Addition has normal and easy tiers.
- Easier addition questions should sometimes be given to players nearing or in revenge mode.
- Subtraction questions use numbers from 1 to 100.
- Subtraction has the same tier structure as addition.
- Easier subtraction questions can be given to disadvantaged players when they are on revenge or streak.
- Mixed questions are chained sums using addition and subtraction over numbers from 1 to 30.
- Mixed questions may sometimes be add-only, subtraction-only, or both.

#### Locked Outcomes

- Question mode is selected by spinner.
- Spinner options include addition, subtraction, mixed subtraction + addition, and PvP-only `?`.
- Addition, subtraction, and mixed modes have distinct generation ranges.
- Difficulty tiers include at least normal and easy.
- Easier questions can be used as comeback support.
- `?` mode introduces both harder arithmetic and reaction-sequence actions.

#### Remaining Unresolved Issues

- Whether the spinner result applies to the whole 60-second fight round or is rerolled per question round.
- Exact criteria for "nearing revenge", "in revenge", "disadvantaged", and "on streak" difficulty assistance.
- Exact easy/normal formulas for addition, subtraction, and mixed modes.
- Exact reaction-sequence rules for `?` mode.
- Whether the CPU spinner is a neutral game-system spinner in PvP or literally CPU-controlled.

#### Accepted Uncertainty

- Exact implementation of question generation remains unresolved until spinner scope is clarified.

#### Conversational Reflection Summary

The question system is becoming part of the drama: the spinner gives a round its flavor, easier questions can help a comeback breathe, and PvP-only `?` mode can inject chaos through harder arithmetic and reaction sequences.

### Session CJ-019

```yaml
session_id: CJ-019
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: spinner scope clarification
```

#### Clarification Target

Clarify whether the spinner result applies to a full 60-second fight round or is rerolled before each question round.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because spinner scope determines whether a fight round has a stable question identity or constantly changing question modes.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Does the spinner's result apply to the entire 60-second fight round, or is the spinner used again before each question round?

##### Adjacent Branches Tracked Internally

- Fight-round question identity.
- Variety pacing.
- Difficulty tier selection.
- PvP-only `?` mode availability.

##### Blocked Questions

- Exact comeback difficulty trigger.
- Exact mode formulas.

#### Human Responses

- Spinner is applied to a 60-second fight.
- For the next match/fight segment, it is used again.
- This gives variety to gameplay.

#### Locked Outcomes

- Spinner result applies to the entire 60-second fight round.
- Spinner is not rerolled before each question round.
- Spinner is used again for the next fight round/match segment.
- Variety is created across fight rounds through changing spinner results.

#### Remaining Unresolved Issues

- Exact comeback/easy-tier trigger remains unresolved.
- Exact formulas for easy and normal tiers remain unresolved.
- The meaning of CPU spinner authority in PvP remains unresolved.

#### Accepted Uncertainty

- Spinner presentation and animation details remain deferred.

#### Conversational Reflection Summary

The spinner now gives each fight round its own identity. A round can feel like an addition round, a subtraction round, a mixed round, or a PvP chaos round, and then the next fight can change the texture.

### Session CJ-020

```yaml
session_id: CJ-020
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: comeback easy-tier probability clarification
```

#### Clarification Target

Clarify when the game should provide easy-tier questions as comeback support.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because comeback-aware difficulty affects fairness and emotional feel; mandatory easy questions could feel artificial, while weighted probability can preserve uncertainty.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

When should the game give a player an easy-tier question: only when they have active revenge, when they are one hit away from revenge, when they are behind in HP, or some combination?

##### Adjacent Branches Tracked Internally

- Easy-tier probability.
- Revenge comeback assistance.
- Severe HP disadvantage assistance.
- Fairness perception.

##### Blocked Questions

- Exact easy/normal addition formulas.
- Exact easy/normal subtraction formulas.
- Whether probability conditions stack or use highest applicable probability.

#### Human Responses

- All listed situations should be included.
- Easy questions should use a probability system rather than be mandated.
- Baseline easy-question chance is 40%.
- If the player has active revenge, easy-question chance increases to 60%.
- If the player is one hit from revenge, easy-question chance increases to 60%.
- If the player has half or less than half the HP of their opponent, easy-question chance increases to 65%.

#### Locked Outcomes

- Easy-tier questions are probability-weighted.
- Baseline easy-tier chance is 40%.
- Active revenge sets easy-tier chance to 60%.
- One-hit-from-revenge sets easy-tier chance to 60%.
- Severe HP disadvantage, defined as half or less than half of opponent HP, sets easy-tier chance to 65%.

#### Remaining Unresolved Issues

- Whether overlapping conditions stack or use the highest applicable probability remains inferred, not directly stated.
- Exact easy/normal formulas remain unresolved.

#### Accepted Uncertainty

- Until clarified otherwise, the current state assumes highest applicable probability rather than stacking probabilities.

#### Conversational Reflection Summary

The comeback system now has a soft touch: it improves a pressured player's odds of getting a manageable question, but it does not guarantee relief. That should preserve tension while giving revenge moments enough oxygen.

### Session CJ-021

```yaml
session_id: CJ-021
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: easy-tier addition formula clarification
```

#### Clarification Target

Clarify what counts as an easy-tier addition question.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because easy-tier probability had been clarified, but the generator still needed concrete prompt rules for what "easy" means in addition mode.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

What exactly counts as an easy-tier addition question versus a normal-tier addition question within the 1 to 30 range?

##### Adjacent Branches Tracked Internally

- Normal addition range.
- Subtraction easy/normal tiers.
- Mixed mode tiers.

##### Blocked Questions

- Exact addition generator implementation.
- Exact subtraction and mixed generator implementation.

#### Human Responses

- Easy tier questions are addition sums between 1 to 15.

#### Locked Outcomes

- Easy-tier addition uses operands from 1 to 15.

#### Remaining Unresolved Issues

- Normal-tier addition operand range remains unresolved.
- Whether easy-tier addition is always two operands or can include chained addition remains unresolved.

#### Accepted Uncertainty

- The current clarification only locks easy-tier addition range.

#### Conversational Reflection Summary

Easy addition now has a concrete shape: smaller numbers, faster recognition, less working-memory pressure. That fits the comeback role without changing the core race.

### Session CJ-022

```yaml
session_id: CJ-022
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: normal-tier addition formula clarification
```

#### Clarification Target

Clarify the operand range for normal-tier addition questions.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because easy-tier addition was clarified as 1 to 15, leaving normal-tier addition as the remaining addition-mode generator ambiguity.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

For normal-tier addition, should both operands use the full 1 to 30 range?

##### Adjacent Branches Tracked Internally

- Subtraction tier formulas.
- Mixed mode tier formulas.
- Whether addition prompts are two-operand only.

##### Blocked Questions

- Exact addition generator implementation.
- Exact subtraction and mixed generator implementation.

#### Human Responses

- Yes.

#### Locked Outcomes

- Normal-tier addition uses operands from 1 to 30.

#### Remaining Unresolved Issues

- Subtraction easy/normal tiers remain unresolved.
- Mixed mode tiers remain unresolved.
- Whether addition prompts are always two-operand remains implicit from "addition sums" and may need encoding later.

#### Accepted Uncertainty

- Exact implementation shape remains deferred until all mode formulas are clarified.

#### Conversational Reflection Summary

Addition mode now has a clean two-tier range: easy keeps numbers small at 1-15, while normal opens the full 1-30 range.

### Session CJ-023

```yaml
session_id: CJ-023
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: easy-tier subtraction formula clarification
```

#### Clarification Target

Clarify what counts as an easy-tier subtraction question.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because addition tiers are now clarified, and subtraction is the next spinner mode requiring concrete easy/normal generation rules.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

For subtraction mode, what should count as an easy-tier subtraction question within the 1 to 100 range?

##### Adjacent Branches Tracked Internally

- Normal subtraction range.
- Negative answer handling.
- Mixed mode tiers.

##### Blocked Questions

- Exact subtraction generator implementation.
- Exact mixed generator implementation.

#### Human Responses

- Easy questions are between numbers 1 to 40.
- Allows for answers to be negative.

#### Locked Outcomes

- Easy-tier subtraction uses operands from 1 to 40.
- Subtraction questions may produce negative answers.

#### Remaining Unresolved Issues

- Normal-tier subtraction operand range remains unresolved.
- Whether normal-tier subtraction also allows negative answers remains unresolved.

#### Accepted Uncertainty

- Negative answers are locked for subtraction generally at intent level, but normal-tier confirmation is still useful before implementation.

#### Conversational Reflection Summary

Easy subtraction now has a clear range, and allowing negative answers keeps the mode honest: players cannot rely only on larger-minus-smaller patterns.

### Session CJ-024

```yaml
session_id: CJ-024
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-26
participants:
  - human
  - codex
scope: normal-tier subtraction formula clarification
```

#### Clarification Target

Clarify the operand range and negative-answer behavior for normal-tier subtraction.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because easy-tier subtraction was clarified as 1 to 40 with negative answers allowed, leaving normal-tier subtraction as the remaining subtraction-mode generator ambiguity.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

For normal-tier subtraction, should both operands use the full 1 to 100 range and also allow negative answers?

##### Adjacent Branches Tracked Internally

- Mixed mode tier formulas.
- Negative answers in mixed mode.
- `?` mode formulas.

##### Blocked Questions

- Exact mixed generator implementation.
- Exact special `?` mode implementation.

#### Human Responses

- Yes.

#### Locked Outcomes

- Normal-tier subtraction uses operands from 1 to 100.
- Normal-tier subtraction allows negative answers.

#### Remaining Unresolved Issues

- Mixed mode easy/normal tiers remain unresolved.
- `?` mode rules remain unresolved.

#### Accepted Uncertainty

- Exact implementation shape remains deferred until mixed and `?` mode formulas are clarified.

#### Conversational Reflection Summary

Subtraction mode now has a full two-tier shape: easy uses 1-40, normal uses 1-100, and both can go negative. That should make subtraction feel more distinct from addition.

### Session CJ-025

```yaml
session_id: CJ-025
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: mixed-mode range and cognitive-load clarification
```

#### Clarification Target

Clarify whether mixed-mode difficulty should come from operand ranges or from the structure of operations.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because addition and subtraction tiers are now stable, leaving mixed mode as the next generator dependency blocking the question contract.

#### Traversal Layer

WHAT, constrained by HOW because difficulty selection affects gameplay pacing and comeback feel.

#### Questions Asked

##### Active Clarification Question

For mixed mode, should easy-tier chained sums use numbers 1 to 15, while normal-tier mixed questions use numbers 1 to 30?

##### Adjacent Branches Tracked Internally

- Mixed-mode tier structure.
- Operation count in mixed prompts.
- Negative answers in mixed mode.
- Special `?` mode formulas.

##### Blocked Questions

- Exact mixed generator implementation.
- Exact special `?` mode implementation.

#### Human Responses

- Both mixed-mode ranges should be 1 to 50.
- Difficulty should be derived from working out operations between two 2-digit numbers and two 1-digit numbers.

#### Locked Outcomes

- Mixed-mode questions use numbers from 1 to 50.
- Mixed-mode difficulty is not derived from separate easy/normal numeric ranges.
- Initial interpretation tied mixed-mode difficulty to combining two 2-digit numbers and two 1-digit numbers.

#### Remaining Unresolved Issues

- The exact term count and easy/difficult structure remained unresolved after this exchange.
- Whether mixed-mode answers may be negative.

#### Accepted Uncertainty

- Mixed-mode generation remains partially open until the easy/normal structural distinction is clarified.

#### Conversational Reflection Summary

Mixed mode is becoming a pressure-and-processing mode rather than just a range bump. Keeping both tiers at 1-50 lets difficulty come from how much the player must mentally juggle.

### Session CJ-026

```yaml
session_id: CJ-026
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: mixed-mode three-term structure correction
```

#### Clarification Target

Correct the mistaken four-number interpretation and clarify the actual easy/difficult mixed-mode structure.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the prior interpretation would have generated the wrong prompt shape for mixed mode.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

What four-number structure are you talking about?

##### Adjacent Branches Tracked Internally

- Mixed-mode negative leading terms.
- Mixed-mode operation ordering.
- Mixed-mode answer validation.

##### Blocked Questions

- Exact mixed generator implementation.

#### Human Responses

- Difficult mixed questions look like `22 + 9 + 18` or `31 - 5 + 11`.
- Difficult mixed questions have two numbers with 2 digits.
- Easy mixed questions look like `17 + 8 + 5` or `-6 + 28 - 3`.

#### Locked Outcomes

- Mixed-mode prompts are three-term chained arithmetic prompts.
- Difficult mixed-mode prompts contain two 2-digit numbers and one 1-digit number.
- Easy mixed-mode prompts contain one 2-digit number and two 1-digit numbers.
- The prior four-number interpretation is rejected.

#### Remaining Unresolved Issues

- Whether mixed-mode prompts may start with a negative number.
- Whether mixed-mode answers may be negative generally.

#### Accepted Uncertainty

- Exact formatting rules remain open until negative-leading-term behavior is clarified.

#### Conversational Reflection Summary

This correction matters because the shape of the prompt is part of the game feel. Three terms keeps mixed mode readable at speed, while changing the count of 2-digit terms changes the pressure.

### Session CJ-027

```yaml
session_id: CJ-027
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: mixed-mode negative-leading-term clarification
```

#### Clarification Target

Clarify whether mixed-mode prompts may begin with a negative number.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the human's easy mixed-mode example included `-6 + 28 - 3`, and the generator needs to know whether that is valid prompt syntax.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

In mixed mode, should prompts be allowed to start with a negative number, like `-6 + 28 - 3`, or should negative values only appear as results of subtraction?

##### Adjacent Branches Tracked Internally

- Mixed-mode operation-sign selection.
- Mixed-mode answer validation.
- Mixed-mode prompt formatting.

##### Blocked Questions

- Exact mixed generator implementation.

#### Human Responses

- It is fine for questions to start with negative numbers.

#### Locked Outcomes

- Mixed-mode prompts may start with a negative number.
- `-6 + 28 - 3` is a valid mixed-mode prompt shape.

#### Remaining Unresolved Issues

- How the two operation signs in a three-term mixed prompt are selected.
- Whether the generator should enforce specific operation patterns or freely randomize signs.

#### Accepted Uncertainty

- Exact mixed-mode operation-sign selection remains open.

#### Conversational Reflection Summary

Allowing a negative first term gives mixed mode more variety without changing its core structure. It should make some prompts feel less predictable while still remaining readable.

### Session CJ-028

```yaml
session_id: CJ-028
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: mixed-mode operation-sign selection
```

#### Clarification Target

Clarify whether mixed-mode operation signs should be random or pattern-enforced.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because mixed-mode term structure and negative-leading syntax are clarified, leaving sign selection as the remaining arithmetic-generator rule.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

For mixed mode, should the two operation signs be randomly chosen from `+` and `-`, or should we enforce patterns like "one addition and one subtraction"?

##### Adjacent Branches Tracked Internally

- Mixed-mode prompt distribution.
- Mixed-mode answer distribution.
- PvP-only `?` mode generation.

##### Blocked Questions

- Exact `?` mode implementation.

#### Human Responses

- Random.

#### Locked Outcomes

- Mixed-mode operation signs are chosen randomly from `+` and `-`.
- The generator should not enforce fixed sign patterns such as exactly one addition and one subtraction.

#### Remaining Unresolved Issues

- PvP-only `?` mode reaction sequence length selection remains unresolved.
- PvP-only `?` mode 3-digit addition frequency remains unresolved.

#### Accepted Uncertainty

- Exact `?` mode generation remains open.

#### Conversational Reflection Summary

Random signs make mixed mode less predictable while keeping the rules simple. The player learns the category, not a fixed pattern.

### Session CJ-029

```yaml
session_id: CJ-029
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvp-only question-mark reaction task clarification
```

#### Clarification Target

Clarify how the `?` mode reaction-based action appears and how attack ownership is awarded.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because addition, subtraction, and mixed arithmetic generation are mostly clarified, leaving PvP-only `?` mode as the remaining question contract branch.

#### Traversal Layer

WHAT, connected to HOW because reaction tasks shape the moment-to-moment variety of `?` mode.

#### Questions Asked

##### Active Clarification Question

For `?` mode's reaction-based actions, should the 4 to 9 number sequence length be chosen randomly each time, or should it scale with comeback/difficulty state?

##### Adjacent Branches Tracked Internally

- `?` mode reaction task appearance frequency.
- `?` mode arithmetic task distribution.
- Attack ownership during reaction tasks.

##### Blocked Questions

- Exact `?` mode content distribution.

#### Human Responses

- It should be random.
- This arcade-like task is to add variety to the game.
- Its appearance should be random.
- The player that completes input of the numbers first gets the attack.

#### Locked Outcomes

- `?` mode reaction-based actions appear randomly.
- `?` mode reaction sequence length is random within the existing 4 to 9 number range.
- Reaction task appearance does not scale by comeback or difficulty state.
- The first player to complete the number sequence gets the attack.

#### Remaining Unresolved Issues

- How often reaction tasks should appear inside `?` mode relative to arithmetic tasks.
- How frequently two 3-digit additions should appear inside `?` mode.

#### Accepted Uncertainty

- Exact `?` mode content weighting remains open.

#### Conversational Reflection Summary

This makes `?` mode feel like a surprise arcade interruption rather than another difficulty-tuned question type. It should break rhythm, add spectacle, and still remain fair because the first complete input wins.

### Session CJ-030

```yaml
session_id: CJ-030
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: question-mark mode reaction task frequency
```

#### Clarification Target

Clarify how often the `?` mode reaction-based arcade task appears.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because reaction-task ownership and randomness were clarified, leaving its frequency as the next content-distribution dependency.

#### Traversal Layer

WHAT, connected to HOW because frequency determines how disruptive and arcade-like `?` mode feels.

#### Questions Asked

##### Active Clarification Question

Inside `?` mode, how often should this arcade reaction task appear compared with arithmetic tasks like mixed sums or two 3-digit additions?

##### Adjacent Branches Tracked Internally

- Remaining `?` mode arithmetic distribution.
- Two 3-digit addition frequency.
- Mixed arithmetic frequency inside `?` mode.

##### Blocked Questions

- Exact `?` mode content distribution.

#### Human Responses

- It should appear 30% of the time.

#### Locked Outcomes

- In `?` mode, reaction-based arcade tasks appear 30% of the time.

#### Remaining Unresolved Issues

- How the remaining 70% of `?` mode splits between mixed addition/subtraction and addition of two 3-digit numbers.

#### Accepted Uncertainty

- Exact `?` mode arithmetic weighting remains open.

#### Conversational Reflection Summary

Thirty percent makes the reaction task noticeable and exciting without letting it dominate. The mode should still feel mostly mental, with a sharp arcade interruption.

### Session CJ-031

```yaml
session_id: CJ-031
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: question-mark mode arithmetic distribution
```

#### Clarification Target

Clarify how the remaining 70% of `?` mode content splits between mixed arithmetic and two-3-digit addition.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because reaction task frequency is locked at 30%, leaving the remaining arithmetic distribution as the next `?` mode content dependency.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

For the remaining 70% of `?` mode, how should prompts split between mixed addition/subtraction and addition of two 3-digit numbers?

##### Adjacent Branches Tracked Internally

- Two-3-digit addition operand range.
- `?` mode arithmetic generator implementation.
- Synchronizing question contract into `GAME_LOGIC.md`.

##### Blocked Questions

- Exact `?` mode two-3-digit addition generation.

#### Human Responses

- 60% for mixed addition/subtraction.
- 40% for the two 3-digit number addition.

#### Locked Outcomes

- The remaining 70% of `?` mode content splits 60% mixed addition/subtraction and 40% addition of two 3-digit numbers.
- If interpreted proportionally against total `?` mode content, `?` mode contains 30% reaction tasks, 42% mixed addition/subtraction, and 28% two-3-digit addition.

#### Remaining Unresolved Issues

- Whether two-3-digit addition uses the full 100 to 999 range for both operands.

#### Accepted Uncertainty

- Exact two-3-digit operand range remains open.

#### Conversational Reflection Summary

This keeps `?` mode varied without becoming chaotic: reaction tasks are the interruption, mixed arithmetic remains the majority of the arithmetic layer, and two-3-digit addition becomes the heavier spike.

### Session CJ-032

```yaml
session_id: CJ-032
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: question-mark mode two-3-digit addition range
```

#### Clarification Target

Clarify whether `?` mode addition of two 3-digit numbers uses the full 100 to 999 operand range.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because `?` mode content distribution is now stable, leaving the two-3-digit addition operand range as the final generator detail before artifact synchronization.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

Should the two 3-digit addition numbers use the full `100 to 999` range?

##### Adjacent Branches Tracked Internally

- Question contract synchronization into `GAME_LOGIC.md`.
- TypeScript question generator implementation.
- Excalibur presentation of question modes.

##### Blocked Questions

- Source artifact synchronization for question generation.

#### Human Responses

- Yes.

#### Locked Outcomes

- `?` mode addition of two 3-digit numbers uses the full 100 to 999 range for both operands.

#### Remaining Unresolved Issues

- The clarified question-generation rules need synchronization into `docs/game/GAME_LOGIC.md`.

#### Accepted Uncertainty

- Exact TypeScript implementation remains deferred until the source artifact is synchronized.

#### Conversational Reflection Summary

The `?` mode now has a clean final shape: a 30% arcade interruption, mostly mixed arithmetic in the remainder, and a real 3-digit addition spike using the full 100-999 range.

### Session CJ-033

```yaml
session_id: CJ-033
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: question contract synchronization and pvc purpose clarification
```

#### Clarification Target

Synchronize the clarified PvP question-generation contract into `GAME_LOGIC.md` and lock the purpose of PVC.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the PvP question-generation contract had stabilized, and the human reframed the next semantic frontier as PVC purpose.

#### Traversal Layer

HOW, returning to WHY for PVC purpose.

#### Questions Asked

##### Active Clarification Question

Should the clarified question-generation rules now be synchronized into `docs/game/GAME_LOGIC.md`?

##### Adjacent Branches Tracked Internally

- PVC onboarding progression.
- PVC practice design.
- Skill transfer from PVC into PvP.

##### Blocked Questions

- Exact PVC opponent behavior.
- Exact PVC progression model.

#### Human Responses

- Yes, sync the discussed rules.
- The discussed question-generation rules are for PvP.
- PVC still needs discussion.
- PVC serves to onboard players so they become familiar with game mechanics.
- PVC allows players to practice so they can use their skills on real players.

#### Locked Outcomes

- The clarified PvP question-generation rules are synchronized into `docs/game/GAME_LOGIC.md`.
- PVC has an onboarding purpose.
- PVC has a practice purpose.
- PVC should support skill transfer into real-player PvP.

#### Remaining Unresolved Issues

- Whether PVC introduces mechanics gradually or uses full PvP rules immediately at easier difficulty.
- Exact computer opponent behavior.
- Exact PVC difficulty/progression model.

#### Accepted Uncertainty

- PVC implementation details remain open until onboarding progression is clarified.

#### Conversational Reflection Summary

This is an important separation: PvP is the competitive expression of the system, while PVC is the learning and practice path. PVC should make the player better at the real duel, not become a disconnected side mode.

### Session CJ-034

```yaml
session_id: CJ-034
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: first pvc cpu character streak trainer
```

#### Clarification Target

Clarify the purpose of the first PVC CPU character.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the human shifted from general PVC purpose to the first concrete PVC onboarding opponent.

#### Traversal Layer

WHY, then HOW.

#### Questions Asked

##### Active Clarification Question

For PVC onboarding, should the computer opponent start by exposing mechanics gradually, or should it use the full PvP rules immediately at an easier difficulty?

##### Adjacent Branches Tracked Internally

- CPU 1 streak-training behavior.
- PVC opponent progression.
- Skill transfer from PVC to PvP.

##### Blocked Questions

- Exact CPU 1 behavior.
- Exact CPU 1 difficulty tuning.

#### Human Responses

- The visual can be used loosely and does not need to be strictly followed.
- When a player first plays the game, they should be introduced to mechanics through CPU opponents.
- CPU opponents should familiarize/train the player to become proficient with in-game mechanics.
- The first CPU character should introduce the streak mechanic.
- Build this CPU character first.

#### Locked Outcomes

- PVC CPU character visuals may inspire planning but are not binding.
- The first PVC CPU character introduces the streak mechanic.
- CPU 1 is a mechanic-focused onboarding opponent.
- A first-pass CPU 1 streak trainer scaffold is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether CPU 1 teaches streaks by offering safe openings, demonstrating threat through its own streaks, or combining both.
- Exact CPU 1 behavior.
- Exact CPU 1 difficulty tuning.

#### Accepted Uncertainty

- Visual identity, name, and detailed behavior remain open.

#### Conversational Reflection Summary

This is the right first PVC step: do not teach everything at once. Start with one mechanic, make it felt, and let the player leave that fight understanding streak pressure better than before.

### Session CJ-035

```yaml
session_id: CJ-035
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 1 scripted streak and revenge tutorial sequence
```

#### Clarification Target

Clarify the scripted tutorial flow for the first PVC CPU opponent.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because CPU 1's purpose is now locked as streak onboarding, and the human provided a concrete tutorial sequence for how that lesson should unfold.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

For the first streak-training CPU, should it teach streaks by giving the player safer openings to build streaks, or by aggressively building its own streak so the player feels why streaks are dangerous?

##### Adjacent Branches Tracked Internally

- CPU 1 post-tutorial flow.
- Tutorial task tracker.
- Exact failure/retry behavior.

##### Blocked Questions

- Whether CPU 1 ends after the scripted lesson or continues into practice.

#### Human Responses

- Being the first opponent, CPU 1 should begin with a normal round start: `Round 1 - Go!`.
- The screen freezes and slowly animates the attack power indicator to 5, then prompts the player to answer.
- The player answers and the CPU loses 5 HP, with the HP bar visually showing the deduction.
- The next question animates the indicator to 30 attack power and prompts the player to answer.
- The game then prompts the player to attack for the next 2 rounds.
- If the player does not attack, both CPU and player receive `SHOCK!` and lose 10 HP, with explanation.
- If the player attacks during the 2 free rounds, the game blocks attacking in the subsequent round to demonstrate `SHOCK!`.
- CPU then says, `I will strike hard and strike fast!` and demonstrates a 5-hit streak.
- Each successive hit fills the player's revenge gauge until activation on the 5th hit.
- The player's attack status bar shows `+100% DMG`.
- The game animates the attack power indicator to 30 and prompts the player to attack.
- The player's revenge attack causes large damage to the CPU HP bar.
- The game then prompts the player to build a 5-hit streak.
- A visible `Task:` area should show objectives and change incomplete markers into ticks when completed.

#### Locked Outcomes

- CPU 1 uses a scripted tutorial sequence.
- CPU 1 teaches guided attacks at 5 and 30 attack power.
- CPU 1 teaches no-action `SHOCK!`.
- CPU 1 demonstrates a 5-hit enemy streak.
- CPU 1 teaches revenge activation and revenge attack payoff.
- CPU 1 then prompts player streak-building.
- CPU 1 uses a visible task tracker with completion ticks.
- The detailed CPU 1 tutorial sequence is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether CPU 1 ends after the scripted tutorial or continues into a simplified practice fight.
- Exact task wording for every tutorial step.
- Exact failure/retry behavior if the player answers incorrectly during tutorial prompts.

#### Accepted Uncertainty

- Detailed UI copy and post-tutorial flow remain open.

#### Conversational Reflection Summary

This tutorial sequence teaches by making the mechanics visible and felt: small hit, full hit, shock, enemy streak danger, revenge payoff, then player streak practice. The task tracker should keep the player oriented instead of making them infer the lesson.

### Session CJ-036

```yaml
session_id: CJ-036
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 1 simplified practice fight and status display
```

#### Clarification Target

Clarify CPU 1 post-tutorial flow and player status display rules.

#### Ambiguity Severity

Tier 2 for CPU 1 flow; Tier 3 for UI display behavior.

#### Prioritization Rationale

This clarification was prioritized because the scripted CPU 1 tutorial sequence was stable, leaving the immediate post-tutorial flow and visible player status feedback as the next implementation-facing design dependencies.

#### Traversal Layer

HOW and WHAT.

#### Questions Asked

##### Active Clarification Question

After CPU 1 completes the scripted tutorial sequence, should the fight end immediately as a completed lesson, or should it continue into a simplified practice fight?

##### Adjacent Branches Tracked Internally

- CPU 1 simplified practice behavior.
- DEFEND availability during tutorial/practice.
- Attack and DEFEND status display.

##### Blocked Questions

- CPU 1 simplified practice tuning.

#### Human Responses

- CPU 1 should continue as a simplified practice fight.
- The simplified practice fight should not include the DEFEND mechanic.
- Each player should have an attack status bar showing attack buffs such as revenge gauge and streak multiplier.
- Each player should have a DEFEND button that also serves as a DEFEND status space.
- If DEFEND is available, the button should be bold and bright.
- If DEFEND is not available, it should be greyed out or faint.
- If DEFEND succeeds, `Success!` should appear in that space.
- If a player inputs a wrong answer, that space should show `Miss!`.

#### Locked Outcomes

- CPU 1 continues into a simplified practice fight after the scripted tutorial.
- DEFEND is not available in CPU 1's simplified practice fight.
- Each player has an attack status bar for attack buffs.
- Each player has a DEFEND button/status space.
- DEFEND availability is communicated through bold/bright versus greyed/faint presentation.
- Successful DEFEND displays `Success!`.
- Wrong answer displays `Miss!`.
- CPU 1 post-tutorial flow and status display rules are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- How much resistance CPU 1 provides during the simplified no-DEFEND practice fight.
- Exact visual design of attack status bar and DEFEND/status space.
- Whether `Miss!` should appear only in the acting player's DEFEND/status space or also in broader status messaging.

#### Accepted Uncertainty

- Exact UI styling and CPU resistance tuning remain open.

#### Conversational Reflection Summary

CPU 1 now becomes a clean learning loop: the scripted lesson teaches the concepts, then the simplified fight gives practice without introducing DEFEND too early. The status bars make the invisible state of buffs, availability, success, and mistakes easier to read.

### Session CJ-037

```yaml
session_id: CJ-037
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 1 simplified practice resistance
```

#### Clarification Target

Clarify how much resistance CPU 1 provides during the simplified no-DEFEND practice fight.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because CPU 1's post-tutorial simplified practice fight was locked, but its resistance level remained unresolved.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

During CPU 1's simplified no-DEFEND practice fight, should the CPU mostly let the player build streaks, or should it still attack often enough to interrupt and reset the player's streak?

##### Adjacent Branches Tracked Internally

- CPU 1 completion criteria.
- CPU 1 difficulty tuning.
- PVC progression to later CPU opponents.

##### Blocked Questions

- When CPU 1 is considered cleared.

#### Human Responses

- CPU 1 should attack moderately enough to interrupt and reset the player's streak.

#### Locked Outcomes

- During CPU 1's simplified practice fight, CPU attacks with moderate frequency.
- CPU attacks often enough to interrupt and reset the player's streak.
- CPU 1 practice should teach rebuilding momentum, not only free streak construction.
- CPU 1 simplified practice resistance is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- CPU 1 completion criteria.
- Exact CPU attack timing/probability during simplified practice.
- Exact difficulty tuning for "moderate" CPU pressure.

#### Accepted Uncertainty

- "Moderate" resistance is locked at intent level but not numerically tuned.

#### Conversational Reflection Summary

This gives the first practice fight teeth without turning it into a wall. The player gets to build streaks, lose them, and learn to rebuild, which is closer to real PvP skill transfer.

### Session CJ-038

```yaml
session_id: CJ-038
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 1 completion criteria
```

#### Clarification Target

Clarify what counts as clearing CPU 1.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because CPU 1's tutorial and simplified practice behavior are now clarified, leaving progression/completion criteria as the next dependency.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

What should count as completing CPU 1: winning the simplified practice fight, successfully building a 5-hit streak, or completing the tutorial objectives regardless of match outcome?

##### Adjacent Branches Tracked Internally

- CPU 1 failure/retry handling.
- PVC progression to CPU 2.
- On-screen objective display.

##### Blocked Questions

- What happens if the player loses after completing the tutorial sequence.

#### Human Responses

- The player must totally defeat the CPU.
- This will be the stated objective on the game screen.

#### Locked Outcomes

- CPU 1 is cleared only when the player totally defeats the CPU.
- Completing tutorial steps alone does not clear CPU 1.
- Building one 5-hit streak alone does not clear CPU 1.
- The game screen should show total CPU defeat as the active objective.
- CPU 1 completion criteria are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether failure restarts the full tutorial sequence or only the simplified practice fight.
- How progression to CPU 2 is presented after CPU 1 is cleared.

#### Accepted Uncertainty

- Failure/retry behavior remains open.

#### Conversational Reflection Summary

This makes CPU 1 a real opponent, not just a checklist. The tutorial teaches the tools, but the player must still finish the fight and prove they can apply the lesson.

### Session CJ-039

```yaml
session_id: CJ-039
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 1 failure retry handling
```

#### Clarification Target

Clarify what happens if the player loses to CPU 1 after the scripted tutorial.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because CPU 1 clear condition is total CPU defeat, so failure handling must define whether the player repeats the tutorial or retries only the practice challenge.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

If the player loses to CPU 1 during the simplified practice fight, should they restart from the full tutorial sequence or retry only the practice fight after the tutorial?

##### Adjacent Branches Tracked Internally

- PVC progression after CPU 1.
- CPU 1 replay behavior.
- Player onboarding pacing.

##### Blocked Questions

- What happens after CPU 1 is cleared.

#### Human Responses

- Retry the simplified practice fight after the tutorial.

#### Locked Outcomes

- If the player loses after the scripted tutorial, they retry only the simplified practice fight.
- The full scripted tutorial sequence is not replayed on retry.
- CPU 1 failure/retry handling is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What unlocks or happens after CPU 1 is cleared.

#### Accepted Uncertainty

- PVC progression after CPU 1 remains open.

#### Conversational Reflection Summary

This keeps the first lesson respectful: once the player has learned the tutorial beats, failure sends them back to practice, not back through the whole explanation.

### Session CJ-040

```yaml
session_id: CJ-040
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvc progression after cpu 1 clear
```

#### Clarification Target

Clarify what happens after the player clears CPU 1.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because CPU 1 retry and clear conditions are locked, leaving progression after clearing CPU 1 as the next PVC ladder dependency.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

After the player clears CPU 1, should CPU 2 unlock immediately as the next mechanic trainer, or should the player be able to replay CPU 1 freely before moving on?

##### Adjacent Branches Tracked Internally

- CPU 2 mechanic focus.
- PVC training ladder sequence.
- Replay access after progression.

##### Blocked Questions

- CPU 2 design.

#### Human Responses

- The player should move on to play CPU 2 immediately.

#### Locked Outcomes

- After the player clears CPU 1, the player moves on to CPU 2 immediately.
- CPU 1 does not become the primary replay step before progression.
- CPU 1 clear progression is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- CPU 2 mechanic focus.
- Whether CPU 1 can be replayed later from a menu remains unresolved.

#### Accepted Uncertainty

- Replay access after progression is not resolved by immediate progression.

#### Conversational Reflection Summary

The PVC ladder now has forward momentum: CPU 1 teaches streaks, then the game immediately advances the player to the next training lesson.

### Session CJ-041

```yaml
session_id: CJ-041
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 2 defend trainer focus
```

#### Clarification Target

Clarify the core mechanic trained by CPU 2.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because CPU 1 progression now advances immediately to CPU 2, making CPU 2's mechanic identity the next PVC ladder dependency.

#### Traversal Layer

WHY, then HOW.

#### Questions Asked

##### Active Clarification Question

What core mechanic should CPU 2 train?

##### Adjacent Branches Tracked Internally

- CPU 2 first DEFEND lesson.
- CPU 2 tutorial sequence.
- DEFEND timing and feedback.

##### Blocked Questions

- Exact CPU 2 tutorial script.
- CPU 2 simplified practice behavior.

#### Human Responses

- CPU 2 should introduce DEFEND.

#### Locked Outcomes

- CPU 2 should introduce the DEFEND mechanic.
- CPU 2 is the next PVC onboarding opponent after CPU 1.
- A first-pass CPU 2 DEFEND trainer scaffold is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether CPU 2 first teaches blocking a normal incoming attack or a streak/revenge-style threat.
- Exact CPU 2 tutorial sequence.
- Exact CPU 2 practice behavior.

#### Accepted Uncertainty

- CPU 2 detailed behavior remains open.

#### Conversational Reflection Summary

The training ladder now has a clear second step: after learning to build pressure, the player learns how pressure can be interrupted.

### Session CJ-042

```yaml
session_id: CJ-042
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 2 initial defend tutorial and defend duration
```

#### Clarification Target

Clarify DEFEND duration and CPU 2's first scripted DEFEND lesson.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because CPU 2's mechanic focus is DEFEND, and the player clarified both the timing boundary of DEFEND and the opening scripted lesson.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

For CPU 2, should the first DEFEND lesson teach blocking a normal incoming attack, or blocking a streak/revenge-style threat?

##### Adjacent Branches Tracked Internally

- CPU 2 follow-up sequence.
- DEFEND cooldown teaching.
- DEFEND practice behavior.

##### Blocked Questions

- CPU 2 post-demonstration practice design.

#### Human Responses

- DEFEND should last 1 second.
- During that second, the player cannot do anything except defend against an incoming attack.
- The DEFEND lesson should first teach defending a normal attack.
- The first two scripted actions demonstrate how DEFEND works by having CPU activate DEFEND while the task objective tells the player to attack.
- When the player attacks into CPU DEFEND, `SUCCESS` is displayed in the DEFEND status bar.
- The second scripted action repeats the same CPU DEFEND demonstration.
- The third scripted action tells the player to press DEFEND.
- CPU attacks.
- The player status bar flashes `SUCCESS`.

#### Locked Outcomes

- DEFEND lasts 1 second.
- During the DEFEND window, the player cannot answer or perform other actions.
- CPU 2 first teaches defending against a normal attack.
- CPU 2 begins with two CPU DEFEND demonstrations.
- CPU 2's third scripted action teaches player DEFEND.
- DEFEND success display uses `SUCCESS`.
- CPU 2 initial DEFEND tutorial and 1-second DEFEND duration are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether CPU 2 next teaches cooldown/alternate-turn availability or moves into simplified DEFEND practice.
- Exact CPU 2 clear condition.
- Exact CPU 2 retry behavior.

#### Accepted Uncertainty

- CPU 2 follow-up sequence remains open after the initial DEFEND lesson.

#### Conversational Reflection Summary

CPU 2 now has a strong teaching rhythm: first the player experiences being blocked, then performs the block themselves. The 1-second DEFEND window makes it a committed timing action instead of a passive shield.

### Session CJ-043

```yaml
session_id: CJ-043
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 2 defend follow-up curriculum
```

#### Clarification Target

Clarify what CPU 2 teaches after the initial three scripted DEFEND actions.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because CPU 2's initial DEFEND demonstration is locked, and the next curriculum layer determines whether DEFEND is taught only as a block or as a resource and momentum tool.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

After CPU 2's first three scripted DEFEND actions, should the next lesson teach DEFEND cooldown/alternate-turn availability, or move into a simplified DEFEND practice fight?

##### Adjacent Branches Tracked Internally

- CPU 2 cooldown lesson details.
- CPU 2 streak-disruption scripted event.
- CPU 2 revenge-advantage scripted event.

##### Blocked Questions

- Exact CPU 2 cooldown lesson beats.
- Exact CPU 2 streak-disruption event beats.
- Exact CPU 2 revenge-advantage event beats.

#### Human Responses

- Teach cooldown / alternate-turn availability.
- Teach how DEFEND can be used to disrupt a streak.
- Teach how DEFEND can turn revenge into an advantage.
- The streak-disruption and revenge-advantage lessons should be two scripted events.

#### Locked Outcomes

- CPU 2 should teach DEFEND cooldown / alternate-turn availability after the first three scripted DEFEND actions.
- CPU 2 should teach DEFEND as a streak-disruption tool.
- CPU 2 should teach DEFEND as a way to turn revenge pressure into advantage.
- Streak-disruption and revenge-advantage DEFEND lessons should be scripted events.
- CPU 2 follow-up DEFEND lessons are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- How the cooldown / alternate-turn availability lesson is demonstrated.
- Exact scripted beats for the streak-disruption event.
- Exact scripted beats for the revenge-advantage event.
- CPU 2 clear condition and retry behavior.

#### Accepted Uncertainty

- The lesson topics are locked, but their detailed beats remain open.

#### Conversational Reflection Summary

CPU 2 is becoming the DEFEND literacy fight: first block, then cooldown discipline, then using defense to break momentum and flip danger into advantage.

### Session CJ-044

```yaml
session_id: CJ-044
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 2 defend cooldown lesson method
```

#### Clarification Target

Clarify how CPU 2 teaches DEFEND cooldown / alternate-turn availability.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because CPU 2's follow-up curriculum requires a cooldown lesson, and the teaching method affects whether the player experiences DEFEND scarcity as guided readability or as a failed action.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

For CPU 2's cooldown lesson, should the player be forced to try DEFEND while it is unavailable, or should the UI simply highlight that DEFEND is greyed out/faint until the next eligible turn?

##### Adjacent Branches Tracked Internally

- CPU 2 streak-disruption scripted event.
- CPU 2 revenge-advantage scripted event.
- CPU 2 practice fight behavior.

##### Blocked Questions

- Exact CPU 2 streak-disruption event beats.
- Exact CPU 2 revenge-advantage event beats.

#### Human Responses

- DEFEND should be highlighted as greyed and unavailable for 1 turn.

#### Locked Outcomes

- CPU 2's cooldown lesson teaches DEFEND unavailability through visible button state.
- After DEFEND is used, the DEFEND button is greyed out and unavailable for 1 turn.
- The lesson does not require forcing the player into a failed DEFEND input.
- CPU 2 cooldown lesson detail is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact scripted beats for the streak-disruption event.
- Exact scripted beats for the revenge-advantage event.
- CPU 2 clear condition and retry behavior.

#### Accepted Uncertainty

- CPU 2 cooldown visibility is locked, while the higher-order DEFEND event details remain open.

#### Conversational Reflection Summary

The cooldown lesson now feels instructional instead of punitive: the player sees DEFEND become unavailable for one turn and learns the rhythm from the interface before using DEFEND in higher-pressure lessons.

### Session CJ-045

```yaml
session_id: CJ-045
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 2 streak-disruption scripted event setup
```

#### Clarification Target

Clarify how CPU 2 stages the DEFEND streak-disruption lesson.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the streak-disruption lesson requires a visible streak threat before DEFEND can feel meaningful as an interruption tool.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

For CPU 2's streak-disruption scripted event, should the CPU build a visible 2-3 hit streak first before the player is prompted to DEFEND, or should the CPU announce an incoming streak attempt before any hits land?

##### Adjacent Branches Tracked Internally

- CPU 2 revenge-advantage scripted event.
- CPU 2 post-tutorial practice fight.
- CPU 2 clear condition.

##### Blocked Questions

- Exact CPU 2 revenge-advantage event beats.
- CPU 2 practice and clear behavior.

#### Human Responses

- CPU should build a visible 3-4 hit streak before the DEFEND prompt.
- The CPU streak build-up should be scripted to allow successful streak construction.

#### Locked Outcomes

- CPU 2's streak-disruption lesson uses a scripted CPU streak build-up.
- CPU successfully builds a visible 3-4 hit streak before the player is prompted to DEFEND.
- The player learns to interrupt an already-visible opponent streak.
- CPU 2 streak-disruption setup is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact scripted beats for the revenge-advantage event.
- CPU 2 clear condition and retry behavior.

#### Accepted Uncertainty

- The streak-disruption setup is locked, while the revenge-advantage lesson remains open.

#### Conversational Reflection Summary

This gives the DEFEND lesson a stronger sense of danger: the player sees the CPU's streak forming, then learns that DEFEND can break that momentum instead of merely blocking a single attack.

### Session CJ-046

```yaml
session_id: CJ-046
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 2 revenge-advantage activation setup
```

#### Clarification Target

Clarify how CPU 2 begins the revenge-advantage scripted event.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the revenge-advantage event needs to begin from an actual activated revenge state, not merely a narrated comeback possibility.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

For CPU 2's revenge-advantage scripted event, should the player first receive enough hits to activate revenge, then be taught to DEFEND the CPU's next pressure attack before using the revenge advantage?

##### Adjacent Branches Tracked Internally

- CPU 2 revenge-advantage resolution beats.
- CPU 2 post-tutorial practice fight.
- CPU 2 clear condition.

##### Blocked Questions

- Whether DEFEND comes before the revenge attack in the scripted event.
- CPU 2 practice and clear behavior.

#### Human Responses

- In the scripted event, the player should receive streak damage that results in the player's revenge gauge being activated.

#### Locked Outcomes

- CPU 2's revenge-advantage event begins with scripted streak damage against the player.
- That scripted streak damage activates the player's revenge gauge.
- The comeback lesson begins from an actual revenge activation state.
- CPU 2 revenge-advantage activation setup is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether the player should DEFEND the CPU's next attack before using revenge.
- Exact resolution beats for the revenge-advantage event.
- CPU 2 clear condition and retry behavior.

#### Accepted Uncertainty

- Revenge activation setup is locked, while the follow-up action sequence remains open.

#### Conversational Reflection Summary

The revenge-advantage lesson now starts with real pressure: the player is damaged into revenge activation, which makes the coming counterplay feel like a comeback rather than an abstract tutorial step.

### Session CJ-047

```yaml
session_id: CJ-047
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 2 revenge-advantage defend prompt
```

#### Clarification Target

Clarify what happens immediately after the player's revenge gauge activates in CPU 2's revenge-advantage scripted event.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because revenge activation is locked, but the player needs a clear teaching bridge from being under pressure into using DEFEND as the comeback pivot.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

After the player's revenge gauge activates in CPU 2's scripted event, should the tutorial prompt the player to DEFEND the CPU's next attack first, then immediately use the revenge attack?

##### Adjacent Branches Tracked Internally

- CPU 2 revenge counterattack release.
- CPU 2 post-tutorial practice fight.
- CPU 2 clear condition.

##### Blocked Questions

- Whether the next beat immediately prompts the player to use the revenge attack.
- CPU 2 practice and clear behavior.

#### Human Responses

- Yes.
- The scripted event should freeze the screen and prompt the user to press DEFEND.
- After pressing DEFEND, the tutorial can continue.

#### Locked Outcomes

- After the player's revenge gauge activates, CPU 2's scripted event freezes the screen.
- The frozen tutorial prompt tells the player to press DEFEND.
- The tutorial waits for the player to press DEFEND before continuing.
- CPU 2 revenge-advantage DEFEND prompt is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether the next beat immediately prompts the player to answer and release the revenge attack.
- CPU 2 clear condition and retry behavior.

#### Accepted Uncertainty

- The DEFEND prompt is locked, while the revenge counterattack release remains open.

#### Conversational Reflection Summary

The revenge-advantage lesson now has a clear pivot: after revenge activates, the action pauses and the player is taught to press DEFEND before the fight continues into the counterattack.

### Session CJ-048

```yaml
session_id: CJ-048
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 2 revenge-advantage counterattack release
```

#### Clarification Target

Clarify what happens immediately after the player presses DEFEND in CPU 2's revenge-advantage scripted event.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the freeze-and-DEFEND prompt is locked, but the event still needed to convert successful DEFEND into the player's actual revenge counterattack.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

After the player presses DEFEND during the CPU 2 revenge-advantage freeze prompt, should the next beat immediately prompt the player to answer and release the revenge attack?

##### Adjacent Branches Tracked Internally

- CPU 2 post-tutorial practice fight.
- CPU 2 clear condition.
- CPU 2 retry behavior.

##### Blocked Questions

- CPU 2 practice and clear behavior.
- PVC progression after CPU 2.

#### Human Responses

- Yes.

#### Locked Outcomes

- Immediately after the player presses DEFEND, the tutorial prompts the player to answer.
- The answer prompt releases the player's revenge attack.
- CPU 2 revenge-advantage counterattack prompt is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- CPU 2 post-tutorial practice fight behavior.
- CPU 2 clear condition and retry behavior.

#### Accepted Uncertainty

- CPU 2 scripted DEFEND curriculum is clarified, while post-tutorial mastery/progression remains open.

#### Conversational Reflection Summary

The revenge-advantage chain now teaches a full comeback move: endure streak pressure, activate revenge, press DEFEND at the tutorial pivot, then immediately answer to release the revenge attack.

### Session CJ-049

```yaml
session_id: CJ-049
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 2 simplified defend practice and clear condition
```

#### Clarification Target

Clarify CPU 2's post-scripted practice fight and clear condition.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because CPU 2's scripted DEFEND curriculum is now clarified, and the player needs a practice round that proves mastery without drifting away from the lesson.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

After CPU 2's scripted DEFEND lessons end, should the player enter a simplified DEFEND practice fight that must be won by totally defeating CPU 2?

##### Adjacent Branches Tracked Internally

- CPU 2 retry behavior.
- PVC progression after CPU 2.
- CPU 2 practice tuning.

##### Blocked Questions

- CPU 2 failure/retry handling.
- Next PVC opponent after CPU 2.

#### Human Responses

- Yes.
- For this round, CPU should have a higher chance of doing streak damage so that the player's revenge meter is activated.

#### Locked Outcomes

- After CPU 2's scripted DEFEND lessons, the player enters a simplified DEFEND practice fight.
- The player must totally defeat CPU 2 to clear the fight.
- CPU 2 has a higher chance of dealing streak damage during this practice fight.
- The increased streak pressure should make player revenge activation more likely.
- CPU 2 practice fight behavior and clear condition are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- CPU 2 retry behavior after practice loss.
- PVC progression after CPU 2.

#### Accepted Uncertainty

- CPU 2 practice purpose and clear condition are locked, while retry/progression remain open.

#### Conversational Reflection Summary

CPU 2 now has a full training arc: scripted DEFEND literacy first, then a simplified fight where the CPU pressures with streaks so the player can practice disruption and revenge comeback under live conditions.

### Session CJ-050

```yaml
session_id: CJ-050
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 1 and cpu 2 no-player-defeat familiarisation boundary
```

#### Clarification Target

Clarify whether CPU 1 and CPU 2 can produce player defeat.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the retry/failure framing conflicted with the human's intent for the first two CPU fights to function as familiarisation encounters.

#### Traversal Layer

WHY to HOW.

#### Questions Asked

##### Active Clarification Question

If the player loses CPU 2's simplified DEFEND practice fight, should they retry only the practice fight rather than replaying the scripted DEFEND tutorial?

##### Adjacent Branches Tracked Internally

- CPU 1 onboarding failure state.
- CPU 2 onboarding failure state.
- PVC progression after CPU 2.

##### Blocked Questions

- CPU 2 retry behavior.

#### Warning Event

[WARNING :: CONTRADICTION]

Earlier state framed CPU 1 and CPU 2 around possible player defeat/retry behavior. The human clarified that the player should not be able to experience defeat in these two CPU fights.

#### Human Responses

- The player should not be able to experience defeat for CPU 1 and CPU 2.
- The intention of these first two CPU fights is familiarisation with game mechanics.
- Visual HP deduction should be reflected in the health bar.
- The player's life should then be restored.

#### Locked Outcomes

- CPU 1 and CPU 2 do not allow player defeat.
- Player HP deductions may still be shown visually for teaching.
- Player life is restored after those visual deductions.
- CPU 1 and CPU 2 no-player-defeat onboarding behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Superseded Prior Framing

- CPU 1 player-loss retry behavior is superseded.
- CPU 2 player-loss retry question is superseded.

#### Remaining Unresolved Issues

- Progression after CPU 2.
- Later PVC opponent behavior.

#### Accepted Uncertainty

- Later CPU opponents may still have normal defeat states, but CPU 1 and CPU 2 are now locked as familiarisation encounters without player defeat.

#### Conversational Reflection Summary

This correction preserves the onboarding intent: the player can see pressure and HP movement, but the first two CPU fights are there to teach mechanics, not to punish early failure.

### Session CJ-051

```yaml
session_id: CJ-051
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 1 and cpu 2 stakes-aware replay behavior
```

#### Clarification Target

Clarify whether CPU 1 and CPU 2 should allow player defeat after reconsidering the familiarisation boundary.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the human reconsidered the no-player-defeat rule and reframed early loss as important for making the player feel what is at stake.

#### Traversal Layer

WHY to HOW.

#### Warning Event

[WARNING :: INTENT_CHANGE_DETECTED]

The prior no-player-defeat familiarisation boundary was intentionally changed. CPU 1 and CPU 2 now allow player loss while preserving scripted tutorials and replay controls.

#### Human Responses

- Change CPU 1 and CPU 2 so the player can lose.
- If the player passes the scripted sequence, replay can happen without the scripted sequence.
- The fight menu should include an option to replay the tutorial with scripted sequences.
- Allowing player loss makes sense because the player should feel what is at stake early on.

#### Locked Outcomes

- The player can lose CPU 1 and CPU 2.
- CPU 1 and CPU 2 still retain scripted sequences for teaching game mechanics.
- After passing a scripted sequence, replay attempts may skip the scripted sequence and start from the non-scripted practice fight.
- The fight menu provides an option to replay the scripted tutorial.
- CPU 1 and CPU 2 stakes-aware replay behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Superseded Prior Framing

- CPU 1 and CPU 2 no-player-defeat onboarding behavior is superseded.
- Player-life-restoration after visual HP deduction is superseded for CPU 1 and CPU 2.

#### Remaining Unresolved Issues

- Progression after CPU 2.
- Later PVC opponent behavior.

#### Accepted Uncertainty

- Exact menu labels and replay UI presentation remain open for a later UI pass.

#### Conversational Reflection Summary

The first two CPU fights now have a more arcade-training shape: scripted teaching comes first, but loss remains possible so the mechanics feel consequential. Replays can skip the script, while tutorial replay remains available from the fight menu.

### Session CJ-052

```yaml
session_id: CJ-052
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: cpu 1 cpu 2 onboarding sufficiency and future implementation intent
```

#### Clarification Target

Clarify whether CPU 1 and CPU 2 need to teach every mechanic, and whether quit handling belongs in this rules clarification space.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because onboarding scope affects whether additional CPU trainers are required before PvP, and quit handling affects core round resolution semantics.

#### Traversal Layer

WHY to HOW.

#### Human Responses

- The remaining features mentioned may be discovered by the player.
- Those features do not severely handicap the player if initially unknown.
- Quit handling for PVC/PvP rounds is being considered.
- The logging should preserve intent so it can be translated into TypeScript and later fleshed out in Excalibur.
- An agent may eventually translate these clarified rules into Excalibur implementation.

#### Locked Outcomes

- CPU 1 and CPU 2 can teach the core mechanics needed to begin playing.
- `Additional DMG`, wrong-answer punishment, spinner/question-mode adaptation, PvP-only `?` reaction sequences, and full match/tie/final-round structure may be discovered by the player rather than explicitly taught by CPU 1 or CPU 2.
- Quit/round-abandon handling for PVC and PvP is a valid game-logic topic.
- Constitutional logs preserve gameplay intent for later TypeScript and Excalibur translation.
- CPU 1/CPU 2 discoverable-mechanics boundary is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact quit/abandon handling for PVC and PvP.
- PVC progression after CPU 2.
- Later implementation architecture.

#### Accepted Uncertainty

- Translation into TypeScript/Excalibur is a future implementation phase, not the current clarification task.

#### Conversational Reflection Summary

The onboarding boundary is becoming clearer: CPU 1 and CPU 2 teach the combat spine, while rarer or more situational systems can emerge through play. The documentation is doing useful work here because it gives a future implementation agent a stable intent trail.

### Session CJ-053

```yaml
session_id: CJ-053
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvc quit handling and pvp disconnect records
```

#### Clarification Target

Clarify how the game should handle quitting or disconnecting from PVC and PvP rounds.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because quit/disconnect handling affects match validity, player records, tutorial completion state, and future implementation behavior.

#### Traversal Layer

HOW.

#### Active Clarification Context

The human asked whether this is the correct space to discuss quit handling. It is, because leaving a round affects game rules and engine outcomes.

#### Human Responses

- In PVC, if the player quits before completing the tutorial, the game should remember that and make them play the tutorial sequence when the game restarts.
- After the player has played the tutorial, quitting can void the current PVC match.
- Voided PVC matches should not count toward statistics.
- In PvP, it would be good to detect which side drops the connection.
- The game should log a player disconnect as `D/C` in that player's record.
- A `D/C` game's stats should be voided and not valid.
- The `D/C` stat should be published when a player fights another player.
- Public `D/C` visibility should act as a soft deterrent and incentivize match completion.
- A dedicated stats/logging section should be discussed later.

#### Locked Outcomes

- PVC quitting before tutorial completion preserves incomplete tutorial state.
- Restarting that PVC fight requires replaying the scripted tutorial sequence if it was not completed.
- PVC quitting after tutorial completion voids the current PVC match and excludes it from statistics.
- PvP disconnects should be detected when possible and logged to the disconnecting player's record as `D/C`.
- PvP disconnect games should have match stats voided and marked invalid.
- `D/C` remains a valid separate player-record stat even when match stats are voided.
- `D/C` should be visible/published when another player is preparing to fight that player.
- Quit/disconnect handling is synchronized into `docs/game/GAME_LOGIC.md`.

#### Implementation Clarification

A server-authoritative implementation can usually detect which client connection dropped. It may not always be able to prove whether a drop was intentional or caused by network failure.

#### Remaining Unresolved Issues

- PvP disconnect threshold.
- Reconnection grace window.
- Distinction between explicit quit, connection drop, and network failure.
- Dedicated stats/logging model.

#### Accepted Uncertainty

- The game can log detected disconnect events, but intent attribution remains uncertain unless the player explicitly quits.

#### Conversational Reflection Summary

The quit-handling model is now split cleanly: PVC protects tutorial state and voids abandoned practice stats, while PvP treats disconnection as a public accountability signal without validating the abandoned match's performance stats.

### Session CJ-054

```yaml
session_id: CJ-054
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvp disconnect immediate dc threshold
```

#### Clarification Target

Clarify whether PvP disconnects should have a reconnection grace window before recording `D/C`.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because PvP disconnect logging is already required, but the threshold for recording `D/C` determines how strict and simple the rule is.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

For PvP disconnects, should there be a short reconnection grace window before the game records a `D/C`, or should any dropped connection immediately count as `D/C`?

#### Human Responses

- It should just count as a `D/C`.

#### Locked Outcomes

- Any detected dropped PvP connection counts as `D/C`.
- There is no reconnection grace window before recording `D/C`.
- PvP immediate `D/C` threshold is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether explicit quit and detected connection drop should share the same public stat label.
- Dedicated stats/logging model.

#### Accepted Uncertainty

- The rule is immediate for detected dropped connections, while detailed quit/disconnect labeling remains open.

#### Conversational Reflection Summary

The PvP disconnect rule is now intentionally sharp: if the connection drops and the game detects the dropped side, it records `D/C` immediately.

### Session CJ-055

```yaml
session_id: CJ-055
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvp explicit quit label and warning
```

#### Clarification Target

Clarify how explicit player quit differs from detected connection drop in PvP.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because immediate `D/C` recording is locked, but explicit quit needs player-facing confirmation and event labeling separate from technical disconnect.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should explicit player quit and detected connection drop both use the same public `D/C` stat, or should explicit quit have a separate label?

#### Human Responses

- Explicit quit should have a separate label.
- There should be a quit button somewhere on the screen.
- If a player presses the quit button, there should be a warning message.
- The warning should tell the player that match stats will be void.
- The warning should tell the player that the quit will add to their `D/C` count.

#### Locked Outcomes

- Explicit player quit uses a separate event label from detected connection drop.
- A quit button should be available somewhere on the PvP fight screen.
- Pressing the quit button should show a warning before confirming quit.
- The warning states that match stats will be voided.
- The warning states that the quit will add to the player's `D/C` count.
- Explicit quit and detected connection drop have separate event labels, but both contribute to the player's `D/C` count.
- PvP explicit quit labeling and warning behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact event label names.
- Whether PVC also needs an explicit quit button and warning.
- Dedicated stats/logging model.

#### Accepted Uncertainty

- The separate label is locked, but exact naming can be decided during stats/UI clarification.

#### Conversational Reflection Summary

PvP exit handling now has both clarity and pressure: a player can intentionally quit through a button, but the game warns them that the match will be voided and their public disconnect accountability will increase.

### Session CJ-056

```yaml
session_id: CJ-056
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvc pvp quit button overlay and anti-abuse behavior
```

#### Clarification Target

Clarify PVC quit button behavior, shared quit overlay behavior, and repeated quit-button abuse prevention.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because quit behavior affects active match flow and could be abused to disrupt the opponent's momentum if the button can be repeatedly opened without consequence.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should PVC also have an explicit quit button with a warning, or is the quit-warning requirement only for PvP?

#### Human Responses

- PVC should have a quit button.
- PVC quit warning should only say match stats will be void.
- When a player presses quit in PVC or PvP, the game should freeze the game screen.
- The quitting player sees the warning message.
- In PvP, the other player should see a message that the opponent pressed quit.
- If quit is pressed for the 3rd time without the player actually quitting, show a warning that pressing quit again will automatically forfeit the game and result in a loss.
- Quit messages should display in front of the question and block question visibility.
- The number of quit presses in a match should be logged.

#### Locked Outcomes

- PVC has an explicit quit button.
- PVC quit warning states only that match stats will be voided.
- Pressing quit during PVC or PvP freezes the game screen.
- Quit warning messages display in front of the question and block question visibility.
- In PvP, the opponent's screen shows that the opponent pressed quit.
- Quit presses during a match are logged.
- On the 3rd quit press without actually quitting, the player receives an escalation warning.
- The escalation warning states that pressing quit again will automatically forfeit the game and result in a loss.
- PVC/PvP quit button freeze, overlay, opponent message, and anti-abuse behavior are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether the repeated-quit auto-forfeit rule applies to both PVC and PvP or only PvP.
- Exact text for quit warning and opponent message.
- Dedicated stats/logging model.

#### Accepted Uncertainty

- Anti-abuse behavior is locked at intent level, while exact mode scope remains open.

#### Conversational Reflection Summary

Quit is now treated as an active gameplay interruption: the game freezes, question visibility is blocked, the opponent is informed in PvP, and repeated quit presses are logged to prevent momentum disruption.

### Session CJ-057

```yaml
session_id: CJ-057
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvp-only quit anti-abuse and future pvp room entry
```

#### Clarification Target

Clarify the mode scope of repeated-quit anti-abuse behavior and preserve future PvP entry ideas.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the quit anti-abuse rule exists to prevent disruption of a real opponent's momentum, and the human also introduced future PvP room/lobby concepts that should be preserved without displacing the active rules thread.

#### Traversal Layer

WHY to HOW.

#### Questions Asked

##### Active Clarification Question

Should the 3rd-quit warning and 4th-press auto-forfeit rule apply to both PVC and PvP, or only PvP?

#### Human Responses

- The 3rd-quit warning and 4th-press auto-forfeit rule should apply only to PvP matches.
- There is no incentive to abuse the quit button in PVC mode.
- Future PvP entry may include inviting online friends through a friend list.
- Future PvP entry may include starting a room and waiting for players to join.
- Open rooms may be shown in a game room lobby.
- Players may join an existing room.
- These PvP entry thoughts should be noted for later discussion.

#### Locked Outcomes

- Repeated-quit anti-abuse escalation applies only to PvP matches.
- PVC has a quit button and warning, but not the PvP repeated-quit auto-forfeit rule.
- PvP match-entry candidate flows are preserved as future notes:
  - invite online friends through a friend list.
  - start a room and wait for other players to join.
  - show open rooms in a game room lobby.
  - join an existing room.
- PvP quit anti-abuse scope and PvP match-entry notes are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact PvP quit/disconnect event label names.
- Dedicated stats/logging model.
- PvP room/lobby matchmaking flow.

#### Accepted Uncertainty

- PvP room/lobby behavior is intentionally deferred.

#### Conversational Reflection Summary

The anti-abuse rule now has a clean purpose boundary: it protects a human opponent in PvP. The room and lobby ideas are parked for later matchmaking design without losing the thought.

### Session CJ-058

```yaml
session_id: CJ-058
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvp quit disconnect internal event labels
```

#### Clarification Target

Clarify exact internal event labels for explicit quit and detected connection drop.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because explicit quit and detected disconnect were already semantically distinct, and internal labels preserve that distinction while allowing both to contribute to the public `D/C` count.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

Should explicit quit and detected disconnect have exact event label names now, or should label naming be deferred to the stats/logging pass?

#### Human Responses

- Use two different labels.
- Go with the suggested labels.

#### Locked Outcomes

- Explicit confirmed quit uses internal event label `QUIT_CONFIRMED`.
- Detected dropped connection uses internal event label `CONNECTION_DROPPED`.
- Both `QUIT_CONFIRMED` and `CONNECTION_DROPPED` contribute to the player's public `D/C` count.
- PvP quit/disconnect event labels are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Dedicated stats/logging model.
- PvP room/lobby matchmaking flow.
- PVC/PvP progression topics.

#### Accepted Uncertainty

- Exact stats schema remains open, but the internal quit/disconnect labels are locked.

#### Conversational Reflection Summary

The records now have a useful split: the public can see aggregated `D/C`, while the system can still distinguish deliberate quit from dropped connection internally.

### Session CJ-059

```yaml
session_id: CJ-059
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvp rooms branch selection
```

#### Clarification Target

Select the next clarification branch after quit/disconnect labeling.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because quit/disconnect semantics were sufficiently stabilized, and the human chose PvP rooms before stats/logging or later PVC progression.

#### Traversal Layer

HOW.

#### Human Responses

- Settle PvP rooms first.

#### Locked Outcomes

- PvP rooms / match entry is now the active clarification branch.
- PvP match entry concepts are promoted from future notes into the active PvP rooms section.
- Active candidate flows remain:
  - invite online friends through a friend list.
  - start a room and wait for other players to join.
  - show open rooms in a game room lobby.
  - join an existing room.

#### Remaining Unresolved Issues

- Room visibility model.
- Private/friend-invite versus public lobby room behavior.
- Room ownership/host behavior.
- Ready/start flow.

#### Accepted Uncertainty

- Stats/logging and CPU progression are deferred while PvP rooms are clarified.

#### Conversational Reflection Summary

The conversation is now moving from combat rules into how players actually meet each other for PvP. The first room question is whether rooms are public by default, private by invite, or support both.

### Session CJ-060

```yaml
session_id: CJ-060
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: public pvp rooms friend invites and friend request lifecycle
```

#### Clarification Target

Clarify PvP room visibility, friend invite access, and how friends can be added.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because room visibility determines how public lobby, friend invites, and join-existing-room flows fit together.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should PvP rooms support both private/friend-invite rooms and public lobby rooms, or should every created room be visible in the public lobby by default?

#### Human Responses

- Every created room should be visible in the public lobby by default.
- The player side should have an invite section.
- Pressing invite should show a dropdown menu of online friends.
- Friends can be added from the post-match results page.
- The results page should later show match stats, grading, and an add friend button.
- Pressing add friend sends a request to the other player.
- The other player's screen should show a popup notifying that a friend request has been sent.
- The receiving player can check their friend list and choose yes or no.
- On the sender's friend list, the request should show `waiting for response`.
- If accepted, the friend's status becomes visible to the sender.
- If declined, a message appears in the sender's status space saying `request declined`.
- The sender can click an `X` box to delete the declined-request message.

#### Locked Outcomes

- Every created PvP room is visible in the public lobby by default.
- Player-side invite section opens a dropdown of online friends.
- Players can invite online friends from that dropdown.
- Friends can be added from a post-match results page.
- Sending a friend request creates a notification popup for the receiver.
- Receiver accepts or declines from the friend list.
- Sender sees `waiting for response` while pending.
- Accepted friends expose friend status visibility.
- Declined requests show `request declined` in sender status space.
- Sender can dismiss the decline message with an `X` box.
- PvP public-room, invite dropdown, and friend-request flow are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Post-match results page stats and grading.
- Exact add friend button placement.
- Room ownership/host behavior.
- Ready/start flow.

#### Accepted Uncertainty

- Results page and grading are deferred for later clarification.

#### Conversational Reflection Summary

PvP rooms are public by default, which keeps the lobby alive. Friend invites then become a social shortcut rather than a private-room system, and post-match friend requests let good matches become future rivals.

### Session CJ-061

```yaml
session_id: CJ-061
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvp room ready and match start flow
```

#### Clarification Target

Clarify how a PvP room transitions from joined state into match start.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because public room visibility is clarified, and ready/start behavior determines how consent and synchronization work before loading the match.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

In a public PvP room, should the room creator control when the match starts, or should the match start automatically once both players are present and ready?

#### Human Responses

- Once a player is detected to join the room, both players receive a ready button.
- Only when both players press ready does the room advance.
- A 3-second countdown timer replaces the ready button on both players' screens.
- After the countdown, the match page loads.

#### Locked Outcomes

- Both players receive ready buttons after a player joins the room.
- Both players must press ready.
- The room advances only when both players are ready.
- A 3-second countdown replaces the ready button on both screens.
- The match page loads after the countdown completes.
- PvP room ready/start flow is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What happens if a player leaves before both players are ready.
- Room ownership/host behavior.
- Post-match results page.

#### Accepted Uncertainty

- The ready/start handshake is locked, while pre-match departure behavior remains open.

#### Conversational Reflection Summary

PvP rooms now start through mutual readiness rather than host control: both players signal ready, both see the same countdown, then both enter the match.

### Session CJ-062

```yaml
session_id: CJ-062
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvp pre-ready room departure behavior
```

#### Clarification Target

Clarify what happens if a player leaves a PvP room before both players press ready.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because ready/start flow is locked, and pre-ready departure determines whether public lobby rooms are persistent or fragile.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

If one player leaves the PvP room before both players press ready, should the room remain open in the lobby for another player to join?

#### Human Responses

- Yes, the room should remain open.

#### Locked Outcomes

- If one player leaves before both players press ready, the room remains open in the lobby.
- Another player can join that same room.
- PvP pre-ready room departure behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What happens if a player leaves after both players press ready and the countdown has started.
- Room ownership/host behavior.
- Post-match results page.

#### Accepted Uncertainty

- Pre-ready departure is locked, while countdown departure remains open.

#### Conversational Reflection Summary

Public PvP rooms now persist through pre-ready drop-off: someone leaving does not collapse the room, and the lobby can refill it with another challenger.

### Session CJ-063

```yaml
session_id: CJ-063
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvp countdown departure behavior
```

#### Clarification Target

Clarify what happens if a player leaves after both players are ready and the 3-second countdown has started.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the ready/start countdown is locked, and departure during countdown determines whether the game can avoid loading into a broken match.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

If one player leaves after both players press ready and the 3-second countdown has started, should the countdown cancel and return the remaining player to the room?

#### Human Responses

- Yes, it should.

#### Locked Outcomes

- If one player leaves after both players press ready and countdown has started, cancel the countdown.
- Return the remaining player to the room.
- PvP countdown departure behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Room ownership/host behavior.
- Post-match results page.

#### Accepted Uncertainty

- Countdown departure is locked, while room ownership remains open.

#### Conversational Reflection Summary

Countdown departure now resolves cleanly: the game cancels the start sequence and keeps the remaining player in the room instead of loading an invalid match.

### Session CJ-064

```yaml
session_id: CJ-064
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvp pre-match host transfer
```

#### Clarification Target

Clarify what happens if the room creator/host leaves before the match starts.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because pre-match departure and countdown departure are locked, leaving host departure as the next room lifecycle edge case.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

If the room creator/host leaves before the match starts, should room ownership transfer to the remaining player so the public room stays alive?

#### Human Responses

- Yes, it should.

#### Locked Outcomes

- If the room creator/host leaves before match start, room ownership transfers to the remaining player.
- The public room stays alive.
- PvP pre-match host-transfer behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether host ownership gives any special pre-match controls.
- Post-match results page.

#### Accepted Uncertainty

- Host transfer is locked, while host permissions remain open.

#### Conversational Reflection Summary

The room now has resilience: even if the creator leaves before the match begins, the room can persist with the remaining player instead of disappearing from the lobby.

### Session CJ-065

```yaml
session_id: CJ-065
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvp pre-match host controls
```

#### Clarification Target

Clarify whether room creator/host ownership grants special controls before match start.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because host transfer is locked, but ownership needed meaning beyond room persistence.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should the room creator/host have any special controls before match start, or are all pre-match room controls equal between both players?

#### Human Responses

- Host can kick/remove the other player from the room.
- Host can close/delete the room.
- Host can rename the room.
- Host can use invite-only controls.

#### Locked Outcomes

- Before match start, host can kick/remove the other player.
- Before match start, host can close/delete the room.
- Before match start, host can rename the room.
- Before match start, host can use invite-only controls.
- Host controls do not override both-player ready requirement for match start.
- PvP pre-match host controls are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact invite-only behavior.
- Post-match results page.

#### Accepted Uncertainty

- Invite-only controls are locked as a host capability, but exact effect on lobby visibility and join permissions remains open.

#### Conversational Reflection Summary

Host ownership now means pre-match room management: the host can shape or close the room, but cannot force the match to start without the other player's ready confirmation.

### Session CJ-066

```yaml
session_id: CJ-066
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvp invite-only room visibility and join permissions
```

#### Clarification Target

Clarify what invite-only controls do to room visibility and join permissions.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because host invite-only control is locked, but it was unclear whether invite-only hides the room or only restricts who can enter.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

For invite-only controls, should a host be able to temporarily hide the room from the public lobby, or should invite-only only restrict who can join while the room remains visible?

#### Human Responses

- Invite-only should only restrict who can join while the room remains visible.

#### Locked Outcomes

- Invite-only rooms remain visible in the public lobby.
- Invite-only restricts join access to invited players.
- PvP invite-only visibility/join behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- How the lobby visually marks invite-only rooms.
- Post-match results page.

#### Accepted Uncertainty

- Invite-only behavior is locked, while the exact lobby display remains open.

#### Conversational Reflection Summary

Invite-only now preserves lobby visibility while controlling access: everyone can see the room exists, but only invited players can enter.

### Session CJ-067

```yaml
session_id: CJ-067
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: pvp public private room creation correction
```

#### Clarification Target

Correct the PvP room model from visible invite-only rooms to public/private room creation choices.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the human recognized that an invite-only room being visible to the public contradicted the meaning of private/invite-only room behavior.

#### Traversal Layer

WHY to HOW.

#### Warning Event

[WARNING :: INTENT_CHANGE_DETECTED]

The prior visible-but-restricted invite-only model is superseded. PvP rooms now have explicit public/private room selection at room creation.

#### Human Responses

- Invite-only rooms should not be visible to the public.
- When a player starts a room, the option of public or private should be given at the beginning.

#### Locked Outcomes

- When starting a PvP room, the player chooses public or private.
- Public rooms are visible in the public lobby.
- Public rooms can be joined from the public lobby.
- Private rooms are not visible in the public lobby.
- Private rooms are joined only through invitation.
- PvP public/private room creation model is synchronized into `docs/game/GAME_LOGIC.md`.

#### Superseded Prior Framing

- Every created room being visible by default is superseded.
- Visible-but-restricted invite-only rooms are superseded.

#### Remaining Unresolved Issues

- Private room invitation delivery flow.
- Post-match results page.

#### Accepted Uncertainty

- Public/private room creation is locked, while private invite delivery remains open.

#### Conversational Reflection Summary

This correction makes the room model more intuitive: public rooms belong in the lobby, private rooms are invitation spaces and should not appear as public options.

### Session CJ-068

```yaml
session_id: CJ-068
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: private pvp room invite notification
```

#### Clarification Target

Clarify how invited players learn they have been invited to a private PvP room.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because private rooms are hidden from the public lobby, so invited players need a clear delivery path.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

For private PvP rooms, should invited players receive a direct notification/invite popup, or should they find the private room through their friend/invite section?

#### Human Responses

- Invited players should receive a direct notification.

#### Locked Outcomes

- Private PvP room invitations are delivered through a direct notification/invite popup.
- Private PvP room direct invite notification is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether the invite popup includes accept/decline actions.
- Post-match results page.

#### Accepted Uncertainty

- Direct notification is locked, while popup response behavior remains open.

#### Conversational Reflection Summary

Private rooms now have a clear social signal: because they are hidden from the lobby, the invitation comes directly to the invited player instead of requiring them to search for it.

### Session CJ-069

```yaml
session_id: CJ-069
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: private pvp room invite popup response actions
```

#### Clarification Target

Clarify whether private room invite popups include direct response actions.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because direct invite notification is locked, but the invited player's response path determines how quickly a private room invite can convert into room entry.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should a private room invite popup include accept/decline actions, or should it only notify the player and send them to the invite section to respond?

#### Human Responses

- It should include accept/decline actions.

#### Locked Outcomes

- Private PvP room invite popups include accept and decline actions.
- Private PvP room invite popup response actions are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What happens when the invited player accepts.
- What happens when the invited player declines.
- Post-match results page.

#### Accepted Uncertainty

- Response actions are locked, while the exact accept/decline outcomes remain open.

#### Conversational Reflection Summary

Private room invites now support a quick decision directly in the popup, keeping the room flow fast instead of pushing the player through another menu.

### Session CJ-070

```yaml
session_id: CJ-070
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: private pvp room invite accept behavior
```

#### Clarification Target

Clarify what happens when an invited player accepts a private room invite.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because accept/decline actions are locked, and accept behavior determines the room-entry transition.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

When an invited player accepts a private room invite, should they be taken directly into the room immediately?

#### Human Responses

- Yes.

#### Locked Outcomes

- Accepting a private room invite takes the invited player directly into the room immediately.
- Private PvP room invite accept behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What happens when the invited player declines.
- Post-match results page.

#### Accepted Uncertainty

- Accept behavior is locked, while decline feedback remains open.

#### Conversational Reflection Summary

Private room invite acceptance is now frictionless: accepting the popup moves the player straight into the room.

### Session CJ-071

```yaml
session_id: CJ-071
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: private pvp room invite decline behavior
```

#### Clarification Target

Clarify what happens when an invited player declines a private room invite.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because accept behavior is locked, and decline behavior determines whether the host receives closure or waits without feedback.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

When an invited player declines a private room invite, should the host receive a notification that the invite was declined?

#### Human Responses

- Yes, they should.

#### Locked Outcomes

- Declining a private room invite notifies the host that the invite was declined.
- Private PvP room invite decline behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact notification wording.
- Post-match results page.
- Dedicated stats/logging model.

#### Accepted Uncertainty

- Decline feedback is locked, while exact UI copy is deferred.

#### Conversational Reflection Summary

Private room invite flow now has closure on both sides: accepting enters the room, declining tells the host the invite was declined.

### Session CJ-072

```yaml
session_id: CJ-072
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: post-match results branch selection
```

#### Clarification Target

Clarify the next active branch after PvP room rules.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because PvP room entry rules are sufficiently stabilized for now, and the human selected post-match results as the next semantic branch.

#### Traversal Layer

WHY.

#### Questions Asked

##### Active Clarification Question

Are PvP room rules now sufficiently clarified for the MVP, or should we continue with post-match results/stats next?

#### Human Responses

- Continue with post-match results.

#### Locked Outcomes

- The active clarification branch moves to post-match results.
- PvP room rules are stable enough to defer further room details for now.

#### Remaining Unresolved Issues

- Primary purpose and emotional emphasis of the post-match results screen.
- Exact match stats shown on the results screen.
- Grading model.
- Rewards/progression, if any.
- Add-friend and rematch placement.

#### Accepted Uncertainty

- Post-match results structure remains open until the primary emphasis is clarified.

#### Conversational Reflection Summary

The room flow now gets players into a match; the results screen is where the game can turn that match into meaning, feedback, rivalry, and the desire to play again.

### Session CJ-073

```yaml
session_id: CJ-073
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: post-match results and economy concept
```

#### Clarification Target

Clarify the first defined post-match results screen content and preserve the emerging economy/shop modifier idea.

#### Ambiguity Severity

Tier 1 for purchasable match modifiers.

Tier 2 for results screen content.

#### Prioritization Rationale

This clarification was prioritized because the human defined the winning results screen, performance stats, rewards, and then introduced an economy idea that may affect retention, PvP fairness, ranking, and match validity.

#### Traversal Layer

WHY -> HOW.

#### Questions Asked

##### Active Clarification Question

What should the post-match results screen make the player feel and understand first: victory/defeat, performance breakdown, rewards/progression, or social follow-up?

#### Human Responses

- The winning player screen should display `WIN!`.
- The performance section should show accuracy score, player type, longest streak, and possibly other meaningful persistent stats.
- Accuracy score is the percentage of questions answered correctly out of questions given.
- Player type should classify attack/play style as `Streaker`, `Strategist`, `Avenger`, `Vanilla`, or `Wrongster`.
- The rewards section should show earnings and coins earned.
- An in-game economy may encourage continued play.
- A shop may sell match modifiers that advantage the player or penalize the other player.
- Candidate cards include `Extra 50 HP`, `VENGEFUL`, `Auto Guard`, `BASHFUL`, and `SKIP`.

#### Locked Outcomes

- Winning results screen displays `WIN!`.
- Performance section includes accuracy score.
- Performance section includes player type.
- Player type labels and meanings are captured.
- Performance section includes longest streak.
- Rewards section includes earnings and coins earned.
- Economy/shop concept is preserved as an unresolved branch.
- Results and economy notes are synchronized into `docs/game/GAME_LOGIC.md`.

#### Warning Events

[WARNING :: UNRESOLVED_DEPENDENCY]

Shop modifiers may affect PvP fairness, player trust, ranking, records, and reward validity.

Implication: modifier governance must be clarified before purchasable match advantages are treated as normal PvP rules.

Clarification or deferral required.

#### Remaining Unresolved Issues

- Losing player results screen.
- Exact grading model.
- Other meaningful persistent stats.
- Coin earning formula.
- Whether shop modifiers apply to PvP, PVC, casual, or explicitly modifier-enabled matches.
- Whether both players must consent to modifier-enabled matches.
- Whether modifiers affect ranked records, public stats, rewards, or match validity.

#### Accepted Uncertainty

- Economy direction is promising but not yet governed.
- Candidate modifier cards are conceptual and not balanced.

#### Conversational Reflection Summary

The results screen is becoming more than a scoreboard: it celebrates victory, names how the player fought, pays out coins, and potentially points toward a longer economy loop. The shop idea has energy, but because it can alter PvP fairness, it needs its own careful clarification before it becomes a core competitive rule.

### Session CJ-074

```yaml
session_id: CJ-074
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: shop modifier scope and deferral
```

#### Clarification Target

Clarify whether purchasable match modifiers should affect normal PvP and preserve the need for alternative coin purchases.

#### Ambiguity Severity

Tier 1 for PvP modifier scope.

Tier 2 for alternative coin sinks.

#### Prioritization Rationale

This clarification was prioritized because purchasable match advantages can affect competitive fairness, player trust, and implementation scope; the human also clarified that the immediate goal is to give players something to buy without making the current stage messy.

#### Traversal Layer

WHY -> HOW.

#### Questions Asked

##### Active Clarification Question

Should purchasable match modifiers affect PvP matches against other players, or should they be restricted to PVC / casual / explicitly modifier-enabled matches?

#### Human Responses

- Match modifiers should be allowed in PVC and explicit modifier-enabled matches.
- Match modifiers should be logged for future game development for now.
- Including match modifiers at this stage may make things messy.
- The purpose was to give players something to buy.
- If modifier cards are not used now, the project needs another answer for what players can buy.

#### Locked Outcomes

- Match modifiers do not become normal PvP rules at this stage.
- Match modifiers may be allowed in PVC.
- Match modifiers may be allowed in explicit modifier-enabled matches.
- Modifier cards are deferred for future development.
- Alternative coin shop purchases are now an active unresolved economy question.
- Modifier scope and deferral are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What players can buy with coins in the near-term economy.
- Whether explicit modifier-enabled matches require both-player consent.
- Whether modifier-enabled matches affect ranking, records, and rewards.
- Whether modifiers are consumed per match or reusable.

#### Accepted Uncertainty

- Modifier cards remain promising future content, but they are not part of the immediate core implementation path.

#### Conversational Reflection Summary

This keeps the economy idea alive without letting it tangle the competitive foundation too early. Coins still need a satisfying purpose, but the first shop pass can reward expression, identity, mastery, or presentation before touching match fairness.

### Session CJ-075

```yaml
session_id: CJ-075
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: coin economy as game identity
```

#### Clarification Target

Clarify what coins should buy first after modifier cards are deferred.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the economy still needs a meaningful coin sink, and the human shifted the shop purpose toward player identity rather than match advantage.

#### Traversal Layer

WHY -> HOW.

#### Questions Asked

##### Active Clarification Question

What should coins buy first if modifier cards are deferred: cosmetics/identity, celebrations/effects, progression unlocks, training tools, or social/profile items?

#### Human Responses

- Coins should be currency players use to build game identity.
- Name change is a locked feature.
- Every player starts as `unknown_duelist_<number_id>`.
- Players earn coins to change their name to their choosing.
- Avatar pictures can be unlocked.
- Other identity-building features can be sold later, but are not yet specified.

#### Locked Outcomes

- Coins are identity currency.
- Early economy should not depend on match advantage.
- New players start with generated `unknown_duelist_<number_id>` names.
- Name change is locked as a coin-based identity feature.
- Avatar picture unlocks are locked as an identity feature.
- Other identity-shop purchases remain open.
- Identity economy rules are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether the first name change is free after onboarding or always coin-gated.
- Name uniqueness rules.
- Profanity/moderation rules for chosen names.
- Avatar source and unlock structure.
- Additional identity-shop features.

#### Accepted Uncertainty

- The identity shop can start small; additional identity products can be added after the core identity loop is stable.

#### Conversational Reflection Summary

Coins now have a gentler and cleaner job: they let players move from anonymous duelist into a chosen identity. That supports long-term ownership without making early PvP feel bought.

### Session CJ-076

```yaml
session_id: CJ-076
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: name-change cost timing
```

#### Clarification Target

Clarify whether the first name change is free or coin-gated.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the default `unknown_duelist_<number_id>` identity creates the first identity-upgrade moment, and the cost rule determines whether name customization is a free onboarding step or an earned coin purchase.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should the first name change be free after onboarding, or should every name change require coins from the start?

#### Human Responses

- Every name change requires coins.
- The player's first earnings can come from the first two tutorial matches.
- After the first two tutorial matches, the player can be prompted to unlock and change their name.

#### Locked Outcomes

- Every name change requires coins.
- Tutorial match earnings can create the first name-change opportunity.
- After the first two tutorial matches, the player can be prompted to unlock and change their name.
- Name-change cost timing is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether the first two tutorial matches guarantee enough coins for the first name change.
- Exact name-change cost.
- Exact coin formula for tutorial matches.
- Name uniqueness and moderation rules.

#### Accepted Uncertainty

- The prompt timing is locked after the first two tutorial matches, but affordability rules remain open.

#### Conversational Reflection Summary

The onboarding arc now has a satisfying identity beat: the player begins anonymous, learns the core mechanics, earns coins, and is then invited to become someone by spending those first earnings on a chosen name.

### Session CJ-077

```yaml
session_id: CJ-077
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: guaranteed first name-change affordability
```

#### Clarification Target

Clarify whether the first two tutorial matches guarantee enough coins for the first name change.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the first name-change prompt happens after the first two tutorial matches, and affordability determines whether that prompt is a guaranteed onboarding reward or a performance-gated milestone.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should the first two tutorial matches guarantee enough coins for the first name change, or should the player need to perform well enough to afford it?

#### Human Responses

- The first two tutorial matches should guarantee enough coins for players to change their name.

#### Locked Outcomes

- The first two tutorial matches guarantee enough coins for the player's first name change.
- The first identity upgrade is a guaranteed onboarding payoff.
- Guaranteed first name-change affordability is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact name-change cost.
- Exact tutorial coin payout.
- Name uniqueness rules.
- Name moderation rules.

#### Accepted Uncertainty

- The economy can still vary exact costs and payouts later, but the first name change must be affordable after the first two tutorial matches.

#### Conversational Reflection Summary

The first two tutorials now carry a double reward: mechanical confidence and enough identity currency to stop being `unknown_duelist_<number_id>`.

### Session CJ-078

```yaml
session_id: CJ-078
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: display-name uniqueness and avatar direction
```

#### Clarification Target

Clarify chosen-name uniqueness and preserve the early avatar direction.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because name uniqueness affects identity validation, social lookup, and player recognition, while avatar direction affects the first identity-shop asset path.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should chosen player names be globally unique, or can multiple players use the same display name while the hidden number ID remains unique?

#### Human Responses

- Multiple players can use the same display name.
- The hidden number ID remains unique.
- Avatar form is still being considered.
- The game should be friendly to all for now.
- Avatar direction may use cute theme animations.
- Excalibur engine resources should be kept in mind.

#### Locked Outcomes

- Display names do not need to be globally unique.
- Multiple players may use the same display name.
- Hidden number ID remains unique.
- Avatar direction should be friendly to all players.
- Avatar direction should consider Excalibur resources and cute theme animations.
- Display-name uniqueness and avatar direction are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Avatar format for Version 1.
- Name moderation rules.
- Friend search/display behavior when duplicate display names exist.
- Whether hidden number ID is shown publicly in any context.

#### Accepted Uncertainty

- Avatar identity is directionally friendly/cute but not yet structurally defined.

#### Conversational Reflection Summary

The name system now separates expression from uniqueness: players can share a display name, while the hidden ID quietly keeps records and lookup stable. Avatar identity is moving toward a friendly, approachable visual layer rather than a heavy character system.

### Session CJ-079

```yaml
session_id: CJ-079
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: version 1 avatar format
```

#### Clarification Target

Clarify the avatar format for Version 1 and how richer avatar forms fit into the coin economy.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because avatar format affects the identity shop, Excalibur asset burden, and Version 1 implementation scope.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

For Version 1, should avatars be static profile pictures, small animated mascots, or simple unlockable icon badges?

#### Human Responses

- For now, avatars should be simple unlockable icon badges.
- Static profile pictures should be items players earn.
- Animated mascots should be items players earn.
- Static profile pictures and animated mascots can be unlocked through coins.

#### Locked Outcomes

- Version 1 avatars use simple unlockable icon badges.
- Static profile pictures are deferred into richer earned identity items.
- Animated mascots are deferred into richer earned identity items.
- Static profile pictures and animated mascots are coin-unlockable.
- Version 1 avatar format is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- First set of icon badge themes.
- Coin cost for icon badges.
- Coin cost for static profile pictures.
- Coin cost for animated mascots.
- Asset pipeline for badge/profile/mascot unlocks.

#### Accepted Uncertainty

- Badges are the first avatar implementation target; richer avatar types can arrive as future identity-shop content.

#### Conversational Reflection Summary

The avatar ladder now has a clean Version 1 shape: lightweight badges first, richer profile pictures and animated mascots later as earned identity rewards.

### Session CJ-080

```yaml
session_id: CJ-080
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: game tab team integration boundary
```

#### Clarification Target

Clarify that the MVP scope concern is about game-tab ownership and teammate integration boundaries, not about teammates building the game.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the prior proposed `VERSION_1_MVP_SCOPE.md` did not fully match the human's team context. The human needs to build the game MVP personally, while giving teammates the game-related contracts they need for web, webhook, and database work.

#### Traversal Layer

WHY -> HOW.

#### Questions Asked

##### Active Clarification Question

Should we now create a `VERSION_1_MVP_SCOPE.md` that separates must-have Version 1 features from deferred future features?

#### Human Responses

- The human will be developing the MVP.
- The MVP lives in the game tab.
- Other teammates are responsible for the starting web page and site-level items such as About.
- Game is one item/tab within the wider site.
- Another teammate is working on webhooks.
- Another teammate is working on database.
- The human needs to give teammates certain parts from the game for them to work with.

#### Locked Outcomes

- Game MVP ownership remains with the game developer/human.
- The game MVP lives inside the game tab.
- Teammates do not own the game itself.
- The game needs to expose integration requirements to web/navigation, webhook, and database teammates.
- Team integration context is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact web/navigation integration requirements.
- Exact webhook events needed by the game.
- Exact database tables/entities needed by the game.
- Which game outputs should appear elsewhere in the site.
- Whether to create a dedicated game-tab integration contract document.

#### Accepted Uncertainty

- A broad Version 1 scope artifact may still be useful later, but the immediate need is a teammate-facing integration contract.

#### Conversational Reflection Summary

The handoff problem is now clearer: you are not handing teammates the game to build. You are giving them the edges of the game, where your game tab touches the site shell, event systems, and persistence layer.

### Session CJ-081

```yaml
session_id: CJ-081
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: clarification before integration methodology
```

#### Clarification Target

Clarify whether to create integration contracts now or continue stabilizing game ground truth first.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the human corrected the workflow order: the immediate task is not external integration, but continuing to establish shared understanding in markdown so that translation to TypeScript and Excalibur is easier later.

#### Traversal Layer

WHY.

#### Questions Asked

##### Active Clarification Question

Should we create a `GAME_TAB_INTEGRATION_CONTRACT.md` that lists exactly what the web/navigation, webhook, and database teammates need from the game MVP?

#### Human Responses

- Not yet.
- Before integration, continue ironing out unclear game parts.
- The goal is for human and Codex to establish shared understanding captured in markdown.
- After ground truth is established, translation to TypeScript should be easier.
- After TypeScript logic exists, it can be moved/adapted to Excalibur.

#### Locked Outcomes

- Integration contracts are deferred for now.
- Markdown ground truth remains the immediate priority.
- The current game markdown files are the source of shared semantic truth.
- Intended workflow is markdown ground truth -> TypeScript logic -> Excalibur adaptation -> integration contracts.
- Clarification-to-implementation order is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Which unresolved game area should be clarified next.
- Exact TypeScript module boundaries.
- Exact Excalibur adaptation strategy.
- Future game-tab integration contract.

#### Accepted Uncertainty

- Integration needs still matter, but should wait until game ground truth is stable enough.

#### Conversational Reflection Summary

This is the right correction: we should keep building the shared semantic map until the game is clear enough to implement. The markdown is not busywork; it is the source of truth that will later protect the TypeScript and Excalibur work from drift.

### Session CJ-082

```yaml
session_id: CJ-082
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: post-match results branch return
```

#### Clarification Target

Clarify the next unresolved game area to continue grounding before implementation.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the human reaffirmed ground-truth clarification before implementation and selected post-match results as the next area to continue.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Which unresolved game area should we clarify next for ground truth: losing/post-match results, persistent stats, coin earning formula, avatar badge shop, or TypeScript engine boundaries?

#### Human Responses

- Continue with post-match results.

#### Locked Outcomes

- Post-match results returns as the active clarification branch.
- Losing-side results are the next natural unresolved dependency because winner-side basics are already partially clarified.

#### Remaining Unresolved Issues

- Losing player results screen.
- Whether both players see the same performance categories.
- Rematch / replay / return-to-room actions.
- Coin payout rules for winners and losers.
- Which stats persist beyond the result screen.

#### Accepted Uncertainty

- Winner-side results are partially clarified; full results flow remains open until losing-side and shared-action behavior are clarified.

#### Conversational Reflection Summary

The results screen should now be clarified from both sides of the match. We know how the winner is celebrated; next we need to decide how defeat is framed so it motivates rather than flattens the player.

### Session CJ-083

```yaml
session_id: CJ-083
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: losing-side post-match results
```

#### Clarification Target

Clarify what the losing player sees on the post-match results screen.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because losing-side results determine whether defeat still provides useful feedback, progression, and motivation to continue playing.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

What should the losing player's post-match screen show first: `LOSE!`, encouragement, performance breakdown, rematch prompt, or lesson/improvement feedback?

#### Human Responses

- Losing-side results should reflect the same stats: accuracy, player type, longest streak, earnings, and coins.
- Losing-side earnings and coins should be lower.
- The losing screen should include generic encouraging quotes that advise the learner how to improve.
- Initial improvement tips include:
  - `Sometimes, strategy trumps speed!`
  - `Timing! Timing! Timing!`
  - `Defend can only be used once every two turns. Defend wisely.`
  - `Round off to the nearest 10 to speed up calculation.`
  - `Watch out when you are on a roll!`
  - `Disrupt your opponent's streaks with Defend.`
  - `Don't rely on calculators to win.`

#### Locked Outcomes

- Losing player results show the same performance categories as winning results.
- Losing player results include accuracy, player type, longest streak, earnings, and coins.
- Losing player earnings and coins are lower than winner earnings and coins.
- Losing player results include generic encouraging improvement tips.
- Losing-side post-match results are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact loser reward formula.
- Whether loser rewards are percentage-based or performance-based.
- Whether the losing screen explicitly displays `LOSE!`.
- Whether tips are random, context-aware, or fixed rotation.
- Rematch / return actions after results.

#### Accepted Uncertainty

- The first tip pool is captured, but the selection algorithm remains open.

#### Conversational Reflection Summary

Defeat now still has value: the player sees the same performance mirror, earns some progress, and receives a practical nudge toward better play.

### Session CJ-084

```yaml
session_id: CJ-084
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: post-match coin reward formula
```

#### Clarification Target

Clarify how winner and loser coin rewards are calculated.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because losing-side rewards were known to be lower, but the exact formula was unresolved and affects coin economy pacing.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should loser rewards be a fixed percentage of winner rewards, or calculated independently from performance?

#### Human Responses

- Rewards are calculated as number of correct questions x 10 coins plus a match-outcome bonus.
- Winners receive `+ 50` coins.
- Losers receive `+ 25` coins.

#### Locked Outcomes

- Winner coin formula is `(number of correct questions x 10) + 50`.
- Loser coin formula is `(number of correct questions x 10) + 25`.
- Both winner and loser rewards use the same performance base.
- Winner receives a larger outcome bonus.
- Post-match coin formula is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether `earnings` and `coins earned` are the same displayed value or separate concepts.
- Whether coin rewards differ between PVC and PvP.
- Whether disconnected/voided matches award coins.
- Whether tutorial matches use the same formula or special guaranteed payout rules.

#### Accepted Uncertainty

- The core formula is locked, while mode-specific payout exceptions remain open.

#### Conversational Reflection Summary

The coin formula now rewards answering correctly even in defeat, while still giving victory a clear bonus.

### Session CJ-085

```yaml
session_id: CJ-085
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: post-match reward label and breakdown
```

#### Clarification Target

Clarify whether `earnings` and `coins earned` are separate result concepts.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because duplicate reward labels could create UI and persistence confusion. The result screen needs a single clear reward concept before implementation.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should `earnings` and `coins earned` mean the same value on the results screen, or should `earnings` include a broader breakdown while `coins earned` is the final spendable amount?

#### Human Responses

- Forget `earnings` and `coins earned`.
- Replace them with the word `Reward`.
- Show the breakdown of the reward.
- Reward breakdown should display: `<correct questions> correct questions x 10 coins + <outcome bonus> coins`.
- Outcome bonus depends on win or loss.

#### Locked Outcomes

- Separate `earnings` and `coins earned` labels are superseded by `Reward`.
- Result screen shows reward breakdown.
- Reward breakdown format is `<correct questions> correct questions x 10 coins + <outcome bonus> coins`.
- Winner outcome bonus is `50 coins`.
- Loser outcome bonus is `25 coins`.
- Reward label and breakdown are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether reward breakdown also shows the final summed total.
- Whether PVC and PvP use the same reward display.
- Whether voided matches show `Reward: 0` or hide reward entirely.
- Result-tip selection model.

#### Accepted Uncertainty

- The reward concept is simplified, while exact display polish remains open.

#### Conversational Reflection Summary

The result reward display is now cleaner: one `Reward` concept, with the arithmetic visible so the player sees both performance and outcome bonus.

### Session CJ-086

```yaml
session_id: CJ-086
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: post-match result quote behavior
```

#### Clarification Target

Clarify how losing-side tips are selected and whether winners should also receive post-match quote feedback.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because post-match quotes affect emotional tone after both victory and defeat, and losing-side tip selection determines whether additional match-analysis logic is required.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should the result-tip shown to a losing player be random from the tip pool, or selected based on what happened in the match?

#### Human Responses

- The loser quote should be random from the tip pool.
- The winner should also receive a quote.
- Winner quotes should challenge the winner.
- Initial winner challenge quote examples:
  - `How long can you maintain this win streak?`
  - `Hit a 100 win streak and get a surprise!`
  - `You won a friend. Now challenge your parents!`
  - `Winners don't use calculators. They ARE calculators!`
  - `Bet you can't win a duel in 10 seconds!`

#### Locked Outcomes

- Losing player result tip is randomly selected from the tip pool.
- Winning player result screen includes a challenge quote.
- Initial winner challenge quote pool is captured.
- Result quote behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether winner challenge quotes are random or performance/win-streak aware.
- Whether `100 win streak surprise` is a real future reward promise or playful copy.
- Whether quotes differ between PVC and PvP.

#### Accepted Uncertainty

- Loser tip selection is random; winner quote selection remains open.

#### Conversational Reflection Summary

The result screen now has tone on both sides: losers get a random coaching nudge, while winners get playful pressure to keep proving themselves.

### Session CJ-087

```yaml
session_id: CJ-087
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: winner challenge quote selection
```

#### Clarification Target

Clarify how winner challenge quotes are selected.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because winner quote selection determines whether the result screen needs performance-aware quote logic or can remain lightweight with random pool selection.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should winner challenge quotes also be random from the challenge pool, or selected based on win streak / match performance?

#### Human Responses

- Winner challenge quotes can be random.

#### Locked Outcomes

- Winner challenge quotes are randomly selected from the challenge pool.
- Winner quote selection behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether `100 win streak surprise` is a real future reward promise or playful copy.
- Whether quotes differ between PVC and PvP.
- Whether final reward total is shown in addition to breakdown.

#### Accepted Uncertainty

- Winner quote selection is random for now; deeper contextual quote logic can be deferred.

#### Conversational Reflection Summary

Winner quotes now stay implementation-light while preserving playful momentum after victory.

### Session CJ-088

```yaml
session_id: CJ-088
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: reward total display format
```

#### Clarification Target

Clarify whether the result screen should show the final summed reward total in addition to the breakdown formula.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because reward display formatting determines how clearly players understand the relationship between correct answers, outcome bonus, and final coin reward.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

Should the result screen show the final summed `Reward` total in addition to the breakdown formula?

#### Human Responses

- Show the reward line as `Reward: 13 (tick) questions x 10 coins + 50 coins (win bonus) = 180 coins`.

#### Locked Outcomes

- Result screen shows both the reward breakdown and final total in one line.
- Reward display format is `Reward: <correct questions> (tick) questions x 10 coins + <outcome bonus> coins (<bonus label>) = <total reward> coins`.
- Winner reward display example is `Reward: 13 (tick) questions x 10 coins + 50 coins (win bonus) = 180 coins`.
- Reward total display format is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What label should be used for loser outcome bonus.
- Whether PVC and PvP use the same reward display.
- Whether voided matches show `Reward: 0` or hide reward entirely.

#### Accepted Uncertainty

- Winner reward display copy is clarified; loser bonus wording remains open.

#### Conversational Reflection Summary

The reward line now feels like a clear receipt: correct answers create the base reward, the match outcome adds a bonus, and the final coin total is visible immediately.

### Session CJ-089

```yaml
session_id: CJ-089
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: loser reward bonus label
```

#### Clarification Target

Clarify the bonus label used in the loser reward line.

#### Ambiguity Severity

Tier 4.

#### Prioritization Rationale

This clarification was prioritized because the reward formula already distinguishes winner and loser bonuses, but the loser-facing label should remain neutral and encouraging.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

What should the loser outcome bonus label be called in the reward line?

#### Human Responses

- Use `match bonus`.

#### Locked Outcomes

- Loser reward outcome bonus should be labeled `match bonus`.
- Loser reward bonus label is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether PVC and PvP use the same reward display.
- Whether voided matches show `Reward: 0` or hide reward entirely.

#### Accepted Uncertainty

- Winner bonus label remains `win bonus`; loser bonus label is `match bonus`.

#### Conversational Reflection Summary

The loser reward line now has neutral wording: the player still sees what they earned without the UI emphasizing defeat.

### Session CJ-090

```yaml
session_id: CJ-090
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: PvC reward formula and correct-question scope
```

#### Clarification Target

Clarify whether PvC and PvP use the same post-match reward formula and what `questions correct` counts across.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because reward formulas affect player motivation, economy pacing, and whether practice mode pays at the same rate as competitive mode.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should PVC and PvP use the same post-match reward display format?

#### Human Responses

- PvC rewards are half of PvP correct-question rewards.
- PvC gives `5 coins` per correct question.
- PvC winner bonus is `10 coins`.
- PvC loser receives no bonus.
- Questions correct should be the total number of correctly answered questions for the whole match, across however many rounds the match contains.

#### Locked Outcomes

- PvC rewards do not use the same reward formula as PvP rewards.
- PvC rewards grant `5 coins` per correct question.
- PvC winner bonus is `10 coins`.
- PvC loser bonus is `0 coins`.
- Reward correct-question count totals all correctly answered questions across the whole match, including all rounds in that match.
- PvC reward formula and match-wide correct-question scope are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether voided matches show `Reward: 0` or hide reward entirely.
- Whether PvC result screens should use different wording to signal practice rewards.

#### Accepted Uncertainty

- PvP remains the higher-reward competitive mode; PvC reward display wording can be polished later.

#### Conversational Reflection Summary

PvC now has its own reward economy: it still pays players for practice and completion, but at a lower rate so competitive matches remain the stronger coin source.

### Session CJ-091

```yaml
session_id: CJ-091
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: voided match reward and quote behavior
```

#### Clarification Target

Clarify how voided matches display rewards and what feedback appears after a voided match.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because quit and disconnect handling should visibly communicate that voided matches do not grant rewards, preserving soft deterrence against abandoning matches.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

Should voided matches show `Reward: 0` or hide the reward line entirely?

#### Human Responses

- Voided matches should show `Reward: 0 coins`.
- Visible zero reward should deter players from disconnecting.
- Voided matches should have quotes.
- Initial voided-match quote examples:
  - `Play with a stable connection.`
  - `Finish what you started.`
  - `Try not to ....D/C`

#### Locked Outcomes

- Voided matches should show `Reward: 0 coins`.
- Voided match result screens should include a quote selected from a voided-match quote pool.
- Initial voided-match quote pool includes stable connection, finishing what was started, and avoiding D/C prompts.
- Voided match reward and quote behavior are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether voided-match quotes are random from the voided-match quote pool.
- Whether explicit quit and connection drop use the same voided-match quote pool.

#### Accepted Uncertainty

- The deterrence principle is locked; exact quote selection behavior remains open.

#### Conversational Reflection Summary

Voided results now send a clear message: the match did not count, the player earned nothing, and the UI gently reinforces that finishing matters.

### Session CJ-092

```yaml
session_id: CJ-092
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: voided-match quote selection
```

#### Clarification Target

Clarify how quotes are selected for voided match result screens.

#### Ambiguity Severity

Tier 4.

#### Prioritization Rationale

This clarification was prioritized because the voided-match quote pool existed, but implementation needs explicit selection behavior.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

Should the voided-match quote be randomly selected from that pool?

#### Human Responses

- Yes.

#### Locked Outcomes

- Voided-match quote should be randomly selected from the voided-match quote pool.
- Voided-match random quote selection is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether explicit quit and connection drop use the same voided-match quote pool.

#### Accepted Uncertainty

- Random selection is locked; pool sharing between quit and connection drop remains open.

#### Conversational Reflection Summary

Voided-match feedback now follows the same lightweight quote model as the other result screens: pick from the relevant pool and keep the moment moving.

### Session CJ-093

```yaml
session_id: CJ-093
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: shared voided-match quote pool
```

#### Clarification Target

Clarify whether explicit quits and dropped connections use the same voided-match quote pool.

#### Ambiguity Severity

Tier 4.

#### Prioritization Rationale

This clarification was prioritized because both explicit quit and connection drop create voided matches, but result feedback could have split into separate copy paths unless clarified.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

Should explicit quit and dropped connection use the same voided-match quote pool?

#### Human Responses

- Yes.

#### Locked Outcomes

- Explicit quits and dropped connections should use the same voided-match quote pool.
- Shared voided-match quote pool behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether post-match results should include the `Add Friend` button for PvP matches.

#### Accepted Uncertainty

- The shared pool is locked; more granular copy can be revisited later if needed.

#### Conversational Reflection Summary

Voided result feedback stays simple: whether the player quit or dropped, the match is voided, reward is zero, and the same quote pool handles the reminder.

### Session CJ-094

```yaml
session_id: CJ-094
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: PvP post-match Add Friend and Replay actions
```

#### Clarification Target

Clarify social and rematch actions available from the PvP post-match results screen.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because the results screen is now carrying match feedback, reward payout, and social continuation; Add Friend and Replay determine how a completed PvP match turns into future interaction.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

Should the post-match results screen include an `Add Friend` button after PvP matches?

#### Human Responses

- Yes, PvP post-match results should include an `Add Friend` button.
- PvP post-match results should also include a `Replay` button.
- If a player presses `Replay`, a `15` second countdown timer should display on the initiator's side with `waiting...`.
- The other player's side should show the same waiting appearance with `waiting...`.
- If the other player presses `Replay`, a `3` second countdown begins before the match starts.

#### Locked Outcomes

- PvP post-match results screen includes an `Add Friend` button.
- PvP post-match results screen includes a `Replay` button.
- Replay initiator sees a `15` second countdown timer and `waiting...`.
- The other player's side shows the same replay waiting appearance with `waiting...`.
- If both players press `Replay`, a `3` second countdown starts before the match begins.
- PvP post-match Add Friend and Replay behavior are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What happens if the `15` second replay waiting timer expires before the other player presses `Replay`.
- Whether replay returns players to the same room after timeout or leaves them on the results screen.
- Whether replay is available after voided matches.

#### Accepted Uncertainty

- Replay invitation and acceptance are clarified; timeout behavior remains open.

#### Conversational Reflection Summary

The result screen now has a clear social afterlife: players can add each other, or both opt into a fast rematch with a short shared countdown.

### Session CJ-095

```yaml
session_id: CJ-095
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: replay timeout and results navigation
```

#### Clarification Target

Clarify what happens when a replay request expires and how players leave the post-match results screen.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because the replay request flow needs an expiry outcome and the results screen needs a stable navigation exit.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

What happens if the `15` second replay waiting timer expires before the other player presses `Replay`?

#### Human Responses

- The `Replay` button greys out.
- Players cannot replay from that result screen after the replay timer expires.
- There should be a `Back` button that returns the player to the PvP lobby.
- This raises a broader need to discuss game pages and navigation.

#### Locked Outcomes

- If the `15` second replay waiting timer expires before the other player presses `Replay`, the `Replay` button greys out.
- After replay waiting timer expiry, players can no longer replay from that result screen.
- Post-match results screen includes a `Back` button that returns the player to the PvP lobby.
- Replay timeout and post-match Back behavior are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Core game pages and navigation routes inside the game tab.
- Whether replay is available after voided matches.
- Whether `Back` always returns to PvP lobby or can return to a prior room context in later versions.

#### Accepted Uncertainty

- Results-screen replay exit is clarified; broader navigation now needs its own clarification branch.

#### Conversational Reflection Summary

The post-match screen now has a clean endpoint: rematch quickly if both players agree, otherwise replay expires and players can return to the PvP lobby.

### Session CJ-096

```yaml
session_id: CJ-096
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: initial game tab navigation
```

#### Clarification Target

Clarify the first navigation screen inside the game tab and how it routes players into 1P and 2P play.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because post-match navigation exposed the need for a broader page map before TypeScript and Excalibur screen structure can be planned.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

When a player opens the `Game` tab, what should be the first game screen they see?

#### Human Responses

- Players should be presented with `1P` and `2P` options.
- The `1P` option should have `Tutorial` and `Duel CPU` options.
- Players can only choose one `1P` path at a time.
- The tutorial path has been fleshed out.
- The `Duel CPU` path should include other CPU characters, but those have not yet been discussed.
- The `2P` option should take the player to the room lobby.
- The room lobby should allow the player to start a private room or public room.

#### Locked Outcomes

- Opening the `Game` tab first presents `1P` and `2P` options.
- The `1P` option offers `Tutorial` and `Duel CPU` paths.
- Players choose one `1P` path at a time.
- The `Tutorial` path uses the already clarified tutorial structure.
- The `Duel CPU` path should include additional CPU characters beyond tutorial opponents, but those characters remain unresolved.
- The `2P` option takes the player to the PvP room lobby.
- The PvP room lobby allows a player to start a private room, start a public room, or join available public rooms.
- Initial game tab navigation is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What additional CPU characters exist in `Duel CPU`.
- Whether the `1P` screen should show locked/unlocked CPU progression.
- Whether `Tutorial` and `Duel CPU` share a common 1P menu page or use separate pages.

#### Accepted Uncertainty

- The first navigation fork is clarified; non-tutorial CPU roster design remains open.

#### Conversational Reflection Summary

The game tab now has a simple first shape: choose solo or multiplayer. Solo splits into learning and CPU duels; multiplayer routes straight into the room lobby we already clarified.

### Session CJ-097

```yaml
session_id: CJ-097
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: Duel CPU roster and first two CPU profiles
```

#### Clarification Target

Clarify what the `Duel CPU` path contains beyond the tutorial path and stabilize the first two CPU opponent profiles.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the `1P` path was split into `Tutorial` and `Duel CPU`, but `Duel CPU` needed its own roster, unlock economy, and opponent behavior profiles.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

What should the `Duel CPU` path contain beyond the tutorial CPU opponents?

#### Human Responses

- In the `1P` option, `Duel CPU` and `Tutorial` are separate paths.
- In `Duel CPU`, the player can fight two available CPU opponents.
- Four additional CPU opponents must be unlocked using coins.
- Coins for unlocks can be earned by fighting the available CPU opponents multiple times or by fighting PvP opponents.
- Unlock costs are `500`, then `1000`, then `1500` coins.
- First two CPU profiles to stabilize are `Maki` and `Kander`.
- `Maki` is a `Vanilla` fighter type.
- `Maki` attacks with `1.2x` damage at all times.
- `Maki` cannot build streaks.
- `Maki` answers between `2` and `3` seconds with `70%` probability.
- `Maki` activates block when the player is on a streak greater than `3x` with `70%` probability.
- `Kander` is a `Streak` fighter type.
- `Kander` attempts to attack with streaks `70%` of the time.
- `Kander` answers between `1` and `2` seconds with `70%` probability.
- `Kander` activates block when the player is on a streak greater than `3x` with `70%` probability.

#### Locked Outcomes

- `Duel CPU` is separate from `Tutorial` within the `1P` option.
- `Duel CPU` initially gives access to two CPU opponents.
- `Duel CPU` has four additional CPU opponents that must be unlocked with coins.
- Locked Duel CPU opponents can be unlocked using coins earned from repeated fights against available CPU opponents or from PvP fights.
- Locked Duel CPU unlock costs begin at `500`, then `1000`, then `1500` coins.
- The fourth locked Duel CPU opponent unlock cost remains unresolved.
- `Maki` is a Duel CPU opponent with `Vanilla` fighter type.
- `Maki` attacks with `1.2x` damage at all times and cannot build streaks.
- `Maki` answers between `2` and `3` seconds with `70%` probability.
- `Maki` activates block when the player is on a streak greater than `3x` with `70%` probability.
- `Kander` is a Duel CPU opponent with `Streak` fighter type.
- `Kander` attempts to attack with streaks `70%` of the time.
- `Kander` answers between `1` and `2` seconds with `70%` probability.
- `Kander` activates block when the player is on a streak greater than `3x` with `70%` probability.
- Maki and Kander Duel CPU profiles are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What happens in the remaining `30%` outside Maki and Kander's stated timing/pattern probabilities.
- Fourth locked CPU opponent unlock cost.
- Identities and behaviors of the remaining four locked CPU opponents.
- Whether Maki and Kander are the two initially available opponents.

#### Accepted Uncertainty

- The first two Duel CPU profiles are stable enough to preserve; fallback probability behavior and later CPU roster remain open.

#### Conversational Reflection Summary

The solo path now has a stronger progression loop: tutorials teach the game, while Duel CPU becomes a coin-supported roster challenge with Maki as steady pressure and Kander as faster streak pressure.

### Session CJ-098

```yaml
session_id: CJ-098
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: Maki and Kander fallback attack behavior
```

#### Clarification Target

Clarify what Maki and Kander do outside their stated primary attack probabilities.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because CPU profiles with `70%` primary behavior need defined fallback attack behavior for deterministic implementation.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

For Maki and Kander, what happens in the remaining probability outside their stated `70%` behavior?

#### Human Responses

- They attack normally in the `2` to `3` second window.

#### Locked Outcomes

- Maki's fallback attack behavior is to attack normally in the `2` to `3` second window.
- Kander's fallback attack behavior is to attack normally in the `2` to `3` second window.
- Maki and Kander fallback attack behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What happens in the remaining `30%` when their block condition is met but block does not activate.
- Fourth locked CPU opponent unlock cost.
- Identities and behaviors of the remaining four locked CPU opponents.

#### Accepted Uncertainty

- Attack fallback is clarified; block fallback remains separately unresolved.

#### Conversational Reflection Summary

The first two Duel CPU opponents now have a readable rhythm: their signature behavior defines most of their personality, and their fallback is a normal `2-3s` attack.

### Session CJ-099

```yaml
session_id: CJ-099
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: Maki and Kander block fallback behavior
```

#### Clarification Target

Clarify what Maki and Kander do when their block condition is met but the block chance does not trigger.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because attack fallback was clarified, but CPU defense probability still needed a non-block outcome.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

When their block condition is met but the `70%` block chance does not trigger, should they simply not block and continue attacking normally?

#### Human Responses

- Yes.

#### Locked Outcomes

- If Maki's block condition is met but block does not activate, Maki does not block and continues attacking normally.
- If Kander's block condition is met but block does not activate, Kander does not block and continues attacking normally.
- Maki and Kander block fallback behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether Maki and Kander are the two initially available Duel CPU opponents.
- Fourth locked CPU opponent unlock cost.
- Identities and behaviors of the remaining four locked CPU opponents.

#### Accepted Uncertainty

- Maki and Kander behavior profiles are implementation-ready at a high level; roster availability and later CPU profiles remain open.

#### Conversational Reflection Summary

The CPU behavior is now less mushy: block is a probabilistic interruption, and failed block rolls simply return the CPU to normal attack behavior.

### Session CJ-100

```yaml
session_id: CJ-100
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: initial Duel CPU availability
```

#### Clarification Target

Clarify whether Maki and Kander are the two initially available Duel CPU opponents.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because Maki and Kander profiles were defined, but roster availability needs explicit locked/unlocked state for progression logic.

#### Traversal Layer

WHAT.

#### Questions Asked

##### Active Clarification Question

Are Maki and Kander the two initially available `Duel CPU` opponents?

#### Human Responses

- Yes.

#### Locked Outcomes

- Maki and Kander are the two initially available Duel CPU opponents.
- Initial Duel CPU availability is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Fourth locked CPU opponent unlock cost.
- Identities and behaviors of the remaining four locked CPU opponents.

#### Accepted Uncertainty

- Starting roster is clarified; locked roster details remain open.

#### Conversational Reflection Summary

Duel CPU now starts cleanly: Maki and Kander are playable immediately, and the rest of the roster becomes a coin-driven progression path.

### Session CJ-101

```yaml
session_id: CJ-101
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: sequential Duel CPU unlocks and Fury profile
```

#### Clarification Target

Clarify the locked Duel CPU unlock ladder and stabilize Fury as the first locked CPU opponent.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because Duel CPU progression needs both a coin ladder and mastery gates, and Fury introduces a distinct defensive/revenge CPU archetype.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

What should the fourth locked Duel CPU unlock cost be?

#### Human Responses

- Fourth locked CPU unlock cost is `3000` coins.
- Opponents should be unlocked successively.
- Players cannot unlock the last character just because they have enough coins.
- To unlock characters, players must beat the preceding character and have enough money.
- To unlock the first locked character, players must beat both Kander and Maki.
- The first locked character is `Fury`.
- `Fury` is an `Avenge` fighter type.
- Fury's revenge gauge is constantly filled and cannot empty.
- Fury cannot do streak attacks.
- Fury can successfully block all kinds of attacks `80%` of the time.
- Fury gets hit `20%` of the time.
- Fury attempts to take advantage of the player's wrong-answer vulnerability window.
- After successfully blocking, Fury attempts to maximize attack damage at attack power `30`.
- Fury has a `50%` chance to score a critical hit when attacking at attack power `30`.
- Fury critical hit does `200%` revenge damage.
- Harder questions appear `60%` of the time for all match rounds when Fury fights.

#### Locked Outcomes

- Fourth locked Duel CPU opponent unlock cost is `3000` coins.
- Locked Duel CPU opponents must be unlocked successively.
- Unlocking a Duel CPU opponent requires beating the preceding required CPU opponent or opponents and having enough coins.
- `Fury` is the first locked Duel CPU opponent and costs `500` coins to unlock.
- To unlock `Fury`, players must beat `Maki`, beat `Kander`, and have enough coins.
- `Fury` is an `Avenge` fighter type.
- Fury's revenge gauge is constantly filled and cannot empty.
- Fury cannot do streak attacks.
- Fury successfully blocks all kinds of attacks `80%` of the time and gets hit `20%` of the time.
- Fury attempts to take advantage of the player's wrong-answer vulnerability window.
- After successfully blocking the player's attack, Fury attempts to maximize attack damage at attack power `30`.
- Fury has a `50%` chance to score a critical hit when attacking at attack power `30`.
- Fury critical hit does `200%` revenge damage.
- Harder questions appear `60%` of the time for all match rounds when fighting Fury.
- Sequential Duel CPU unlock rules and Fury profile are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact interpretation of `200% revenge damage`.
- Identities and behaviors of the remaining three locked CPU opponents.
- Unlock prerequisite chain after Fury.

#### Accepted Uncertainty

- Fury's identity and progression position are stable; critical damage formula wording needs one more precision pass.

#### Conversational Reflection Summary

Duel CPU now has its first real gatekeeper: Fury rewards players who have beaten the starting roster, then tests them with permanent revenge pressure, strong blocking, and harder questions.

### Session CJ-102

```yaml
session_id: CJ-102
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: Fury critical damage clarification
```

#### Clarification Target

Clarify Fury's critical hit damage interpretation.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because Fury's critical hit formula directly affects damage calculation and must be deterministic before implementation.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

For Fury, does `200% revenge damage` mean double Fury's normal revenge attack damage, or the standard revenge attack bonus itself?

#### Human Responses

- It means standard revenge-style damage.
- If the attack bar stops at `30` and Fury scores a critical hit, the intended damage outcome is `90`.

#### Warning Event

[WARNING :: CONTRADICTION]

The concrete intended outcome says attack power `30` becomes `90` damage, but the phrase `200% of 30` mathematically equals `60`. Implementing the phrase literally would conflict with the example.

#### Locked Outcomes

- Fury critical hit is described as standard revenge-style damage.
- If Fury attacks at attack power `30` and scores a critical hit, the intended damage outcome is `90`.
- Fury critical hit example and formula warning are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether Fury critical damage should be implemented as `attackPower x 3`.
- Whether the correct player-facing wording is `+200% DMG`, `300% damage`, or another label.

#### Accepted Uncertainty

- The concrete intended damage outcome is preserved; the formula wording remains unresolved and should not be silently collapsed.

#### Conversational Reflection Summary

Fury's critical hit now has a concrete target number, but the language around percentage needs one careful pass so the code and UI say the same thing.

### Session CJ-103

```yaml
session_id: CJ-103
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: Fury critical damage formula resolution
```

#### Clarification Target

Resolve Fury's critical hit percentage wording and implementation formula.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because Fury's concrete damage example needed to be converted into a stable formula before implementation.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

Should Fury critical damage be implemented as `attackPower x 3`, equivalent to base attack plus a `200%` bonus?

#### Human Responses

- The intended wording is `+200% damage`.
- If `+100% damage` of attack power `20` is `40`, then `+200% damage` is `20 + 20 + 20`.
- This applies to attack power `30`, meaning `30 + 30 + 30 = 90`.

#### Locked Outcomes

- Fury critical damage should be implemented as `attackPower x 3`.
- Fury critical hit should be displayed as `+200% DMG`.
- Fury critical example: attack power `20` becomes `60`; attack power `30` becomes `90`.
- Fury critical damage formula is synchronized into `docs/game/GAME_LOGIC.md`.

#### Warning Resolution

[WARNING :: CONTRADICTION]

The earlier contradiction is resolved by interpreting the phrase as bonus wording, not total-percentage wording. `+200% DMG` means base attack plus an additional `200%` bonus, equivalent to `attackPower x 3`.

#### Remaining Unresolved Issues

- Identities and behaviors of the remaining three locked Duel CPU opponents after Fury.
- Unlock prerequisite chain after Fury.

#### Accepted Uncertainty

- Fury's damage formula is resolved; later Duel CPU roster design remains open.

#### Conversational Reflection Summary

Fury's critical hit now has both code math and UI language: calculate triple attack power, show it as `+200% DMG`.

### Session CJ-104

```yaml
session_id: CJ-104
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: Peasy fighter 5 profile
```

#### Clarification Target

Clarify one of the remaining locked Duel CPU opponents after Fury.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because Fury stabilized the first locked CPU, and the remaining roster needs distinct identities to support Duel CPU progression.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

What are the identities and behaviors of the remaining three locked `Duel CPU` opponents after Fury?

#### Human Responses

- Fighter 5 is `Peasy`.
- Peasy is an expert `Streak` fighter type.
- Peasy constantly uses streaks to damage opponents.
- Peasy answers between `0` and `1` second `80%` of the time.
- Peasy successfully blocks the player's attack `50%` of the time.
- Peasy's main mode of attack is to do streak attacks, block the player's attempt to break its streak by answering, then unload another barrage of streaks.
- Peasy attempts to take advantage of the player's wrong-answer vulnerability window.

#### Locked Outcomes

- Fighter 5 is `Peasy`.
- `Peasy` is an expert `Streak` fighter type.
- Peasy constantly uses streaks to damage opponents.
- Peasy answers between `0` and `1` second with `80%` probability.
- Peasy successfully blocks the player's attack `50%` of the time.
- Peasy's main mode is to do streak attacks, block the player's attempt to break its streak by answering, then unload another barrage of streaks.
- Peasy attempts to take advantage of the player's wrong-answer vulnerability window.
- Peasy profile is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Fighter 4 identity and behavior profile.
- Fighter 6 identity and behavior profile.
- Peasy unlock cost relative to fighter 5 position.
- Peasy fallback behavior outside its `80%` answer timing pattern.
- Peasy behavior when its `50%` block chance fails.

#### Accepted Uncertainty

- Peasy's identity and main pressure loop are stable; exact fallback and progression placement details remain open.

#### Conversational Reflection Summary

Peasy now gives the CPU ladder a high-speed streak specialist: it attacks fast, keeps pressure through blocks, and punishes mistakes with more barrages.

### Session CJ-105

```yaml
session_id: CJ-105
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: Shi-eld fighter 4 profile
```

#### Clarification Target

Clarify fighter 4's identity and behavior profile.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because fighter 5 was defined as Peasy, leaving the preceding sequential unlock slot undefined.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

What is fighter 4's identity and behavior profile?

#### Human Responses

- Fighter 4 is `Shi-eld`.
- Shield is a block specialist.
- Shi-eld blocks player's attacks `90%` of the time.
- Shi-eld attacks when it scores a successful block.
- Shi-eld has a hidden vulnerability: it will not block attacks given after the `2.5` second mark `90%` of the time.
- Shi-eld would rather take end-of-turn damage than attack `90%` of the time.
- The `10%` of the time where Shi-eld actually attacks is meant to surprise the player opponent.

#### Locked Outcomes

- Fighter 4 is `Shi-eld`.
- `Shi-eld` is a block specialist.
- Shi-eld blocks the player's attacks `90%` of the time.
- Shi-eld attacks when it scores a successful block.
- Shi-eld will not block attacks given after the `2.5` second mark `90%` of the time.
- Shi-eld would rather take end-of-turn damage than attack `90%` of the time.
- Shi-eld attacks `10%` of the time to surprise the player opponent.
- Shi-eld profile is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Fighter 6 identity and behavior profile.
- Shi-eld unlock cost relative to fighter 4 position.
- Whether Shi-eld's `2.5` second vulnerability applies to all attack types or only answered attacks.
- Whether end-of-turn damage here means `SHOCK!` / no-action damage or a separate Duel CPU timeout rule.

#### Accepted Uncertainty

- Shi-eld's defensive identity and hidden vulnerability are stable; exact implementation edge cases remain open.

#### Conversational Reflection Summary

Shi-eld adds a different kind of CPU lesson: the player is rewarded for noticing that brute speed is not always the answer, because waiting past `2.5s` can expose the shield.

### Session CJ-106

```yaml
session_id: CJ-106
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: Skore fighter 6 profile
```

#### Clarification Target

Clarify fighter 6's identity and behavior profile.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because fighters 4 and 5 were defined after Fury, leaving the final locked Duel CPU roster slot unresolved.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

What is fighter 6's identity and behavior profile?

#### Human Responses

- Fighter 6 is `Skore`.
- Skore can change the question type, including addition, subtraction, chained type, and `?` mode.
- Questions given in Skore fights are always hard.
- Skore can activate revenge mode after just `1` hit.
- Skore's attack starts at `1.2x` attack.
- Skore has `200 HP`.
- Skore tries to attack using streaks `70%` of the time.

#### Locked Outcomes

- Fighter 6 is `Skore`.
- Skore can change the question type, including addition, subtraction, chained type, and `?` mode.
- Questions given when fighting Skore are always hard.
- Skore can activate revenge mode after just `1` hit.
- Skore's attack starts at `1.2x` attack.
- Skore has `200 HP`.
- Skore tries to attack using streaks `70%` of the time.
- Skore profile is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact unlock costs and prerequisite chain for Shi-eld, Peasy, and Skore.
- Skore fallback behavior outside its `70%` streak behavior.
- Exact mechanic for how Skore changes question type.
- Whether Skore can use `?` mode in PvC despite `?` previously being PvP-only.
- Skore answer timing pattern.

#### Accepted Uncertainty

- Skore's capstone identity is stable; several implementation details remain open.

#### Conversational Reflection Summary

Skore completes the CPU roster as the final pressure test: hard questions, type disruption, early revenge, more HP, and frequent streak pressure all pull the player away from comfort.

### Session CJ-107

```yaml
session_id: CJ-107
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: Skore question-mode correction and locked CPU unlock chain
```

#### Clarification Target

Remove Skore's `?` mode behavior and clarify the exact locked CPU prerequisite chain after Fury.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because Skore's `?` mode conflicted with the existing PvP-only `?` rule, and the CPU unlock ladder needed exact prerequisite mapping.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

What are the exact unlock costs and prerequisite chain for Shi-eld, Peasy, and Skore?

#### Human Responses

- Take `?` mode out for Skore.
- Apart from coin unlock cost, Shi-eld requires defeating Fury first.
- After the player defeats Shi-eld, they can challenge Peasy.
- After the player defeats Peasy, they can fight Skore.

#### Locked Outcomes

- Skore should not use `?` mode.
- Shi-eld unlock cost is `1000` coins and requires defeating Fury first.
- Peasy unlock cost is `1500` coins and requires defeating Shi-eld first.
- Skore unlock cost is `3000` coins and requires defeating Peasy first.
- Sequential Duel CPU unlock chain is `Maki/Kander -> Fury -> Shi-eld -> Peasy -> Skore`, with coin costs required at each locked step.
- Skore `?` mode removal and locked CPU unlock chain are synchronized into `docs/game/GAME_LOGIC.md`.

#### Warning Resolution

[WARNING :: CONTRADICTION]

The potential conflict between Skore using `?` mode and the earlier PvP-only `?` rule is resolved by removing `?` mode from Skore.

#### Remaining Unresolved Issues

- Skore answer timing pattern.
- Skore fallback behavior outside its `70%` streak behavior.
- Exact mechanic for how Skore changes question type among non-`?` modes.

#### Accepted Uncertainty

- The progression ladder and Skore's mode boundary are clarified; Skore's runtime behavior needs another pass.

#### Conversational Reflection Summary

The CPU ladder is now structurally coherent: the player climbs through each opponent in order, and Skore remains a hard question-shifter without breaking the PvP-only `?` rule.

### Session CJ-108

```yaml
session_id: CJ-108
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: Skore revenge behavior and answer timing
```

#### Clarification Target

Clarify Skore's answer timing pattern and revenge-mode behavior.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because Skore's high-level identity was defined, but implementation still needed answer timing and revenge-mode priority.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

What is Skore's answer timing pattern?

#### Human Responses

- When Skore has revenge mode, he will try to maximize it by blocking a player attack and scoring maximum damage.
- If Skore does not have revenge mode, he will answer between `0` and `1.5` seconds `80%` of the time to score streak damage.

#### Locked Outcomes

- When Skore has revenge mode, Skore tries to maximize it by blocking a player attack and scoring maximum damage.
- When Skore does not have revenge mode, Skore answers between `0` and `1.5` seconds with `80%` probability to score streak damage.
- Skore revenge-mode behavior and answer timing are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What Skore does in the remaining `20%` outside the `0-1.5s` non-revenge answer timing pattern.
- Exact definition of `maximum damage` for Skore's revenge-mode punish.
- Exact mechanic for how Skore changes question type among non-`?` modes.

#### Accepted Uncertainty

- Skore's primary rhythm is clarified; fallback behavior and exact maximum-damage targeting remain open.

#### Conversational Reflection Summary

Skore now has two clear modes: in revenge it tries to bait and punish through a block, while outside revenge it races for fast streak pressure.

### Session CJ-109

```yaml
session_id: CJ-109
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: Skore fallback block behavior
```

#### Clarification Target

Clarify Skore's remaining non-revenge fallback behavior outside its primary fast answer timing pattern.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because Skore's primary non-revenge answer timing was clarified as an `80%` behavior, leaving the remaining `20%` undefined for implementation.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

What does Skore do in the remaining `20%` outside its `0-1.5s` non-revenge answer timing pattern?

#### Human Responses

- Skore blocks.
- Skore's block has no recovery.
- Skore can block as many times as it wants without penalty.

#### Locked Outcomes

- In the remaining `20%` outside Skore's non-revenge `0-1.5s` answer timing pattern, Skore blocks.
- Skore's block has no recovery.
- Skore can block as many times as it wants without penalty.
- Skore's no-recovery unlimited block is a Skore-specific CPU behavior and does not change normal player DEFEND cooldown/recovery rules.
- Skore fallback block behavior is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact definition of `maximum damage` for Skore's revenge-mode punish.
- Exact mechanic for how Skore changes question type among non-`?` modes.

#### Accepted Uncertainty

- Skore's fallback action is clarified; revenge maximum damage and question-type switching remain open.

#### Conversational Reflection Summary

Skore now feels like a final opponent: even its fallback is pressure, because it can turtle behind unlimited blocks while waiting for the next punish window.

### Session CJ-110

```yaml
session_id: CJ-110
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: Skore maximum damage clarification
```

#### Clarification Target

Clarify what `maximum damage` means for Skore's revenge-mode punish.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because Skore's revenge-mode behavior targeted `maximum damage`, but implementation needed to know whether this meant maximum attack-bar value or a special damage formula.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

What exactly counts as `maximum damage` for Skore's revenge-mode punish?

#### Human Responses

- Skore will try to score attack damage `30`.

#### Locked Outcomes

- Skore's revenge-mode `maximum damage` means trying to score attack power `30`.
- Skore maximum-damage clarification is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact mechanic for how Skore changes question type among non-`?` modes.

#### Accepted Uncertainty

- Skore's revenge-mode damage target is clarified; question-type disruption remains open.

#### Conversational Reflection Summary

Skore's revenge punish now points at a clear target: win the block exchange, then aim for the top of the attack bar at `30`.

### Session CJ-111

```yaml
session_id: CJ-111
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: Skore question-type change rule
```

#### Clarification Target

Clarify how Skore changes question type among addition, subtraction, and chained modes.

#### Ambiguity Severity

Tier 3.

#### Prioritization Rationale

This clarification was prioritized because Skore's question disruption was locked as an identity trait, but the timing and selection rule were still undefined.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

How exactly does Skore change question type among addition, subtraction, and chained modes?

#### Human Responses

- Skore changes question type randomly after every `3` questions.

#### Locked Outcomes

- Skore changes question type randomly after every `3` questions.
- Skore question-type change rule is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether Duel CPU profiles are stable enough to move back to game-page navigation.
- CPU fallback edge cases for Peasy, Shi-eld, and Skore.

#### Accepted Uncertainty

- Skore's question-mode cadence is clarified; remaining CPU edge cases can be deferred or clarified next.

#### Conversational Reflection Summary

Skore's question disruption now has a rhythm: every three questions, the player has to adapt to a randomly selected non-`?` question mode.

### Session CJ-112

```yaml
session_id: CJ-112
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: Duel CPU stability checkpoint
```

#### Clarification Target

Clarify whether Duel CPU profiles are stable enough to move back to game-page navigation.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the full Duel CPU roster is now named and behaviorally sketched, while navigation is the next major MVP planning dependency.

#### Traversal Layer

WHY/HOW.

#### Questions Asked

##### Active Clarification Question

Are the Duel CPU profiles stable enough to move back to game-page navigation, or should we clarify CPU fallback edge cases next?

#### Human Responses

- Yes, stable now.

#### Locked Outcomes

- Duel CPU profiles are stable enough for now to move back to game-page navigation.

#### Remaining Unresolved Issues

- CPU fallback edge cases for Peasy, Shi-eld, and Skore may be revisited later.
- Game-page navigation after the first `1P` / `2P` choice remains to be clarified.

#### Accepted Uncertainty

- Remaining CPU edge cases are accepted as deferred detail for now.

#### Conversational Reflection Summary

The CPU roster has enough shape to support MVP planning: each opponent has a distinct identity and the ladder is coherent, so the next useful layer is how the player moves through the game screens.

### Session CJ-113

```yaml
session_id: CJ-113
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: 1P menu navigation and stats page
```

#### Clarification Target

Clarify what happens after the player chooses `1P` from the first game screen.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the game tab first fork was known, but the `1P` branch needed concrete page destinations for MVP navigation.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

What pages should exist inside the game tab after the first `1P` / `2P` choice?

#### Human Responses

- After choosing `1P`, a `1P Menu` opens.
- The `1P Menu` has `Tutorial`, `Duel CPU`, and `Stats`.
- `Duel CPU` opens a CPU character fight screen for the player to select an opponent.
- If the fighter is available, the fight screen loads.
- If the fighter is unavailable, show a message on the criteria required to fight that fighter.
- If `Stats` is chosen, show player stats:
  - number of wins.
  - longest streak.
  - which match the longest streak happened in.
  - against which player/opponent.
  - date of the longest-streak match.
  - total accuracy score.
  - number of matches played.
  - number of matches D/C.
  - coins earned.
  - number of times defeated Maki, and similar CPU-specific defeat counts.

#### Locked Outcomes

- After choosing `1P`, a `1P Menu` opens.
- The `1P Menu` includes `Tutorial`, `Duel CPU`, and `Stats`.
- `Duel CPU` opens a CPU character fight selection screen.
- If the selected CPU fighter is available, the fight screen loads.
- If the selected CPU fighter is locked or unavailable, the game shows a message explaining the criteria required to fight that fighter.
- `Stats` shows player stats.
- Initial stats include number of wins, longest streak, longest-streak match/opponent/date, total accuracy score, number of matches played, D/C count, coins earned, and number of times each CPU opponent has been defeated.
- Additional stats may be added later.
- `1P Menu`, CPU fighter selection, and Stats navigation are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact UI layout of the `1P Menu`.
- Exact stat persistence schema.
- Whether stats combine PvP and PvC or separate them by mode.
- `2P` navigation route from lobby to room to match.

#### Accepted Uncertainty

- Stats are directionally defined but remain expandable.

#### Conversational Reflection Summary

The `1P` side now has a usable navigation shape: choose tutorial, choose a CPU fight, or inspect progress through stats and CPU defeat records.

### Session CJ-114

```yaml
session_id: CJ-114
krystalize_session_id: KRYS-game_logic-001
date: 2026-05-27
participants:
  - human
  - codex
scope: 2P menu navigation
```

#### Clarification Target

Clarify the first multiplayer page after the player chooses `2P`.

#### Ambiguity Severity

Tier 2.

#### Prioritization Rationale

This clarification was prioritized because the `1P` branch now has a separate menu page, and the `2P` branch needs a matching page-level navigation structure.

#### Traversal Layer

HOW.

#### Questions Asked

##### Active Clarification Question

After choosing `2P`, what exact screens should the player move through from lobby to room to match?

#### Human Responses

- The `1P Menu` opens on a separate page.
- `2P` also opens to a separate page.
- In the `2P Menu`, there are two options:
  - `Start Private Room`
  - `Start Public Room`
- Both options bring the player to the room lobby.
- Private room allows the player to invite a friend from the friend list to the game.

#### Locked Outcomes

- After choosing `1P`, a separate `1P Menu` page opens.
- After choosing `2P`, a separate `2P Menu` page opens.
- The `2P Menu` includes `Start Private Room` and `Start Public Room`.
- Both `Start Private Room` and `Start Public Room` bring the player to the room lobby.
- Private rooms allow the player to invite a friend from the player's friend list to the game.
- `2P Menu` navigation is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What the room lobby shows after starting a private room.
- What the room lobby shows after starting a public room.
- Whether room lobby and room waiting screen are the same page or separate screens.

#### Accepted Uncertainty

- The first `2P` menu step is clarified; lobby behavior remains open.

#### Conversational Reflection Summary

The navigation now has symmetry: `1P` opens its own solo menu, and `2P` opens its own multiplayer room-start menu before entering the lobby flow.

### Session CJ-115

session_id: CJ-115

date: 2026-05-27

#### Initial Intent

Clarify what the PvP room lobby means now that `2P` can start private or public rooms.

#### Clarification Sessions

##### Severity Tier

Tier 2.

##### Prioritization Rationale

This clarification was prioritized because lobby behavior determines whether players are browsing rooms, waiting inside a room, or preparing for match start.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

Should the PvP room lobby have two separate views: `Public Room List` and `In-Room Waiting Screen`?

#### Human Responses

- In the room lobby, players should see a room list.
- When a player chooses a room to join, the game should go to another page.
- That separate page allows the two players in the room to press the ready button.

#### Locked Outcomes

- The room lobby shows a room list.
- Choosing a room from the room list joins that room.
- After joining a room, the game opens a separate room-ready page.
- The separate room-ready page allows the two players in the room to press the ready button.
- Room lobby and room-ready page separation is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact room-ready page contents.
- Exact room-ready page layout for player slots, host controls, invites, ready buttons, and countdown.
- Whether private-room creation enters the room-ready page immediately or first shows a filtered/private lobby context.

#### Accepted Uncertainty

- The page separation is clarified; exact room-ready UI remains open.

#### Conversational Reflection Summary

The multiplayer flow now has a cleaner shape: lobby is for choosing rooms, while the room-ready page is where two players commit to starting the match.

### Session CJ-116

session_id: CJ-116

date: 2026-05-27

#### Initial Intent

Clarify the basic visual content of the separate room-ready page.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because the room-ready page now exists as a separate screen, but its basic visual framing needed to be stabilized before later host controls or countdown details.

##### Traversal Layer

WHAT.

##### Questions Asked

##### Active Clarification Question

What should the separate room-ready page show once two players are in the same room?

#### Human Responses

- The room-ready page should show `Player ___ VS Player ___`.
- The ready button should be in the middle.

#### Locked Outcomes

- The room-ready page uses a `Player ___ VS Player ___` framing.
- The ready button is placed in the middle.
- Room-ready page basic display is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What the empty opponent slot shows when only one player is in the room-ready page.
- Exact host-control placement on the room-ready page.
- Exact countdown presentation after both players press ready.

#### Accepted Uncertainty

- Basic two-player room-ready framing is clarified; one-player waiting state remains open.

#### Conversational Reflection Summary

The room-ready page now feels like a duel invitation rather than an admin screen: player versus player, with the ready action sitting at the center.

### Session CJ-117

session_id: CJ-117

date: 2026-05-27

#### Initial Intent

Clarify the one-player waiting state for the room creator before an opponent joins.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because the room-ready page can exist before a second player joins, and the empty opponent slot needed a clear player-facing label.

##### Traversal Layer

WHAT.

##### Questions Asked

##### Active Clarification Question

When only one player is in the room-ready page, what should the empty opponent slot show?

#### Human Responses

- The waiting-state interpretation is for the player who started or created the room.
- Use `Player A VS Waiting...`.
- Once another player joins, the display becomes `Player A VS Player B`.

#### Locked Outcomes

- When only the room creator is in the room-ready page, show `Player ___ VS Waiting...`.
- When another player joins, replace `Waiting...` with the opponent player's name.
- Room-ready waiting-state display is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact host-control placement on the room-ready page.
- Exact countdown presentation after both players press ready.
- Whether the ready button is disabled or hidden until a second player joins.

#### Accepted Uncertainty

- One-player waiting display is clarified; ready-button availability during that waiting state remains open.

#### Conversational Reflection Summary

The room-ready page now has both states: it can wait gracefully for an opponent, then snap into the duel framing when the second player arrives.

### Session CJ-118

session_id: CJ-118

date: 2026-05-27

#### Initial Intent

Clarify where pre-match host controls should appear on the room-ready page.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because the host controls were already defined, but their placement on the room-ready page was unresolved.

##### Traversal Layer

WHAT.

##### Questions Asked

##### Active Clarification Question

Where should the host controls appear on the room-ready page: visible buttons, or inside a host-options menu?

#### Human Responses

- Host controls should be in the host-options menu.

#### Locked Outcomes

- Pre-match host controls appear inside a host-options menu on the room-ready page.
- Host-options menu placement is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether the ready button is disabled or hidden while only one player is in the room-ready page.
- Exact countdown presentation after both players press ready.

#### Accepted Uncertainty

- Host controls exist and their menu placement is clarified; ready-button availability in the waiting state remains open.

#### Conversational Reflection Summary

The room-ready page stays focused on the duel and ready action, while room management sits behind a host-options menu.

### Session CJ-119

session_id: CJ-119

date: 2026-05-27

#### Initial Intent

Clarify ready-button availability while only the room creator is waiting for an opponent.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because the room-ready page shows a ready button, but the creator should not be able to ready before an opponent joins.

##### Traversal Layer

WHAT.

##### Questions Asked

##### Active Clarification Question

Should the ready button be disabled or hidden while only one player is in the room-ready page?

#### Human Responses

- The ready button should be disabled.

#### Locked Outcomes

- While only one player is in the room-ready page, the ready button is disabled.
- One-player ready-button disabled state is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact countdown presentation after both players press ready.

#### Accepted Uncertainty

- Waiting-state ready availability is clarified; countdown display remains open.

#### Conversational Reflection Summary

The ready button remains visible as part of the room flow, but it cannot be used until the duel has an opponent.

### Session CJ-120

session_id: CJ-120

date: 2026-05-27

#### Initial Intent

Clarify how the 3-second countdown appears after both players press ready.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because countdown placement defines the final pre-match transition from the room-ready page into the match screen.

##### Traversal Layer

WHAT.

##### Questions Asked

##### Active Clarification Question

After both players press ready, how should the 3-second countdown appear on the room-ready page?

#### Human Responses

- The countdown should appear above the ready button.

#### Locked Outcomes

- After both players press ready, the 3-second countdown appears above the ready button.
- Room-ready countdown placement is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What information each room row/card should show in the public room list.

#### Accepted Uncertainty

- Countdown placement is clarified; lobby room-list content remains open.

#### Conversational Reflection Summary

The room-ready page now has a clear rhythm: players face off, ready in the middle, then see the countdown appear just above that commitment point.

### Session CJ-121

session_id: CJ-121

date: 2026-05-27

#### Initial Intent

Clarify the MVP fields shown for each public room in the room lobby list.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because the lobby now has a room list, but each list entry needed enough information for players to choose a room.

##### Traversal Layer

WHAT.

##### Questions Asked

##### Active Clarification Question

What information should each room row/card show in the public room list?

#### Human Responses

- Use room name.
- Use host/player name.
- Use player count, such as `1/2`.
- Use a `Join` button.

#### Locked Outcomes

- Each public room row/card shows the room name.
- Each public room row/card shows the host/player name.
- Each public room row/card shows player count, such as `1/2`.
- Each public room row/card includes a `Join` button.
- Public room row/card content is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Empty public room list behavior.

#### Accepted Uncertainty

- Public room row/card MVP content is clarified; empty lobby state remains open.

#### Conversational Reflection Summary

The public lobby now has a straightforward scan-and-join shape: identify the room, see who is hosting, check if there is space, and join.

### Session CJ-122

session_id: CJ-122

date: 2026-05-28

#### Initial Intent

Expand the `2P` flow from direct room entry into a VS option page with quick match, lobby entry, room expiry, provisional capacity limits, and spectator viewing.

#### Clarification Sessions

##### Severity Tier

Tier 2.

##### Prioritization Rationale

This clarification was prioritized because the human reframed the multiplayer entry path and introduced lobby-scale behaviors that affect navigation, matchmaking, room lifecycle, and system load.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

What should happen when the public room list is empty?

#### Human Responses

- The `2P` page should take the player to a VS option page.
- The VS option page should offer `Quick Match` and `Enter Game Lobby`.
- Quick Match shows a `Finding a match...` page while the system searches.
- Quick Match assigns the player to the available room created earliest.
- If no room is available because all rooms are full or no rooms exist, tell the player no available rooms were found.
- After failed Quick Match, ask whether the player wants to start a VS room and show `Private Match` and `Public Match`.
- All pages should have a `Back` button to return to the previous page.
- The game lobby should host a maximum of `100` rooms for now.
- If the lobby has `100` rooms, show that the lobby has max rooms and tell the player to come back later.
- A newly started room stays in `waiting` state for `2` minutes.
- If no player joins within `2` minutes, auto-close the room and tell the creator the room closed because no player joined.
- The possible need for a maximum number of connected lobby players is unresolved.
- Add a `View Match` option.
- When a room has two players and both press ready, show the lobby status as `in-game`.
- Other players should see a `View` option for in-game rooms.
- Each game should allow a maximum of `10` viewers for now.

#### Locked Outcomes

- `2P` now opens a VS option page.
- VS option page includes `Quick Match` and `Enter Game Lobby`.
- Quick Match uses a `Finding a match...` page.
- Quick Match assigns the earliest-created available room.
- Failed Quick Match tells the player no available rooms were found.
- Failed Quick Match offers `Private Match` and `Public Match`.
- All pages have a `Back` button.
- Game lobby max rooms is `100` for now.
- Max-room lobby shows a come-back-later message.
- Rooms wait for `2` minutes before auto-closing if no player joins.
- In-game room rows show `in-game` status.
- In-game room rows show a `View` option.
- Each game allows a maximum of `10` viewers for now.
- VS option page, Quick Match, lobby capacity, room expiry, and View Match behavior are synchronized into `docs/game/GAME_LOGIC.md`.

#### Warning Events

[WARNING :: UNRESOLVED_DEPENDENCY]

Lobby and spectator capacity limits are provisional rather than technically validated.

Implications:

- Actual server performance, websocket behavior, database load, and gameplay smoothness may require different room, player, or viewer caps.
- The current `100` room and `10` viewer limits should be treated as MVP design placeholders until validated.

Clarification or deferral requested:

- Defer technical validation to architecture/load-testing pass.
- Preserve current values as provisional gameplay constraints.

#### Remaining Unresolved Issues

- Whether the game lobby should have a maximum number of connected players.
- Exact technical impact of idle lobby users.
- Whether spectator view should be delayed/live, interactive/read-only, or rate-limited.

#### Accepted Uncertainty

- `100` room cap and `10` viewer cap are accepted as provisional MVP constraints.
- Technical capacity validation is deferred.

#### Conversational Reflection Summary

The 2P flow now has a fuller shape: quick automatic entry for speed, lobby browsing for choice, expiry rules to keep rooms clean, and spectator viewing as a future-friendly social layer.

### Session CJ-123

session_id: CJ-123

date: 2026-05-28

#### Initial Intent

Clarify whether the game lobby should have a maximum number of connected players.

#### Clarification Sessions

##### Severity Tier

Tier 2.

##### Prioritization Rationale

This clarification was prioritized because room and viewer caps existed, but idle connected lobby users could still create load without participating.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

Should the game lobby have a maximum number of connected players?

#### Human Responses

- Accept recommendation for no fixed connected-player cap for MVP.
- Use idle cleanup instead.

#### Locked Outcomes

- The game lobby has no fixed connected-player cap for MVP.
- Idle lobby users are removed from the lobby after `10` minutes of inactivity.
- Lobby connected-player cap decision is synchronized into `docs/game/GAME_LOGIC.md`.

#### Warning Events

[WARNING :: UNRESOLVED_DEPENDENCY]

Lobby and spectator capacity limits remain provisional rather than technically validated.

Implications:

- Actual server performance, websocket behavior, database load, and gameplay smoothness may still require later caps or throttling.
- No fixed player cap is an MVP design choice, not a proven capacity guarantee.

Clarification or deferral requested:

- Defer technical validation to architecture/load-testing pass.
- Preserve no fixed MVP lobby-player cap plus `10` minute idle cleanup as current ground truth.

#### Remaining Unresolved Issues

- Whether spectator view should be live, delayed, or otherwise restricted.
- Exact technical impact of idle lobby users.

#### Accepted Uncertainty

- No fixed lobby-player cap is accepted for MVP.
- Idle cleanup is the current soft protection mechanism.
- Technical capacity validation remains deferred.

#### Conversational Reflection Summary

The lobby stays accessible for MVP, while inactive presence is cleaned up before it quietly becomes system weight.

### Session CJ-124

session_id: CJ-124

date: 2026-05-28

#### Initial Intent

Clarify whether spectator view should be live, delayed, or otherwise restricted.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because `View` mode was introduced, but spectator timing affects match feel, network behavior, and potential fairness considerations.

##### Traversal Layer

WHAT.

##### Questions Asked

##### Active Clarification Question

Should spectator view be live, delayed, or otherwise restricted?

#### Human Responses

- Spectator view should be live.

#### Locked Outcomes

- Spectator view is live.
- Live spectator view is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether spectators can interact during a live match or View mode is read-only.
- Whether live spectator view needs later technical restrictions for performance or abuse prevention.

#### Accepted Uncertainty

- Spectator timing is clarified as live; interaction permissions remain open.

#### Conversational Reflection Summary

Spectating now supports the arcade energy of watching pressure unfold in real time.

### Session CJ-125

session_id: CJ-125

date: 2026-05-28

#### Initial Intent

Clarify whether spectators can interact during a live match.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because live spectator view can affect match fairness if spectator actions influence or distract players.

##### Traversal Layer

WHAT.

##### Questions Asked

##### Active Clarification Question

Should spectators be able to interact during a live match, or should View mode be read-only?

#### Human Responses

- Spectators should not be able to interact.
- View mode should be read-only.

#### Locked Outcomes

- Spectator `View` mode is read-only.
- Spectators cannot interact during a live match.
- Read-only spectator mode is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether spectators see the same full game UI as players or a simplified spectator UI.
- Whether live spectator view needs later technical restrictions for performance or abuse prevention.

#### Accepted Uncertainty

- Spectator interaction boundary is clarified; spectator UI scope remains open.

#### Conversational Reflection Summary

Spectators can watch the duel unfold live, but they stay outside the fight itself.

### Session CJ-126

session_id: CJ-126

date: 2026-05-28

#### Initial Intent

Clarify whether spectators see the same full game UI as players or a simplified spectator UI.

#### Clarification Sessions

##### Severity Tier

Tier 4.

##### Prioritization Rationale

This clarification was prioritized because spectator mode is live and read-only, but its visual scope still needed a simple implementation boundary.

##### Traversal Layer

WHAT.

##### Questions Asked

##### Active Clarification Question

Should spectators see the same full game UI as players, or a simplified spectator UI?

#### Human Responses

- Spectators should see the same full player game UI.

#### Locked Outcomes

- Spectators see the same full player game UI in read-only mode.
- Spectator full-UI display is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether live spectator view needs later technical restrictions for performance or abuse prevention.

#### Accepted Uncertainty

- Spectator UI scope is clarified; technical spectator optimization remains deferred.

#### Conversational Reflection Summary

Spectator mode now mirrors the match view directly, with inputs removed rather than creating a separate stripped-down presentation.

### Session CJ-127

session_id: CJ-127

date: 2026-05-28

#### Initial Intent

Clarify nearby multiplayer edge cases for Quick Match, room joining, spectators, empty lobby, host close, and mid-game disconnects.

#### Clarification Sessions

##### Severity Tier

Tier 2.

##### Prioritization Rationale

This clarification was prioritized because the multiplayer flow is now broad enough that race conditions and failure states could confuse players if left unstated.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

What user-facing rules should cover the highest-risk multiplayer edge cases?

#### Human Responses

- If someone joins a room first, Quick Match should recognize that the room is unavailable and find another room.
- Do not confirm that a room is found until Quick Match allocates that room space to the waiting player.
- Each room should have only one Quick Match process inspect it at one time.
- While a room is being inspected by one Quick Match process, another Quick Match process should not inspect that same room.
- If a room becomes full while the player clicks `Join`, the player is too slow and should be kept out.
- If a player presses `Back` while `Finding a match...` is active, cancel finding a match and return the player to the previous page.
- If a player tries to join as the room auto-closes, room closing takes priority and the joining player receives a `could not join room` message.
- If a viewer cap is reached, show a message saying maximum viewers are in the room and to try viewing another room.
- If a match ends while someone is trying to view it, return `Match has ended!`.
- Empty lobby shows `No rooms open at the moment.`
- If viewer cap is reached, `View` should be greyed out.
- If the host closes the room while another player is inside but not ready, return the other player to the lobby with `Host has closed the room.`
- If a player disconnects mid-game, all players return to the game lobby with `A player D/C the game.`

#### Locked Outcomes

- Quick Match only confirms after allocating a room space.
- Quick Match skips rooms that become unavailable before allocation.
- Each room can only be inspected by one Quick Match process at a time.
- `Back` during `Finding a match...` cancels matchmaking and returns to the previous page.
- If a room becomes full during manual join, the join attempt fails and the player remains outside the room.
- If room auto-close and join happen together, room close takes priority and the joiner receives `could not join room`.
- Empty lobby shows `No rooms open at the moment.`
- Full spectator rooms grey out `View`.
- Attempting to view a full spectator room shows a maximum-viewers message.
- Attempting to view an ended match returns `Match has ended!`.
- Host close before readiness returns the other player to the lobby with `Host has closed the room.`
- Mid-game PvP disconnect returns all players to lobby with `A player D/C the game.`
- Multiplayer lobby edge cases are synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Backend-level locking or transaction mechanism for Quick Match room inspection.
- Exact wording/capitalization of edge-case messages may be polished later.

#### Accepted Uncertainty

- Edge cases are clarified at user-facing behavior level; backend implementation details remain deferred.

#### Conversational Reflection Summary

The lobby now has a practical failure language: if the room is gone, full, closing, or over viewer capacity, the player gets a clear reason and is kept out of unstable states.

### Session CJ-128

session_id: CJ-128

date: 2026-05-28

#### Initial Intent

Clarify the MVP player profile data baseline.

#### Clarification Sessions

##### Severity Tier

Tier 2.

##### Prioritization Rationale

This clarification was prioritized because rewards, identity unlocks, CPU progression, D/C accountability, stats, and friend requests all depend on a stable player profile data baseline.

##### Traversal Layer

WHAT.

##### Questions Asked

##### Active Clarification Question

What player profile data must exist for MVP?

#### Human Responses

- Human accepted the recommended MVP player profile data set as good and valid.

#### Locked Outcomes

- MVP player profile data includes hidden unique player ID.
- MVP player profile data includes display name.
- MVP player profile data includes coin balance.
- MVP player profile data includes unlocked CPU opponents.
- MVP player profile data includes unlocked badges/avatar items.
- MVP player profile data includes total matches played.
- MVP player profile data includes wins.
- MVP player profile data includes losses.
- MVP player profile data includes D/C count.
- MVP player profile data includes total correct answers.
- MVP player profile data includes total questions answered.
- MVP player profile data includes longest streak record.
- MVP player profile data includes friend list.
- MVP player profile data includes pending friend requests.
- MVP player profile data baseline is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What match record data must be saved after each completed or voided match.
- Exact database schema remains deferred.

#### Accepted Uncertainty

- The profile data set is an MVP baseline; additional fields may be added later.

#### Conversational Reflection Summary

The player profile now has enough shape to support progression, identity, stats, accountability, and social play without yet turning into a database schema.

### Session CJ-129

session_id: CJ-129

date: 2026-05-28

#### Initial Intent

Clarify where completed or voided match records should be saved.

#### Clarification Sessions

##### Severity Tier

Tier 2.

##### Prioritization Rationale

This clarification was prioritized because player profile history depends on match records, but duplicating full match records under each player could create inconsistent histories.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

Should matches be saved under a central match ID, under each player's match records, or both?

#### Human Responses

- Human accepted the recommendation to use a central match record as source of truth.
- Player profiles should hold lightweight match references.

#### Locked Outcomes

- Match record persistence uses one central match record as the source of truth.
- Each completed or voided match is saved once under a central `match_id`.
- Player profiles store lightweight match references rather than duplicate full match records.
- Player match history is built from central `match_id` references.
- Match record persistence model is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What fields the central match record should contain.
- Exact database schema remains deferred.

#### Accepted Uncertainty

- Persistence model is clarified conceptually; database implementation remains deferred.

#### Conversational Reflection Summary

Match history now has a clean ownership model: one authoritative match record, many profile references to it.

### Session CJ-130

session_id: CJ-130

date: 2026-05-28

#### Initial Intent

Clarify the MVP field set for the central match record.

#### Clarification Sessions

##### Severity Tier

Tier 2.

##### Prioritization Rationale

This clarification was prioritized because the central match record is now the source of truth, and results, stats, rewards, D/C counts, match history, and database handoff all depend on stable saved fields.

##### Traversal Layer

WHAT.

##### Questions Asked

##### Active Clarification Question

What fields should the central match record contain for completed or voided matches?

#### Human Responses

- Human accepted the recommended MVP central match record field set.

#### Locked Outcomes

- Central match record identity fields include `match_id`, `match_mode`, `match_type`, `match_status`, and `void_reason`.
- Central match record participant fields include `player_ids`, `display_names_at_match_time`, `cpu_opponent_id`, and `cpu_opponent_name`.
- Central match record outcome fields include `winner_id`, `loser_id`, `rounds_played`, `round_wins_by_player`, `final_hp_by_player`, and `final_round_score`.
- Central match record performance fields include `correct_answers_by_player`, `total_questions_by_player`, `accuracy_by_player`, `longest_streak_by_player`, and `player_type_by_player`.
- Central match record reward fields include `reward_by_player`, `reward_breakdown_by_player`, `coins_awarded_by_player`, and `stats_valid`.
- Central match record disconnect/quit fields include `dc_or_quit_by_player`, `quit_press_count_by_player`, and `disconnect_event_type`.
- Central match record timing fields include `started_at`, `ended_at`, and `duration_seconds`.
- MVP central match record field set is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Exact database schema remains deferred.
- Exact serialization/type names may be refined during TypeScript implementation.

#### Accepted Uncertainty

- The field set is an MVP baseline and may expand later.

#### Conversational Reflection Summary

The match record now has enough detail to reconstruct results, update profiles, audit disconnects, and hand a clean persistence contract to the database side later.

### Session CJ-131

session_id: CJ-131

date: 2026-05-28

#### Initial Intent

Clarify which player profile fields should be public to other players before a PvP match.

#### Clarification Sessions

##### Severity Tier

Tier 2.

##### Prioritization Rationale

This clarification was prioritized because pre-match profile visibility affects player trust, D/C deterrence, privacy, and room-ready identity display.

##### Traversal Layer

WHAT.

##### Questions Asked

##### Active Clarification Question

What player profile fields should be public to other players before a PvP match?

#### Human Responses

- Human accepted the recommended lightweight public pre-match profile fields.

#### Locked Outcomes

- Public pre-match profile shows display name.
- Public pre-match profile shows hidden unique number ID as a short tag, such as `#1042`.
- Public pre-match profile shows selected badge/avatar.
- Public pre-match profile shows total matches played.
- Public pre-match profile shows win rate.
- Public pre-match profile shows D/C count or D/C rate.
- Public pre-match profile shows current win streak if any.
- Public pre-match profile does not show coin balance.
- Public pre-match profile does not show full match history.
- Public pre-match profile does not show friend list.
- Public pre-match profile does not show pending friend requests.
- Public pre-match profile does not show exact total correct answers/questions.
- Public pre-match profile does not show unlock inventory.
- Public pre-match profile does not show detailed rewards/economy data.
- Public pre-match profile visibility is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- What the friend list displays for each friend in MVP.

#### Accepted Uncertainty

- Public pre-match visibility is an MVP boundary and may be adjusted later.

#### Conversational Reflection Summary

Pre-match identity now shows enough to know who you are facing and whether they have a D/C pattern, without exposing private economy or social data.

### Session CJ-132

session_id: CJ-132

date: 2026-05-28

#### Initial Intent

Clarify MVP friend list row display and actions.

#### Clarification Sessions

##### Severity Tier

Tier 2.

##### Prioritization Rationale

This clarification was prioritized because private room invites, friend requests, online presence, and social navigation depend on what each friend row displays and allows.

##### Traversal Layer

WHAT.

##### Questions Asked

##### Active Clarification Question

What should the friend list display for each friend in MVP?

#### Human Responses

- Human accepted the recommended MVP friend list display and action set.

#### Locked Outcomes

- Each friend list row shows display name.
- Each friend list row shows hidden unique number ID as a short tag, such as `#1042`.
- Each friend list row shows selected badge/avatar.
- Each friend list row shows online status.
- Online status values include `online`, `in match`, and `offline`.
- Friend request status shows `pending` or `declined` where relevant.
- Friend list row action shows `Invite` if the friend is online and available.
- Friend list row action shows `View` profile if the friend is not inviteable.
- Friend list row actions show `Accept` / `Decline` for incoming friend requests.
- Friend list row actions show `Cancel Request` or `Dismiss` for pending or declined outgoing requests.
- MVP friend list display is synchronized into `docs/game/GAME_LOGIC.md`.

#### Remaining Unresolved Issues

- Whether profile, match record, and friend-list data rules are stable enough for database handoff summary.

#### Accepted Uncertainty

- Friend list display is an MVP baseline and may expand later.

#### Conversational Reflection Summary

The friend list now works as a practical social control panel: see who someone is, whether they are available, and what action makes sense right now.

### Session CJ-133

session_id: CJ-133

date: 2026-05-28

#### Initial Intent

Create a constitutional section for implementation recommendations and rationale after the conversation began moving from game meaning into database, TypeScript, and Excalibur implementation guidance.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because implementation recommendations were becoming useful, but they needed to be separated from constitutional gameplay rules so engineering guidance would not accidentally become unchangeable game authority.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

Can the constitution hold implementation recommendations and rationale as a separate section from locked gameplay rules?

#### Human Responses

- Human stated that the conversation was veering into implementation.
- Human requested a section in the constitution to consolidate implementation recommendations and rationale.

#### Locked Outcomes

- A new `Implementation Recommendations And Rationale` section has been added to the constitutional state.
- The section explicitly states that implementation recommendations are not new game authorities.
- The section separates constitutional meaning from runtime structures, persistence schema candidates, Excalibur presentation, and code organization guidance.
- The section records rationale for keeping pure TypeScript domain logic separate from Excalibur rendering and database persistence.
- The clarification frontier now asks what handoff shape should come next: database handoff, TypeScript domain model, or continued constitutional consolidation.

#### Remaining Unresolved Issues

- Whether the implementation recommendation register should become a dedicated database handoff artifact.
- Whether the next artifact should instead define TypeScript domain models and module boundaries.
- Exact database technology, ORM, migrations, and API contract remain deferred.

#### Accepted Uncertainty

- Recommendations may change during implementation if the rationale is preserved and the human accepts the change.

#### Conversational Reflection Summary

The constitution now has a place for implementation thinking without letting implementation convenience rewrite the game. This gives future agents and teammates a map while keeping the rules anchored in the clarified gameplay intent.

### Session CJ-134

session_id: CJ-134

date: 2026-05-28

#### Initial Intent

Continue consolidating implementation guidance inside the constitution rather than creating a separate database or TypeScript handoff artifact yet.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because the human wanted the constitution to clearly distinguish runtime structures, persisted records, and derived/mapper objects before any teammate-facing handoff artifact is created.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

Has the constitution explicitly documented which structures are runtime-only and which must persist?

#### Human Responses

- Human chose to keep consolidating in the constitution a bit longer.
- Human asked whether the recommended database schema, stored objects, and runtime TypeScript structures had been documented.
- Human stated that distinguishing runtime structures from persisted data is useful.

#### Locked Outcomes

- The constitution now includes a `Runtime vs Persistence Classification` matrix.
- The constitution now includes an `Old TypeScript Structure Mapping` section for the screenshot-style types.
- The constitution now includes persisted object sketches for player identity, profile, unlocks, coin ledger, match records, player match references, friend requests, and friendships.
- The constitution now includes runtime structure sketches for match runtime state, player combat state, question round state, and power bar state.
- The constitution now includes mapper responsibility guidance for converting runtime outcomes into persisted records and display DTOs.
- Dedicated database and TypeScript handoff artifacts remain deferred while constitutional consolidation continues.

#### Remaining Unresolved Issues

- Exact database technology, SQL schema, indexes, migrations, API endpoints, and ORM models remain deferred.
- Exact TypeScript file/module names may still be refined later.
- Whether optional detailed question logs are required was deferred here and later clarified in CJ-141.

#### Accepted Uncertainty

- The object sketches are implementation recommendations, not final database or code authority.

#### Conversational Reflection Summary

The constitution now has a clearer middle layer: it can say what should be runtime-only, what should persist, and what should be derived, without forcing the project into a final database or TypeScript implementation too early.

### Session CJ-135

session_id: CJ-135

date: 2026-05-28

#### Initial Intent

Continue consolidation by cleaning stale unresolved issue status and preparing the next constitution branch after the database/webhook discussion.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because the constitution's unresolved table still marked CPU 1, CPU 2, and PVC purpose as open even though later sessions had clarified their onboarding and practice roles.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

What should the constitution treat as the next consolidation focus after database and webhook boundaries were discussed?

#### Human Responses

- Human asked whether webhooks should be done later after consolidation.
- Human accepted continuing consolidation before webhook contract creation.
- Human said to continue.

#### Locked Outcomes

- PVC purpose is now marked closed in the unresolved issue register.
- CPU 1 streak/revenge onboarding is now marked closed in the unresolved issue register.
- CPU 2 DEFEND onboarding is now marked closed in the unresolved issue register.
- The ambiguity severity register now reflects that anti-staleness remains the main deferred Tier 2 issue.
- The active clarification frontier now moves toward identifying internal game events before creating future webhook/server handoff artifacts.

#### Remaining Unresolved Issues

- Internal game event boundaries need to be named and grouped.
- Webhook/server contract remains deferred.
- Database handoff artifact remains deferred.
- TypeScript domain model artifact remains deferred.

#### Accepted Uncertainty

- Webhook implementation details are intentionally deferred until internal game event meaning is clearer.

#### Conversational Reflection Summary

The constitution is getting cleaner: old open flags are being retired, and the next useful bridge is not "build webhooks now," but "name the game events that would later feed server, database, and webhook work."

### Session CJ-136

session_id: CJ-136

date: 2026-05-28

#### Initial Intent

Lock the recommended internal game event set into the constitution while preserving webhook/server implementation as a later handoff concern.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because internal game events are the bridge between runtime logic, persistence updates, UI transitions, and later webhook/server contracts.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

Should the suggested internal game event set be accepted as the starting event vocabulary?

#### Human Responses

- Human agreed to go along with the suggested event set.

#### Locked Outcomes

- The constitution now includes an `Internal Game Events` section.
- The accepted initial event set includes `match.started`, `match.round_started`, `match.round_ended`, `match.completed`, `match.voided`, `match.forfeited`, `player.disconnected`, `player.quit_pressed`, `player.quit_confirmed`, `reward.coins_awarded`, `friend.request_sent`, `friend.request_accepted`, `cpu_opponent.unlocked`, and `profile.name_changed`.
- The constitution explicitly states that internal events are not webhook contracts yet.
- The constitution records boundary notes that internal events may later feed persistence, UI, server events, analytics, notifications, or webhook handoff.
- The active frontier now returns to choosing the next consolidation branch.

#### Remaining Unresolved Issues

- Exact event payloads remain deferred.
- Which internal events become server events or webhooks remains deferred.
- Which internal events remain local-only remains deferred.

#### Accepted Uncertainty

- Internal event names may be refined during TypeScript implementation if rationale is preserved.

#### Conversational Reflection Summary

The project now has an event vocabulary without prematurely designing the webhook layer. That gives the game logic a way to speak to future database and server work while keeping implementation timing under control.

### Session CJ-137

session_id: CJ-137

date: 2026-05-28

#### Initial Intent

Begin the stats calculation consolidation branch.

#### Clarification Sessions

##### Severity Tier

Tier 2.

##### Prioritization Rationale

This clarification was prioritized because stats feed post-match results, player profiles, public pre-match trust signals, rewards, persistence, and future leaderboard/display decisions.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

Which stats are mandatory for MVP, and how should each be calculated?

#### Human Responses

- Human accepted the recommended route of advance and chose stats calculation as the next branch.

#### Locked Outcomes

- `GAME_LOGIC.md` now includes a dedicated `Stats Calculation Rules` section.
- The constitutional state now includes `Stats Calculation Consolidation`.
- Completed matches produce valid performance stats.
- Voided matches produce `Reward: 0 coins`, invalid performance stats, and valid D/C accountability where applicable.
- Accuracy is calculated as `correct_answers / total_questions_given * 100`.
- Correct answer counts are aggregated across the whole match.
- Same-time correct answers count for both players.
- Reaction task success counts as a correct action for the player who completes the sequence first.
- Longest streak is the highest consecutive successful attack streak reached during the match, using existing streak reset rules.
- Reward formulas remain PvP/PvC-specific and use correct answers across the whole match.
- Profile aggregate stats are updated from valid match records and accountability events.
- Lifetime coins earned can be derived from `coin_ledger` rather than duplicated in profile state.
- CPU opponent defeat counts are derived from valid PvC wins by CPU opponent ID.
- Forced PvP forfeits from repeated quit-button abuse give the offending player a valid loss, `D/C +1`, `Reward: 0 coins`, and invalid performance stats.
- The non-offending player in a forced PvP forfeit receives a valid win and normal winner reward unless later implementation discovers an abuse risk.

#### Remaining Unresolved Issues

- Exact player-type classification thresholds remain recommended until playtested.
- Exact treatment of question opportunities while stunned or in `MISSED` lockout was deferred here and later clarified in CJ-140.
- Whether detailed per-question logs are needed was deferred here and later clarified in CJ-141.

#### Accepted Uncertainty

- Player-type classification can begin with recommended thresholds but should be tuned after playtesting.

#### Conversational Reflection Summary

Stats now have a usable backbone: valid matches update performance, voided matches punish abandonment with zero reward and D/C accountability, and forced quit-abuse forfeits are punitive without preserving polluted performance stats.

### Session CJ-138

session_id: CJ-138

date: 2026-05-28

#### Initial Intent

Continue from stats consolidation into UI/page flow mapping.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because the player journey now needs one stable map from Game tab entry through 1P, 2P, matches, spectator view, and post-match results before implementation can translate the constitution into screens, routes, and UI states.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

Should the already clarified navigation decisions be consolidated into a UI/page-flow map?

#### Human Responses

- Human agreed to continue with the UI/page-flow branch.

#### Locked Outcomes

- `GAME_LOGIC.md` now includes a dedicated `UI And Page Flow Map` section.
- The constitutional state now includes `UI/Page Flow Map` and `UI/Page Flow Boundary Notes`.
- The Game tab entry is consolidated as `Game -> 1P / 2P`.
- The 1P branch is consolidated as `1P -> Tutorial / Duel CPU / Stats`.
- The 2P branch is consolidated as `2P -> VS option page -> Quick Match / Enter Game Lobby`.
- Quick Match, public/private room behavior, room-ready page behavior, match page UI, spectator view, and post-match results flows are consolidated.
- Earlier direct `2P -> Start Private Room / Start Public Room` language is preserved as room creation behavior but superseded as the first 2P screen by the later VS option page clarification.
- The active frontier now moves to whether the UI/page flow is stable enough for TypeScript domain architecture.

#### Remaining Unresolved Issues

- Exact route file names, component boundaries, and frontend implementation structure remain deferred.
- Exact Excalibur scene breakdown remains deferred.
- Exact API/socket payloads for room, ready, spectator, and replay flows remain deferred.

#### Accepted Uncertainty

- Page flow is stable as a navigation contract, while implementation details can still change if traceability is preserved.

#### Conversational Reflection Summary

The game now reads like a playable journey instead of scattered screens: choose solo or multiplayer, enter the relevant flow, play the match, then land in results with social or replay options. The next useful move is translating this into runtime architecture without losing the distinction between game truth and visual presentation.

### Session CJ-139

session_id: CJ-139

date: 2026-05-28

#### Initial Intent

Move from UI/page flow into TypeScript domain architecture.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because the ground truth now needs an implementation-facing structure that preserves shared combat rules across PvP, PVC, tutorial scripts, Duel CPU, spectators, Excalibur scenes, and persistence mappers.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

What TypeScript domain architecture should preserve the clarified game rules without letting Excalibur or database persistence become the source of combat truth?

#### Human Responses

- Human requested moving into TypeScript domain architecture.

#### Locked Outcomes

- `GAME_LOGIC.md` now includes a `TypeScript Domain Architecture` section.
- The constitutional state now includes `TypeScript Domain Architecture`, `TypeScript Domain Ownership`, recommended modules, runtime sketches, and TypeScript/Excalibur boundary notes.
- The recommended engine model is a neutral two-combatant TypeScript core with combatant driver types layered around it.
- Controller types preserve differences between local human, remote human, CPU, tutorial script, and spectator read-only behavior without changing combat rules.
- Recommended domain modules include `types.ts`, `matchState.ts`, `combatRules.ts`, `questionGenerator.ts`, `matchReducer.ts`, `tutorialScripts.ts`, `cpuControllers.ts`, `rewardRules.ts`, `statsRules.ts`, and `events.ts`.
- Excalibur is explicitly scoped to rendering, animation, input, and scene work, not combat authority.
- Runtime state, derived result state, and persistence output state remain separate.
- The active frontier now asks whether this architecture is stable enough to produce a teammate-facing implementation handoff.

#### Remaining Unresolved Issues

- Exact TypeScript file paths inside the app/package structure remain deferred.
- Exact Excalibur scene and Actor bindings remain deferred.
- Exact domain event payloads remain deferred.
- Exact tests for the domain layer remain deferred.

#### Accepted Uncertainty

- Type names and module names may be refined during implementation if the neutral-core boundary and rationale are preserved.

#### Conversational Reflection Summary

This gives the implementation a spine: combat truth lives in TypeScript domain logic, while Excalibur makes that truth visible and playable. That should make the later build less brittle because PvP, PVC, tutorial, CPU, and spectator modes are no longer separate little rule universes.

#### Later Clarification Note

- Human clarified that "controller" should not imply a physical game controller.
- Active in-game player input is keyboard-based.
- During active in-game play, only number keys, `-`, `Spacebar`, and `Enter` should be accepted; all other keys should be disabled or ignored.
- The architecture language was refined from `controller type` to `combatant driver type` to avoid physical-controller confusion.

#### Excalibur Documentation First Pass

- Human provided the official Excalibur documentation link: `https://excaliburjs.com/docs/`.
- A first-pass documentation review confirmed that Excalibur's `Engine`, `Scene`, `Actor`, keyboard input, HTML UI guidance, ScreenElements, Actions, Timers, Animation, Display Modes, Screen/Viewport, and Loaders can support the clarified architecture.
- `GAME_LOGIC.md` now includes `Excalibur Mapping Notes`.
- The constitutional state now includes `Excalibur Mapping Notes`, `Excalibur Source References`, and `Excalibur Implementation Boundary`.
- The mapping preserves the boundary that Excalibur owns presentation/input/animation, while TypeScript domain and server/database layers own combat truth, persistence, PvP room allocation, D/C detection, and accountability.

### Session CJ-140

session_id: CJ-140

date: 2026-05-28

#### Initial Intent

Clarify exact accuracy denominator behavior before moving to the next handoff/open-edge item.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because the stats model feeds post-match results, lifetime profile accuracy, database fields, and future player identity/trust displays. If accuracy counted no-answer, stun, timeout, or DEFEND-only states as incorrect, it would misrepresent player competency and incentivize guessing against the intended learning behavior.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

When a player is stunned, locked out, too slow, or otherwise does not submit an answer, should that question count against accuracy?

#### Human Responses

- Human clarified that accuracy should measure submitted-answer correctness, not every arena pressure moment.
- No-answer, timeout/no-action, stunned lockout, and DEFEND-only situations should not count against accuracy unless an answer is submitted.
- Players should be encouraged to avoid guessing; choosing not to answer when unsure should not damage accuracy.
- Slow-but-correct answers should count if the game state accepts the answer.
- `MISSED!` should count against accuracy because it is caused by a wrong submitted answer.

#### Locked Outcomes

- `accuracy = correct_answer_submissions / submitted_answer_attempts`.
- `total_questions_by_player` is currently retained as the match-record denominator field but semantically means submitted answer attempts accepted for accuracy scoring.
- `total_questions_answered` at profile level sums submitted answer attempts from valid match records.
- No-answer, timeout/no-action, stunned lockout, and DEFEND-only situations are in-game pressure or penalty events, not accuracy denominator events.
- Wrong submitted answers count in the denominator and trigger `MISSED!`.
- The previous open edge about stunned/`MISSED!` accuracy treatment is closed.

#### Remaining Unresolved Issues

- Field names may later be refined to `accuracy_attempts_by_player` or similar for implementation clarity.
- Whether detailed per-question logs should persist was unresolved here and later clarified in CJ-141.

#### Accepted Uncertainty

- Exact UI behavior for displaying `0%` versus `N/A` when a player has zero submitted answer attempts remains low-risk and may be settled during UI implementation.

#### Conversational Reflection Summary

Accuracy now tracks mathematical responsibility, not every moment of combat pressure. That fits the learning philosophy better: the game can punish hesitation through HP and momentum, while the stats still reward careful correctness instead of reckless guessing.

### Session CJ-141

session_id: CJ-141

date: 2026-05-28

#### Initial Intent

Clarify whether detailed question logs should persist and where they should live.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because the database handoff and match-record model depend on whether question-round evidence is temporary runtime data or persisted match detail. The human identified future sensemaking as a concrete need, which changes question logs from optional future analytics into a match-scoped persistence requirement.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

Should detailed per-question logs persist, and if so, should they live under the central match record or under each player profile?

#### Human Responses

- Human stated it is useful to have a log of questions asked.
- The log should persist under `match_id` details.
- The log should record the question asked.
- The log should record which player got it correct and at what time.
- The log should record who won the question round and the winning timing.
- The purpose is future sensemaking.

#### Locked Outcomes

- Detailed question logs should persist as match-scoped records under the central `match_id`.
- Question logs should not be duplicated into player profiles.
- Player profiles may derive summary values from match records, but full question evidence remains under match details.
- `match_question_logs` is now a recommended persisted child table/collection rather than an optional future table.
- `GAME_LOGIC.md` now includes required `MatchQuestionLog` fields and optional implementation extensions.
- The constitutional state now includes `MatchQuestionLog` as a persisted object sketch and mapper output.
- The previous `SC-004` open edge is closed.

#### Remaining Unresolved Issues

- Exact database schema syntax, indexes, retention policy, and ORM model remain implementation details.
- Optional log extensions such as submitted answer values, attack power, damage, block state, revenge use, and status snapshots remain implementation recommendations rather than locked minimum fields.

#### Accepted Uncertainty

- The exact storage shape can change if it preserves the locked semantics: match-scoped question evidence under `match_id`, including question asked, correctness, timing, winner, and winning timing.

#### Conversational Reflection Summary

This is a good place to spend a little storage because it gives the future team evidence, not just totals. The summary stats tell us what happened; the question logs let us later understand why it happened.

### Session CJ-142

session_id: CJ-142

date: 2026-05-28

#### Initial Intent

Create a teammate-facing database handoff document that includes not only recommended schema details, but also the rationale for each recommendation.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because the database teammate needs enough context to implement the persistence layer without accidentally rewriting game intent. A table list alone would be brittle; recommendations with rationale preserve why the schema is shaped around central match truth, match-scoped question logs, profile summaries, coin auditability, and SQL-first implementation.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

Should the database handoff document include recommended table names, column guidance, types, nullability, relationships, indexes, JSONB guidance, ORM guidance, migration structure, and why each recommendation exists?

#### Human Responses

- Human stated that the previous SQL/database recommendations were good.
- Human asked whether the database handoff document should explain how to build the schema and why.
- Human emphasized that the explanation of why is important.

#### Locked Outcomes

- `docs/game/handoff/GAME_DATABASE_HANDOFF.md` was created.
- The handoff document uses a SQL-first recommendation style.
- The handoff document includes recommended table names, column naming, SQL types, nullability, relationships, indexes, JSONB guidance, ORM guidance, migration structure, and design rationale.
- The handoff document keeps exact SQL migrations, ORM models, and deployment commands as implementation decisions for the database teammate.
- The constitutional state now identifies `docs/game/handoff/GAME_DATABASE_HANDOFF.md` as the current teammate-facing database handoff artifact.

#### Remaining Unresolved Issues

- Exact SQL migration files have not been created.
- Exact ORM choice remains unresolved.
- Exact production database setup and deployment commands remain outside this handoff document.

#### Accepted Uncertainty

- The database teammate may translate the SQL-first recommendations into Prisma, Drizzle, TypeORM, or raw SQL if the schema meaning and rationale are preserved.

#### Conversational Reflection Summary

This handoff gives the database teammate more than a shopping list. It explains the shape of the data model so implementation choices can adapt without losing the game logic’s intent.

### Session CJ-143

session_id: CJ-143

date: 2026-05-28

#### Initial Intent

Lock the current Version 1 shop offerings and defer match modifiers.

#### Clarification Sessions

##### Severity Tier

Tier 1.

##### Prioritization Rationale

This clarification was prioritized because shop contents directly affect the game's fairness identity. Identity and CPU unlocks preserve a skill-first PvP model, while gameplay-affecting modifiers could alter match fairness, consent, progression, reward validity, and competitive trust.

##### Traversal Layer

WHY -> HOW.

##### Questions Asked

##### Active Clarification Question

What should the current Version 1 shop actually sell, and when should the shop first appear?

#### Human Responses

- Human stated that the shop should first be introduced after the player defeats the second CPU player.
- The first available shop item should be `Change Duelist Name`.
- The other shop items should be unlocks for CPU opponents 3 through 6.
- Match modifiers should be held off for now.
- Human clarified that shop items and purchases should persist.
- CPU unlocks should be finite owned unlocks, such as `Fury unlocked == true`.
- Name changes should have no purchase limit.
- First name change costs `100` coins.
- Subsequent name changes cost `1000` coins each.

#### Locked Outcomes

- The Version 1 shop is introduced after the player defeats the second CPU tutorial opponent.
- The first Version 1 shop item is `Change Duelist Name`.
- The Version 1 shop also sells unlock access for CPU opponents 3 through 6: `Fury`, `Shi-eld`, `Peasy`, and `Skore`.
- Existing CPU unlock prerequisites and coin costs remain active.
- Gameplay-affecting match modifiers are not part of the current Version 1 shop.
- Earlier identity ideas such as icon badges, static profile pictures, animated mascots, and other identity purchases remain future shop expansion candidates unless explicitly added later.
- Shop purchases persist.
- CPU opponent unlocks are one-time persistent unlocks.
- `Change Duelist Name` is a repeatable purchase with no limit if the player can pay.
- First name change costs `100` coins; subsequent name changes cost `1000` coins each.
- The database handoff now recommends `name_change_count` on `player_profiles` and explains that repeatable name changes should update `players.display_name`, increment the name-change count, and write to `coin_ledger`.

#### Remaining Unresolved Issues

- Exact shop screen layout remains an implementation/UI detail.
- Future match modifier governance remains deferred.

#### Accepted Uncertainty

- The current shop is intentionally narrow. It can expand later without changing the current Version 1 offering.

#### Conversational Reflection Summary

The shop now has a clean first purpose: let the player claim an identity after learning the basics, then spend coins to climb the Duel CPU ladder. That keeps the economy useful without letting purchases distort normal PvP.

### Session CJ-144

session_id: CJ-144

date: 2026-05-28

#### Initial Intent

Lock Version 1 MVP player-type classification thresholds and check for contradictions or tuning issues.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because player type appears on result screens and is persisted per match. The labels need enough precision for implementation while remaining flexible enough to tune after playtesting.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

Should the proposed player-type thresholds be locked as Version 1 MVP defaults, and do they contain contradictions or tuning issues?

#### Human Responses

- Human accepted locking the proposed thresholds as Version 1 MVP defaults.
- Human asked whether the thresholds contain contradictions or anything else that should be tuned.

#### Locked Outcomes

- Player-type thresholds are locked as Version 1 MVP defaults while remaining tunable after playtesting.
- Classification uses priority order: `Wrongster`, `Avenger`, `Strategist`, `Streaker`, then `Vanilla`.
- `Wrongster` applies if the player wins and wrong-answer rate is greater than `70%`.
- `Avenger` applies if revenge attacks are the player's largest special damage source, or the player uses revenge attacks at least `3` times in the match.
- `Strategist` applies if attacks after successful DEFEND/block outcomes make up at least `35%` of the player's successful attacks.
- `Streaker` applies if the player reaches a streak of `4+`, or more than `40%` of successful attacks occur inside streak sequences.
- `Vanilla` applies if none of the higher-priority labels apply and the player mostly uses normal attacks/blocks.
- The potential contradiction between old `Vanilla` wording and the new `Streaker` threshold is resolved: an isolated 3-hit streak does not automatically disqualify `Vanilla`.
- Repeated 3-hit behavior may be treated as Streaker-leaning during playtest tuning, but Version 1 MVP uses the `4+` hard threshold unless the `40%` streak-sequence rule is met.

#### Remaining Unresolved Issues

- Exact player-type thresholds may still be tuned after playtesting.
- Exact implementation counters for "special damage source" and "successful attacks inside streak sequences" remain TypeScript implementation details.

#### Accepted Uncertainty

- The thresholds are good enough for MVP classification, not permanent balance truth.

#### Conversational Reflection Summary

The player types now have enough shape to appear on result screens without pretending the first numbers are perfect forever. The only real tuning issue was the 3-hit gap between Vanilla and Streaker, and that is now handled cleanly.

### Session CJ-145

session_id: CJ-145

date: 2026-05-28

#### Initial Intent

Clarify Version 1 shop placement and recommend the shop screen flow.

#### Clarification Sessions

##### Severity Tier

Tier 3.

##### Prioritization Rationale

This clarification was prioritized because the shop has now been narrowed to identity and Duel CPU progression, so its navigation placement should reinforce that scope. Keeping it in `1P` prevents the shop from feeling like a PvP advantage surface.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

Where should the Shop option appear, and what should the recommended Version 1 shop flow include?

#### Human Responses

- Human stated that the `Shop` option should only appear in the `1P Menu` for now.
- Human asked for recommendations on shop UI flow.

#### Locked Outcomes

- For Version 1, `Shop` appears only in the `1P Menu`.
- `Shop` does not appear in the `2P` menu or PvP lobby for now.
- Before CPU 2 is defeated, the `Shop` option remains hidden.
- After CPU 2 is defeated, `1P Menu` includes `Tutorial`, `Duel CPU`, `Stats`, and `Shop`.

#### Recommended Shop Flow

- Show current coin balance.
- Show `Change Duelist Name`.
- Show CPU unlock items for `Fury`, `Shi-eld`, `Peasy`, and `Skore`.
- Show locked/unavailable CPU unlock criteria directly on each CPU item.
- Show owned CPU unlocks as already unlocked and not purchasable again.
- Show name change as repeatable.
- Show name-change pricing as `100` coins for the first change and `1000` coins for later changes.
- Require purchase confirmation before spending coins.
- Show an insufficient-coins message when the player cannot afford an item.
- After a successful purchase, update coin balance and owned/unlocked state immediately.
- Include a `Back` button returning to the `1P Menu`.

#### Recommended Name-Change Flow

- Present a text input for the desired duelist name.
- Show the current cost before confirmation.
- Allow duplicate display names.
- Preserve the hidden unique number ID behind the display name.
- After confirmation, update the visible display name and record the coin spend.

#### Remaining Unresolved Issues

- Exact shop screen layout and visual composition remain implementation details.
- Exact copy for confirmation and insufficient-coin messages can be polished later.

#### Accepted Uncertainty

- The recommended flow is stable enough for implementation planning but does not prescribe exact UI layout.

#### Conversational Reflection Summary

The shop now sits where its meaning lives: solo progression and identity. That keeps the PvP path cleaner while still giving coins a useful destination after tutorial and CPU play. It should first appear only after CPU 2 is defeated, so it feels like a reward/progression unlock rather than an initial menu obligation.

### Session CJ-146

session_id: CJ-146

date: 2026-05-28

#### Initial Intent

Defer future modifier governance and recommend internal engagement analytics for MVP sense-making.

#### Clarification Sessions

##### Severity Tier

Tier 2.

##### Prioritization Rationale

This clarification was prioritized because modifier governance depends on observed player behavior, and the team needs internal engagement data before deciding which future systems are worth reopening or tuning.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

What engagement matrix should be captured internally for players so the team can sense-make after MVP play?

#### Human Responses

- Human stated that future modifier governance should be held off for now.
- Human wants to stabilize the MVP first.
- Human stated that data is needed before working on future modifier governance.
- Human wants to capture player activities in the game to understand what engages players.
- Human clarified that this engagement data should be added to player data but not shown to players.

#### Locked Outcomes

- Future modifier governance remains deferred until the MVP is stable.
- Internal engagement analytics should be captured for future sense-making.
- Engagement analytics should be player-linked.
- Engagement analytics should not be shown to players by default.

#### Recommended Engagement Matrix

- Session and retention: first played, last played, session count, total play time, days active.
- Mode engagement: tutorial starts/completions, Duel CPU matches, PvP matches, Quick Match use, lobby visits, spectator views.
- Match completion: matches started, matches completed, voided matches, confirmed quits, disconnects, replay requests.
- Combat mechanics: attack count, DEFEND uses, successful DEFENDs, revenge activations, revenge attacks used, longest streak reached, wrong answers.
- Learning friction: tutorial retries, CPU opponent attempts/wins, repeated losses to a CPU opponent, high wrong-answer clusters.
- Economy engagement: shop unlock, shop visits, name changes purchased, CPU unlock purchases, coin spends, coin balance changes.
- Social engagement: friend requests sent/accepted/declined, rooms created, rooms joined, private invites sent/accepted, rematches accepted.
- Navigation friction: page exits, back-button exits, finding-match cancellations, failed joins, max-room/max-viewer messages.

#### Recommended Persistence Shape

- Store raw engagement events in `player_activity_events`.
- Store summarized internal engagement metrics in `player_engagement_metrics`.
- Keep both separate from public profile views.
- Use the data to inform future tuning of CPU difficulty, tutorial pacing, question difficulty probabilities, shop expansion, player-type thresholds, and whether future modifier governance should be reopened.

#### Remaining Unresolved Issues

- Exact retention window definitions are not yet locked.
- Exact analytics dashboard or reporting format is not yet defined.
- Privacy/retention policy for long-term analytics remains a teammate/governance implementation concern.

#### Accepted Uncertainty

- Engagement metric names may be adjusted during implementation as long as the internal, non-player-facing sense-making purpose is preserved.

#### Conversational Reflection Summary

This keeps future modifier governance in its proper place: deferred until the team has evidence. The MVP should quietly learn where players spend time, where they struggle, and what keeps them returning, without turning those signals into public identity labels.

### Session CJ-147

session_id: CJ-147

date: 2026-05-28

#### Initial Intent

Create a realtime server handoff document after inspecting the repo structure.

#### Clarification Sessions

##### Severity Tier

Tier 2.

##### Prioritization Rationale

This clarification was prioritized because technical capacity validation, rooms, Quick Match, spectators, disconnects, and PvP authority need an actionable teammate handoff, and the repo already contains an `apps/server` package with `socket.io`.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

Which existing repo area does the server handoff serve, and what should the handoff document contain for that teammate to act on?

#### Human Responses

- Human agreed with creating separate database, realtime server, and possible webhook handoff documents.
- Human emphasized that handoff documents should contain only information useful to the teammate responsible for that area.
- Human asked whether the directory structure has a part that the server handoff serves.
- Human asked to create the realtime server handoff document.

#### Locked Outcomes

- The repo contains `apps/server`, which is the natural target for realtime server work.
- `apps/server` currently has a basic Express server and already includes `socket.io`.
- `docs/game/handoff/GAME_REALTIME_SERVER_HANDOFF.md` is created as the teammate-facing realtime server handoff artifact.
- Realtime server work is distinct from database work.
- Realtime server work is distinct from webhook work unless the same teammate explicitly owns both.

#### Artifact Created

- `docs/game/handoff/GAME_REALTIME_SERVER_HANDOFF.md`

#### Recommended Server Handoff Scope

- PvP room coordination.
- Quick Match allocation and locking.
- ready state and countdown sync.
- server-authoritative PvP match state.
- spectator admission and read-only sync.
- quit and disconnect accountability.
- capacity protection.
- persistence touchpoints.
- socket event sketches.
- webhook boundary notes.

#### Remaining Unresolved Issues

- Exact socket payload schemas remain implementation details.
- Whether a separate `GAME_WEBHOOK_HANDOFF.md` is required depends on whether a teammate owns external webhook notification delivery.
- Technical capacity limits still require validation.

#### Accepted Uncertainty

- The handoff gives actionable server responsibilities without finalizing implementation architecture, socket library details beyond the current dependency, or load-test results.

#### Conversational Reflection Summary

The project now has a cleaner handoff split: database gets persistence truth, realtime server gets live multiplayer responsibility, and webhooks remain a possible later external-notification contract rather than being confused with live PvP coordination.

### Session CJ-148

session_id: CJ-148

date: 2026-05-28

#### Initial Intent

Create an MVP readiness checklist before moving into TypeScript/Excalibur implementation planning.

#### Clarification Sessions

##### Severity Tier

Tier 2.

##### Prioritization Rationale

This clarification was prioritized because the project now has substantial game ground truth plus database and realtime server handoffs, so the next useful artifact is a concise readiness map that distinguishes build-ready areas from intentional deferrals.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

What checklist should summarize whether the MVP is ready to move from clarification into implementation planning?

#### Human Responses

- Human accepted the recommendation to create a `GAME_MVP_READINESS_CHECKLIST.md`.

#### Locked Outcomes

- `docs/game/GAME_MVP_READINESS_CHECKLIST.md` is created.
- The checklist summarizes MVP-ready areas, team handoff artifacts, intentional deferrals, implementation cautions, and the recommended next implementation-planning artifact.
- The checklist does not replace the constitution or handoff documents.

#### Artifact Created

- `docs/game/GAME_MVP_READINESS_CHECKLIST.md`

#### Remaining Unresolved Issues

- Exact TypeScript domain artifact has not been created yet.
- Exact Excalibur implementation artifact has not been created yet.
- Webhook handoff remains deferred unless external notification becomes a real team responsibility.

#### Accepted Uncertainty

- The checklist is a readiness orientation artifact, not a final proof that implementation will reveal no issues.

#### Conversational Reflection Summary

The MVP now has a table of contents for action. It says what is stable enough to build, what has a teammate handoff, and what is deliberately being left outside the MVP stabilization pass.

### Session CJ-149

session_id: CJ-149

date: 2026-05-28

#### Initial Intent

Clarify the MVP leaderboard.

#### Clarification Sessions

##### Severity Tier

Tier 2.

##### Prioritization Rationale

This clarification was prioritized because leaderboard is a major competitive surface and depends directly on profile aggregates, stats validity, and post-match update behavior.

##### Traversal Layer

HOW.

##### Questions Asked

##### Active Clarification Question

How should MVP leaderboard ranking, display, pagination, and update behavior work?

#### Human Responses

- Human identified leaderboard as a very important missing game feature.
- Human stated leaderboard ranking should prioritize win rate first, accuracy second, and win streak third.
- Human stated leaderboard should display those three items.
- Human stated leaderboard should update after every match.
- Human stated leaderboard should show top 20 with page down to the next 20, up to 100.
- Human stated the player's rank should be displayed on top.
- Human stated rank should appear at the side with three stat columns: win rate, accuracy, and win streak.

#### Locked Outcomes

- Leaderboard is part of MVP stats.
- Ranking priority is win rate, then accuracy, then current win streak.
- Leaderboard displays rank, player identity, win rate, accuracy, and current win streak.
- Leaderboard shows the player's own current rank at the top.
- Leaderboard shows top `20` by default.
- Leaderboard supports paging by `20` up to rank `100`.
- Leaderboard updates after valid completed matches.
- Voided match performance should not improve leaderboard placement.
- Leaderboard should appear as an option in the VS option page / `2P` menu alongside `Quick Match` and `Enter Game Lobby`.
- The leaderboard page should include a `Back` button returning to the VS option page.
- MVP leaderboard ranks PvP matches only.
- PvC/Duel CPU leaderboard is deferred for future development.
- Players must complete at least `10` valid PvP matches before appearing on the leaderboard.
- Mutual final-round loss does not change leaderboard win/loss rate.
- Leaderboard eligibility and win-rate denominator are distinct: `pvp_matches_played` controls eligibility, while `pvp_decisive_matches` controls win-rate calculation.
- `GAME_LOGIC.md` is the canonical game logic source filename going forward.

#### Remaining Unresolved Issues

- Exact empty-record behavior for players below `10` valid PvP matches or with zero accuracy attempts remains a low-risk implementation detail.
- Exact visual layout of the leaderboard page remains implementation/UI detail.

#### Accepted Uncertainty

- Leaderboard can begin from derived profile aggregates; performance may later require a SQL view, materialized view, cache, or application query.

#### Conversational Reflection Summary

Leaderboard now joins the MVP as the competitive mirror of the stats system. It does not need a new score: win rate, accuracy, and current win streak already express the game's core values of winning, correctness, and momentum.

## Clarification Rationale Tracking

| ID | Session | Clarification Path | Severity Tier | Why Prioritized | Dependency Branch | Instability Trigger |
| --- | --- | --- | --- | --- | --- | --- |
| CRT-001 | CJ-001 | Human intent before renewed artifact analysis | Tier 1 | Human intent contextualizes artifact interpretation. | Intent -> artifact analysis -> semantic terrain | KRYSTALIZE RESET overwrite selected. |
| CRT-002 | CJ-001 | VS identity before mechanics analysis | Tier 1 | "VS" determines whether mechanics should be interpreted through PvP, PvE, or shared duel assumptions. | VS identity -> timing/fairness/opponent model -> mechanics | Human stated "VS mental sum game." |
| CRT-003 | CJ-001 | Engine model after PvP/PvC identity | Tier 2 | Supporting both PvP and PvC requires a stable split between universal rules and actor control. | PvP/PvC support -> engine neutrality -> controller model -> artifact analysis | Human clarified both PvP and PvC are required. |
| CRT-004 | CJ-001 | Excitement meaning before engine abstraction | Tier 2 | The human expressed an experiential goal, so semantic flow requires deepening that meaning before architecture. | Experience intent -> mechanic priorities -> architecture | Refinement added semantic momentum preservation. |
| CRT-005 | CJ-001 | Primary excitement driver before mechanic review | Tier 2 | The desired feeling is broad, so one mechanical driver should organize the rest before artifact analysis. | Emotional profile -> primary driver -> mechanic interpretation | Human wants all listed feelings enabled. |
| CRT-006 | CJ-001 | Core loop before anti-staleness layer | Tier 2 | The human clarified the basic mechanics and explicitly deferred the "something more" concern. | Core loop -> artifact analysis -> later depth discussion | Human described pressure, streak, revenge, and defense. |
| CRT-007 | CJ-002 | Defense skill expression after artifact alignment | Tier 2 | Artifact confirms defense disrupts streaks, but not whether the skill is prediction, reaction, or resource timing. | Defense intent -> timing model -> cooldown/stun tuning | Artifact alignment review found defense underspecified. |
| CRT-008 | CJ-003 | Revenge ownership after defense clarification | Tier 2 | Defense clarification introduced a possible ambiguity around who activates revenge after a streak. | Defense reversal -> streak building -> revenge activation | Human mentioned blocker activating revenge attack after their streak activates. |
| CRT-009 | CJ-004 | Streak cap after revenge activation | Tier 3 | Revenge activates at the fifth hit/1.4x, but exact damage behavior after that remains unstated. | Streak table -> revenge activation -> runaway pressure tuning | Human clarified revenge trigger at 1.4x hit. |
| CRT-010 | CJ-005 | Power bar curve after damage source identified | Tier 3 | Artifact defines damage source as captured power bar value, but not the curve of that value over time. | Power bar source -> base damage feel -> timing skill | Human asked where attack damage is derived from. |
| CRT-011 | CJ-006 | Attack power before final damage formula | Tier 3 | Human clarified attack power is captured from the bar before streak/revenge transform it into actual damage. | Attack power -> streak/revenge modifiers -> actual damage | Human clarified moving indicator and 1 to 30 range. |
| CRT-012 | CJ-007 | Indicator motion after attack power range | Tier 3 | Starting value is now clarified, leaving movement pattern as the next natural attack-power question. | Attack power range -> indicator motion -> Excalibur animation | Human corrected start value and noted Excalibur. |
| CRT-013 | CJ-008 | Revenge formula after linear bar clarification | Tier 3 | Attack power capture is stable, so the next formula ambiguity is whether revenge stacks with streak. | Attack power -> streak multiplier -> revenge modifier | Human clarified linear indicator motion. |
| CRT-014 | CJ-009 | Defense timing after revenge formula clarification | Tier 2 | Revenge no longer blocks final damage semantics, so the next pressure-loop ambiguity is how DEFEND is timed and skill-expressed. | Revenge formula -> defense timing -> combat rhythm | Human clarified revenge as `attackPower x 2` and non-stacking. |
| CRT-015 | CJ-010 | Failed DEFEND consequence after defense functions clarified | Tier 2 | DEFEND now has multiple valid functions and a known streak cost, leaving mistimed-use consequences as the remaining risk/reward ambiguity. | Defense function -> whiff consequence -> state machine | Human clarified DEFEND can be predictive, barrage-disrupting, and alternate-turn constrained. |
| CRT-016 | CJ-011 | Wrong-answer vulnerability after failed defense clarification | Tier 2 | Failed DEFEND consequences are stable; wrong-answer vulnerability now needs its damage effect clarified before implementation. | Wrong answer -> vulnerability -> incoming damage behavior | Human clarified `MISSED!` as 1-second no-action vulnerability. |
| CRT-017 | CJ-012 | Next direction after `MISSED!` damage clarified | Tier 2 | Core combat consequences are now stable enough to choose between lifecycle clarification and artifact synchronization. | Core mechanics -> lifecycle contradiction or artifact update | Human clarified normal incoming damage during `MISSED!`. |
| CRT-018 | CJ-013 | `Additional DMG` ownership after lifecycle clarification | Tier 2 | Round lifecycle and tie timing are now stable; same-time answer carryover needs ownership semantics before implementation. | Same-time answer -> damage carryover -> stacked modifier application | Human clarified 60-second rounds, round-end ties, and `Additional DMG`. |
| CRT-019 | CJ-014 | Shared `Additional DMG` calculation after ownership clarification | Tier 2 | Carryover ownership is clarified as shared, leaving the deterministic calculation of that shared value unresolved. | Shared additional damage -> calculation formula -> artifact sync | Human clarified one shared additional damage value. |
| CRT-020 | CJ-015 | Same-time threshold after shared bar correction | Tier 2 | Attack power comes from one shared bar, so the remaining simultaneous-answer ambiguity is timing threshold rather than damage-value calculation. | Shared bar -> first-answer ownership -> same-time threshold | Human corrected the per-player capture assumption. |
| CRT-021 | CJ-016 | Artifact synchronization or question contract after same-time threshold | Tier 2 | Core combat timing and lifecycle are now stable enough to choose between syncing the artifact and clarifying the remaining question/answer contract. | Combat semantics -> artifact sync or Q/A contract | Human clarified 150ms same-time threshold. |
| CRT-022 | CJ-017 | Mental-sum question contract after artifact synchronization | Tier 2 | The core combat spec is now synchronized; the next unresolved engine blocker is how mental-sum questions are generated and validated. | Artifact sync -> question contract -> implementation | Human requested updating `GAME_LOGIC.md`. |
| CRT-023 | CJ-018 | Spinner scope after question families clarified | Tier 2 | Question families are now identified, but generation flow depends on whether spinner mode lasts a fight round or changes per question. | Question mode -> spinner scope -> prompt generation | Human described spinner modes and difficulty tiers. |
| CRT-024 | CJ-019 | Comeback difficulty trigger after spinner scope | Tier 2 | Spinner scope is clarified as fight-round-level; the remaining key question selection ambiguity is when easy-tier questions are granted. | Spinner scope -> difficulty selection -> comeback pacing | Human clarified spinner applies to the 60-second fight round. |
| CRT-025 | CJ-020 | Addition tier formulas after easy-tier probability | Tier 2 | Probability triggers are clarified; question generation now needs concrete easy/normal formulas starting with addition mode. | Easy-tier probability -> addition formulas -> question generator | Human clarified 40/60/65 easy-tier probability rules. |
| CRT-026 | CJ-021 | Normal addition formula after easy addition range | Tier 2 | Easy addition is now 1-15, leaving normal addition range as the next generator ambiguity. | Easy addition -> normal addition -> addition generator | Human clarified easy addition range. |
| CRT-027 | CJ-022 | Subtraction tier formulas after addition tiers | Tier 2 | Addition tiers are clarified; subtraction is the next spinner mode needing concrete easy/normal rules. | Addition tiers -> subtraction tiers -> question generator | Human clarified normal addition range. |
| CRT-028 | CJ-023 | Normal subtraction formula after easy subtraction range | Tier 2 | Easy subtraction is now 1-40 with negative answers allowed; normal subtraction remains to clarify. | Easy subtraction -> normal subtraction -> subtraction generator | Human clarified easy subtraction range and negative answers. |
| CRT-029 | CJ-024 | Mixed tier formulas after subtraction tiers | Tier 2 | Addition and subtraction tiers are clarified; mixed mode still needs concrete ranges and chaining behavior. | Subtraction tiers -> mixed tiers -> question generator | Human confirmed normal subtraction range and negative answers. |
| CRT-030 | CJ-025 | Mixed difficulty source after range question | Tier 2 | The previous question assumed difficulty might be range-based; human clarified it should be operation-structure-based. | Mixed range -> mixed cognitive load -> tier structure | Human corrected mixed mode to use 1 to 50; exact term structure was still unstable. |
| CRT-031 | CJ-026 | Mixed three-term structure after four-number correction | Tier 2 | The four-number interpretation would produce the wrong generator shape, so the correction needed to be locked before continuing. | Mixed tier structure -> prompt generation -> answer validation | Human rejected the four-number interpretation and gave concrete easy/difficult examples. |
| CRT-032 | CJ-027 | Negative leading term after mixed prompt examples | Tier 2 | The example `-6 + 28 - 3` could either be valid syntax or shorthand; clarifying it prevents generator-format drift. | Mixed prompt structure -> prompt formatting -> answer validation | Human stated questions may start with negative numbers. |
| CRT-033 | CJ-028 | Mixed operation signs after negative-leading clarification | Tier 2 | Term count, digit load, and negative-leading syntax are stable; sign selection is the remaining mixed generator rule. | Mixed prompt structure -> sign selection -> generator implementation | Human stated mixed-mode signs should be random. |
| CRT-034 | CJ-029 | `?` reaction task after arithmetic generators | Tier 2 | Arithmetic question families are mostly stabilized; `?` mode reaction tasks need ownership and appearance rules before the question contract can stabilize. | `?` mode -> reaction appearance -> attack ownership | Human stated reaction task appearance and sequence length are random, and first completed input gets the attack. |
| CRT-035 | CJ-030 | Reaction task frequency after `?` ownership clarification | Tier 2 | Reaction tasks are clarified as random arcade variety; their frequency determines whether they feel like surprise spice or mode dominance. | `?` mode reaction task -> content distribution -> gameplay feel | Human stated reaction tasks appear 30% of the time. |
| CRT-036 | CJ-031 | `?` arithmetic split after reaction frequency | Tier 2 | Reaction frequency is locked at 30%; the remaining 70% needs arithmetic weighting before `?` mode can stabilize. | `?` mode content distribution -> arithmetic split -> generator implementation | Human set the remaining split to 60% mixed and 40% two-3-digit addition. |
| CRT-037 | CJ-032 | Two-3-digit range after `?` arithmetic split | Tier 2 | The 3-digit addition branch is weighted but needs operand range before generator synchronization. | `?` arithmetic distribution -> 3-digit operand range -> artifact sync | Human confirmed full 100 to 999 operand range. |
| CRT-038 | CJ-033 | PvP question sync before PVC design | Tier 2 | PvP question-generation rules stabilized and needed to be written into the source artifact before shifting to PVC. | PvP question contract -> artifact sync -> PVC purpose | Human confirmed sync and clarified PVC exists for onboarding and PvP skill practice. |
| CRT-039 | CJ-034 | First PVC CPU after PVC purpose | Tier 2 | PVC purpose is clarified; the first concrete opponent should now be tied to a specific training outcome. | PVC purpose -> CPU 1 mechanic focus -> behavior design | Human stated CPU 1 should introduce the streak mechanic. |
| CRT-040 | CJ-035 | CPU 1 tutorial sequence after streak focus | Tier 2 | CPU 1's training focus is locked; the scripted sequence defines how the player experiences streak and revenge mechanics. | CPU 1 streak focus -> scripted tutorial -> post-tutorial flow | Human provided the guided attack, shock, CPU streak, revenge, and task tracker sequence. |
| CRT-041 | CJ-036 | CPU 1 practice flow after scripted tutorial | Tier 2 | The tutorial sequence is locked; the next dependency is whether the player gets post-lesson practice and which mechanics are included. | CPU 1 tutorial -> simplified practice -> DEFEND exclusion | Human stated CPU 1 continues as simplified practice without DEFEND. |
| CRT-042 | CJ-036 | Status display after tutorial UI clarification | Tier 3 | The task tracker clarified tutorial guidance; player state also needs visible status channels for buffs, DEFEND, success, and misses. | Tutorial UI -> status bars -> gameplay readability | Human described attack status bars and DEFEND/status space behavior. |
| CRT-043 | CJ-037 | CPU 1 resistance after simplified practice flow | Tier 2 | The simplified practice fight exists; resistance level determines whether it teaches free streak-building or streak recovery under pressure. | CPU 1 simplified practice -> streak interruption -> completion criteria | Human stated CPU should attack moderately enough to interrupt and reset player streaks. |
| CRT-044 | CJ-038 | CPU 1 completion after resistance tuning | Tier 2 | CPU 1 now has tutorial and practice behavior; clear criteria determines PVC progression and player objective framing. | CPU 1 resistance -> completion condition -> retry/progression | Human stated player must totally defeat CPU 1 and the objective should be displayed. |
| CRT-045 | CJ-039 | CPU 1 retry handling after clear condition | Tier 2 | Total defeat is the clear condition; failure handling must avoid making the tutorial feel repetitive while preserving the practice challenge. | CPU 1 clear condition -> failure retry -> PVC progression | Human stated retry should resume at simplified practice after the tutorial. |
| CRT-046 | CJ-040 | CPU 2 progression after CPU 1 retry handling | Tier 2 | CPU 1 clear and retry behavior are locked; the next dependency is how the PVC ladder advances. | CPU 1 clear -> CPU 2 progression -> CPU 2 mechanic focus | Human stated player should move on to CPU 2 immediately. |
| CRT-047 | CJ-041 | CPU 2 mechanic after immediate progression | Tier 2 | CPU 1 now advances immediately to CPU 2; CPU 2 needs a clear training purpose before its tutorial can be designed. | CPU 1 progression -> CPU 2 mechanic focus -> CPU 2 tutorial | Human stated CPU 2 should introduce DEFEND. |
| CRT-048 | CJ-042 | CPU 2 first DEFEND lesson after mechanic focus | Tier 2 | CPU 2's focus is DEFEND; the first scripted lesson and DEFEND timing needed stabilization before follow-up practice can be designed. | CPU 2 DEFEND focus -> first DEFEND lesson -> follow-up sequence | Human clarified 1-second DEFEND duration and first three scripted DEFEND actions. |
| CRT-049 | CJ-043 | CPU 2 follow-up curriculum after initial DEFEND lesson | Tier 2 | The initial DEFEND lesson is locked; the next dependency is teaching cooldown, streak disruption, and revenge advantage. | CPU 2 initial lesson -> cooldown -> streak disruption -> revenge advantage | Human selected cooldown teaching and two scripted higher-order DEFEND events. |
| CRT-050 | CJ-044 | CPU 2 cooldown teaching method after follow-up curriculum | Tier 2 | Cooldown teaching is required; its presentation determines whether the player learns by guided UI visibility or forced failed action. | CPU 2 cooldown -> UI state -> streak-disruption lesson | Human selected greyed/unavailable visibility for 1 turn. |
| CRT-051 | CJ-045 | CPU 2 streak-disruption setup after cooldown lesson | Tier 2 | DEFEND should interrupt visible pressure; the CPU must reliably build the streak before the player is prompted. | CPU 2 streak-disruption -> scripted CPU streak -> player DEFEND prompt | Human selected a scripted visible 3-4 hit CPU streak. |
| CRT-052 | CJ-046 | CPU 2 revenge activation setup after streak-disruption lesson | Tier 2 | The revenge-advantage lesson requires actual revenge activation before DEFEND can convert danger into advantage. | CPU 2 revenge-advantage -> scripted player damage -> revenge gauge activation | Human selected scripted streak damage that activates player revenge. |
| CRT-053 | CJ-047 | CPU 2 freeze-and-DEFEND prompt after revenge activation | Tier 2 | Revenge activation needs a clear teaching pause so the player learns DEFEND as the comeback pivot. | Revenge activation -> freeze prompt -> player DEFEND -> counterattack beat | Human selected frozen screen prompt requiring DEFEND before continuation. |
| CRT-054 | CJ-048 | CPU 2 revenge counterattack release after DEFEND prompt | Tier 2 | Successful DEFEND needed to resolve into the revenge attack so the tutorial demonstrates the full comeback chain. | Revenge activation -> DEFEND prompt -> answer prompt -> revenge attack | Human confirmed immediate answer/revenge release after DEFEND. |
| CRT-055 | CJ-049 | CPU 2 post-scripted practice after DEFEND curriculum | Tier 2 | The scripted curriculum is clarified; practice must reinforce DEFEND and revenge activation instead of becoming generic combat. | CPU 2 scripted lessons -> simplified practice -> total defeat clear | Human selected simplified practice with higher CPU streak-damage likelihood. |
| CRT-056 | CJ-050 | CPU 1/CPU 2 no-player-defeat familiarisation boundary | Tier 2 | Retry/failure framing conflicted with the purpose of the first two CPU fights as familiarisation encounters. | PVC onboarding -> HP visual feedback -> no player defeat -> progression | Human clarified player HP deductions are visual and restored. |
| CRT-057 | CJ-051 | CPU 1/CPU 2 stakes-aware replay after familiarisation reconsideration | Tier 2 | Human reconsidered familiarisation and clarified that early loss helps players feel stakes. | Scripted tutorial -> possible loss -> skip-script replay -> menu tutorial replay | Human restored player-loss possibility and clarified replay behavior. |
| CRT-058 | CJ-052 | CPU 1/CPU 2 onboarding sufficiency and implementation intent | Tier 2 | Onboarding scope determines whether more CPU trainers are required; quit handling affects core round semantics. | CPU 1/2 core training -> discoverable mechanics -> quit handling -> TypeScript/Excalibur translation | Human clarified discoverable features and implementation intent. |
| CRT-059 | CJ-053 | PVC quit handling and PvP disconnect record semantics | Tier 2 | Leaving a round affects tutorial state, match validity, player records, and implementation behavior. | PVC tutorial completion -> voided stats; PvP disconnect detection -> public `D/C` record | Human clarified PVC quit behavior and PvP disconnect accountability. |
| CRT-060 | CJ-054 | PvP immediate `D/C` threshold after disconnect record semantics | Tier 2 | Disconnect logging was required; threshold needed clarification before implementation can resolve dropped connections. | PvP disconnect detection -> no grace window -> immediate `D/C` | Human selected immediate `D/C` for any detected dropped connection. |
| CRT-061 | CJ-055 | PvP explicit quit label and warning after immediate `D/C` threshold | Tier 2 | Explicit quit needed a distinguishable label and warning while preserving shared `D/C` accountability. | PvP quit button -> warning -> void stats -> increment `D/C` count | Human selected separate quit label and warning consequence text. |
| CRT-062 | CJ-056 | PVC/PvP quit overlay and anti-abuse behavior after quit labels | Tier 2 | Quit button behavior can disrupt active play; overlay and logging rules are needed to prevent abuse. | Quit button -> screen freeze -> question-blocking overlay -> quit count -> escalation warning | Human clarified shared quit overlay and third-press warning behavior. |
| CRT-063 | CJ-057 | PvP-only quit anti-abuse scope and future room entry notes | Tier 2 | Anti-abuse exists to protect human opponent momentum; PvP room entry ideas should be preserved for later. | Quit anti-abuse -> PvP-only scope; PvP entry -> friend invite / room / lobby / join | Human clarified PvP-only scope and noted room/lobby flows. |
| CRT-064 | CJ-058 | Internal quit/disconnect label naming after public `D/C` aggregation | Tier 3 | Public `D/C` is aggregated, but internal records need separate event types for explicit quit versus connection drop. | `QUIT_CONFIRMED` / `CONNECTION_DROPPED` -> public `D/C` | Human selected suggested labels. |
| CRT-065 | CJ-059 | PvP rooms branch selection after quit/disconnect stabilization | Tier 2 | Human chose to clarify PvP rooms before stats/logging or later PVC progression. | Quit/disconnect stabilized -> PvP room entry active branch | Human selected PvP rooms. |
| CRT-066 | CJ-060 | Public PvP rooms and friend request lifecycle after room branch selection | Tier 2 | Room visibility determines how lobby, friend invites, and join-existing-room flows fit together. | Public rooms -> invite dropdown -> post-match friend request lifecycle | Human selected public-by-default rooms and clarified friend request states. |
| CRT-067 | CJ-061 | PvP ready/start handshake after public room visibility | Tier 2 | Room visibility is clarified; match start requires mutual readiness and synchronized transition. | Player joins room -> both ready -> 3-second countdown -> match page load | Human clarified both-player ready flow. |
| CRT-068 | CJ-062 | PvP pre-ready departure after ready/start handshake | Tier 2 | Pre-ready departure determines whether public rooms persist in the lobby before match start. | Player leaves before both ready -> room remains open -> another player can join | Human clarified persistent room behavior. |
| CRT-069 | CJ-063 | PvP countdown departure after pre-ready room lifecycle | Tier 2 | Countdown departure determines whether the game can prevent broken match load after both players ready. | Both ready -> countdown starts -> player leaves -> cancel countdown -> return remaining player | Human clarified countdown cancellation. |
| CRT-070 | CJ-064 | PvP pre-match host transfer after room lifecycle edges | Tier 2 | Host departure determines whether public rooms survive when the creator leaves before match start. | Host leaves before match -> ownership transfers -> room stays alive | Human clarified host transfer. |
| CRT-071 | CJ-065 | PvP pre-match host controls after host transfer | Tier 2 | Host transfer is locked, but ownership needed defined pre-match authority. | Host ownership -> kick/remove, close/delete, rename, invite-only controls | Human clarified host controls. |
| CRT-072 | CJ-066 | Invite-only visibility and join permissions after host controls | Tier 2 | Invite-only controls were locked, but their effect on lobby visibility versus join access was unresolved. | Host invite-only -> room remains visible -> invited players only can join | Human clarified visible-but-restricted behavior. |
| CRT-073 | CJ-067 | Public/private room creation correction after invite-only reconsideration | Tier 2 | Human identified that invite-only visibility conflicted with private room meaning. | Room creation -> public/private choice -> public lobby / private invite-only | Human superseded visible invite-only rooms. |
| CRT-074 | CJ-068 | Private room direct invite notification after public/private split | Tier 2 | Private rooms are hidden from the lobby, so invitation delivery needs a clear player-facing signal. | Private room -> direct invite popup -> invite response flow | Human selected direct notification. |
| CRT-075 | CJ-069 | Private invite popup response actions after direct notification | Tier 2 | Direct notification is locked; popup actions determine how quickly the invite can resolve. | Private invite popup -> accept/decline actions -> room entry/decline flow | Human selected direct accept/decline actions. |
| CRT-076 | CJ-070 | Private invite accept behavior after popup actions | Tier 2 | Accept behavior determines whether invite response is immediate room entry or another navigation step. | Accept private invite -> direct room entry | Human selected immediate room entry. |
| CRT-077 | CJ-071 | Private invite decline behavior after accept behavior | Tier 2 | Decline behavior determines whether host receives closure after invite rejection. | Decline private invite -> host receives declined notification | Human selected host notification. |
| CRT-078 | CJ-072 | Post-match results branch selection after PvP room stabilization | Tier 2 | Results determine how completed matches become feedback, progression, rivalry, and future social action. | PvP room flow -> match completion -> results page | Human selected post-match results as the next branch. |
| CRT-079 | CJ-073 | Winning results content and economy concept after results branch selection | Tier 1 / Tier 2 | Results content defines match meaning, while shop modifiers may affect PvP fairness and progression integrity. | Results screen -> performance/rewards -> economy/shop modifiers -> governance | Human defined winning results content and introduced purchasable match modifiers. |
| CRT-080 | CJ-074 | Modifier scope and deferral after fairness warning | Tier 1 / Tier 2 | Human clarified modifier cards should not complicate the immediate competitive core, but coins still need meaningful purchases. | Shop modifiers -> PVC / explicit modifier-enabled matches -> deferred economy -> alternative coin sinks | Human restricted modifier scope and deferred implementation. |
| CRT-081 | CJ-075 | Identity economy after modifier deferral | Tier 2 | Coins need a meaningful purpose that does not complicate PvP fairness. | Coin rewards -> identity purchases -> name/avatar customization | Human selected game identity as the coin economy purpose. |
| CRT-082 | CJ-076 | Name-change cost timing after identity economy | Tier 2 | Name change is the first identity purchase, so cost timing determines onboarding reward pacing and coin value. | Default name -> tutorial earnings -> name-change prompt | Human required coins for every name change and placed the first prompt after two tutorial matches. |
| CRT-083 | CJ-077 | Guaranteed first name-change affordability after tutorial earnings | Tier 2 | The post-tutorial name-change prompt should not become frustrating if the player cannot afford it. | Tutorial earnings -> first name change -> identity onboarding | Human guaranteed enough coins after the first two tutorial matches. |
| CRT-084 | CJ-078 | Display-name uniqueness and avatar direction after first identity unlock | Tier 2 | Name validation and avatar format shape the first identity-shop implementation path. | Name change -> duplicate display names / hidden ID -> avatar direction | Human allowed duplicate display names and preserved friendly/cute avatar direction. |
| CRT-085 | CJ-079 | Version 1 avatar format after friendly avatar direction | Tier 2 | Avatar format determines the first asset scope and identity-shop complexity. | Avatar direction -> icon badges -> profile pictures / animated mascots as coin unlocks | Human selected icon badges for Version 1 and deferred richer avatars as earned items. |
| CRT-086 | CJ-080 | Game-tab integration boundary after MVP scope correction | Tier 2 | The handoff artifact should match team responsibilities: game owned by human, surrounding web/webhook/database owned by teammates. | Game tab MVP -> web/navigation contract -> webhook contract -> database contract | Human clarified team ownership boundaries. |
| CRT-087 | CJ-081 | Clarification-before-integration methodology after integration-contract proposal | Tier 2 | The workflow should stabilize ground truth before creating integration contracts or translating to code. | Markdown ground truth -> TypeScript -> Excalibur -> integration | Human deferred integration and reaffirmed shared markdown understanding as current priority. |
| CRT-088 | CJ-082 | Post-match results branch return after ground-truth workflow reset | Tier 2 | Results affect match meaning, rewards, stats, replay motivation, and later persistence. | Ground truth clarification -> post-match results -> losing screen | Human selected post-match results as the next area. |
| CRT-089 | CJ-083 | Losing-side results after winner-side basics | Tier 2 | Losing-side feedback determines whether defeat feels useful and whether rewards remain motivating. | Winner results -> loser results -> reward formula / tips | Human selected same stats, lower rewards, and improvement tips. |
| CRT-090 | CJ-084 | Coin reward formula after loser reward clarification | Tier 2 | The economy needs a simple reward formula before result display and identity purchases can stabilize. | Correct answers -> outcome bonus -> coins earned | Human defined winner and loser coin formulas. |
| CRT-091 | CJ-085 | Reward label simplification after coin formula | Tier 2 | Duplicate reward labels could confuse result UI and persistence. | Coin formula -> Reward label -> breakdown display | Human replaced earnings/coins earned with Reward and breakdown. |
| CRT-092 | CJ-086 | Result quote behavior after reward display simplification | Tier 2 | Quote selection shapes post-match emotion and determines whether context-aware result logic is needed. | Losing tips -> random selection; winner quotes -> challenge pool | Human selected random loser tips and added winner challenge quotes. |
| CRT-093 | CJ-087 | Winner challenge quote selection after winner quote pool | Tier 2 | Random quote selection avoids performance-aware result logic while keeping victory playful. | Winner challenge quotes -> random pool selection | Human selected random winner quote selection. |
| CRT-094 | CJ-088 | Reward total display after formula breakdown | Tier 3 | Reward display should make the final coin amount readable while preserving traceability to correct answers and outcome bonus. | Reward breakdown -> bonus label -> total reward | Human specified the full reward line with final total. |
| CRT-095 | CJ-089 | Loser bonus label after reward total display | Tier 4 | Loser-facing reward wording should stay neutral while preserving the formula. | Reward display -> loser bonus label -> result copy | Human selected `match bonus`. |
| CRT-096 | CJ-090 | PvC reward formula after PvP reward display | Tier 3 | Practice rewards affect economy pacing and should not accidentally equal competitive reward value. | PvP reward formula -> PvC reward formula -> match-wide correct count | Human clarified PvC half rewards and match-wide correct-question scope. |
| CRT-097 | CJ-091 | Voided match reward display after mode reward formulas | Tier 3 | Quit/disconnect behavior must make reward loss visible so abandoning matches is discouraged. | Quit/D-C handling -> voided result screen -> reward display / quote feedback | Human selected visible zero reward and voided-match quotes. |
| CRT-098 | CJ-092 | Voided-match quote selection after voided quote pool | Tier 4 | The quote pool needs explicit selection behavior for implementation. | Voided result quotes -> random selection -> quit/D-C copy split | Human confirmed random voided-match quote selection. |
| CRT-099 | CJ-093 | Shared voided-match quote pool after random selection | Tier 4 | Explicit quit and dropped connection could split into separate copy paths unless clarified. | Random voided quote -> shared vs split pool -> result copy | Human confirmed shared quote pool. |
| CRT-100 | CJ-094 | PvP result actions after reward and quote behavior | Tier 3 | Results screen should convert completed matches into social connection or immediate rematch. | Results screen -> Add Friend / Replay -> rematch countdown | Human confirmed Add Friend and described replay request flow. |
| CRT-101 | CJ-095 | Replay timeout after replay request flow | Tier 3 | Replay flow needs an expiry outcome and a clear navigation exit from results. | Replay request -> timeout -> Back to PvP lobby -> navigation map | Human clarified replay greys out and Back returns to PvP lobby. |
| CRT-102 | CJ-096 | Initial game tab navigation after results navigation | Tier 2 | Results Back behavior exposed the need for a broader navigation map. | Game tab -> 1P/2P -> Tutorial/Duel CPU/PvP lobby | Human clarified first fork and preserved unresolved Duel CPU roster. |
| CRT-103 | CJ-097 | Duel CPU roster after 1P navigation split | Tier 2 | Duel CPU needed distinct content from Tutorial before 1P navigation could become meaningful. | 1P -> Duel CPU -> CPU roster / unlock economy / CPU profiles | Human clarified first two CPU profiles and unlock ladder. |
| CRT-104 | CJ-098 | CPU fallback attack behavior after Maki/Kander profiles | Tier 3 | CPU profiles need behavior for the non-primary probability branch. | CPU profile -> primary behavior -> fallback attack behavior | Human clarified normal `2-3s` attack fallback. |
| CRT-105 | CJ-099 | CPU block fallback after attack fallback | Tier 3 | Defense probability needs a non-block outcome separate from attack timing fallback. | CPU block condition -> block roll -> normal attack continuation | Human clarified failed block roll means no block. |
| CRT-106 | CJ-100 | Initial Duel CPU availability after Maki/Kander behavior | Tier 3 | CPU profiles need explicit locked/unlocked state for roster progression. | Duel CPU roster -> initial availability -> unlock ladder | Human confirmed Maki and Kander are initially available. |
| CRT-107 | CJ-101 | Sequential CPU unlock ladder and Fury profile | Tier 2 | Duel CPU progression needs both coin costs and mastery gates, and Fury introduces the first locked CPU archetype. | Initial roster -> sequential unlocks -> Fury profile -> later locked CPUs | Human clarified 3000 coin final cost, successive unlocks, and Fury behavior. |
| CRT-108 | CJ-102 | Fury critical damage interpretation after Fury profile | Tier 3 | Fury critical hit affects combat damage and must not be implemented from contradictory percentage wording. | Fury critical -> concrete AP30 example -> formula wording warning | Human clarified AP30 critical should deal 90 damage while percentage wording remains inconsistent. |
| CRT-109 | CJ-103 | Fury critical formula resolution after contradiction warning | Tier 3 | The concrete damage example needed a stable implementation formula and player-facing label. | Fury critical -> `+200% DMG` -> `attackPower x 3` | Human clarified bonus wording and triple-damage formula. |
| CRT-110 | CJ-104 | Peasy profile after Fury stabilization | Tier 2 | Remaining Duel CPU roster needs distinct archetypes for progression and replay value. | Fury -> missing roster slots -> Peasy fighter 5 profile | Human defined Peasy as expert streak fighter. |
| CRT-111 | CJ-105 | Shi-eld fighter 4 profile after Peasy | Tier 2 | Fighter 5 was defined, so the preceding sequential unlock slot needed identity and behavior. | Fury -> fighter 4 -> Peasy -> final locked CPU | Human defined Shi-eld as block specialist with timing vulnerability. |
| CRT-112 | CJ-106 | Skore fighter 6 profile after Shi-eld and Peasy | Tier 2 | Final locked Duel CPU roster slot needed identity and behavior. | Fury -> Shi-eld -> Peasy -> Skore | Human defined Skore as hard-question/question-type disruption fighter. |
| CRT-113 | CJ-107 | Skore mode correction and CPU unlock chain after Skore profile | Tier 3 | Skore `?` mode risked contradicting the PvP-only `?` rule, and locked CPU progression needed exact prerequisites. | Skore profile -> PvP-only `?` preservation -> sequential unlock chain | Human removed `?` from Skore and mapped Fury -> Shi-eld -> Peasy -> Skore. |
| CRT-114 | CJ-108 | Skore answer timing after unlock chain stabilization | Tier 3 | Skore's identity needed concrete runtime timing and revenge-mode priority. | Skore profile -> revenge behavior -> non-revenge answer timing | Human clarified revenge block-punish and 0-1.5s streak timing. |
| CRT-115 | CJ-109 | Skore fallback block behavior after non-revenge timing | Tier 3 | Skore's `80%` fast-answer behavior left the remaining `20%` undefined. | Skore non-revenge timing -> fallback block -> DEFEND boundary | Human clarified unlimited no-recovery block fallback. |
| CRT-116 | CJ-110 | Skore maximum damage after fallback block behavior | Tier 3 | Skore's revenge punish needed a concrete attack-power target rather than a vague maximum-damage phrase. | Skore revenge block -> attack power target -> question-type disruption | Human clarified target attack power `30`. |
| CRT-117 | CJ-111 | Skore question-type cadence after maximum damage clarification | Tier 3 | Skore's question disruption needed trigger frequency and randomization rule. | Skore question modes -> every 3 questions -> random selection | Human clarified random switch after every 3 questions. |
| CRT-118 | CJ-112 | Duel CPU stability checkpoint after Skore cadence | Tier 2 | CPU roster was stable enough to stop descending into edge cases and return to navigation. | Duel CPU profiles -> accepted stability -> game-page navigation | Human confirmed Duel CPU profiles are stable now. |
| CRT-119 | CJ-113 | 1P navigation after CPU stability checkpoint | Tier 2 | The first game fork needed concrete `1P` page destinations before screen structure can be planned. | Game tab -> 1P Menu -> Tutorial / Duel CPU / Stats | Human clarified 1P menu, CPU selection, and stats page. |
| CRT-120 | CJ-114 | 2P menu navigation after 1P menu | Tier 2 | The multiplayer branch needed page-level structure matching the clarified 1P branch. | Game tab -> 2P Menu -> private/public room -> room lobby | Human clarified 2P menu and private/public room entry. |
| CRT-121 | CJ-115 | Room lobby/page separation after 2P menu navigation | Tier 2 | `Room lobby` was carrying both room-list and ready-room meanings, so the screen transition needed to be clarified before UI or implementation. | 2P Menu -> room list lobby -> room-ready page -> ready countdown -> match load | Human clarified that lobby shows a room list and joining opens a separate page for ready buttons. |
| CRT-122 | CJ-116 | Basic room-ready display after page separation | Tier 3 | The room-ready page was created by the lobby split, but needed a minimal visual contract before host controls and waiting states could be clarified. | room-ready page -> player-vs-player framing -> ready button placement -> countdown details | Human clarified `Player ___ VS Player ___` and middle ready button. |
| CRT-123 | CJ-117 | Room-ready waiting state after duel framing | Tier 3 | The room-ready page had a two-player display, but room creation can temporarily have only the creator present. | room creator -> waiting opponent slot -> opponent joins -> two-player ready flow | Human selected `Player ___ VS Waiting...` until opponent joins. |
| CRT-124 | CJ-118 | Host control placement after waiting-state display | Tier 3 | Host controls were already defined, but room-ready page placement needed clarification to avoid cluttering the duel-facing screen. | room-ready page -> host-options menu -> kick/remove, close/delete, rename, invite controls | Human placed host controls inside a host-options menu. |
| CRT-125 | CJ-119 | Waiting-state ready availability after host-options placement | Tier 3 | The ready button remains central, but one-player rooms needed an availability rule to prevent premature readiness. | one-player waiting state -> disabled ready button -> opponent joins -> both-player ready flow | Human selected disabled ready button. |
| CRT-126 | CJ-120 | Countdown placement after ready-button availability | Tier 3 | The countdown already existed as a start rule, but needed exact placement on the room-ready page. | both ready -> countdown above ready button -> match load | Human placed the countdown above the ready button. |
| CRT-127 | CJ-121 | Public room row content after room-ready flow | Tier 3 | The room-ready flow was clarified, leaving the lobby list entries needing enough information for players to choose rooms. | public room list -> room row/card fields -> join action -> room-ready page | Human selected room name, host/player name, player count, and `Join` button. |
| CRT-128 | CJ-122 | Expanded VS option and lobby behavior after public room rows | Tier 2 | Human expanded 2P from room list behavior into matchmaking, room lifecycle, capacity, and spectator concerns. | 2P -> VS option page -> Quick Match / lobby -> room lifecycle -> spectator viewing -> capacity validation | Human clarified new 2P behavior and flagged capacity uncertainty. |
| CRT-129 | CJ-123 | Lobby connected-player cap after capacity warning | Tier 2 | Human raised idle connected player concern; the design needed a soft protection rule without imposing an unvalidated hard cap. | lobby connections -> no fixed cap -> 10-minute idle cleanup -> later load validation | Human accepted no fixed MVP lobby-player cap and idle cleanup. |
| CRT-130 | CJ-124 | Spectator timing after lobby cap decision | Tier 3 | View Match was introduced with a viewer cap, but timing needed clarification before interaction and technical restrictions could be evaluated. | in-game room -> View option -> live spectator view -> interaction permissions | Human selected live spectator view. |
| CRT-131 | CJ-125 | Spectator interaction boundary after live view | Tier 3 | Live viewing can affect match fairness if spectators can interact, so interaction permissions needed a clear boundary. | live spectator view -> read-only mode -> spectator UI scope | Human selected read-only spectator mode. |
| CRT-132 | CJ-126 | Spectator UI scope after read-only mode | Tier 4 | Read-only spectator mode still needed to know whether it uses the full player UI or a simplified UI. | read-only spectator mode -> full player UI -> later performance optimization | Human selected same full player game UI. |
| CRT-133 | CJ-127 | Multiplayer edge-case behavior after spectator UI scope | Tier 2 | Core 2P flow was broad but needed failure-state rules for Quick Match, manual join, spectator caps, host close, and disconnects. | quick match races -> join races -> spectator failures -> host close -> mid-game D/C | Human clarified user-facing behavior for eleven edge cases. |
| CRT-134 | CJ-128 | MVP player profile data after multiplayer edge cases | Tier 2 | Player-facing systems now need a profile baseline for rewards, unlocks, stats, D/C accountability, and friends. | profile data -> match records -> stats/rewards/database handoff | Human accepted recommended MVP profile fields. |
| CRT-135 | CJ-129 | Match persistence ownership after profile baseline | Tier 2 | Profile match history needed a source-of-truth model before central match fields could be finalized. | central match record -> player match references -> match record fields -> database handoff | Human accepted central match record plus lightweight profile references. |
| CRT-136 | CJ-130 | Central match record fields after persistence ownership | Tier 2 | The central match record became source of truth, so its MVP fields needed to support results, stats, rewards, D/C audit, and handoff. | central match record -> results/stats/rewards/D-C/history -> database handoff | Human accepted recommended central match record fields. |
| CRT-137 | CJ-131 | Public pre-match profile visibility after match record fields | Tier 2 | Profile and match data existed, but pre-match public visibility needed boundaries for trust and privacy. | profile data -> public pre-match view -> D/C deterrence / privacy -> friend-list display | Human accepted lightweight identity and trust fields. |
| CRT-138 | CJ-132 | Friend list display after public pre-match visibility | Tier 2 | Friend list behavior depends on identity visibility, online presence, request state, and invite eligibility. | friend list rows -> private invites / request handling -> database handoff summary | Human accepted MVP friend list row fields and actions. |
| CRT-139 | CJ-133 | Implementation recommendation register after database/type discussion | Tier 3 | Implementation guidance was becoming useful, but needed a separate constitutional container so recommendations would not be confused with locked gameplay authority. | gameplay constitution -> implementation recommendations -> database handoff / TypeScript domain model | Human requested a constitution section for implementation recommendations and rationale. |
| CRT-140 | CJ-134 | Runtime versus persistence distinction after implementation register | Tier 3 | Human wanted to keep consolidating inside the constitution and needed explicit separation between runtime TypeScript structures, persisted database records, and derived mapper outputs. | implementation recommendations -> runtime/persistence classification -> later database or TypeScript handoff | Human asked whether the database schema, stored objects, and runtime structures had been documented. |
| CRT-141 | CJ-135 | Unresolved issue cleanup before internal event consolidation | Tier 3 | Old open flags for PVC/CPU onboarding no longer matched later clarified terrain, and webhook discussion exposed the need to name internal game events before creating handoff contracts. | unresolved cleanup -> internal game events -> later webhook/server handoff | Human agreed webhooks should come later and said to continue consolidation. |
| CRT-142 | CJ-136 | Internal game event vocabulary before webhook/server handoff | Tier 3 | Internal events needed stable names before later database, server, UI, or webhook contracts can consume them. | runtime changes -> internal events -> persistence/UI/server/webhook handoff | Human accepted the suggested internal event set. |
| CRT-143 | CJ-137 | Stats calculation after internal event vocabulary | Tier 2 | Stats connect match outcomes, rewards, profile aggregates, public trust signals, and persistence; they needed consolidation before UI/page flow or handoff artifacts. | match results -> stats formulas -> profile updates -> database/UI/handoff | Human selected stats calculation as the next route of advance. |
| CRT-144 | CJ-138 | UI/page flow after stats calculation | Tier 3 | The player journey needed one consolidated navigation map before implementation can become routes, components, scenes, and state transitions. | Game tab -> 1P/2P -> room/match/results flows -> TypeScript/Excalibur architecture | Human agreed to continue with UI/page flow mapping. |
| CRT-145 | CJ-139 | TypeScript domain architecture after UI/page flow | Tier 3 | The clarified game needed implementation-facing module boundaries that keep combat truth portable across PvP, PVC, tutorials, CPU opponents, spectators, and Excalibur scenes. | UI/page flow -> domain core -> controllers -> Excalibur/persistence boundaries | Human requested moving into TypeScript domain architecture. |
| CRT-146 | CJ-139 | Excalibur mapping after official documentation review | Tier 3 | The implementation plan needed to verify that official Excalibur concepts can carry the constitution without hallucinating scene, actor, input, UI, or animation responsibilities. | Excalibur docs -> mapping notes -> implementation boundary | Human provided docs link and requested a first pass over relevant Excalibur documentation. |
| CRT-147 | CJ-140 | Accuracy denominator clarification | Tier 3 | Accuracy feeds result screens, lifetime stats, public trust signals, and database fields; counting no-answer or unable-to-act states would distort competency and encourage guessing. | Stats rules -> profile aggregates -> persistence fields -> player-facing results | Human wanted to settle denominator behavior before moving to the next open edge. |
| CRT-148 | CJ-141 | Match question log persistence | Tier 3 | Database handoff depends on whether question-round evidence is temporary runtime data or persisted match detail; future sensemaking requires preserving this evidence under `match_id`. | Question-round resolution -> match details -> future sensemaking/audit -> database handoff | Human stated question logs should persist under Match ID details. |
| CRT-149 | CJ-142 | Database handoff artifact with rationale | Tier 3 | The database teammate needs schema recommendations plus rationale so implementation can preserve intent across SQL, ORM, migration, and deployment choices. | persistence meaning -> database schema guidance -> teammate handoff | Human asked for the database handoff document to include how and why. |
| CRT-150 | CJ-143 | Version 1 shop offerings | Tier 1 | Shop offerings affect fairness identity: identity and CPU unlocks preserve skill-first PvP, while gameplay modifiers could change consent, progression, rewards, and competitive trust. | economy -> shop offerings -> PvP fairness / CPU progression | Human asked to lock current shop offerings and hold modifiers. |
| CRT-151 | CJ-144 | Version 1 player-type thresholds | Tier 3 | Result-screen player types need stable implementation defaults, but thresholds should remain tuneable after playtesting. | result stats -> player type labels -> match record persistence | Human accepted MVP thresholds and asked for contradiction/tuning review. |
| CRT-152 | CJ-145 | Version 1 shop placement and flow | Tier 3 | Shop placement should reinforce the current scope: identity and Duel CPU progression rather than PvP advantage. | 1P menu -> shop flow -> purchases / profile updates | Human stated Shop should only appear in the 1P menu and requested recommendations. |
| CRT-153 | CJ-146 | Internal engagement analytics after modifier deferral | Tier 2 | Future modifier governance and tuning should be informed by player behavior rather than speculation. | MVP play -> engagement evidence -> tuning / future governance decisions | Human deferred modifiers and asked what engagement matrix should be captured. |
| CRT-154 | CJ-147 | Realtime server handoff after repo inspection | Tier 2 | Live multiplayer responsibilities need a teammate-facing artifact separate from database persistence and future webhooks. | repo structure -> apps/server -> realtime handoff -> capacity/server validation | Human asked to inspect the directory and create the server handoff doc. |
| CRT-155 | CJ-148 | MVP readiness checklist after database/server handoffs | Tier 2 | The project needs a concise readiness map before moving from constitutional clarification into implementation planning. | clarified ground truth -> handoff artifacts -> readiness checklist -> TypeScript/Excalibur planning | Human accepted creating the readiness checklist. |
| CRT-156 | CJ-149 | Leaderboard after MVP readiness checklist | Tier 2 | Leaderboard depends on stats/profile aggregates and is a major competitive surface, so it must be captured before implementation planning proceeds. | profile stats -> leaderboard ranking -> database query/view -> 2P UI display | Human identified leaderboard as a missed important feature and placed it in the 2P menu. |

## Warning Events

Warnings must use exact KRYSTALIZE syntax.

Allowed warning syntax:

```text
[WARNING :: CONTRADICTION]
[WARNING :: AMBIGUITY]
[WARNING :: INTENT_CHANGE_DETECTED]
[WARNING :: UNRESOLVED_DEPENDENCY]
[WARNING :: SESSION_OVERWRITE]
```

| Event ID | Date | Warning Syntax | Severity Tier | Trigger | Implications | Warning-Linked Rationale | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- |
| WE-001 | 2026-05-26 | [WARNING :: SESSION_OVERWRITE] | Tier 1 | Human selected overwrite during KRYSTALIZE RESET. | Constitutional artifacts may be replaced, unresolved semantic history may be lost, and semantic traceability continuity may break. | Required by reset overwrite governance. | Acknowledged and applied. |
| WE-002 | 2026-05-27 | [WARNING :: CONTRADICTION] | Tier 2 | CPU 1/CPU 2 retry and defeat framing conflicted with familiarisation intent. | Player-loss behavior for CPU 1 and CPU 2 must be superseded by no-player-defeat onboarding behavior. | Human clarified HP deductions are visual and player life is restored. | Superseded retry/failure framing. |
| WE-003 | 2026-05-27 | [WARNING :: INTENT_CHANGE_DETECTED] | Tier 2 | Human reconsidered CPU 1/CPU 2 no-player-defeat behavior. | No-player-defeat onboarding is superseded; CPU 1 and CPU 2 now allow player loss to create early stakes. | Human stated losing should be possible so the player feels what is at stake. | Stakes-aware replay behavior applied. |
| WE-004 | 2026-05-27 | [WARNING :: INTENT_CHANGE_DETECTED] | Tier 2 | Human reconsidered visible invite-only rooms. | Visible invite-only model is superseded by explicit public/private room choice at creation. | Human stated invite-only rooms should not be visible to public. | Public/private room creation model applied. |
| WE-005 | 2026-05-27 | [WARNING :: UNRESOLVED_DEPENDENCY] | Tier 1 | Human introduced purchasable match modifiers. | Modifier scope may affect PvP fairness, player trust, ranking, public records, reward validity, and match legitimacy. | Match-affecting purchases need governance before becoming normal PvP rules. | Preserved as unresolved dependency. |
| WE-006 | 2026-05-27 | [WARNING :: CONTRADICTION] | Tier 3 | Fury critical hit was described as `200% of 30` resulting in `90` damage. | Literal percentage math produces `60`; the concrete example produces `90`. | Human clarified the intended meaning is `+200% DMG`, equivalent to base attack plus a `200%` bonus. | Resolved; implement as `attackPower x 3` and display `+200% DMG`. |

## Reset Events

Use when KRYSTALIZE RESET is invoked.

| Reset ID | Date | Session ID | Current Artifacts | Unresolved Issues Summary | Human Selection | Warning Emitted | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RESET-001 | 2026-05-26 | KRYS-game_logic-001 | `K_GAME_PRD_1.0_CONSTITUTIONAL_STATE.md`, `K_GAME_PRD_1.0_CONSTITUTIONAL_JOURNAL.md` | Prior active frontier and unresolved issues overwritten. | overwrite | [WARNING :: SESSION_OVERWRITE] | Active session reset. |

## Intent Drift Events

| Event ID | Date | Prior Intent | New Direction | Drift Description | Human Rationale | Status |
| --- | --- | --- | --- | --- | --- | --- |
| IDE-001 | 2026-05-26 | Prior `game_logic` semantic terrain existed in active artifacts. | Reset to renewed human-intent framing. | Session lifecycle changed by overwrite. | Human selected overwrite. | accepted |

## Resolution Rationale

| ID | Item Resolved | Resolution Type | Rationale | Authority Source | Linked State Item |
| --- | --- | --- | --- | --- | --- |
| RR-001 | Current session handling | overwritten | Human selected overwrite during KRYSTALIZE RESET. | human | RESET-001 |
| RR-002 | Renewed high-level intent | clarified | Human stated the big picture after reset. | human | LT-003, LT-004 |
| RR-003 | VS identity | clarified | Human stated the game should have both PvP and PvC. | human | LT-005 |
| RR-004 | Emotional target | partially clarified | Human affirmed all proposed moment-to-moment feelings should be present and enabled by mechanics. | human | LT-006 |
| RR-005 | Basic game mechanic philosophy | partially clarified | Human described the basic loop: speed pressure, streak pursuit, revenge comeback, and defense disruption. | human | LT-007, LT-008, LT-009, LT-010 |
| RR-006 | Anti-staleness concern | deferred | Human noted the game may need something more but asked to leave it for later. | human | AU-002 |
| RR-007 | Artifact alignment with core loop | partially clarified | Existing artifact supports pressure, streak, revenge, and defense disruption. | `docs/game/GAME_LOGIC.md` | AM-001, AM-002, AM-003, AM-004 |
| RR-008 | DEFEND role | clarified | Human stated DEFEND disrupts streaks and successful DEFEND stuns opponent for 1.5s. | human | LT-015, LT-016, LT-017, LT-018 |
| RR-009 | Revenge ownership and reset | clarified | Human stated revenge gauge activates after receiving a 1.4x opponent hit and resets after correct answer or blocked revenge attack. | human | LT-019, LT-020, LT-021, LT-022 |
| RR-010 | Streak cap and attack damage source | clarified | Human capped streak multiplier at 1.4x; artifact states base damage comes from captured power bar value. | human/source artifact | LT-023, LT-024 |
| RR-011 | Attack power model | partially clarified | Human distinguished attack power from actual damage and defined capture from moving bar indicator. | human | LT-025, LT-026, LT-027, LT-028, LT-029 |
| RR-012 | Attack power start and implementation note | clarified/noted | Human corrected bar start to 1 and noted TypeScript-to-Excalibur implementation requirement. | human | LT-030, LT-031 |
| RR-013 | Attack power indicator motion | clarified | Human stated the attack-power indicator should increase linearly. | human | LT-032 |
| RR-014 | Revenge damage formula | clarified | Human stated revenge is conceptually `attackPower x 2`, visually `+100% DMG`, and begins the streak sequence rather than stacking with stronger multipliers. | human | LT-033, LT-034, LT-035 |
| RR-015 | DEFEND functions and streak reset triggers | clarified | Human stated DEFEND can be predictive, barrage-disrupting, and alternate-turn constrained; pressing DEFEND breaks the user's own streak and successful blocks, wrong answers, or opponent attacks can reset streaks. | human | LT-036, LT-037, LT-038, LT-039, LT-040 |
| RR-016 | Failed DEFEND and wrong-answer punishment | clarified | Human stated failed DEFEND resets own streak and removes block for the question round; wrong answers reset all benefit buffs and create a 1-second `MISSED!` no-action vulnerability state. | human | LT-041, LT-042, LT-043, LT-044 |
| RR-017 | `MISSED!` incoming damage behavior | clarified | Human stated incoming damage should use the normal attack formula because inability to act is punishment enough. | human | LT-045 |
| RR-018 | Fight-round lifecycle and tie condition | clarified | Human stated rounds last 60 seconds, ties are same HP at round end, same-time answers create `Additional DMG`, and 3rd-round ties initiate a Final round whose tie causes both players to lose. | human | LT-046, LT-047, LT-048, LT-049, LT-050, LT-051, LT-052, LT-053, LT-054, LT-055, LT-056, LT-057 |
| RR-019 | `Additional DMG` ownership | clarified | Human stated same-time answers should create one shared additional damage value applied to the next question round. | human | LT-058 |
| RR-020 | Shared attack power bar | clarified | Human corrected that there is one shared attack power bar from 1 to 30 over 5 seconds, and the attack goes to whoever answers first. | human | LT-059, LT-060, LT-061 |
| RR-021 | Same-time answer threshold | clarified | Human stated answers count as together when the second valid answer occurs within 0.15 seconds / 150ms of the first valid answer. | human | LT-062, LT-063 |
| RR-022 | `GAME_LOGIC.md` synchronization | updated | Human requested updating the source spec to match clarified mechanics. | human/artifact update | LT-064 |
| RR-023 | Mental-sum question modes | partially clarified | Human described spinner-selected question modes, PvP-only `?` mode, arithmetic ranges, normal/easy tiers, and comeback-sensitive easier questions. | human | LT-065, LT-066, LT-067, LT-068, LT-069, LT-070, LT-071, LT-072, LT-073, LT-074, LT-075, LT-076, LT-077, LT-078, LT-079 |
| RR-024 | Spinner scope | clarified | Human stated spinner result applies to the 60-second fight and is used again for the next fight/match segment to create variety. | human | LT-080, LT-081 |
| RR-025 | Easy-tier probability rules | clarified | Human stated easy questions are probability-based: 40% baseline, 60% for active revenge or one hit from revenge, and 65% when HP is half or less than opponent HP. | human | LT-082, LT-083, LT-084, LT-085, LT-086, LT-087 |
| RR-026 | Easy-tier addition range | clarified | Human stated easy-tier addition questions are addition sums between 1 and 15. | human | LT-088 |
| RR-027 | Normal-tier addition range | clarified | Human confirmed normal-tier addition uses the full 1 to 30 operand range. | human | LT-089 |
| RR-028 | Easy-tier subtraction range | clarified | Human stated easy-tier subtraction questions use numbers 1 to 40 and may have negative answers. | human | LT-090, LT-091 |
| RR-029 | Normal-tier subtraction range | clarified | Human confirmed normal-tier subtraction uses numbers 1 to 100 and allows negative answers. | human | LT-092, LT-093 |
| RR-030 | Mixed-mode range and difficulty source | partially clarified | Human stated both mixed-mode ranges should be 1 to 50 and difficulty should come from operation structure rather than separate ranges. | human | LT-094 |
| RR-031 | Mixed-mode three-term easy/difficult structure | clarified | Human corrected the four-number interpretation and gave examples showing difficult prompts have two 2-digit terms while easy prompts have one 2-digit term. | human | LT-095, LT-096, LT-097, LT-098 |
| RR-032 | Mixed-mode negative leading terms | clarified | Human stated it is fine for questions to start with negative numbers. | human | LT-099 |
| RR-033 | Mixed-mode operation-sign selection | clarified | Human stated mixed-mode signs should be random. | human | LT-100 |
| RR-034 | `?` mode reaction task behavior | partially clarified | Human stated the arcade-like task should appear randomly, use random sequence length, and award the attack to the first player who completes the sequence. | human | LT-101, LT-102, LT-103 |
| RR-035 | `?` mode reaction task frequency | clarified | Human stated reaction-based arcade tasks should appear 30% of the time. | human | LT-104 |
| RR-036 | `?` mode arithmetic distribution | clarified | Human stated the remaining 70% of `?` mode should split 60% mixed addition/subtraction and 40% addition of two 3-digit numbers. | human | LT-105 |
| RR-037 | `?` mode two-3-digit addition range | clarified | Human confirmed full 100 to 999 range for both operands. | human | LT-106 |
| RR-038 | PvP question contract synchronization | updated | Human confirmed synchronizing the clarified PvP question-generation rules into `GAME_LOGIC.md`. | human/artifact update | LT-107 |
| RR-039 | PVC purpose | clarified | Human stated PVC serves onboarding and practice for real-player PvP skill transfer. | human | LT-108, LT-109 |
| RR-040 | CPU 1 streak trainer purpose | partially clarified | Human stated the first CPU character should introduce the streak mechanic and that the visual is loose inspiration. | human/artifact update | LT-110, LT-111, LT-112 |
| RR-041 | CPU 1 scripted tutorial sequence | partially clarified | Human described the first CPU opponent's tutorial flow from guided attacks through shock, CPU 5-hit streak, revenge activation, revenge attack, player streak task, and task tracker. | human/artifact update | LT-113, LT-114, LT-115, LT-116, LT-117, LT-118, LT-119, LT-120 |
| RR-042 | CPU 1 post-tutorial simplified practice | clarified | Human stated CPU 1 should continue into a simplified practice fight without DEFEND. | human/artifact update | LT-121, LT-122, LT-128 |
| RR-043 | Player status display rules | clarified | Human described attack status bars and DEFEND/status space behavior for availability, success, and misses. | human/artifact update | LT-123, LT-124, LT-125, LT-126, LT-127, LT-128 |
| RR-044 | CPU 1 simplified practice resistance | clarified | Human stated CPU 1 should attack moderately enough to interrupt and reset the player's streak. | human/artifact update | LT-129, LT-130, LT-131 |
| RR-045 | CPU 1 completion criteria | clarified | Human stated CPU 1 is cleared only when the player totally defeats the CPU, and this should be shown as the screen objective. | human/artifact update | LT-132, LT-133, LT-134 |
| RR-046 | CPU 1 failure/retry handling | clarified | Human stated that if the player loses after the tutorial, they retry only the simplified practice fight. | human/artifact update | LT-135, LT-136 |
| RR-047 | PVC progression after CPU 1 | clarified | Human stated that after clearing CPU 1, the player should move on to CPU 2 immediately. | human/artifact update | LT-137, LT-138 |
| RR-048 | CPU 2 DEFEND trainer focus | partially clarified | Human stated CPU 2 should introduce DEFEND. | human/artifact update | LT-139, LT-140 |
| RR-049 | DEFEND duration and CPU 2 initial tutorial | partially clarified | Human stated DEFEND lasts 1 second and described CPU 2's first two CPU DEFEND demonstrations plus the third player DEFEND demonstration. | human/artifact update | LT-141, LT-142, LT-143, LT-144, LT-145, LT-146 |
| RR-050 | CPU 2 DEFEND follow-up curriculum | partially clarified | Human stated CPU 2 should teach cooldown/alternate-turn availability, DEFEND as streak disruption, and DEFEND as revenge-to-advantage conversion through two scripted events. | human/artifact update | LT-147, LT-148, LT-149, LT-150, LT-151 |
| RR-051 | CPU 2 DEFEND cooldown lesson method | clarified | Human stated DEFEND should be highlighted as greyed and unavailable for 1 turn. | human/artifact update | LT-152, LT-153 |
| RR-052 | CPU 2 streak-disruption event setup | partially clarified | Human stated CPU should be scripted to build a visible 3-4 hit streak before prompting player DEFEND. | human/artifact update | LT-154, LT-155 |
| RR-053 | CPU 2 revenge-advantage activation setup | partially clarified | Human stated player should receive scripted streak damage that activates the player's revenge gauge. | human/artifact update | LT-156, LT-157 |
| RR-054 | CPU 2 revenge-advantage DEFEND prompt | partially clarified | Human stated the screen should freeze after revenge activation, prompt the player to press DEFEND, and continue after DEFEND is pressed. | human/artifact update | LT-158, LT-159, LT-160 |
| RR-055 | CPU 2 revenge-advantage counterattack release | clarified | Human confirmed the next beat after DEFEND should immediately prompt answer/revenge attack release. | human/artifact update | LT-161, LT-162 |
| RR-056 | CPU 2 simplified DEFEND practice and clear condition | clarified | Human confirmed simplified DEFEND practice after scripted lessons, total defeat clear, and higher CPU streak-damage likelihood to activate player revenge. | human/artifact update | LT-163, LT-164, LT-165, LT-166 |
| RR-057 | CPU 1 and CPU 2 no-player-defeat onboarding boundary | clarified | Human clarified the player should not experience defeat in the first two CPU fights; HP deductions are visual and player life is restored. | human/artifact update | LT-167, LT-168, LT-169 |
| RR-058 | CPU 1 and CPU 2 stakes-aware replay behavior | clarified | Human restored player-loss possibility for CPU 1 and CPU 2, with skip-script replay after passing scripted sequences and menu tutorial replay. | human/artifact update | LT-170, LT-171, LT-172, LT-173, LT-174 |
| RR-059 | CPU 1/CPU 2 onboarding sufficiency and implementation intent | partially clarified | Human stated remaining features can be discovered, quit handling belongs in game-logic discussion, and logs should support TypeScript/Excalibur translation. | human/artifact update | LT-175, LT-176, LT-177, LT-178, LT-179 |
| RR-060 | PVC quit handling and PvP disconnect records | partially clarified | Human defined PVC tutorial-state behavior, PvP `D/C` record behavior, voided stats, and public disconnect stat intent. | human/artifact update | LT-180, LT-181, LT-182, LT-183, LT-184, LT-185, LT-186, LT-187, LT-188 |
| RR-061 | PvP immediate `D/C` threshold | clarified | Human stated any detected dropped PvP connection should just count as `D/C`, with no reconnection grace window. | human/artifact update | LT-189, LT-190, LT-191 |
| RR-062 | PvP explicit quit label and warning | clarified | Human stated explicit quit should have a separate label, use a quit button, warn that stats are voided, and add to `D/C` count. | human/artifact update | LT-192, LT-193, LT-194, LT-195, LT-196, LT-197 |
| RR-063 | PVC/PvP quit overlay and anti-abuse behavior | partially clarified | Human stated PVC has a quit button, quit freezes the screen, overlays block question visibility, PvP opponent sees a quit message, and repeated quit presses are logged with a 3rd-press warning. | human/artifact update | LT-198, LT-199, LT-200, LT-201, LT-202, LT-203, LT-204, LT-205 |
| RR-064 | PvP-only quit anti-abuse and future PvP room entry notes | partially clarified | Human stated repeated-quit anti-abuse applies only to PvP and noted friend invites, rooms, lobby, and joining existing rooms for later. | human/artifact update | LT-206, LT-207, LT-208, LT-209, LT-210, LT-211 |
| RR-065 | PvP quit/disconnect internal labels | clarified | Human selected separate internal labels: `QUIT_CONFIRMED` for explicit quit and `CONNECTION_DROPPED` for detected dropped connection. | human/artifact update | LT-212, LT-213, LT-214, LT-215 |
| RR-066 | PvP rooms branch selection | clarified | Human selected PvP rooms as the next clarification branch. | human/artifact update | LT-216, LT-217 |
| RR-067 | Public PvP rooms and friend request lifecycle | partially clarified | Human selected public-by-default PvP rooms, invite dropdown of online friends, and post-match friend request flow with pending/accepted/declined states. | human/artifact update | LT-218, LT-219, LT-220, LT-221, LT-222, LT-223, LT-224, LT-225, LT-226, LT-227, LT-228, LT-229 |
| RR-068 | PvP room ready/start flow | clarified | Human stated both players get ready buttons after room join; match loads after both ready and a 3-second countdown. | human/artifact update | LT-230, LT-231, LT-232, LT-233, LT-234 |
| RR-069 | PvP pre-ready room departure | clarified | Human stated the room should remain open if one player leaves before both players press ready. | human/artifact update | LT-235, LT-236, LT-237 |
| RR-070 | PvP countdown departure | clarified | Human stated countdown should cancel and remaining player should return to room if a player leaves during the 3-second countdown. | human/artifact update | LT-238, LT-239, LT-240 |
| RR-071 | PvP pre-match host transfer | clarified | Human stated room ownership should transfer to the remaining player if the creator/host leaves before match start. | human/artifact update | LT-241, LT-242, LT-243 |
| RR-072 | PvP pre-match host controls | partially clarified | Human stated host can kick/remove, close/delete, rename, and use invite-only controls before match start. | human/artifact update | LT-244, LT-245, LT-246, LT-247, LT-248, LT-249 |
| RR-073 | PvP invite-only visibility and join permissions | clarified | Human stated invite-only rooms remain visible but restrict joining to invited players. | human/artifact update | LT-250, LT-251, LT-252 |
| RR-074 | PvP public/private room creation model | clarified | Human superseded visible invite-only rooms and stated players should choose public or private when creating a room. | human/artifact update | LT-253, LT-254, LT-255, LT-256, LT-257, LT-258 |
| RR-075 | Private PvP room invite notification | clarified | Human stated invited players should receive a direct notification/invite popup. | human/artifact update | LT-259, LT-260 |
| RR-076 | Private PvP room invite popup actions | clarified | Human stated private room invite popup should include accept and decline actions. | human/artifact update | LT-261, LT-262 |
| RR-077 | Private PvP room invite accept behavior | clarified | Human stated accepting a private room invite should take the invited player directly into the room immediately. | human/artifact update | LT-263, LT-264 |
| RR-078 | Private PvP room invite decline behavior | clarified | Human stated declining a private room invite should notify the host that the invite was declined. | human/artifact update | LT-265, LT-266 |
| RR-079 | Post-match results branch selection | clarified | Human selected post-match results as the next clarification branch. | human | LT-267 |
| RR-080 | Winning results screen and economy concept | partially clarified | Human defined winning results display, performance stats, rewards, and candidate economy/shop modifiers; modifier governance remains unresolved. | human/artifact update | LT-268, LT-269, LT-270, LT-271, LT-272, LT-273, LT-274, LT-275, LT-276, LT-277 |
| RR-081 | Shop modifier scope and deferral | partially clarified | Human restricted match modifiers to PVC and explicit modifier-enabled matches, deferred them for future development, and reopened the question of alternative coin purchases. | human/artifact update | LT-278, LT-279, LT-280, LT-281 |
| RR-082 | Coin economy as identity-building | partially clarified | Human stated coins should let players build game identity through name changes, avatar unlocks, and other future identity features. | human/artifact update | LT-282, LT-283, LT-284, LT-285, LT-286, LT-287 |
| RR-083 | Name-change cost timing | partially clarified | Human stated every name change requires coins, and the first name-change prompt should occur after earnings from the first two tutorial matches. | human/artifact update | LT-288, LT-289, LT-290, LT-291 |
| RR-084 | Guaranteed first name-change affordability | clarified | Human stated the first two tutorial matches should guarantee enough coins for the player's first name change. | human/artifact update | LT-292, LT-293 |
| RR-085 | Display-name uniqueness and avatar direction | partially clarified | Human stated multiple players can share display names while hidden number IDs remain unique, and avatar direction should be friendly/cute with Excalibur resources in mind. | human/artifact update | LT-294, LT-295, LT-296, LT-297, LT-298 |
| RR-086 | Version 1 avatar format | clarified | Human selected simple unlockable icon badges for Version 1 and preserved static profile pictures and animated mascots as coin-unlockable earned items. | human/artifact update | LT-299, LT-300, LT-301, LT-302 |
| RR-087 | Game-tab team integration boundary | clarified | Human clarified that they will develop the game MVP inside the game tab, while teammates need game-related contracts for web/navigation, webhooks, and database work. | human/artifact update | LT-303, LT-304, LT-305, LT-306, LT-307 |
| RR-088 | Clarification-before-integration workflow | clarified | Human stated integration should wait while unclear game parts are ironed out in markdown, then translated to TypeScript and adapted into Excalibur. | human/artifact update | LT-308, LT-309, LT-310, LT-311 |
| RR-089 | Post-match results branch return | clarified | Human selected post-match results as the next ground-truth clarification branch. | human | LT-312 |
| RR-090 | Losing-side post-match results | partially clarified | Human stated losing results should show the same stat categories, lower earnings/coins, and generic encouraging improvement tips. | human/artifact update | LT-313, LT-314, LT-315, LT-316, LT-317, LT-318 |
| RR-091 | Post-match coin reward formula | clarified | Human stated winner coins equal correct answers times 10 plus 50, while loser coins equal correct answers times 10 plus 25. | human/artifact update | LT-319, LT-320, LT-321 |
| RR-092 | Post-match reward label and breakdown | clarified | Human superseded `earnings` and `coins earned` with `Reward`, displayed with correct-question and outcome-bonus breakdown. | human/artifact update | LT-322, LT-323, LT-324, LT-325 |
| RR-093 | Post-match result quote behavior | partially clarified | Human stated loser tips should be random from the tip pool and winner screens should include challenge quotes. | human/artifact update | LT-326, LT-327, LT-328, LT-329 |
| RR-094 | Winner challenge quote selection | clarified | Human stated winner challenge quotes can be random from the pool. | human/artifact update | LT-330, LT-331 |
| RR-095 | Reward total display format | clarified | Human specified a single reward line containing correct-question count, tick marker, coin multiplier, outcome bonus label, and final total. | human/artifact update | LT-332, LT-333, LT-334 |
| RR-096 | Loser reward bonus label | clarified | Human selected `match bonus` as the loser outcome bonus label. | human/artifact update | LT-335, LT-336 |
| RR-097 | PvC reward formula and correct-question scope | clarified | Human stated PvC grants 5 coins per correct question, 10 coin winner bonus, no loser bonus, and correct-question count is total across the whole match. | human/artifact update | LT-337, LT-338, LT-339, LT-340, LT-341, LT-342 |
| RR-098 | Voided match reward and quote behavior | partially clarified | Human stated voided matches should show `Reward: 0 coins` and include D/C deterrence quotes. | human/artifact update | LT-343, LT-344, LT-345, LT-346 |
| RR-099 | Voided-match quote selection | clarified | Human confirmed voided-match quotes should be randomly selected from the voided-match quote pool. | human/artifact update | LT-347, LT-348 |
| RR-100 | Shared voided-match quote pool | clarified | Human confirmed explicit quits and dropped connections should use the same voided-match quote pool. | human/artifact update | LT-349, LT-350 |
| RR-101 | PvP post-match Add Friend and Replay actions | partially clarified | Human confirmed Add Friend and Replay buttons, replay initiator waiting timer, shared waiting display, and 3 second countdown after both players accept. | human/artifact update | LT-351, LT-352, LT-353, LT-354, LT-355, LT-356 |
| RR-102 | Replay timeout and results navigation | clarified | Human stated replay greys out after 15 second timeout, replay becomes unavailable from that result screen, and Back returns players to the PvP lobby. | human/artifact update | LT-357, LT-358, LT-359, LT-360 |
| RR-103 | Initial game tab navigation | partially clarified | Human stated the first Game screen should offer 1P and 2P, with 1P splitting into Tutorial and Duel CPU and 2P routing to the PvP room lobby. | human/artifact update | LT-361, LT-362, LT-363, LT-364, LT-365, LT-366, LT-367, LT-368 |
| RR-104 | Duel CPU roster and Maki/Kander profiles | partially clarified | Human clarified Duel CPU as separate from Tutorial, defined two available CPU profiles, preserved four locked opponents, and gave first three unlock costs. | human/artifact update | LT-369, LT-370, LT-371, LT-372, LT-373, LT-374, LT-375, LT-376, LT-377, LT-378, LT-379, LT-380, LT-381, LT-382, LT-383 |
| RR-105 | Maki and Kander fallback attack behavior | clarified | Human stated both CPU opponents attack normally in the `2` to `3` second window outside their primary attack behavior. | human/artifact update | LT-384, LT-385, LT-386 |
| RR-106 | Maki and Kander block fallback behavior | clarified | Human confirmed failed block rolls mean the CPU does not block and continues attacking normally. | human/artifact update | LT-387, LT-388, LT-389 |
| RR-107 | Initial Duel CPU availability | clarified | Human confirmed Maki and Kander are the two initially available Duel CPU opponents. | human/artifact update | LT-390, LT-391 |
| RR-108 | Sequential Duel CPU unlocks and Fury profile | partially clarified | Human defined sequential unlock rules, completed the unlock-cost ladder, and described Fury as the first locked Avenge CPU opponent. | human/artifact update | LT-392, LT-393, LT-394, LT-395, LT-396, LT-397, LT-398, LT-399, LT-400, LT-401, LT-402, LT-403, LT-404, LT-405, LT-406 |
| RR-109 | Fury critical damage interpretation | partially clarified | Human stated Fury critical is standard revenge-style damage and gave attack power `30` resulting in `90` damage; percentage wording remains contradictory. | human/artifact update | LT-407, LT-408, LT-409, LT-410 |
| RR-110 | Fury critical damage formula resolution | clarified | Human clarified Fury critical is `+200% DMG`, meaning base attack plus a `200%` bonus, implemented as `attackPower x 3`. | human/artifact update | LT-411, LT-412, LT-413, LT-414 |
| RR-111 | Peasy fighter 5 profile | partially clarified | Human defined Peasy as fighter 5 and an expert streak CPU with fast answers, 50% block chance, streak-barrage behavior, and wrong-answer punishment. | human/artifact update | LT-415, LT-416, LT-417, LT-418, LT-419, LT-420, LT-421, LT-422 |
| RR-112 | Shi-eld fighter 4 profile | partially clarified | Human defined Shi-eld as fighter 4, a block specialist with 90% normal block chance, 2.5s timing vulnerability, and rare surprise attacks. | human/artifact update | LT-423, LT-424, LT-425, LT-426, LT-427, LT-428, LT-429, LT-430 |
| RR-113 | Skore fighter 6 profile | partially clarified | Human defined Skore as fighter 6 with question-type changing, always-hard questions, revenge after one hit, 1.2x starting attack, 200 HP, and 70% streak behavior. | human/artifact update | LT-431, LT-432, LT-433, LT-434, LT-435, LT-436, LT-437, LT-438 |
| RR-114 | Skore question-mode correction and locked CPU unlock chain | clarified | Human removed `?` mode from Skore and clarified that Shi-eld requires Fury, Peasy requires Shi-eld, and Skore requires Peasy, with coin costs still required. | human/artifact update | LT-439, LT-440, LT-441, LT-442, LT-443, LT-444 |
| RR-115 | Skore revenge behavior and answer timing | partially clarified | Human stated Skore uses revenge mode to block and score maximum damage, and otherwise answers in 0-1.5s 80% of the time to score streak damage. | human/artifact update | LT-445, LT-446, LT-447 |
| RR-116 | Skore fallback block behavior | clarified | Human stated Skore blocks in the remaining 20%, has no block recovery, and can block as many times as it wants without penalty. | human/artifact update | LT-448, LT-449, LT-450, LT-451, LT-452 |
| RR-117 | Skore maximum damage clarification | clarified | Human stated Skore's maximum-damage revenge punish means trying to score attack power `30`. | human/artifact update | LT-453, LT-454 |
| RR-118 | Skore question-type change rule | clarified | Human stated Skore changes question type randomly after every 3 questions. | human/artifact update | LT-455, LT-456 |
| RR-119 | Duel CPU stability checkpoint | clarified | Human confirmed Duel CPU profiles are stable enough now to return to game-page navigation. | human | LT-457 |
| RR-120 | 1P menu navigation and stats page | partially clarified | Human stated 1P opens a menu with Tutorial, Duel CPU, and Stats; Duel CPU opens CPU selection with locked criteria messaging; Stats shows player performance/progression stats. | human/artifact update | LT-458, LT-459, LT-460, LT-461, LT-462, LT-463, LT-464, LT-465, LT-466 |
| RR-121 | 2P menu navigation | partially clarified | Human stated 2P opens a separate menu with Start Private Room and Start Public Room, both routing to room lobby, with private rooms supporting friend-list invites. | human/artifact update | LT-467, LT-468, LT-469, LT-470, LT-471 |
| RR-122 | PvP room lobby and room-ready page separation | partially clarified | Human stated the room lobby shows a room list, and choosing a room opens a separate page where the two players press ready. | human/artifact update | LT-472, LT-473, LT-474, LT-475, LT-476 |
| RR-123 | Basic PvP room-ready page display | partially clarified | Human stated the room-ready page should show `Player ___ VS Player ___` and place the ready button in the middle. | human/artifact update | LT-477, LT-478, LT-479 |
| RR-124 | PvP room-ready waiting-state display | partially clarified | Human selected `Player ___ VS Waiting...` for the creator's one-player waiting state, replaced by the opponent name when another player joins. | human/artifact update | LT-480, LT-481, LT-482 |
| RR-125 | PvP room-ready host-options menu placement | clarified | Human stated pre-match host controls should appear inside the host-options menu. | human/artifact update | LT-483, LT-484 |
| RR-126 | PvP room-ready one-player ready availability | clarified | Human stated the ready button should be disabled while only one player is in the room-ready page. | human/artifact update | LT-485, LT-486 |
| RR-127 | PvP room-ready countdown placement | clarified | Human stated the 3-second countdown should appear above the ready button after both players press ready. | human/artifact update | LT-487, LT-488 |
| RR-128 | Public room row/card content | clarified | Human accepted MVP room-list fields: room name, host/player name, player count, and `Join` button. | human/artifact update | LT-489, LT-490, LT-491, LT-492, LT-493 |
| RR-129 | Expanded VS option page, Quick Match, lobby lifecycle, and spectator viewing | partially clarified | Human introduced Quick Match, Enter Game Lobby, 100-room cap, 2-minute waiting expiry, in-game `View` option, 10-viewer cap, and unresolved lobby-player capacity concern. | human/artifact update | LT-494, LT-495, LT-496, LT-497, LT-498, LT-499, LT-500, LT-501, LT-502, LT-503, LT-504, LT-505, LT-506, LT-507, LT-508, LT-509, LT-510, LT-511 |
| RR-130 | MVP lobby connected-player cap and idle cleanup | clarified | Human accepted no fixed connected-player cap for MVP, with idle lobby users removed after 10 minutes of inactivity. | human/artifact update | LT-512, LT-513, LT-514 |
| RR-131 | Live spectator view | clarified | Human stated spectator view should be live. | human/artifact update | LT-515, LT-516 |
| RR-132 | Read-only spectator view | clarified | Human stated spectators should not interact and View mode should be read-only. | human/artifact update | LT-517, LT-518, LT-519 |
| RR-133 | Spectator full player UI | clarified | Human stated spectators should see the same full player game UI in read-only mode. | human/artifact update | LT-520, LT-521 |
| RR-134 | Multiplayer lobby edge cases | partially clarified | Human clarified Quick Match room allocation, one-inspector rule, Back cancellation, join/full/auto-close races, viewer-cap behavior, empty lobby message, host close handling, and mid-game D/C return-to-lobby behavior. | human/artifact update | LT-522, LT-523, LT-524, LT-525, LT-526, LT-527, LT-528, LT-529, LT-530, LT-531, LT-532, LT-533, LT-534 |
| RR-135 | MVP player profile data baseline | clarified | Human accepted recommended profile fields covering identity, economy, CPU unlocks, stats, D/C accountability, and friends. | human/artifact update | LT-535, LT-536, LT-537, LT-538, LT-539, LT-540, LT-541, LT-542, LT-543, LT-544 |
| RR-136 | Match record persistence ownership | clarified | Human accepted central match records as source of truth, with player profiles storing lightweight match references. | human/artifact update | LT-545, LT-546, LT-547, LT-548, LT-549 |
| RR-137 | MVP central match record fields | clarified | Human accepted recommended identity, participant, outcome, performance, reward, disconnect/quit, and timing fields for central match records. | human/artifact update | LT-550, LT-551, LT-552, LT-553, LT-554, LT-555, LT-556, LT-557 |
| RR-138 | Public pre-match profile visibility | clarified | Human accepted lightweight public fields: display name, short ID tag, badge/avatar, matches played, win rate, D/C count/rate, and current win streak; private economy/social/history fields are hidden. | human/artifact update | LT-558, LT-559, LT-560, LT-561, LT-562, LT-563 |
| RR-139 | MVP friend list display | clarified | Human accepted friend list rows with identity, status, request state, and context-specific actions. | human/artifact update | LT-564, LT-565, LT-566, LT-567, LT-568, LT-569, LT-570, LT-571 |
| RR-140 | Implementation recommendation register | created | Human requested a constitutional section to consolidate implementation recommendations and rationale without treating them as locked gameplay rules. | human/artifact update | Implementation Recommendations And Rationale |
| RR-141 | Runtime versus persistence distinction | clarified | Human chose continued constitutional consolidation and asked for clear documentation of runtime structures, persisted objects, and mapper/derived structures. | human/artifact update | Implementation Recommendations And Rationale |
| RR-142 | Stale unresolved issue cleanup | clarified | CPU 1, CPU 2, and PVC purpose were previously marked open but are now closed based on later clarified tutorial/practice sequences. | artifact update | UI-028, UI-029, UI-038 |
| RR-143 | Webhook timing | deferred | Human accepted that webhook contract creation should happen later, after internal game events and game ground truth are consolidated. | human/artifact update | BR-010 |
| RR-144 | Internal game event vocabulary | clarified | Human accepted the suggested internal game event set as the starting vocabulary while preserving webhook/server contracts for later. | human/artifact update | Internal Game Events |
| RR-145 | Stats calculation baseline | clarified | Stats formulas are consolidated for valid completed matches, voided matches, rewards, accuracy, longest streak, profile aggregates, coin ledger derivation, and CPU defeat counts. | human/artifact update | Stats Calculation Consolidation |
| RR-146 | Forced PvP forfeit stats handling | clarified | Human accepted the recommendation that repeated quit-button abuse causes valid loss, `D/C +1`, `Reward: 0 coins`, and invalid performance stats for the offender, while the non-offender receives a valid win and normal winner reward unless abuse risk is found later. | human/artifact update | Stats Calculation Consolidation |
| RR-147 | UI/page flow consolidation | clarified | The Game tab, 1P, 2P, Quick Match, lobby, room-ready, match, spectator, and post-match result flows are consolidated as a navigation contract without changing combat authority. | human/artifact update | UI/Page Flow Map |
| RR-148 | TypeScript domain architecture | clarified | The recommended implementation architecture is a neutral two-combatant TypeScript domain core with combatant driver types, pure combat/question/reward/stat modules, Excalibur presentation boundaries, and persistence mapper boundaries. | human/artifact update | TypeScript Domain Architecture |
| RR-149 | Excalibur mapping notes | clarified | First-pass official Excalibur documentation review supports mapping the constitution to Engine, Scene, Actor, keyboard input, HTML UI, ScreenElements, Actions, Timers, Animation, Display Modes, Screen/Viewport, and Loaders while preserving domain/server boundaries. | documentation review/artifact update | Excalibur Mapping Notes |
| RR-150 | Accuracy denominator | clarified | Accuracy is calculated from correct submitted answers over submitted answer attempts. Correct and wrong submitted answers count; `MISSED!` counts because it follows a wrong submission; no-answer, timeout/no-action, stunned lockout, and DEFEND-only situations do not count unless an answer is submitted. | human/artifact update | Stats Calculation Consolidation |
| RR-151 | Match question log persistence | clarified | Detailed question logs should persist as child records under the central `match_id`, recording the question asked, which player got it correct, correctness timing, who won the question round, and winning timing. | human/artifact update | Match Question Logs |
| RR-152 | Database handoff artifact | created | `docs/game/handoff/GAME_DATABASE_HANDOFF.md` now provides SQL-first teammate guidance with table names, column guidance, types, nullability, relationships, indexes, JSONB usage, ORM guidance, migration structure, and rationale. | human/artifact update | Database Handoff |
| RR-153 | Version 1 shop offerings | clarified | The current shop appears after CPU 2 is defeated and sells repeatable `Change Duelist Name` plus one-time CPU opponent unlocks for `Fury`, `Shi-eld`, `Peasy`, and `Skore`; gameplay modifiers are held off for now. First name change costs `100` coins and later name changes cost `1000` coins each. | human/artifact update | Version 1 Shop |
| RR-154 | Version 1 player-type thresholds | clarified | MVP player-type classification uses priority order with locked defaults: Wrongster >70% wrong-answer win; Avenger largest special damage source or 3+ revenge attacks; Strategist 35% successful attacks after DEFEND/block; Streaker 4+ streak or >40% successful attacks in streak sequences; Vanilla fallback normal style. | human/artifact update | Player Type Classification |
| RR-155 | Version 1 shop placement and flow | clarified | `Shop` appears only in the `1P Menu` for Version 1 and is recommended to show coin balance, name change, CPU unlocks, lock criteria, owned states, confirmation, insufficient-coin feedback, immediate state updates, and Back to `1P Menu`. | human/artifact update | Version 1 Shop Flow |
| RR-156 | Internal engagement analytics | clarified | Future modifier governance remains deferred, and the MVP should capture internal player-linked engagement analytics through raw activity events plus summarized engagement metrics that are not shown to players by default. | human/artifact update | Internal Engagement Analytics |
| RR-157 | Realtime server handoff artifact | created | `docs/game/handoff/GAME_REALTIME_SERVER_HANDOFF.md` now maps clarified multiplayer requirements to `apps/server`, covering rooms, Quick Match, ready flow, PvP authority, spectators, D/C/quit handling, capacity, socket event sketches, persistence touchpoints, and webhook boundaries. | human/artifact update | Realtime Server Handoff |
| RR-158 | MVP readiness checklist artifact | created | `docs/game/GAME_MVP_READINESS_CHECKLIST.md` now summarizes build-ready areas, teammate handoffs, intentional deferrals, implementation cautions, and the recommended next TypeScript domain handoff artifact. | human/artifact update | MVP Readiness Checklist |
| RR-159 | MVP leaderboard | clarified | Leaderboard is PvP-only for MVP, requires at least 10 valid PvP matches, ranks players by win rate, then accuracy, then current win streak, appears in the VS option page / 2P menu, and defers PvC leaderboard for future development. | human/artifact update | Leaderboard |

## Deferred Issues

Deferred issues are not resolved. They are preserved for later review.

| ID | Issue | Reason Deferred | Impact | Revisit Trigger | Linked Warning |
| --- | --- | --- | --- | --- | --- |
| DI-001 | Deep artifact analysis of `docs/game/GAME_LOGIC.md`. | Human intent must be restated first. | Blocks renewed semantic terrain mapping. | Human answers active question. |  |
| DI-002 | Anti-staleness depth layer. | Human requested later discussion. | May affect long-term replayability. | Basic mechanics are stable enough to revisit. |  |

## Reopened Topics

Use when the human or project context reopens a previously locked, deferred, or accepted topic.

| ID | Session ID | Topic | Previous Status | Reason Reopened | Current Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| RT-001 | KRYS-game_logic-001 | `game_logic` clarification | overwritten/reset | Human selected overwrite. | active | Restarting from human-intent framing. |

## Governance Notes

Governance notes record authority-relevant context without creating new authority.

| ID | Note | Related Item | Authority Boundary | Follow-Up |
| --- | --- | --- | --- | --- |
| GN-001 | Human selected overwrite. | KRYSTALIZE RESET | Human remains final authority. | Await human intent framing. |
| GN-002 | Reset does not authorize adversarial evaluation or implementation. | `game_logic` | KRYSTALIZE remains clarification-only. | Continue with one active question. |

## Major Constitutional Shifts

Use for significant changes in project intent, philosophy, jurisdiction, accepted uncertainty, or locked truth.

| ID | Date | Shift | Previous State | New State | Rationale | Trace Links |
| --- | --- | --- | --- | --- | --- | --- |
| MCS-001 | 2026-05-26 | Active `game_logic` session overwritten. | Prior active semantic terrain. | Reset active session `KRYS-game_logic-001`. | Human selected overwrite. | RESET-001 |
| MCS-002 | 2026-05-26 | Active question moved from engine abstraction to experience meaning. | Neutral two-slot engine question. | Excitement-feeling question. | Semantic momentum preservation refinement. | CRT-004 |
| MCS-003 | 2026-05-26 | Artifact alignment review completed. | Core loop described by human but not compared to artifact. | Existing artifact mapped against pressure/streak/revenge/defense loop. | User confirmed artifact pass. | CRT-007 |
| MCS-004 | 2026-05-26 | Defense clarified as momentum reversal. | Defense was a block with underspecified skill expression. | Defense now includes stun, answer lock, initiative window, streak opportunity, and cooldown. | Human clarified DEFEND role. | CRT-008 |
| MCS-005 | 2026-05-26 | Revenge clarified as comeback gauge. | Revenge ownership was ambiguous. | Revenge belongs to player receiving opponent streak damage and activates after receiving 1.4x hit. | Human clarified revenge gauge. | CRT-009 |
| MCS-006 | 2026-05-26 | Streak multiplier capped. | Streak continuation beyond 1.4x was unresolved. | Streak multiplier caps at 1.4x; base damage source identified as power bar. | Human clarified cap and asked source question. | CRT-010 |
| MCS-007 | 2026-05-26 | Attack power separated from actual damage. | Power bar value and damage were loosely conflated. | Power bar yields attack power; streak/revenge produce actual damage. | Human clarified attack power bar. | CRT-011 |
| MCS-008 | 2026-05-26 | Attack power minimum clarified. | `-1HP` versus `1HP` was ambiguous. | Bar starts at 1; Excalibur animation constraint noted. | Human clarified start value and implementation direction. | CRT-012 |
| MCS-009 | 2026-05-26 | Attack power motion clarified. | Indicator motion was unresolved. | Indicator increases linearly from 1 to 30 over 5 seconds. | Human clarified linear motion. | CRT-013 |
| MCS-010 | 2026-05-26 | Revenge formula clarified as non-stacking comeback strike. | Revenge formula could have stacked with streak multiplier. | Revenge is `attackPower x 2`, shown as `+100% DMG`, and begins a new streak sequence. | Human clarified comeback feel and non-stacking boundary. | CRT-014 |
| MCS-011 | 2026-05-26 | DEFEND clarified as a costly multi-function defensive tool. | DEFEND timing was unresolved between prediction, reaction, and resource use. | DEFEND supports all three functions, breaks the user's own streak, and remains alternate-turn constrained. | Human clarified defense role and streak reset triggers. | CRT-015 |
| MCS-012 | 2026-05-26 | Wrong-answer punishment clarified. | Wrong answers reset streaks but did not have a full consequence state. | Wrong answers reset benefit buffs and create a 1-second `MISSED!` no-action vulnerability state. | Human clarified wrong-answer punishment. | CRT-016 |
| MCS-013 | 2026-05-26 | `MISSED!` clarified as action-lock only. | `MISSED!` vulnerability could have amplified incoming damage. | Incoming damage remains normal during `MISSED!`; inability to act is the punishment. | Human clarified fairness boundary. | CRT-017 |
| MCS-014 | 2026-05-26 | Fight-round lifecycle clarified. | Equal HP tie wording could terminate a round immediately. | Rounds last 60 seconds; ties are checked at round end; same-time answers create `Additional DMG`; Final round tie means both players lose. | Human clarified lifecycle and tie handling. | CRT-018 |
| MCS-015 | 2026-05-26 | `Additional DMG` ownership clarified. | Same-time carryover could have been per-player or shared. | `Additional DMG` is one shared value applied to the next question round. | Human clarified shared carryover. | CRT-019 |
| MCS-016 | 2026-05-26 | Attack power bar clarified as shared. | Prior clarification question assumed different player-captured attack powers. | One shared bar increments from 1 to 30; first answer claims the attack; same-time uses the shared current value. | Human corrected the assumption. | CRT-020 |
| MCS-017 | 2026-05-26 | Same-time answer threshold clarified. | Same-time answers needed a deterministic timing window. | Second valid answer within 150ms of the first valid answer counts as same-time and triggers `Additional DMG`. | Human clarified with 1.00s to 1.15s example. | CRT-021 |
| MCS-018 | 2026-05-26 | `GAME_LOGIC.md` synchronized. | Source artifact still contained outdated rules. | `GAME_LOGIC.md` now reflects stabilized combat mechanics and preserves open clarifications. | Human requested artifact update. | CRT-022 |
| MCS-019 | 2026-05-26 | Question mode system introduced. | Question generation was underspecified. | Spinner-selected modes, arithmetic ranges, difficulty tiers, comeback assistance, and PvP-only `?` mode are partially clarified. | Human described question system. | CRT-023 |
| MCS-020 | 2026-05-26 | Spinner scope clarified as fight-round-level. | Spinner could have applied per question or per fight round. | Spinner mode applies to the full 60-second fight round and rerolls for the next fight/match segment. | Human clarified variety pacing. | CRT-024 |
| MCS-021 | 2026-05-26 | Comeback difficulty changed to probability-weighted assistance. | Easier comeback questions could have been mandatory. | Easy-tier chance is 40% baseline, 60% for revenge pressure, and 65% for severe HP disadvantage. | Human clarified probability system. | CRT-025 |
| MCS-022 | 2026-05-26 | Easy-tier addition range clarified. | Easy addition tier was undefined. | Easy addition uses numbers 1 to 15. | Human clarified easy-tier addition. | CRT-026 |
| MCS-023 | 2026-05-26 | Normal-tier addition range clarified. | Normal addition tier was undefined. | Normal addition uses numbers 1 to 30. | Human confirmed normal addition range. | CRT-027 |
| MCS-024 | 2026-05-26 | Easy-tier subtraction range clarified. | Easy subtraction tier was undefined. | Easy subtraction uses numbers 1 to 40 and allows negative answers. | Human clarified easy-tier subtraction. | CRT-028 |
| MCS-025 | 2026-05-26 | Normal-tier subtraction range clarified. | Normal subtraction tier was undefined. | Normal subtraction uses numbers 1 to 100 and allows negative answers. | Human confirmed normal subtraction range. | CRT-029 |
| MCS-026 | 2026-05-27 | Mixed-mode difficulty moved from range-based to structure-based. | Mixed mode was previously described as numbers from 1 to 30 and the active question considered smaller/larger ranges. | Mixed mode uses 1 to 50; difficulty comes from prompt structure rather than operand range. | Human clarified both range and difficulty source. | CRT-030 |
| MCS-027 | 2026-05-27 | Mixed-mode prompt shape corrected to three terms. | A four-number interpretation was possible from the prior phrasing. | Difficult mixed prompts have two 2-digit terms and one 1-digit term; easy mixed prompts have one 2-digit term and two 1-digit terms. | Human corrected the interpretation with examples. | CRT-031 |
| MCS-028 | 2026-05-27 | Mixed-mode negative leading terms allowed. | Negative-leading prompts were ambiguous after the example `-6 + 28 - 3`. | Mixed-mode prompts may start with a negative number. | Human confirmed negative starts are fine. | CRT-032 |
| MCS-029 | 2026-05-27 | Mixed-mode operation signs clarified as random. | Sign selection could have been pattern-enforced. | Mixed-mode operation signs are randomly selected from `+` and `-`. | Human chose random signs. | CRT-033 |
| MCS-030 | 2026-05-27 | `?` reaction task clarified as random arcade variety. | Reaction sequence length could have scaled with comeback or difficulty state. | Reaction task appearance and sequence length are random; first completed input wins the attack. | Human clarified arcade variety intent. | CRT-034 |
| MCS-031 | 2026-05-27 | `?` reaction task frequency clarified. | Reaction task appearance was random but unweighted. | Reaction-based arcade tasks appear 30% of the time inside `?` mode. | Human set the frequency. | CRT-035 |
| MCS-032 | 2026-05-27 | `?` arithmetic distribution clarified. | Remaining `?` mode arithmetic content was unweighted. | Remaining 70% splits 60% mixed addition/subtraction and 40% two-3-digit addition. | Human set the arithmetic split. | CRT-036 |
| MCS-033 | 2026-05-27 | `?` two-3-digit addition range clarified. | 3-digit addition range could have used a narrower 3-digit subset. | Both operands use the full 100 to 999 range. | Human confirmed full range. | CRT-037 |
| MCS-034 | 2026-05-27 | PvP question contract synchronized. | Question-generation rules existed only in constitutional artifacts. | `GAME_LOGIC.md` now includes spinner modes, tiers, comeback probabilities, mixed mode, and PvP-only `?` mode. | Human confirmed synchronization. | CRT-038 |
| MCS-035 | 2026-05-27 | PVC purpose clarified as onboarding and practice. | PVC was only known as player vs computer. | PVC should teach mechanics and help players practice for real-player PvP. | Human clarified PVC purpose. | CRT-038 |
| MCS-036 | 2026-05-27 | First PVC CPU focused on streak training. | PVC purpose was clarified but no CPU opponent had a locked training focus. | CPU 1 introduces the streak mechanic and is scaffolded in `GAME_LOGIC.md`. | Human selected streak as the first CPU mechanic. | CRT-039 |
| MCS-037 | 2026-05-27 | CPU 1 became a scripted streak/revenge tutorial. | CPU 1 was only a streak trainer scaffold. | CPU 1 now has a guided tutorial sequence covering attack power, shock, CPU streak, revenge activation, revenge attack, player streak building, and task tracking. | Human provided detailed tutorial flow. | CRT-040 |
| MCS-038 | 2026-05-27 | CPU 1 continues into simplified no-DEFEND practice. | CPU 1 post-tutorial flow was unresolved. | After the scripted tutorial, CPU 1 continues as a simplified practice fight without DEFEND. | Human clarified post-tutorial flow. | CRT-041 |
| MCS-039 | 2026-05-27 | Player status display clarified. | Attack buffs and DEFEND feedback lacked display rules. | Players have attack status bars plus DEFEND/status spaces for availability, `Success!`, and `Miss!`. | Human described status bar behavior. | CRT-042 |
| MCS-040 | 2026-05-27 | CPU 1 practice gains moderate streak-interrupting pressure. | CPU 1 simplified practice resistance was unresolved. | CPU attacks moderately enough to interrupt and reset player streaks. | Human clarified resistance level. | CRT-043 |
| MCS-041 | 2026-05-27 | CPU 1 clear condition clarified as total defeat. | CPU 1 could have been cleared by tutorial completion, streak completion, or fight victory. | Player must totally defeat CPU 1, and this objective is displayed on screen. | Human clarified clear condition. | CRT-044 |
| MCS-042 | 2026-05-27 | CPU 1 retry starts from simplified practice. | Failure could have restarted the full scripted tutorial. | After losing post-tutorial, the player retries only the simplified practice fight. | Human clarified retry behavior. | CRT-045 |
| MCS-043 | 2026-05-27 | PVC progresses immediately from CPU 1 to CPU 2. | CPU 1 clear could have led to replay or immediate next trainer. | Player moves on to CPU 2 immediately after clearing CPU 1. | Human clarified progression. | CRT-046 |
| MCS-044 | 2026-05-27 | CPU 2 focused on DEFEND training. | CPU 2 mechanic identity was undefined. | CPU 2 introduces DEFEND as the next PVC training layer. | Human clarified CPU 2 focus. | CRT-047 |
| MCS-045 | 2026-05-27 | CPU 2 initial DEFEND lesson clarified. | CPU 2 had a DEFEND focus but no scripted opening lesson. | CPU 2 starts with two CPU DEFEND demonstrations, then a player DEFEND demonstration; DEFEND lasts 1 second. | Human clarified timing and opening sequence. | CRT-048 |
| MCS-046 | 2026-05-27 | CPU 2 follow-up curriculum expanded. | CPU 2 only had an initial normal-block DEFEND lesson. | CPU 2 now also teaches cooldown, streak disruption, and revenge-advantage conversion through scripted lessons. | Human clarified follow-up curriculum. | CRT-049 |
| MCS-047 | 2026-05-27 | CPU 2 cooldown lesson clarified as UI visibility. | CPU 2 needed to teach cooldown, but the teaching method was open. | DEFEND is shown greyed out and unavailable for 1 turn after use, without forcing a failed input. | Human clarified cooldown presentation. | CRT-050 |
| MCS-048 | 2026-05-27 | CPU 2 streak-disruption setup clarified. | The streak-disruption lesson existed, but the CPU threat setup was open. | CPU is scripted to build a visible 3-4 hit streak before prompting player DEFEND. | Human clarified scripted setup. | CRT-051 |
| MCS-049 | 2026-05-27 | CPU 2 revenge-advantage event starts from revenge activation. | The revenge-advantage lesson existed, but its opening condition was open. | Player receives scripted streak damage that activates the player's revenge gauge. | Human clarified activation setup. | CRT-052 |
| MCS-050 | 2026-05-27 | CPU 2 revenge-advantage event gains freeze-and-DEFEND prompt. | Revenge activation was locked, but the immediate teaching action was open. | After revenge activates, screen freezes and prompts player DEFEND; tutorial continues after DEFEND is pressed. | Human clarified DEFEND prompt. | CRT-053 |
| MCS-051 | 2026-05-27 | CPU 2 revenge-advantage event resolves into immediate revenge attack prompt. | DEFEND prompt was locked, but the counterattack release was open. | After DEFEND, tutorial immediately prompts answer/revenge attack release. | Human confirmed immediate release. | CRT-054 |
| MCS-052 | 2026-05-27 | CPU 2 gains simplified DEFEND practice and total-defeat clear. | CPU 2 scripted lessons were clarified, but post-tutorial mastery was open. | Player enters simplified DEFEND practice, must totally defeat CPU 2, and faces higher CPU streak pressure to activate revenge more often. | Human clarified practice and clear condition. | CRT-055 |
| MCS-053 | 2026-05-27 | CPU 1 and CPU 2 become no-player-defeat familiarisation encounters. | Earlier state allowed player defeat/retry framing in the first two CPU fights. | CPU 1 and CPU 2 can show HP deductions, but player life is restored and no player defeat occurs. | Human corrected onboarding intent. | CRT-056 |
| MCS-054 | 2026-05-27 | CPU 1 and CPU 2 become stakes-aware tutorial fights. | CPU 1 and CPU 2 had just been clarified as no-player-defeat familiarisation encounters. | CPU 1 and CPU 2 now allow player loss, skip scripted sequences on replay after passing them, and keep scripted tutorial replay available from the fight menu. | Human reconsidered stakes and replay flow. | CRT-057 |
| MCS-055 | 2026-05-27 | CPU 1/CPU 2 defined as sufficient basic onboarding. | It was unclear whether omitted mechanics required another trainer before PvP readiness. | Remaining mechanics may be discovered; logs are explicitly intended to support TypeScript and Excalibur implementation later. | Human clarified onboarding sufficiency and implementation intent. | CRT-058 |
| MCS-056 | 2026-05-27 | Quit/disconnect handling enters the core rules. | Quit behavior was only an open concern. | PVC quit preserves tutorial state or voids practice stats; PvP disconnects log public `D/C` while voiding match stats. | Human clarified quit/disconnect intent. | CRT-059 |
| MCS-057 | 2026-05-27 | PvP disconnects record immediate `D/C`. | PvP disconnects were logged, but threshold/grace behavior was open. | Any detected dropped PvP connection immediately counts as `D/C`; no reconnection grace window. | Human clarified strict disconnect threshold. | CRT-060 |
| MCS-058 | 2026-05-27 | PvP explicit quit gains separate label and warning. | Explicit quit and detected disconnect label semantics were open. | PvP quit uses a screen button and warning; match stats are voided and quit adds to `D/C` count. | Human clarified explicit quit flow. | CRT-061 |
| MCS-059 | 2026-05-27 | Quit button becomes a frozen overlay with anti-abuse logging. | Quit button UI behavior and repeated-press abuse prevention were open. | PVC/PvP quit freezes the screen, blocks question visibility, logs quit presses, and warns on the 3rd press that another press forfeits the game. | Human clarified quit overlay behavior. | CRT-062 |
| MCS-060 | 2026-05-27 | Quit anti-abuse scoped to PvP and PvP room ideas preserved. | Repeated-quit anti-abuse mode scope was open. | 3rd-quit warning/4th-press forfeit applies only to PvP; friend invites, rooms, lobby, and join-existing-room are noted for later PvP entry design. | Human clarified mode scope and future PvP entry thoughts. | CRT-063 |
| MCS-061 | 2026-05-27 | PvP quit/disconnect internal labels clarified. | Public `D/C` aggregation was clarified, but exact internal labels were open. | Explicit quit is `QUIT_CONFIRMED`; detected dropped connection is `CONNECTION_DROPPED`; both contribute to public `D/C`. | Human selected suggested labels. | CRT-064 |
| MCS-062 | 2026-05-27 | PvP rooms become the active clarification branch. | Next branch after quit/disconnect labels was open. | PvP room entry is active; candidate flows include friend invite, room creation, lobby visibility, and joining existing rooms. | Human selected PvP rooms. | CRT-065 |
| MCS-063 | 2026-05-27 | PvP rooms become public by default with friend invite/request lifecycle. | Room visibility and friend request behavior were unresolved. | Every PvP room appears in public lobby; invite dropdown shows online friends; post-match add friend flow supports pending, accepted, declined, and dismissal states. | Human clarified room visibility and friends flow. | CRT-066 |
| MCS-064 | 2026-05-27 | PvP rooms gain both-player ready and 3-second countdown. | Room start behavior was unresolved. | Both players receive ready buttons, both must press ready, countdown replaces ready buttons, then match page loads. | Human clarified ready/start flow. | CRT-067 |
| MCS-065 | 2026-05-27 | PvP rooms persist if a player leaves before ready. | Pre-ready room departure behavior was unresolved. | Room remains open in public lobby and another player may join. | Human clarified room persistence. | CRT-068 |
| MCS-066 | 2026-05-27 | PvP countdown cancels if a player leaves before match load. | Countdown departure behavior was unresolved. | Countdown cancels and remaining player returns to room. | Human clarified countdown departure. | CRT-069 |
| MCS-067 | 2026-05-27 | PvP rooms transfer host ownership before match start. | Host departure behavior was unresolved. | If room creator/host leaves before match start, ownership transfers to remaining player and public room stays alive. | Human clarified host transfer. | CRT-070 |
| MCS-068 | 2026-05-27 | PvP host gains pre-match room-management controls. | Host permissions were unresolved. | Host can kick/remove player, close/delete room, rename room, and use invite-only controls before match start. | Human clarified host controls. | CRT-071 |
| MCS-069 | 2026-05-27 | Invite-only rooms become visible but restricted. | Invite-only behavior could have meant hidden or restricted. | Invite-only rooms stay visible in public lobby but only invited players can join. | Human clarified invite-only semantics. | CRT-072 |
| MCS-070 | 2026-05-27 | PvP rooms split into public and private at creation. | Invite-only rooms were previously visible in public lobby. | Player chooses public/private when creating a room; public rooms appear in lobby, private rooms are hidden and invitation-only. | Human corrected room model. | CRT-073 |
| MCS-071 | 2026-05-27 | Private PvP room invites use direct notifications. | Private rooms are hidden, but invite delivery was unresolved. | Invited players receive direct notification/invite popup. | Human clarified invite delivery. | CRT-074 |
| MCS-072 | 2026-05-27 | Private PvP invite popup gains accept/decline actions. | Direct invite notification was clarified, but response behavior was open. | Invite popup includes accept and decline actions. | Human clarified response actions. | CRT-075 |
| MCS-073 | 2026-05-27 | Private PvP invite acceptance enters room immediately. | Accept action existed, but transition behavior was unresolved. | Accepting private invite takes invited player directly into the room. | Human clarified accept behavior. | CRT-076 |
| MCS-074 | 2026-05-27 | Private PvP invite decline notifies host. | Decline action existed, but feedback behavior was unresolved. | Declining private invite notifies host that invite was declined. | Human clarified decline behavior. | CRT-077 |
| MCS-075 | 2026-05-27 | Post-match results become the active branch. | PvP room rules were the active branch. | Results-page purpose, stats, grading, social follow-up, and progression are now the next clarification space. | Human selected post-match results. | CRT-078 |
| MCS-076 | 2026-05-27 | Results screen now connects victory, performance identity, and economy. | Results page was only a deferred note. | Winning screen shows `WIN!`, performance stats, player type, longest streak, earnings, coins, and an unresolved shop/modifier economy branch. | Human defined results content and introduced economy concept. | CRT-079 |
| MCS-077 | 2026-05-27 | Match modifiers are deferred out of normal PvP. | Modifier cards were an unresolved economy concept. | Modifiers are scoped to PVC and explicit modifier-enabled matches for future development; alternative coin purchases become the immediate economy question. | Human restricted scope and deferred complexity. | CRT-080 |
| MCS-078 | 2026-05-27 | Coins become identity currency. | Coins needed a purchase purpose after modifier cards were deferred. | Coins fund identity-building features, starting with name changes and avatar unlocks. | Human selected identity as the economy purpose. | CRT-081 |
| MCS-079 | 2026-05-27 | First identity upgrade follows tutorial earnings. | First name-change access was unresolved. | Every name change costs coins; after the first two tutorial matches, the player can be prompted to unlock and change their name. | Human clarified coin-gated name change timing. | CRT-082 |
| MCS-080 | 2026-05-27 | First name change becomes guaranteed after tutorials. | First name-change affordability was unresolved. | First two tutorial matches guarantee enough coins for the first name change. | Human clarified guaranteed onboarding affordability. | CRT-083 |
| MCS-081 | 2026-05-27 | Display names become non-unique while hidden IDs remain unique. | Chosen-name uniqueness was unresolved. | Multiple players may share display names; unique hidden IDs preserve identity records. | Human clarified duplicate display-name model. | CRT-084 |
| MCS-082 | 2026-05-27 | Version 1 avatar format becomes unlockable icon badges. | Avatar form was unresolved. | Version 1 uses simple unlockable icon badges; static profile pictures and animated mascots become coin-unlockable earned items. | Human clarified avatar format and reward ladder. | CRT-085 |
| MCS-083 | 2026-05-27 | Handoff focus shifts from broad MVP scope to game-tab integration contract. | Suggested artifact was a general Version 1 MVP scope. | Immediate need is a teammate-facing contract for how the game tab connects to web/navigation, webhooks, and database work. | Human clarified team responsibilities. | CRT-086 |
| MCS-084 | 2026-05-27 | Integration contract deferred behind game ground truth. | Immediate next artifact was proposed as game-tab integration contract. | Current priority is clarifying unresolved game design in markdown before TypeScript, Excalibur, and integration. | Human clarified desired workflow. | CRT-087 |
| MCS-085 | 2026-05-27 | Post-match results becomes the active ground-truth branch again. | Active branch selection was open after integration was deferred. | Post-match results is selected for continued clarification, beginning with losing-side result behavior. | Human selected post-match results. | CRT-088 |
| MCS-086 | 2026-05-27 | Losing results become a performance mirror with lower rewards and coaching. | Losing-side result screen was unresolved. | Loser sees same stat categories, lower earnings/coins, and encouraging improvement tips. | Human clarified losing-side results. | CRT-089 |
| MCS-087 | 2026-05-27 | Post-match coin formula becomes performance base plus outcome bonus. | Loser rewards were only known to be lower. | Winner coins are correct answers x 10 + 50; loser coins are correct answers x 10 + 25. | Human clarified reward formula. | CRT-090 |
| MCS-088 | 2026-05-27 | Result reward display simplified to `Reward`. | Result screen had separate `earnings` and `coins earned` labels. | Result screen uses `Reward` with formula breakdown. | Human simplified reward display. | CRT-091 |
| MCS-089 | 2026-05-27 | Post-match quotes added for both loss and win moods. | Loser tips existed but selection was unresolved; winner had no quote pool. | Loser tips are random; winner results include challenge quotes. | Human clarified post-match quote behavior. | CRT-092 |
| MCS-090 | 2026-05-27 | Winner challenge quotes become random. | Winner quote pool existed but selection behavior was unresolved. | Winner challenge quote is randomly selected from the challenge pool. | Human clarified random selection. | CRT-093 |
| MCS-091 | 2026-05-27 | Reward display now includes final total. | Reward formula existed, but final total display was unresolved. | Reward line shows formula, bonus label, and final coin total. | Human clarified exact reward display example. | CRT-094 |
| MCS-092 | 2026-05-27 | Loser reward bonus label becomes `match bonus`. | Loser reward bonus label was unresolved after winner `win bonus` example. | Losing result reward line uses neutral `match bonus` wording. | Human clarified label. | CRT-095 |
| MCS-093 | 2026-05-27 | PvC reward formula separates from PvP. | Active question asked whether PvC and PvP use the same reward model. | PvC pays 5 coins per correct question, 10 winner bonus, and no loser bonus; correct questions are counted across the whole match. | Human clarified PvC reward economy. | CRT-096 |
| MCS-094 | 2026-05-27 | Voided matches visibly show zero reward. | Voided match reward display was unresolved. | Voided results show `Reward: 0 coins` and include deterrence quotes. | Human clarified voided result feedback. | CRT-097 |
| MCS-095 | 2026-05-27 | Voided-match quotes become random. | Voided quote pool existed, but selection behavior was unresolved. | Voided result screen randomly selects from the voided-match quote pool. | Human clarified random quote selection. | CRT-098 |
| MCS-096 | 2026-05-27 | Explicit quit and dropped connection share voided quote pool. | Voided quote selection was random, but pool sharing was unresolved. | Both abandonment paths use the same voided-match quote pool. | Human clarified shared pool behavior. | CRT-099 |
| MCS-097 | 2026-05-27 | PvP results gain Add Friend and Replay actions. | Results social/rematch actions were unresolved. | PvP results include Add Friend and Replay; replay creates a 15 second waiting state and starts after both players accept with a 3 second countdown. | Human clarified social and rematch flow. | CRT-100 |
| MCS-098 | 2026-05-27 | Replay requests expire into disabled replay and Back-to-lobby flow. | Replay timeout behavior was unresolved. | Replay greys out after 15 seconds; players cannot replay from that result screen and can return to PvP lobby with Back. | Human clarified timeout and navigation exit. | CRT-101 |
| MCS-099 | 2026-05-27 | Game tab first fork becomes 1P versus 2P. | Game tab entry navigation was unresolved. | Game tab opens to 1P/2P; 1P offers Tutorial and Duel CPU; 2P enters PvP room lobby with public/private room creation. | Human clarified initial navigation. | CRT-102 |
| MCS-100 | 2026-05-27 | Duel CPU becomes a roster path with Maki and Kander. | Duel CPU content beyond tutorial opponents was unresolved. | Duel CPU starts with Maki and Kander, includes four locked opponents, and uses coin unlock costs beginning at 500, 1000, and 1500. | Human clarified first Duel CPU profiles. | CRT-103 |
| MCS-101 | 2026-05-27 | Maki and Kander gain normal attack fallback behavior. | CPU profiles had primary `70%` behavior but no fallback attack branch. | Both Maki and Kander attack normally in the `2-3s` window outside primary attack behavior. | Human clarified fallback behavior. | CRT-104 |
| MCS-102 | 2026-05-27 | Maki and Kander failed block rolls continue normal attack. | Block condition had a `70%` chance but no failed-roll behavior. | Failed block roll means no block; CPU continues attacking normally. | Human clarified block fallback. | CRT-105 |
| MCS-103 | 2026-05-27 | Maki and Kander become the initial Duel CPU roster. | Maki and Kander were defined but initial availability needed confirmation. | Maki and Kander are available from the start; four other CPU opponents remain locked. | Human confirmed initial availability. | CRT-106 |
| MCS-104 | 2026-05-27 | Fury becomes first locked Duel CPU gatekeeper. | Locked CPU ladder lacked final cost, sequential rules, and first locked opponent identity. | Unlocks are successive and require prior wins plus coins; Fury costs 500 coins and uses permanent revenge, strong blocks, and harder questions. | Human clarified Fury and unlock rules. | CRT-107 |
| MCS-105 | 2026-05-27 | Fury critical damage gains concrete AP30 outcome but formula wording remains open. | Fury critical damage wording was unresolved. | Attack power 30 critical should deal 90 damage; `200% of 30` wording is flagged as contradictory. | Human clarified intended example. | CRT-108 |
| MCS-106 | 2026-05-27 | Fury critical damage resolves to `+200% DMG`. | Fury critical had a concrete `30 -> 90` example but unresolved percentage wording. | Fury critical is implemented as `attackPower x 3` and displayed as `+200% DMG`. | Human clarified bonus wording. | CRT-109 |
| MCS-107 | 2026-05-27 | Peasy becomes fighter 5 expert streak CPU. | Remaining locked Duel CPU roster after Fury was undefined. | Peasy is fighter 5, answers in 0-1s 80% of the time, blocks 50%, and sustains streak barrages. | Human clarified Peasy profile. | CRT-110 |
| MCS-108 | 2026-05-27 | Shi-eld becomes fighter 4 block specialist. | Fighter 4 was undefined after Peasy was placed at fighter 5. | Shi-eld blocks 90%, attacks after successful blocks, has a hidden 2.5s timing vulnerability, and rarely surprise-attacks. | Human clarified Shi-eld profile. | CRT-111 |
| MCS-109 | 2026-05-27 | Skore becomes fighter 6 capstone CPU. | Final locked Duel CPU fighter was undefined. | Skore changes question types, always gives hard questions, activates revenge after one hit, starts at 1.2x attack, has 200 HP, and uses streaks 70% of the time. | Human clarified Skore profile. | CRT-112 |
| MCS-110 | 2026-05-27 | Skore loses `?` mode and CPU unlock chain stabilizes. | Skore had a possible `?` mode conflict and locked CPU prerequisites were incomplete. | Skore uses non-`?` question modes; locked progression is Fury -> Shi-eld -> Peasy -> Skore with coin costs. | Human clarified mode correction and chain. | CRT-113 |
| MCS-111 | 2026-05-27 | Skore gains revenge and non-revenge combat rhythm. | Skore answer timing was unresolved. | In revenge, Skore seeks block-into-maximum-damage; outside revenge, it answers in 0-1.5s 80% of the time for streak damage. | Human clarified Skore runtime behavior. | CRT-114 |
| MCS-112 | 2026-05-27 | Skore fallback becomes unlimited no-recovery block. | Skore's remaining 20% non-revenge behavior was unresolved. | Skore blocks, has no block recovery, and can block repeatedly without penalty as a CPU-specific rule. | Human clarified fallback behavior. | CRT-115 |
| MCS-113 | 2026-05-27 | Skore maximum damage becomes attack power `30`. | Skore's revenge-mode maximum damage target was vague. | Skore tries to score attack power `30` after block-punish setup. | Human clarified maximum damage target. | CRT-116 |
| MCS-114 | 2026-05-27 | Skore changes question type every 3 questions. | Skore's question disruption had no timing or selection rule. | Skore randomly changes among non-`?` question modes after every 3 questions. | Human clarified mode-change cadence. | CRT-117 |
| MCS-115 | 2026-05-27 | Duel CPU branch becomes stable enough for navigation. | CPU edge cases remained possible but the roster and ladder were coherent. | Duel CPU profiles are accepted as stable enough for now; active clarification returns to game-page navigation. | Human confirmed stability. | CRT-118 |
| MCS-116 | 2026-05-27 | 1P navigation gains menu, CPU select, and stats. | Game tab first fork existed, but 1P subpages were unresolved. | 1P opens a menu with Tutorial, Duel CPU, and Stats; CPU selection handles locked fighters; Stats shows core player records. | Human clarified 1P flow. | CRT-119 |
| MCS-117 | 2026-05-27 | 2P navigation gains private/public room menu. | 2P page flow was unresolved after 1P menu clarification. | 2P opens a separate menu with Start Private Room and Start Public Room; both enter room lobby, and private rooms support friend-list invites. | Human clarified 2P menu. | CRT-120 |
| MCS-118 | 2026-05-27 | PvP lobby separates from room-ready page. | Room lobby and waiting/ready-room meanings were still blended. | Room lobby shows room list; choosing a room opens a separate room-ready page where two players press ready. | Human clarified screen separation. | CRT-121 |
| MCS-119 | 2026-05-27 | Room-ready page gains duel framing. | Room-ready page existed but lacked basic visual content. | Room-ready page shows `Player ___ VS Player ___` with the ready button in the middle. | Human clarified page display. | CRT-122 |
| MCS-120 | 2026-05-27 | Room-ready page gains creator waiting state. | The one-player room-ready state had an empty opponent slot. | Creator sees `Player ___ VS Waiting...` until another player joins, then the opponent name replaces `Waiting...`. | Human confirmed waiting display. | CRT-123 |
| MCS-121 | 2026-05-27 | Host controls move into host-options menu. | Host controls existed but placement on the room-ready page was unresolved. | Pre-match host controls live inside a host-options menu. | Human clarified placement. | CRT-124 |
| MCS-122 | 2026-05-27 | Ready button becomes disabled in one-player waiting state. | The room-ready page showed a ready button before an opponent joined. | Ready button remains visible but disabled until another player joins. | Human clarified availability. | CRT-125 |
| MCS-123 | 2026-05-27 | Countdown appears above ready button. | Countdown existed but page placement was unresolved. | After both players press ready, the 3-second countdown appears above the ready button. | Human clarified placement. | CRT-126 |
| MCS-124 | 2026-05-27 | Public room rows gain MVP fields. | Room lobby had a list but no row/card content contract. | Public room rows show room name, host/player name, player count, and `Join` button. | Human accepted MVP fields. | CRT-127 |
| MCS-125 | 2026-05-28 | 2P flow expands into VS option page with Quick Match and lobby lifecycle. | 2P previously moved toward room lobby/private-public room entry. | 2P opens VS option page with Quick Match and Enter Game Lobby; lobby now has room caps, room expiry, and spectator viewing. | Human introduced expanded 2P behavior. | CRT-128 |
| MCS-126 | 2026-05-28 | MVP lobby avoids fixed player cap and adds idle cleanup. | Connected-player capacity was unresolved after room/viewer caps were introduced. | MVP lobby has no fixed connected-player cap; idle lobby users are removed after `10` minutes. | Human accepted recommendation. | CRT-129 |
| MCS-127 | 2026-05-28 | Spectator view becomes live. | View Match existed but timing behavior was unresolved. | Spectators view matches live. | Human clarified spectator timing. | CRT-130 |
| MCS-128 | 2026-05-28 | Spectator mode becomes read-only. | Live spectator view could imply interaction. | Spectators can watch live but cannot interact during the match. | Human clarified interaction boundary. | CRT-131 |
| MCS-129 | 2026-05-28 | Spectators see full player UI. | Spectator UI scope was unresolved after read-only mode. | Spectators see the same full player game UI in read-only mode. | Human clarified UI scope. | CRT-132 |
| MCS-130 | 2026-05-28 | Multiplayer edge cases gain user-facing rules. | Quick Match, Join, View, host close, and mid-game disconnect edge cases were unresolved. | Edge cases now return clear messages, prevent unstable joins, and route affected players back to lobby where needed. | Human clarified edge cases. | CRT-133 |
| MCS-131 | 2026-05-28 | MVP player profile data baseline is established. | Profile persistence was implied by stats, rewards, identity, and friends but not consolidated. | MVP profile fields now include identity, economy, progression, stats, D/C, and social request data. | Human accepted recommended baseline. | CRT-134 |
| MCS-132 | 2026-05-28 | Match records become central source of truth. | Match history could have been duplicated under each player profile. | Each match is saved once under a central `match_id`; player profiles store lightweight references. | Human accepted persistence model. | CRT-135 |
| MCS-133 | 2026-05-28 | Central match record gains MVP field set. | Central match record existed but saved fields were unresolved. | MVP match records now include identity, participants, outcome, performance, rewards, D/C/quit, and timing fields. | Human accepted recommended fields. | CRT-136 |
| MCS-134 | 2026-05-28 | Public pre-match profile becomes lightweight identity/trust view. | Public profile visibility before PvP was unresolved. | Pre-match view shows identity and trust signals while hiding economy, detailed history, friends, and unlock inventory. | Human accepted recommendation. | CRT-137 |
| MCS-135 | 2026-05-28 | Friend list gains MVP row display and actions. | Friend-list display was unresolved after profile visibility. | Friend rows show identity, availability, request status, and context-specific invite/request actions. | Human accepted recommendation. | CRT-138 |
| MCS-136 | 2026-05-28 | Implementation recommendations gain a constitutional container. | Implementation guidance was emerging inside conversation but had no stable home in the constitution. | `Implementation Recommendations And Rationale` now separates runtime, persistence, Excalibur, database, and code-organization guidance from locked gameplay rules. | Human requested a dedicated section after noting the discussion was veering into implementation. | CRT-139 |
| MCS-137 | 2026-05-28 | Runtime and persistence boundaries become explicit. | The implementation section had high-level guidance but not enough object-level distinction. | The constitution now classifies runtime-only structures, persisted records, derived views, old TypeScript type mappings, object sketches, and mapper responsibilities. | Human wanted to keep consolidating in the constitution and distinguish runtime structures from persisted data. | CRT-140 |
| MCS-138 | 2026-05-28 | Constitution cleanup moves focus toward internal game events. | Older unresolved issue statuses still showed PVC/CPU onboarding as open, and webhook discussion risked premature handoff design. | PVC/CPU onboarding stale open flags are closed; active frontier now identifies internal game events before webhook/server handoff. | Human agreed webhook work should come later and asked to continue. | CRT-141 |
| MCS-139 | 2026-05-28 | Internal game events become the bridge toward future integration. | Webhook/server work was discussed but intentionally deferred. | The constitution now records initial internal game events while preserving exact payloads and webhook/server contracts for later. | Human accepted the suggested event vocabulary. | CRT-142 |
| MCS-140 | 2026-05-28 | Stats calculation gains MVP baseline. | Stats existed as scattered result/profile/database notes. | Stats now have consolidated match-level formulas, profile aggregate rules, reward validity behavior, player-type recommendations, and preserved open edges. | Human chose stats calculation as route of advance. | CRT-143 |
| MCS-141 | 2026-05-28 | Forced PvP forfeit becomes a punitive non-performance outcome. | Forced quit-abuse forfeit was the main unresolved stats edge. | Offender gets a valid loss, `D/C +1`, zero reward, and invalid performance stats; non-offender gets valid win and normal winner reward unless later abuse risk is discovered. | Human accepted recommendation. | CRT-143 |
| MCS-142 | 2026-05-28 | UI/page flow becomes a consolidated player journey. | Navigation decisions existed across multiple branches: tutorials, Duel CPU, PvP lobby, Quick Match, spectator view, and results. | `GAME_LOGIC.md` and the constitutional state now contain a unified Game tab page-flow map from entry through results and return paths. | Human agreed to continue with UI/page flow after stats. | CRT-144 |
| MCS-143 | 2026-05-28 | TypeScript domain core becomes the implementation spine. | Implementation guidance existed as broad runtime/persistence separation and suggested code organization. | The constitution now recommends a neutral two-combatant TypeScript domain core with combatant driver types and clear Excalibur/persistence boundaries. | Human moved the route of advance into TypeScript domain architecture. | CRT-145 |
| MCS-144 | 2026-05-28 | Excalibur mapping becomes grounded in official docs. | Excalibur adaptation was a future implementation note with no source-backed mapping. | The constitution now records first-pass Excalibur mappings and source references while preserving TypeScript domain and server/database authority boundaries. | Human provided the Excalibur documentation link and requested a first-pass review. | CRT-146 |
| MCS-145 | 2026-05-28 | Accuracy becomes submitted-answer based. | Accuracy was previously described as correct answers out of questions given, with stunned/`MISSED!` treatment unresolved. | Accuracy now measures correct submitted answers over submitted answer attempts; wrong answers count, while no-answer, timeout/no-action, stunned lockout, and DEFEND-only states do not count unless an answer is submitted. | Human clarified that accuracy should reflect competency and should not punish non-answer pressure states. | CRT-147 |
| MCS-146 | 2026-05-28 | Question logs become match-scoped persisted evidence. | Detailed per-question logs were optional future data for replay, analytics, moderation, anti-cheat, or debugging. | Question logs now persist under central `match_id` details and record question asked, correctness, timing, question-round winner, and winning timing. | Human clarified future sensemaking need and storage location. | CRT-148 |
| MCS-147 | 2026-05-28 | Database handoff becomes a concrete teammate artifact. | Database guidance existed inside the constitution as recommendations and persisted object sketches. | `docs/game/handoff/GAME_DATABASE_HANDOFF.md` now packages SQL-first schema recommendations with rationale for teammate implementation. | Human emphasized that the handoff should explain both how to build and why. | CRT-149 |
| MCS-148 | 2026-05-28 | Version 1 shop narrows to identity and CPU progression. | Shop and economy were broader future concepts with candidate match modifiers and identity purchases. | Current shop offers repeatable `Change Duelist Name` and one-time CPU opponent unlocks for opponents 3-6; modifiers and other identity items are deferred. Name-change pricing is `100` coins first, then `1000` coins subsequently. | Human locked current shop offerings, held off modifiers, and clarified persistence/pricing. | CRT-150 |
| MCS-149 | 2026-05-28 | Player-type thresholds become MVP defaults. | Player-type labels existed but thresholds were recommended and playtest-dependent. | Version 1 MVP thresholds are locked with priority order and a clarified Vanilla/Streaker boundary for isolated 3-hit streaks. | Human accepted thresholds and requested contradiction/tuning review. | CRT-151 |
| MCS-150 | 2026-05-28 | Shop becomes a 1P-only Version 1 path. | Shop offerings were clarified, but placement and flow were not. | `Shop` now appears only in the `1P Menu`, with recommended purchase, lock-state, and name-change flow. | Human placed shop in 1P only and requested flow recommendations. | CRT-152 |
| MCS-151 | 2026-05-28 | Engagement analytics become internal MVP sense-making data. | Future modifier governance and deeper tuning lacked player behavior evidence. | The constitution now recommends raw player activity events and summarized player engagement metrics that are player-linked but not player-facing. | Human deferred modifier governance and asked for an engagement matrix. | CRT-153 |
| MCS-152 | 2026-05-28 | Realtime server handoff becomes a concrete teammate artifact. | Server responsibilities were discussed but not separated from database/webhook concerns. | `docs/game/handoff/GAME_REALTIME_SERVER_HANDOFF.md` now gives `apps/server` an actionable multiplayer contract while keeping database and webhook boundaries separate. | Human requested creation of the server handoff document. | CRT-154 |
| MCS-153 | 2026-05-28 | MVP readiness becomes explicitly checkable. | Clarification had produced many specs and handoff docs but no concise readiness map. | `GAME_MVP_READINESS_CHECKLIST.md` now identifies build-ready areas, teammate handoffs, intentional deferrals, and the recommended next planning artifact. | Human agreed to create the readiness checklist. | CRT-155 |
| MCS-154 | 2026-05-28 | Leaderboard becomes an MVP PvP stats surface. | MVP readiness checklist existed but leaderboard had not been captured. | Leaderboard now ranks PvP players by win rate, accuracy, and current win streak, requires at least 10 valid PvP matches, displays top 20 with paging up to 100, shows the player's own rank at the top, and appears in the VS option page / 2P menu. | Human identified leaderboard as a missing important feature and clarified PvP-only scope. | CRT-156 |

## Traceability Index

Use this section to preserve machine/human-readable traceability.

| Trace ID | Journal Entry | Related State Item | Source | Notes |
| --- | --- | --- | --- | --- |
| TR-001 | RESET-001 | W-001 | Human instruction: "yes overwrite session" | Active artifacts reset. |
