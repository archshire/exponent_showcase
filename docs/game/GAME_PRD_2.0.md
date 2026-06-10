# Game PRD 2.0

## Table of Contents

<a id="table-of-contents"></a>

1. <a href="#section-introduction">Introduction</a>
2. <a href="#section-changes-from-prd-10">Changes From PRD 1.0</a>
   - <a href="#change-remove-spectator-feature">Remove Spectator Feature</a>
   - <a href="#change-remove-shop-and-coin-economy">Remove Shop And Coin Economy</a>
   - <a href="#change-replace-public-room-creation-with-backend-quick-match">Replace Public Room Creation With Backend Quick Match</a>
   - <a href="#change-private-match-invite-flow">Private Match Invite Flow</a>
   - <a href="#change-add-reconnection-support">Add Reconnection Support</a>
   - <a href="#change-add-language-translations">Add Language Translations</a>
   - <a href="#change-add-results-page-chat-for-friend-matches">Add Results-Page Chat For Friend Matches</a>
   - <a href="#change-replace-leaderboard-ranking-with-aura-points">Replace Leaderboard Ranking With Aura Points</a>
   - <a href="#change-move-leaderboard-to-community-page">Move Leaderboard To Community Page</a>
   - <a href="#change-game-page-visual-context-pending">Game Page Visual Context Pending</a>
3. <a href="#section-updated-features-of-mvp">Features Of MVP (Updated)</a>
   - <a href="#feature-app-features">App Features</a>
     - <a href="#feature-game-features">Game Features</a>
       - <a href="#feature-core-gameplay">Core Gameplay</a>
       - <a href="#feature-question-generation-and-difficulty">Question Generation And Difficulty</a>
       - <a href="#feature-keyboard-input-rules">Keyboard Input Rules</a>
       - <a href="#feature-accuracy-rules">Accuracy Rules</a>
       - <a href="#feature-1p-features">1P Features</a>
       - <a href="#feature-2p-features">2P Features</a>
       - <a href="#feature-shared-1p-and-2p-features">Shared 1P And 2P Features</a>
     - <a href="#feature-community-features">Community Features</a>
       - <a href="#feature-friend-system">Friend System</a>
       - <a href="#feature-friend-match-chat">Friend Match Chat</a>
       - <a href="#feature-leaderboard">Leaderboard</a>
       - <a href="#feature-aura-points">Aura Points</a>
     - <a href="#feature-vs-rooms-management">VS Rooms Management Features</a>
       - <a href="#feature-quick-match-queue">Quick Match Queue</a>
       - <a href="#feature-room-capacity">Room Capacity</a>
       - <a href="#feature-room-lifecycle">Room Lifecycle</a>
       - <a href="#feature-ready-state">Ready State</a>
       - <a href="#feature-reconnection">Reconnection</a>
     - <a href="#feature-enhancement-features">Enhancement Features</a>
       - <a href="#feature-localization">Localization</a>
       - <a href="#feature-deferred-kiv-enhancements">Deferred / KIV Enhancements</a>
   - <a href="#feature-architecture-features">Architecture Features</a>
     - <a href="#feature-database-persistent-data-management">Database Tables / Persistent Data Management</a>
       - <a href="#feature-users-table">users</a>
       - <a href="#feature-player-profiles-table">player_profiles</a>
       - <a href="#feature-player-friendships-table">player_friendships</a>
       - <a href="#feature-matches-table">matches</a>
     - <a href="#feature-realtime-server-matchmaking-server">Realtime Server / Matchmaking Server</a>
4. <a href="#section-user-flow">User Flow</a>
   - <a href="#user-flow-site-map">Site Map</a>
5. <a href="#section-kiv-future-development">KIV / Future Development</a>
6. <a href="#section-source-references">Source References</a>

<a id="section-introduction"></a>

## Introduction

PRD 2.0 documents and stabilizes the MVP features discussed in the Project Meeting on May 28.

This document is based on the work completed in PRD 1.0, but PRD 2.0 will incorporate major changes from the meeting.

The purpose of PRD 2.0 is to define what should be implemented for MVP.

Any feature that is useful, exciting, or gameplay-enhancing but not required for MVP should be placed under <a href="#section-kiv-future-development">KIV / Future Development</a>, not inside the MVP feature list.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="section-changes-from-prd-10"></a>

## Changes From PRD 1.0

Use this section to record major differences between PRD 1.0 and PRD 2.0.

