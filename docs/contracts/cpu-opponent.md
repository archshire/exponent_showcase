# CPU Opponent Contract

## Purpose

The CPU Opponent module decides what a CPU combatant wants to do during PvC: answer, defend, wait, or take no action.

It is an internal backend contract. The browser and Excalibur do not ask CPU Opponent directly.

## Owner

Primary owner: `apps/server/src/services/cpu-opponent.service.ts`

Configuration owner: `apps/server/src/config/cpu-opponents.config.ts`

Shared TypeScript contract: `packages/shared/src/contracts/cpu-opponent.contract.ts`

Called by: Live Match Module.

## Does Not Own

CPU Opponent does not directly mutate HP, apply damage, persist results, emit Socket.IO events, or render animations.

It returns a decision. Live Match decides whether that decision is legal in the current authoritative state and applies it through the same combat path as a human action.

## PRD 3.1 CPU Roster

Active CPU opponents:

| Order | Key | Display Name |
| --- | --- | --- |
| 1 | `min` | Min |
| 2 | `max` | Max |
| 3 | `fury` | Fury |
| 4 | `shi_eld` | Shi-eld |

Deferred CPU opponents:

- Peasy.
- Skore.

Deferred CPU opponents are hidden from PRD 3.1 MVP UI and stats surfaces.

## PRD 3.1 CPU Unlocks

| CPU | Unlock Criteria |
| --- | --- |
| Max | Available after tutorial. |
| Min | Available after tutorial. |
| Fury | 2 Max wins and 2 Min wins. |
| Shi-eld | 2 Fury wins and 1 completed PvP match. |

## Question Pressure

Hard difficulty is removed from the PRD 3.1 question generator.

Former Hard-pressure CPU behavior is represented by Medium pressure:

| CPU | Medium Chance | Easy Chance |
| --- | --- | --- |
| Fury | `70%` | `30%` |

Skore is deferred and does not apply CPU question pressure in PRD 3.1.

## Main Inputs

`decideCpuAction(context)` receives:

| Field | Meaning |
| --- | --- |
| `cpuKey` | CPU opponent key: `min`, `max`, `fury`, or `shi_eld`. |
| `serverTimestampMs` | Current server time for the decision. |
| `questionStartedAtMs` | When the active question started. |
| `questionDeadlineMs` | When the active question closes. |
| `expectedAnswer` | Server-owned answer for the current question. |
| `cpuCanAnswer` | Whether Live Match currently allows CPU to answer. |
| `cpuCanDefend` | Whether Live Match currently allows CPU to use DEFEND. |
| `cpuRevengeActive` | Whether CPU has revenge available. |
| `playerAttackIncoming` | Whether a player attack is incoming and may be defended. |
| `playerIsLockedOut` | Whether player is in a lockout state. |
| `cpuSuccessfulBlockThisQuestion` | Whether CPU recently blocked and may follow up. |
| `rng` | Optional deterministic random source for tests. |

`getCpuQuestionPressure(cpuKey)` receives:

| Field | Meaning |
| --- | --- |
| `cpuKey` | CPU profile whose question pressure should be read. |

## Main Outputs

`decideCpuAction(context)` returns:

| Field | Meaning |
| --- | --- |
| `action` | `answer`, `defend`, `wait`, or `no_action`. |
| `reason` | Human-readable explanation for debugging. |
| `performAtMs` | When Live Match should apply the action, if scheduled. |
| `answer` | CPU submitted answer when action is `answer`. |
| `targetAttackPower` | Desired attack power for special CPU behavior. |
| `wantsStreak` | Whether CPU behavior is trying to maintain streak pressure. |
| `usesRevenge` | Whether CPU wants to spend revenge. |
| `criticalChance` | Optional critical chance hint for CPU profile behavior. |
| `damageMultiplier` | Optional CPU profile damage multiplier. |

`getCpuQuestionPressure(cpuKey)` returns:

| Field | Meaning |
| --- | --- |
| `cpuMediumQuestionChance` | Optional chance to pressure Medium questions. |

## Integration Flow

1. Live Match owns the PvC runtime session.
2. Live Match asks CPU Opponent for a decision using the current authoritative state.
3. CPU Opponent returns an action decision.
4. Live Match applies the decision only if still legal at the server timestamp.
5. Live Match passes CPU question pressure to Question Generator when relevant.
6. Live Match emits the resulting authoritative events to the browser.

## Notes

- CPU profile values are now in config, but balancing may still change.
- Final Socket.IO event payloads for CPU decisions should remain owned by Live Match, not CPU Opponent.
