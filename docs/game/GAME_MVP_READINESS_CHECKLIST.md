# Game MVP Readiness Checklist

## Purpose

This document summarizes whether the game MVP has enough clarified ground truth to begin implementation.

It does not replace:

- `docs/game/GAME_PRD_1.0.md`
- `docs/game/GAME_LOGIC.md`
- `docs/game/K_GAME_PRD_1.0_CONSTITUTIONAL_STATE.md`
- `docs/game/K_GAME_PRD_1.0_CONSTITUTIONAL_JOURNAL.md`
- `docs/game/handoff/GAME_DATABASE_HANDOFF.md`
- `docs/game/handoff/GAME_REALTIME_SERVER_HANDOFF.md`

Its job is to help the game developer and teammates see what is stable, what has been handed off, and what is intentionally deferred.

## Readiness Summary

| Area | Status | Notes |
| --- | --- | --- |
| Core combat rules | Ready for MVP implementation | Attack power, streak, revenge, DEFEND, stun, `MISSED!`, `SHOCK!`, same-time answers, and `Additional DMG` are clarified. |
| Match lifecycle | Ready for MVP implementation | 60-second fight rounds, best-of match structure, ties, Final round, and mutual loss are clarified. |
| Question generation | Ready for MVP implementation | Addition, subtraction, mixed, `?` mode, difficulty probabilities, and PvP-only arcade/reaction mode are clarified. |
| Tutorial CPU 1 and CPU 2 | Ready for MVP implementation | CPU 1 teaches streak/revenge; CPU 2 teaches DEFEND. |
| Duel CPU opponents | Ready for MVP implementation | Maki, Kander, Fury, Shi-eld, Peasy, and Skore profiles are clarified enough for Version 1. |
| 1P flow | Ready for MVP implementation | Tutorial, Duel CPU, Shop, and Stats paths are clarified. |
| 2P flow | Ready for MVP implementation | VS option page, Quick Match, Leaderboard, lobby, room-ready page, PvP match, spectator view, and results return paths are clarified. |
| Post-match results | Ready for MVP implementation | Winner/loser/voided result screens, rewards, quotes, replay, Add Friend, and Back behavior are clarified. |
| Player profile/stats | Ready for MVP implementation | Accuracy, longest streak, player type, rewards, D/C, public profile, friend list, and internal engagement analytics are clarified. |
| Leaderboard | Ready for MVP implementation | PvP-only for MVP; requires at least 10 valid PvP matches; ranking priority is win rate, then accuracy, then current win streak; mutual final-round losses do not affect win/loss rate; display shows top 20 with paging up to 100 and the player's own rank at the top. |
| Version 1 shop | Ready for MVP implementation | Shop appears in 1P after CPU 2, contains name change and CPU unlocks, and excludes gameplay modifiers. |
| Database handoff | Ready for teammate handoff | `docs/game/handoff/GAME_DATABASE_HANDOFF.md` exists. Exact SQL/ORM/migrations remain teammate implementation work. |
| Realtime server handoff | Ready for teammate handoff | `docs/game/handoff/GAME_REALTIME_SERVER_HANDOFF.md` exists. Exact socket payloads and load validation remain implementation work. |
| Webhook handoff | Deferred | Separate webhook handoff is only needed if external event notification becomes a real teammate responsibility. |
| TypeScript domain implementation names | Deferred | Domain boundary is clear; exact file/class/function names can wait until implementation. |
| Excalibur scene/Actor bindings | Deferred | Excalibur boundary is clear; exact scene/Actor/component names can wait until implementation. |
| Technical capacity validation | Framed, not completed | Placeholder caps and validation targets exist; real validation requires server implementation and load testing. |
| Anti-staleness/deeper gameplay layer | Deferred | Human explicitly deferred this beyond MVP stabilization. |
| Future modifier governance | Deferred | Gameplay-affecting modifiers are held off until the MVP is stable and data exists. |

## MVP Build-Ready Core

The following areas are stable enough to start building:

- combat rule engine.
- question generator.
- match lifecycle.
- PvC tutorial flow.
- Duel CPU opponent behavior.
- PvP room and ready flow.
- PvP match synchronization requirements.
- spectator read-only behavior.
- post-match results.
- reward and stats calculation.
- leaderboard ranking and display rules.
- profile and public-profile fields.
- Version 1 shop.
- database persistence shape.
- realtime server responsibility boundary.

## Team Handoff Artifacts

| Handoff | File | Serves | Status |
| --- | --- | --- | --- |
| Game PRD | `docs/game/GAME_PRD_1.0.md` | All teammates as the readable MVP reference. | Ready for MVP handoff. |
| Game logic constitution | `docs/game/GAME_LOGIC.md` | Game developer and implementation agents. | Active source spec. |
| Database handoff | `docs/game/handoff/GAME_DATABASE_HANDOFF.md` | Database teammate / `packages/db`. | Ready for MVP handoff. |
| Realtime server handoff | `docs/game/handoff/GAME_REALTIME_SERVER_HANDOFF.md` | Server teammate / `apps/server`. | Ready for MVP handoff. |
| Webhook handoff | Not created yet. | Future external notification teammate if needed. | Deferred. |
| TypeScript domain handoff | Not created yet. | Game implementation phase. | Optional next artifact. |
| Excalibur implementation handoff | Not created yet. | Game implementation phase. | Optional next artifact. |

## Deferred On Purpose

These are not blockers for MVP implementation:

- gameplay-affecting shop modifiers.
- modifier-enabled match governance.
- deeper anti-staleness game layer.
- exact player-type threshold tuning after playtesting.
- exact Excalibur scene, Actor, and UI component names.
- exact TypeScript module/function/class names.
- exact socket payload schemas.
- exact ORM and migration syntax.
- final production load limits.
- external webhook notification contract.

## Implementation Cautions

### Preserve Domain Truth

The TypeScript domain logic should remain the source of combat truth.

Excalibur should render and animate state; it should not independently decide damage, DEFEND success, rewards, or match outcome.

### Protect PvP Trust

For PvP, the realtime server should be authoritative for:

- room membership.
- ready state.
- answer timing.
- DEFEND legality.
- same-time answer resolution.
- HP changes.
- match completion, void, or forfeit.
- disconnect/quit accountability.

### Keep Persistence Focused

The database should persist:

- player identity/profile.
- unlocks.
- coin ledger.
- central match records.
- match question logs.
- player match references.
- friend requests/friendships.
- internal engagement analytics.

It should not store full live runtime state as the main persistence model.

### Do Not Expose Internal Analytics

Engagement analytics are for team sense-making and should not appear in public player profiles by default.

### Treat Capacity Numbers As Placeholders

Current limits such as `100` rooms and `10` viewers are MVP planning values, not validated infrastructure guarantees.

## Recommended Next Step

The project is ready to move toward implementation planning.

Recommended next artifact if the human wants one:

```text
docs/game/GAME_TYPESCRIPT_DOMAIN_HANDOFF.md
```

Purpose:

- translate the stabilized game constitution into a code-facing TypeScript domain plan.
- define recommended module boundaries.
- preserve runtime versus persistence separation.
- prepare for Excalibur adaptation without making Excalibur the rule authority.