| Change ID | PRD 1.0 Area | PRD 2.0 Change | MVP Impact | Status |
| --- | --- | --- | --- | --- |
| PRD2-001 | Spectator view | Remove spectator feature from MVP. | Reduces realtime/viewer complexity. | accepted direction |
| PRD2-002 | Shop / coins | Remove shop, coin rewards, and coin-based CPU unlocks. | Simplifies MVP economy and progression. | accepted direction |
| PRD2-003 | Public rooms | Remove player-created public rooms; backend manages Quick Match rooms. | Simplifies PvP entry and room governance. | accepted direction |
| PRD2-004 | Private rooms | Create Room becomes private friend-invite flow only. | Keeps friend duels while removing public room creation. | accepted direction |
| PRD2-005 | Connection handling | Add reconnection support after connection drop. | Improves match resilience. | accepted direction |
| PRD2-006 | UI language | Add language translations. | Adds localization requirement. | accepted direction |
| PRD2-007 | Results page | Add chat in results page for matches between friends. | Adds friend-specific social layer. | accepted direction |
| PRD2-008 | Leaderboard ranking | Replace multi-metric ranking with Aura points. | Simplifies player-facing ranking. | formula clarified |
| PRD2-009 | Leaderboard location | Move leaderboard from 2P menu to Community page. | Changes navigation ownership. | accepted direction |
| PRD2-010 | Game page visuals | Start-game page visual context will be provided later. | May affect user flow and page structure. | pending input |

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="change-remove-spectator-feature"></a>

### Remove Spectator Feature

PRD 2.0 removes the spectator feature from MVP.

This means MVP should not include:

- live spectator view.
- read-only spectator mode.
- `View` buttons for in-game rooms.
- viewer caps.
- spectator entry failure states.
- spectator D/C routing.

Implication:

- realtime/server work should focus on active players, not viewers.
- any spectator-related behavior from PRD 1.0 should move to <a href="#section-kiv-future-development">KIV / Future Development</a>.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="change-remove-shop-and-coin-economy"></a>

### Remove Shop And Coin Economy

PRD 2.0 removes the shop from MVP.

This means MVP should not include:

- shop page.
- coin rewards after matches.
- coin balance as a required MVP economy loop.
- coin-based CPU unlocks.
- name-change purchases.
- purchase result flow.

CPU characters may still be unlocked progressively, but not through coins.

PRD 2.0 CPU unlock criteria may include:

- defeating certain CPU characters a required number of times.
- playing a certain number of PvP matches.
- other progression criteria to be clarified.

Implication:

- post-match results should not show coin reward breakdowns.
- database persistence does not need MVP coin ledger for shop/reward purposes unless retained for another non-shop reason.
- CPU progression must be redesigned around achievement/progression criteria rather than currency.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="change-replace-public-room-creation-with-backend-quick-match"></a>

### Replace Public Room Creation With Backend Quick Match

PRD 2.0 removes player-created public rooms from MVP.

Public PvP rooms should be managed by the backend system, not by players.

Quick Match becomes the public PvP entry path:

1. Player clicks `Quick Match`.
2. Backend looks for other players who clicked `Quick Match`.
3. Backend places matched players into a backend-managed room.
4. Both players are shown a challenge/ready page.

Challenge/ready page:

- shows `___ VS ___`.
- shows a large `Ready` button.
- shows a `30` second timer for each player to press Ready.
- waits for both players to press Ready.

When both players press Ready:

- Ready changes to `Match begins in...`.
- a `5` second countdown starts.
- when countdown reaches `0`, the game page loads.

Timer stop behavior:

- a square `Stop` icon can stop the timer.
- if either player presses Stop, the ready process resets.
- the Ready button appears again.
- the whole getting-ready process restarts.

Implication:

- public lobby room browsing from PRD 1.0 is no longer MVP.
- public room creation by players is no longer MVP.
- backend matchmaking state becomes more important.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="change-private-match-invite-flow"></a>

### Private Match Invite Flow

In PRD 2.0, `Create Room` is only for private matches.

Private match flow:

1. Player selects `Create Room`.
2. Game loads a page showing online friends.
3. Player chooses a friend.
4. Invitation is sent.
5. Invitation lasts `60` seconds.

Inviter behavior:

- if friend does not respond within 60 seconds, invitation is cancelled.
- inviter sees `Invitation not accepted.`

Invited friend behavior:

- friend sees `___ challenges you to a duel`.
- friend sees `Accept` and `Decline`.
- friend sees a `60` second countdown.
- if friend does not respond within 60 seconds, friend sees `You have declined the challenge.`

If friend accepts:

- the challenge/ready page loads.
- this page should match the Quick Match ready page pattern.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="change-add-reconnection-support"></a>

### Add Reconnection Support

PRD 2.0 adds reconnection support after connection drop.

Intent:

- a temporary dropped connection should not automatically destroy the match if reconnection is possible.
- the game should support returning a disconnected player to the active match when allowed.

