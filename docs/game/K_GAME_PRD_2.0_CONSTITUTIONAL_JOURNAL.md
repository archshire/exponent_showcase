# K_GAME_PRD_2.0_CONSTITUTIONAL_JOURNAL

## Document Metadata

```yaml
artifact_type: constitutional_journal
protocol: KRYSTALIZE
protocol_version: 1
session_id: KRYS-game_prd_2_0-001
project_name: game_prd_2_0
source_document: docs/game/GAME_PRD_2.0.md
created_at: 2026-05-29
updated_at: 2026-06-02
status: active
```

## Initial Intent

PRD 2.0 should capture the MVP version of the game after the Project Meeting on May 28.

The human wants to continue using a constitutional state and journal so that PRD 2.0 decisions remain traceable while the document is still being clarified.

## Clarification Sessions

### Session PRD2-CJ-001

```yaml
date: 2026-05-29
scope: PRD 2.0 structure and major changes from PRD 1.0
status: recorded
```

#### Locked Outcomes

- PRD 2.0 documents MVP features only.
- Good-to-have features should be moved to KIV / Future Development.
- Spectator mode is removed from MVP.
- Shop and coin economy are removed from MVP.
- Public room creation is removed from MVP.
- Public matchmaking is backend-managed through Quick Match.
- Create Room is retained only as a private friend-challenge flow.
- Reconnection support is added.
- Language translations are added.
- Results-page chat is added only for matches between friends.
- Leaderboard moves to Community.
- Leaderboard ranking should become Aura points, but the formula is unresolved.

### Session PRD2-CJ-002

```yaml
date: 2026-05-29
scope: Features of MVP, CPU progression, 2P room model, ready flow, reconnect rules
status: recorded
```

#### Locked Outcomes

- All 6 CPU opponents remain in MVP.
- Maki and Kander are fightable after tutorial.
- Fury unlocks after 5 Maki wins and 5 Kander wins.
- Shi-eld unlocks after 3 Fury wins and 3 completed PvP matches.
- Peasy unlocks after 2 Shi-eld wins and 10 completed PvP matches.
- Skore unlocks after 3 Peasy wins and 20 completed PvP matches.
- CPU unlock criteria should appear on the CPU opponent VS screen.
- Human player fighter type classification is not needed as a player-facing MVP feature.
- Fighter types remain useful as internal CPU descriptions.
- A public-facing game lobby does not exist in PRD 2.0 MVP.
- The 2P menu has only Quick Match and Create Room.
- The server listens for Quick Match requests, queues them, and assigns a room when 2 players are available.
- Maximum active room count is 50.
- If the room cap is reached, the player sees `Game lobby is full. Please return in 5 minutes.`
- Assigned rooms are occupied until both players exit or close the room.
- No one else can join an assigned room.
- Private rooms share the same 50-room pool as public Quick Match rooms.
- Use `Rematch`, not `Replay`.
- Public matches offer Rematch and Add Friend.
- Private/friend matches also offer chat.
- If a player does not press Ready in 30 seconds, the game auto-starts.
- If either player presses Stop, both return to Ready and the ready flow restarts.
- Reconnection window is 10 seconds.
- On dropped connection, the game pauses for both players and shows a 10-second countdown.
- On successful reconnection, show `Player connected!` and a 5-second countdown before resuming.
- If reconnection fails, the match is voided and the disconnected player's D/C count increases by 1.
- CPU unlock PvP-match criteria count only completed PvP matches and exclude voided matches.

### Session PRD2-CJ-003

```yaml
date: 2026-05-29
scope: language support, Aura scope, friend chat persistence, Community page scope
status: recorded
```

#### Locked Outcomes

- MVP language support includes Malay, Chinese, Spanish, Japanese, and Korean.
- Aura points are PvP-only for MVP.
- Friend-match results chat is session-based and does not persist.
- Community page should not include player stats for now.
- Community page should focus on friend list and leaderboard for now.
- Private friend matches affect Aura the same way as public Quick Match PvP for now.
- CPU unlock win and match criteria use lifetime totals.
- All historical completed qualifying wins/matches count toward CPU unlock requirements.
- Aura winner bonus is 50 AP.
- Winner Aura formula is `50 AP + correct answers x 10 AP`.
- Loser Aura formula is `correct answers x 10 AP`.
- Post-match results should be housed under Shared 1P and 2P Features.
- 1P Stats remains in MVP as private personal progress.
- Community should not show stats for now.
- Question generation and difficulty should be its own section under Core Gameplay.
- Keyboard input rules should be included in MVP features.
- Accuracy rules should be included in MVP features.
- Quit button remains in MVP.
- Explicit quit is treated as D/C behavior with a grace period, not as failed reconnect.
- If the quitting player does not return within the grace period, the match is voided and the player's D/C count increases by 1.
- Result quotes remain in MVP under Post-Match Results.
- CPU opponent descriptions belong in MVP features.
- MVP acceptance criteria should be omitted from PRD 2.0 for now.
- PvC results should show win/loss, accuracy, longest streak, CPU unlock progress, and quote.
- 1P Stats should include PvP stats and CPU defeat counts such as `Maki x 5 wins`.

## Open Questions

- What should the PRD 2.0 user-flow page map look like after public lobby, spectator, shop, and coin flows are removed?

## Cross-Version Notes

### 2026-06-02 PRD 3.0 Architecture / Navigation Supersession

PRD 2.0 remains useful for inherited MVP product decisions, especially PvP/PvC flow, room behavior, reconnect behavior, CPU progression, Aura scope, and deferred non-MVP features.

Current implementation architecture and page/navigation source of truth now belongs to `docs/game/GAME_PRD_3.0.md` and `docs/game/K_GAME_PRD_3.0_CONSTITUTIONAL_STATE.md`.

PRD 3.0 currently uses four runtime services:

- Nginx Entrypoint / Reverse Proxy Service.
- Next.js Frontend Service.
- Express Backend Service / Backend Modular Monolith.
- Database Service.

The backend PRD 3.0 architecture uses internal backend modules, not separate backend microservice containers. The current PRD 3.0 navigation also uses Home Page, Profile, Privacy Policy, Terms Of Service, Quick Match, and Create Private Room labels.
