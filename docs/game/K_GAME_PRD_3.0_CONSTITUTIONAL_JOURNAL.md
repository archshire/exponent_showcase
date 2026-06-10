# K_GAME_PRD_3.0_CONSTITUTIONAL_JOURNAL

## Document Metadata

```yaml
artifact_type: constitutional_journal
protocol: KRYSTALIZE
protocol_version: 1
session_id: KRYS-game_prd_3_0-001
project_name: game_prd_3_0
source_document: docs/game/GAME_PRD_3.0.md
created_at: 2026-05-31
updated_at: 2026-06-05
status: active
```

## Table of Contents

1. [Document Metadata](#document-metadata)
2. [Initial Intent](#initial-intent)
3. [Clarification Sessions](#clarification-sessions)
4. [Clarification Rationale Tracking](#clarification-rationale-tracking)
5. [Warning Events](#warning-events)
6. [Deferred Issues](#deferred-issues)
7. [Traceability Index](#traceability-index)

## Initial Intent

### Initial Statement

PRD 3.0 should become the current MVP implementation source of truth while preserving a normal-person product explanation alongside a developer-facing backend/service architecture explanation.

### Initial Context

The human was clarifying backend architecture, service/module boundaries, PvP/PvC ownership, and the difference between product behavior sections and architecture sections. Earlier sessions explored backend microservices; the current PRD 3.0 architecture is four runtime services with an Express backend modular monolith.

## Clarification Sessions

### Session CJ-001

```yaml
session_id: CJ-001
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-05-31
participants:
  - human
  - Codex
scope: initialize PRD 3.0 constitutional state and journal
```

#### Clarification Target

Create PRD 3.0 constitutional artifacts before continuing deeper clarification.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

#### Prioritization Rationale

The human wanted to use KRYSTALIZE-style clarification before transferring decisions into PRD 3.0. This matters because PRD 3.0 is already accumulating architecture decisions, and the team needs a separate stabilization layer to avoid prematurely treating exploratory understanding as final PRD truth.

#### Traversal Layer

HOW, with dependency on WHY.

The PRD already contains many product decisions, but the relationship between normal-reader product behavior and developer-facing service ownership needed stabilization.

#### Questions Asked

##### Active Clarification Question

Should PRD 3.0 get its own constitutional state and journal before continuing?

##### Adjacent Branches Tracked Internally

- Whether PvP runtime flow is already sufficiently specified in PRD 3.0 and PRD 2.0.
- Whether PvC flow and CPU progression are already sufficiently specified in PRD 3.0 and PRD 2.0.
- Whether PRD 2.0 and its constitutional state should be checked before declaring gaps.

##### Blocked Questions

- How should section `E.iv` be renamed or reframed?
- Which service owns CPU unlock/progression display?
- How detailed should question generation become in PRD 3.0?

#### Human Responses

- The human agreed to create PRD 3.0 constitutional files.
- The human challenged the claim that PvP and PvC may lack enough information, pointing to PRD 3.0, PRD 2.0, and the PRD 2.0 constitutional state.

#### Locked Outcomes

- PRD 3.0 should have its own constitutional state and journal.
- PRD 2.0 and its constitutional state must be treated as relevant source context before declaring gaps in PvP/PvC behavior.
- There is substantial existing product-level information for PvP room flow and PvC progression.
- The remaining uncertainty is mainly service-ownership wording and implementation-readable architecture, not total absence of product behavior.

#### Remaining Unresolved Issues

- Section `E.iv` naming and role.
- Explicit relationship between section `C) VS Rooms Management Features` and section `E) Architecture Features`.
- CPU progression display ownership.
- Question generation implementation depth.
- Visual theme and animation/game-feel direction.

#### Accepted Uncertainty

- Superseded by CJ-066: Express vs Fastify is no longer open in the current PRD because the architecture names Express Backend Service / Backend Modular Monolith.
- Superseded by CJ-066: Redis is no longer a required MVP runtime container in the current PRD; backend runtime memory owns temporary coordination unless the architecture later expands.

#### Conversational Reflection Summary

The PRD 3.0 clarification process shifted from direct PRD editing into a KRYSTALIZE-style loop: clarify meaning first, lock understanding second, and only then transfer stable decisions into PRD 3.0.

### Session CJ-002

```yaml
session_id: CJ-002
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-05-31
participants:
  - human
  - Codex
scope: sync PRD 1.0 product promise into PRD 3.0
```

#### Clarification Target

Identify which high-level product questions were already answered by PRD 1.0 and transfer the stable product promise into PRD 3.0.

#### Ambiguity Severity

Tier 2 - Product north-star alignment before implementation.

#### Prioritization Rationale

The human challenged broad new clarification questions because PRD 1.0 already contained prior decisions about game identity, player feeling, CPU teaching purpose, question-generation intent, server authority, and Excalibur's presentation boundary.

#### Traversal Layer

WHY.

The team needed the normal-person purpose of PRD 3.0 restated before continuing into service ownership, runtime flow, or implementation details.

#### Questions Asked

##### Active Clarification Question

Does the proposed PRD 3.0 product promise capture the current high-level direction?

##### Adjacent Branches Tracked Internally

- How the PRD 1.0 emotional north star survives PRD 3.0 trimming.
- How PvC teaching and PvP competition should be phrased for normal readers.
- How Excalibur/animation should be described without giving presentation authority over game rules.

##### Blocked Questions

- Exact visual theme and animation style.
- Exact service interaction flow.
- Exact implementation topology.

#### Human Responses

- The human accepted the proposed product promise and asked Codex to add it.

#### Locked Outcomes

- PRD 3.0 now includes a Product Promise section before the MVP feature list.
- PRD 3.0 states that the MVP is a fast competitive mental arithmetic duel where pressure, mastery, comeback tension, and rivalry matter.
- PRD 3.0 states that PvC teaches mechanics through CPU opponents.
- PRD 3.0 states that PvP is the main competitive expression.
- PRD 3.0 states that community features support the competitive loop through friends, private challenges, and Aura ranking.
- PRD 3.0 states that animation and visual feedback should make duel moments meaningful without replacing server-owned rules.

#### Remaining Unresolved Issues

- The exact visual theme remains unresolved.
- The exact animation language for attacks, mistakes, comebacks, wins, and losses remains unresolved.
- Server/service interaction flow remains to be explained and stabilized through the human's comprehension loop.

#### Accepted Uncertainty

- The Product Promise is intentionally high-level and normal-person readable. It does not decide exact implementation details.

#### Conversational Reflection Summary

PRD 1.0 already carried the emotional and product-level spine. PRD 3.0 now preserves that spine explicitly before the MVP feature list, allowing later implementation clarification to serve the product promise rather than replace it.

### Session CJ-003

```yaml
session_id: CJ-003
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-05-31
participants:
  - human
  - Codex
scope: clarify shared question prompts across game modes
```

#### Clarification Target

Clarify whether active combatants receive the same generated question prompt during question rounds.

#### Ambiguity Severity

Tier 2 - Core gameplay fairness and question-generation contract.

#### Prioritization Rationale

Existing documentation already locked spinner modes, difficulty weighting, PvP-only `?` mode, and Question Generation Service responsibilities, but did not plainly state whether both combatants see the same prompt. This affects fairness, CPU behavior, answer validation, and runtime question state.

#### Traversal Layer

HOW.

The product feeling was already established; this clarification defines how question prompts support direct duel fairness across modes.

#### Questions Asked

##### Active Clarification Question

For PvP, should both players always receive the same question prompt at the same time?

##### Adjacent Branches Tracked Internally

- Whether PvC should follow the same prompt rule.
- How comeback difficulty works when both combatants share a prompt.
- How CPU behavior uses the same prompt without becoming a separate question generator.

##### Blocked Questions

- How easy/difficult probability is selected when combatants have different comeback states.
- Whether CPU-specific difficulty overrides normal difficulty rules.
- Whether server authority changes the player-facing spinner concept.

#### Human Responses

- The human clarified that in all game modes, players receive the same question.

#### Locked Outcomes

- All game modes use the same generated question prompt for both active combatants in each question round.
- In PvP, both players race to answer the same prompt.
- In PvC, the human player and CPU opponent use the same prompt.
- CPU behavior controls CPU timing/actions; CPU does not receive a separate prompt.

#### Remaining Unresolved Issues

- Difficulty selection still needs clarification when player-specific comeback conditions differ but the prompt is shared.
- CPU-specific difficulty behavior still needs clarification where CPU profiles imply harder or adaptive questions.
- The exact authority of the spinner in PvP should be reframed around server/runtime ownership while preserving player-facing spinner presentation.

#### Accepted Uncertainty

- The same-prompt rule is now stable, but difficulty weighting over shared prompts remains open.

#### Conversational Reflection Summary

This clarification keeps the duel fair and legible: combatants are not fighting different questions. Speed, answer timing, CPU behavior, and combat mechanics determine who wins the question round.

### Session CJ-004

```yaml
session_id: CJ-004
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-05-31
participants:
  - human
  - Codex
scope: clarify comeback-based easy chance with shared prompts
```

#### Clarification Target

Clarify how comeback-based easy question probability works when both combatants receive the same prompt.

#### Ambiguity Severity

Tier 2 - Fairness and comeback pacing.

#### Prioritization Rationale

Once shared prompts were locked, immediate player-specific easy chance became unstable: if the prompt is shared, an easy prompt generated for the disadvantaged player could also help the advantaged opponent.

#### Traversal Layer

HOW.

This clarification preserves the WHY of comeback tension while keeping shared-question fairness intact.

#### Questions Asked

##### Active Clarification Question

Should comeback-based easy chance affect the shared prompt for both players, or should it be changed so the opponent cannot benefit from the disadvantaged player's comeback state?

##### Adjacent Branches Tracked Internally

- Whether the easy chance affects the current prompt or next prompt.
- Whether wrong answers or no-answer states should activate comeback assistance.
- Whether revenge-state benefits can be stolen by the advantaged player.

##### Blocked Questions

- Exact runtime flag/state name for armed comeback easy chance.
- Exact interaction with CPU-specific hard-question overrides.

#### Human Responses

- The human clarified that comeback-based easy chance activates only if the disadvantaged/revenge player answers correctly.
- The human confirmed that this should apply to the next shared prompt.
- The human clarified that wrong answers or failure to answer in time should not activate the chance, because otherwise the other player could take advantage of it.

#### Locked Outcomes

- Comeback-based easy chance is not applied immediately just because one player is disadvantaged.
- Comeback-based easy chance is armed only when the disadvantaged player or revenge-state player correctly answers and wins the current exchange.
- If armed, comeback-based easy chance applies to the next shared prompt.
- If that player answers wrongly, does not answer in time, or loses the exchange, comeback-based easy chance is not armed.
- This prevents the opponent from receiving the disadvantaged player's comeback benefit.

#### Remaining Unresolved Issues

- CPU-specific hard/easy overrides still need clarification against the general comeback rule.
- Exact runtime field naming is deferred to implementation.

#### Accepted Uncertainty

- The rule is product/logical. Exact service payloads, reducer actions, or data structures are not decided here.

#### Conversational Reflection Summary

The comeback rule now respects the shared-prompt rule. Comeback help is earned into the next exchange by the disadvantaged player succeeding, rather than passively handed to both combatants.

### Session CJ-005

```yaml
session_id: CJ-005
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-05-31
participants:
  - human
  - Codex
scope: restore inherited CPU-specific question rules into PRD 3.0
```

#### Clarification Target

Check whether CPU-specific question pressure rules were already locked in prior documentation and should be restored into PRD 3.0.

#### Ambiguity Severity

Tier 2 - PRD synchronization gap.

#### Prioritization Rationale

PRD 1.0 and its constitutional state contained more specific CPU question behavior than PRD 3.0's shortened CPU profile table. Restoring the accepted rules prevents PRD 3.0 from accidentally weakening established CPU identity and question-pressure design.

#### Traversal Layer

WHAT, sourced from prior WHY/HOW.

The CPU identities were already clarified; PRD 3.0 needed to carry the relevant MVP-facing details forward.

#### Questions Asked

##### Active Clarification Question

Should PRD 3.0 restore Fury and Skore's PRD 1.0 locked CPU question rules?

##### Adjacent Branches Tracked Internally

- Whether Fury's hard-question percentage survived PRD 3.0 trimming.
- Whether Skore's mode-changing rule excludes PvP-only `?` mode.
- Whether Skore's "hard questions" means always hard.

##### Blocked Questions

- Exact precedence between CPU-specific hard-question rules and comeback-based easy chance.

#### Human Responses

- The human confirmed that the proposed Fury and Skore CPU question rules are all correct.

#### Locked Outcomes

- Fury has hard questions 60% of the time.
- Skore always uses hard questions.
- Skore changes question type every 3 questions among addition, subtraction, and mixed addition/subtraction.
- Skore does not use PvP-only `?` mode.
- PRD 3.0 now carries these CPU question rules in the CPU opponent profile table.

#### Remaining Unresolved Issues

- The precedence between CPU-specific hard-question rules and comeback-based easy chance still needs explicit clarification.

#### Accepted Uncertainty

- Exact CPU tuning beyond the restored MVP descriptions remains deferred to implementation/playtesting.

#### Conversational Reflection Summary

This was a synchronization correction, not a new design branch. PRD 3.0 had compressed CPU profiles too aggressively, and the restored details preserve previously clarified CPU identity.

### Session CJ-006

```yaml
session_id: CJ-006
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-05-31
participants:
  - human
  - Codex
scope: clarify precedence between comeback easy chance and CPU hard-question rules
```

#### Clarification Target

Clarify which rule wins when armed comeback-based easy chance conflicts with CPU-specific hard-question behavior.

#### Ambiguity Severity

Tier 2 - Rule precedence and player comeback fairness.

#### Prioritization Rationale

Fury and Skore apply CPU-specific hard-question pressure, while comeback-based easy chance exists to support a disadvantaged player's recovery. After both rules were restored/clarified, their precedence needed one explicit rule.

#### Traversal Layer

HOW.

This determines how two already accepted game-feel mechanisms interact: CPU difficulty pressure and comeback assistance.

#### Questions Asked

##### Active Clarification Question

When CPU-specific hard-question behavior conflicts with armed comeback easy chance, which wins?

##### Adjacent Branches Tracked Internally

- Whether Skore can remain always-hard even against earned comeback assistance.
- Whether Fury's hard-question percentage can suppress earned comeback assistance.

##### Blocked Questions

- Exact runtime implementation of the precedence check.

#### Human Responses

- The human clarified that easy chance wins.

#### Locked Outcomes

- Armed comeback-based easy chance takes priority over CPU-specific hard-question rules for the next shared prompt.
- Comeback pacing wins over CPU difficulty pressure when the comeback benefit has been earned/armed.

#### Remaining Unresolved Issues

- Exact runtime implementation naming remains deferred.

#### Accepted Uncertainty

- This precedence rule does not decide exact randomization implementation or test fixtures.

#### Conversational Reflection Summary

CPU pressure remains meaningful, but an earned comeback opportunity should not be cancelled by Fury or Skore's hard-question identity.

### Session CJ-007

```yaml
session_id: CJ-007
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-05-31
participants:
  - human
  - Codex
scope: clarify question-mode spinner as backend selection
```

#### Clarification Target

Clarify whether old "CPU spins the question-mode spinner" language means a visible player-facing spinner or backend question-mode selection.

#### Ambiguity Severity

Tier 3 - Presentation versus backend/runtime behavior.

#### Prioritization Rationale

PRD 1.0 used spinner language, while PRD 3.0 now emphasizes backend/runtime ownership. The wording could incorrectly imply a required visible spinner UI or animation.

#### Traversal Layer

HOW.

This preserves question-mode variety while removing unnecessary presentation requirements from MVP.

#### Questions Asked

##### Active Clarification Question

Is "CPU spinning" player-facing presentation, or does it mean backend question-mode selection/cycling?

##### Adjacent Branches Tracked Internally

- Whether players must see a spinner animation.
- Whether question-mode selection belongs to backend/runtime logic.
- Whether generated question prompt is sufficient player-facing output for MVP.

##### Blocked Questions

- Exact runtime API or event name for question-mode selection.

#### Human Responses

- The human clarified that CPU spinning means the backend cycles between question types.
- The human clarified that players only see the question, not a spinning animation.

#### Locked Outcomes

- At the start of each fight round, the backend selects the question mode.
- "CPU spinning" means backend question-mode selection/cycling between question types.
- For MVP, players only need to see the generated question prompt.
- A visible spinning animation or spinner UI is not required for MVP.

#### Remaining Unresolved Issues

- Exact runtime event/function naming is deferred.

#### Accepted Uncertainty

- A visual spinner animation may be added later as polish, but it is not required by PRD 3.0 MVP.

#### Conversational Reflection Summary

Question-mode variety remains part of the game, but spinner presentation is removed from MVP requirements. The player-facing object is the question prompt, while backend/runtime logic owns the mode selection.

### Session CJ-008

```yaml
session_id: CJ-008
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-05-31
participants:
  - human
  - Codex
scope: clarify traceability code and PRD update workflow
```

#### Clarification Target

Clarify where traceability codes should appear and when PRD 3.0 should be updated.

#### Ambiguity Severity

Tier 2 - Documentation workflow and reader clarity.

#### Prioritization Rationale

The human wanted the normal PRD to remain readable without mysterious constitutional codes, while still keeping traceability inside the state and journal.

#### Traversal Layer

HOW.

This governs the process for future clarification and PRD transfer.

#### Questions Asked

##### Active Clarification Question

Why use labels such as `PRD30-LT-017` and `CJ-007`?

##### Adjacent Branches Tracked Internally

- Whether codes should appear in PRD 3.0.
- Whether future PRD updates should happen immediately or only after state stabilization.

##### Blocked Questions

- None.

#### Human Responses

- The human clarified that codes should be used in the journal/state.
- The human clarified that the normal PRD should use plain language and avoid mysterious terms.
- The human clarified that PRD 3.0 should not be updated until the relevant state is stabilized.

#### Locked Outcomes

- Traceability codes belong in constitutional state and journal files.
- PRD 3.0 should remain plain-language for normal readers.
- Future PRD 3.0 edits should wait until the relevant constitutional state is stabilized.
- Stable decisions should be transferred into PRD 3.0 in plain language after stabilization.

#### Remaining Unresolved Issues

- None for this workflow point.

#### Accepted Uncertainty

- Prior PRD edits made during this session remain accepted unless reopened; the workflow applies going forward.

#### Conversational Reflection Summary

The documentation workflow is now clearer: KRYSTALIZE state/journal carries reasoning traceability, while PRD 3.0 remains the reader-facing source of truth once decisions are stable.

### Session CJ-009

```yaml
session_id: CJ-009
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-05-31
participants:
  - human
  - Codex
scope: clarify fight-round question type and difficulty selection model
```

#### Clarification Target

Clarify whether question type and difficulty are selected per question prompt or once before each 60-second fight round, and clarify the player-facing prep sequence.

#### Ambiguity Severity

Tier 2 - Core round pacing and question generation model.

#### Prioritization Rationale

The prior docs selected a mode for the fight round, but the difficulty model was being reconsidered. The human clarified that MVP should stay simple: one type selection and one difficulty selection before each fight round.

#### Traversal Layer

HOW.

This defines how replayability and round variety are created without overcomplicating every individual prompt.

#### Questions Asked

##### Active Clarification Question

Does "each round" mean each question round or each 60-second fight round?

##### Adjacent Branches Tracked Internally

- Whether spinner presentation is required after the earlier backend-only interpretation.
- Whether Easy/Medium/Hard replaces the old Easy/Normal model.
- Whether type and difficulty apply for the whole fight round.

##### Blocked Questions

- Normal PvC type-selection percentages after removing PvP-only `?` mode.
- Exact Easy/Medium/Hard generator definitions for addition, subtraction, and mixed.

#### Human Responses

- The human clarified that type and difficulty are selected once for each 60-second fight round.
- The human clarified that MVP should keep this simple for now.
- The human clarified that the player should see a spinner animation before each fight round.
- The human clarified the prep sequence: 1 second type spin/result, 1 second difficulty spin/result, then 1 second Ready/Go, for 3 seconds total.

#### Locked Outcomes

- Each 60-second fight round has one backend question-type selection and one backend difficulty selection.
- The selected type and difficulty apply to that fight round.
- MVP round prep includes a player-facing spinner sequence before the fight round starts.
- Round prep lasts 3 seconds total: type spin/result, difficulty spin/result, Ready/Go.
- The earlier "no spinner UI required" interpretation is superseded.
- Difficulty tiers are Easy, Medium, and Hard, each with 33% chance before special overrides.

#### Remaining Unresolved Issues

- Normal PvC type-selection percentages were later clarified in CJ-010.
- Easy/Medium/Hard generator definitions were later clarified across CJ-010, CJ-011, and CJ-013.
- Interaction between the new Easy/Medium/Hard model and the previously defined comeback-based easy chance needs cleanup.

#### Accepted Uncertainty

- Exact animation style is deferred to visual/game-feel clarification.

#### Conversational Reflection Summary

The question-generation model is now round-level rather than prompt-level. The backend still owns the selection, but the player sees a short, concrete prep moment that communicates the round's type and difficulty before combat begins.

### Session CJ-010

```yaml
session_id: CJ-010
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-05-31
participants:
  - human
  - Codex
scope: clarify PvC type percentages and first Easy/Medium/Hard generator tiers
```

#### Clarification Target

Clarify normal PvC question-type selection and stabilize the first pass of Easy, Medium, and Hard generator tiers for addition, subtraction, and PvP `?` mode.

#### Ambiguity Severity

Tier 2 - Question-generation contract and comeback mapping.

#### Prioritization Rationale

After the two-spin model was accepted, the generator needed concrete tier definitions so the type/difficulty result can map to an actual prompt family. The old easy-question comeback behavior also needed to map cleanly into the new Easy/Medium/Hard model.

#### Traversal Layer

HOW.

This defines how selected type and difficulty become generated prompts.

#### Questions Asked

##### Active Clarification Question

What examples/ranges should Easy, Medium, and Hard use for addition, subtraction, mixed, and `?` mode?

##### Adjacent Branches Tracked Internally

- Whether existing easy questions continue to represent comeback assistance.
- Whether PvC type selection should be equal after excluding `?`.
- Whether `?` mode should use difficulty-aware reaction lengths and arithmetic ranges.

##### Blocked Questions

- Final mixed Easy/Medium/Hard tier definitions. Clarified later in CJ-011.
- Final transfer of the stabilized model into PRD 3.0 plain language.

#### Human Responses

- The human clarified that normal PvC type selection is 33% each across addition, subtraction, and mixed.
- The human clarified that Easy mode is where the existing comeback easy-question behavior applies after revenge mode is activated and answered.
- The human accepted the recommended `?` mode difficulty approach.
- The human modified addition tiers to Easy `1-20`, Medium `11-50`, and Hard using one 2-digit operand plus one 3-digit operand, interchangeable.
- The human modified subtraction tiers to Easy `1-50`, Medium unchanged, and Hard using one 2-digit operand plus one 3-digit operand, interchangeable.

#### Locked Outcomes

- Normal PvC type selection uses equal 33% chances across addition, subtraction, and mixed addition/subtraction.
- PvC excludes PvP-only `?` mode.
- Addition Easy uses operands `1-20`.
- Addition Medium uses operands `11-50`.
- Addition Hard uses one operand from `11-99` and one operand from `100-999`, interchangeable.
- Subtraction Easy uses operands `1-50`.
- Subtraction Medium remains `1-100`.
- Subtraction Hard uses one operand from `11-99` and one operand from `100-999`, interchangeable.
- Negative subtraction answers remain allowed.
- The old comeback easy-question concept maps to the new Easy tier.
- PvP `?` mode difficulty recommendation is accepted.

#### Remaining Unresolved Issues

- Mixed Easy/Medium/Hard generator tier definitions were later confirmed in CJ-011.
- The exact `?` mode 3-digit addition subranges for Easy/Medium were finalized in CJ-013.
- The finalized state still needs transfer into PRD 3.0 in plain language after stabilization.

#### Accepted Uncertainty

- Exact implementation function names, randomization helpers, and test fixtures are deferred.

#### Conversational Reflection Summary

The question generator is moving from broad mode names into concrete generator families. Addition and subtraction now have clearer three-tier ranges, while Easy mode inherits the previous comeback-assistance meaning.

### Session CJ-011

```yaml
session_id: CJ-011
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-01
participants:
  - human
  - Codex
scope: clarify Mixed Easy/Medium/Hard generator tiers
```

#### Clarification Target

Clarify the Easy, Medium, and Hard generator tiers for mixed addition/subtraction prompts.

#### Ambiguity Severity

Tier 2 - Question-generation contract.

#### Prioritization Rationale

Addition and subtraction tiers had been clarified, but mixed mode still needed a three-tier model that preserved prior locked rules while adding a Hard tier.

#### Traversal Layer

HOW.

This completes the first pass of generator tier definitions across the three normal arithmetic question types.

#### Questions Asked

##### Active Clarification Question

Should mixed Easy use one 2-digit term and two 1-digit terms, mixed Medium use two 2-digit terms and one 1-digit term, and mixed Hard use three 2-digit terms?

##### Adjacent Branches Tracked Internally

- Whether old mixed Easy remains unchanged.
- Whether old mixed Difficult becomes the new Medium tier.
- Whether new Hard should use three 2-digit terms.

##### Blocked Questions

- Final transfer of the stabilized question-generation model into PRD 3.0 plain language.

#### Human Responses

- The human accepted the recommended Mixed Easy/Medium/Hard tier model.

#### Locked Outcomes

- Mixed prompts remain three-term chained arithmetic.
- Mixed operation signs remain random.
- Mixed prompts may start with a negative number.
- Mixed Easy uses one 2-digit term and two 1-digit terms.
- Mixed Medium uses two 2-digit terms and one 1-digit term.
- Mixed Hard uses three 2-digit terms.

#### Remaining Unresolved Issues

- Final PRD 3.0 transfer remains pending until the question-generation state is considered stable.
- The exact `?` mode 3-digit addition Easy/Medium subranges were finalized in CJ-013.

#### Accepted Uncertainty

- Exact implementation function names and test cases are deferred.

#### Conversational Reflection Summary

Mixed mode now has a clean three-tier structure that preserves earlier easy/difficult thinking while fitting the new Easy/Medium/Hard system.

### Session CJ-012

```yaml
session_id: CJ-012
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-01
participants:
  - human
  - Codex
scope: capture normal PvP question-type percentages
```

#### Clarification Target

Capture the normal PvP backend question-type selection percentages that the human had already supplied during the two-spin clarification.

#### Ambiguity Severity

Tier 2 - Question-type selection contract.

#### Prioritization Rationale

The human clarified PvP type percentages before the later PvC and generator-tier work. The state had captured PvC type percentages but had not yet recorded the already-provided PvP percentages.

#### Traversal Layer

HOW.

This completes the top-level type-selection percentages for normal PvP.

#### Questions Asked

##### Active Clarification Question

No new question. This session records an already supplied clarification.

##### Adjacent Branches Tracked Internally

- Relationship between backend type selection and player-facing type spinner result.
- PvP-only inclusion of `?` mode.

##### Blocked Questions

- Final exact `?` mode Easy/Medium 3-digit addition subranges.
- Final exact `?` mode Easy/Medium 3-digit addition subranges. Clarified later in CJ-013.

#### Human Responses

- The human had clarified that normal PvP type chances are addition 30%, subtraction 30%, mixed 25%, and `?` 15%.

#### Locked Outcomes

- Normal PvP type selection uses addition 30%.
- Normal PvP type selection uses subtraction 30%.
- Normal PvP type selection uses mixed addition/subtraction 25%.
- Normal PvP type selection uses PvP-only `?` mode 15%.
- Backend selection is reflected to the player through the type spinner result.

#### Remaining Unresolved Issues

- Final exact `?` mode Easy/Medium 3-digit addition subranges were clarified later in CJ-013.
- Final exact `?` mode Easy/Medium 3-digit addition subranges were clarified later in CJ-013.

#### Accepted Uncertainty

- None for top-level PvP type percentages.

#### Conversational Reflection Summary

Normal PvP now has explicit type weights, while normal PvC has equal non-`?` weights. This gives the backend enough top-level mode distribution for both main match types.

### Session CJ-013

```yaml
session_id: CJ-013
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-01
participants:
  - human
  - Codex
scope: finalize PvP question-mark mode difficulty subranges
```

#### Clarification Target

Finalize the Easy, Medium, and Hard behavior for PvP `?` mode.

#### Ambiguity Severity

Tier 2 - PvP special-mode generator contract.

#### Prioritization Rationale

The `?` mode recommendation had been accepted but not fully finalized. Exact reaction lengths and 3-digit addition ranges should be stable before PRD transfer.

#### Traversal Layer

HOW.

This defines how selected difficulty affects the `?` mode's internal subtype generators.

#### Questions Asked

##### Active Clarification Question

Should the accepted `?` mode recommendation become final?

##### Adjacent Branches Tracked Internally

- Reaction sequence length by difficulty.
- Mixed subtype difficulty reuse.
- 3-digit addition operand range by difficulty.

##### Blocked Questions

- None for `?` mode difficulty subranges.

#### Human Responses

- The human confirmed to use Codex's recommendation.

#### Locked Outcomes

- Easy `?` uses reaction sequence length 4-5.
- Easy `?` uses Easy mixed rules when the internal subtype is mixed.
- Easy `?` uses 3-digit addition operands from `100-399`.
- Medium `?` uses reaction sequence length 6-7.
- Medium `?` uses Medium mixed rules when the internal subtype is mixed.
- Medium `?` uses 3-digit addition operands from `100-699`.
- Hard `?` uses reaction sequence length 8-9.
- Hard `?` uses Hard mixed rules when the internal subtype is mixed.
- Hard `?` uses 3-digit addition operands from `100-999`.

#### Remaining Unresolved Issues

- None for `?` mode difficulty subranges.

#### Accepted Uncertainty

- Exact implementation helpers and tests are deferred.

#### Conversational Reflection Summary

PvP `?` mode now has a complete difficulty-aware subtype model that preserves surprise while still respecting the selected Easy/Medium/Hard tier.

### Session CJ-014

```yaml
session_id: CJ-014
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-01
participants:
  - human
  - Codex
scope: transfer stabilized question-generation rules into PRD 3.0
```

#### Clarification Target

Transfer the stabilized question-generation state into `GAME_PRD_3.0.md` in plain language.

#### Ambiguity Severity

Tier 2 - Source-of-truth synchronization.

#### Prioritization Rationale

The question-generation rules had stabilized across CJ-003 through CJ-013, and the human asked to transfer them into PRD 3.0 before moving to the next high-level clarification branch.

#### Traversal Layer

WHAT.

This converts stabilized constitutional state into reader-facing PRD requirements.

#### Questions Asked

##### Active Clarification Question

Should the stabilized question-generation rules be transferred to PRD 3.0 now?

##### Adjacent Branches Tracked Internally

- Preserve plain-language PRD style.
- Avoid traceability codes in the PRD.
- Keep implementation helpers/tests deferred.

##### Blocked Questions

- Visual/game-feel direction remains next.

#### Human Responses

- The human asked to transfer the stabilized question-generation rules into PRD 3.0.

#### Locked Outcomes

- PRD 3.0 now describes round-level backend type and difficulty selection.
- PRD 3.0 now describes the 3-second player-facing prep sequence.
- PRD 3.0 now describes same-prompt behavior across game modes.
- PRD 3.0 now describes PvP and PvC type-selection percentages.
- PRD 3.0 now describes Tutorial CPU addition-only behavior.
- PRD 3.0 now describes Easy/Medium/Hard difficulty selection.
- PRD 3.0 now describes comeback Easy arming and precedence.
- PRD 3.0 now describes Addition, Subtraction, Mixed, and PvP-only `?` generators.

#### Remaining Unresolved Issues

- Exact implementation helpers, test fixtures, and service payloads are deferred.
- Visual/game-feel direction remains open.

#### Accepted Uncertainty

- PRD examples are illustrative and may be adjusted during implementation tests as long as the locked ranges/rules remain intact.

#### Conversational Reflection Summary

The question-generation PRD is now synchronized with the stabilized state. The next high-level product frontier is visual/game-feel direction, not backend implementation.

### Session CJ-015

```yaml
session_id: CJ-015
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-01
participants:
  - human
  - Codex
scope: stabilize MVP visual avatar and CPU character direction
```

#### Clarification Target

Clarify the visual direction that an implementation agent should use when fleshing out the game in Excalibur.

#### Ambiguity Severity

Tier 2 - Product/game-feel direction.

#### Prioritization Rationale

The human clarified that implementation architecture should wait until high-level product feel is stable. Excalibur needs concrete visual intent, asset expectations, and character identity rules before implementation work begins.

#### Traversal Layer

WHAT / WHY.

This stabilizes what the game should look and feel like, and why those visual decisions support competitive math-duel gameplay.

#### Questions Asked

##### Active Clarification Question

What should the MVP avatar and CPU character visual identity be?

##### Adjacent Branches Tracked Internally

- Which assets should be generated as images.
- Which effects should be created in Excalibur.
- Whether player avatars need individual color identities.
- Whether CPU opponents should reuse player avatars or have separate designs.

##### Blocked Questions

- Exact background list.
- Final combat effect timing/intensity.
- Final asset naming convention and folder structure.

#### Human Responses

- Player avatars should be simple math-symbol characters, but they need aggressive eyes to give personality.
- The initial player avatar identities are pi, 42, e, star, and 0.
- Player avatars should have individual color identities.
- The color identities are pi purple/blue, 42 green/teal, e orange/red, star yellow/gold, and 0 black/white/cyan.
- Maki should be renamed Max.
- Kander should be renamed Min.
- CPU visual designs should be Max as the word `MAX`, Min as the word `min`, Fury as a flame, Shi-eld as a buckler, Peasy as a green pea, and Skore as an oni-mask style face.
- CPU opponents should use the same core visual state set as player avatars.
- CPU opponents should also use aggressive/competitive eyes where applicable.
- Match background should be chosen once per match.
- The five MVP background themes should be math classroom arena, chalkboard formula arena, graph/grid arena, starry math-space arena, and neon numbers arcade arena.
- Character/state assets should use `512x512` transparent PNGs, and background assets should use `1920x1080` images.
- Visual asset filenames should use predictable lowercase snake_case names by asset type, identity, and state/theme.
- Visual assets should be organized into separate folders for player avatars, CPU opponents, backgrounds, and shared effects.
- Combat visuals should use reusable shared effect assets plus Excalibur-generated motion.
- Fire aura should mean the revenge gauge is active.
- Revenge attack impact should use a blinding white light.

#### Locked Outcomes

- MVP player avatars are simple math-symbol mascot characters with aggressive/competitive eyes.
- Avatar expressions should communicate state through eyes, brows, mouth, scuffs, glow, pose, and simple motion rather than complex full-body animation.
- MVP player avatar states are smiling, focused, injured, win, and lose.
- Attack, heavy attack, revenge aura, defend shield, shock, hit flash, and motion should mostly be Excalibur-generated effects or overlays.
- Player avatars have individual color identities.
- CPU opponents have their own fixed visual identities instead of reusing the player avatar set.
- Max and Min replace Maki and Kander as the CPU display names/design direction.
- CPU opponents should support smiling, focused, injured, win, and lose states where applicable.
- CPU opponents should follow the aggressive-eyes personality rule where readable; Shi-eld's buckler may use painted eyes or an emblem-face treatment.
- MVP match backgrounds should remain stable across the match rather than changing between fight rounds.
- MVP has a fixed set of five background themes for asset generation and implementation planning.
- Character/state assets use a consistent square transparent image contract.
- Backgrounds use a widescreen image contract.
- Filenames use predictable lowercase snake_case examples such as `avatar_pi_smiling.png`, `cpu_max_injured.png`, and `bg_chalkboard_formula.png`.
- Recommended folders are `assets/game/avatars/`, `assets/game/cpus/`, `assets/game/backgrounds/`, and `assets/game/effects/`.
- Player-selectable visual identities belong under `avatars/`; fixed Duel CPU opponent identities belong under `cpus/`.
- Shared effect assets include shield overlay, fire aura, shock/electric burst, impact flash, stun mark, and blinding white revenge burst.
- Excalibur should generate normal attack spring motion, heavy attack motion, wrong-answer shake/tint, defend flash, revenge attack burst timing, win bounce, lose slump, and screen shake.
- Fire aura is a persistent active-revenge visual signal.
- Blinding white light is reserved for the actual revenge attack burst/impact.

#### Remaining Unresolved Issues

- Whether this stabilized visual direction should now be transferred into PRD 3.0.

#### Accepted Uncertainty

- Final generated image style can be refined later as long as it remains bold, readable, cartoon-arcade, and compatible with Excalibur animation overlays.

#### Conversational Reflection Summary

The visual direction is moving from vibe-level to implementation-ready: small static avatar sets, strong mascot identities, and Excalibur-generated motion/effect layers.

### Session CJ-016

```yaml
session_id: CJ-016
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-01
participants:
  - human
  - Codex
scope: transfer stabilized visual direction into PRD 3.0
```

#### Clarification Target

Transfer the stabilized visual/game-feel direction into `GAME_PRD_3.0.md` in plain language.

#### Ambiguity Severity

Tier 2 - Source-of-truth synchronization.

#### Prioritization Rationale

The visual direction had stabilized enough to guide a future Excalibur implementation agent. The human asked to place it as its own section after Game Features and before Community Features.

#### Traversal Layer

WHAT.

This converts stabilized visual state into reader-facing PRD requirements.

#### Questions Asked

##### Active Clarification Question

Should the stabilized visual/game-feel direction be transferred to PRD 3.0 now?

##### Adjacent Branches Tracked Internally

- Keep PRD language plain.
- Avoid traceability codes in the PRD.
- Keep visual presentation separate from core gameplay rules.
- Keep CPU naming consistent across gameplay, visual, and persistence sections.

##### Blocked Questions

- None for visual direction transfer.

#### Human Responses

- The human asked to put the visual section after Game Features and before Community Features.

#### Locked Outcomes

- PRD 3.0 now has a standalone Visual Presentation Features section.
- Community, VS Rooms Management, Enhancement, and Architecture feature letters shifted accordingly.
- The visual section covers player avatars, CPU character art, backgrounds, combat effects, Excalibur animation scope, asset sizes, folders, and filenames.
- Maki/Kander references in PRD 3.0 were updated to Max/Min for consistency.
- Recommended CPU keys were updated to `max` and `min`.

#### Remaining Unresolved Issues

- Exact implementation animation timing and asset generation prompts are deferred to implementation.

#### Accepted Uncertainty

- The PRD specifies the asset contract and visual intent, not final generated images.

#### Conversational Reflection Summary

Visual/game-feel direction is now part of the plain PRD, while the constitution keeps the reasoning trace.

### Session CJ-017

```yaml
session_id: CJ-017
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-01
participants:
  - human
  - Codex
scope: stabilize 1P user flow and 1P Stats display order
```

#### Clarification Target

Clarify the product-facing 1P player journey before implementation architecture.

#### Ambiguity Severity

Tier 2 - Product flow.

#### Prioritization Rationale

The PRD user-flow section is still WIP. After question generation and visual direction were stabilized, 1P flow is the next high-level behavior that should be nailed down before backend service-flow planning.

#### Traversal Layer

WHAT.

This clarifies what the player experiences in the 1P path and how 1P Stats should be ordered.

#### Questions Asked

##### Active Clarification Question

Is the intended 1P journey signup/login, Tutorial, Max and Min availability, Duel CPU progression, and 1P Stats?

##### Adjacent Branches Tracked Internally

- CPU unlock path.
- 1P Stats information order.
- Future user-flow PRD transfer.

##### Blocked Questions

- Exact 1P screen-by-screen wireflow beyond the locked back-navigation expectation.
- Whether to transfer all user flows to PRD after all flows are stabilized.

#### Human Responses

- The human confirmed the proposed 1P player journey.
- The human clarified 1P Stats should show CPU defeat counts, CPU unlock progress, PvP stats, and D/C count in that order.
- The human clarified that the 1P flow describes a full progression path, not a one-time forced linear path.
- The human clarified that unlocked CPU opponents can be replayed as many times as the player wants.
- The human clarified that each page should have a back button where appropriate.
- The human clarified that PvC active matches need a quit button and exit confirmation prompt.
- The human clarified that confirmed PvC exits void the PvC match and do not count toward CPU defeat counts or unlock progress.
- The human clarified that the PvC results page should have a back button so players can return to other options.

#### Locked Outcomes

- 1P flow starts with signup/login and tutorial.
- Completing tutorial makes Max and Min available.
- Duel CPU progression unlocks Fury, Shi-eld, Peasy, and Skore through the PRD unlock criteria.
- 1P Stats display order is CPU defeat counts, CPU unlock progress, PvP stats, then D/C count.
- Unlocked CPU opponents remain replayable.
- PvC has quit confirmation, and confirmed exit voids the match without CPU progression.
- Back navigation should exist on 1P/PvC pages where appropriate, including the results page.

#### Remaining Unresolved Issues

- 2P Quick Match flow.
- 2P friend challenge flow.
- Rematch flow.
- Quit/D/C flow.
- User-flow PRD transfer.

#### Accepted Uncertainty

- Exact UI layout is deferred; this entry locks flow and display order only.

#### Conversational Reflection Summary

The 1P path is now stable at the product-flow level: teaching first, CPU progression second, then stats that foreground CPU progress before PvP/D/C data.

### Session CJ-018

```yaml
session_id: CJ-018
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-01
participants:
  - human
  - Codex
scope: stabilize 2P Quick Match flow and results persistence boundary
```

#### Clarification Target

Clarify the product-facing 2P Quick Match journey and what data from the results page persists for MVP.

#### Ambiguity Severity

Tier 2 - Product flow and persistence boundary.

#### Prioritization Rationale

Quick Match is the main public PvP path. It needs to be clear before friend challenge flow and backend lifecycle planning.

#### Traversal Layer

WHAT.

This clarifies what the player experiences in the Quick Match path and which displayed results are durable.

#### Questions Asked

##### Active Clarification Question

Is the intended Quick Match journey 2P page, Quick Match, backend queue, room assignment, Challenge/Ready page, active PvP match, and results page?

##### Adjacent Branches Tracked Internally

- Ready timeout and auto-start behavior.
- Results page actions.
- Runtime-only result data vs persisted data.

##### Blocked Questions

- Friend challenge flow.
- Rematch flow details.
- Quit/D/C flow details.
- User-flow PRD transfer.

#### Human Responses

- The human confirmed the proposed Quick Match flow.
- The human asked which data on the Quick Match results page should persist.
- The human accepted continuing after the persistence boundary clarification.

#### Locked Outcomes

- Quick Match flow starts from the 2P page and enters backend queueing.
- When matched, both players go to the Challenge/Ready page.
- Ready page behavior follows the existing 30-second Ready window, 5-second countdown when both ready, and auto-start on timeout.
- Quick Match results page includes win/loss/voided outcome, accuracy, correct answers, longest streak, Aura gained, result quote, Rematch, Add Friend, and Back.
- Quick Match results persist final PvP match summary, Aura total update, and D/C evidence through voided match data.
- Quick Match results do not persist MVP accuracy, correct answers, answer attempts, longest streak, per-match Aura gained, selected quote, Rematch availability, or Add Friend button state unless a friend request is actually sent.

#### Remaining Unresolved Issues

- 2P friend challenge flow.
- Rematch flow.
- Quit/D/C flow.
- User-flow PRD transfer.

#### Accepted Uncertainty

- Exact UI layout is deferred; this entry locks flow, actions, and persistence boundary only.

#### Conversational Reflection Summary

Quick Match is stable as the public PvP path: queue, ready, fight, results, with durable match/Aura data separated from session-only performance display.

### Session CJ-019

```yaml
session_id: CJ-019
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-01
participants:
  - human
  - Codex
scope: stabilize 2P friend challenge flow
```

#### Clarification Target

Clarify the product-facing private friend challenge / Create Private Room journey.

#### Ambiguity Severity

Tier 2 - Product flow.

#### Prioritization Rationale

Create Private Room is the second 2P entry point and is intentionally private friend challenge only for MVP. Its invite, timeout, ready, and results behavior should be clear before user-flow PRD transfer.

#### Traversal Layer

WHAT.

This clarifies what players experience when challenging an accepted online friend.

#### Questions Asked

##### Active Clarification Question

Is the intended Create Private Room journey 2P page, Create Private Room, choose online accepted friend, invite, accept/decline/timeout, Challenge/Ready page, active PvP match, and private/friend results page?

##### Adjacent Branches Tracked Internally

- Invite timeout behavior.
- Decline messaging.
- Private/friend results actions.
- Session-based results chat.

##### Blocked Questions

- Rematch flow.
- Quit/D/C flow.
- User-flow PRD transfer.

#### Human Responses

- The human confirmed the proposed friend challenge flow.

#### Locked Outcomes

- Create Private Room is private friend challenge only.
- Player chooses an online accepted friend.
- Invite lasts up to 60 seconds.
- Invited friend can Accept or Decline.
- Accepted invite routes both players to the same Challenge/Ready pattern as Quick Match.
- Inviter sees `Invitation not accepted.` if declined or timed out.
- Invited friend sees `You have declined the challenge.` if they do not respond within 60 seconds.
- Private/friend match results page shows normal PvP results plus Aura, Rematch, session-based friend match chat, and Back.
- Private/friend match results page does not show Add Friend because both players are already friends.

#### Remaining Unresolved Issues

- Rematch flow.
- Quit/D/C flow.
- User-flow PRD transfer.

#### Accepted Uncertainty

- Exact invite UI layout is deferred; this entry locks flow and outcome behavior only.

#### Conversational Reflection Summary

The friend challenge path is now stable as the private 2P branch: accepted friend invite, shared ready pattern, private results with session chat, and no Add Friend action.

### Session CJ-020

```yaml
session_id: CJ-020
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-01
participants:
  - human
  - Codex
scope: stabilize PvP rematch flow
```

#### Clarification Target

Clarify how Rematch works from PvP results.

#### Ambiguity Severity

Tier 2 - Product flow.

#### Prioritization Rationale

Rematch appears on PvP results pages and needs clear behavior before the User Flow section is updated.

#### Traversal Layer

WHAT.

This clarifies the player-facing rematch handshake and persistence implication.

#### Questions Asked

##### Active Clarification Question

Should Rematch request a same-opponent new match that requires both players to accept, then returns both players to the Challenge/Ready page?

##### Adjacent Branches Tracked Internally

- Quick Match rematch.
- Private/friend match rematch.
- Rematch rejection messaging.
- Whether rematch reuses runtime state or creates a new match.

##### Blocked Questions

- Quit/D/C flow.
- User-flow PRD transfer.

#### Human Responses

- The human confirmed the proposed rematch flow.

#### Locked Outcomes

- Rematch is a same-opponent rematch request.
- Both players must accept Rematch.
- If both accept, both return to the Challenge/Ready page.
- If one player requests Rematch and the other leaves or presses Back, the waiting player sees `Rematch not accepted.`
- Accepted Rematch starts a new match with fresh runtime state.
- Accepted Rematch creates its own final summary if completed or voided.
- For private/friend matches, the friend-results session/chat context remains available only while players stay in the results flow.

#### Remaining Unresolved Issues

- Quit/D/C flow.
- User-flow PRD transfer.

#### Accepted Uncertainty

- Exact rematch timeout length is not yet specified.

#### Conversational Reflection Summary

Rematch is now stable as a mutual same-opponent request that creates a new match rather than replaying or extending the prior one.

### Session CJ-021

```yaml
session_id: CJ-021
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-01
participants:
  - human
  - Codex
scope: stabilize quit and disconnect behavior for PvP and PvC
```

#### Clarification Target

Clarify which match types use reconnect grace and what happens when a player quits or disconnects.

#### Ambiguity Severity

Tier 2 - Product flow and persistence boundary.

#### Prioritization Rationale

Quit/D/C behavior affects player-facing flow, results, stats, Aura, CPU progression, and persistence. It must be clear before the User Flow section is transferred.

#### Traversal Layer

WHAT.

This clarifies the product behavior for match interruption, not the implementation mechanism.

#### Questions Asked

##### Active Clarification Question

Does PvP active-match quit/disconnect use reconnect grace, while PvC quit/disconnect voids without PvP-style D/C persistence?

##### Adjacent Branches Tracked Internally

- PvP reconnect countdown.
- PvP voided match persistence.
- PvC quit confirmation.
- PvC sudden disconnect behavior.
- CPU progression update conditions.

##### Blocked Questions

- User-flow PRD transfer.

#### Human Responses

- The human clarified that PvC has no reconnect grace period.
- The human clarified that reconnect grace exists only for PvP.
- The human clarified that sudden PvC disconnect voids the session and records no stats.

#### Locked Outcomes

- PvP active-match quit/disconnect uses the reconnect grace flow.
- PvP failed reconnect/return voids the match, increments the disconnected/quitting player's D/C count, persists a voided PvP match, and awards 0 AP.
- PvC does not have reconnect grace for MVP.
- PvC confirmed quit voids the session and records no CPU progression.
- PvC sudden disconnect voids the session immediately and records no CPU progression.
- PvC voided sessions do not increment CPU defeat counts or unlock progress.

#### Remaining Unresolved Issues

- User-flow PRD transfer.

#### Accepted Uncertainty

- None for PvC quit/disconnect messaging.

#### Conversational Reflection Summary

The interruption rules are now split cleanly: PvP protects a live two-player match with reconnect grace, while PvC treats quit/disconnect as an immediate void with no progression.

#### Messaging Addendum

The human accepted the following PvC messaging:

- Quit confirmation title: `Exit match?`
- Quit confirmation supporting text: `This CPU match will be voided and no progress will be recorded.`
- Quit confirmation buttons: `Cancel` and `Exit Match`
- Confirmed quit result/status message: `CPU match voided.`
- Confirmed quit supporting text: `No CPU win or unlock progress was recorded.`
- Sudden disconnect result/status message: `CPU match voided due to disconnect.`
- Sudden disconnect supporting text: `No CPU win or unlock progress was recorded.`

### Session CJ-022

```yaml
session_id: CJ-022
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-01
participants:
  - human
  - Codex
scope: transfer stabilized user flows into PRD 3.0
```

#### Clarification Target

Transfer the stabilized user flows into the PRD 3.0 User Flow section.

#### Ambiguity Severity

Tier 2 - Source-of-truth synchronization.

#### Prioritization Rationale

The User Flow section was still WIP, and the major 1P, PvC, Quick Match, friend challenge, ready, results, rematch, and disconnect flows had stabilized in dialogue.

#### Traversal Layer

WHAT.

This converts stabilized flow state into reader-facing PRD requirements.

#### Questions Asked

##### Active Clarification Question

Should the User Flow section be written using the agreed roman-numeral flow list?

##### Adjacent Branches Tracked Internally

- Preserve plain-language PRD style.
- Keep implementation details out of the flow section.
- Preserve result persistence boundaries where they affect player-facing behavior.

##### Blocked Questions

- None for user-flow transfer.

#### Human Responses

- The human accepted the roman-numeral flow list.
- The human asked to proceed with the PRD transfer.

#### Locked Outcomes

- PRD 3.0 User Flow is no longer WIP.
- PRD 3.0 now includes nine user-flow subsections:
  - 1P Tutorial / CPU Progression Flow.
  - 1P Stats Flow.
  - PvC Quit / Disconnect Flow.
  - 2P Quick Match Flow.
  - 2P Friend Challenge / Create Private Room Flow.
  - PvP Ready / Match Start Flow.
  - PvP Results Flow.
  - PvP Rematch Flow.
  - PvP Quit / Disconnect / Reconnect Flow.
- The PRD table of contents links to the new user-flow subsections.

#### Remaining Unresolved Issues

- User-flow implementation details are deferred.
- Exact UI layout remains deferred.

#### Accepted Uncertainty

- Screen-level wireframes are not part of this transfer.

#### Conversational Reflection Summary

The User Flow section now gives normal readers and future implementers a clear product-level map through 1P, PvC, and PvP experiences without turning the section into backend architecture.

### Session CJ-023

```yaml
session_id: CJ-023
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-01
participants:
  - human
  - Codex
scope: restructure microservice details and realtime runtime requirements
```

#### Clarification Target

Clarify the backend microservices section so service responsibilities are nested under the relevant services instead of being collected in a loose realtime/matchmaking bucket.

#### Ambiguity Severity

Tier 2 - Architecture source-of-truth structure.

#### Prioritization Rationale

The old `Realtime Server / Matchmaking Server` section mixed pre-match, runtime, and post-match requirements. The human identified that these responsibilities should be housed under the relevant services.

#### Traversal Layer

HOW.

This clarifies architecture organization without changing the product behavior already stabilized.

#### Questions Asked

##### Active Clarification Question

Should the backend microservices section be fleshed out with service detail notes, and should the old realtime/matchmaking section be reframed as cross-service runtime requirements?

##### Adjacent Branches Tracked Internally

- Matchmaking Service pre-match ownership.
- Live Match Service runtime ownership.
- Match Summary Service post-match ownership.
- Question Generation and CPU Opponent service boundaries.
- Realtime runtime requirements vs separate service naming.

##### Blocked Questions

- Whether Redis is mandatory or optional for MVP runtime scaling.
- Exact API/event contracts between services.

#### Human Responses

- The human agreed that the services need further fleshing out and clarification.
- The human accepted trying the proposed restructuring.

#### Locked Outcomes

Note: this session's backend-microservice wording is superseded by CJ-066. The responsibility boundaries remain useful, but the current PRD expresses them as internal backend modules inside the Express backend service.

- PRD 3.0 now includes service detail notes for all 9 backend services.
- Matchmaking Service details now house Quick Match queue, room assignment, room cap, private invites, invite timeout, ready state, Stop/reset, and handoff to Live Match Service.
- Live Match Service details now house active match synchronization, timers, combat state, answer validation, DEFEND legality, same-time answers, reconnect handling, void handling, runtime counters, and session-only friend results chat.
- Match Summary Service details now house PvP summary persistence, Aura updates, PvC CPU wins/unlocks, and post-match persistence rules.
- Question Generation Service and CPU Opponent Service have clearer called-by and responsibility notes.
- The old `Realtime Server / Matchmaking Server` section was renamed to `Realtime Runtime Requirements`.
- Realtime runtime requirements are explicitly not a separate MVP microservice by themselves.
- Realtime requirements are distributed across Matchmaking Service, Live Match Service, and Match Summary Service.

#### Remaining Unresolved Issues

- The relationship between VS Rooms Management as product behavior and Architecture as service ownership still needs a plain-language bridge.
- Superseded by CJ-066: Redis is not part of the current required MVP container set; backend runtime memory owns temporary coordination for the current PRD.
- Exact implementation API/event contracts remain deferred.

#### Accepted Uncertainty

- The PRD now defines service responsibilities, not exact endpoint names or message schemas.

#### Conversational Reflection Summary

The architecture section now reads less like a loose realtime bucket and more like a service map: pre-match belongs to Matchmaking, live combat belongs to Live Match, and persistence belongs to Match Summary.

### Session CJ-024

```yaml
session_id: CJ-024
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-01
participants:
  - human
  - Codex
scope: make backend service detail sections navigable from the PRD table of contents
```

#### Clarification Target

Make the 9 backend service detail blocks directly accessible from the PRD table of contents and add backlinks.

#### Ambiguity Severity

Tier 3 - Documentation navigation.

#### Prioritization Rationale

After the microservice detail blocks were added, the human wanted those details accessible from the table of contents with Back to Table of Contents links.

#### Traversal Layer

WHAT.

This improves PRD navigability without changing architecture behavior.

#### Questions Asked

##### Active Clarification Question

Should the service detail blocks be added to the table of contents and given backlinks?

##### Adjacent Branches Tracked Internally

- Preserve existing Architecture section structure.
- Keep service anchors stable.

##### Blocked Questions

- None.

#### Human Responses

- The human requested that the service detail sections be accessible from the contents and have backlinks to contents.

#### Locked Outcomes

- The table of contents now links to all 9 backend service detail sections.
- Each backend service detail block has a stable anchor.
- Each backend service detail block has a Back to Table of Contents link.

#### Remaining Unresolved Issues

- None for service-detail navigation.

#### Accepted Uncertainty

- Future service subsection names should preserve these anchors where possible.

#### Conversational Reflection Summary

The architecture detail is now navigable enough for normal reading and implementation planning without making the TOC guesswork-heavy.

### Session CJ-025

```yaml
session_id: CJ-025
date: 2026-06-01
area: friend-system-search-and-rate-limiting
status: transferred-to-prd
severity_tier: Tier 2
source_prompt: Human reviewed friend.MD coverage and clarified MVP friend-search decisions.
```

#### Session Purpose

Clarify which remaining friend.MD deltas belong in PRD 3.0 MVP after the friend-system review.

#### User Intent

The human wanted to ignore a separate level system, use Aura instead, include partial player-name search with autocomplete, leave inactive status out, and include rate limiting.

#### Severity Classification

Tier 2 - Product and implementation boundary.

#### Prioritization Rationale

Friend search and request behavior affects the Community MVP, database lookup expectations, and abuse prevention. The decision needed to be explicit before implementation planning.

#### Traversal Layer

WHAT plus light HOW.

The PRD should state the player-facing search behavior and the implementation expectation that partial/autocomplete lookup is indexed or equivalently responsive, without specifying a final database engine feature.

#### Questions Asked

##### Active Clarification Question

Which friend.MD search and social-display details should PRD 3.0 adopt?

##### Adjacent Branches Tracked Internally

- Whether to show player level or Aura.
- Whether partial search needs autocomplete.
- Whether inactive friendship status belongs in MVP.
- Whether friend requests need spam protection.

##### Blocked Questions

- Exact database index strategy is deferred to implementation.

#### Human Responses

- Ignore the level system.
- Replace player level with Aura.
- Include partial username/player-name search.
- Autocomplete should spell out the name.
- Leave inactive status out.
- Include rate limiting.

#### Locked Outcomes

- Friend list and friend search surfaces show Aura Points as the rivalry signal.
- Add Friend search supports exact and partial player-name lookup.
- Search supports autocomplete suggestions that help complete player names.
- Partial search/autocomplete should use indexed lookup or equivalent search support.
- Friend request sending is rate-limited or cooldown-protected.
- Inactive friendship status remains out of PRD 3.0 MVP.

#### Remaining Unresolved Issues

- Exact indexing strategy is implementation-specific.

#### Accepted Uncertainty

- Prefix search is likely enough for MVP autocomplete; fuzzy typo-tolerant search can be revisited later if needed.

#### Conversational Reflection Summary

The friend system now keeps the social loop lean: Aura gives players a reason to care who they add, autocomplete makes finding names humane, and rate limiting protects the system without expanding the status model.

### Session CJ-026

```yaml
session_id: CJ-026
date: 2026-06-01
area: prd-consistency-pass
status: transferred-to-prd
severity_tier: Tier 2
source_prompt: Human asked to do the PRD consistency pass before implementation planning.
```

#### Session Purpose

Resolve remaining PRD 3.0 consistency issues that could confuse implementation planning.

#### User Intent

The human accepted the recommendation to do a PRD consistency pass before architecture flow diagrams.

#### Severity Classification

Tier 2 - Cross-section clarity.

#### Prioritization Rationale

The PRD had a few sections that were individually correct but could read as overlapping or contradictory: VS room behavior versus architecture ownership, lobby wording despite no public lobby, and CPU progress display versus CPU behavior ownership.

#### Traversal Layer

WHAT plus ownership boundary.

The pass focused on plain-language reader clarity and did not introduce new MVP features.

#### Questions Asked

##### Active Clarification Question

Which existing PRD sections need consistency fixes before implementation planning?

##### Adjacent Branches Tracked Internally

- VS Rooms Management versus Architecture Features.
- Room-cap messaging versus no public lobby.
- CPU unlock display versus live CPU behavior.
- Aura display consistency on friend request surfaces.

##### Blocked Questions

- None.

#### Human Responses

- The human asked to do the PRD consistency pass first.

#### Locked Outcomes

- VS Rooms Management now explicitly describes player-facing room behavior.
- Architecture Features now explicitly describes service ownership and data/runtime boundaries.
- Room-cap full message now says `Game rooms are full. Please return in 5 minutes.` instead of referring to a lobby.
- Friend request display now includes requester Aura Points for consistency with friend list/search.
- Stats / Leaderboard Service owns CPU progress and unlock display views.
- CPU Opponent Service owns live CPU fighter behavior during PvC.

#### Remaining Unresolved Issues

- None from this consistency pass.

#### Accepted Uncertainty

- The exact API shapes for stats projections and CPU unlock display remain implementation-planning details.

#### Conversational Reflection Summary

The PRD is now cleaner for the next stage: player-facing room behavior, backend ownership, social display, and CPU progress ownership each have a clearer place.

### Session CJ-027

```yaml
session_id: CJ-027
date: 2026-06-01
area: page-screen-map
status: transferred-to-prd
severity_tier: Tier 2
source_prompt: Human asked to inspect `Game_Pages.md` from `dayeo_branch` and structure PRD 3.0 pages similarly to simulate page navigation.
```

#### Session Purpose

Add a reader-facing page/screen map to PRD 3.0 using the prior page-navigation document as a structural model while keeping PRD 3.0 MVP scope.

#### User Intent

The human wanted page display requirements, not more backend discussion, and asked for a structure similar to `Game_Pages.md` so the PRD can simulate page navigation.

#### Severity Classification

Tier 2 - Frontend product structure.

#### Prioritization Rationale

The PRD already had backend architecture, runtime rules, and user flows, but the concrete page display layer was only scattered across feature and flow sections. A page map gives frontend implementation a navigable screen list.

#### Traversal Layer

WHAT plus navigation.

The page map describes screen purpose, immediate visible behavior, nested pages, and next-page transitions. It does not prescribe final visual layout or styling.

#### Questions Asked

##### Active Clarification Question

How should PRD 3.0 express page display and screen navigation?

##### Adjacent Branches Tracked Internally

- Preserve `Game_Pages.md` clickable navigation style.
- Remove PRD 1.0/2.0-era scope that is no longer MVP, such as Shop, public lobby browsing, spectator mode, coins, and Replay wording.
- Connect display requirements to the already-stabilized User Flow section.

##### Blocked Questions

- Detailed wireframes and final UI layout remain future frontend design work.

#### Human Responses

- The human asked to inspect the page document on the dayeo branch and use a similar format.
- The available branch was `dayeo_branch`, and the matching file was `docs/game/Game_Pages.md`.

#### Locked Outcomes

- PRD 3.0 now has a top-level Page / Screen Map section.
- The Page / Screen Map is clickable and modeled after the prior `Game_Pages.md` navigation style.
- The map covers Auth, Home Page, 1P, 2P, Active Match, Results, Community, Profile, Privacy Policy, and Terms Of Service.
- The map excludes Shop, public lobby browsing, spectator mode, coins, and Replay wording.
- The map uses Rematch terminology and PRD 3.0 MVP behavior.

#### Remaining Unresolved Issues

- Detailed wireframes, component layout, and responsive design behavior remain to be designed during frontend implementation.

#### Accepted Uncertainty

- Page names may change during implementation as long as the screen responsibilities and navigation paths remain intact.

#### Conversational Reflection Summary

The PRD now has the missing bridge between user flows and implementation: a page-by-page navigation map that a frontend agent can follow without reverse-engineering screens from backend service notes.

### Session CJ-028

```yaml
session_id: CJ-028
date: 2026-06-01
area: page-map-contents-and-testing
status: transferred-to-prd
severity_tier: Tier 2
source_prompt: Human asked to format a contents page of sorts and show testing in the contents page with links to relevant sections below.
```

#### Session Purpose

Make the Page / Screen Map easier to use as a navigation and test planning artifact.

#### User Intent

The human wanted the page map to behave more like a contents page and to include testing links that jump to relevant sections below.

#### Severity Classification

Tier 2 - Frontend implementation readiness.

#### Prioritization Rationale

The page map existed, but it was a long linear document. Adding a contents area and linked testing checkpoints makes it easier for implementation and QA agents to navigate page requirements.

#### Traversal Layer

WHAT plus test checklist.

The contents and testing sections describe page groups, relevant linked sections, and expected verification checkpoints without prescribing a test framework.

#### Questions Asked

##### Active Clarification Question

How should page requirements and testing checkpoints be made navigable inside the PRD?

##### Adjacent Branches Tracked Internally

- Page map navigation contents.
- Testing contents.
- Page-specific testing checkpoints.
- Internal anchor integrity.

##### Blocked Questions

- Exact automated test framework and test file organization remain implementation planning details.

#### Human Responses

- The human asked for a contents page of sorts.
- The human asked to show testing in that contents page.
- The human asked for links to the relevant sections below.

#### Locked Outcomes

- Page / Screen Map now includes `Page Map Contents`.
- Superseded by CJ-067: Page / Screen Map previously included `Testing Contents`.
- Superseded by CJ-067: Testing Contents previously linked to page-specific testing checkpoint sections inside the PRD.
- Superseded by CJ-067: Testing checkpoints covered Page Navigation, Auth/Home Page, 1P, 2P, Active Match, Results, Community, Profile, and Legal Pages inside the PRD.
- Internal anchor check passed with no missing links and no duplicate IDs.

#### Remaining Unresolved Issues

- Automated test framework and coverage depth remain future implementation decisions.

#### Accepted Uncertainty

- Test checkpoints may later be split into unit, integration, E2E, and visual regression tests.

#### Conversational Reflection Summary

The page map is now both navigable and testable: a frontend implementation agent can jump from page contents to page requirements, then directly to the testing expectations for that page group.

### Session CJ-029

```yaml
session_id: CJ-029
date: 2026-06-01
area: page-map-nesting
status: transferred-to-prd
severity_tier: Tier 2
source_prompt: Human clarified that Page Map Contents was too flat and should show different levels of nestedness, with Community and the profile/settings area under Home Page rather than at the same level as top-level pages.
```

#### Session Purpose

Correct the Page Map Contents hierarchy so it reads like app navigation instead of a flat page category list.

#### User Intent

The human wanted the contents block to show actual parent-child page relationships, including deeper route nesting and shared screens reached through different flows.

#### Severity Classification

Tier 2 - Frontend navigation structure.

#### Prioritization Rationale

The page map itself had correct page sections, but the contents area could mislead implementation by showing Home Page, 1P, 2P, Community, Profile, Active Match, and Results as siblings.

#### Traversal Layer

Navigation hierarchy.

The update changes the contents tree only; it does not change MVP behavior or page requirements.

#### Questions Asked

##### Active Clarification Question

How should Page Map Contents communicate nested navigation levels?

##### Adjacent Branches Tracked Internally

- Top-Level App Entry owns Auth and Home Page.
- Home Page owns 1P, 2P, Community, Profile, Privacy Policy, and Terms Of Service.
- 1P and 2P flows own their reachable match and results paths.
- Shared screens can appear under multiple flows to simulate navigation.

##### Blocked Questions

- Exact frontend route names and router implementation remain implementation details.

#### Human Responses

- The human pointed out that the contents list was not nested in sequence.
- The human specifically called out that settings/language-style profile functions and Community should not be at the same level as the top-level structure.
- The human asked to see a nested structure with different levels of nestedness.

#### Locked Outcomes

- Page Map Contents now uses Top-Level App Entry as the root.
- Auth and Home Page are nested under Top-Level App Entry.
- Signup and Login are nested under Auth.
- 1P, 2P, Community, Profile, Privacy Policy, and Terms Of Service are nested under Home Page.
- Deeper 1P and 2P page flows are nested beneath their entry points.
- Shared pages such as Active Match, Challenge / Ready, and PvP Results may appear in multiple branches where those flows reach them.

#### Remaining Unresolved Issues

- None for the PRD contents structure.

#### Accepted Uncertainty

- The contents tree may duplicate shared screens for readability even if implementation uses a single route/component for those screens.

#### Conversational Reflection Summary

The contents page now behaves more like a navigable app outline: the reader can see root, menu, branch, flow, shared match screen, and result depth at a glance.

### Session CJ-030

```yaml
session_id: CJ-030
date: 2026-06-01
area: home-page-info-legal-navigation
status: transferred-to-prd
severity_tier: Tier 2
source_prompt: Human asked to rename Main Menu to Home Page, rename Create Room to Create Private Room, and check the project requirements for minor accessible tabs such as About, Privacy, and Terms.
```

#### Session Purpose

Align page labels with the desired player-facing navigation wording and add required legal pages to the Page / Screen Map.

#### User Intent

The human wanted clearer naming for the main navigation and private room flow, and wanted the PRD to account for accessible pages where project requirements call for them.

#### Severity Classification

Tier 2 - Frontend navigation and project compliance.

#### Prioritization Rationale

Home Page and Create Private Room are player-facing labels that affect implementation naming and route structure. Privacy Policy and Terms Of Service are also called out in the project PDF as accessible required pages.

#### Traversal Layer

Page naming plus compliance pages.

The update changes page labels, route anchors, contents links, page descriptions, and page testing checkpoints without changing duel gameplay rules.

#### Questions Asked

##### Active Clarification Question

Which minor non-gameplay pages should be included in the Home Page navigation?

##### Adjacent Branches Tracked Internally

- Rename Main Menu to Home Page.
- Rename Create Room to Create Private Room.
- Include project-PDF-required Privacy Policy and Terms Of Service pages.
- Consider About as a lightweight informational page; this was later removed in CJ-031.
- Keep legal pages from blocking the main 1P, 2P, Community, or Profile flows.

##### Blocked Questions

- Final Privacy Policy and Terms Of Service legal copy remains future content work.

#### Human Responses

- The human explicitly requested `Main Menu` become `Home Page`.
- The human explicitly requested `Create Room` become `Create Private Room`.
- The human asked whether minor accessible tabs like About, Privacy, and Terms/Conditions should be included.
- The human asked to check project requirements before deciding.
- The human clarified the relevant source was `/home/dayeo/git/trancendence/ft_trancendence.pdf`.

#### Locked Outcomes

- The primary post-login navigation page is named Home Page.
- The private friend challenge entry is named Create Private Room.
- Home Page includes accessible links to Privacy Policy and Terms Of Service.
- Privacy Policy and Terms Of Service are included because the project PDF requires easily accessible pages with relevant, non-placeholder content.
- Legal Pages Testing was added to the Page / Screen Map testing contents.

#### Remaining Unresolved Issues

- Final legal copy for Privacy Policy and Terms Of Service remains to be written before release.

#### Accepted Uncertainty

- Legal page wording can remain lightweight during planning, but the release pages must be relevant and non-placeholder.

#### Conversational Reflection Summary

The page map now separates core gameplay navigation from supporting legal access: Home Page is the hub, Create Private Room is unambiguous, and required policy pages are visible to implementation.

### Session CJ-031

```yaml
session_id: CJ-031
date: 2026-06-01
area: legal-pages-about-removal
status: transferred-to-prd
severity_tier: Tier 2
source_prompt: Human clarified to take out About and asked whether the PRD/build pass the subject requirements.
```

#### Session Purpose

Remove About from the MVP page map and keep only the project-required legal pages.

#### User Intent

The human wanted the PRD to match the project PDF requirement scope without adding an unnecessary About page.

#### Severity Classification

Tier 2 - Project compliance and frontend navigation.

#### Prioritization Rationale

Privacy Policy and Terms Of Service are mandatory project requirements, while About is optional and was removed to keep MVP navigation lean.

#### Traversal Layer

Legal page scope and Home Page navigation.

#### Questions Asked

##### Active Clarification Question

Should About remain as an MVP support page?

##### Adjacent Branches Tracked Internally

- Keep Privacy Policy and Terms Of Service as required legal pages.
- Remove About from contents, Home Page navigation, page sections, and testing checkpoints.
- Rename legal/info wording to Legal Pages where About was the only non-legal page.

##### Blocked Questions

- Final Privacy Policy and Terms Of Service legal copy remains future content work.

#### Human Responses

- The human clarified: `ok take out the about then.`

#### Locked Outcomes

- About is not part of PRD 3.0 MVP.
- Home Page links to Privacy Policy and Terms Of Service.
- Legal Pages Testing covers Privacy Policy and Terms Of Service only.
- The Legal Pages feature section covers required legal support pages only.

#### Remaining Unresolved Issues

- Final legal copy for Privacy Policy and Terms Of Service remains to be written before release.
- Full subject-requirement compliance still needs implementation verification, not only PRD coverage.

#### Accepted Uncertainty

- The exact final legal text can be written later as long as the release version is relevant and non-placeholder.

#### Conversational Reflection Summary

The MVP page map now follows the subject PDF more tightly: required policy pages stay visible, and optional informational navigation is removed.

---

<a id="cj-032"></a>

### CJ-032 - Dockerized Microservice Deployment And Server-Side PvC

#### Context

The human clarified deployment expectations before implementation: services should remain separate, PvC should run server-side, and Dockerization should reflect the accepted microservices direction.

#### Questions Asked

##### Active Clarification Question

Should PRD 3.0 explicitly state how Dockerized deployment maps to service boundaries?

##### Adjacent Branches Tracked Internally

- One container per backend microservice.
- Service clusters as architecture/ownership groupings only.
- Gateway / reverse proxy as public entry point.
- Client container included for final single-command deployment.
- Redis as optional runtime infrastructure, not an MVP requirement.
- PvC as server-side runtime owned by Live Match Service.

##### Blocked Questions

- Exact gateway technology remains open: NGINX, Traefik, Caddy, or equivalent.
- Exact Redis adoption remains open until runtime scaling or shared-state needs require it.

#### Human Responses

- The human clarified: `ok ... we will have one container per service then. Can we include this somewhere in the prd about dockerisation?`

#### Locked Outcomes

Note: this session's one-container-per-backend-microservice outcome is superseded by CJ-066. The current PRD requires four runtime containers: reverse proxy, frontend, backend, and database.

- Each backend microservice runs as a separate runtime container/process in final Dockerized deployment.
- Backend service clusters are ownership groupings, not deployment units.
- Final containerized deployment includes a client container, gateway / reverse proxy container, database container, and one runtime container per backend service.
- Redis was initially treated as optional in this session, but that outcome is superseded by CJ-034.
- PvC runs server-side through Live Match Service, with Question Generation Service and CPU Opponent Service called for PvC behavior.

#### Remaining Unresolved Issues

- Exact gateway technology is not selected.
- Superseded by CJ-066: Redis is not part of the current required MVP container set; backend runtime memory owns temporary coordination for the current PRD.

#### Accepted Uncertainty

- The implementation may reuse one shared backend image with different startup commands while still running separate service containers.

#### Conversational Reflection Summary

The architecture section now gives implementation a clean Docker target: service boundary equals runtime container boundary, while shared infrastructure stays minimal unless the runtime actually needs it.

---

<a id="cj-033"></a>

### CJ-033 - Page Navigation Naming, Numbered Headings, And Container Purpose Table

#### Context

The human reviewed the PRD after the Dockerization addition and asked for wording cleanup: Page / Screen Map should become Page Navigation, top-level document headings should be numbered, and Deployment / Dockerization should stop reading like a recommendation section.

#### Questions Asked

##### Active Clarification Question

How should the PRD present Dockerization for implementation handoff?

##### Adjacent Branches Tracked Internally

- Rename Page / Screen Map to Page Navigation.
- Number top-level section headings in the document body.
- Replace recommendation-style Docker wording with a required container purpose table.
- Keep one backend runtime container per service.
- Omit gateway / reverse proxy detail from the Dockerization section for now.

##### Blocked Questions

- Gateway / reverse proxy implementation details are intentionally not specified in the PRD Dockerization section.

#### Human Responses

- The human clarified: `Replace Page/Screen Map with Page Navigation in the Contents and the relevant section.`
- The human clarified: `The main Headings in the section area are not numbered.`
- The human clarified: `For Deployment / Dockerzation I want you to redo. This should not be recommendation section.`
- The human clarified: `I just need you to say what container we need and what that container does.`

#### Locked Outcomes

- Page / Screen Map is renamed to Page Navigation in the PRD contents and relevant section text.
- Top-level body headings are numbered to match the Table of Contents.
- Deployment / Dockerization lists required MVP containers and each container's purpose.
- Gateway / reverse proxy details are omitted from the Dockerization section.

#### Remaining Unresolved Issues

- Gateway / reverse proxy details may be specified later if implementation needs a dedicated deployment subsection.

#### Accepted Uncertainty

- The exact Docker Compose file structure remains implementation work; the PRD now defines required containers and responsibilities.

#### Conversational Reflection Summary

The PRD now reads less like an architecture brainstorm and more like implementation handoff: named navigation, numbered top-level sections, and a concise container responsibility table.

---

<a id="cj-034"></a>

### CJ-034 - Redis Required For Multi-Client Runtime Coordination

#### Context

The human revisited the Dockerization container table and asked to add Redis, noting that it is necessary for multiple clients.

#### Questions Asked

##### Active Clarification Question

Should Redis remain optional or become a required MVP container?

##### Adjacent Branches Tracked Internally

- Keep Redis optional for a single-process prototype.
- Require Redis for multi-client matchmaking, rooms, ready state, reconnect timers, live-match coordination, and WebSocket/session fanout.
- Keep persistent source-of-truth data in the database, not Redis.

##### Blocked Questions

- Exact Redis key schema and expiration rules remain implementation work.

#### Human Responses

- The human asked: `add the redi cotainer. this is necessary for multiple clients right ?`

#### Locked Outcomes

Note: this session's Redis-required outcome is superseded by CJ-066. The current PRD 3.0 required container set is reverse proxy, frontend, backend, and database; temporary runtime coordination belongs to backend runtime memory for MVP.

- Superseded historical outcome: Redis was required for PRD 3.0 MVP shared runtime coordination across multiple clients.
- Superseded historical outcome: Redis was added to the required MVP container table.
- Superseded historical outcome: Redis was not a persistent database source-of-truth.

#### Remaining Unresolved Issues

- Redis key naming, TTL rules, and pub/sub or stream usage are deferred to backend implementation design.

#### Accepted Uncertainty

- Redis may store transient runtime state and fanout coordination, but durable account/profile/friend/match/progression data remains in the database tables.

#### Conversational Reflection Summary

The Dockerization section now treats Redis as part of the actual MVP runtime, not a later scaling nice-to-have.

---

<a id="cj-035"></a>

### CJ-035 - PRD 3.0 Implementation Ambiguity Audit

#### Context

The human invoked `/krystalize GAME_PRD_3.0.md` after PRD 3.0 had accumulated product, page, service, persistence, runtime, and deployment detail.

This session inspected the current PRD and existing PRD 3.0 constitutional artifacts to identify ambiguity that should be clarified before implementation work treats the PRD as fully deterministic.

#### Clarification Target

Surface remaining ambiguity, assumptions, contradictions, dependencies, accepted uncertainty, and next clarification focus for `docs/game/GAME_PRD_3.0.md`.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

The most important remaining ambiguity is not project identity or MVP scope. It is the deterministic runtime contract for combat exchanges, which affects Live Match Service, CPU Opponent Service, PvP synchronization, PvC simulation, results counters, and tests.

#### Prioritization Rationale

The PRD already stabilizes MVP scope, product promise, question generation, visual direction, user flows, page navigation, service ownership, database tables, Redis, and Docker containers. Implementation can now proceed only if the server-owned combat rules are precise enough that different agents do not invent incompatible mechanics.

#### Traversal Layer

HOW, with dependency on WHAT.

The WHY layer is already stable: the game is a fast competitive mental arithmetic duel built around pressure, mastery, comeback tension, and rivalry. The next required clarification is how one authoritative exchange resolves.

#### Questions Asked

##### Active Clarification Question

What is the authoritative combat resolution contract for one exchange?

##### Adjacent Branches Tracked Internally

- Fight-round and match-end edge cases.
- CPU runtime behavior profile tables.
- Ready/Stop synchronization edge cases.
- Exact Redis key schema, TTL rules, and fanout mechanism.
- Exact backend framework choice.

##### Blocked Questions

- CPU behavior cannot be made deterministic until the combat exchange contract defines available actions, timing, cooldowns, and precedence.
- PvP synchronization tests cannot be complete until same-time answer and `Additional DMG` semantics are defined.
- Final match summary edge cases cannot be fully tested until tied rounds, Final round, and mutual final-round loss transitions are exact.

#### Human Responses

- No new human clarification was provided in this invocation.
- The artifact audit preserves unresolved ambiguity instead of collapsing it into assumed rules.

#### Locked Outcomes

- The current PRD 3.0 artifact set is strong enough to identify remaining implementation-blocking ambiguity.
- The next clarification frontier is the authoritative combat exchange contract, not broad product identity.
- `GAME_PRD_3.0.md` should not be silently rewritten until these combat semantics are clarified or explicitly deferred.

#### Remaining Unresolved Issues

- Core combat has named mechanics but not a complete numeric resolution contract.
- Exchange timing semantics are still under-specified.
- Fight-round and match termination rules need exact edge-case semantics.
- CPU fighter profiles describe personality but not deterministic runtime behavior.
- Ready/Stop and auto-start rules have player-facing behavior but not all synchronization edge cases.

#### Accepted Uncertainty

- Server-crash recovery before final persistence remains KIV as already stated in PRD 3.0.
- Exact Redis key naming, TTL rules, and pub/sub or stream choices remain implementation design, not PRD-level product clarification.
- Express versus Fastify remains open.

#### Warnings

[WARNING :: AMBIGUITY]

Tier 2. Core combat mechanics are named but not numerically resolvable. This affects HP, damage, streak multiplier, revenge gauge, revenge attack, DEFEND, stun, vulnerability, and `SHOCK!`. If implementation begins without clarification, Live Match Service may invent rules that drift from product intent.

[WARNING :: UNRESOLVED_DEPENDENCY]

Tier 2. Live Match Service implementation depends on an authoritative exchange lifecycle. Same-time answers, `Additional DMG`, answer ordering, question turnover, timeout clocks, and interruption handling must be clarified, deferred, or accepted as implementation-owned before deterministic implementation.

#### Conversational Reflection Summary

PRD 3.0 has moved from broad product stabilization into implementation handoff territory. The main thing still asking to be made crystalline is the combat exchange itself: what happens, in what order, with which timers and numbers, when two players answer, miss, defend, timeout, trigger revenge, or collide in the same moment.

---

<a id="cj-036"></a>

### CJ-036 - Core Combat Numbers And Inherited Mechanic Check

#### Context

The human responded to the combat exchange clarification frontier by providing concrete combat values and asking what several unresolved terms meant.

The clarification also revealed that several requested meanings already exist in inherited PRD 1.0 constitutional material: same-time threshold, `Additional DMG` carryover, and successful DEFEND stun duration.

#### Clarification Target

Stabilize starting HP, question-round duration, attack power timing, base damage, streak multiplier, `SHOCK!`, DEFEND cooldown, revenge gauge behavior, revenge damage, HP display, and identify which inherited mechanics need PRD 3.0 confirmation.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

These values directly affect Live Match Service, runtime synchronization, PvC CPU simulation, post-match counters, and frontend combat display.

#### Prioritization Rationale

This clarification was prioritized because the previous active frontier identified combat exchange resolution as the main implementation blocker. The human supplied enough numeric rules to convert much of the combat system from named mechanics into implementable runtime state.

#### Traversal Layer

HOW.

The product purpose remains stable; this session clarifies how the duel's pressure and damage loop should run.

#### Questions Asked

##### Active Clarification Question

Should PRD 3.0 inherit the PRD 1.0 same-time threshold, shared `Additional DMG`, and 1.5s DEFEND stun rules unchanged?

##### Adjacent Branches Tracked Internally

- Exact answer submission precedence.
- Whether inherited `Additional DMG` calculation should remain shared carryover.
- Whether inherited `150ms` same-time threshold still feels right for PRD 3.0.
- Whether inherited successful DEFEND stun duration remains `1.5s`.
- CPU behavior probabilities and cooldowns after the player combat model stabilizes.

##### Blocked Questions

- Exact final exchange lifecycle cannot close until same-time, `Additional DMG`, and stun inheritance is confirmed or replaced.
- CPU behavior tables should wait until the player combat contract is fully stable.

#### Human Responses

- Starting HP is `100 HP`.
- A question round lasts `6s`.
- Attack power starts at `1` and increases to a max of `30`.
- The attack power indicator moves from `1` to `30` over `5s`.
- Attack power remains at `30` for `1s` before both players get shocked if neither answers.
- Base damage is `attack power x streak multiplier`.
- Streak multiplier starts at `1.1x` for the first consecutive successful attack, then `1.2x`, `1.3x`, `1.4x`, and `1.5x` at the fifth attack.
- Subsequent streaks remain capped at `1.5x`.
- `SHOCK!` removes `10 HP`.
- DEFEND can only be used once every two question rounds.
- DEFEND is active for `1s`.
- During that `1s`, DEFEND can absorb any kind of damage.
- After DEFEND is pressed, it cannot be used again for that question round or the next question round.
- Revenge gauge fills after every successful 5 hits.
- Correct answers do not reset the gauge while it is still accumulating.
- After the gauge accumulates 5 hits, it becomes active/live on the next question.
- A correct answer while revenge is active uses the revenge gauge for `100% DMG`, defined here as `2 x attack power`.
- Revenge attacks do not count as part of a streak.
- The subsequent normal successful attack starts the streak multiplier.
- When a player successfully attacks, the opponent HP bar should show HP deduction and a `-___ HP` value.
- HP can take decimal values.

#### Locked Outcomes

- Starting HP is `100 HP`.
- Question-round timeout/no-action means no valid answer before the `6s` question-round timer ends.
- Both players receive `SHOCK!` and lose `10 HP` if neither answers before the question round ends.
- Attack power timing is `1` to `30` over `5s`, then `30` held for `1s`.
- Normal damage is calculated from captured attack power and streak multiplier.
- Streak damage caps at `1.5x`.
- DEFEND has a `1s` active absorption window and a current-plus-next-question cooldown.
- Superseded by CJ-053: PRD 3.0 revenge was previously clarified as a 5-successful-hit self-filled gauge, active on the next question after filling.
- Revenge attack damage is `2 x attack power`.
- Revenge attacks do not advance streaks.
- HP and damage display may use decimals.

#### Remaining Unresolved Issues

- Whether PRD 3.0 inherits the PRD 1.0 `150ms` same-time answer threshold.
- Whether PRD 3.0 inherits the PRD 1.0 shared `Additional DMG` carryover model unchanged.
- Whether PRD 3.0 inherits the PRD 1.0 successful DEFEND stun duration of `1.5s`.
- Exact answer-order precedence when DEFEND, revenge, wrong answers, and same-time answers overlap.

#### Accepted Uncertainty

- No implementation-specific rounding rule for decimal HP is locked yet.

#### Warnings

[WARNING :: INTENT_CHANGE_DETECTED]

Superseded by CJ-053. Tier 2. The earlier PRD 3.0 revenge clarification changed the older PRD 1.0 revenge ownership model by filling revenge from the player's own successful hits. The human later corrected revenge ownership back to an incoming-hit comeback gauge.

#### Conversational Reflection Summary

The combat system is much less misty now. The duel has a clear 6-second question beat, a pressure curve from attack power 1 to 30, a capped streak ladder, a costly no-answer shock, a timed DEFEND shield, and, as later corrected by CJ-053, an incoming-hit revenge burst. The remaining crystalline bit is whether PRD 3.0 should inherit the old simultaneous-answer and stun details exactly.

---

<a id="cj-037"></a>

### CJ-037 - Inherited Same-Time, Additional DMG, And Stun Confirmation

#### Context

After CJ-036 surfaced inherited PRD 1.0 mechanics for same-time answers, `Additional DMG`, and successful DEFEND stun, the human confirmed that PRD 3.0 should inherit those rules unchanged.

#### Clarification Target

Close the inherited-mechanics ambiguity and make the inherited same-time, `Additional DMG`, and stun rules active PRD 3.0 combat truths.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

These rules affect answer timing resolution, carryover damage, DEFEND aftermath, runtime synchronization, and Live Match edge-case tests.

#### Prioritization Rationale

This was prioritized because CJ-036 had locked most combat numbers but left three inherited mechanics explicitly awaiting human authority. Without confirmation, implementation would still have to choose whether to inherit or replace those rules.

#### Traversal Layer

HOW.

The clarification stabilizes runtime behavior for the combat exchange.

#### Questions Asked

##### Active Clarification Question

Should PRD 3.0 inherit the PRD 1.0 same-time threshold, shared `Additional DMG`, and 1.5s DEFEND stun rules unchanged?

#### Human Responses

- The human answered: `yes`.

#### Locked Outcomes

- PRD 3.0 inherits the `150ms` same-time answer threshold.
- PRD 3.0 inherits shared `Additional DMG` carryover from same-time answers.
- PRD 3.0 inherits successful DEFEND stun as a `1.5s` attacker lockout.
- The inherited-mechanics unresolved issue is closed.

#### Remaining Unresolved Issues

- Exact answer-order precedence when DEFEND, revenge, wrong answers, and same-time answers overlap.
- Fight-round and match-end edge cases.
- CPU behavior profile probabilities and priority rules.
- Ready/Stop synchronization edge cases.

#### Accepted Uncertainty

- No new accepted uncertainty was added in this clarification.

#### Conversational Reflection Summary

This closes the biggest inherited-rule question cleanly. PRD 3.0 now has the old simultaneous-answer pressure mechanic, the shared carryover damage spike, and the successful DEFEND stun duration locked into the current combat model.

---

<a id="cj-038"></a>

### CJ-038 - DEFEND Versus Revenge Precedence

#### Context

After core combat numbers and inherited mechanics were stabilized, the next overlap question was whether active DEFEND should absorb revenge attacks.

#### Clarification Target

Clarify whether DEFEND beats revenge when a revenge attack lands during the defender's active DEFEND window.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

This affects Live Match damage resolution, revenge gauge consumption, DEFEND value, stun handling, and player-facing combat expectations.

#### Prioritization Rationale

This was prioritized because DEFEND and revenge are both high-impact combat states. If their precedence is ambiguous, implementation could either make DEFEND a true universal shield or allow revenge to pierce it, which would create very different gameplay.

#### Traversal Layer

HOW.

The clarification defines runtime precedence between two already-accepted combat mechanics.

#### Questions Asked

##### Active Clarification Question

Should DEFEND beat revenge, meaning if a defender has DEFEND active and a revenge attack lands during that 1-second DEFEND window, the revenge attack is fully absorbed and consumed?

#### Human Responses

- The human answered: `yes correct it should`.

#### Locked Outcomes

- Active DEFEND absorbs revenge attack damage.
- If a revenge attack lands into active DEFEND, the revenge gauge is consumed.
- The attacker is stunned for `1.5s`.
- No HP damage is applied from the blocked revenge attack.

#### Remaining Unresolved Issues

- Whether same-time correct answers override active DEFEND, or active DEFEND still absorbs incoming same-time attack damage.
- Exact wrong-answer precedence when the other player attacks or DEFENDs during the 1-second `MISSED!` vulnerability window.

#### Accepted Uncertainty

- No new accepted uncertainty was added in this clarification.

#### Conversational Reflection Summary

DEFEND is now confirmed as a real shield, not merely a normal-attack block. Even the comeback burst can be read, blocked, and converted into a stun window if the defender times it correctly.

---

<a id="cj-039"></a>

### CJ-039 - DEFEND Active Window Answer Lockout

#### Context

After DEFEND was confirmed to absorb revenge attacks, the next overlap question was whether same-time answers could occur while one player had DEFEND active.

The human clarified that a player with DEFEND active cannot answer during the DEFEND active window.

#### Clarification Target

Clarify whether DEFEND can overlap with answer submission from the defending player.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

This affects same-time answer resolution, DEFEND state handling, client input legality, and Live Match event ordering.

#### Prioritization Rationale

This was prioritized because allowing a player to answer while DEFEND is active would create a difficult overlap between shield state, attack ownership, same-time answer detection, and `Additional DMG`. The clarification simplifies the combat state machine and makes DEFEND a clear defense-only action.

#### Traversal Layer

HOW.

The clarification defines input legality during a timed combat state.

#### Questions Asked

##### Active Clarification Question

If both players answer correctly within the `150ms` same-time window, but one player has DEFEND active, should it still count as same-time `Additional DMG`, or should DEFEND absorb the incoming same-time attack and stun the other player?

#### Human Responses

- The human clarified that when a player has DEFEND active, they cannot answer.
- The human clarified that the player can answer only after the DEFEND active window has passed.

#### Locked Outcomes

- During a player's own `1s` DEFEND active window, that player cannot submit a valid answer.
- The player may answer only after the DEFEND active window has passed.
- Same-time answer resolution does not need to handle a defending player's simultaneous valid answer during active DEFEND, because that answer is not legal during the active DEFEND window.

#### Remaining Unresolved Issues

- Wrong-answer `MISSED!` vulnerability needs exact damage behavior.
- Fight-round and match-end edge cases.
- CPU behavior profile probabilities and priority rules.
- Ready/Stop synchronization edge cases.

#### Accepted Uncertainty

- No new accepted uncertainty was added in this clarification.

#### Conversational Reflection Summary

This makes DEFEND crisp: for one second, the player gives up answering in exchange for protection. That turns DEFEND into a deliberate timing commitment rather than a free shield layered on top of normal answering.

---

<a id="cj-040"></a>

### CJ-040 - MISSED Vulnerability Damage Behavior

#### Context

After DEFEND overlap was clarified, the remaining major exchange edge was the meaning of the `MISSED!` 1-second vulnerability window after a wrong answer.

#### Clarification Target

Clarify whether the wrong-answer vulnerability window increases incoming damage, or only prevents the missed player from acting and defending.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

This affects wrong-answer punishment, damage calculation, DEFEND legality, input lockout, and Live Match edge-case tests.

#### Prioritization Rationale

This was prioritized because `MISSED!` was already known to create a 1-second vulnerability window, but "vulnerability" could mean either extra incoming damage or loss of defensive agency. The distinction matters for damage balance and implementation.

#### Traversal Layer

HOW.

The clarification defines wrong-answer state behavior during active combat.

#### Questions Asked

##### Active Clarification Question

When a player gives a wrong answer and enters the 1-second vulnerability window, should an opponent attack during that window deal normal damage, bonus damage, or does the vulnerability only mean the missed player cannot act/defend during that 1 second?

#### Human Responses

- The human clarified that the missed player cannot act or DEFEND during that 1 second.
- The opponent can deal normal attack damage.
- There is no extra penalty damage multiplier for the missed player.

#### Locked Outcomes

- `MISSED!` creates a 1-second action lockout.
- During this lockout, the missed player cannot answer or DEFEND.
- Opponent attacks during this lockout deal normal attack damage.
- `MISSED!` does not add an extra damage multiplier or extra HP penalty.

#### Remaining Unresolved Issues

- Fight-round win, tie, Final round, and mutual-loss state transitions need exact implementation semantics.
- CPU behavior profile probabilities and priority rules.
- Ready/Stop synchronization edge cases.

#### Accepted Uncertainty

- No new accepted uncertainty was added in this clarification.

#### Conversational Reflection Summary

`MISSED!` now has a clean role: it punishes a wrong answer by removing agency for one second, not by secretly amplifying damage. That keeps the duel harsh without making a single bad input explode unpredictably.

---

<a id="cj-041"></a>

### CJ-041 - Fight-Round And Match Transition Semantics

#### Context

After core exchange mechanics were stabilized, the next clarification frontier moved to fight-round and match-end transitions.

#### Clarification Target

Confirm the exact fight-round winner rule, tied-round behavior, first-to-2 match win rule, Final round trigger, and mutual final-round loss behavior.

#### Ambiguity Severity

Tier 3 - Implementation destabilizing.

The product intent was already clear, but deterministic match reducers, persistence, and results display need exact state transitions.

#### Prioritization Rationale

This was prioritized because Live Match Service needs to know when a fight round ends, how to award round wins, when to continue, and when to produce a final match result.

#### Traversal Layer

HOW.

This clarification defines deterministic match progression.

#### Questions Asked

##### Active Clarification Question

At the end of a 60-second fight round, should the round winner be determined purely by higher remaining HP, with equal HP creating a tied fight round, first player to 2 fight-round wins winning the match, unresolved tied-round states entering Final round, and Final round tie causing both players to lose?

#### Human Responses

- The human answered: `yes`.

#### Locked Outcomes

- Fight-round winner is determined by higher remaining HP at the end of the 60-second fight round.
- Equal HP at fight-round end creates a tied fight round.
- Tied fight rounds do not award a fight-round win to either player.
- First player to 2 fight-round wins wins the match.
- If the match cannot resolve because of tied fight rounds, the match enters a Final round.
- If the Final round ends with equal HP, both players lose.

#### Remaining Unresolved Issues

- Stabilized combat and match-resolution rules need transfer into the normal PRD if `GAME_PRD_3.0.md` is meant to be the implementation source of truth.
- CPU behavior profile probabilities and priority rules.
- Ready/Stop synchronization edge cases.

#### Accepted Uncertainty

- Exact result copy and persistence field wording can be verified during PRD transfer or implementation handoff.

#### Conversational Reflection Summary

The duel now has a complete product-level spine from question exchange to match outcome: 6-second question beats feed 60-second fight rounds, fight rounds resolve by HP, the match resolves by first-to-2, and the Final round exists only to break unresolved tied-round paths.

---

<a id="cj-042"></a>

### CJ-042 - Core Gameplay Rule Transfer Into PRD 3.0

#### Context

After combat exchange rules and match-resolution semantics were stabilized in the constitutional state, the human asked whether these rules belong to a feature category and then approved transferring them into the PRD.

#### Clarification Target

Transfer stabilized combat and match-resolution rules into `GAME_PRD_3.0.md` as plain MVP implementation text.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

The constitutional state had become more precise than the normal PRD. For implementation handoff, the PRD needs the product-facing combat contract in its Core Gameplay section.

#### Prioritization Rationale

This was prioritized because `GAME_PRD_3.0.md` is intended to be the MVP implementation source of truth. Keeping detailed combat semantics only in KRYSTALIZE artifacts would force implementers to cross-read hidden reasoning artifacts for core game behavior.

#### Traversal Layer

WHAT, after HOW stabilization.

The rules were clarified first, then transferred into the product document.

#### Questions Asked

##### Active Clarification Question

Should the stabilized combat and match-resolution rules now be transferred from constitutional state into `GAME_PRD_3.0.md` plain-language MVP text?

#### Human Responses

- The human asked whether there is a feature category these rules belong to.
- Codex identified `A) Game Features -> i. Core Gameplay` as the primary category, with `F) Architecture Features -> Runtime Match State` as the secondary ownership/tracking reference.
- The human approved: `ok yes do that then`.

#### Locked Outcomes

- Stabilized combat and match-resolution rules were transferred into `GAME_PRD_3.0.md` under Core Gameplay.
- The transferred rules cover HP, question-round duration, attack power timing, damage, streaks, `MISSED!`, `SHOCK!`, same-time answers, `Additional DMG`, DEFEND, revenge, fight-round results, Final round, and mutual final-round loss.
- Runtime Match State now cross-references Core Gameplay rules for combat state tracking.

#### Remaining Unresolved Issues

- CPU behavior profile probabilities and priority rules.
- Ready/Stop synchronization edge cases.
- Implementation-specific reducer/test design.

#### Accepted Uncertainty

- Exact code structure and test fixtures remain implementation work.

#### Conversational Reflection Summary

The combat contract is no longer only crystallized in the reasoning layer. It now lives where implementers will naturally look first: Core Gameplay, with runtime architecture pointing back to it.

---

<a id="cj-043"></a>

### CJ-043 - Max CPU Behavior Clarification

#### Context

After Core Gameplay rules were transferred into the PRD, the active frontier moved to CPU behavior profiles for CPU Opponent Service implementation.

#### Clarification Target

Clarify Max's deterministic PvC behavior profile.

#### Ambiguity Severity

Tier 3 - Implementation destabilizing.

Max's profile affects CPU Opponent Service behavior, tutorial/early PvC balance, and test fixtures.

#### Prioritization Rationale

This was prioritized because Max is one of the first available Duel CPU opponents after tutorial and should provide a simple baseline CPU behavior before more specialized CPU profiles are clarified.

#### Traversal Layer

HOW.

The product identity is stable; this clarification defines CPU runtime behavior.

#### Questions Asked

##### Active Clarification Question

Should Max be a simple attacker with no DEFEND and no revenge, or should Max still use revenge when its 5-hit gauge fills?

#### Human Responses

- The human clarified that Max is a simple attacker.
- Max can use revenge.
- Max does not DEFEND.

#### Locked Outcomes

- Max is a simple attacker CPU.
- Max does not DEFEND.
- Max can use revenge when available.
- Max otherwise remains aligned with the existing profile: answers mostly in `2s` to `3s`, has constant `1.2x` damage, and cannot build streaks.

#### Remaining Unresolved Issues

- Min CPU behavior profile.
- Fury CPU behavior profile.
- Shi-eld CPU behavior profile.
- Peasy CPU behavior profile.
- Skore CPU behavior profile.
- Whether CPU behavior tables should be transferred into the PRD after stabilization.

#### Accepted Uncertainty

- Exact randomization implementation for "mostly in 2s to 3s" remains implementation work unless later clarified.

#### Conversational Reflection Summary

Max now has a clean teaching role: simple pressure, no blocking trickery, but still enough comeback threat to teach that revenge exists in ordinary combat.

---

<a id="cj-044"></a>

### CJ-044 - Min CPU Behavior Clarification

#### Context

After Max was clarified as the baseline simple attacker, the next CPU behavior profile was Min.

#### Clarification Target

Clarify Min's deterministic PvC behavior profile.

#### Ambiguity Severity

Tier 3 - Implementation destabilizing.

Min's behavior affects CPU Opponent Service, early PvC difficulty, and streak-pressure teaching.

#### Prioritization Rationale

This was prioritized because Min is available after tutorial and represents the first fast streak-pressure CPU profile.

#### Traversal Layer

HOW.

The clarification defines runtime CPU behavior.

#### Questions Asked

##### Active Clarification Question

Should Min use DEFEND and revenge, or is Min focused only on fast streak pressure with no DEFEND?

#### Human Responses

- The human clarified: `streak pressure with no defend`.

#### Locked Outcomes

- Min is focused on fast streak pressure.
- Min does not DEFEND.
- Min keeps the existing profile of attempting streaks 70% of the time and answering mostly in `1s` to `2s`.

#### Remaining Unresolved Issues

- Fury CPU behavior profile.
- Shi-eld CPU behavior profile.
- Peasy CPU behavior profile.
- Skore CPU behavior profile.
- Whether CPU behavior tables should be transferred into the PRD after stabilization.

#### Accepted Uncertainty

- Exact implementation of "attempts streaks 70% of the time" remains implementation work unless later clarified as a specific decision table.

#### Conversational Reflection Summary

Min is now cleanly differentiated from Max: faster, more streak-oriented, but still not a defensive CPU. The early CPU ladder now teaches basic attack pressure first, then faster streak pressure.

---

<a id="cj-045"></a>

### CJ-045 - Max And Min Behavior Label Exchange

#### Context

After Max and Min were initially clarified, the human corrected the naming assignment and stated that Max suits Min's streak-pressure profile better.

#### Clarification Target

Exchange the behavior labels for Max and Min while preserving the underlying two CPU behavior profiles.

#### Ambiguity Severity

Tier 3 - Implementation destabilizing.

The behavior itself is stable, but the display name/profile mapping affects CPU selection, unlock display, asset identity, test fixtures, and CPU Opponent Service configuration.

#### Prioritization Rationale

This correction was prioritized immediately because naming/profile mapping should be fixed before continuing to later CPU profiles. Otherwise Fury unlocks, CPU select display, and behavior configuration could bind to the wrong CPU identity.

#### Traversal Layer

WHAT.

The runtime behavior profiles were already clarified; this session corrects which CPU name owns which behavior.

#### Questions Asked

##### Active Clarification Question

Should Max and Min's behavior labels be exchanged because Max suits the streak-pressure profile better?

#### Human Responses

- The human said: `wait... exchange min and MAX's names.. MAx suits min's profile better.`

#### Locked Outcomes

- Max is now the streak-pressure CPU.
- Max attempts streaks 70% of the time.
- Max answers mostly in `1s` to `2s`.
- Max does not DEFEND.
- Min is now the simple attacker CPU.
- Min has constant `1.2x` damage.
- Min cannot build streaks.
- Min answers mostly in `2s` to `3s`.
- Min can use revenge.
- Min does not DEFEND.
- `GAME_PRD_3.0.md` CPU opponent profile table was updated to reflect the corrected mapping.

#### Remaining Unresolved Issues

- Fury CPU behavior profile.
- Shi-eld CPU behavior profile.
- Peasy CPU behavior profile.
- Skore CPU behavior profile.
- Whether CPU behavior tables should be transferred into the PRD after all CPU profiles stabilize.

#### Accepted Uncertainty

- Historical journal entries CJ-043 and CJ-044 are preserved as semantic history and superseded by this correction.

#### Warnings

[WARNING :: INTENT_CHANGE_DETECTED]

Tier 3. Max and Min behavior labels were exchanged after initial CPU behavior clarification. Earlier Max-simple-attacker and Min-streak-pressure wording is superseded by this correction.

#### Conversational Reflection Summary

The CPU ladder now reads more naturally: Max carries the bigger, faster streak-pressure identity, while Min becomes the simpler baseline attacker. The correction changes the name-to-profile mapping, not the underlying behavior ideas.

---

<a id="cj-046"></a>

### CJ-046 - Max/Min Timing And Fury Every-Question Revenge

#### Context

After Max and Min behavior labels were exchanged, the human refined their answer timing windows and clarified Fury's constant revenge state.

#### Clarification Target

Update Max and Min answer windows and clarify whether Fury's constant revenge state applies every question.

#### Ambiguity Severity

Tier 3 - Implementation destabilizing.

These values affect CPU Opponent Service timing, PvC difficulty tuning, and Fury's special combat behavior.

#### Prioritization Rationale

This was prioritized because CPU behavior tables need exact timing and special-rule semantics before they can be implemented or tested.

#### Traversal Layer

HOW.

The clarification defines concrete CPU runtime behavior.

#### Questions Asked

##### Active Clarification Question

How should Fury's constant revenge state work under the clarified PRD 3.0 revenge rules?

#### Human Responses

- For Min, change the answer window to `2.5s` to `3.5s`.
- For Max, change the answer window to `2s` to `3s`.
- For Fury, revenge should be for every question.

#### Locked Outcomes

- Max answers mostly in `2s` to `3s`.
- Min answers mostly in `2.5s` to `3.5s`.
- Fury's revenge state is active for every question.
- Fury does not use the normal revenge gauge fill/consume cycle.
- Fury can use revenge on every correct answer.
- `GAME_PRD_3.0.md` CPU opponent profile table was updated with these values.

#### Remaining Unresolved Issues

- Whether Fury's every-question revenge attack is still blocked by active DEFEND for that question, with Fury regaining revenge on the next question.
- Fury's strong blocking frequency.
- Fury's critical hit behavior at power 30.
- Shi-eld CPU behavior profile.
- Peasy CPU behavior profile.
- Skore CPU behavior profile.

#### Accepted Uncertainty

- Exact implementation of "mostly" for CPU answer windows remains implementation work unless later clarified as a probability distribution.

#### Conversational Reflection Summary

The early CPU timings now feel less extreme: Max pressures with streaks but not at a 1-second blur, while Min is clearly slower and simpler. Fury's identity becomes much sharper: every question is dangerous because revenge is always live.

---

<a id="cj-047"></a>

### CJ-047 - Fury Revenge Versus DEFEND

#### Context

After Fury's revenge state was clarified as active for every question, the remaining edge was whether active DEFEND blocks Fury's revenge attack for that question and whether Fury regains revenge on the next question.

#### Clarification Target

Clarify Fury's every-question revenge interaction with DEFEND.

#### Ambiguity Severity

Tier 3 - Implementation destabilizing.

This affects CPU Opponent Service, Live Match damage resolution, DEFEND teaching value, and Fury edge-case tests.

#### Prioritization Rationale

This was prioritized because the general combat rules already state DEFEND absorbs revenge, but Fury's every-question revenge could be interpreted as either unblockable/continuous or blockable per question. The CPU-specific rule needed explicit alignment with the general DEFEND rule.

#### Traversal Layer

HOW.

The clarification defines a CPU-specific override boundary.

#### Questions Asked

##### Active Clarification Question

Should Fury's every-question revenge attack still be blocked and consumed by active DEFEND for that question, with Fury regaining revenge on the next question?

#### Human Responses

- The human answered: `yes correct`.

#### Locked Outcomes

- Fury's every-question revenge attack can be blocked by active DEFEND.
- When blocked by DEFEND, Fury's revenge attack is absorbed for that question.
- Fury is stunned according to normal successful DEFEND rules.
- Fury's revenge state is active again on the next question.

#### Remaining Unresolved Issues

- Fury's strong blocking frequency.
- Fury's critical-hit-at-power-30 behavior.
- Shi-eld CPU behavior profile.
- Peasy CPU behavior profile.
- Skore CPU behavior profile.

#### Accepted Uncertainty

- No new accepted uncertainty was added in this clarification.

#### Conversational Reflection Summary

Fury remains scary every question, but not unfairly supernatural. DEFEND still works: it can stop the revenge blow, create the stun, and buy the player a breath before Fury comes back burning on the next prompt.

---

<a id="cj-048"></a>

### CJ-048 - Fury Blocking And Critical-Hit Inheritance

#### Context

The human asked Codex to check existing documentation for Fury's strong blocking and critical-hit behavior.

#### Clarification Target

Identify existing Fury block and critical-hit rules and carry them into PRD 3.0 where stable.

#### Ambiguity Severity

Tier 3 - Implementation destabilizing.

Fury's block frequency and critical-hit behavior affect CPU Opponent Service decisions, Live Match damage, and PvC difficulty.

#### Prioritization Rationale

This was prioritized because inherited documentation already contained detailed Fury behavior, and KRYSTALIZE should reuse stable prior intent rather than asking the human to re-invent numbers.

#### Traversal Layer

HOW.

This session imports inherited runtime behavior into the current PRD 3.0 context.

#### Questions Asked

##### Active Clarification Question

Is there existing documentation for Fury's strong blocking frequency and critical-hit-at-power-30 behavior?

#### Human Responses

- The human asked Codex to check existing documentation.
- The human then said `ok continue`, accepting the inherited Fury details as the next stabilization path.

#### Locked Outcomes

- Fury blocks incoming attacks 80% of the time.
- Fury gets hit 20% of the time.
- Fury attempts to take advantage of the player's `MISSED!` vulnerability window.
- After successfully blocking, Fury attempts to maximize attack damage at attack power `30`.
- Fury has a 50% chance to score a critical hit when attacking at power `30`.
- Fury critical hit damage is `attackPower x 3`.
- Fury critical hit is displayed as `+200% DMG`.
- Example: attack power `30` critical hit deals `90` damage.
- `GAME_PRD_3.0.md` CPU opponent profile table was updated with these values.

#### Remaining Unresolved Issues

- Shi-eld CPU behavior profile.
- Peasy CPU behavior profile.
- Skore CPU behavior profile.
- Whether all CPU behavior tables should be consolidated into PRD text after stabilization.

#### Accepted Uncertainty

- Exact implementation of "attempts to take advantage" remains a behavior-priority rule unless later converted into a timing/probability table.

#### Conversational Reflection Summary

Fury no longer needs fresh numbers. The inherited profile already made him a gatekeeper: hard questions, permanent revenge pressure, high block chance, and a power-30 critical threat.

---

<a id="cj-049"></a>

### CJ-049 - Shi-eld Behavior Inheritance

#### Context

After Fury inherited its detailed block and critical behavior, Codex checked existing documentation for Shi-eld and surfaced the inherited block-specialist profile.

#### Clarification Target

Confirm whether PRD 3.0 should inherit Shi-eld's existing block-specialist behavior.

#### Ambiguity Severity

Tier 3 - Implementation destabilizing.

Shi-eld's profile affects CPU Opponent Service block decisions, timing weakness behavior, surprise attacks, and PvC difficulty.

#### Prioritization Rationale

This was prioritized because Shi-eld is the next CPU after Fury in the progression chain, and existing documents already contain deterministic behavior numbers.

#### Traversal Layer

HOW.

This session imports inherited runtime behavior into PRD 3.0.

#### Questions Asked

##### Active Clarification Question

Should PRD 3.0 inherit Shi-eld behavior exactly from existing documentation?

#### Human Responses

- The human answered: `yes`.

#### Locked Outcomes

- Shi-eld blocks player attacks 90% of the time.
- Shi-eld attacks after successful blocks.
- Shi-eld does not block attacks after the `2.5s` mark 90% of the time.
- Shi-eld prefers taking end-of-turn damage over attacking 90% of the time.
- Shi-eld surprise-attacks 10% of the time.
- `GAME_PRD_3.0.md` CPU opponent profile table was updated with these values.

#### Remaining Unresolved Issues

- Peasy CPU behavior profile.
- Skore CPU behavior profile.
- Whether all CPU behavior tables should be consolidated into PRD text after stabilization.

#### Accepted Uncertainty

- Whether Shi-eld's `2.5s` weakness applies to every attack type or only normal answered attacks remains inherited as an implementation edge unless later reopened.

#### Conversational Reflection Summary

Shi-eld now has a crisp defensive puzzle: brute speed runs into the shield, patience past 2.5 seconds exposes it, and the occasional surprise attack keeps the fight from becoming fully static.

---

<a id="cj-050"></a>

### CJ-050 - Peasy Behavior Inheritance

#### Context

After Shi-eld was confirmed, Codex surfaced the inherited Peasy expert-streak behavior from existing documentation.

#### Clarification Target

Confirm whether PRD 3.0 should inherit Peasy's existing expert streak behavior.

#### Ambiguity Severity

Tier 3 - Implementation destabilizing.

Peasy's profile affects CPU Opponent Service answer timing, block decisions, streak pressure, and PvC difficulty.

#### Prioritization Rationale

This was prioritized because Peasy is the next CPU in the progression chain and existing documents already contain usable behavior values.

#### Traversal Layer

HOW.

This session imports inherited runtime behavior into PRD 3.0.

#### Questions Asked

##### Active Clarification Question

Should PRD 3.0 inherit Peasy behavior exactly from existing documentation?

#### Human Responses

- The human answered: `yes`.

#### Locked Outcomes

- Peasy is an expert streak fighter.
- Peasy constantly uses streaks to damage opponents.
- Peasy answers in `0s` to `1s` 80% of the time.
- Peasy blocks player attacks 50% of the time.
- Peasy blocks attempts to break its streak rhythm.
- Peasy attempts to take advantage of the player's `MISSED!` vulnerability window.
- `GAME_PRD_3.0.md` CPU opponent profile table was updated with these values.

#### Remaining Unresolved Issues

- Skore CPU behavior profile.
- Whether all CPU behavior tables should be consolidated into PRD text after stabilization.

#### Accepted Uncertainty

- Peasy fallback behavior outside the 80% fast-answer pattern remains implementation work unless later reopened.

#### Conversational Reflection Summary

Peasy now has its intended pressure identity in PRD 3.0: fast answers, repeated streak threat, and enough blocking to keep the player from easily interrupting the barrage.

---

<a id="cj-051"></a>

### CJ-051 - Skore Behavior Inheritance

#### Context

After Peasy was confirmed, Codex surfaced inherited Skore behavior from existing documentation.

#### Clarification Target

Confirm whether PRD 3.0 should inherit Skore's existing boss-like adaptive behavior.

#### Ambiguity Severity

Tier 3 - Implementation destabilizing.

Skore's profile affects CPU Opponent Service state, question generation, answer timing, block behavior, revenge behavior, and final CPU difficulty.

#### Prioritization Rationale

This was prioritized because Skore is the final CPU profile and existing documents already contain detailed behavior rules.

#### Traversal Layer

HOW.

This session imports inherited runtime behavior into PRD 3.0.

#### Questions Asked

##### Active Clarification Question

Should PRD 3.0 inherit Skore behavior exactly from existing documentation?

#### Human Responses

- The human answered: `yes`.

#### Locked Outcomes

- Skore has `200 HP`.
- Skore always uses hard questions.
- Skore does not use PvP-only `?` mode.
- Skore changes question type randomly every 3 questions among addition, subtraction, and mixed addition/subtraction.
- Skore activates revenge after receiving 1 hit.
- Skore starts at `1.2x` attack.
- Skore tries to attack using streaks 70% of the time.
- When Skore has revenge, Skore tries to block a player attack and then score maximum damage.
- Skore's maximum damage target means trying to score attack power `30`.
- When Skore does not have revenge, Skore answers in `0s` to `1.5s` 80% of the time for streak damage.
- In the remaining 20%, Skore blocks.
- Skore's block has no recovery.
- Skore can block repeatedly without penalty.
- Skore's no-recovery repeated block is CPU-specific and does not change player DEFEND rules.
- `GAME_PRD_3.0.md` CPU opponent profile table was updated with these values.

#### Remaining Unresolved Issues

- Whether the completed CPU behavior profile table should be treated as implementation-ready or whether remaining CPU edge cases should be clarified before backend work.
- Ready/Stop synchronization edge cases.

#### Accepted Uncertainty

- Exact implementation of CPU randomization and state-machine priority remains implementation work unless later reopened.

#### Conversational Reflection Summary

The six CPU roster now has a complete behavior ladder: baseline pressure, streak pressure, revenge/block pressure, shield timing, expert streak barrages, and Skore's capstone blend of hard questions, mode shifts, revenge, streaks, and repeated blocks.

---

<a id="cj-052"></a>

### CJ-052 - CPU Profile Implementation-Readiness Confirmation

#### Context

After all six CPU profiles were clarified and transferred into PRD 3.0, Codex asked whether the completed CPU behavior table should be treated as implementation-ready or whether additional CPU edge cases should be clarified first.

#### Clarification Target

Confirm readiness of the PRD 3.0 CPU behavior profile table for backend implementation.

#### Ambiguity Severity

Tier 3 - Implementation destabilizing.

This affects whether KRYSTALIZE should continue descending into CPU edge cases or move to the next implementation-facing ambiguity.

#### Human Responses

- The human answered: `yes`.

#### Locked Outcomes

- The completed CPU behavior profile table is implementation-ready as-is.
- Remaining CPU micro-edge cases are deferred to backend implementation unless they surface as blockers.
- The active clarification frontier moves to Ready/Stop synchronization edge cases.

#### Remaining Unresolved Issues

- Ready/Stop synchronization edge cases before Matchmaking Service implementation.

#### Accepted Uncertainty

- Exact CPU randomization implementation and test fixture design remain implementation work.

#### Conversational Reflection Summary

The CPU roster is stable enough to build against. KRYSTALIZE can now stop polishing CPU personalities and move to the next runtime boundary.

<a id="cj-053"></a>

### CJ-053 - Revenge Comeback Ownership And Gameplay HUD Contract

#### Context

After CPU profiles were stabilized, the human identified that the Active Match frontend display needed a dedicated gameplay presentation contract for Excalibur implementation.

While describing the HUD, the human also clarified that revenge should fill for the player who is being hit, not from the player's own successful attacks.

#### Clarification Target

Clarify revenge gauge ownership and transfer the Active Match HUD display expectations into PRD 3.0.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

Revenge ownership affects combat state, CPU behavior, comeback balancing, player feedback, HUD animation, and damage-resolution tests.

#### Prioritization Rationale

This clarification was prioritized because the new HUD description exposed a direct conflict with the earlier PRD 3.0 revenge clarification. Leaving both meanings in place would cause Live Match Service and Excalibur HUD implementation to disagree about whose meter fills when an attack lands.

#### Traversal Layer

HOW.

The product purpose remains stable; this session corrects how comeback pressure is represented and displayed during combat.

#### Questions Asked

##### Active Clarification Question

When you say revenge gauge fills as the player is hit, are you changing the rule from PRD 3.0's own-successful-hit fill to incoming-hit fill, or should the HUD show the gauge filling when the player lands successful attacks?

##### Adjacent Branches Tracked Internally

- Whether `CRITICAL!` is a visual callout or a normal damage modifier.
- Whether `TIE-BREAKER!` refers to the question after `DRAW!` / `Additional DMG` or to Final round match resolution.
- How state status bars should represent immobilizing and momentary feedback states.
- Whether Active Match should show fight score or only fight-round timer / match phase.

##### Blocked Questions

- Exact visual timing for attack and hit animation polish remains implementation work.
- Exact Excalibur component hierarchy remains implementation work.

#### Human Responses

- Revenge is option 2: it fills when the player gets hit.
- Revenge is purely to give the hit player an advantage.
- Revenge should show the hit player that they have a chance of a comeback.
- Active gameplay should not show fight score for MVP.
- Player side HUD should include an attack status indicator with streak multiplier and revenge gauge.
- Revenge gauge should be 5 blocks and fill as the player is hit.
- Revenge gauge starts yellow, becomes angry orange as it fills, and glows/throbs orange at full power.
- State status bar should show `MISSED!`, `SHOCK!`, `DEFEND`, and stunned/immobilized states.
- Immobilizing states should use a countdown shown by a receding bar.
- DEFEND button should be colored/bold when available and greyed/translucent when unavailable.
- Center HUD should show the shared attack power bar, large aggressive question prompt, and separate colored P1/P2 answer displays.
- Answer displays accept only numbers and `-`.
- Enter resolves the question with attack animation, hit animation, `-HP` animation, and HP bar deduction.
- HP bar color ranges are yellow `70%` to `100%`, orange `35%` to `69%`, and red `0%` to `34%`.
- Lower area should show a small quit button at lower left.
- Overlay layer should show `Revenge ATT!`, `CRITICAL!`, `DEFENDER!`, `DRAW!`, and `TIE-BREAKER!`.

#### Locked Clarifications

- PRD 3.0 revenge gauge fills when the player receives successful hits from the opponent.
- Revenge is a comeback mechanic for the hit player, not a self-filled reward for landing attacks.
- The earlier self-filled revenge rule is superseded.
- Active Match needs a dedicated HUD presentation contract under Visual Presentation Features.
- The HUD contract includes no active-play fight score, player-side DEFEND/status/HP bars, two-row attack status bars, 5-block incoming-hit revenge gauge, receding bars for immobilizing states, center attack power and answer displays, lower quit button, and overlay callouts.
- `CRITICAL!` is treated as a presentation callout unless a specific combat rule assigns extra damage.
- `TIE-BREAKER!` is tied to the first player who wins the next question after `DRAW!` / `Additional DMG` carryover.

#### Transferred To PRD

- `docs/game/GAME_PRD_3.0.md` Core Gameplay now states revenge fills from incoming successful hits.
- `docs/game/GAME_PRD_3.0.md` CPU profiles now align Max, Min, and Skore with the incoming-hit revenge gauge.
- `docs/game/GAME_PRD_3.0.md` Visual Presentation Features now includes `Gameplay Screen / HUD Presentation Contract`.
- `docs/game/GAME_PRD_3.0.md` Active Match page behavior now points to the HUD contract and removes active-play fight score display.

#### Warnings

`[WARNING :: INTENT_CHANGE_DETECTED]`

Tier 2. The human corrected PRD 3.0 revenge ownership from self-filled successful hits to incoming-hit comeback gauge. The earlier self-filled rule is superseded. Core Gameplay, CPU profiles, HUD display, and revenge implementation must use incoming successful hits as the gauge source.

#### Accepted Uncertainty

- Exact animation frame timing remains implementation polish.
- Exact HUD component layout, responsive breakpoints, and Excalibur scene graph are implementation work.

#### Conversational Reflection Summary

This correction makes revenge feel much more like its name: a visible comeback fuse for the player under pressure. The HUD now has a stronger emotional job too: it should tell the losing player, block by block, that the fight is not over yet.

<a id="cj-054"></a>

### CJ-054 - Additional DMG Amount And Clearing Rule

#### Context

After the Active Match HUD contract introduced `DRAW!` and `TIE-BREAKER!` overlays, the remaining same-time-answer gap was the exact amount and lifecycle of the shared `Additional DMG` carryover.

Earlier inherited rules already confirmed the `150ms` same-time window and that `Additional DMG` is one shared carryover value, but the precise amount and clearing rule still needed implementation-level clarity.

#### Clarification Target

Define how much `Additional DMG` is created by `DRAW!`, how it modifies the next exchange, and when it clears.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

This affects Live Match damage calculation, answer ordering, DEFEND interaction, revenge interaction, HUD overlays, and deterministic PvP synchronization tests.

#### Prioritization Rationale

This clarification was prioritized because `Additional DMG` was already referenced in Core Gameplay and HUD feedback. Without an amount and clearing rule, the backend could not implement deterministic damage and the frontend could not reliably show `TIE-BREAKER!`.

#### Traversal Layer

HOW.

The product purpose remains stable; this session clarifies how same-time tension converts into the next exchange's damage.

#### Questions Asked

##### Active Clarification Question

When `DRAW!` creates `Additional DMG`, should `Additional DMG = captured attack power at the DRAW moment`, and should the next question winner deal `normal/revenge damage + Additional DMG`, after which the carryover clears whether it lands, is blocked by DEFEND, or times out?

##### Adjacent Branches Tracked Internally

- Whether `TIE-BREAKER!` should be tied to the next exchange after `DRAW!`.
- Whether `Additional DMG` should stack with normal and revenge attacks.
- Whether DEFEND should consume the carryover if it blocks the next exchange.
- Whether timeout should clear the carryover.

##### Blocked Questions

- Exact server event names for `DRAW!`, `Additional DMG armed`, `TIE-BREAKER!`, and `Additional DMG cleared` remain implementation work.

#### Human Responses

- The human confirmed the recommended rule with `yes`.

#### Locked Clarifications

- `Additional DMG` equals the captured attack power at the `DRAW!` / same-time moment.
- On the next question round, the player who wins the exchange first receives `TIE-BREAKER!`.
- The `TIE-BREAKER!` winner deals `normal/revenge damage + Additional DMG`.
- `Additional DMG` clears after that next exchange whether it lands, is blocked by DEFEND, or times out.

#### Transferred To PRD

- `docs/game/GAME_PRD_3.0.md` Core Gameplay now defines the `Additional DMG` amount, stacking rule, `TIE-BREAKER!` relationship, and clearing rule.

#### Warnings

None.

#### Accepted Uncertainty

- Exact event names and packet shapes remain implementation work.

#### Conversational Reflection Summary

`DRAW!` now has teeth without becoming messy. Same-time answers bank the shared pressure of the moment, and the next exchange becomes a clean little duel-within-the-duel: win it first, claim the extra hit, then clear the slate.

<a id="cj-055"></a>

### CJ-055 - Question Turnover And Prompt Construction Timing

#### Context

After `Additional DMG` was clarified, the next exchange-lifecycle gap was when the next question appears and when the attack timer starts.

#### Clarification Target

Define question turnover, prompt construction animation, and attack timer start timing.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

This affects Live Match timing, client/server synchronization, attack power start time, timeout clocks, CPU answer timing, and Excalibur prompt animation.

#### Prioritization Rationale

This clarification was prioritized because the `6s` question timer and attack power gauge cannot be deterministic unless implementation knows whether timing starts at question creation, first visible prompt item, or full prompt completion.

#### Traversal Layer

HOW.

The product purpose remains stable; this session clarifies how the game creates a short between-question breath without making the timer unfair.

#### Questions Asked

##### Active Clarification Question

When exactly should the next question appear after attacks, blocks, `MISSED!`, `SHOCK!`, `DRAW!`, and timeouts, and when should the attack timer start?

##### Adjacent Branches Tracked Internally

- Whether question construction is gameplay time or pre-question presentation time.
- Whether attack power starts during prompt animation or after full prompt visibility.
- Whether prompt item movement should be deterministic or random.
- How the short break between questions should feel.

##### Blocked Questions

- Exact animation duration per prompt item remains implementation work unless later clarified.
- Exact server event names for question-created, prompt-animation-started, and question-round-started remain implementation work.

#### Human Responses

- The next question appears immediately after a question is answered.
- The first number flies in from the top or bottom.
- The operator follows.
- Additional prompt items continue one by one until the question is complete.
- Each item has a 50-50 chance to fly in from the top or bottom.
- The delay from question construction acts as a short break between questions.
- The attack timer starts after the appearance of the last item.

#### Locked Clarifications

- The next question appears immediately after the previous question is answered / resolved.
- The visible prompt is constructed item by item.
- The construction order is first number, operator, next number, and so on until the full prompt is visible.
- Each prompt item independently has a 50% chance to fly in from the top and a 50% chance to fly in from the bottom.
- Prompt construction is a short break between question rounds.
- The `6s` question round timer and attack power movement start only after the final prompt item has appeared.

#### Transferred To PRD

- `docs/game/GAME_PRD_3.0.md` Core Gameplay now defines question turnover and timer start rules.
- `docs/game/GAME_PRD_3.0.md` Gameplay Screen / HUD Presentation Contract now defines prompt construction animation behavior.

#### Warnings

None.

#### Accepted Uncertainty

- Exact animation duration and easing remain implementation polish.
- Exact server/client event names remain implementation work.

#### Conversational Reflection Summary

This gives the duel a tiny inhale between blows. The next problem arrives right away, but it assembles with style, and nobody's attack clock starts until both players can actually read the whole thing.

<a id="cj-056"></a>

### CJ-056 - Authoritative Answer Ordering

#### Context

After question turnover and timer start were clarified, the next exchange-lifecycle gap was how Live Match should order answers and reject inputs when player states prevent action.

#### Clarification Target

Define authoritative answer/action ordering for Live Match Service.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

This affects PvP fairness, same-time answer detection, DEFEND legality, `MISSED!` lockouts, stun lockouts, timeout behavior, CPU simulation, and synchronization tests.

#### Prioritization Rationale

This clarification was prioritized because client-side arrival time or local animation timing cannot be allowed to decide attacks in PvP. The server needs one ordering authority and a clear action-eligibility rule.

#### Traversal Layer

HOW.

The product purpose remains stable; this session clarifies how the server decides whose answer counts.

#### Questions Asked

##### Active Clarification Question

Should Live Match Service be authoritative, assign server receive timestamps to submitted actions, allow valid correct answers to claim attacks only when the player can act, use server timestamps for `150ms` same-time detection, reject/ignore inputs during active DEFEND, `MISSED!`, or `STUNNED`, reject answers after the `6s` timer, and resolve one valid correct answer normally when the opponent does nothing?

##### Adjacent Branches Tracked Internally

- Whether server or client timestamps decide same-time answers.
- Whether disabled-state answers are ignored, rejected, or queued.
- Whether late answers after timeout can still count.
- Whether one valid correct answer before timeout resolves normally if the opponent does nothing.

##### Blocked Questions

- Exact event names and error/ack payloads for ignored/rejected answers remain implementation work.
- Exact timeout resolution order when one player is locked out and the other does nothing remains a possible later edge if implementation exposes it.

#### Human Responses

- The human confirmed the recommended rule with `yes`.

#### Locked Clarifications

- Live Match Service is authoritative for answer/action ordering.
- Each submitted gameplay action receives a server receive timestamp.
- A valid correct answer can claim an attack only if the player is allowed to act at that server moment.
- Same-time answers use server receive timestamps.
- If both valid correct answers arrive within `150ms`, the exchange is `DRAW!` and creates `Additional DMG`.
- If one player is in active DEFEND, `MISSED!` lockout, or `STUNNED`, that player's answer input is ignored or rejected until that state ends.
- If an answer arrives after the `6s` question round timer ends, it does not count.
- If one valid correct answer arrives before timeout and the other player does nothing, the correct answer resolves normally.

#### Transferred To PRD

- `docs/game/GAME_PRD_3.0.md` Core Gameplay now includes authoritative answer ordering rules.

#### Warnings

None.

#### Accepted Uncertainty

- Exact server event names and client acknowledgement/error payloads remain implementation work.

#### Conversational Reflection Summary

This locks the referee. Players can be fast, animations can be loud, networks can be uneven, but the match has one judge: the server timestamp plus the player's real ability to act in that moment.

<a id="cj-057"></a>

### CJ-057 - Timeout Clock Behavior During Lockouts

#### Context

After authoritative answer ordering was clarified, the remaining timeout-clock ambiguity was whether active DEFEND, `MISSED!`, or `STUNNED` pause the `6s` question timer.

#### Clarification Target

Define whether lockout states pause question timing and how timeout resolves when players are locked out.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

This affects Live Match timer logic, CPU behavior timing, lockout value, timeout/shock resolution, and PvP synchronization tests.

#### Prioritization Rationale

This clarification was prioritized because pausing the question timer during lockouts would create a very different combat rhythm and would complicate server/client timing. The implementation needs to know whether lockouts are part of live question time or separate pauses.

#### Traversal Layer

HOW.

The product purpose remains stable; this session clarifies how status lockouts interact with live question time.

#### Questions Asked

##### Active Clarification Question

Should the `6s` question timer keep running during `DEFEND`, `MISSED!`, and `STUNNED`, with prompt construction as the only non-gameplay pause, locked-out players having no valid answer at timer end, both no-answer causing `SHOCK! -10 HP`, and one prior valid correct answer resolving normally even if the opponent is locked out or does nothing?

##### Adjacent Branches Tracked Internally

- Whether DEFEND active time pauses the question timer.
- Whether `MISSED!` lockout pauses the question timer.
- Whether `STUNNED` pauses the question timer.
- Whether lockout at timer end counts as no valid answer.
- Whether a prior valid correct answer resolves normally if the opponent is locked out or inactive.

##### Blocked Questions

- DEFEND/revenge interruption resolution edge cases remain the next exchange-lifecycle ambiguity.

#### Human Responses

- The human confirmed the recommended rule with `yes`.

#### Locked Clarifications

- The `6s` question timer keeps running during active DEFEND, `MISSED!` lockout, and `STUNNED`.
- Active DEFEND, `MISSED!`, and `STUNNED` do not pause the question timer.
- Prompt construction time is the only non-gameplay pause before the `6s` timer starts.
- If a player is locked out when the timer ends, that player has no valid answer for that question.
- If both players have no valid answer by timer end, both receive `SHOCK!` and lose `10 HP`.
- If one player submitted a valid correct answer before timer end, that answer resolves normally even if the opponent is locked out or does nothing.

#### Transferred To PRD

- `docs/game/GAME_PRD_3.0.md` Core Gameplay now defines timeout-clock behavior during lockouts.

#### Warnings

None.

#### Accepted Uncertainty

- Resolved by CJ-058: DEFEND/revenge interruption resolution is now clarified for MVP.

#### Conversational Reflection Summary

Lockouts now have bite because the clock keeps moving. The game does not stop to wait for a player who defended, missed, or got stunned; that time is part of the pressure.

<a id="cj-058"></a>

### CJ-058 - DEFEND Interruption And Stacked Damage Handling

#### Context

After timeout-clock behavior was clarified, the last open exchange-lifecycle edge was how DEFEND interrupts incoming attacks, especially revenge and `Additional DMG` stacked onto a `TIE-BREAKER!` attack.

#### Clarification Target

Define when DEFEND is checked, what damage types it blocks, whether late DEFEND can retroactively block, and whether blocked `Additional DMG` remains armed.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

This affects Live Match damage resolution, DEFEND value, revenge gauge consumption, `Additional DMG` lifecycle, stun behavior, HUD callouts, and deterministic PvP synchronization tests.

#### Prioritization Rationale

This clarification was prioritized because DEFEND, revenge, and `Additional DMG` are all high-impact combat states. Without one damage-land checkpoint rule, implementation could allow retroactive blocks, preserve blocked carryover damage, or disagree about whether DEFEND blocks stacked damage.

#### Traversal Layer

HOW.

The product purpose remains stable; this session clarifies exactly how the defensive interrupt works.

#### Questions Asked

##### Active Clarification Question

Should DEFEND be checked at the moment incoming damage would land, absorb incoming damage if active, fail to retroactively block if pressed after the attack already landed, block normal damage, revenge damage, and `Additional DMG` stacked onto the attack, consume blocked revenge, stun the attacker for `1.5s`, and clear blocked `Additional DMG` after its one next-exchange chance?

##### Clarification Explanation

The human asked what it means for `Additional DMG` to still clear.

Codex explained that if `DRAW!` creates `Additional DMG`, the bonus is armed only for the next exchange. If the next exchange creates a `TIE-BREAKER!` attack and DEFEND blocks it, the bonus is used up anyway and does not remain armed for a later question.

##### Adjacent Branches Tracked Internally

- Whether DEFEND checks on button press, answer claim, animation start, or damage-land moment.
- Whether DEFEND can retroactively block after damage has landed.
- Whether DEFEND blocks stacked `Additional DMG`.
- Whether blocked `Additional DMG` stays armed or clears.
- Whether blocked revenge is consumed.

##### Blocked Questions

- None for MVP exchange lifecycle.

#### Human Responses

- The human asked what `Additional DMG` still clears means.
- After explanation, the human confirmed the rule with `yes correct`.

#### Locked Clarifications

- DEFEND is checked at the moment incoming damage would land.
- If DEFEND is active at that moment, it absorbs the incoming damage.
- If DEFEND is not active at that moment, the attack lands normally.
- If a player presses DEFEND after the attack has already landed, DEFEND does not retroactively block.
- DEFEND can block normal damage, revenge damage, and `Additional DMG` stacked onto that attack.
- If the incoming attack is revenge, the revenge gauge is consumed.
- The attacker is stunned for `1.5s`.
- The defender takes `0 HP` damage.
- If DEFEND blocks a `TIE-BREAKER!` attack with `Additional DMG`, the `Additional DMG` carryover still clears.

#### Transferred To PRD

- `docs/game/GAME_PRD_3.0.md` Core Gameplay now defines DEFEND interruption and stacked damage handling.
- `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` now marks the exchange timing ambiguity as closed.

#### Warnings

None.

#### Accepted Uncertainty

- Exact animation frame that represents damage-land moment remains implementation polish, as long as server resolution uses the same logical checkpoint.

#### Conversational Reflection Summary

DEFEND now has a crisp timing identity: it is not a time machine, it is a live shield. If it is up when the blow arrives, it catches everything in that blow. If the blow already landed, the chance is gone.

<a id="cj-059"></a>

### CJ-059 - Ready Stop Synchronization

#### Context

After the combat exchange lifecycle was closed, the remaining implementation-facing frontier in the constitutional state was Ready/Stop synchronization for Matchmaking Service.

#### Clarification Target

Define authoritative Ready/Stop ownership, countdown reset behavior, ready timeout behavior, pre-match leave/disconnect handling, and the boundary between pre-match Stop and active-match quit/disconnect.

#### Ambiguity Severity

Tier 3 - Implementation destabilizing.

This affects Matchmaking Service state, Redis ready-state coordination, Challenge / Ready UI, room release, and transition into Live Match Service.

#### Prioritization Rationale

This clarification was prioritized because existing PRD wording defined player-facing Ready, Stop, countdown, and auto-start behavior, but did not define synchronization edge cases such as one-player Ready, Stop during countdown, leave/disconnect before match start, and when Stop stops being available.

#### Traversal Layer

HOW.

The product purpose remains stable; this session clarifies how the pre-match ready state machine should run.

#### Questions Asked

##### Active Clarification Question

Should Matchmaking Service be authoritative for Ready/Stop state, start the 30-second Ready window when both players arrive, mark one player Ready independently, start the 5-second countdown when both are Ready, let Stop during countdown cancel countdown and reset both players to Not Ready with a fresh 30-second window, auto-start on 30-second timeout even if neither player pressed Ready, cancel/release the room if a player leaves before Active Match starts, and remove Stop once Active Match starts?

##### Adjacent Branches Tracked Internally

- One-player Ready state.
- Stop during match-start countdown.
- Ready timeout when neither player presses Ready.
- Challenge / Ready disconnect or leave before Active Match.
- Boundary between pre-match Stop and active-match quit/disconnect.

##### Blocked Questions

- None for MVP Ready/Stop behavior.

#### Human Responses

- The human confirmed the recommended Ready/Stop synchronization rule with `yes`.

#### Locked Clarifications

- Matchmaking Service is authoritative for Ready / Stop state before Active Match starts.
- The 30-second Ready window starts when both players arrive on the Challenge / Ready page.
- If one player presses Ready, that player's state becomes Ready while the other remains Not Ready.
- If both players are Ready before 30 seconds, the 5-second match countdown starts.
- During the 5-second match countdown, pressing Stop cancels the countdown and resets both players to Not Ready with a fresh 30-second Ready window.
- If 30 seconds expires, auto-start happens even if neither player pressed Ready.
- If a player disconnects or leaves the Challenge / Ready page before Active Match starts, the room is cancelled/released and the remaining player returns to the previous PvP page with `Opponent left.`
- Once Active Match starts, Stop is no longer available.
- After Active Match starts, quit/disconnect uses the PvP reconnect / void flow.

#### Transferred To PRD

- `docs/game/GAME_PRD_3.0.md` Ready State feature now defines Ready/Stop synchronization.
- `docs/game/GAME_PRD_3.0.md` PvP Ready / Match Start Flow now defines the same behavior.
- `docs/game/GAME_PRD_3.0.md` Challenge / Ready page now defines the same behavior.
- `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` now marks Ready/Stop synchronization as closed.

#### Warnings

None.

#### Accepted Uncertainty

- Exact Redis key names, TTLs, and WebSocket event names remain implementation work.

#### Conversational Reflection Summary

Ready/Stop now has one owner and one rhythm: wait together, count down together, reset together, or start anyway when the window expires. Once the fight begins, the softer pre-match reset gives way to the stricter reconnect/void rules.

<a id="cj-060"></a>

### CJ-060 - Core Combat Ambiguity Closure Reconciliation

#### Context

After Ready/Stop synchronization was closed, the constitutional state still had two stale open entries saying core combat was not numerically resolvable.

#### Clarification Target

Reconcile the unresolved-issue and warning registries with the locked combat clarifications from CJ-036 through CJ-058.

#### Ambiguity Severity

Tier 2 - Structural dependency destabilizing.

Leaving stale open warnings would mislead implementation agents into thinking core combat still lacked numeric rules.

#### Prioritization Rationale

This reconciliation was prioritized because the active frontier already said no MVP combat/ready implementation blocker remained, while the unresolved registry still showed the original CJ-035 combat warning as open.

#### Traversal Layer

TRACEABILITY.

No new gameplay rule was created; this session aligns registry status with existing locked truths.

#### Questions Asked

None.

This was a bookkeeping reconciliation based on already accepted human clarifications.

#### Locked Clarifications

- No new product behavior was locked.
- Core combat numeric resolution is implementation-ready for MVP based on CJ-036 through CJ-058.
- The stale core-combat ambiguity issue and warning are closed.

#### Transferred To PRD

- No PRD text changes were required.

#### Warnings

None.

#### Accepted Uncertainty

- Implementation may still expose new edge cases, but none are currently identified in the MVP combat/ready frontier.

#### Conversational Reflection Summary

The paperwork caught up with the work. The combat contract is no longer a fog bank with named mechanics; it is a buildable set of numbers, timers, and precedence rules.

<a id="cj-061"></a>

### CJ-061 - Implementation Handoff Frontier Reframe

#### Context

After combat, exchange lifecycle, CPU profiles, HUD presentation, and Ready/Stop synchronization were closed, the constitutional state still pointed toward those now-resolved items as the suggested next reasoning focus.

#### Clarification Target

Reframe the active KRYSTALIZE frontier from product-rule clarification into implementation handoff/readiness.

#### Ambiguity Severity

Tier 2 - Implementation handoff dependency.

The game rules are stable enough to build, but a future implementation agent still needs a concise boundary map from PRD truth into TypeScript domain state, Live Match events, Excalibur presentation events, Redis runtime state, and persistence outputs.

#### Prioritization Rationale

This reframe was prioritized because continuing to ask combat/ready questions would create churn. The remaining useful work is now about preserving the clarified rules during implementation.

#### Traversal Layer

TRACEABILITY.

No new gameplay rule was created. The active question and suggested next reasoning focus were updated to point at implementation handoff/readiness.

#### Questions Asked

Should the next PRD 3.0 KRYSTALIZE frontier create an implementation handoff/readiness pass, starting with a TypeScript domain + Excalibur boundary contract?

#### Locked Clarifications

- No new product behavior was locked.
- The combat/ready frontier remains closed for MVP unless implementation reveals a new edge case.
- The recommended next clarification is whether to begin a PRD 3.0 implementation handoff/readiness pass.

#### Transferred To PRD

- No PRD text changes were required.

#### Warnings

None.

#### Accepted Uncertainty

- Exact artifact shape remains open: it could be a new handoff document, a PRD 3.0 section, or a readiness checklist.
- Exact framework choices such as Express versus Fastify remain implementation planning decisions.

#### Conversational Reflection Summary

The frontier moved from "what are the rules?" to "how do we keep these rules intact when code starts forming around them?" That is a good sign: the design is no longer asking to be invented; it is asking to be carried carefully into build shape.

<a id="cj-062"></a>

### CJ-062 - Implementation Ownership Map Transfer

#### Context

After the implementation handoff/readiness frontier was opened, the human clarified that the core idea was "what owns what" and asked whether the section should be named around ownership instead of handoff.

#### Clarification Target

Name and place the cross-system implementation ownership section in PRD 3.0.

#### Ambiguity Severity

Tier 2 - Implementation boundary dependency.

Without a clear ownership map, future implementation could blur server truth, TypeScript/domain rules, Redis runtime coordination, Excalibur presentation, browser input, and database persistence.

#### Prioritization Rationale

This was prioritized because the product rules are now stable enough to build, and the next risk is carrying them into code without giving the wrong layer authority over match-critical outcomes.

#### Traversal Layer

STRUCTURE.

The human accepted the clearer ownership framing and asked to house it under the PRD's architecture section.

#### Questions Asked

Which section should house the ownership map?

#### Locked Clarifications

- The section is named `Implementation Ownership Map`.
- The section belongs under `F) Architecture Features`.
- It is added as `vi. Implementation Ownership Map` after `Realtime Runtime Requirements`.
- The section defines what each implementation area owns and does not own.

#### Transferred To PRD

- `docs/game/GAME_PRD_3.0.md` table of contents now links to `F) Architecture Features -> vi. Implementation Ownership Map`.
- `docs/game/GAME_PRD_3.0.md` now includes an ownership table covering shared TypeScript domain rules, Live Match Service, Matchmaking Service, Match Summary Service, Question Generation Service, CPU Opponent Service, Redis, database persistence, Excalibur presentation, browser input, Stats / Leaderboard Service, and Friends Management Service.
- `docs/game/GAME_PRD_3.0.md` now includes boundary rules for server truth, presentation, persistence, runtime state, and cross-service reads.

#### Warnings

None.

#### Accepted Uncertainty

- Exact TypeScript module names, event payload types, Redis keys, and test filenames remain implementation planning work.

#### Conversational Reflection Summary

"Handoff" was the process word; "ownership" is the document word. The PRD now says the thing a builder actually needs to know: who is allowed to decide, store, coordinate, or merely display each part of the game.

<a id="cj-063"></a>

### CJ-063 - TypeScript Domain Core Contract Transfer

#### Context

After the Implementation Ownership Map was added, the human asked to proceed with defining the detailed TypeScript domain core contract behind it.

#### Clarification Target

Define the PRD-level contract for the shared TypeScript gameplay rule layer.

#### Ambiguity Severity

Tier 3 - Implementation structure clarity.

The gameplay rules are already locked. The remaining ambiguity is how future implementation should shape deterministic modules, state objects, commands, events, and tests so those rules are carried into code cleanly.

#### Prioritization Rationale

This was prioritized because the domain layer is the spine between PRD game rules and Live Match Service execution. Without a domain contract, implementation could scatter combat logic across transport handlers, frontend presentation, or persistence code.

#### Traversal Layer

STRUCTURE.

No new gameplay behavior was created. The PRD now describes the build shape for existing rules.

#### Questions Asked

None.

The human accepted the proposed next step by saying to proceed.

#### Locked Clarifications

- PRD 3.0 now includes `F) Architecture Features -> vii. TypeScript Domain Core Contract`.
- The domain core is a shared, deterministic game-rule layer used by backend runtime services.
- The domain core should not perform rendering, WebSocket transport, Redis reads/writes, database persistence, HTTP routing, or Excalibur animation.
- Live Match Service remains the authoritative runtime caller.
- Domain commands return updated state, domain events, and optional explicit errors.
- Domain tests must cover the core combat and match-result rules.

#### Transferred To PRD

- `docs/game/GAME_PRD_3.0.md` table of contents now links to `F) Architecture Features -> vii. TypeScript Domain Core Contract`.
- `docs/game/GAME_PRD_3.0.md` now defines domain principles, recommended modules, core state objects, domain commands, required events, output shape, explicit errors, and minimum test coverage.

#### Warnings

None.

#### Accepted Uncertainty

- Exact file paths, TypeScript interfaces, package naming, and test runner setup remain implementation work.
- Exact WebSocket/API payload names remain for the next service event-boundary pass.

#### Conversational Reflection Summary

The PRD now has a small blueprint for the rule engine: not source code, but enough shape that code can grow in the right place. The important thing is that rules stay testable and portable while Live Match remains the authoritative caller.

<a id="cj-064"></a>

### CJ-064 - Live Server Event / API Contract Transfer

#### Context

After the TypeScript Domain Core Contract was added, the human asked to proceed with the next step: defining the server-facing event/API boundary needed to build the backend at a high level.

#### Clarification Target

Define the PRD-level communication contract across client realtime actions, server realtime events, backend service handoffs, REST API groups, error codes, and reconnect/void event behavior.

#### Ambiguity Severity

Tier 3 - Implementation structure clarity.

The gameplay and domain rules were already locked. The remaining ambiguity was how Matchmaking, Live Match, Match Summary, Question Generation, CPU Opponent, REST services, and the frontend communicate those rules without mixing ownership.

#### Prioritization Rationale

This was prioritized because server implementation can now start from clear action/event expectations instead of inventing transport boundaries ad hoc. It also helps frontend and backend agree on authoritative event flow before writing WebSocket handlers or REST routes.

#### Traversal Layer

STRUCTURE.

No new gameplay behavior was created. The PRD now describes the server communication boundary for already-stabilized rules and flows.

#### Questions Asked

None.

The human accepted the proposed next step by saying to proceed.

#### Locked Clarifications

- PRD 3.0 now includes `F) Architecture Features -> viii. Live Server Event / API Contract`.
- REST APIs own stable resource/page data for Auth, Profile, Friends, Stats/Leaderboard, CPU progress, legal, and localization surfaces.
- WebSockets or equivalent realtime transport owns queue updates, private invites, Ready / Stop, active match actions/events, reconnect, void, rematch, and session-only results chat.
- Matchmaking Service owns realtime communication before Active Match.
- Live Match Service owns realtime communication after Active Match starts.
- Internal service handoffs are defined for Matchmaking to Live Match, Live Match to Question Generation, Live Match to CPU Opponent, Live Match to Match Summary, and Match Summary back to results flow.
- Realtime payloads should include event/action names, server timestamps where server-produced, and room/match IDs where applicable.
- Match-critical timing uses server receive timestamps, not client clocks.
- Error behavior is explicit and machine-readable, with localized player-facing text handled separately.

#### Transferred To PRD

- `docs/game/GAME_PRD_3.0.md` table of contents now links to `F) Architecture Features -> viii. Live Server Event / API Contract`.
- `docs/game/GAME_PRD_3.0.md` now defines transport split, standard realtime payload rules, client-to-server actions, server-to-client events, internal service handoffs, REST API groups, standard errors, reconnect/void event rules, and implementation notes.

#### Warnings

None.

#### Accepted Uncertainty

- Exact HTTP route paths, WebSocket library choice, Redis key names, pub/sub channels, and TypeScript interface names remain implementation work.
- Express versus Fastify remains open.
- Exact frontend presentation mapping remains for the next Excalibur/HUD boundary pass.

#### Conversational Reflection Summary

The backend now has a traffic map: who can speak, what they can say, and which service is allowed to answer. It is still high-level enough to leave implementation room, but concrete enough that server work has a shared vocabulary.

<a id="cj-065"></a>

### CJ-065 - Excalibur Scene / HUD Presentation Event Contract Transfer

#### Context

After the Live Server Event / API Contract was added, the active frontier moved to the frontend gameplay presentation boundary. The human asked to continue.

#### Clarification Target

Define the PRD-level contract for how Excalibur and the frontend HUD consume authoritative server/domain events and render the Active Match without deciding gameplay truth.

#### Ambiguity Severity

Tier 3 - Implementation structure clarity.

The server and domain events were already described. The remaining ambiguity was how those events become scene areas, HUD state, visual effects, input presentation, animation timing, and frontend verification without moving rule authority into the frontend.

#### Prioritization Rationale

This was prioritized because the Active Match screen is where players experience the game, and it needs a clear presentation boundary before frontend implementation starts. It also prevents visual animation timing from being mistaken for gameplay timing.

#### Traversal Layer

STRUCTURE.

No new gameplay behavior was created. The PRD now describes how already-authoritative events should be displayed.

#### Questions Asked

None.

The human asked to continue from the active frontier.

#### Locked Clarifications

- PRD 3.0 now includes `F) Architecture Features -> ix. Excalibur Scene / HUD Presentation Event Contract`.
- Excalibur renders authoritative state and presentation effects but does not decide gameplay outcomes.
- Recommended scene areas include `MatchScene`, `CombatantView`, `HudView`, `QuestionView`, `OverlayView`, and `ResultsTransitionView`.
- Authoritative server/domain events map to HUD updates, avatar state, callouts, animations, reconnect overlays, and results transitions.
- Prompt construction and attack power presentation follow the locked Core Gameplay timing rules.
- Input presentation accepts only number keys, `-`, Spacebar, and Enter during active gameplay.
- Presentation events should be queued in server event order, while authoritative state wins over stale animations.
- Frontend verification should cover prompt construction, attack power display, HP display, DEFEND display, lockout bars, revenge display, callouts, reconnect overlay, input filtering, and layout readability.

#### Transferred To PRD

- `docs/game/GAME_PRD_3.0.md` table of contents now links to `F) Architecture Features -> ix. Excalibur Scene / HUD Presentation Event Contract`.
- `docs/game/GAME_PRD_3.0.md` now defines presentation principles, scene areas, authoritative state-to-HUD mapping, prompt/attack power presentation rules, input presentation rules, animation timing guidance, presentation event queue rules, and frontend verification checkpoints.

#### Warnings

None.

#### Accepted Uncertainty

- Exact Excalibur scene graph, component class names, easing curves, sprite coordinates, and implementation-specific animation durations remain frontend implementation work.
- Superseded by CJ-066: Redis runtime coordination was previously treated as the next implementation boundary; the current next boundary is backend runtime memory and persistence-output coordination inside the Express modular monolith.

#### Conversational Reflection Summary

The frontend now has its own guardrail: make the fight feel alive, but never make the fight's truth. The HUD can sparkle and punch, but the server still says what actually happened.

<a id="cj-066"></a>

### CJ-066 - Four-Service Architecture Navigation Cleanup

#### Context

After the latest PRD architecture edits, the human asked to keep `GAME_PRD_3.0.md` internally consistent and update existing state/journal files so they do not drift from the PRD.

#### Clarification Target

Record the current architecture/navigation shape: four runtime services, an Express backend modular monolith, roman-numeral immediate service children, unnumbered Excalibur scene/view components, backend modules i-ix, Additional Backend Runtime Responsibilities as x, and Database Service as service 4.

#### Ambiguity Severity

Tier 2 - Architecture source-of-truth drift.

Earlier state/journal entries still described backend microservices, Redis runtime coordination, and one container per backend service. Those entries could mislead implementation if not explicitly superseded.

#### Prioritization Rationale

This was prioritized because PRD 3.0 is now the implementation source of truth. The architecture table of contents, service numbering, backend module vocabulary, deployment table, and state/journal traceability need to agree before implementation work uses them.

#### Traversal Layer

STRUCTURE.

No gameplay behavior changed. This cleanup stabilizes architecture vocabulary and navigation.

#### Questions Asked

None.

The human provided the current service numbering and navigation rules directly.

#### Locked Clarifications

- PRD 3.0 MVP uses four runtime services: `1)` Nginx Entrypoint / Reverse Proxy Service, `2)` Next.js Frontend Service, `3)` Express Backend Service / Backend Modular Monolith, and `4)` Database Service.
- The backend runs as one Express backend service/container with internal modules, not as separate backend microservice containers.
- Immediate service children use roman numerals.
- Excalibur scene/view components remain unnumbered.
- Backend modules use roman numerals i-ix, with x for Additional Backend Runtime Responsibilities.
- Additional Backend Runtime Responsibilities is not a tenth backend module.
- Database Service appears after the backend service as the 4th service.
- Backend runtime memory replaces the earlier Redis-required MVP wording in the current PRD.
- Internal anchors in `GAME_PRD_3.0.md` were verified after the latest architecture navigation edits.

#### Transferred To PRD / State

- `docs/game/GAME_PRD_3.0.md` already contains the current architecture/navigation structure.
- `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` now marks the older backend microservice, Redis, and per-backend-service container locks as superseded.
- `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` now locks PRD30-LT-128 through PRD30-LT-133 for the four-service modular-monolith architecture and navigation rules.
- `docs/game/K_GAME_PRD_2.0_CONSTITUTIONAL_JOURNAL.md` records a cross-version note that PRD 2.0 product decisions remain inherited where carried forward, while PRD 3.0 owns the current architecture/navigation source of truth.

#### Warnings

- Older journal sessions CJ-023, CJ-032, and CJ-034 are historical and superseded for deployment/runtime topology.
- Future implementation work should use Module vocabulary for backend internals and Service vocabulary for the four runtime services.

#### Accepted Uncertainty

- Exact Express route/module file layout remains implementation work.
- Multi-process scaling or Redis-like coordination can be revisited later if the MVP architecture expands beyond one backend process.

#### Conversational Reflection Summary

The architecture vocabulary is now much calmer: services are deployable runtime units, modules are backend responsibility groups, and runtime memory is temporary process state. That should make the next implementation pass less likely to build the old architecture by accident.

<a id="cj-067"></a>

### CJ-067 - Move Page Testing To Separate Test Plan

#### Context

After reviewing the PRD organization, the human agreed that detailed testing checkpoints should move out of the main PRD into another markdown file.

#### Clarification Target

Keep `GAME_PRD_3.0.md` focused on product, architecture, user flow, and page navigation while preserving the detailed page testing checkpoints in a dedicated test plan.

#### Ambiguity Severity

Tier 3 - Documentation structure and implementation handoff clarity.

#### Prioritization Rationale

The Page Navigation section was carrying both screen-map content and QA checklist content. Moving the checklist to a separate file keeps the PRD easier to scan without losing implementation verification guidance.

#### Traversal Layer

STRUCTURE.

No product behavior changed. Only the location of testing checkpoints changed.

#### Questions Asked

None.

The human requested the move directly.

#### Locked Clarifications

- Detailed page testing checkpoints now live in `docs/game/GAME_PRD_3.0_TEST_PLAN.md`.
- `GAME_PRD_3.0.md` keeps a lightweight link to the test plan from Page Navigation.
- The moved test plan preserves Page Navigation, Auth/Home Page, 1P, 2P, Active Match, Results, Community, Profile, and Legal Pages testing checkpoints.
- The test plan is a planning checklist and does not prescribe a test framework.

#### Transferred To PRD / Test Plan

- `docs/game/GAME_PRD_3.0.md` no longer contains the detailed testing sections at the bottom of Page Navigation.
- `docs/game/GAME_PRD_3.0_TEST_PLAN.md` now contains the detailed page testing checkpoints with links back to relevant PRD sections.
- `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` now marks the old in-PRD Testing Contents lock as superseded and adds PRD30-LT-134 for the external test plan.

#### Warnings

None.

#### Accepted Uncertainty

- Exact automated test framework, test filenames, and coverage depth remain implementation work.

#### Conversational Reflection Summary

The PRD breathes better now: it says what the product is, while the test plan says how to check the page promises.

<a id="cj-068"></a>

### CJ-068 - Add Architecture Visual Companion

#### Context

After reviewing the PRD 3.0 architecture structure, the human asked for an HTML visual based on the current architecture instructions.

#### Clarification Target

Create a standalone visual aid that makes the four runtime services, backend modular-monolith modules, runtime handoffs, and authority boundaries easier to scan.

#### Ambiguity Severity

Tier 3 - Documentation aid and architecture communication clarity.

#### Prioritization Rationale

The PRD text is coherent, but the architecture is large. A visual companion helps readers understand the service connections without changing the PRD source of truth.

#### Traversal Layer

STRUCTURE.

No product behavior or architecture ownership changed.

#### Questions Asked

None.

The human requested the HTML artifact directly.

#### Locked Clarifications

- `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html` is a visual companion artifact.
- `docs/game/GAME_PRD_3.0.md` remains the source of truth for architecture requirements.
- The HTML visual mirrors the current four-service runtime model: Nginx, Next.js frontend, Express backend modular monolith, and Database Service.
- The HTML visual shows backend-producer/frontend-consumer ownership: backend modules produce data/events/results consumed by specific frontend pages, while transport details remain in the traffic-flow and game-path portions of the visual.
- Backend modules remain internal responsibility groups inside the Express backend service.
- Additional Backend Runtime Responsibilities are expanded visually as shared backend runtime responsibilities, not as an additional backend module.
- Database schema / persistence areas remain persistence responsibilities, not application modules.
- The HTML visual shows the Excalibur Active Match scene/view modules under the Next.js frontend service.
- The HTML visual shows the Database Service connected to a Volume / Persistent Database Storage rectangle that houses the schema/table persistence areas; backend connects to the Database Service, not directly to the volume.

#### Transferred To Documentation

- Added `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html`.
- Refined the visual to show Excalibur modules and the Database Service to Volume relationship, with schema/table areas housed inside the Volume rectangle.
- Refined the visual to flesh out Additional Backend Runtime Responsibilities: Backend Runtime Memory, Community Chat Runtime Handler, Internal Module Handoffs, REST API Groups, and Boundary And Data Ownership Notes.
- Refined the visual to include a Backend Producers And Frontend Consumers section showing which backend modules produce which frontend pages, including pre-match, live-match, and results paths.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-135, PRD30-UI-019, and PRD30-TR-038.

#### Warnings

None.

#### Accepted Uncertainty

- Exact implementation file layout, route names, CSS styling in future app code, and deployment diagrams generated from infrastructure tooling remain implementation work.

#### Conversational Reflection Summary

The architecture now has a whiteboard view: same truth, less scrolling.

### CJ-069 - Add PRD Page Coverage Map To Architecture Visual

#### Context

After reviewing the architecture visual, the human asked whether the HTML aligned with the pages worked out in the PRD.

#### Clarification Target

Make the HTML visual explicitly account for the PRD 3.0 Page Navigation surfaces, not only the high-level backend-producer/frontend-consumer groupings.

#### Ambiguity Severity

Tier 3 - Documentation aid and frontend/backend handoff clarity.

#### Prioritization Rationale

The existing visual was architecturally accurate but compressed the page map. A dedicated coverage section helps teammates see which Next.js pages exist and which backend producer/source feeds each one.

#### Traversal Layer

STRUCTURE.

No product behavior, service ownership, or persistence rule changed.

#### Questions Asked

None.

The human asked to add the coverage section directly.

#### Locked Clarifications

- The architecture visual should include a PRD Page Coverage Map.
- The coverage map should use the PRD 3.0 Page Navigation names, grouped by major flow.
- Parent/menu pages are still Next.js pages even when they only need session/profile context.
- Backend modules produce durable data, derived data, or realtime events; Next.js pages own layout and interaction.
- Excalibur remains the Active Match presentation layer and consumes authoritative state through the frontend Active Match Host.

#### Transferred To Documentation

- Added a PRD Page Coverage Map to `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html`.
- The coverage map groups Auth/Home, 1P/CPU progression, 2P/pre-match, Active Match, Results/rematch, and Community/Profile/Legal pages.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-136 and PRD30-TR-039.

#### Warnings

None.

#### Accepted Uncertainty

- Exact route paths and component file names remain implementation details for the frontend teammate.

#### Conversational Reflection Summary

The visual now has both the whiteboard architecture and the checklist bridge back to the PRD page map.

### CJ-070 - Refine Architecture Visual Traffic Flow

#### Context

The human noted that the Primary Traffic Flow section was still too abstract and asked for one full cycle showing how the browser uses Nginx, how Nginx uses the frontend service, and how frontend/backend/database traffic returns.

#### Clarification Target

Make the architecture visual's traffic-flow section concrete enough for implementation understanding.

#### Ambiguity Severity

Tier 3 - Documentation aid and implementation communication clarity.

#### Prioritization Rationale

The earlier three-node traffic summary was correct but too compressed. A full-cycle diagram helps teammates understand which service handles page loads, REST calls, WebSocket runtime, database writes, and returned browser updates.

#### Traversal Layer

STRUCTURE.

No service ownership or product behavior changed.

#### Questions Asked

None.

The human requested the visual refinement directly.

#### Locked Clarifications

- Browser traffic enters through Nginx.
- Nginx routes page/assets to Next.js and routes REST/WebSocket traffic to Express.
- Next.js owns pages, frontend clients, Active Match Host, and Excalibur hosting.
- Express owns REST APIs, WebSocket runtime handlers, gameplay authority, and DB access.
- Database Service accepts backend connections and persists through its mounted volume.
- Returned data/events/pages flow back through the same public edge path to the browser.

#### Transferred To Documentation

- Replaced the abstract Primary Traffic Flow section in `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html` with a full browser-to-service-to-browser cycle.
- Added separate page/asset load, REST data cycle, and realtime/gameplay cycle explanations.
- Added concrete Signup, Quick Match, and Active Match examples.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-137 and PRD30-TR-040.

#### Warnings

None.

#### Accepted Uncertainty

- Exact Nginx route paths, Next.js route paths, REST endpoint names, and WebSocket event names remain implementation details.

#### Conversational Reflection Summary

The traffic diagram now reads less like a label cloud and more like a request actually moving through the system.

### CJ-071 - Split Traffic Flow Into Request And Response Lanes

#### Context

The human asked whether the traffic flow could be displayed with each service divided into two halves, with request flow travelling downward/right toward the database and response flow travelling upward/left back to the browser. The human also asked whether backend requests return through the frontend service.

#### Clarification Target

Clarify the visual traffic model and correct the backend response path.

#### Ambiguity Severity

Tier 3 - Documentation aid and implementation communication clarity.

#### Prioritization Rationale

The full-cycle section was better than the prior abstract view, but grouping request and response responsibilities in the same box could still imply that frontend and backend return paths are the same. Split lanes make the separation easier to read.

#### Traversal Layer

STRUCTURE.

No service ownership or product behavior changed.

#### Questions Asked

None.

The human requested the visual update directly after asking for clarification.

#### Locked Clarifications

- Page/assets requests return from Next.js through Nginx to the browser.
- REST API and WebSocket responses/events return from Express through Nginx to the browser.
- Backend API/WebSocket responses do not return through the Next.js frontend service.
- The browser runs the frontend app and updates the UI after receiving backend responses/events.
- Database results return to Express only; browser and Next.js do not talk directly to the database service or volume.

#### Transferred To Documentation

- Updated the Primary Traffic Flow section in `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html` with split request/response service boxes.
- Added a callout clarifying that backend API and WebSocket responses return through Nginx to the browser, not through the Next.js frontend service.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-138 and PRD30-TR-041.

#### Warnings

None.

#### Accepted Uncertainty

- Exact Nginx route patterns and client-side fetch/WebSocket helper names remain implementation details.

#### Conversational Reflection Summary

The diagram now separates "where the app code is served from" from "where backend answers come back from", which is the sneaky part of this architecture.

### CJ-072 - Add Directional Arrows To Split Traffic Flow

#### Context

The human asked whether arrows could show directional movement for the request and response cycle.

#### Clarification Target

Make the split request/response traffic flow visually directional instead of relying only on labels.

#### Ambiguity Severity

Tier 3 - Documentation readability aid.

#### Prioritization Rationale

Visible down/up arrows reduce confusion when scanning the split service boxes and reinforce that request/command traffic and response/event traffic move in opposite directions.

#### Traversal Layer

STRUCTURE.

No service ownership, product behavior, or persistence rule changed.

#### Questions Asked

None.

The human requested the visual update directly.

#### Locked Clarifications

- Split traffic-flow connector rows should show downward arrows for request/command movement.
- Historical split-flow note: connector rows showed upward arrows for response/event movement. Superseded by CJ-080 for the current hybrid visual, which uses downward connectors for each logical step.

#### Transferred To Documentation

- Updated `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html` with visible down/up arrow markers in the then-current split traffic-flow connector rows. Superseded by CJ-080's current hybrid top-to-bottom flow.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-139 and PRD30-TR-042.

#### Warnings

None.

#### Accepted Uncertainty

- Exact final diagram styling remains a presentation detail.

#### Conversational Reflection Summary

The traffic cycle now has actual visual motion cues, which is what this diagram wanted all along.

### CJ-073 - Center-Justify Directional Arrows In Split Traffic Flow

#### Context

The human asked for the request/response arrows to be centered inside the connector blocks, not moved into a separate middle lane.

#### Clarification Target

Center-justify the directional arrow markers and labels inside each request/response connector pill.

#### Ambiguity Severity

Tier 3 - Documentation readability aid.

#### Prioritization Rationale

Center-justifying the arrows inside each connector pill makes each request/response label read as one balanced visual unit.

#### Traversal Layer

STRUCTURE.

No service ownership, product behavior, or persistence rule changed.

#### Questions Asked

None.

The human requested the visual adjustment directly.

#### Locked Clarifications

- Split traffic-flow arrows belong inside their request/response connector pills.
- Arrow markers and labels should be visually centered inside each connector pill.

#### Transferred To Documentation

- Updated `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html` so the split traffic-flow connector rows center-justify down/up arrows inside their request/response connector pills.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-140 and PRD30-TR-043.

#### Warnings

None.

#### Accepted Uncertainty

- Exact visual spacing remains a presentation detail.

#### Conversational Reflection Summary

The arrows now feel attached to the exact label they explain, which makes the connector blocks easier to scan.

### CJ-074 - Correct Next.js Request/Response Wording In Traffic Flow

#### Context

The human noticed that "serves app shell, page UI modules, frontend bundles, REST Client, WebSocket Client, and Active Match Host code" was written on the Next.js request side even though that behavior belongs to the response side.

#### Clarification Target

Keep the split traffic-flow wording conceptually accurate for Next.js request versus response responsibilities.

#### Ambiguity Severity

Tier 3 - Documentation precision.

#### Prioritization Rationale

The split traffic diagram depends on request/response wording being clean. Putting returned frontend code on the request side weakens the point of the split.

#### Traversal Layer

STRUCTURE.

No service ownership or product behavior changed.

#### Questions Asked

None.

The human requested the wording correction directly.

#### Locked Clarifications

- Next.js request side receives page and asset requests from Nginx.
- Next.js response side sends HTML, CSS, static assets, app shell, page UI code, REST/WebSocket client code, and Active Match Host code to Nginx.
- Next.js still does not own backend API answers or match-critical results.

#### Transferred To Documentation

- Updated `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html` to move returned frontend code wording from the Next.js request side to the response side.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-141 and PRD30-TR-044.

#### Warnings

None.

#### Accepted Uncertainty

- Exact build output names and Next.js route file names remain implementation details.

#### Conversational Reflection Summary

This is the kind of small wording fix that keeps a diagram from quietly teaching the wrong mental model.

### CJ-075 - Clarify Browser Actions And Split Rectangle Sentences

#### Context

The human pointed out that the Browser Request Side mixed player actions with browser/app network actions, such as saying the player opens WebSockets.

#### Clarification Target

Separate human input from browser/app network behavior and make each traffic-flow rectangle sentence start on a new line.

#### Ambiguity Severity

Tier 3 - Documentation precision and readability.

#### Prioritization Rationale

The diagram should not imply that players perform technical transport actions. Players interact with UI; browser/frontend code performs page requests, API calls, and WebSocket connections.

#### Traversal Layer

STRUCTURE.

No service ownership or product behavior changed.

#### Questions Asked

None.

The human requested the wording/layout correction directly.

#### Locked Clarifications

- Browser Request Side should distinguish player UI actions from browser app network actions.
- Players click, type, submit, press, and request actions through UI.
- Browser/frontend app code requests pages/assets, calls REST APIs, opens WebSockets, and sends commands created from player input.
- Split traffic-flow rectangle sentences should render as separate lines.

#### Transferred To Documentation

- Updated `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html` so Browser Request Side separates player actions and browser app actions.
- Updated split-flow rectangle paragraph markup/CSS so each sentence appears on its own line.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-142 and PRD30-TR-045.

#### Warnings

None.

#### Accepted Uncertainty

- Exact frontend helper names remain implementation details.

#### Conversational Reflection Summary

This makes the traffic diagram more human-accurate: people play the game; browser code moves packets.

### CJ-076 - Show Nginx Branches To Next.js And Express Separately

#### Context

The human observed that the REST/WebSocket connector should branch from Nginx Request Routing, not appear as if it continues from the Next.js frontend service.

#### Clarification Target

Refine the split traffic-flow visual so Nginx request routing visibly splits to the correct internal services.

#### Ambiguity Severity

Tier 3 - Documentation precision and architecture readability.

#### Prioritization Rationale

The architecture depends on Nginx being the routing point. If the visual suggests backend API/WebSocket traffic continues through Next.js, it teaches the wrong deployment path.

#### Traversal Layer

STRUCTURE.

No service ownership or product behavior changed.

#### Questions Asked

None.

The human requested the visual adjustment directly after identifying the branch issue.

#### Locked Clarifications

- Nginx routes page/assets traffic to Next.js.
- Nginx routes REST API and WebSocket upgrade traffic to Express.
- Browser app API/WebSocket calls start from the browser and go through Nginx to Express, not through the Next.js service.
- The architecture visual should show the page/assets branch and REST/WebSocket branch as separate Nginx routing outputs.

#### Transferred To Documentation

- Updated `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html` so the Nginx section visually branches: a compact right-side branch to Next.js and a longer down-arrow branch to Express backend request handling.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-143 and PRD30-TR-046.

#### Warnings

None.

#### Accepted Uncertainty

- Exact Nginx route path patterns remain implementation details.

#### Conversational Reflection Summary

The diagram now treats Nginx as the fork in the road, which is the correct mental model.

### CJ-077 - Correct REST/WebSocket Branch Connector Shape

#### Context

The human pointed out that the Nginx-to-Express branch rendered as an oversized filled oval, which made the diagram look strange and confusing.

#### Clarification Target

Fix the visual shape of the REST/WebSocket branch connector without changing the architecture meaning.

#### Ambiguity Severity

Tier 3 - Documentation readability aid.

#### Prioritization Rationale

The branch was conceptually correct but visually misleading. The connector should look like a directional arrow path, not a giant service block or capsule.

#### Traversal Layer

STRUCTURE.

No service ownership, product behavior, or traffic semantics changed.

#### Questions Asked

None.

The human requested the visual correction directly.

#### Locked Clarifications

- The REST/WebSocket branch from Nginx to Express should render as a slim vertical connector.
- The branch label should be compact and should not fill the whole request column.

#### Transferred To Documentation

- Updated `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html` so the Nginx-to-Express branch uses a centered arrow, vertical line, and compact label.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-144 and PRD30-TR-047.

#### Warnings

None.

#### Accepted Uncertainty

- Final diagram spacing remains a presentation detail.

#### Conversational Reflection Summary

The connector is now a connector again, not a surprise weather balloon.

### CJ-078 - Keep Main Request Path Vertical With Next.js Side Branch

#### Context

The human clarified with a reference image that the main request path should remain vertically aligned through Browser, Nginx, Express, and Database, while the Next.js frontend service should appear as a side branch from Nginx for page/assets.

#### Clarification Target

Correct the traffic-flow layout so the frontend page/assets branch does not visually replace or shift the main backend request path.

#### Ambiguity Severity

Tier 3 - Documentation readability and architecture communication.

#### Prioritization Rationale

The previous layout showed the right Nginx branch but still made the frontend branch feel like the main continuation. The visual needs to show Nginx as a fork while keeping REST/WebSocket traffic aligned to Express.

#### Traversal Layer

STRUCTURE.

No service ownership, product behavior, or traffic semantics changed.

#### Questions Asked

None.

The human provided the reference image and requested the correction directly.

#### Locked Clarifications

- Browser -> Nginx -> Express -> Database remains the main vertical request path for backend REST/WebSocket/persistence traffic.
- Next.js is a side branch from Nginx for page/assets traffic.
- Next.js does not sit in the main REST/WebSocket path.

#### Transferred To Documentation

- Updated `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html` so the Nginx branch places REST/WebSocket traffic on the main vertical request path and Next.js as a compact side branch.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-145 and PRD30-TR-048.

#### Warnings

None.

#### Accepted Uncertainty

- Final visual spacing and exact branch proportions remain presentation details.

#### Conversational Reflection Summary

The diagram now has the right backbone: backend traffic stays on the spine, frontend page serving hangs off Nginx as its own branch.

### CJ-079 - Rebuild Architecture Visual Around Hybrid Traffic Model

#### Context

The human clarified the intended architecture model: non-game pages should be composed by the Next.js frontend service, with static pages served directly and data-backed pages asking Express for backend data. Game surfaces should load frontend game code and run Excalibur in the browser, with Express owning authoritative realtime/gameplay events.

#### Clarification Target

Rebuild the HTML visual's traffic model around the current hybrid understanding instead of the earlier client-rendered/browser-direct API assumption.

#### Ambiguity Severity

Tier 2 - Architecture communication and implementation handoff clarity.

#### Prioritization Rationale

The previous traffic diagram encoded the wrong mental model for non-game pages. The visual should match the team's intended service relationship before implementation teammates use it as a guide.

#### Traversal Layer

STRUCTURE.

Runtime service ownership remains the same, but the traffic explanation was corrected.

#### Questions Asked

None.

The human requested the HTML rebuild directly after clarifying the intended model.

#### Locked Clarifications

- Non-game pages are composed by Next.js.
- Static non-game pages can return directly from Next.js.
- Data-backed non-game pages use Next.js -> Express -> Database Service as needed before Next.js returns the populated page.
- Game/realtime pages load Active Match Host and Excalibur code from Next.js.
- Browser-loaded Excalibur renders the game surface.
- Browser/Excalibur uses WebSockets through Nginx to Express for authoritative game/realtime events.
- Express talks to Database Service; Database Service reads/writes the mounted Volume.

#### Transferred To Documentation

- Rebuilt the Primary Traffic Flow section in `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html` as a two-lane hybrid diagram: non-game page composition and game/realtime rendering.
- Updated the Next.js runtime service wording to describe page rendering, non-game page composition, frontend client code, and the Excalibur Active Match host.
- Updated the Database Volume wording to say Database Service reads/writes its data directory in the mounted volume.
- Updated communication notes to align non-game pages with Next.js page composition and game/realtime pages with browser-loaded WebSocket/Excalibur behavior.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-146 and PRD30-TR-049, while narrowing/superseding earlier traffic assumptions.

#### Warnings

None.

#### Accepted Uncertainty

- Exact Next.js route rendering mode, backend API path naming, and whether server-side Next.js calls Express through Nginx or an internal service URL remain implementation details.

#### Conversational Reflection Summary

The diagram finally matches the shared mental model: Next.js builds normal pages, Excalibur renders the live game in the browser, and Express owns truth.

### CJ-080 - Clarify REST, WebSocket, Active Match Host, And Excalibur Roles In Architecture Visual

#### Context

The human refined their mental model around REST versus WebSocket and asked to update the HTML visual with the clarified details. The key distinction was that REST is suitable for stable non-game request/response data, while WebSocket is suitable for server-pushed realtime flows. The human also clarified the need to understand Active Match Host as frontend code downloaded into the browser, separate from Excalibur as the rendering layer.

#### Clarification Target

Make the architecture visual explicitly teach REST/WebSocket selection and the browser-side Active Match Host -> Excalibur handoff.

#### Ambiguity Severity

Tier 2 - Architecture communication and implementation handoff clarity.

#### Prioritization Rationale

Transport choice and browser/server responsibility boundaries directly affect how teammates implement non-game pages, matchmaking, live match events, chat, and game rendering.

#### Traversal Layer

STRUCTURE.

The service ownership model remains the same; the traffic-flow explanation was made more explicit.

#### Questions Asked

None.

The human asked to tweak the HTML to reflect the details discussed.

#### Locked Clarifications

- Nginx only routes/proxies traffic and does not request backend data by itself.
- REST fits stable non-game data and request/response actions such as auth, profile, friend records, stats, leaderboard, CPU progress, match summaries, and page data.
- WebSocket fits realtime/server-pushed flows such as Quick Match queue, room assignment, private invites, Challenge / Ready, Active Match, reconnect, rematch, and Community Chat.
- Active Match Host is frontend code served by Next.js and then run in the browser.
- Active Match Host opens/uses the realtime connection, handles local input, receives Express events through Nginx, and passes presentation updates into Excalibur.
- Excalibur is the browser-side rendering/presentation layer, not the backend authority.

#### Transferred To Documentation

- Updated `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html` Primary Traffic Flow introduction to state Nginx does not build pages or request backend data by itself.
- Updated the non-game lane to label Next.js -> Express calls as REST data requests.
- Updated the game/realtime lane to separate browser-loaded Active Match Host from Excalibur rendering.
- Added REST, WebSocket, and Nginx proxy guidance cards to the traffic-flow section.
- Updated communication notes to specify that Express events travel through Nginx to the browser-loaded WebSocket Client and then through Active Match Host into Excalibur scene/view modules.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-147 and PRD30-TR-050.

#### Warnings

None.

#### Accepted Uncertainty

- Exact REST route names, WebSocket event payload shapes, and whether server-side Next.js calls Express through Nginx or an internal service URL remain implementation details.

#### Conversational Reflection Summary

The diagram now teaches the important split: normal pages use REST-style page/data composition, while live/realtime surfaces use browser-loaded frontend code over WebSocket with Express as the authority.

### CJ-081 - Remove Persistence Box From Game Runtime Flow

#### Context

The human identified that the Database Service + Volume persistence box in the right-side game/realtime flow implied persistence lived inside the live game rendering loop. They clarified that persistence belongs to durable data/result/page paths rather than the game runtime rendering sequence.

#### Clarification Target

Correct the architecture visual so the game/realtime lane shows the live WebSocket/rendering path only.

#### Ambiguity Severity

Tier 2 - Runtime and persistence boundary clarity.

#### Prioritization Rationale

Keeping persistence visually inside the live game lane could lead teammates to treat database writes as part of the realtime rendering cycle, rather than a boundary action handled through backend persistence/result flows.

#### Traversal Layer

STRUCTURE.

The runtime services and persistence rules remain the same; the visual placement of the database/volume box was corrected.

#### Questions Asked

None.

The human requested the correction directly.

#### Locked Clarifications

- The game/realtime lane should not include a Database Service + Volume step inside the live rendering loop.
- The game/realtime lane should show Express authoritative runtime events returning through Nginx to browser-loaded Active Match Host, then into Excalibur.
- Durable persistence belongs to data-backed page/result/persistence paths, represented by the non-game/data-backed side and database service summary.
- Runtime match state and latest-50 chat buffer remain backend runtime memory unless explicitly persisted by PRD rules.

#### Transferred To Documentation

- Removed the Database Service + Volume box from the game/realtime lane in `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html`.
- Renumbered the right-lane Active Match Host and Excalibur steps after removal.
- Updated the current-model note to say persistence is not part of the live rendering loop.
- Updated the WebSocket guidance card to state live runtime state stays in backend memory during the match.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-148 and PRD30-TR-051.

#### Warnings

None.

#### Accepted Uncertainty

- Exact timing of final match persistence remains an implementation detail governed by Match Summary Module and Runtime Match State rules.

#### Conversational Reflection Summary

The right lane is now cleaner: live game events flow back to the browser renderer, while durable persistence stays in the data/result side of the architecture.

### CJ-082 - Transfer Two Traffic Flows Into PRD Architecture Body

#### Context

The human asked whether the two-flow architecture was in the PRD and then requested the PRD be updated, with outdated architecture removed. The flow had been stabilized in the architecture visual and constitutional trace first, but the main PRD still used a more abstract runtime traffic bullet list.

#### Clarification Target

Make `GAME_PRD_3.0.md` carry the two traffic flows directly as source-of-truth architecture text.

#### Ambiguity Severity

Tier 2 - Architecture source-of-truth alignment.

#### Prioritization Rationale

The Markdown PRD remains the implementation source of truth. The visual companion should not contain a more precise architecture than the PRD body itself.

#### Traversal Layer

STRUCTURE.

The architecture model did not change; the stabilized model was transferred into the PRD and older abstract traffic wording was replaced.

#### Questions Asked

None.

The human requested the PRD update directly.

#### Locked Clarifications

- The PRD architecture body should explicitly describe two runtime traffic flows: Non-game page flow and Game / realtime flow.
- The older abstract runtime traffic block should be removed/replaced, not left beside the new flow.
- Non-game pages use Next.js page composition with optional REST/API data from Express.
- Game/realtime pages load Active Match Host and Excalibur code into the browser, then use WebSocket through Nginx to Express.
- Nginx routes/proxies only.
- Database Service reads/writes mounted persistent database storage.
- Persistence is not part of the live game rendering loop.

#### Transferred To Documentation

- Replaced the old Runtime traffic bullet list in `docs/game/GAME_PRD_3.0.md` Services And Runtime Ownership with explicit Non-game page flow and Game / realtime flow.
- Added runtime traffic rules for Nginx proxy-only behavior, REST/API stable data, WebSocket realtime flows, persistence boundary, and Database Service / mounted volume access.
- Updated Next.js Frontend Service rules to define non-game page composition and browser-loaded Active Match Host / Excalibur behavior.
- Added Database Service storage rules for mounted persistent database volume access.
- Updated Realtime Runtime Requirements with REST/WebSocket selection and live runtime persistence boundary.
- Updated Live Server Event / API Contract transport split and transport boundary rules.
- Updated Implementation Ownership Map and Excalibur Scene / HUD Presentation Event Contract to name Active Match Host as the browser-side bridge into Excalibur.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-149 and PRD30-TR-052.

#### Warnings

None.

#### Accepted Uncertainty

- Exact REST route names, WebSocket event payload shapes, and internal service URL choices remain implementation details.

#### Conversational Reflection Summary

The Markdown PRD now carries the same traffic model as the visual: normal pages are composed through Next.js and backend REST data, while live game/realtime traffic runs through browser-loaded Active Match Host and WebSocket events from Express.

### CJ-083 - House Traffic Flows As Architecture Item 0

#### Context

After the two-flow architecture text was transferred into the PRD, the human clarified that the flow portions should not remain buried inside Services And Runtime Ownership. They should be housed as item 0, with the two flows itemized as i and ii.

#### Clarification Target

Move the Runtime Traffic Flows content to its own Architecture subsection before Services And Runtime Ownership.

#### Ambiguity Severity

Tier 3 - Documentation structure and navigation clarity.

#### Prioritization Rationale

The traffic flows explain how the architecture operates before the PRD names which service owns each responsibility. Placing them before service ownership makes the architecture section easier to read without changing the runtime model.

#### Traversal Layer

STRUCTURE.

The architecture content stayed the same; only its housing and table-of-contents placement changed.

#### Questions Asked

None.

The human gave a direct structure instruction.

#### Locked Clarifications

- Runtime Traffic Flows should appear as Architecture item 0.
- Non-game Page Flow should be itemized under Runtime Traffic Flows as i.
- Game / Realtime Flow should be itemized under Runtime Traffic Flows as ii.
- Services And Runtime Ownership should cross-reference Runtime Traffic Flows rather than carrying the full flow block.

#### Transferred To Documentation

- Added `Runtime Traffic Flows` as item 0 in `docs/game/GAME_PRD_3.0.md`.
- Added direct table-of-contents links for Runtime Traffic Flows, Non-game Page Flow, and Game / Realtime Flow.
- Moved the two flow lists and shared runtime traffic rules out of Services And Runtime Ownership.
- Left a cross-reference from Services And Runtime Ownership to Runtime Traffic Flows.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-150 and PRD30-TR-053.

#### Warnings

None.

#### Accepted Uncertainty

- The subsection label uses `0.` to match the human's requested item 0 while preserving the existing roman-numeral service ownership sequence.

#### Conversational Reflection Summary

The flow explanation now sits where it reads best: before the service inventory, as the map the reader sees before the legend.

### CJ-084 - Remove Extra Architecture Visual Sections

#### Context

The human asked to delete the game production paths, the PRD coverage map, and the Domain Core And Presentation Boundary section from the architecture visual.

#### Clarification Target

Trim `GAME_PRD_3.0_ARCHITECTURE_VISUAL.html` so the visual companion stays focused on the high-level architecture model and does not duplicate page coverage or detailed domain/presentation contracts.

#### Ambiguity Severity

Tier 3 - Visual companion scope cleanup.

#### Prioritization Rationale

The main PRD and test plan already carry the detailed page/navigation and domain/presentation contracts. Keeping those duplicated inside the visual companion made the HTML heavier and more likely to drift.

#### Traversal Layer

STRUCTURE.

No PRD gameplay or architecture truth changed. The visual companion was narrowed.

#### Questions Asked

None.

The requested section names matched existing HTML headings closely enough to act.

#### Locked Clarifications

- The architecture visual should not include the Game Page Production Path block.
- The architecture visual should not include the PRD Page Coverage Map.
- The architecture visual should not include the Domain Core And Presentation Boundary section.
- The PRD remains the source of truth for domain core and presentation boundary details.

#### Transferred To Documentation

- Removed the Game Page Production Path block from `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html`.
- Removed the PRD Page Coverage Map section from `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html`.
- Removed the Domain Core And Presentation Boundary section from `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html`.
- Removed the shared TypeScript domain rule layer legend item from the visual legend.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-151 and PRD30-TR-054, and marked the prior page-coverage trace as superseded.

#### Warnings

None.

#### Accepted Uncertainty

- None.

#### Conversational Reflection Summary

The visual is lighter now: services, traffic flow, producer/consumer ownership, runtime handoffs, authority rules, and legend remain, while duplicate detail maps are gone.

### CJ-085 - Remove Contract-Like Visual Join Sections

#### Context

The human noted that the Backend Runtime Handoffs section was really describing contracts, and that replacing producer/consumer language with contract language would be more helpful later.

#### Clarification Target

Trim `GAME_PRD_3.0_ARCHITECTURE_VISUAL.html` further by removing the current backend producer/frontend consumer map and backend runtime handoff map for now, while preserving Authority Rules.

#### Ambiguity Severity

Tier 3 - Visual companion scope cleanup.

#### Prioritization Rationale

The visual should show the broad runtime model cleanly. Contract descriptions are important, but they belong in the PRD contract sections or a future dedicated contract map, not in a visual section whose labels currently make the implementation joins feel more final than they are.

#### Traversal Layer

STRUCTURE.

No PRD gameplay truth changed. The visual companion was narrowed again.

#### Questions Asked

None.

The human gave a direct cleanup instruction: delete those sections for now and preserve Authority Rules.

#### Locked Clarifications

- The architecture visual should not include the Backend Producers And Frontend Consumers section for now.
- The architecture visual should not include the Backend Runtime Handoffs section for now.
- Authority Rules should remain in the architecture visual.
- Runtime handoffs can be treated as contract descriptions in a later contract-focused pass.

#### Transferred To Documentation

- Removed the Backend Producers And Frontend Consumers section from `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html`.
- Removed the Backend Runtime Handoffs section from `docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html`.
- Preserved the Authority Rules section as a full-width panel.
- Removed unused producer/consumer, page, handoff, and sequence CSS from the visual companion.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-152 and PRD30-TR-055.

#### Warnings

None.

#### Accepted Uncertainty

- A future contract map may replace these removed sections once the team wants a focused view of code join points.

#### Conversational Reflection Summary

The visual now stays at the level of services, traffic flow, authority rules, and legend. The deeper join-point material can come back later under the more accurate contract framing.

### CJ-086 - PRD 3.0 Consistency Audit Cleanup

#### Context

The human asked to check PRD 3.0 and relevant related documents for consistency and ambiguity after the recent traffic-flow and architecture visual cleanup.

#### Clarification Target

Audit the current PRD 3.0 documentation set for stale wording, contradictory architecture ownership, broken anchors, and unclear flow language.

#### Ambiguity Severity

Tier 3 - Documentation consistency and implementation handoff clarity.

#### Prioritization Rationale

The architecture visual had just been narrowed, and PRD 3.0 now carries the source-of-truth flow and contract sections. A consistency pass prevents stale visual-trace wording or ambiguous flow language from confusing future implementation work.

#### Traversal Layer

STRUCTURE and HOW.

The audit focused on document coherence, not on changing MVP gameplay behavior.

#### Questions Asked

None.

The request was direct and the relevant documents were available locally.

#### Locked Clarifications

- Non-game backend data may be requested by Next.js during page composition or by browser-loaded frontend code after the page has loaded.
- When Next.js requests backend data during composition, Next.js builds the completed response.
- When browser-loaded frontend code requests backend data after load, the browser updates the already-loaded page.
- The test plan should use `legal page` wording, not the older `info/legal page` wording.
- Older architecture visual trace entries that describe deleted concrete paths or old split-flow shapes should be marked as superseded or narrowed by the current hybrid visual model.

#### Transferred To Documentation

- Clarified the Non-game Page Flow in `docs/game/GAME_PRD_3.0.md`.
- Replaced stale `info/legal page` wording in `docs/game/GAME_PRD_3.0_TEST_PLAN.md`.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-153 and PRD30-TR-056.
- Marked older architecture visual trace truths PRD30-LT-137 and PRD30-LT-140 through PRD30-LT-143 as superseded or narrowed by the current hybrid visual model.

#### Warnings

None.

#### Accepted Uncertainty

- A future implementation pass may still add a dedicated contract map, but the current PRD contract sections remain the source-of-truth contract descriptions.

#### Conversational Reflection Summary

The docs are now less likely to send two signals at once: PRD 3.0 owns the detailed contracts, the visual stays broad, and the non-game flow names who updates the page in each request path.

### Session CJ-087

```yaml
session_id: CJ-087
krystalize_session_id: KRYS-game_prd_3_0-001
date: 2026-06-05
participants:
  - human
  - Codex
scope: player identity image two-option clarification
```

#### Clarification Target

Clarify whether MVP player identity remains upload-only or should support both uploaded pictures and premade avatar selection.

#### Ambiguity Severity

Tier 2 - Product identity and implementation persistence boundary.

#### Prioritization Rationale

The prior direction had moved away from selectable player avatars toward uploaded profile pictures. The human clarified that the current product should support two user-friendly identity-image options: upload a picture, or choose a premade avatar when the player does not want to upload one.

#### Traversal Layer

WHAT and HOW.

This session clarified the accepted product behavior and the implementation-facing persistence/display contract, without reopening the old math-symbol mascot avatar set as the exact MVP art requirement.

#### Questions Asked

None.

The human provided a direct clarification and asked to remember it in the journal and state.

#### Locked Clarifications

- MVP player identity image supports two selectable sources: player-uploaded profile picture and built-in premade player avatar.
- Premade player avatars are built-in frontend/game assets, not user-uploaded media.
- Exactly one selected identity image source is active for display at a time.
- Uploaded pictures use `profile_picture_url`; premade avatars use `premade_avatar_key`; `identity_image_source` records the active source.
- Profile, friend, community, leaderboard, VS, results, and active-match identity surfaces should display the selected identity image.
- The old math-symbol mascot avatar concept remains KIV as a possible future art direction, not the exact accepted MVP premade-avatar set.

#### Transferred To Documentation

- Updated `docs/game/GAME_PRD_3.0.md` with the upload-or-premade-avatar player identity rule.
- Updated `docs/game/GAME_PRD_3.0_IMPLEMENTATION.md` with Player Profile Module, persistence, visual asset, and display-surface wording.
- Updated `docs/game/GAME_PRD_3.0_PAGES.md` so relevant pages refer to selected identity image instead of upload-only profile picture wording.
- Updated `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md` with PRD30-LT-154 and PRD30-TR-057.

#### Warnings

None.

#### Accepted Uncertainty

- Exact premade avatar count, art style, names, and final asset list remain implementation/art-production details unless later locked.

#### Conversational Reflection Summary

The identity model now has the humane fallback the human wanted: players who want personal expression can upload a picture, and players who want speed can pick something premade without turning profile setup into friction.

## Clarification Rationale Tracking

| ID | Session | Clarification Path | Severity Tier | Why Prioritized | Dependency Branch | Instability Trigger |
| --- | --- | --- | --- | --- | --- | --- |
| PRD30-CRT-001 | CJ-001 | Create constitutional artifacts before further PRD edits. | Tier 2 | Prevents exploratory architecture learning from being prematurely written as final PRD truth. | PRD 3.0 architecture and service ownership. | Human requested KRYSTALIZE-style clarification. |
| PRD30-CRT-002 | CJ-002 | Transfer PRD 1.0 product promise into PRD 3.0. | Tier 2 | Prevents implementation/service discussions from losing the normal-person product north star. | PRD 3.0 feature and architecture clarification. | Human accepted the proposed Product Promise. |
| PRD30-CRT-003 | CJ-003 | Clarify shared question prompts across all game modes. | Tier 2 | Prevents PvP/PvC question generation from drifting into separate-combatant prompts. | Question Generation Service and Live Match runtime state. | Human clarified same-question behavior. |
| PRD30-CRT-004 | CJ-004 | Clarify comeback-based easy chance under shared prompts. | Tier 2 | Prevents comeback assistance from being accidentally shared with the advantaged opponent. | Question Generation Service and runtime match state. | Human clarified next-prompt arming behavior. |
| PRD30-CRT-005 | CJ-005 | Restore inherited CPU-specific question rules into PRD 3.0. | Tier 2 | Prevents PRD 3.0 compression from losing established Fury/Skore identities. | CPU Opponent Service and Question Generation Service. | Human confirmed all restored rules are correct. |
| PRD30-CRT-006 | CJ-006 | Clarify precedence between comeback easy chance and CPU hard-question rules. | Tier 2 | Keeps earned comeback assistance from being cancelled by CPU-specific difficulty pressure. | Question Generation Service. | Human clarified easy chance wins. |
| PRD30-CRT-007 | CJ-007 | Clarify spinner as backend question-mode selection/cycling. | Tier 3 | Prevents PRD 3.0 from requiring unnecessary spinner UI. | Question Generation Service and match presentation. | Human clarified players only see the question. |
| PRD30-CRT-008 | CJ-008 | Clarify traceability code and PRD update workflow. | Tier 2 | Keeps PRD 3.0 readable while preserving reasoning traceability in constitutional artifacts. | Documentation process. | Human clarified codes stay in state/journal and PRD updates wait for stabilized state. |
| PRD30-CRT-009 | CJ-009 | Clarify fight-round question type and difficulty selection model. | Tier 2 | Stabilizes round pacing, replayability, and player-facing prep. | Question generation and visual prep flow. | Human clarified one type spin and one difficulty spin per 60-second fight round. |
| PRD30-CRT-010 | CJ-010 | Clarify PvC type percentages and first Easy/Medium/Hard generator tiers. | Tier 2 | Converts the two-spin model into usable generator families. | Question Generation Service. | Human clarified PvC percentages and addition/subtraction tiers; accepted `?` recommendation. |
| PRD30-CRT-011 | CJ-011 | Clarify Mixed Easy/Medium/Hard generator tiers. | Tier 2 | Completes the first pass of normal arithmetic generator tier definitions. | Question Generation Service. | Human accepted recommended mixed tier structure. |
| PRD30-CRT-012 | CJ-012 | Capture normal PvP question-type percentages. | Tier 2 | Completes top-level type-selection percentages for normal PvP. | Question Generation Service. | Recorded previously supplied human clarification. |
| PRD30-CRT-013 | CJ-013 | Finalize PvP question-mark mode difficulty subranges. | Tier 2 | Completes special PvP mode generator behavior by difficulty. | Question Generation Service. | Human accepted Codex's recommendation as final. |
| PRD30-CRT-014 | CJ-014 | Transfer stabilized question-generation rules into PRD 3.0. | Tier 2 | Synchronizes reader-facing PRD with stabilized constitutional state. | PRD 3.0 question-generation section. | Human requested PRD transfer. |
| PRD30-CRT-015 | CJ-015 | Stabilize MVP avatar and CPU character visual identity. | Tier 2 | Gives the future Excalibur implementation agent concrete art and effect direction. | Visual/game-feel direction. | Human clarified player avatar style, colors, CPU renames, and CPU designs. |
| PRD30-CRT-016 | CJ-016 | Transfer stabilized visual direction into PRD 3.0. | Tier 2 | Synchronizes reader-facing PRD with stabilized visual/game-feel state. | PRD 3.0 visual presentation section. | Human requested PRD transfer after Game Features and before Community Features. |
| PRD30-CRT-017 | CJ-017 | Stabilize 1P user flow and 1P Stats order. | Tier 2 | Begins closing the PRD 3.0 User Flow WIP section at product level. | User Flow section. | Human confirmed 1P journey and clarified stats order. |
| PRD30-CRT-018 | CJ-018 | Stabilize 2P Quick Match flow and results persistence boundary. | Tier 2 | Clarifies the main public PvP path before friend challenge and implementation architecture. | User Flow section and PvP persistence. | Human confirmed Quick Match flow and asked about results persistence. |
| PRD30-CRT-019 | CJ-019 | Stabilize 2P friend challenge flow. | Tier 2 | Clarifies the private PvP branch before rematch/D/C and implementation architecture. | User Flow section and private PvP behavior. | Human confirmed friend challenge flow. |
| PRD30-CRT-020 | CJ-020 | Stabilize PvP rematch flow. | Tier 2 | Clarifies post-match continuation behavior before User Flow transfer. | User Flow section and PvP results behavior. | Human confirmed rematch flow. |
| PRD30-CRT-021 | CJ-021 | Stabilize quit and disconnect behavior for PvP and PvC. | Tier 2 | Clarifies interruption outcomes before User Flow transfer and implementation architecture. | User Flow section, PvP void handling, and PvC progression. | Human clarified PvC has no reconnect grace and sudden disconnect voids with no stats. |
| PRD30-CRT-022 | CJ-022 | Transfer stabilized user flows into PRD 3.0. | Tier 2 | Replaces the WIP User Flow section with stabilized product-level flows. | PRD 3.0 User Flow section. | Human accepted roman-numeral flow list and asked to proceed. |
| PRD30-CRT-023 | CJ-023 | Superseded: restructure microservice details and realtime runtime requirements. | Tier 2 | Clarified responsibility ownership before the later modular-monolith cleanup. | Historical Backend Microservices wording and Realtime Runtime Requirements. | Superseded by CJ-066; current PRD uses backend modules inside the Express backend service. |
| PRD30-CRT-024 | CJ-024 | Make backend responsibility detail sections navigable from the PRD table of contents. | Tier 3 | Improves readability of the expanded backend architecture section. | Superseded historical Backend Microservices wording; current PRD uses Express backend modules. | Human requested contents links and backlinks; updated by CJ-066. |
| PRD30-CRT-025 | CJ-025 | Clarify friend search, Aura display, and request rate limiting. | Tier 2 | Incorporates the useful friend.MD deltas while excluding level and inactive-status expansion. | Community Friend System and Friends Management Service. | Human clarified exact/partial autocomplete, Aura replacement, and rate limiting. |
| PRD30-CRT-026 | CJ-026 | Perform PRD consistency pass before implementation planning. | Tier 2 | Removes cross-section ambiguity before service lifecycle and schema planning. | VS Rooms, Architecture Features, Friends, Stats / Leaderboard, CPU Opponent Service. | Human asked to do consistency pass first. |
| PRD30-CRT-027 | CJ-027 | Add PRD 3.0 Page / Screen Map. | Tier 2 | Bridges stabilized product flows to frontend page implementation. | Frontend page/display requirements. | Human asked for page display structure modeled after `Game_Pages.md`. |
| PRD30-CRT-028 | CJ-028 | Superseded: add Page Map Contents and Testing Contents inside the PRD. | Tier 2 | Made page requirements and verification checkpoints navigable before frontend implementation. | Frontend page/display requirements and QA planning. | Testing Contents was superseded by CJ-067; Page Navigation Contents remains in the PRD. |
| PRD30-CRT-029 | CJ-029 | Correct Page Map Contents nesting. | Tier 2 | Ensures page contents simulates navigation hierarchy instead of flat page categories. | Frontend page/display requirements. | Human identified profile/settings and Community were at the wrong level. |
| PRD30-CRT-030 | CJ-030 | Rename Home Page/Create Private Room and add legal pages. | Tier 2 | Aligns player-facing labels and satisfies project-required accessible legal pages. | Frontend page/display requirements and project compliance. | Human requested renames and asked to check the project PDF for minor pages. |
| PRD30-CRT-031 | CJ-031 | Remove About and narrow support navigation to required legal pages. | Tier 2 | Keeps MVP navigation aligned to subject requirements without optional page creep. | Frontend page/display requirements and project compliance. | Human clarified to take out About. |
| PRD30-CRT-032 | CJ-032 | Superseded: clarify Dockerized microservice deployment and server-side PvC. | Tier 2 | Historical deployment clarification before the four-service cleanup. | Architecture Features, Deployment / Dockerization, and Runtime Match State. | Superseded by CJ-066; server-side PvC remains, but one-container-per-backend-service does not. |
| PRD30-CRT-033 | CJ-033 | Rename Page Navigation, number top-level headings, and convert Dockerization to a required container purpose table. | Tier 2 | Keeps the PRD readable and implementation-directed instead of recommendation-styled. | Table of Contents, Page Navigation, and Deployment / Dockerization. | Human requested naming, numbering, and Docker wording cleanup. |
| PRD30-CRT-034 | CJ-034 | Superseded: make Redis a required MVP container for multi-client runtime coordination. | Tier 2 | Historical runtime-coordination clarification before the four-service cleanup. | Deployment / Dockerization and Runtime Match State. | Superseded by CJ-066; current PRD uses backend runtime memory for MVP temporary coordination. |
| PRD30-CRT-035 | CJ-035 | Audit PRD 3.0 for remaining implementation-blocking ambiguity. | Tier 2 | The PRD is close to implementation handoff, but server-owned combat must be deterministic before Live Match, CPU behavior, and sync tests can be safely built. | Core combat, exchange lifecycle, match termination, CPU behavior, ready state. | Human invoked `/krystalize GAME_PRD_3.0.md`. |
| PRD30-CRT-036 | CJ-036 | Stabilize core combat numbers and check inherited mechanics. | Tier 2 | Converts the main combat loop from named mechanics into implementable values while avoiding accidental inheritance of old rules that may have changed. | Live Match combat contract, same-time answers, `Additional DMG`, DEFEND stun, revenge. | Human provided concrete combat numbers and asked what unresolved terms meant. |
| PRD30-CRT-037 | CJ-037 | Confirm inherited same-time, `Additional DMG`, and stun rules. | Tier 2 | Closes the inherited-mechanics branch so Live Match can treat these combat rules as active PRD 3.0 truths. | Same-time answers, carryover damage, DEFEND aftermath. | Human confirmed inheritance with `yes`. |
| PRD30-CRT-038 | CJ-038 | Clarify DEFEND versus revenge precedence. | Tier 2 | Determines whether revenge can pierce DEFEND or whether DEFEND remains a universal timed shield. | DEFEND, revenge attack, stun, gauge consumption. | Human confirmed DEFEND absorbs revenge. |
| PRD30-CRT-039 | CJ-039 | Clarify input legality during DEFEND active window. | Tier 2 | Removes same-time answer overlap with DEFEND and defines DEFEND as a defense-only commitment. | DEFEND, same-time answers, input legality. | Human clarified defending players cannot answer until the active window passes. |
| PRD30-CRT-040 | CJ-040 | Clarify `MISSED!` vulnerability damage behavior. | Tier 2 | Determines whether wrong-answer vulnerability is an agency lockout or a damage multiplier. | Wrong answers, action lockout, DEFEND legality, damage calculation. | Human clarified normal damage only with no extra penalty. |
| PRD30-CRT-041 | CJ-041 | Clarify fight-round and match transition semantics. | Tier 3 | Defines deterministic round winner, tied-round, Final round, and mutual-loss transitions for Live Match implementation. | Fight-round state, match result state, persistence/results mapping. | Human confirmed HP-based transition model. |
| PRD30-CRT-042 | CJ-042 | Transfer stabilized combat rules into PRD 3.0 Core Gameplay. | Tier 2 | Keeps the implementation source of truth synchronized with stabilized constitutional state. | Core Gameplay, Runtime Match State, Live Match implementation handoff. | Human approved transfer into the relevant feature category. |
| PRD30-CRT-043 | CJ-043 | Clarify Max CPU behavior. | Tier 3 | Establishes the first baseline Duel CPU profile for CPU Opponent Service. | CPU Opponent Service, PvC behavior, Max profile. | Human clarified Max can use revenge and does not DEFEND. |
| PRD30-CRT-044 | CJ-044 | Clarify Min CPU behavior. | Tier 3 | Establishes Min as the early fast streak-pressure CPU profile. | CPU Opponent Service, PvC behavior, Min profile. | Human clarified Min has streak pressure with no DEFEND. |
| PRD30-CRT-045 | CJ-045 | Exchange Max and Min behavior labels. | Tier 3 | Corrects CPU name/profile mapping before later CPU behavior clarification continues. | CPU Opponent Service, CPU select display, unlock/progression config. | Human clarified Max suits the streak-pressure profile better. |
| PRD30-CRT-046 | CJ-046 | Refine Max/Min timing and Fury constant revenge. | Tier 3 | Locks CPU answer windows and clarifies Fury's special revenge behavior. | CPU Opponent Service, Max profile, Min profile, Fury profile. | Human clarified answer windows and Fury revenge on every question. |
| PRD30-CRT-047 | CJ-047 | Clarify Fury revenge versus DEFEND. | Tier 3 | Aligns Fury's CPU-specific every-question revenge with the general DEFEND precedence rule. | Fury profile, DEFEND, revenge attack, stun. | Human confirmed Fury's blocked revenge returns next question. |
| PRD30-CRT-048 | CJ-048 | Carry forward Fury block and critical-hit behavior. | Tier 3 | Reuses existing stable Fury behavior instead of re-asking for known numbers. | Fury profile, CPU Opponent Service, critical damage, block behavior. | Human asked Codex to check existing documentation. |
| PRD30-CRT-049 | CJ-049 | Carry forward Shi-eld block-specialist behavior. | Tier 3 | Reuses existing stable Shi-eld behavior and closes the block-specialist profile. | Shi-eld profile, CPU Opponent Service, hidden timing weakness. | Human confirmed inherited Shi-eld behavior. |
| PRD30-CRT-050 | CJ-050 | Carry forward Peasy expert streak behavior. | Tier 3 | Reuses existing stable Peasy behavior and closes the expert streak profile. | Peasy profile, CPU Opponent Service, streak pressure, block behavior. | Human confirmed inherited Peasy behavior. |
| PRD30-CRT-051 | CJ-051 | Carry forward Skore boss-like adaptive behavior. | Tier 3 | Reuses existing stable Skore behavior and closes the final CPU profile. | Skore profile, CPU Opponent Service, question generation, revenge, repeated blocks. | Human confirmed inherited Skore behavior. |
| PRD30-CRT-052 | CJ-052 | Confirm CPU profile implementation-readiness. | Tier 3 | Determines whether to keep clarifying CPU edge cases or move to the next runtime ambiguity. | CPU Opponent Service, implementation handoff. | Human confirmed profiles are ready as-is. |
| PRD30-CRT-053 | CJ-053 | Correct revenge ownership and add gameplay HUD contract. | Tier 2 | Resolves conflict between old self-filled revenge wording and the user's intended comeback meter; gives Excalibur implementation a concrete active-match display contract. | Core Gameplay, Live Match state, CPU profiles, Active Match HUD, visual feedback. | Human clarified revenge is purely for the hit player's comeback advantage and provided HUD display details. |
| PRD30-CRT-054 | CJ-054 | Clarify Additional DMG amount and clearing rule. | Tier 2 | Converts inherited same-time carryover from a named mechanic into a deterministic damage formula and lifecycle. | Same-time answers, `DRAW!`, `Additional DMG`, `TIE-BREAKER!`, DEFEND, revenge, Live Match damage resolution. | Human confirmed `Additional DMG = captured attack power at DRAW`, added to the next winner's damage, then cleared. |
| PRD30-CRT-055 | CJ-055 | Clarify question turnover and prompt construction timing. | Tier 2 | Defines when the next question appears and when gameplay timing starts, preventing attack power and timeout clocks from starting before the prompt is readable. | Live Match timing, question turnover, attack timer, attack power gauge, CPU answer timing, Excalibur prompt animation. | Human clarified immediate next-question appearance, sequential fly-in prompt construction, and timer start after the final item appears. |
| PRD30-CRT-056 | CJ-056 | Clarify authoritative answer ordering. | Tier 2 | Ensures PvP answer ordering, same-time detection, lockout rejection, and late-answer rejection are decided by the server instead of clients. | Live Match Service, answer validation, same-time answers, DEFEND, `MISSED!`, stun, timeout, PvP sync tests. | Human confirmed server receive timestamps and server-side action eligibility decide answer ordering. |
| PRD30-CRT-057 | CJ-057 | Clarify timeout clock behavior during lockouts. | Tier 2 | Defines whether DEFEND, `MISSED!`, and `STUNNED` are live-timer states or timer pauses. | Live Match timer, timeout, `SHOCK!`, DEFEND, `MISSED!`, stun, CPU timing, PvP sync tests. | Human confirmed the `6s` timer keeps running during lockouts and prompt construction is the only non-gameplay pause. |
| PRD30-CRT-058 | CJ-058 | Clarify DEFEND interruption and stacked damage handling. | Tier 2 | Closes the last MVP exchange-lifecycle edge by defining damage-land checkpoint, retroactive block rejection, stacked damage blocking, revenge consumption, stun, and carryover clearing. | DEFEND, revenge, `Additional DMG`, `TIE-BREAKER!`, stun, Live Match damage resolution, PvP sync tests. | Human confirmed blocked `Additional DMG` clears after its one next-exchange chance. |
| PRD30-CRT-059 | CJ-059 | Clarify Ready/Stop synchronization. | Tier 3 | Closes the remaining Matchmaking Service ready-state edge cases before implementation. | Ready state, Stop reset, auto-start, Challenge / Ready leave/disconnect, room release, Active Match transition. | Human confirmed the server-authoritative Ready/Stop state machine. |
| PRD30-CRT-060 | CJ-060 | Reconcile core combat ambiguity closure. | Tier 2 | Prevents stale warnings from contradicting the clarified combat contract. | Unresolved issue registry, warning registry, implementation handoff confidence. | Registry status reconciled after CJ-036 through CJ-058 closed the original combat ambiguity. |
| PRD30-CRT-061 | CJ-061 | Reframe next frontier toward implementation handoff/readiness. | Tier 2 | Prevents the process from re-asking closed gameplay questions and points the next work at preserving rules during implementation. | TypeScript domain boundary, Live Match events, Excalibur presentation events, backend runtime memory, persistence outputs. | Combat/ready product rules are closed enough to begin handoff planning; updated by CJ-066. |
| PRD30-CRT-062 | CJ-062 | Add Implementation Ownership Map to PRD 3.0. | Tier 2 | Makes the ownership framing explicit so future implementation does not confuse rule authority, runtime coordination, presentation, and persistence. | Architecture Features, TypeScript domain, backend modules, backend runtime memory, Excalibur, frontend input, database persistence. | Human accepted the name and placement under Architecture Features; updated by CJ-066. |
| PRD30-CRT-063 | CJ-063 | Add TypeScript Domain Core Contract to PRD 3.0. | Tier 3 | Gives future implementation a concrete rule-layer shape without changing gameplay behavior. | Domain modules, state objects, commands, domain events, explicit errors, deterministic tests. | Human accepted proceeding with the domain core contract. |
| PRD30-CRT-064 | CJ-064 | Add Live Server Event / API Contract to PRD 3.0. | Tier 3 | Gives future backend and frontend implementation a shared communication vocabulary without choosing framework-specific details. | Realtime actions/events, service handoffs, REST API groups, error codes, reconnect/void event rules. | Human accepted proceeding with the server event/API contract. |
| PRD30-CRT-065 | CJ-065 | Add Excalibur Scene / HUD Presentation Event Contract to PRD 3.0. | Tier 3 | Gives future frontend implementation a clear rendering and event-consumption boundary without moving gameplay authority into Excalibur. | Scene areas, HUD mapping, prompt/attack presentation, input rules, animation timing, presentation event queue, frontend verification. | Human asked to continue from the active presentation frontier. |
| PRD30-CRT-066 | CJ-066 | Clean up architecture navigation around the four-service modular-monolith model. | Tier 2 | Prevents stale microservice, Redis, and per-backend-container notes from drifting against the current PRD. | Services and Runtime Ownership, backend modules, Additional Backend Runtime Responsibilities, Database Service, Deployment / Dockerization, anchors. | Human provided the current numbering/navigation rules and asked to update state/journal docs. |
| PRD30-CRT-067 | CJ-067 | Move detailed page testing checkpoints to a separate test plan. | Tier 3 | Keeps the main PRD readable while preserving QA checkpoints for implementation handoff. | Page Navigation, external test plan, frontend/QA planning. | Human requested moving testing into another markdown file. |
| PRD30-CRT-068 | CJ-068 | Add architecture visual companion HTML. | Tier 3 | Helps readers scan the four-service architecture, backend-producer/frontend-consumer communication, backend ownership model, Additional Backend Runtime Responsibilities, Excalibur modules, and persistent volume relationship without changing the PRD source of truth. | Architecture communication, implementation handoff, service/module boundary clarity. | Human requested an HTML visual based on the architecture instructions, then clarified that communication should show which backend modules feed which frontend pages without making transport labels distract from that ownership map. |
| PRD30-CRT-069 | CJ-069 | Add PRD Page Coverage Map to the architecture visual. | Tier 3 | Makes the visual explicitly align with the PRD Page Navigation names instead of only showing summarized producer/consumer groups. | Frontend page implementation handoff, backend producer mapping, PRD page coverage. | Human asked whether the HTML aligned with the pages worked out in the PRD, then requested adding the coverage section. |
| PRD30-CRT-070 | CJ-070 | Refine architecture visual traffic flow into a full cycle. | Tier 3 | Makes browser, Nginx, Next.js, Express, database, volume, and return paths clear enough for implementation discussion. | Runtime traffic, Nginx routing, frontend/backend communication, database persistence, realtime gameplay. | Human asked to flesh out traffic flow instead of keeping a highly abstracted view. |
| PRD30-CRT-071 | CJ-071 | Split traffic flow into request and response lanes. | Tier 3 | Prevents the visual from implying backend API/WebSocket responses pass through the frontend container. | Runtime traffic, Nginx routing, Next.js page serving, Express API/realtime responses, database persistence. | Human asked to divide services into halves and clarify backend response routing. |
| PRD30-CRT-072 | CJ-072 | Add directional arrows to split traffic flow. | Tier 3 | Makes request and response movement visually obvious in the split traffic-flow diagram. | Architecture visual readability, request/response direction, implementation communication. | Human asked for arrows to show directional movement. |
| PRD30-CRT-073 | CJ-073 | Center-justify directional arrows in split traffic flow. | Tier 3 | Keeps arrow motion visually centered inside each connector pill. | Architecture visual readability, request/response direction. | Human clarified the arrows should be centered within the request/response connector blocks. |
| PRD30-CRT-074 | CJ-074 | Correct Next.js request/response wording in traffic flow. | Tier 3 | Prevents returned frontend code from being described as an incoming request-side responsibility. | Architecture visual precision, Next.js page serving, request/response clarity. | Human identified the wording belonged to the return side and asked to make the change. |
| PRD30-CRT-075 | CJ-075 | Clarify browser actions and split rectangle sentences. | Tier 3 | Prevents player UI actions from being confused with browser/network transport behavior. | Architecture visual precision, browser/frontend responsibility, traffic-flow readability. | Human clarified that players do not open WebSockets and asked for each sentence in each rectangle to start on a new line. |
| PRD30-CRT-076 | CJ-076 | Show Nginx branches to Next.js and Express separately. | Tier 3 | Prevents the visual from implying backend API/WebSocket calls continue through Next.js. | Nginx routing, frontend/backend communication, REST/WebSocket branch clarity. | Human identified the REST/WebSocket pill should connect from Nginx Request Routing rather than Next.js and requested a visual modification. |
| PRD30-CRT-077 | CJ-077 | Correct REST/WebSocket branch connector shape. | Tier 3 | Prevents the Nginx-to-Express connector from visually reading as a huge service block. | Architecture visual readability, Nginx branch display. | Human pointed out the giant oval rendering problem. |
| PRD30-CRT-078 | CJ-078 | Keep main request path vertical with Next.js side branch. | Tier 3 | Prevents the visual from making Next.js look like the main continuation after Nginx. | Architecture visual readability, Nginx branch display, REST/WebSocket path clarity. | Human provided a reference image and clarified the intended layout. |
| PRD30-CRT-079 | CJ-079 | Rebuild architecture visual around hybrid traffic model. | Tier 2 | Aligns the visual with the team's intended non-game page composition and game/realtime rendering architecture. | Next.js page composition, Express backend data, Excalibur/browser rendering, WebSocket authority, Database Service/Volume boundary. | Human clarified the intended model and asked to rebuild the HTML based on the latest discussion. |
| PRD30-CRT-080 | CJ-080 | Clarify REST, WebSocket, Active Match Host, and Excalibur roles in architecture visual. | Tier 2 | Prevents teammates from treating game/realtime behavior like ordinary REST page data or mistaking Excalibur for the backend connection owner. | REST non-game data, WebSocket realtime push, Nginx proxy boundary, browser-loaded Active Match Host, Excalibur rendering. | Human asked to update the HTML with the details from the REST/WebSocket and Active Match Host discussion. |
| PRD30-CRT-081 | CJ-081 | Remove persistence box from game runtime flow. | Tier 2 | Prevents the visual from implying database persistence is part of the live game rendering loop. | Live Match runtime state, WebSocket events, Active Match Host, Excalibur rendering, Database Service/Volume persistence boundary. | Human identified that the persistence box should not live in the right-side game runtime flow. |
| PRD30-CRT-082 | CJ-082 | Transfer two traffic flows into PRD architecture body. | Tier 2 | Keeps the Markdown PRD as the source of truth instead of leaving the clarified architecture only in the visual companion. | Services/runtime ownership, REST/WebSocket split, Active Match Host, Excalibur rendering, Database Service volume, persistence boundary. | Human asked to update the PRD and remove outdated architecture. |
| PRD30-CRT-083 | CJ-083 | House traffic flows as Architecture item 0. | Tier 3 | Makes the PRD architecture section read from traffic model to service ownership instead of burying the flow inside service vocabulary. | Architecture section structure, table of contents, Runtime Traffic Flows, Services And Runtime Ownership. | Human asked to take out the flow portions and house them as item 0 with the two flows itemized as i and ii. |
| PRD30-CRT-084 | CJ-084 | Remove extra architecture visual sections. | Tier 3 | Keeps the HTML visual focused and prevents duplicated page coverage and domain/presentation summaries from drifting from the PRD and test plan. | Architecture visual scope, PRD Page Coverage Map, game page production path, Domain Core And Presentation Boundary. | Human asked to delete the game production paths, PRD coverage map, and domain core / presentation boundary section. |
| PRD30-CRT-085 | CJ-085 | Remove contract-like visual join sections. | Tier 3 | Keeps the architecture visual from presenting producer/consumer and handoff descriptions as final join maps before a dedicated contract framing exists. | Architecture visual scope, code join points, contract descriptions, Authority Rules. | Human noted backend runtime handoffs are contract descriptions and asked to delete those sections for now while preserving Authority Rules. |
| PRD30-CRT-086 | CJ-086 | Audit PRD 3.0 consistency after architecture cleanup. | Tier 3 | Prevents stale visual-trace wording and ambiguous non-game response flow language from confusing implementation handoff. | PRD source-of-truth flow, architecture visual scope, test plan wording, constitutional trace consistency. | Human asked to check PRD 3.0 and relevant related documents for consistency and ambiguity. |
| PRD30-CRT-087 | CJ-087 | Clarify player identity image source options. | Tier 2 | Prevents upload-only profile identity wording from blocking the desired low-friction premade avatar option. | Profile page, selected identity image display, visual asset contract, player profile persistence. | Human clarified players should be able to upload their own picture or choose a premade avatar. |

## Warning Events

| Event ID | Date | Warning Syntax | Severity Tier | Trigger | Implications | Warning-Linked Rationale | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PRD30-WE-001 | 2026-05-31 | [WARNING :: AMBIGUITY] | Tier 2 | PRD 3.0 has both product-level VS room behavior and architecture-level PvP services. | Readers may mistake duplicated perspectives for conflicting requirements. | Product behavior and backend ownership were clarified by CJ-026. | closed by CJ-026 |
| PRD30-WE-002 | 2026-06-02 | [WARNING :: AMBIGUITY] | Tier 2 | Core combat mechanics were named but not numerically resolvable. | HP, damage, status effect, revenge, DEFEND, timeout, same-time, and `Additional DMG` behavior are now defined for MVP. | Combat is server-owned and central to the product promise, so implementation needs deterministic semantics. | closed by CJ-060 |
| PRD30-WE-003 | 2026-06-02 | [WARNING :: UNRESOLVED_DEPENDENCY] | Tier 2 | Exchange lifecycle was not fully specified. | Same-time answers, `Additional DMG`, question turnover/timer start, authoritative answer ordering, timeout clock behavior, and DEFEND/revenge interruption behavior are now defined for MVP. | Live Match, CPU Opponent, synchronization, and testing depend on this contract. | closed by CJ-058 |
| PRD30-WE-004 | 2026-06-02 | [WARNING :: INTENT_CHANGE_DETECTED] | Tier 2 | PRD 3.0 revenge was previously clarified as filling from the player's own successful hits, while PRD 1.0 revenge activated from receiving opponent streak damage. | The self-filled PRD 3.0 clarification is now superseded by CJ-053. | Human authority later corrected revenge to incoming-hit comeback ownership. | superseded |
| PRD30-WE-005 | 2026-06-02 | [WARNING :: INTENT_CHANGE_DETECTED] | Tier 3 | Max and Min behavior labels were exchanged after initial CPU behavior clarification. | Earlier Max-simple-attacker and Min-streak-pressure wording is superseded. | Human authority clarified the corrected CPU name/profile mapping. | accepted |
| PRD30-WE-006 | 2026-06-02 | [WARNING :: INTENT_CHANGE_DETECTED] | Tier 2 | PRD 3.0 revenge ownership changed from self-filled successful hits to incoming-hit comeback gauge. | The earlier self-filled revenge wording is superseded; Live Match and HUD implementation must fill revenge from successful hits received. | Human authority clarified revenge is purely to give the hit player a comeback advantage. | accepted |
| PRD30-WE-007 | 2026-06-02 | [WARNING :: INTENT_CHANGE_DETECTED] | Tier 2 | PRD 3.0 architecture moved from earlier backend microservice / Redis-required wording to four runtime services with an Express backend modular monolith. | Older architecture sessions are historical; implementation should follow the current PRD service/module vocabulary. | Human provided the current architecture/navigation rules and requested journal/state synchronization. | superseded by CJ-066 |

## Deferred Issues

| ID | Issue | Reason Deferred | Impact | Revisit Trigger | Linked Warning |
| --- | --- | --- | --- | --- | --- |
| PRD30-DI-001 | Redis adoption decision. | Superseded by CJ-066. | Redis is not part of the current PRD 3.0 required container set; MVP temporary state is backend runtime memory. | Revisit only if implementation expands beyond a single backend process or needs external coordination. | PRD30-WE-007 |

## Traceability Index

| Trace ID | Journal Entry | Related State Item | Source | Notes |
| --- | --- | --- | --- | --- |
| PRD30-JTR-001 | CJ-001 | PRD30-LT-002 | Human clarification | Product sections and architecture sections both needed. |
| PRD30-JTR-002 | CJ-001 | PRD30-UI-001 | docs/game/GAME_PRD_3.0.md | Original realtime/matchmaking naming ambiguity was later clarified in CJ-023. |
| PRD30-JTR-003 | CJ-002 | PRD30-LT-012 | docs/game/GAME_PRD_3.0.md | Product Promise added before the MVP feature list. |
| PRD30-JTR-004 | CJ-003 | PRD30-LT-013 | docs/game/GAME_PRD_3.0.md | Same-prompt rule added to Question Generation And Difficulty. |
| PRD30-JTR-005 | CJ-004 | PRD30-LT-014 | docs/game/GAME_PRD_3.0.md | Comeback easy chance now applies only to the next shared prompt after a qualifying successful exchange. |
| PRD30-JTR-006 | CJ-005 | PRD30-LT-015 | docs/game/GAME_PRD_3.0.md | Fury and Skore CPU question rules restored into the CPU opponent profile table. |
| PRD30-JTR-007 | CJ-006 | PRD30-LT-016 | docs/game/GAME_PRD_3.0.md | Armed comeback easy chance now takes priority over CPU-specific hard-question rules. |
| PRD30-JTR-008 | CJ-007 | PRD30-LT-017 | docs/game/GAME_PRD_3.0.md | Spinner wording reframed as backend selection; visible spinner UI is not required for MVP. |
| PRD30-JTR-009 | CJ-008 | PRD30-LT-018, PRD30-LT-019 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Codes stay in constitutional artifacts; PRD text stays plain-language and is updated after state stabilization. |
| PRD30-JTR-010 | CJ-009 | PRD30-LT-020, PRD30-LT-021, PRD30-LT-022 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Round-level type/difficulty selection and 3-second spinner prep stabilized in state first. |
| PRD30-JTR-011 | CJ-010 | PRD30-LT-023, PRD30-LT-024, PRD30-LT-025, PRD30-LT-026, PRD30-LT-027 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | PvC type selection and initial generator tier rules stabilized in state first. |
| PRD30-JTR-012 | CJ-011 | PRD30-LT-028 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Mixed Easy/Medium/Hard generator tiers stabilized in state first. |
| PRD30-JTR-013 | CJ-012 | PRD30-LT-029 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Normal PvP question-type percentages captured in state first. |
| PRD30-JTR-014 | CJ-013 | PRD30-LT-027 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | PvP `?` mode Easy/Medium/Hard subranges finalized in state first. |
| PRD30-JTR-015 | CJ-014 | PRD30-UI-004 | docs/game/GAME_PRD_3.0.md | Stabilized question-generation rules transferred into PRD 3.0 in plain language. |
| PRD30-JTR-016 | CJ-015 | PRD30-LT-030, PRD30-LT-031, PRD30-LT-032, PRD30-LT-033, PRD30-LT-034, PRD30-LT-035, PRD30-LT-036, PRD30-LT-037, PRD30-LT-038, PRD30-LT-039, PRD30-LT-040, PRD30-LT-041, PRD30-LT-042 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | MVP player avatar and CPU character visual identities stabilized in state first. |
| PRD30-JTR-017 | CJ-016 | PRD30-UI-005 | docs/game/GAME_PRD_3.0.md | Stabilized visual/game-feel direction transferred into PRD 3.0 in plain language. |
| PRD30-JTR-018 | CJ-017 | PRD30-LT-043, PRD30-LT-044, PRD30-LT-045, PRD30-LT-046, PRD30-LT-047, PRD30-LT-048 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | 1P product flow, 1P Stats order, replayability, back navigation, and PvC quit behavior stabilized in state first. |
| PRD30-JTR-019 | CJ-018 | PRD30-LT-049, PRD30-LT-050, PRD30-LT-051 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Quick Match flow and results persistence boundary stabilized in state first. |
| PRD30-JTR-020 | CJ-019 | PRD30-LT-052, PRD30-LT-053, PRD30-LT-054 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Friend challenge flow stabilized in state first. |
| PRD30-JTR-021 | CJ-020 | PRD30-LT-055, PRD30-LT-056, PRD30-LT-057 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | PvP rematch flow stabilized in state first. |
| PRD30-JTR-022 | CJ-021 | PRD30-LT-058, PRD30-LT-059, PRD30-LT-060, PRD30-LT-061, PRD30-LT-062 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | PvP/PvC quit and disconnect behavior plus PvC messaging stabilized in state first. |
| PRD30-JTR-023 | CJ-022 | PRD30-LT-063 | docs/game/GAME_PRD_3.0.md | Stabilized user-flow structure transferred into PRD 3.0. |
| PRD30-JTR-024 | CJ-023 | PRD30-LT-064, PRD30-LT-065, PRD30-UI-001 | docs/game/GAME_PRD_3.0.md | Microservice details added and realtime runtime requirements renamed in PRD 3.0. |
| PRD30-JTR-025 | CJ-024 | PRD30-LT-066 | docs/game/GAME_PRD_3.0.md | Backend service detail sections added to TOC with stable anchors and backlinks. |
| PRD30-JTR-026 | CJ-025 | PRD30-LT-067, PRD30-LT-068, PRD30-LT-069 | docs/game/GAME_PRD_3.0.md | Friend System and Friends Management Module now include Aura display, partial/autocomplete search, indexed lookup expectation, request rate limiting, and no inactive status. |
| PRD30-JTR-027 | CJ-026 | PRD30-LT-070, PRD30-LT-071, PRD30-UI-002, PRD30-UI-003 | docs/game/GAME_PRD_3.0.md | PRD consistency pass clarified VS room versus architecture boundaries, room-cap wording, friend request Aura display, and CPU progress display ownership. |
| PRD30-JTR-028 | CJ-027 | PRD30-LT-072 | docs/game/GAME_PRD_3.0.md | Page / Screen Map added after User Flow with clickable page navigation and PRD 3.0 MVP screen behavior. |
| PRD30-JTR-029 | CJ-028 | PRD30-LT-073 | docs/game/GAME_PRD_3.0.md | Superseded by CJ-067 for Testing Contents; Page Navigation Contents remains in the PRD. |
| PRD30-JTR-030 | CJ-029 | PRD30-LT-074 | docs/game/GAME_PRD_3.0.md | Page Map Contents nested to show actual navigation levels and shared-screen flow paths. |
| PRD30-JTR-031 | CJ-030 | PRD30-LT-075, PRD30-LT-076, PRD30-LT-077 | docs/game/GAME_PRD_3.0.md | Page labels updated to Home Page and Create Private Room; Privacy Policy, Terms Of Service, and related testing checkpoints added. Superseded in part by CJ-031 for About removal. |
| PRD30-JTR-032 | CJ-031 | PRD30-LT-077, PRD30-LT-078 | docs/game/GAME_PRD_3.0.md | About removed from the MVP page map; Info And Legal Pages renamed to Legal Pages and testing narrowed to Privacy Policy and Terms Of Service. |
| PRD30-JTR-033 | CJ-032 | PRD30-LT-079, PRD30-LT-080, PRD30-LT-081, PRD30-LT-082 | docs/game/GAME_PRD_3.0.md | Historical Deployment / Dockerization microservice-container wording added; superseded by CJ-066. PvC runtime remains server-side through Live Match Module. |
| PRD30-JTR-034 | CJ-033 | PRD30-LT-072, PRD30-LT-073, PRD30-LT-083, PRD30-LT-084 | docs/game/GAME_PRD_3.0.md | Page / Screen Map renamed to Page Navigation; top-level body headings numbered; Deployment / Dockerization rewritten as a required container purpose table. |
| PRD30-JTR-035 | CJ-034 | PRD30-LT-082 | docs/game/GAME_PRD_3.0.md | Historical Redis-required MVP container wording added; superseded by CJ-066 in favor of backend runtime memory for MVP temporary coordination. |
| PRD30-JTR-036 | CJ-035 | PRD30-UI-007, PRD30-UI-008, PRD30-UI-009, PRD30-UI-010, PRD30-UI-011 | docs/game/GAME_PRD_3.0.md | KRYSTALIZE audit surfaced remaining combat, exchange, match-end, CPU behavior, and ready-state ambiguity before implementation. |
| PRD30-JTR-037 | CJ-036 | PRD30-LT-085, PRD30-LT-086, PRD30-LT-087, PRD30-LT-088, PRD30-LT-089, PRD30-LT-090, PRD30-LT-091, PRD30-LT-092, PRD30-LT-093, PRD30-LT-094, PRD30-LT-095, PRD30-LT-096, PRD30-UI-012 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Core combat numbers locked; inherited same-time, Additional DMG, and stun rules identified for explicit PRD 3.0 confirmation. |
| PRD30-JTR-038 | CJ-037 | PRD30-LT-094, PRD30-LT-095, PRD30-LT-096, PRD30-UI-012 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Human confirmed inherited `150ms` same-time, shared `Additional DMG`, and `1.5s` successful DEFEND stun as active PRD 3.0 truths. |
| PRD30-JTR-039 | CJ-038 | PRD30-LT-097 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Human confirmed active DEFEND absorbs revenge attack damage, consumes the revenge gauge, applies stun to the attacker, and prevents HP damage. |
| PRD30-JTR-040 | CJ-039 | PRD30-LT-098 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Human clarified active DEFEND prevents the defending player from answering until the active window passes. |
| PRD30-JTR-041 | CJ-040 | PRD30-LT-099 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Human clarified `MISSED!` prevents action and DEFEND for `1s`, while opponent attacks deal normal damage without an extra penalty multiplier. |
| PRD30-JTR-042 | CJ-041 | PRD30-LT-100, PRD30-LT-101, PRD30-LT-102, PRD30-LT-103, PRD30-LT-104, PRD30-UI-009 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Human confirmed fight-round and match transition semantics for HP-based round wins, tied rounds, Final round, and mutual final-round loss. |
| PRD30-JTR-043 | CJ-042 | PRD30-LT-105 | docs/game/GAME_PRD_3.0.md | Stabilized combat and match-resolution rules transferred into Core Gameplay; Runtime Match State cross-references the Core Gameplay rules. |
| PRD30-JTR-044 | CJ-043 | PRD30-LT-106 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Superseded by CJ-045; Max is now the streak-pressure CPU. |
| PRD30-JTR-045 | CJ-044 | PRD30-LT-107 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Superseded by CJ-045; Min is now the simple attacker CPU. |
| PRD30-JTR-046 | CJ-045 | PRD30-LT-108, PRD30-LT-109 | docs/game/GAME_PRD_3.0.md | Max and Min behavior labels exchanged in PRD CPU opponent profile table and constitutional state. |
| PRD30-JTR-047 | CJ-046 | PRD30-LT-108, PRD30-LT-109, PRD30-LT-110 | docs/game/GAME_PRD_3.0.md | Max answer window changed to `2s` to `3s`, Min answer window changed to `2.5s` to `3.5s`, and Fury revenge is active for every question. |
| PRD30-JTR-048 | CJ-047 | PRD30-LT-111 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Fury's every-question revenge attack can be blocked by DEFEND for that question and is active again on the next question. |
| PRD30-JTR-049 | CJ-048 | PRD30-LT-112 | docs/game/GAME_PRD_3.0.md | Fury inherited 80% block, 20% hit, post-block power-30 attack attempt, and 50% critical chance at power 30 for `attackPower x 3` damage. |
| PRD30-JTR-050 | CJ-049 | PRD30-LT-113 | docs/game/GAME_PRD_3.0.md | Shi-eld inherited block specialist behavior and PRD CPU opponent profile table was updated. |
| PRD30-JTR-051 | CJ-050 | PRD30-LT-114 | docs/game/GAME_PRD_3.0.md | Peasy inherited expert streak behavior and PRD CPU opponent profile table was updated. |
| PRD30-JTR-052 | CJ-051 | PRD30-LT-115, PRD30-UI-010 | docs/game/GAME_PRD_3.0.md | Skore inherited boss-like adaptive behavior, PRD CPU opponent profile table was updated, and CPU profile ambiguity was closed. |
| PRD30-JTR-053 | CJ-052 | PRD30-UI-010 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Completed CPU behavior profile table confirmed implementation-ready as-is. |
| PRD30-JTR-054 | CJ-053 | PRD30-LT-116, PRD30-LT-117 | docs/game/GAME_PRD_3.0.md | Revenge now fills from incoming successful hits, and Active Match has a dedicated Gameplay Screen / HUD Presentation Contract. |
| PRD30-JTR-055 | CJ-054 | PRD30-LT-118 | docs/game/GAME_PRD_3.0.md | `Additional DMG` amount, next-exchange stacking, `TIE-BREAKER!`, and clearing behavior transferred into Core Gameplay. |
| PRD30-JTR-056 | CJ-055 | PRD30-LT-119 | docs/game/GAME_PRD_3.0.md | Question turnover, prompt item fly-in construction, and timer start after final prompt item transferred into Core Gameplay and HUD contract. |
| PRD30-JTR-057 | CJ-056 | PRD30-LT-120 | docs/game/GAME_PRD_3.0.md | Authoritative answer ordering, server receive timestamps, action eligibility, same-time timestamp basis, and late/locked-out answer rejection transferred into Core Gameplay. |
| PRD30-JTR-058 | CJ-057 | PRD30-LT-121 | docs/game/GAME_PRD_3.0.md | Timeout-clock behavior during DEFEND, `MISSED!`, and `STUNNED` lockouts transferred into Core Gameplay. |
| PRD30-JTR-059 | CJ-058 | PRD30-LT-122 | docs/game/GAME_PRD_3.0.md | DEFEND damage-land timing, stacked damage blocking, revenge consumption, stun, and blocked `Additional DMG` clearing transferred into Core Gameplay. |
| PRD30-JTR-060 | CJ-059 | PRD30-LT-123 | docs/game/GAME_PRD_3.0.md | Ready/Stop synchronization transferred into Ready State, PvP Ready / Match Start Flow, and Challenge / Ready page behavior. |
| PRD30-JTR-061 | CJ-060 | PRD30-UI-007, PRD30-WR-001 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Stale core-combat ambiguity issue and warning closed after combat contract clarification completed. |
| PRD30-JTR-062 | CJ-061 | PRD30-UI-013 | docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Active frontier reframed toward implementation handoff/readiness, with TypeScript domain and Excalibur boundary mapping as the recommended starting point. |
| PRD30-JTR-063 | CJ-062 | PRD30-LT-124, PRD30-UI-013 | docs/game/GAME_PRD_3.0.md | Implementation Ownership Map transferred into Architecture Features and the prior handoff/readiness unresolved item closed. |
| PRD30-JTR-064 | CJ-063 | PRD30-LT-125, PRD30-UI-014 | docs/game/GAME_PRD_3.0.md | TypeScript Domain Core Contract transferred into Architecture Features and the prior domain-core active question closed. |
| PRD30-JTR-065 | CJ-064 | PRD30-LT-126, PRD30-UI-015 | docs/game/GAME_PRD_3.0.md | Live Server Event / API Contract transferred into Architecture Features and the prior server event-boundary active question closed. |
| PRD30-JTR-066 | CJ-065 | PRD30-LT-127, PRD30-UI-016 | docs/game/GAME_PRD_3.0.md | Excalibur Scene / HUD Presentation Event Contract transferred into Architecture Features and the prior presentation-boundary active question closed. |
| PRD30-JTR-067 | CJ-066 | PRD30-LT-128, PRD30-LT-129, PRD30-LT-130, PRD30-LT-131, PRD30-LT-132, PRD30-LT-133, PRD30-UI-017 | docs/game/GAME_PRD_3.0.md | Architecture navigation synchronized to four runtime services, Express backend modular monolith, backend modules i-ix plus Additional Backend Runtime Responsibilities x, Database Service as 4th service, and verified anchors. |
| PRD30-JTR-068 | CJ-067 | PRD30-LT-134, PRD30-UI-018 | docs/game/GAME_PRD_3.0_TEST_PLAN.md | Detailed page testing checkpoints moved out of `GAME_PRD_3.0.md` into a dedicated test plan; the PRD keeps a lightweight link. |
| PRD30-JTR-069 | CJ-068 | PRD30-LT-135, PRD30-UI-019 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Narrowed by CJ-084 and CJ-085. Standalone HTML visual mirrors the current four-service architecture, two-flow runtime model, backend modular-monolith modules, expanded Additional Backend Runtime Responsibilities, Excalibur scene/view modules, Database Service to Volume relationship, schema/table areas inside the Volume, and authority boundaries. |
| PRD30-JTR-070 | CJ-069 | PRD30-LT-136 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Superseded by CJ-084. The architecture visual no longer includes a PRD Page Coverage Map. |
| PRD30-JTR-071 | CJ-070 | PRD30-LT-137 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Superseded by CJ-079 and narrowed by CJ-086. The current visual uses the hybrid two-flow model and no longer includes the older concrete Signup, Quick Match, and Active Match example paths. |
| PRD30-JTR-072 | CJ-071 | PRD30-LT-138 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Superseded by CJ-079 and narrowed by CJ-086. The current hybrid visual no longer uses the old split request/response service boxes; the realtime rule that Express WebSocket responses return through Nginx to the browser remains valid for game/realtime flows. |
| PRD30-JTR-073 | CJ-072 | PRD30-LT-139 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Superseded by CJ-079 and narrowed by CJ-086. The current hybrid visual uses top-to-bottom flow steps rather than the old split request/response connector rows. |
| PRD30-JTR-074 | CJ-073 | PRD30-LT-140 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Superseded by CJ-079 and CJ-086. The current hybrid visual no longer uses the old split request/response connector blocks. |
| PRD30-JTR-075 | CJ-074 | PRD30-LT-141 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Superseded by CJ-079 and clarified by CJ-086. The current PRD separates Next.js page composition from browser-loaded frontend updates. |
| PRD30-JTR-076 | CJ-075 | PRD30-LT-142 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Superseded by CJ-079 and CJ-086. The current hybrid visual no longer uses the old split-flow request/response rectangles. |
| PRD30-JTR-077 | CJ-076 | PRD30-LT-143 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Superseded by CJ-079 and CJ-086. The current hybrid visual shows two direct flows rather than the older Nginx branch diagram. |
| PRD30-JTR-078 | CJ-077 | PRD30-LT-144 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Superseded by CJ-079 and CJ-086. The current hybrid visual no longer uses the old Nginx-to-Express branch connector shape. |
| PRD30-JTR-079 | CJ-078 | PRD30-LT-145 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Superseded by CJ-079. This earlier traffic visual treated Browser -> Nginx -> Express -> Database as the main vertical request path, but the current visual uses the hybrid Next.js-composed non-game page plus browser-loaded Excalibur realtime model. |
| PRD30-JTR-080 | CJ-079 | PRD30-LT-146 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Primary Traffic Flow now uses the hybrid model: Next.js composes non-game pages with Express data when needed, while browser-loaded Excalibur renders game/realtime events owned by Express. |
| PRD30-JTR-081 | CJ-080 | PRD30-LT-147 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Primary Traffic Flow now labels REST for stable non-game data, WebSocket for realtime/server-pushed flows, and Active Match Host as browser-loaded frontend glue that passes Express events into Excalibur. |
| PRD30-JTR-082 | CJ-081 | PRD30-LT-148 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Primary Traffic Flow now keeps Database Service + Volume out of the game/realtime rendering lane; persistence remains represented in durable data/result/page paths. |
| PRD30-JTR-083 | CJ-082 | PRD30-LT-149 | docs/game/GAME_PRD_3.0.md | PRD architecture body now contains the explicit two-flow runtime model and removes the older abstract runtime traffic wording. |
| PRD30-JTR-084 | CJ-083 | PRD30-LT-150 | docs/game/GAME_PRD_3.0.md | Runtime Traffic Flows now sits as Architecture item 0, with Non-game Page Flow and Game / Realtime Flow nested as i and ii before Services And Runtime Ownership. |
| PRD30-JTR-085 | CJ-084 | PRD30-LT-151 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Architecture visual no longer includes game page production paths, the PRD Page Coverage Map, or the Domain Core And Presentation Boundary section. |
| PRD30-JTR-086 | CJ-085 | PRD30-LT-152 | docs/game/GAME_PRD_3.0_ARCHITECTURE_VISUAL.html | Architecture visual no longer includes Backend Producers And Frontend Consumers or Backend Runtime Handoffs; Authority Rules remains. |
| PRD30-JTR-087 | CJ-086 | PRD30-LT-153 | docs/game/GAME_PRD_3.0.md, docs/game/GAME_PRD_3.0_TEST_PLAN.md, docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Consistency audit clarified Non-game Page Flow requester behavior, removed stale info/legal wording, and marked older visual trace entries as superseded by the current hybrid visual model. |
| PRD30-JTR-088 | CJ-087 | PRD30-LT-154 | docs/game/GAME_PRD_3.0.md, docs/game/GAME_PRD_3.0_IMPLEMENTATION.md, docs/game/GAME_PRD_3.0_PAGES.md, docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md | Player identity image expanded from upload-only to upload-or-premade-avatar, with selected identity image wording synchronized across profile, social, match, asset, and persistence docs. |