Confirmed MVP behavior:

- reconnection grace period is `10` seconds.
- both players pause during reconnect.
- if the disconnected player returns, both players see `Player connected!`.
- after reconnection, a `5` second countdown runs before the match resumes.
- if the disconnected player does not return in the grace period, the match is voided.
- failed reconnection counts as a D/C for the disconnected player and increases D/C count by `1`.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="change-add-language-translations"></a>

### Add Language Translations

PRD 2.0 adds language translation support.

Intent:

- MVP should support translated UI text.

Confirmed MVP language support:

- Malay.
- Chinese.
- Spanish.
- Japanese.
- Korean.

Translation should cover player-facing UI text, menus, tutorial prompts, errors, status labels, and result messages.

Question content remains numeric/symbolic unless later clarified.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="change-add-results-page-chat-for-friend-matches"></a>

### Add Results-Page Chat For Friend Matches

PRD 2.0 adds chat in the results page for matches between friends.

Scope:

- chat appears on the results page.
- chat is for matches between friends.
- this does not imply global chat.
- this does not imply chat with non-friends unless later clarified.

Confirmed MVP behavior:

- chat is real-time/session-based on the results page.
- chat is not persisted for MVP.
- chat ends when players leave the results page.
- moderation and abuse handling are KIV unless required by platform rules.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="change-replace-leaderboard-ranking-with-aura-points"></a>

### Replace Leaderboard Ranking With Aura Points

PRD 1.0 ranked leaderboard by comparing three metrics:

1. win rate.
2. accuracy rate.
3. win streak.

PRD 2.0 should streamline leaderboard ranking into one player-facing metric:

- Aura points.

Intent:

- players should understand rank through one single comparison value.
- Aura points should likely combine meaningful performance signals.

Confirmed MVP Aura formula:

- valid completed PvP winner: `50 AP + correct answers x 10 AP`.
- valid completed PvP loser: `correct answers x 10 AP`.
- valid mutual final-round loss: each player receives `correct answers x 10 AP`.
- voided match, failed reconnect, or quit D/C: `0 AP`.
- PvC matches do not grant Aura points.

Aura ranking belongs under Community because it powers the Community leaderboard.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="change-move-leaderboard-to-community-page"></a>

### Move Leaderboard To Community Page

PRD 2.0 removes Leaderboard from the 2P menu.

Leaderboard should move to the Community page.

Implication:

- 2P flow should focus on Quick Match and private friend challenge.
- Community owns leaderboard discovery.
- user flow must be updated accordingly.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="change-game-page-visual-context-pending"></a>

### Game Page Visual Context Pending

The start of the game page will be reviewed later.

This may affect:

- User Flow.
- game entry page structure.
- navigation labels.
- what belongs in Game versus Community.
- how 1P / 2P options are presented.

Do not over-finalize page structure until the visual context is reviewed.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="section-updated-features-of-mvp"></a>

## Features Of MVP (Updated)

Use this section to define the confirmed MVP feature set for PRD 2.0.

Only MVP features should be recorded here.

Features that are not essential for MVP should be moved to <a href="#section-kiv-future-development">KIV / Future Development</a>.

<a id="feature-app-features"></a>

### App Features

App features are player-facing or product-facing features. They describe what the player sees, chooses, earns, unlocks, or experiences.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-game-features"></a>

### 1. Game Features

Game features are the core play experience: combat, questions, 1P, 2P entry points, match screens, and shared results.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-core-gameplay"></a>

#### Core Gameplay

MVP core gameplay includes:

- mental arithmetic duel combat.
- PvP and PvC modes.
- 60-second fight rounds.
- first player to win 2 fight rounds wins the match.
- tied fight rounds.
- Final round when required.
- mutual final-round loss when the Final round also ties.
- one shared attack power bar.
- attack power increases from `1` to `30` over 5 seconds.
- correct answers trigger attacks.
- wrong answers trigger `MISSED!` and a 1-second vulnerability window.
- no-action timeout triggers `SHOCK!` and HP loss.
- same-time answer handling with `Additional DMG`.
- streak multiplier.
- revenge gauge and revenge attack.
- DEFEND mechanic.
- DEFEND cooldown / unavailable state.
- stun after successful DEFEND.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-question-generation-and-difficulty"></a>

#### Question Generation And Difficulty

Question generation and difficulty are MVP gameplay features.

At the start of each fight round, a spinner selects the question mode for that fight round.

MVP question modes:

- addition.
- subtraction.
- mixed addition/subtraction.
- `?` mode for PvP only.

Difficulty is probability-weighted:

