# Game PRD

## Table of Contents

- [Purpose](#purpose)
- [Source Of Truth](#source-of-truth)
- [Product Summary](#product-summary)
- [MVP Goals](#mvp-goals)
- [Target Player Experience](#target-player-experience)
- [MVP Scope](#mvp-scope)
- [Game Modes](#game-modes)
- [Core Combat Loop](#core-combat-loop)
- [Question Generation](#question-generation)
- [Tutorial And PvC Progression](#tutorial-and-pvc-progression)
- [PvP Experience](#pvp-experience)
- [Post-Match Results](#post-match-results)
- [Leaderboard](#leaderboard)
- [Shop And Economy](#shop-and-economy)
- [Player Profile And Stats](#player-profile-and-stats)
- [Persistence Requirements](#persistence-requirements)
- [Realtime Server Requirements](#realtime-server-requirements)
- [Implementation Boundaries](#implementation-boundaries)
- [Team Handoff Map](#team-handoff-map)
- [Out Of Scope For MVP](#out-of-scope-for-mvp)
- [MVP Acceptance Criteria](#mvp-acceptance-criteria)

## Purpose

This document consolidates the current game constitution into a teammate-facing Product Requirements Document.

It is intended to help teammates understand what the Game MVP is, what must be built, what data must be persisted, what the realtime server must support, and what is intentionally deferred.

This PRD is a readable summary. It does not replace the deeper source documents.

## Source Of Truth

Primary game spec:

- `docs/game/GAME_LOGIC.md`

Constitutional PRD records:

- `docs/game/K_GAME_PRD_CONSTITUTIONAL_STATE.md`
- `docs/game/K_GAME_PRD_CONSTITUTIONAL_JOURNAL.md`

Team handoff documents:

- `docs/game/handoff/GAME_DATABASE_HANDOFF.md`
- `docs/game/handoff/GAME_REALTIME_SERVER_HANDOFF.md`
- `docs/game/GAME_MVP_READINESS_CHECKLIST.md`

## Product Summary

The product is a VS mental-sum duel game.

Players compete by solving mental arithmetic questions under time pressure. Correct answers become attacks. Attack strength is determined by a shared attack power bar, then modified by streaks, revenge, and defensive play.

The game should support:

- PvP: player vs player.
- PvC: player vs computer.

PvC teaches and trains mechanics. PvP is the main competitive mode.

## MVP Goals

- Build an exciting mental-sum duel loop.
- Make fast answers feel valuable.
- Reward mastery through streaks.
- Give losing players a comeback path through revenge.
- Let players disrupt momentum through DEFEND.
- Teach the core mechanics through early CPU opponents.
- Support PvP rooms, Quick Match, spectators, result screens, rewards, and leaderboard.
- Persist player identity, match outcomes, stats, rewards, unlocks, friend data, and internal analytics.

## Target Player Experience

The player should feel:

- rushed.
- clever.
- under pressure.
- hungry for a comeback.
- rewarded for mastery.
- surprised by twists.
- locked in a duel.

Game logic and mechanics should serve those feelings.

## MVP Scope

Included in MVP:

- core combat engine.
- shared attack power bar.
- streak multiplier.
- revenge gauge.
- DEFEND mechanic.
- wrong-answer punishment.
- same-time answer handling.
- 60-second fight rounds.
- match win/loss/tie rules.
- PvP question modes.
- PvC tutorial opponents.
- Duel CPU opponents.
- 1P and 2P navigation.
- room lobby and Quick Match.
- spectator view.
- post-match results.
- rewards and coin balance.
- Version 1 shop.
- PvP leaderboard.
- database persistence handoff.
- realtime server handoff.

## Game Modes

### 1P

1P opens a separate 1P menu with:

- Tutorial.
- Duel CPU.
- Shop.
- Stats.

The Shop appears only in 1P for Version 1 and only after CPU 2 has been defeated.

### 2P

2P opens a VS option page with:

- Quick Match.
- Enter Game Lobby.
- Leaderboard.

The 2P path handles public/private rooms, ready flow, PvP matches, spectator view, post-match replay, and return to lobby.

## Core Combat Loop

### Fight Round

- Each fight round lasts 60 seconds.
- Each match has at least 2 fight rounds.
- First player to win 2 fight rounds wins the match.
- If both players have the same HP at the end of a fight round, that fight round is a tie.
- If a tie happens on the 3rd fight round, a Final round starts.
- If the Final round also ties, both players lose.

### Question Round

Each fight round contains repeated question rounds.

Each question round should usually resolve with HP loss for at least one player.

Exceptions:

- same-time correct answers create `Additional DMG` instead of immediate damage.
- no-action timeout shocks both players.

### Shared Attack Power Bar

- One shared attack power bar is used by both players.
- The bar starts at 1.
- The bar increases linearly to 30 over 5 seconds.
- When a player presses Enter on a correct answer, the current bar value becomes attack power.
- Final damage is calculated from attack power plus streak/revenge modifiers.

### Streak

- First hit: 1.0x.
- Second hit: 1.1x.
- Third hit: 1.2x.
- Fourth hit: 1.3x.
- Fifth hit and beyond: capped at 1.4x.

Streak resets when:

- opponent attacks.
- attacker answers wrong.
- attacker uses DEFEND.
- opponent successfully blocks.

### Revenge

- Revenge activates after a player receives a 1.4x hit from the opponent.
- Revenge displays visually as `+100% DMG`.
- Revenge damage is conceptually `attackPower x 2`.
- Revenge does not stack with a stronger streak multiplier.
- A revenge attack starts a new streak sequence; the next consecutive hit is 1.1x.
- Revenge resets after the player successfully attacks or after the revenge attack is blocked.

### DEFEND

- DEFEND lasts 1 second.
- During DEFEND, the player cannot do anything except defend against an incoming attack.
- DEFEND is available once every 2 turns.
- DEFEND breaks the user's own streak.
- Successful DEFEND blocks the incoming attack, resets the attacker's streak, and stuns the attacker for 1.5 seconds.
- DEFEND can be used to predict revenge, disrupt streak pressure, or reverse momentum.
- If DEFEND is unavailable, the button/status area should be greyed out.
- Successful DEFEND displays `SUCCESS`.

### Wrong Answer

If a player answers wrong:

- all benefit buffs reset.
- the player enters a 1-second vulnerability window.
- the player cannot answer or defend during that window.
- the status space shows `MISSED!`.
- incoming damage still uses the normal attack formula.

### No Action

If both players take no action by the end of the attack timer:

- both receive `-10 HP`.
- both show `SHOCK!`.

### Same-Time Answer

If the second valid answer arrives within 150ms of the first valid answer:

- no immediate HP damage is applied.
- one shared `Additional DMG` value is added to the next question round.
- streak and revenge states do not reset.
- the stacked damage is resolved in the next question round.

## Question Generation

At the beginning of each 60-second fight round, a spinner selects the question mode for that whole fight round.

Spinner modes:

- addition.
- subtraction.
- mixed addition/subtraction.
- `?` mode.

`?` mode is PvP only.

### Difficulty Probability

Questions use probability-weighted difficulty, not mandatory handicap.

- baseline easy chance: 40%.
- active revenge or one hit from revenge: 60%.
- player HP is half or less than opponent HP: 65%.

Use the highest applicable easy probability.

### Addition

- normal: numbers 1 to 30.
- easy: numbers 1 to 15.

### Subtraction

- normal: numbers 1 to 100.
- easy: numbers 1 to 40.
- negative answers are allowed.

### Mixed Addition/Subtraction

Mixed questions are three-term chained arithmetic prompts.

Examples:

- `22 + 9 + 18`
- `31 - 5 + 11`
- `17 + 8 + 5`
- `-6 + 28 - 3`

Rules:

- numbers use range 1 to 50.
- questions may start with negative numbers.
- operation signs are random.
- difficult prompts contain two 2-digit numbers and one 1-digit number.
- easy prompts contain one 2-digit number and two 1-digit numbers.

### `?` Mode

`?` mode includes:

- reaction-based number sequence tasks.
- mixed addition/subtraction.
- addition of two 3-digit numbers.

Content distribution:

- 30% reaction-based number sequence.
- remaining 70% splits into:
  - 60% mixed addition/subtraction.
  - 40% two 3-digit addition.

Reaction tasks:

- sequence length is random from 4 to 9 numbers.
- first player to complete the sequence gets the attack.

Two 3-digit addition:

- both operands use range 100 to 999.

## Tutorial And PvC Progression

PvC exists to:

- onboard players.
- teach core mechanics.
- let players practice before PvP.

### CPU 1

CPU 1 teaches:

- attacking.
- attack power.
- `SHOCK!`.
- streak pressure.
- revenge activation.
- revenge attack.
- building a streak.

CPU 1 does not use DEFEND during the simplified practice fight.

The player can lose CPU 1. After completing the scripted tutorial sequence, the player can replay without scripted sequences. The fight menu should allow replaying the tutorial sequence.

### CPU 2

CPU 2 teaches DEFEND.

It demonstrates:

- CPU defending against the player.
- player defending against CPU.
- DEFEND cooldown / alternate-turn availability.
- DEFEND disrupting a streak.
- DEFEND turning revenge into advantage.

The player can lose CPU 2. After completing the scripted tutorial sequence, the player can replay without scripted sequences. The fight menu should allow replaying the tutorial sequence.

### Duel CPU Opponents

Available and locked CPU opponents:

| CPU | Role | Notes |
| --- | --- | --- |
| Maki | Vanilla fighter | Constant 1.2x damage, cannot build streaks, answers mostly in 2-3s. |
| Kander | Streak fighter | Attempts streaks 70% of the time, answers mostly in 1-2s. |
| Fury | Avenge fighter | Constant revenge state, cannot do streaks, strong blocking, critical hits at power 30. |
| Shi-eld | Block specialist | Blocks often, attacks after successful block, hidden weakness after 2.5s. |
| Peasy | Expert streak fighter | Fast streak pressure, blocks attempts to break its rhythm. |
| Skore | Boss-like adaptive fighter | Hard questions, revenge after 1 hit, 200 HP, changes question type every 3 questions. |

Unlocking is sequential. Players must beat prerequisite CPU opponents and have enough coins.

## PvP Experience

### Room Entry

Players can enter PvP through:

- Quick Match.
- public room lobby.
- private room invitation.

Quick Match:

- shows `Finding a match...`.
- assigns the earliest available room.
- does not confirm until the room slot is allocated.
- can be cancelled with Back.
- if no room is available, asks whether the player wants to start a Private Match or Public Match.

### Room Lobby

The lobby:

- can host up to 100 rooms for MVP planning.
- shows room list.
- shows `No rooms open at the moment.` when empty.
- shows public room information and join/view options.
- marks in-game rooms as `in-game`.
- supports `View` for live spectator mode.

Room expiry:

- waiting rooms expire after 2 minutes if nobody joins.

### Room Ready Page

The room-ready page shows:

- `Player ___ VS Player ___`.
- `Player ___ VS Waiting...` if only one player is present.
- ready button in the middle.
- countdown above the ready button once both players are ready.
- host-options menu.

Both players must press ready before a 3-second countdown starts.

### Host Controls

Host options:

- kick/remove other player.
- close/delete room.
- rename room.
- invite controls for private rooms.

Host controls should be disabled once the match countdown starts or match begins.

### Spectator View

Spectator view:

- is live.
- is read-only.
- shows the same full player game UI.
- allows up to 10 viewers per match for MVP planning.
- greys out `View` if viewer slots are full.

### Quit And Disconnect

PvC quit:

- match stats are void.
- tutorial progress is remembered.
- no PvP D/C count.

PvP quit/disconnect:

- dropped connection counts as `D/C`.
- explicit quit has a separate internal label but adds to D/C count.
- match stats are voided.
- reward is 0 coins for voided matches.
- D/C count is public before future fights.

Quit button behavior:

- freezes the game.
- warning overlay blocks visibility of the question.
- opponent sees that the player pressed quit.
- quit press count is logged.
- anti-abuse forced forfeit applies to PvP if quit is repeatedly pressed without actually quitting.

## Post-Match Results

Result screens show:

- WIN or losing state.
- accuracy.
- player type.
- longest streak.
- reward.
- random quote.
- Add Friend option for PvP.
- Replay option for PvP.
- Back button.

### Rewards

PvP:

- reward = correct questions x 10 coins + match bonus.
- winner match bonus: 50 coins.
- loser match bonus: 25 coins.

PvC:

- reward = correct questions x 5 coins.
- winner bonus: 10 coins.
- loser bonus: 0 coins.

Voided matches:

- reward = 0 coins.

Reward display example:

```text
Reward: 13 correct questions x 10 coins + 50 coins match bonus = 180 coins
```

### Player Type

Version 1 classification priority:

1. `Wrongster`.
2. `Avenger`.
3. `Strategist`.
4. `Streaker`.
5. `Vanilla`.

Thresholds are MVP defaults and may be tuned after playtesting.

## Leaderboard

Leaderboard is part of MVP and appears in the 2P / VS option page.

MVP leaderboard is PvP only.

Future PvC leaderboard is deferred.

Eligibility:

- players must complete at least 10 valid PvP matches before appearing.
- `pvp_matches_played` controls eligibility.
- `pvp_decisive_matches` controls win-rate denominator.
- mutual final-round losses may count as completed PvP matches but do not count as wins, losses, or win-rate denominator events.

Ranking priority:

1. win rate.
2. accuracy.
3. current win streak.

Displayed fields:

- rank.
- player identity.
- win rate.
- accuracy.
- current win streak.

Display behavior:

- player's own rank appears at the top.
- top 20 by default.
- pagination by 20.
- browse up to rank 100.

## Shop And Economy

Coins are the Version 1 currency.

The shop appears only in the 1P menu after CPU 2 is defeated.

Version 1 shop offerings:

- Change Duelist Name.
- CPU unlocks for Fury, Shi-eld, Peasy, and Skore.

Name change:

- first name change costs 100 coins.
- subsequent name changes cost 1000 coins.
- duplicate display names are allowed.
- hidden number ID remains unique.

CPU unlocks:

- one-time persistent unlocks.
- sequential prerequisite defeats still apply.

Gameplay-affecting modifier cards are deferred.

## Player Profile And Stats

MVP player profile data includes:

- hidden unique player ID.
- display name.
- coin balance.
- unlocked CPU opponents.
- unlocked badges/avatar items.
- total matches played.
- wins.
- losses.
- D/C count.
- total correct answers.
- total questions answered.
- longest streak record.
- current win streak.
- friend list.
- pending friend requests.

Accuracy counts submitted answer attempts:

- correct answers count.
- wrong answers count.
- no-answer does not count.
- timeout/no-action does not count.
- stunned lockout does not count.
- DEFEND-only situations do not count unless an answer is submitted.

Wrong answers count against accuracy because `MISSED!` comes from a submitted wrong answer.

## Persistence Requirements

Persist:

- player identity.
- player profile.
- unlocks.
- coin ledger.
- central match records.
- match question logs under `match_id`.
- lightweight player match references.
- friend requests.
- friendships.
- internal engagement analytics.
- leaderboard aggregates / view.

Central match records are the source of truth for completed, voided, and forfeited matches.

Player profiles should store aggregates and lightweight references, not duplicate full match records.

Question logs should persist under match ID and include:

- question asked.
- correct player or players.
- correctness timing.
- question-round winner.
- winning timing.

See `docs/game/handoff/GAME_DATABASE_HANDOFF.md` for recommended tables, columns, relationships, indexes, JSONB guidance, ORM guidance, and migration structure.

## Realtime Server Requirements

The realtime server should support:

- room creation.
- room joining.
- Quick Match allocation.
- room locking / inspection.
- ready state sync.
- countdown sync.
- server-authoritative PvP match state.
- answer timing validation.
- DEFEND legality.
- same-time answer resolution.
- HP/damage updates.
- spectator admission and sync.
- quit and D/C handling.
- replay/rematch flow.
- persistence touchpoints.

For PvP, the server should be authoritative for match-critical state.

See `docs/game/handoff/GAME_REALTIME_SERVER_HANDOFF.md` for socket/event and responsibility details.

## Implementation Boundaries

### TypeScript Domain

The TypeScript domain should own combat truth:

- question generation.
- answer validation.
- attack power capture.
- damage calculation.
- streak/revenge/DEFEND rules.
- match lifecycle.
- result calculation.
- reward calculation.
- stats calculation.

### Excalibur

Excalibur should:

- render game state.
- animate bars, HP, effects, tutorial prompts, and status spaces.
- collect input.
- forward input to the domain/server.

Excalibur should not independently decide combat outcomes.

### Keyboard Input

When in-game is active, only these keys are active:

- number keys.
- `-` key.
- Spacebar for DEFEND.
- Enter for ATTACK / answer submission.

All other keys should be disabled or ignored during active gameplay.

## Team Handoff Map

| Area | Primary File | Team Responsibility |
| --- | --- | --- |
| Game PRD summary | `docs/game/GAME_PRD.md` | All teammates reference this first. |
| Detailed game rules | `docs/game/GAME_LOGIC.md` | Game implementation and agents. |
| Constitutional state | `docs/game/K_GAME_PRD_CONSTITUTIONAL_STATE.md` | Deep traceable source of stabilized intent. |
| Constitutional journal | `docs/game/K_GAME_PRD_CONSTITUTIONAL_JOURNAL.md` | History of clarification and rationale. |
| Database handoff | `docs/game/handoff/GAME_DATABASE_HANDOFF.md` | Database teammate. |
| Realtime server handoff | `docs/game/handoff/GAME_REALTIME_SERVER_HANDOFF.md` | Server / socket teammate. |
| MVP readiness | `docs/game/GAME_MVP_READINESS_CHECKLIST.md` | Planning and implementation sequencing. |

## Out Of Scope For MVP

Deferred:

- gameplay-affecting shop modifier cards.
- modifier-enabled match governance.
- deeper anti-staleness gameplay layer.
- PvC leaderboard.
- exact Excalibur scene/Actor/component names.
- exact TypeScript module/function/class names.
- exact socket payload schemas.
- exact ORM and migration syntax.
- production load validation.
- external webhook handoff unless needed later.

## MVP Acceptance Criteria

The MVP is acceptable when:

- players can enter 1P and 2P flows.
- CPU 1 teaches streak/revenge.
- CPU 2 teaches DEFEND.
- players can fight Duel CPU opponents with locked/unlocked progression.
- PvP players can use Quick Match or room lobby.
- both players can ready and start a match.
- combat resolves according to attack power, streak, revenge, DEFEND, wrong answer, same-time, and shock rules.
- spectators can view live matches read-only.
- players can quit or D/C and the correct void/accountability behavior occurs.
- result screens show stats, reward, quote, replay/back actions, and Add Friend where applicable.
- coins and unlocks persist.
- leaderboard shows eligible PvP players with the correct ranking priority.
- match records and question logs persist under central match IDs.
- database and realtime server handoffs have enough information for teammates to implement their parts.
