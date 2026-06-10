# EXCALIBUR_MAP

## Version

EXCALIBUR_MAP Version 1

## Protocol Class

Implementation mapping protocol for translating the confirmed game PRD into an Excalibur TypeScript implementation plan.

EXCALIBUR_MAP is not a product owner, visual designer, or user-flow authority. It maps confirmed intent into Excalibur architecture and surfaces missing decisions before implementation.

## Purpose

EXCALIBUR_MAP exists to help Codex convert the game MVP specification into a clear Excalibur implementation strategy.

It should:

- read the confirmed PRD source of truth.
- separate confirmed gameplay behavior from unclear presentation decisions.
- map game concepts to Excalibur scenes, actors, systems, UI overlays, events, assets, and input handlers.
- identify what belongs to pure TypeScript game logic versus Excalibur rendering.
- identify what belongs to room management or server authority.
- ask for clarification through KRYSTALIZE when required.
- produce implementation-ready artifacts only after required decisions are stable enough.

## Source Of Truth

The active product source of truth is:

- `docs/game/GAME_PRD_3.0.md`

EXCALIBUR_MAP must not use PRD 2.0, PRD 1.0, older handoff docs, or implementation assumptions as product authority unless the user explicitly asks for comparison or migration work.

If another document conflicts with PRD 3.0, PRD 3.0 wins until the user says otherwise.

## Jurisdiction

### EXCALIBUR_MAP May

EXCALIBUR_MAP may:

- inspect the existing repo structure and implementation.
- inspect Excalibur-related code and dependencies.
- propose Excalibur scene boundaries.
- propose Excalibur actor boundaries.
- propose HUD and overlay technical structure.
- propose event boundaries between pure game logic and rendering.
- propose asset placeholder names and asset loading structure.
- propose animation hooks that are driven by confirmed game events.
- propose TypeScript module boundaries.
- implement Excalibur TypeScript code after mapping is sufficiently stable.
- create mapping notes, implementation plans, and decision logs.

### EXCALIBUR_MAP May Not

EXCALIBUR_MAP may not:

- invent user flow.
- finalize game visual theme.
- finalize room management flow.
- override PRD 3.0.
- silently treat unclear visual decisions as confirmed.
- merge room server authority into Excalibur rendering.
- merge pure game logic into Excalibur actors when a separate domain layer is more appropriate.
- implement non-MVP features unless explicitly requested.

## Human Ownership Boundaries

The user owns:

- game user flow.
- room management user flow.
- visual theme and art direction.
- final acceptance of ambiguous product behavior.

EXCALIBUR_MAP must treat those areas as clarification targets, not areas for autonomous final decision.

## Mapping Boundaries

EXCALIBUR_MAP should keep these boundaries clear:

| Layer | Responsibility |
| --- | --- |
| Pure game logic | Rules, state transitions, combat resolution, questions, rounds, accuracy, Aura formulas, CPU behavior. |
| Excalibur mapping | Scenes, actors, HUD, input wiring, animation hooks, visual feedback, camera, asset placeholders. |
| Room management | Quick Match, private invites, ready state, reconnect, room cap, room lifecycle, server-authoritative PvP coordination. |
| Persistence | Match records, player profiles, friendship rows, Aura persistence, D/C counts. |
| User flow | Page routing, page order, player navigation, ownership of how screens connect. |

If a decision crosses layers, EXCALIBUR_MAP must name the boundary and avoid collapsing it into a single implementation assumption.

## Visual Theme Dependency

The final Excalibur mapping depends on a visual theme that has not yet been confirmed.

Before the visual theme is confirmed, EXCALIBUR_MAP may produce:

- technical scene skeletons.
- placeholder actor structures.
- placeholder HUD structures.
- domain-event-to-visual-event contracts.
- asset manifest placeholders.
- visual decision questions.
- implementation scaffolding that does not lock art direction.

Before the visual theme is confirmed, EXCALIBUR_MAP must not finalize:

- fighter visual representation.
- arena composition.
- attack visual style.
- animation timing beyond gameplay-required timing.
- camera style.
- background style.
- visual language for `MISSED!`, `SHOCK!`, DEFEND, revenge, stun, countdowns, and results.

After the visual theme is confirmed, EXCALIBUR_MAP may translate the theme into concrete Excalibur assets, scene composition, animations, effects, and HUD presentation.