- baseline easy chance: 40%.
- active revenge or one hit away from revenge: 60%.
- player HP half or less than opponent HP: 65%.
- when multiple conditions apply, use the highest applicable easy chance.

Addition:

- normal: numbers 1 to 30.
- easy: numbers 1 to 15.

Subtraction:

- normal: numbers 1 to 100.
- easy: numbers 1 to 40.
- negative answers are allowed.

Mixed addition/subtraction:

- three-term chained arithmetic prompts.
- numbers use range 1 to 50.
- prompts may start with a negative number.
- operation signs are random.
- difficult prompts contain two 2-digit numbers and one 1-digit number.
- easy prompts contain one 2-digit number and two 1-digit numbers.

PvP-only `?` mode:

- includes reaction-based number sequence tasks.
- includes mixed addition/subtraction.
- includes addition of two 3-digit numbers.
- reaction tasks appear 30% of the time.
- remaining 70% splits into 60% mixed addition/subtraction and 40% two 3-digit addition.
- reaction sequence length is random from 4 to 9 numbers.
- first player to complete the sequence gets the attack.
- two 3-digit addition uses operands from 100 to 999.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-keyboard-input-rules"></a>

#### Keyboard Input Rules

When an in-game match is active, only these keys are active:

- number keys.
- `-` key.
- Spacebar for DEFEND.
- Enter for attack / answer submission.

All other keys should be disabled or ignored during active gameplay.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-accuracy-rules"></a>

#### Accuracy Rules

Accuracy is based on submitted answer attempts.

Count toward accuracy:

- correct submitted answers.
- wrong submitted answers.

Do not count toward accuracy:

- no-answer states.
- timeout/no-action states.
- stunned lockout.
- DEFEND-only situations unless an answer is submitted.

Wrong answers count against accuracy because `MISSED!` comes from a submitted wrong answer.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-1p-features"></a>

#### 1P Features

The 1P path includes:

- Tutorial.
- Duel CPU.
- 1P Stats.

The shop is not part of PRD 2.0 MVP.

Tutorial:

- CPU 1 teaches attack power, `SHOCK!`, streak pressure, revenge activation, revenge attack, and streak building.
- CPU 1 simplified practice fight does not use DEFEND.
- CPU 2 teaches DEFEND.
- CPU 2 simplified practice fight reinforces DEFEND, streak disruption, and revenge advantage.

Duel CPU:

- all 6 CPU opponents remain in MVP.
- after tutorial, Maki and Kander are available.
- Fury, Shi-eld, Peasy, and Skore unlock through progression criteria, not coins.
- CPU unlock criteria should be shown on the CPU opponent VS screen.
- CPU unlock progress uses lifetime totals.

CPU unlock progression:

| CPU | Unlock Criteria |
| --- | --- |
| Maki | Available after tutorial. |
| Kander | Available after tutorial. |
| Fury | 5 Maki wins and 5 Kander wins. |
| Shi-eld | 3 Fury wins and 3 completed PvP matches. |
| Peasy | 2 Shi-eld wins and 10 completed PvP matches. |
| Skore | 3 Peasy wins and 20 completed PvP matches. |

Only completed PvP matches count toward CPU unlock requirements. Voided matches are excluded.

CPU opponent profiles:

| CPU | Internal Fighter Type | MVP Description |
| --- | --- | --- |
| Maki | Vanilla fighter | Constant 1.2x damage, cannot build streaks, answers mostly in 2-3s. |
| Kander | Streak fighter | Attempts streaks 70% of the time, answers mostly in 1-2s. |
| Fury | Avenge fighter | Constant revenge state, cannot do streaks, strong blocking, critical hits at power 30. |
| Shi-eld | Block specialist | Blocks often, attacks after successful block, hidden weakness after 2.5s. |
| Peasy | Expert streak fighter | Fast streak pressure, blocks attempts to break its rhythm. |
| Skore | Boss-like adaptive fighter | Hard questions, revenge after 1 hit, 200 HP, changes question type every 3 questions. |

Human player fighter type classification is not a player-facing MVP feature.

1P Stats:

- private personal progress page.
- shows PvP stats.
- shows D/C count.
- shows accuracy.
- shows longest streak.
- shows CPU defeat counts, such as `Maki x 5 wins`.
- shows CPU unlock/progression state where relevant.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-2p-features"></a>

#### 2P Features

The 2P path includes only:

- Quick Match.
- Create Room.

There is no public-facing game lobby in PRD 2.0 MVP.

Quick Match:

- player clicks Quick Match.
- backend queues Quick Match requests.
- backend assigns a room when 2 players are available.
- matched players see a challenge/ready page.

Create Room:

