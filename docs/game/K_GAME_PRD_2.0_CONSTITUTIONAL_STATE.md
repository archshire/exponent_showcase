# K_GAME_PRD_2.0_CONSTITUTIONAL_STATE

## Document Metadata

```yaml
artifact_type: constitutional_state
protocol: KRYSTALIZE
protocol_version: 1
session_id: KRYS-game_prd_2_0-001
project_name: game_prd_2_0
source_document: docs/game/GAME_PRD_2.0.md
based_on:
  - docs/game/GAME_PRD_1.0.md
  - docs/game/Game_Pages_1.0.md
  - docs/game/K_GAME_PRD_1.0_CONSTITUTIONAL_STATE.md
  - docs/game/K_GAME_PRD_1.0_CONSTITUTIONAL_JOURNAL.md
created_at: 2026-05-29
updated_at: 2026-06-02
status: active
```

## Current Intent

PRD 2.0 stabilizes the MVP version of the game after the Project Meeting on May 28.

PRD 2.0 is based on PRD 1.0, but removes or defers features that are not required for MVP and updates the multiplayer, progression, leaderboard, reconnection, and localization direction.

## Locked PRD 2.0 Truths

| ID | Locked Truth | Source | Date Locked | Notes |
| --- | --- | --- | --- | --- |
| PRD2-LT-001 | PRD 2.0 should document MVP features only. | Human clarification | 2026-05-29 | Good-to-have features belong in KIV / Future Development. |
| PRD2-LT-002 | Spectator view is removed from MVP. | Human clarification | 2026-05-29 | No live viewer mode, viewer cap, or View button for MVP. |
| PRD2-LT-003 | Shop is removed from MVP. | Human clarification | 2026-05-29 | No shop page or purchase loop. |
| PRD2-LT-004 | Coin rewards after matches are removed from MVP. | Human clarification | 2026-05-29 | Result screens should not show coin reward breakdowns. |
| PRD2-LT-005 | CPU unlocks are no longer coin-based. | Human clarification | 2026-05-29 | Unlocks are progression/criteria-based. |
| PRD2-LT-006 | All 6 CPU opponents remain in MVP. | Human clarification | 2026-05-29 | Maki, Kander, Fury, Shi-eld, Peasy, and Skore remain. |
| PRD2-LT-007 | After tutorial, Maki and Kander are available to fight. | Human clarification | 2026-05-29 | They are the initial Duel CPU opponents. |
| PRD2-LT-008 | Fury unlocks after 5 Maki wins and 5 Kander wins. | Human clarification | 2026-05-29 | No coin cost. |
| PRD2-LT-009 | Shi-eld unlocks after 3 Fury wins and 3 completed PvP matches. | Human clarification | 2026-05-29 | Voided matches are excluded. |
| PRD2-LT-010 | Peasy unlocks after 2 Shi-eld wins and 10 completed PvP matches. | Human clarification | 2026-05-29 | Voided matches are excluded. |
| PRD2-LT-011 | Skore unlocks after 3 Peasy wins and 20 completed PvP matches. | Human clarification | 2026-05-29 | Voided matches are excluded. |
| PRD2-LT-012 | CPU unlock criteria should be shown on the CPU opponent VS screen. | Human clarification | 2026-05-29 | The player should know what is missing. |
| PRD2-LT-013 | Human player fighter type classification is not needed as a player-facing MVP feature. | Human clarification | 2026-05-29 | Fighter type can remain an internal CPU description. |
| PRD2-LT-014 | The public-facing game lobby is removed from MVP. | Human clarification | 2026-05-29 | Players should not browse public rooms. |
| PRD2-LT-015 | The 2P menu has only Quick Match and Create Room. | Human clarification | 2026-05-29 | Leaderboard moves to Community. |
| PRD2-LT-016 | Public matchmaking is backend-managed through Quick Match. | Human clarification | 2026-05-29 | Server queues Quick Match requests and assigns rooms. |
| PRD2-LT-017 | Backend-managed rooms are assigned when 2 queued players are available. | Human clarification | 2026-05-29 | No third player may join the assigned room. |
| PRD2-LT-018 | A maximum of 50 rooms may be active. | Human clarification | 2026-05-29 | Private and public rooms share the same room count. |
| PRD2-LT-019 | If the 50-room cap is reached, return `Game lobby is full. Please return in 5 minutes.` | Human clarification | 2026-05-29 | Player should be sent away rather than queued into a full lobby. |
| PRD2-LT-020 | A room remains occupied until both players exit or close the room. | Human clarification | 2026-05-29 | Applies to the active room count. |
| PRD2-LT-021 | Create Room is only for private friend challenges. | Human clarification | 2026-05-29 | No player-created public rooms. |
| PRD2-LT-022 | Private rooms use the same room pool as public Quick Match rooms. | Human clarification | 2026-05-29 | Private rooms count toward the 50-room maximum. |
| PRD2-LT-023 | Use the word `Rematch` instead of `Replay`. | Human clarification | 2026-05-29 | Avoid confusion with watching a replay. |
| PRD2-LT-024 | Public match results offer Rematch and Add Friend. | Human clarification | 2026-05-29 | No chat for public matches. |
| PRD2-LT-025 | Private/friend match results include chat. | Human clarification | 2026-05-29 | Chat is friend-match scoped. |
| PRD2-LT-026 | If a player does not press Ready within 30 seconds, the game auto-starts. | Human clarification | 2026-05-29 | Auto-start is enough; no extra penalty. |
| PRD2-LT-027 | If either player presses Stop during the ready/countdown flow, both return to the Ready state. | Human clarification | 2026-05-29 | The ready process restarts. |
| PRD2-LT-028 | Reconnection window is 10 seconds. | Human clarification | 2026-05-29 | Applies after dropped connection detection. |
| PRD2-LT-029 | On detected dropped connection, the game pauses for both players and shows a 10-second countdown. | Human clarification | 2026-05-29 | Both players should see the pause state. |
| PRD2-LT-030 | If reconnection succeeds, show `Player connected!` and a 5-second countdown before resuming. | Human clarification | 2026-05-29 | Resume applies to both players. |
| PRD2-LT-031 | If reconnection fails, the match is voided and the disconnected player's D/C count increases by 1. | Human clarification | 2026-05-29 | Match should not count as completed. |
| PRD2-LT-032 | CPU unlock PvP-match criteria count only completed matches. | Human clarification | 2026-05-29 | Voided matches are excluded. |
| PRD2-LT-033 | MVP language support includes Malay, Chinese, Spanish, Japanese, and Korean. | Human clarification | 2026-05-29 | UI translation scope remains MVP UI text unless clarified otherwise. |
| PRD2-LT-034 | Aura points are PvP-only for MVP. | Human clarification | 2026-05-29 | PvC does not contribute to Aura leaderboard ranking. |
| PRD2-LT-035 | Friend-match results chat is session-based and does not persist. | Human clarification | 2026-05-29 | Chat disappears after the results session ends. |
| PRD2-LT-036 | Community page should not include player stats for now. | Human clarification | 2026-05-29 | Community page focuses on friend list and leaderboard for now. |
| PRD2-LT-037 | Private friend matches affect Aura the same way as other PvP matches for now. | Human clarification | 2026-05-29 | No separate Aura treatment for private matches in MVP. |
| PRD2-LT-038 | CPU unlock win and match criteria use lifetime totals. | Human clarification | 2026-05-29 | All historical completed qualifying wins/matches count; progress is not reset when an unlock gate is reached. |
| PRD2-LT-039 | Aura winner bonus is 50 AP. | Human clarification | 2026-05-29 | Winner Aura formula is `50 AP + correct answers x 10 AP`. |
| PRD2-LT-040 | Loser Aura formula is `correct answers x 10 AP`. | Human clarification | 2026-05-29 | No loss bonus. |
| PRD2-LT-041 | Post-match results should be housed under Shared 1P and 2P Features. | Human clarification | 2026-05-29 | Results are shared across game modes, with mode-specific actions/content. |
| PRD2-LT-042 | 1P Stats remains in MVP as private personal progress. | Human clarification | 2026-05-29 | Community should not show stats for now. |
| PRD2-LT-043 | Question generation and difficulty should be its own section under Core Gameplay. | Human clarification | 2026-05-29 | Question generation is core gameplay, not only content. |
| PRD2-LT-044 | Keyboard input rules should be included in MVP features. | Human clarification | 2026-05-29 | Active game input is restricted to number keys, `-`, Spacebar, and Enter. |
| PRD2-LT-045 | Accuracy rules should be included in MVP features. | Human clarification | 2026-05-29 | Accuracy is based on submitted answers; no-answer states do not count. |
| PRD2-LT-046 | Quit button remains in MVP. | Human clarification | 2026-05-29 | Explicit quit is treated as D/C accountability, not as failed reconnect. |
| PRD2-LT-047 | If a quitting player does not return within the grace period, the match is voided and D/C count increases by 1. | Human clarification | 2026-05-29 | Treat quit as D/C behavior with grace period. |
| PRD2-LT-048 | Result quotes remain in MVP under Post-Match Results. | Human clarification | 2026-05-29 | Quotes should use relevant win/loss/voided quote pools. |
| PRD2-LT-049 | CPU opponent descriptions belong in MVP features. | Human clarification | 2026-05-29 | Use internal CPU fighter descriptions/types for implementation reference. |
| PRD2-LT-050 | MVP acceptance criteria should be omitted from PRD 2.0 for now. | Human clarification | 2026-05-29 | Do not add acceptance criteria section yet. |
| PRD2-LT-051 | PvC results should show win/loss, accuracy, longest streak, CPU unlock progress, and quote. | Human clarification | 2026-05-29 | No Aura or coins for PvC. |
| PRD2-LT-052 | 1P Stats should include PvP stats and CPU defeat counts. | Human clarification | 2026-05-29 | Example: `Maki x 5 wins`. |

## Open Clarification Points

| ID | Topic | Question | Status |
| --- | --- | --- | --- |
| PRD2-OPEN-004 | User flow | How should the PRD 2.0 page simulation differ from Game_Pages_1.0? | pending visual context |

## KIV Direction

The following are not MVP unless explicitly restored:

- spectator mode.
- public-facing room lobby.
- player-created public rooms.
- shop.
- coin rewards.
- coin-based unlocks.
- gameplay modifiers.
- replay viewing.

## Cross-Version Note

As of 2026-06-02, PRD 2.0 remains an inherited product-decision source only where PRD 3.0 carries those decisions forward.

Current architecture and navigation source of truth belongs to `docs/game/GAME_PRD_3.0.md` and the PRD 3.0 constitutional files. PRD 3.0 uses four runtime services: Nginx Entrypoint / Reverse Proxy Service, Next.js Frontend Service, Express Backend Service / Backend Modular Monolith, and Database Service. Backend responsibilities are internal modules inside the Express backend service, not separate backend microservice containers.