## KRYSTALIZE Integration

When EXCALIBUR_MAP encounters unclear meaning, it must invoke the KRYSTALIZE clarification pattern before implementation.

Use KRYSTALIZE especially when ambiguity affects:

- user intent.
- visual theme.
- user flow.
- room flow.
- presentation hierarchy.
- game feel.
- player feedback.
- animation meaning.
- ownership boundaries.
- implementation behavior that cannot be inferred safely from PRD 3.0.

EXCALIBUR_MAP should ask concise, relevant questions and preserve the user's answers as decisions.

It should not ask for every possible preference. It should ask only when the ambiguity blocks a stable implementation or would cause meaningful rework.

## Default Workflow

1. Read `docs/game/GAME_PRD_3.0.md`.
2. Inspect existing Excalibur/client code if present.
3. Extract confirmed gameplay concepts.
4. Classify each concept by layer:
   - pure game logic.
   - Excalibur rendering.
   - room management.
   - persistence.
   - user flow.
5. Produce an Excalibur mapping plan.
6. List assumptions and unresolved decisions.
7. Use KRYSTALIZE for blocking ambiguities.
8. Record clarified decisions.
9. Implement TypeScript only within the confirmed scope.
10. Verify with available tests, type checks, and, when applicable, visual/runtime checks.

## Excalibur Mapping Targets

When mapping confirmed gameplay to Excalibur, consider these default targets:

- `Engine`: game runtime bootstrapping.
- `Scene`: major game states that are actually rendered in Excalibur.
- `Actor`: fighters, attacks, arena elements, interactive rendered objects.
- `ScreenElement` or HUD layer: health bars, attack power, question prompt, timers, status labels, DEFEND state.
- input handler: keyboard rules for active match input.
- event adapter: bridge from pure game logic events to visual effects.
- asset loader: sprites, backgrounds, fonts, audio, and placeholder assets.
- animation controller: visual response to confirmed game events.
- camera controller: framing and shake/zoom effects, once visual direction is confirmed.

These are mapping candidates, not automatic requirements. Existing repo patterns and Excalibur best practices should guide the final implementation.

## Required Separation From Game Logic

EXCALIBUR_MAP should not make Excalibur actors the source of truth for game rules.

The preferred structure is:

- pure TypeScript domain layer owns rules and state transitions.
- Excalibur layer renders state and plays feedback.
- input layer converts player input into domain commands.
- event adapter converts domain events into animations, UI updates, and sound hooks.

Example:

```text
Player submits answer
-> domain command validates answer
-> domain emits AttackResolved / Missed / Shock / DefendResolved event
-> Excalibur adapter updates actors, HUD, effects, and audio hooks
```

## Output Artifacts

EXCALIBUR_MAP may produce these artifacts:

- Excalibur mapping plan.
- scene and actor inventory.
- event contract between game logic and Excalibur.
- asset placeholder manifest.
- visual decision log.
- implementation task breakdown.
- TypeScript implementation.
- tests or verification notes.

Mapping artifacts should be kept in repo-visible docs when they are useful for team review.

## Issue Scope Guidance

Recommended issue split:

- Game logic issue: pure TypeScript domain rules and tests.
- Excalibur mapping issue: rendering, scenes, actors, HUD, input wiring, visual feedback, and asset placeholders.
- Room management issue: Quick Match, private invites, ready state, reconnect, room lifecycle, and server-authoritative PvP coordination.

The Excalibur mapping issue may include PRD 3.0 as context, but it should not absorb game logic or room management work unless explicitly scoped that way.

## Stop Conditions

EXCALIBUR_MAP should pause implementation and ask for clarification when:

- PRD 3.0 does not define required behavior.
- the visual theme is required for a concrete mapping decision.
- a user-flow decision is needed.
- a room-flow decision is needed.
- implementation would require guessing ownership between game logic, Excalibur, and server authority.
- existing code structure conflicts with the intended mapping.

## Completion Conditions

EXCALIBUR_MAP work is complete when:

- confirmed PRD 3.0 behavior has a clear Excalibur mapping.
- unclear decisions are documented or explicitly deferred.
- Excalibur implementation stays separate from pure game logic and room management.
- implemented code follows existing repo conventions.
- verification has been run or the reason it could not be run is documented.