- Create Room is private friend challenge only.
- player chooses an online friend.
- invitation lasts 60 seconds.
- inviter sees `Invitation not accepted.` if no response.
- invited friend sees `___ challenges you to a duel`.
- invited friend can Accept or Decline.
- if invited friend does not respond within 60 seconds, friend sees `You have declined the challenge.`
- accepted invitation loads the same challenge/ready page pattern as Quick Match.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-shared-1p-and-2p-features"></a>

#### Shared 1P And 2P Features

Match page:

- shows active fight UI.
- shows health bars.
- shows attack/status bars.
- shows shared attack power bar.
- shows question prompt.
- shows fight-round timer.
- shows DEFEND state.
- supports quit button.

Post-match results:

- show win/loss/voided outcome.
- show accuracy.
- show correct answers.
- show longest streak.
- show relevant progression updates.
- show random result quote from the relevant quote pool.

PvP post-match results:

- show Aura gained.
- public Quick Match results show Rematch and Add Friend.
- private/friend match results show Rematch and session-based chat.

PvC post-match results:

- show win/loss.
- show accuracy.
- show longest streak.
- show CPU unlock progress.
- show random result quote.
- no Aura and no coins.

Aura display examples:

```text
Aura: 50 AP win bonus + 13 correct answers x 10 AP = 180 AP
Aura: 9 correct answers x 10 AP = 90 AP
Aura: 0 AP
```

Result quote pools:

- winner quotes should challenge the winner.
- loser quotes should encourage or advise the loser.
- voided/D/C quotes should discourage disconnecting.
- quotes are selected randomly from the relevant pool.

Example winner quotes:

- `How long can you maintain this win streak?`
- `Hit a 100 win streak and get a surprise!`
- `You won a friend. Now challenge your parents!`
- `Winners don't use calculators. They ARE calculators!`
- `Bet you can't win a duel in 10 seconds!`

Example voided/D/C quotes:

- `Play with a stable connection.`
- `Finish what you started.`
- `Try not to ...D/C`

Rematch:

- use the word `Rematch`, not `Replay`.
- Rematch can start another match from the post-match result flow.

Voided match handling:

- failed reconnect voids the match.
- explicit quit is treated as D/C behavior with a grace period.
- if the quitting/disconnected player does not return within the grace period, the match is voided and that player's D/C count increases by 1.
- voided/D/C matches award 0 AP.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-community-features"></a>

### 2. Community Features

Community features cover social relationships, chat, and ranking.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-friend-system"></a>

#### Friend System

The Friend system is housed under Community.

MVP friend system includes:

- friend list.
- Add Friend / search.
- friend requests.
- accepted / pending / declined / unfriended states.
- online/offline status for friends.
- last activity display for offline friends when available.

Friend list:

- shows accepted friends.
- shows each friend's avatar.
- shows each friend's display name.
- shows online/offline state.
- shows last activity if the friend is offline, based on available login/activity data.

Add Friend / search:

- player can search for another player by username or display name.
- search results show avatar and display name.
- search results provide an `Add Friend` CTA when eligible.
- sending a request creates or updates a `pending` friendship record.

Friend requests:

- incoming friend requests are shown under Community.
- incoming requests show requester avatar and display name.
- player can `Accept` or `Decline`.
- accepting changes friendship status to `accepted`.
- declining changes friendship status to `declined`.

Remove Friend:

- player can remove an accepted friend.
- removing a friend changes the friendship status to `unfriended`.
- removed friends no longer appear in the active friend list.
- the friendship record should remain available for future updates, analytics, or abuse review.

Private friend challenges:

- accepted friends are eligible for private friend challenges through the 2P `Create Room` flow.
- only online friends can be selected for immediate private challenge in MVP.
- accepted private challenge routes both players to the shared Challenge / Ready page.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-friend-match-chat"></a>

#### Friend Match Chat

- appears on results page for private/friend matches only.
- session-based only.
- does not persist after the results session ends.
- no global chat in MVP.
- no non-friend chat in MVP unless later clarified.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-leaderboard"></a>

#### Leaderboard

- housed under Community, not 2P.
- ranks by Aura Points.
- Aura is PvP-only.
- shows top 50 players.
- supports friend filter.
- friend filter shows only accepted friends and the current player.
- player rank is always pinned at the top.
- pinned player rank shows rank and Aura Points.
- leaderboard is computed from persisted player profile data, not stored as a separate source-of-truth table.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-aura-points"></a>

#### Aura Points

- completed valid PvP matches award Aura.
- Quick Match PvP and private/friend PvP use the same Aura formula.
- winner: `50 AP + correct answers x 10 AP`.
- loser: `correct answers x 10 AP`.
- mutual final-round loss: no win bonus; correct answers still award AP if the match completed validly.
- voided/D/C match: `0 AP`.
- PvC does not award Aura.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-vs-rooms-management"></a>

### 3. VS Rooms Management Features

VS rooms are backend-managed for MVP.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-quick-match-queue"></a>

#### Quick Match Queue

- server listens for Quick Match requests.
- server queues players.
- server assigns a room when 2 queued players are available.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-room-capacity"></a>

#### Room Capacity

- maximum 50 active rooms.
- public Quick Match rooms and private rooms share the same 50-room pool.
- if room cap is reached, show `Game lobby is full. Please return in 5 minutes.`

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-room-lifecycle"></a>

#### Room Lifecycle

- assigned room remains occupied until both players exit or close the room.
- no third player can join an assigned room.
- public-facing room browsing is not part of MVP.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-ready-state"></a>

#### Ready State

- ready page shows `___ VS ___`.
- ready page shows a large Ready button.
- each player has 30 seconds to press Ready.
- if a player does not press Ready within 30 seconds, the match auto-starts.
- when both players are ready, show `Match begins in...`.
- match countdown is 5 seconds.
- square Stop icon resets both players back to Ready.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-reconnection"></a>

#### Reconnection

- dropped connection pauses the game for both players.
- both players see a 10-second reconnect countdown.
- if reconnect succeeds, show `Player connected!`.
- after reconnect succeeds, show a 5-second countdown before resuming.
- if reconnect fails, match is voided and disconnected player's D/C count increases by 1.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-enhancement-features"></a>

### 4. Enhancement Features

Enhancement features are MVP support/polish items and explicitly deferred future ideas.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-localization"></a>

#### Localization

- MVP supports Malay, Chinese, Spanish, Japanese, and Korean.
- translation should cover MVP UI text.
- translation should cover status messages, result messages, errors, and menu labels.
- question content is numeric/symbolic unless later clarified.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-deferred-kiv-enhancements"></a>

#### Deferred / KIV Enhancements

- spectator mode.
- shop.
- coin economy.
- coin rewards.
- coin-based unlocks.
- detailed question/event logs.
- persisted chat.
- leaderboard cache.
- gameplay modifiers.
- replay viewing.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-architecture-features"></a>

### Architecture Features

Architecture features describe what the system must persist, compute, or coordinate to support the MVP app features.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-database-persistent-data-management"></a>

### 5. Database Tables / Persistent Data Management

PRD 2.0 MVP uses 4 main persisted tables.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-users-table"></a>

#### `users`

Stores account/auth identity.

Recommended fields:

- `id`.
- `username`.
- `email`.
- `password_hash`.
- `status`.
- `created_at`.
- `last_login_at`.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-player-profiles-table"></a>

#### `player_profiles`

Stores game identity, stats, Aura, CPU progression, language, and D/C count.

Recommended fields:

- `player_id`.
- `user_id`.
- `display_name`.
- `hidden_number_id`.
- `avatar_key`.
- `language_code`.
- `aura_points`.
- `pvp_wins`.
- `pvp_losses`.
- `completed_pvp_matches`.
- `pvc_wins`.
- `pvc_losses`.
- `completed_pvc_matches`.
- `current_win_streak`.
- `longest_streak`.
- `longest_streak_match_id`.
- `total_correct_answers`.
- `total_questions_answered`.
- `dc_count`.
- `cpu_progression`.
- `created_at`.
- `updated_at`.

`cpu_progression` may be stored as JSONB for MVP simplicity.

Example:

```json
{
  "maki": { "wins": 5, "losses": 1, "unlocked": true },
  "kander": { "wins": 5, "losses": 2, "unlocked": true },
  "fury": { "wins": 3, "losses": 4, "unlocked": true },
  "shi_eld": { "wins": 0, "losses": 0, "unlocked": false },
  "peasy": { "wins": 0, "losses": 0, "unlocked": false },
  "skore": { "wins": 0, "losses": 0, "unlocked": false }
}
```

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-player-friendships-table"></a>

#### `player_friendships`

Stores friend relationships and request status.

Recommended fields:

- `id`.
- `requester_player_id`.
- `receiver_player_id`.
- `status`.
- `created_at`.
- `updated_at`.

Recommended statuses:

- `pending`.
- `accepted`.
- `declined`.
- `unfriended`.
- `blocked`.

Persistence rule:

- use one friendship row per player pair.
- a player pair should not create duplicate friendship rows over time.
- if a `declined` or `unfriended` relationship already exists, a new request should update the existing row's `status` and `updated_at` instead of inserting another row.
- the requester/receiver fields may update depending on who sends the new request.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-matches-table"></a>

#### `matches`

Stores global match history.

For MVP, `matches` may store both players' match data directly because each match has at most 2 players.

Recommended fields:

- `match_id`.
- `mode`.
- `status`.
- `p1_player_id`.
- `p2_player_id`.
- `cpu_key`.
- `winner_player_id`.
- `dc_player_id`.
- `void_reason`.
- `p1_correct_answers`.
- `p2_correct_answers`.
- `p1_questions_answered`.
- `p2_questions_answered`.
- `p1_longest_streak`.
- `p2_longest_streak`.
- `p1_aura_delta`.
- `p2_aura_delta`.
- `p1_result`.
- `p2_result`.
- `started_at`.
- `ended_at`.

Recommended `mode` values:

- `pvp_quick`.
- `pvp_private`.
- `pvc`.

Recommended `status` values:

- `completed`.
- `voided`.

Recommended result values:

- `win`.
- `loss`.
- `mutual_loss`.
- `voided`.

Computed data:

- leaderboard is computed from `player_profiles.aura_points`.
- friend-filtered leaderboard is computed from `player_friendships` and `player_profiles`.
- no leaderboard source-of-truth table is required for MVP.

KIV persistence:

- detailed question/event log table.
- leaderboard cache table.
- persisted chat messages table.
- separate CPU progression table.
- separate stats table.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-realtime-server-matchmaking-server"></a>

### 6. Realtime Server / Matchmaking Server

The realtime server should support:

- Quick Match queue.
- backend-managed room assignment.
- 50-room cap enforcement.
- private invite delivery.
- private invite timeout.
- ready-state synchronization.
- Stop/reset synchronization.
- active match synchronization.
- answer timing validation.
- DEFEND legality.
- same-time answer resolution.
- HP/damage updates.
- reconnect detection.
- pause/resume synchronization.
- void match handling.
- post-match persistence trigger.

For PvP, the server should be authoritative for match-critical state.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="section-user-flow"></a>

## User Flow

This section defines the MVP site map, page inventory, and user flows for PRD 2.0.

The PRD 2.0 user flow will be based on the work done in:

- `docs/game/Game_Pages_1.0.md`

PRD 2.0 may simplify, remove, or modify parts of the PRD 1.0 flow depending on what is confirmed as MVP.

<a id="user-flow-site-map"></a>

### Site Map

The site map defines the page structure of the MVP web app.

This is not the visual layout of each page. Visual layout, component placement, and page styling can be specified later.

The start-game page visual context is still pending, so names such as `Game Home` and `Mode Select` are structural working names.

#### MVP Site Map

```text
Web App / Website
  -> Auth / Account Entry
      -> Login
      -> Sign Up
      -> Account / Profile Settings

  -> Game
      -> Game Home / Mode Select

      -> 1P
          -> 1P Menu

          -> Tutorial
              -> Tutorial Intro / CPU 1 Briefing
              -> Tutorial CPU 1 Match
              -> Tutorial CPU 1 Results
              -> Tutorial CPU 2 Briefing
              -> Tutorial CPU 2 Match
              -> Tutorial Complete / Results

          -> Duel CPU
              -> CPU Select
              -> Locked CPU Details
              -> CPU VS Screen
              -> PvC Match Page
              -> PvC Results Page

          -> 1P Stats

      -> 2P
          -> 2P Menu

          -> Quick Match
              -> Quick Match Queue / Waiting
              -> Challenge / Ready Page
              -> PvP Match Page
              -> Public PvP Results Page

          -> Create Room
              -> Online Friends Select
              -> Invite Pending
              -> Invite Received
              -> Challenge / Ready Page
              -> PvP Match Page
              -> Friend PvP Results Page

  -> Community
      -> Community Home

      -> Friends
          -> Friend List
          -> Add Friend / Search
          -> Friend Requests

      -> Leaderboard
          -> Global Aura Leaderboard
          -> Friends Aura Leaderboard
          -> Pinned Own Rank

  -> Shared Match States
      -> Reconnect Pause State
      -> Room Capacity Full State
      -> Match Voided Result State
      -> Quit / D/C Grace Period State
```

#### Site Map Notes

- `Auth / Account Entry` is included because persisted user identity is required, but it is not a game-specific feature area.
- `Game Home / Mode Select` is a working structural name until the game page visual context is confirmed.
- `1P Menu` contains Tutorial, Duel CPU, and 1P Stats.
- `2P Menu` contains only Quick Match and Create Room.
- `Quick Match Queue / Waiting` belongs to the public PvP path, but players do not browse public rooms.
- `Create Room` belongs only to private friend challenges.
- `Challenge / Ready Page` is shared by Quick Match and accepted private friend challenges.
- `PvP Match Page` is shared by public Quick Match and private friend matches.
- `Public PvP Results Page` includes Rematch and Add Friend.
- `Friend PvP Results Page` includes Rematch and session-based results chat.
- `PvC Results Page` includes CPU unlock progress but does not include Aura.
- `Community` owns Friends and Leaderboard.
- `Leaderboard` is a Community page, not a 2P page.
- `Shared Match States` are not necessarily standalone pages; they may be overlays, modal states, or routed states depending on implementation.

#### Explicitly Excluded From MVP Site Map

The MVP site map should not include:

- Spectator page.
- Shop page.
- Coin wallet page.
- Public room browser.
- Player-created public room setup page.
- Replay viewer.
- Persistent chat history page.
- Detailed question/event log page.

### Page Inventory

This section documents confirmed MVP pages after they are stabilized.

Notation:

- `->` marks a CTA or navigation action.
- `-` marks static content shown on the page.
- `[State]` marks a page or system state.

#### AUTH ENTRY PAGE

Audience:

- new logged-out users.

Static content:

- Next Duel hero image.
- Challenge phrase: `Ready to get mental? ⚡`

CTAs:

1. -> Log In
2. -> Create Account
3. -> Forgot Password

### Flow Map

TBD.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="section-kiv-future-development"></a>

## KIV / Future Development

Use this section for features that are good to have but not required for MVP.

KIV features should not be treated as MVP implementation requirements.

| Feature / Idea | Reason For KIV | Possible Future Value |
| --- | --- | --- |
| Spectator mode | Removed from MVP to reduce realtime/viewer complexity. | Allows players to watch active matches, support tournaments, and share live duels. |
| Public room browsing | MVP uses backend-managed Quick Match and private friend challenges only. | Lets players browse open rooms, choose opponents, or join themed public rooms. |
| Player-created public rooms | Removed from MVP so room governance stays backend-managed. | Gives players more control over public match setup and social discovery. |
| Shop page | Removed from MVP to avoid building a non-essential economy loop. | Can support cosmetics, optional unlocks, name-change purchases, or seasonal items. |
| Coin economy | Removed from MVP because Aura and progression already cover MVP rewards. | Can support future non-ranked rewards, cosmetics, and achievement loops. |
| Coin rewards after matches | Removed from MVP so post-match rewards stay focused on Aura, stats, and progression. | Can create extra reward pacing and long-term collection incentives. |
| Coin-based CPU unlocks | Replaced by achievement/progression-based CPU unlocks for MVP. | Could offer alternative unlock paths if future economy systems are added. |
| Detailed question/event logs | Moved out of MVP to keep persisted data to 4 main tables. | Enables replay analysis, audits, anti-cheat review, and detailed player feedback. |
| Persisted chat messages | MVP results-page chat is session-based only. | Allows friend match history, asynchronous conversation, and moderation records. |
| Leaderboard cache table | MVP leaderboard is computed from player profile Aura points. | Improves performance if leaderboard queries become expensive at scale. |
| Separate CPU progression table | MVP stores CPU progression in `player_profiles.cpu_progression`. | Makes CPU progression easier to query, audit, and expand if progression grows. |
| Separate stats table | MVP keeps core stats in `player_profiles`. | Supports more detailed stats categories without bloating player profile records. |
| Gameplay modifiers | MVP focuses on the confirmed core duel mechanics. | Adds variety through alternate rules, events, challenge modes, or seasonal modes. |
| Replay viewing | MVP post-match flow uses results summaries, not replay playback. | Lets players review full matches, share highlights, or learn from mistakes. |
| Persisted result quote management | MVP can use fixed quote pools in app/server code. | Allows admin-managed quote pools, seasonal copy, localization variants, and A/B testing. |
| Advanced moderation / abuse tooling | MVP chat is limited to friend result sessions and not persisted. | Supports reporting, blocking, audit trails, and safer social features if chat expands. |

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="section-source-references"></a>

## Source References

PRD 1.0 baseline:

- `docs/game/GAME_PRD_1.0.md`
- `docs/game/Game_Pages_1.0.md`
- `docs/game/K_GAME_PRD_1.0_CONSTITUTIONAL_STATE.md`
- `docs/game/K_GAME_PRD_1.0_CONSTITUTIONAL_JOURNAL.md`

Related implementation and handoff references:

- `docs/game/GAME_LOGIC.md`
- `docs/game/GAME_MVP_READINESS_CHECKLIST.md`
- `docs/game/handoff/GAME_DATABASE_HANDOFF.md`
- `docs/game/handoff/GAME_REALTIME_SERVER_HANDOFF.md`

<a href="#table-of-contents">Back to Table of Contents</a>
