# Game PRD

## Table of Contents

<a id="table-of-contents"></a>

- <a href="#section-introduction">1. Introduction</a>
- <a href="#section-about">2. About</a>
- <a href="#section-updated-features-of-mvp">3. Features Of MVP</a>
   - <a href="#feature-game-features">A) Game Features</a>
      - <a href="#feature-core-gameplay">i. Core Gameplay</a>
      - <a href="#feature-question-generation-and-difficulty">ii. Question Generation And Difficulty</a>
      - <a href="#feature-keyboard-input-rules">iii. Keyboard Input Rules</a>
      - <a href="#feature-accuracy-rules">iv. Accuracy Rules</a>
      - <a href="#feature-1p-features">v. 1P Features</a>
      - <a href="#feature-2p-features">vi. 2P Features</a>
      - <a href="#feature-shared-1p-and-2p-features">vii. Shared 1P And 2P Features</a>
   - <a href="#feature-visual-presentation-features">B) Visual Presentation Features</a>
      - <a href="#feature-avatar-and-cpu-character-art">i. Profile Picture And CPU Character Art</a>
      - <a href="#feature-background-art">ii. Background Art</a>
      - <a href="#feature-combat-effects-and-animation">iii. Combat Effects And Animation</a>
      - <a href="#feature-gameplay-screen-hud-presentation-contract">iv. Gameplay Screen / HUD Presentation Contract</a>
      - <a href="#feature-visual-asset-contract">v. Visual Asset Contract</a>
   - <a href="#feature-community-features">C) Community Features</a>
      - <a href="#feature-friend-system">i. Friend System</a>
      - <a href="#feature-community-chat">ii. Community Chat</a>
      - <a href="#feature-leaderboard">iii. Leaderboard</a>
      - <a href="#feature-aura-points">iv. Aura Points</a>
   - <a href="#feature-vs-rooms-management">D) VS Rooms Management Features</a>
      - <a href="#feature-quick-match-queue">i. Quick Match Queue</a>
      - <a href="#feature-room-capacity">ii. Room Capacity</a>
      - <a href="#feature-room-lifecycle">iii. Room Lifecycle</a>
      - <a href="#feature-ready-state">iv. Ready State</a>
      - <a href="#feature-reconnection">v. Reconnection</a>
   - <a href="#feature-enhancement-features">E) Enhancement Features</a>
      - <a href="#feature-user-profile-and-settings">i. User Profile And Settings</a>
      - <a href="#feature-localization">ii. Localization</a>
      - <a href="#feature-legal-pages">iii. Legal Pages</a>
   - <a href="#feature-architecture-features">F) Architecture Summary</a>
- <a href="#section-user-flow">4. User Flow</a>
   - <a href="#flow-1p-tutorial-cpu-progression">i. 1P Tutorial / CPU Progression Flow</a>
   - <a href="#flow-1p-stats">ii. 1P Stats Flow</a>
   - <a href="#flow-pvc-quit-disconnect">iii. PvC Quit / Disconnect Flow</a>
   - <a href="#flow-2p-quick-match">iv. 2P Quick Match Flow</a>
   - <a href="#flow-2p-friend-challenge-create-private-room">v. 2P Friend Challenge / Create Private Room Flow</a>
   - <a href="#flow-pvp-ready-match-start">vi. PvP Ready / Match Start Flow</a>
   - <a href="#flow-pvp-results">vii. PvP Results Flow</a>
   - <a href="#flow-pvp-rematch">viii. PvP Rematch Flow</a>
   - <a href="#flow-pvp-quit-disconnect-reconnect">ix. PvP Quit / Disconnect / Reconnect Flow</a>

<a id="section-introduction"></a>

## 1. Introduction

This PRD documents and stabilizes the MVP features discussed in the Project Meeting on May 28.

This document is trimmed to focus on the current MVP implementation source of truth.

The purpose of this PRD is to define what should be implemented for MVP.

Any feature that is useful, exciting, or gameplay-enhancing but not required for MVP should stay outside the MVP feature list until it is explicitly accepted.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="section-about"></a>

## 2. About

The MVP is a fast competitive mental arithmetic duel where players feel pressure, mastery, comeback tension, and rivalry.

PvC teaches the mechanics through CPU opponents so players can learn the duel system, practice under pressure, and prepare for PvP.

PvP is the main competitive expression of the game.

Community features support the competitive loop through friends, private challenges, and Aura ranking, but the heart of the MVP is the duel itself.

Animations, visual feedback, and result moments should make attacks, mistakes, comebacks, wins, and losses feel lively and meaningful without replacing the server-owned game rules.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="section-updated-features-of-mvp"></a>

## 3. Features Of MVP

Use this section to define the confirmed MVP feature set for this PRD.

Only MVP features should be recorded here.

Features that are not essential for MVP should stay outside the MVP feature list unless explicitly accepted.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-game-features"></a>

### A) Game Features

Game features are the core play experience: combat, questions, 1P, 2P entry points, match screens, and shared results.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-core-gameplay"></a>

#### i. Core Gameplay

MVP core gameplay includes:

- mental arithmetic duel combat.
- PvP and PvC modes.
- 50-second fight rounds.
- first player to win 2 fight rounds wins the match.
- tied fight rounds.
- Final round when required.
- mutual final-round loss when the Final round also ties.
- one shared attack power bar.
- attack power increases from `1` to `30` over the 6-second question round.
- correct answers trigger attacks.
- wrong answers trigger `MISSED!` and a 1-second vulnerability window.
- no-action timeout triggers `SHOCK!` and HP loss.
- same-time answer handling with `Additional DMG`.
- streak multiplier.
- revenge gauge and revenge attack.
- DEFEND mechanic.
- DEFEND cooldown / unavailable state.
- stun after successful DEFEND.

Core gameplay rules:

- each player starts combat with `100 HP`.
- HP can use decimal values.
- each fight round lasts 50 seconds.
- each question round lasts 6 seconds.
- the shared attack power indicator starts at `1` and ramps to `30` over the full 6-second question round.
- if both players submit no valid answer before the 6-second question round ends, both players receive `SHOCK!` and lose `10 HP`.

Question turnover and timer rules:

- the next question appears immediately after the previous question is answered / resolved.
- the full prompt is presented immediately; the 6-second question round timer and attack power movement start when the prompt appears.
- item-by-item prompt fly-in (each item entering from the top or bottom) is deferred presentation polish and is not part of the MVP question truth; prompts stay immediate.
- once the 6-second question timer starts, it keeps running during active DEFEND, `MISSED!` lockout, and `STUNNED`.
- active DEFEND, `MISSED!` lockout, and `STUNNED` do not pause the question timer.
- if a player is locked out when the 6-second question timer ends, that player has no valid answer for that question.
- if both players have no valid answer by the timer end, both receive `SHOCK!` and lose `10 HP`.
- if one player submitted a valid correct answer before the timer end, that answer resolves normally even if the opponent is locked out or does nothing.

Authoritative answer ordering rules:

- Live Match Module is authoritative for answer/action ordering.
- each submitted gameplay action receives a server receive timestamp.
- a valid correct answer can claim an attack only if the player is allowed to act at that server moment.
- same-time answers use server receive timestamps.
- if both valid correct answers arrive within `150ms`, the exchange is `DRAW!` and creates `Additional DMG`.
- if one player is in active DEFEND, `MISSED!` lockout, or `STUNNED`, that player's answer input is ignored or rejected until that state ends.
- if an answer arrives after the 6-second question round timer ends, it does not count.
- if one valid correct answer arrives before timeout and the other player does nothing, the correct answer resolves normally.

Damage rules:

- normal attack damage is `captured attack power x streak multiplier`.
- captured attack power is the attack power value when the successful attack is claimed.
- the first consecutive successful attack uses a `1.1x` streak multiplier.
- the second consecutive successful attack uses `1.2x`.
- the third consecutive successful attack uses `1.3x`.
- the fourth consecutive successful attack uses `1.4x`.
- the fifth and later consecutive successful attacks use `1.5x`.
- the streak multiplier is capped at `1.5x`.
- when a player successfully attacks, the opponent HP bar updates and shows a `-___ HP` damage value.

Wrong-answer and timeout rules:

- a wrong answer shows `MISSED!`.
- `MISSED!` creates a 1-second action and DEFEND lockout for the player who answered wrongly.
- during the `MISSED!` lockout, the player cannot answer or DEFEND.
- opponent attacks during the `MISSED!` lockout deal normal attack damage.
- `MISSED!` does not add an extra damage multiplier or extra HP penalty.
- no valid answer before the 6-second question round ends is the question-round timeout / no-action state.
- if both players time out / take no action, both players receive `SHOCK!` and lose `10 HP`.

Same-time answer and `Additional DMG` rules:

- same-time answers happen when the second valid correct answer arrives within `150ms` of the first valid correct answer.
- if the second valid correct answer arrives after the `150ms` window, the first valid correct answer wins the attack.
- same-time answers create one shared `Additional DMG` carryover value.
- `Additional DMG` equals the captured attack power at the `DRAW!` / same-time moment.
- `Additional DMG` is applied to the next question round.
- on the next question round, the player who wins the exchange first receives `TIE-BREAKER!`.
- the `TIE-BREAKER!` winner deals `normal/revenge damage + Additional DMG`.
- `Additional DMG` clears after that next exchange whether it lands, is blocked by DEFEND, or times out.
- same-time answers do not create separate per-player carryover values.

DEFEND rules:

- DEFEND is active for 1.5 seconds after being pressed.
- while DEFEND is active, the defending player cannot answer.
- the defending player can answer only after the active DEFEND window has passed.
- active DEFEND absorbs any incoming damage during its 1.5-second active window.
- DEFEND is checked at the moment incoming damage would land.
- if DEFEND is active at the damage-land moment, it absorbs the incoming damage.
- if DEFEND is not active at the damage-land moment, the attack lands normally.
- if a player presses DEFEND after the attack has already landed, DEFEND does not retroactively block that attack.
- DEFEND can block normal damage, revenge damage, and `Additional DMG` stacked onto that attack.
- after DEFEND is used, it is unavailable for the rest of the current question round and for the next question round.
- a successful DEFEND stuns the attacker for `1.5s`.
- during stun, the attacker cannot answer.
- active DEFEND absorbs revenge attack damage.
- if a revenge attack lands into active DEFEND, the revenge attack is fully absorbed, the revenge gauge is consumed, the attacker is stunned for `1.5s`, and the defender takes no HP damage.
- if DEFEND blocks a `TIE-BREAKER!` attack with `Additional DMG`, the `Additional DMG` carryover still clears.

Revenge rules:

- revenge gauge fills when the player receives successful hits from the opponent.
- revenge is a comeback mechanic that gives the hit player a visible chance to recover.
- correct answers do not reset the revenge gauge while it is still accumulating.
- after the player receives 5 successful hits, revenge becomes active on the next question.
- when revenge is active, the player's next correct answer uses the revenge attack.
- revenge attack damage is `2 x attack power`.
- revenge attack damage does not use the streak multiplier.
- revenge attacks do not count as part of a streak.
- after a revenge attack resolves, the next normal successful attack starts the streak multiplier sequence.

Fight-round and match result rules:

- the fight-round winner is determined by higher remaining HP at the end of the 50-second fight round.
- if Player A has more HP, Player A wins the fight round.
- if Player B has more HP, Player B wins the fight round.
- if both players have equal HP, the fight round is tied.
- tied fight rounds do not award a fight-round win to either player.
- first player to win 2 fight rounds wins the match.
- if the match cannot resolve because of tied fight rounds, the match enters a Final round.
- if the Final round ends with equal HP, both players lose.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-question-generation-and-difficulty"></a>

#### ii. Question Generation And Difficulty

Question generation and difficulty are MVP gameplay features.

At the start of each fight round, the backend selects one question type for that round. Difficulty is a per-match setting fixed at match creation (see below), not re-rolled each round.

Before each round starts, players see a short round-intro sequence (~2.4s) that reveals the round's question type and a `Ready... Go!` cue before the first question.

For all game modes, both active combatants receive the same generated question prompt for each question round.

In PvP, both players race to answer the same prompt.

In PvC, the human player and CPU opponent use the same prompt, with CPU behavior determining when and how the CPU answers or acts.

Question type selection (all Quick Match, private, and PvC matches):

| Type | Chance |
| --- | --- |
| Addition | 50% |
| Subtraction | 50% |

Tutorial matches use addition only.

Mixed addition/subtraction and the PvP `?` reaction mode are not implemented for MVP.

Difficulty:

- difficulty is a per-match choice, fixed at match creation and used for every round of that match.
- the default difficulty is Easy.
- Very Hard is opt-in: it applies only when both players request it and both have at least 50 completed PvP matches; otherwise the match falls back to Easy.
- the three-way random Easy/Medium/Hard per-round selection is not implemented for MVP.

Question generators:

| Type | Rule | Examples |
| --- | --- | --- |
| Addition | two operands; the answer is their sum. | `7 + 5`, `12 + 18` |
| Subtraction | two operands; negative answers are allowed. | `14 - 9`, `6 - 17` |

- operands range from 1 to 20 (an easier 1-to-10 tier exists internally for the gentlest questions).
- prompts use a single operation with two operands; multi-term chained prompts and 3-digit operands are not implemented for MVP.

Comeback difficulty (armed Easy for a disadvantaged or revenge-state player) is defined as a concept but is not wired into the live question generator for MVP.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-keyboard-input-rules"></a>

#### iii. Keyboard Input Rules

When an in-game match is active, only these keys are active:

- number keys.
- `-` key.
- Spacebar for DEFEND.
- Enter for attack / answer submission.

All other keys should be disabled or ignored during active gameplay.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-accuracy-rules"></a>

#### iv. Accuracy Rules

Accuracy is based on submitted answer attempts.

Accuracy derivation:

- match accuracy is calculated from runtime match state.
- formula: `runtime correct submitted answers / runtime submitted answer attempts`.
- if submitted answer attempts is `0`, show `0%` or no accuracy value.
- accuracy is shown on the post-match results page only for MVP.
- lifetime accuracy is not persisted or shown in 1P Stats for MVP.

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

#### v. 1P Features

The 1P path includes:

- Tutorial.
- Duel CPU.
- 1P Stats.

The shop is not part of The MVP.

Tutorial:

- CPU 1 teaches attack power, `SHOCK!`, streak pressure, revenge activation, revenge attack, and streak building.
- CPU 1 simplified practice fight does not use DEFEND.
- CPU 2 teaches DEFEND.
- CPU 2 simplified practice fight reinforces DEFEND, streak disruption, and revenge advantage.

Duel CPU:

- 4 CPU opponents ship in MVP.
- after tutorial, Max and Min are available.
- Shi-eld and Fury unlock through progression criteria, not coins.
- CPU unlock criteria should be shown on the CPU opponent VS screen.
- CPU unlock progress uses lifetime totals.

CPU unlock progression:

| CPU | Unlock Criteria |
| --- | --- |
| Max | Available after tutorial. |
| Min | Available after tutorial. |
| Shi-eld | 2 Max wins and 2 Min wins. |
| Fury | 2 Shi-eld wins and 1 completed PvP match. |

Only completed PvP matches count toward CPU unlock requirements. Voided matches are excluded.

CPU unlock rules storage:

- the CPU unlock progression table above is the PRD source of truth for MVP unlock conditions.
- unlock rules are stored as backend static game configuration, not as player data.
- the tutorial-complete gate for Max and Min lives in the same backend config as the later CPU unlock criteria.
- implemented in `apps/server/src/config/cpu-unlock-rules.config.ts`.
- the database stores each player's CPU progress only (`player_cpu_progression`); it does not store the rule definitions themselves.

CPU opponent profiles:

| CPU | Internal Fighter Type | MVP Description |
| --- | --- | --- |
| Min | Vanilla fighter | 75% answer accuracy, constant 1.2x damage, cannot build streaks, answers in ~2.5-3.5s, uses revenge through the normal incoming-hit gauge, does not DEFEND. |
| Max | Streak fighter | 75% answer accuracy, attempts streaks 70% of the time, answers in ~2-3s, uses revenge through the normal incoming-hit gauge, does not DEFEND. |
| Shi-eld | Block specialist | 90% answer accuracy, answers in ~4-5.5s, blocks player attacks 90% of the time, attacks after successful blocks, goes weak after the 2.5s mark 90% of the time, surprise-attacks 10% of the time, can DEFEND. |
| Fury | Avenge fighter | 90% answer accuracy, revenge active every question, cannot build streaks, answers in ~1.9-3.1s, blocks attacks 80% of the time, harder questions ~70% of the time, 50% critical-hit chance at power 30 for `attackPower x 3` damage, can DEFEND. |

Human player fighter type classification is not a player-facing MVP feature.

1P Stats:

- private personal progress page.
- shows PvP stats.
- shows last 10 PvP match history rows.
- shows D/C count.
- shows CPU defeat counts, such as `Max x 5 wins`.
- shows CPU unlock/progression state where relevant.
- lifetime accuracy is not shown in 1P Stats for MVP unless answer counters are later accepted for persistence.

1P Stats PvP match history:

- shows the player's last 10 PvP matches only.
- reads from persisted `pvp_matches`.
- does not include PvC match history.
- does not show Aura gained in the match-history table.
- shows `Match #`, opponent, match type, result, and played-at time.
- `Match #` is derived from chronological PvP match ordering for that player.
- opponent name may reflect the opponent's current username.
- no username snapshot fields are required for MVP match history.
- match type is derived from `is_private_match`.
- result is derived from `status`, `winner_player_id`, and `dc_player_id`.
- played-at time is derived from `ended_at` when available, otherwise `started_at`.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-2p-features"></a>

#### vi. 2P Features

The 2P path includes only:

- Quick Match.
- Create Private Room.

There is no public-facing game lobby in The MVP.

Quick Match:

- player clicks Quick Match.
- backend queues Quick Match requests.
- backend assigns a room when 2 players are available.
- matched players see a challenge/ready page.

Create Private Room:

- Create Private Room is private friend challenge only.
- player chooses an online friend.
- invitation lasts 60 seconds.
- inviter sees `Invitation not accepted.` if no response.
- invited friend sees `___ challenges you to a duel`.
- invited friend can Accept or Decline.
- if invited friend does not respond within 60 seconds, friend sees `You have declined the challenge.`
- accepted invitation loads the same challenge/ready page pattern as Quick Match.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-shared-1p-and-2p-features"></a>

#### vii. Shared 1P And 2P Features

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
- show match longest streak from runtime match state.
- show relevant progression updates.
- show random result quote from the relevant quote pool.

PvP post-match results:

- show Aura gained.
- public Quick Match results show Rematch and Add Friend.
- private/friend match results show Rematch.

PvC post-match results:

- show win/loss.
- show accuracy.
- show match longest streak from runtime match state.
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

<a id="feature-visual-presentation-features"></a>

### B) Visual Presentation Features

Visual presentation supports the duel by making attacks, mistakes, comebacks, wins, and losses feel lively and readable.

The active-match presentation and animation layer is built with React and CSS/DOM animation in the client (no separate game engine such as Excalibur.js is used). It expresses movement, impact, state changes, and effects, but it does not replace the server-owned gameplay rules.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-avatar-and-cpu-character-art"></a>

#### i. Profile Picture And CPU Character Art

MVP player identity uses either an uploaded profile picture or a built-in premade avatar.

Player profile picture rules:

- players upload a profile picture from their device, or select one of the built-in premade avatars.
- supported upload formats include `jpg`, `jpeg`, `png`, and `webp`.
- uploaded profile pictures are validated (type and size) and resized before storage.
- the chosen identity image source (uploaded vs premade) is persisted per profile.
- the player identity image is displayed on profile, friend, community, leaderboard, VS, and active match surfaces.
- active match may animate the identity image for presentation, including HP-based heartbeat scaling.
- player profile pictures do not need separate smiling, focused, injured, win, or lose state assets for MVP.

MVP CPU opponent display identities:

| CPU | Visual Design |
| --- | --- |
| Min | word character: `min`. |
| Max | word character: `MAX`. |
| Shi-eld | buckler character. |
| Fury | flame character. |

CPU opponents should also support smiling, focused, injured, win, and lose states where applicable.

CPU opponent visuals should use aggressive / competitive eyes where readable. Shi-eld may use painted eyes, an emblem-face, or another shield-readable face treatment.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-background-art"></a>

#### ii. Background Art

MVP uses one background per match.

The selected background remains stable for the full match and does not change between fight rounds.

MVP background themes:

- math classroom arena.
- chalkboard formula arena.
- graph / grid arena.
- starry math-space arena.
- neon numbers arcade arena.

Backgrounds should avoid character art and keep the main gameplay / UI area readable.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-combat-effects-and-animation"></a>

#### iii. Combat Effects And Animation

Shared visual effect assets should support:

- shield overlay for DEFEND.
- fire aura for active revenge gauge.
- shock / electric burst for `SHOCK!`.
- impact flash for attack hits.
- stun mark for stunned state.
- blinding white light for revenge attack burst / impact.

Client-rendered animation should support:

- normal attack spring motion.
- heavier attack motion for strong attacks.
- wrong-answer shake or tint.
- shield flash on successful DEFEND.
- fire aura display while revenge gauge is active.
- blinding white flash during revenge attack impact.
- screen shake for high-impact moments.
- win bounce or pose emphasis.
- lose slump or pose emphasis.

Fire aura means the revenge gauge is active.

The actual revenge attack impact should use a blinding white light burst.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-gameplay-screen-hud-presentation-contract"></a>

#### iv. Gameplay Screen / HUD Presentation Contract

The Active Match screen should prioritize readable combat state over decorative layout.

Top area:

- show the fight-round timer.
- do not show fight score / round-win score during active gameplay for MVP.
- current match phase may be shown only when needed, such as Final round or reconnect/void state.

Left and right player areas:

- each player side shows the combatant profile picture or CPU identity, HP bar, DEFEND button, attack status bar, and state status bar.
- HP bars start at `100 HP` and may display decimal HP values after damage.
- HP bar color is yellow from `70%` to `100%`, orange from `35%` to `69%`, and red from `0%` to `34%`.
- successful incoming damage updates the HP bar and shows an animated `-___ HP` value near the damaged player.

DEFEND button:

- the DEFEND button sits above the player status bars.
- available DEFEND appears colored and bold.
- used or unavailable DEFEND appears greyed out or translucent.
- active DEFEND shows for the `1.5s` active window.
- while active DEFEND is running, that player cannot answer.

Attack status bar:

- the attack status bar is divided into two rows.
- the top row shows the current streak multiplier, such as `x1.1`, `x1.2`, up to `x1.5`.
- the bottom row shows the revenge gauge as 5 blocks.
- each successful hit received by the player fills 1 revenge block.
- the revenge gauge starts yellow and shifts toward angry orange as blocks fill.
- a full revenge gauge glows or throbs orange.
- active revenge may also use the fire aura visual defined in Combat Effects And Animation.

State status bar:

- the state status bar appears under the attack status bar.
- it displays combat state labels such as `MISSED!`, `SHOCK!`, `DEFEND`, and `STUNNED`.
- immobilizing states use a receding countdown bar.
- `MISSED!` shows a `1s` receding bar while the missed player cannot answer or DEFEND.
- `DEFEND` shows a `1.5s` receding bar while the defending player cannot answer.
- `STUNNED` shows a `1.5s` receding bar while the stunned attacker cannot answer.
- `SHOCK!` is a momentary HP-loss feedback state unless another rule also immobilizes the player.

Center play area:

- show one shared attack power bar with an indicator moving from `1` to `30`.
- show the question prompt large, aggressive, and readable.
- the full prompt is shown immediately when a new question appears; the attack power bar and 6-second question timer start at that moment.
- item-by-item prompt fly-in is deferred presentation polish and is not required for MVP.
- show separate answer input displays for Player 1 and Player 2.
- Player 1 input appears on the left side of the center area.
- Player 2 input appears on the right side of the center area.
- the two input displays should use different player-identifying colors.
- answer input displays accept and show only numbers and `-`.
- no other gameplay input characters should be accepted.
- Enter submits the displayed answer for the local player.

Attack and hit display sequence:

- when Enter resolves a successful attack, show the attacking combatant's attack animation.
- almost immediately after the attack animation begins, show the opponent profile picture or CPU identity hit animation.
- show the animated `-___ HP` value with the hit animation.
- update the opponent HP bar to match the resolved damage.

Lower area:

- show a small Quit button at the lower left.
- PvP quit behavior and PvC quit behavior follow the User Flow and detailed page inventory rules.

Overlay layer:

- show `Revenge ATT!` above the combatant whose revenge attack successfully lands.
- show `CRITICAL!` above the combatant when a revenge attack lands at highest attack power.
- `CRITICAL!` is a presentation callout unless a combat rule, such as a CPU-specific critical rule, assigns extra damage.
- show `DEFENDER!` above the combatant that successfully blocks a revenge attack.
- show `DRAW!` when answers qualify as same-time answers.
- show `TIE-BREAKER!` for the player who first wins the next question after a `DRAW!` / `Additional DMG` carryover.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-visual-asset-contract"></a>

#### v. Visual Asset Contract

CPU state assets should be:

- `512x512`.
- transparent PNG.
- centered with consistent margins.
- free of important details near the image edge.

Uploaded player profile pictures should be:

- accepted in common image formats such as `jpg`, `jpeg`, `png`, and `webp`.
- validated by file type and size.
- resized or constrained by the application for gameplay and profile display.
- stored as player identity media, not as selectable built-in avatar assets.

Background assets should be:

- `1920x1080`.
- widescreen images.
- readable behind the duel UI.

Recommended asset folders:

- `assets/game/cpus/`.
- `assets/game/backgrounds/`.
- `assets/game/effects/`.

Recommended filename style:

- lowercase.
- snake_case.
- includes asset type, identity, and state or theme.

Filename examples:

- `cpu_max_injured.png`.
- `cpu_fury_win.png`.
- `bg_chalkboard_formula.png`.
- `effect_shield.png`.
- `effect_fire_aura.png`.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-community-features"></a>

### C) Community Features

Community features cover social relationships, chat, and ranking.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-friend-system"></a>

#### i. Friend System

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
- shows each friend's profile picture.
- shows each friend's player name.
- shows each friend's Aura Points.
- shows online/offline state.
- shows last activity if the friend is offline, based on available login/activity data.

Add Friend / search:

- player can search for another player by exact or partial player name.
- search supports autocomplete suggestions that help complete player names.
- partial player-name search and autocomplete should use indexed lookup or equivalent search support so results stay responsive.
- search results show profile picture, player name, and Aura Points.
- search results provide an `Add Friend` CTA when eligible.
- sending a request creates or updates a `pending` friendship record.
- sending friend requests should be rate-limited or cooldown-protected to prevent spam.

Friend requests:

- incoming friend requests are shown under Community.
- incoming requests show requester profile picture, player name, and Aura Points.
- player can `Accept` or `Decline`.
- accepting changes friendship status to `accepted`.
- declining changes friendship status to `declined`.

Remove Friend:

- player can remove an accepted friend.
- removing a friend changes the friendship status to `unfriended`.
- removed friends no longer appear in the active friend list.
- the friendship record should remain available for future updates, analytics, or abuse review.

Private friend challenges:

- accepted friends are eligible for private friend challenges through the 2P `Create Private Room` flow.
- only online friends can be selected for immediate private challenge in MVP.
- accepted private challenge routes both players to the shared Challenge / Ready page.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-community-chat"></a>

#### ii. Community Chat

Community Chat is the MVP basic chat system.

Community Chat features:

- housed under Community.
- uses WebSockets or equivalent realtime transport.
- allows logged-in users to send and receive community chat messages in realtime.
- shows message sender profile picture.
- shows message sender username.
- shows message text.
- shows message timestamp formatted for Singapore time.
- shows a message input.
- message input accepts up to `280` characters.
- empty messages are rejected.
- messages over `280` characters are rejected or truncated before send.
- chat display shows 10 visible message rows.
- user can scroll through the latest 50 message rows.
- server keeps only the latest 50 chat messages in memory for the current server session.
- when message 51 arrives, the oldest message is dropped from server memory.
- chat messages do not persist to the database.
- if the server restarts, Community Chat history is cleared.

Community Chat moderation:

- offensive-language filtering is required for MVP Community Chat.
- server censors offensive language before broadcasting messages to clients.
- clients display only the censored message received from the server.
- client-side pre-display censorship may be used for immediate local feedback, but server-side censorship is authoritative.
- raw offensive message content should not be broadcast to other clients.

Friend match chat:

- friend-only results chat is not part of The MVP.
- private/friend PvP results do not need a separate chat surface for MVP.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-leaderboard"></a>

#### iii. Leaderboard

- housed under Community, not 2P.
- ranks by Aura Points.
- Aura is PvP-only.
- shows top 50 players.
- supports friend filter.
- friend filter shows only accepted friends and the current player.
- player rank is always pinned at the top.
- pinned player rank shows rank and Aura Points.
- leaderboard reads persisted `player_profiles.aura_points`; no separate leaderboard source-of-truth table is required.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-aura-points"></a>

#### iv. Aura Points

- completed valid PvP matches award Aura.
- Quick Match PvP and private/friend PvP use the same Aura formula.
- winner: `50 AP + correct answers x 10 AP`.
- loser: `correct answers x 10 AP`.
- mutual final-round loss: no win bonus; correct answers still award AP if the match completed validly.
- voided/D/C match: `0 AP`.
- PvC does not award Aura.
- Aura gain is calculated from runtime match state when the PvP match ends.
- Aura total is persisted as `player_profiles.aura_points`.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-vs-rooms-management"></a>

### D) VS Rooms Management Features

VS rooms are backend-managed for MVP.

This section describes player-facing VS room behavior.

Implementation ownership for queues, rooms, ready state, live synchronization, and persistence is described in Architecture Features.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-quick-match-queue"></a>

#### i. Quick Match Queue

- server listens for Quick Match requests.
- server queues players.
- server assigns a room when 2 queued players are available.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-room-capacity"></a>

#### ii. Room Capacity

- maximum 50 active rooms.
- public Quick Match rooms and private rooms share the same 50-room pool.
- if room cap is reached, show `Game rooms are full. Please return in 5 minutes.`

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-room-lifecycle"></a>

#### iii. Room Lifecycle

- assigned room remains occupied until both players exit or close the room.
- no third player can join an assigned room.
- public-facing room browsing is not part of MVP.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-ready-state"></a>

#### iv. Ready State

- Matchmaking Module is authoritative for Ready / Stop state.
- ready page shows `___ VS ___`.
- ready page shows a large Ready button.
- the 30-second Ready window starts when both players arrive on the Challenge / Ready page.
- each player has 30 seconds to press Ready.
- if one player presses Ready, that player's state becomes Ready while the other remains Not Ready.
- if one or both players do not press Ready within 30 seconds, the match auto-starts.
- when both players are ready, show `Match begins in...`.
- match countdown is 5 seconds.
- during the 5-second match countdown, the square Stop icon cancels the countdown and resets both players to Not Ready with a fresh 30-second Ready window.
- if a player disconnects or leaves the Challenge / Ready page before Active Match starts, the room is cancelled/released and the remaining player returns to the previous PvP page with `Opponent left.`
- once Active Match starts, Stop is no longer available.
- after Active Match starts, quit/disconnect uses the PvP reconnect / void flow.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-reconnection"></a>

#### v. Reconnection

- dropped connection pauses the game for both players.
- both players see a 10-second reconnect countdown.
- if reconnect succeeds, show `Player connected!`.
- after reconnect succeeds, show a 5-second countdown before resuming.
- if reconnect fails, match is voided and disconnected player's D/C count increases by 1.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-enhancement-features"></a>

### E) Enhancement Features

Enhancement features are MVP support/polish items and explicitly deferred future ideas.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-user-profile-and-settings"></a>

#### i. User Profile And Settings

The Profile page is a Home-level MVP page for account identity and player preferences.

Profile page features:

- view current username.
- view current email.
- upload or replace profile picture from the user's device, or pick a built-in premade avatar.
- accept common image formats, including `jpg`, `jpeg`, `png`, and `webp`.
- validate profile picture file type and size on the client and server.
- change username when the requested username is not already used by another user.
- change email when the requested email is not already used by another user.
- change password after validating the current password.
- change language preference.
- persist profile updates to account/profile storage.

Profile picture rules:

- the player's MVP identity image is either an uploaded profile picture or a selected built-in premade avatar.
- the identity image source is stored per profile and can be switched from Settings.
- the identity image is shown on profile, friend, community, leaderboard, VS, and active match surfaces where player identity is displayed.
- active match presentation may animate the identity image, but the stored image remains the identity source.

Active Match profile picture heartbeat:

- player profile pictures on the active match screen scale up and down to simulate a heartbeat.
- high HP heartbeat: picture scales up for `0.1s` once every `3s`.
- medium HP heartbeat: picture alternates `1s` scaled up, `1s` normal, repeating.
- low HP heartbeat: picture alternates `0.4s` scaled up, `0.4s` normal, repeating.
- heartbeat animation is presentation-only and does not affect HP or game rules.

Public profile display:

- other players can view basic public profile information needed by friends, chat, leaderboard, and match surfaces.
- public profile information includes username, profile picture, Aura Points where relevant, and online/offline state where relevant.
- email and password are never shown publicly.

Username change rule:

- username changes affect future profile and display reads.
- existing PvP match history may show the opponent's current username.
- no username snapshot fields are required for MVP.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-localization"></a>

#### ii. Localization

- MVP supports English (base/fallback), Malay, Chinese, Spanish, French, and Korean.
- translation should cover MVP UI text.
- translation should cover status messages, result messages, errors, and menu labels.
- question content is numeric/symbolic unless later clarified.
- language preference is changed from the Profile page.
- language preference persists on the player profile and applies after future logins.
- username and user-generated chat messages are not translated.
- translations should be implemented as shared static translation resources, not as an external translation service.
- each supported language should have a translation file or equivalent structured resource used by all pages.
- changing the selected language updates UI text across the app wherever translation resources exist.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-legal-pages"></a>

#### iii. Legal Pages

MVP should provide simple legal pages from the Home Page.

Required pages:

- Privacy Policy.
- Terms Of Service.

Page rules:

- Privacy Policy and Terms Of Service must be accessible to users.
- Privacy Policy and Terms Of Service should be easily accessible from the application, such as through Home Page or footer links.
- Privacy Policy and Terms Of Service must contain relevant project-appropriate content before release.
- Privacy Policy and Terms Of Service must not be placeholder or empty pages.
- these pages are legal support pages and should not block the primary 1P, 2P, Community, or Profile flows.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-architecture-features"></a>

### F) Architecture Summary

MVP architecture uses four Dockerized runtime services:

| Service | Primary Responsibility |
| --- | --- |
| Nginx entrypoint / reverse proxy | Routes frontend, REST API, and WebSocket traffic. |
| Next.js frontend | Owns app pages, routing, page UI, REST/WebSocket clients, localization resources, and the browser-loaded Active Match host. |
| Express backend / modular monolith | Owns auth, profile, friends, stats, matchmaking, live match runtime, match summary persistence, question generation, CPU behavior, REST APIs, WebSockets, and server runtime memory. |
| Database service | Persists `users`, `oauth_accounts`, `player_profiles`, `player_friendships`, `pvp_matches`, and `player_cpu_progression`. |

Architecture ownership rules:

- server-owned gameplay/domain logic is authoritative for HP, damage, answer validity, status effects, round winners, match winners, Aura awards, and persistence handoff.
- the React/DOM/CSS client is the active-match presentation layer; it renders authoritative state and visual effects but does not decide gameplay truth.
- backend runtime memory owns temporary queues, rooms, ready/reconnect timers, active match state, WebSocket sessions, and the latest-50 Community Chat buffer.
- database tables persist MVP source-of-truth records only; live timers, active HP, per-question events, and Community Chat messages are not persisted.
- REST is used for stable page data; WebSockets or equivalent realtime transport are used for queue, ready, active match, reconnect, rematch, and Community Chat flows.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="section-user-flow"></a>

## 4. User Flow

User flows describe the player-facing journey through the MVP. They do not replace the feature and architecture sections above.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="flow-1p-tutorial-cpu-progression"></a>

### i. 1P Tutorial / CPU Progression Flow

The 1P flow supports learning, practice, and CPU unlock progression.

1P progression flow:

- player signs up or logs in.
- player completes Tutorial.
- after Tutorial, Max and Min are available.
- player enters Duel CPU.
- player selects an unlocked CPU opponent.
- player plays a PvC match.
- completed PvC wins update CPU defeat counts and unlock progress where applicable.
- Shi-eld and Fury unlock through the PRD CPU unlock criteria.

Unlocked CPU opponents can be replayed as many times as the player wants.

The 1P flow describes the full progression path, not a forced one-time path.

1P and PvC pages should provide Back navigation where appropriate so the player can return to previous menus or navigate toward other options, including 2P.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="flow-1p-stats"></a>

### ii. 1P Stats Flow

The 1P Stats page is a private personal progress page.

1P Stats should show information in this order:

1. CPU defeat counts.
2. CPU unlock progress.
3. PvP stats.
4. Last 10 PvP match history.
5. D/C count.

CPU defeat counts should show lifetime wins against CPU opponents, such as `Max x 5 wins`.

CPU unlock progress should show relevant progress toward locked CPU opponents.

PvP stats, last 10 PvP match history, and D/C count are shown after CPU progress information.

Last 10 PvP match history should show:

- `Match #`.
- opponent.
- match type.
- result.
- played-at time.

Last 10 PvP match history should not show Aura gained.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="flow-pvc-quit-disconnect"></a>

### iii. PvC Quit / Disconnect Flow

PvC does not use the PvP reconnect grace period for MVP.

PvC active match quit flow:

- player presses Quit.
- confirmation prompt appears.
- prompt title: `Exit match?`
- prompt text: `This CPU match will be voided and no progress will be recorded.`
- buttons: `Cancel` and `Exit Match`.
- if player selects `Cancel`, return to the active PvC match.
- if player selects `Exit Match`, void the PvC session.

Confirmed PvC quit result message:

- `CPU match voided.`
- `No CPU win or unlock progress was recorded.`

PvC sudden disconnect flow:

- sudden disconnect immediately voids the PvC session.
- no reconnect grace period is shown.
- no CPU defeat count is added.
- no CPU unlock progress is recorded.

PvC sudden disconnect result message:

- `CPU match voided due to disconnect.`
- `No CPU win or unlock progress was recorded.`

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="flow-2p-quick-match"></a>

### iv. 2P Quick Match Flow

Quick Match is the public PvP entry point for MVP.

Quick Match flow:

- player goes to 2P.
- player clicks Quick Match.
- backend queues the player.
- when another player is available, backend assigns a room.
- both players go to the Challenge / Ready page.
- players proceed through the PvP Ready / Match Start flow.
- players play the active PvP match.
- players go to the PvP results page.

Quick Match results should include:

- win/loss/voided outcome.
- accuracy.
- correct answers.
- match longest streak.
- Aura gained.
- result quote.
- Rematch.
- Add Friend.
- Back button.

The Back button lets the player return to the 2P option page or other navigation options.

Quick Match results show more data than MVP persists.

Persisted after Quick Match:

- final PvP match summary.
- Aura total update.
- D/C evidence through voided match data when applicable.

Runtime-only / session-only Quick Match results data:

- accuracy.
- correct answers.
- submitted answer attempts.
- match longest streak.
- per-match Aura gained.
- selected result quote.
- Rematch availability.
- Add Friend button state, unless a friend request is actually sent.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="flow-2p-friend-challenge-create-private-room"></a>

### v. 2P Friend Challenge / Create Private Room Flow

Create Private Room is private friend challenge only for MVP.

Create Private Room flow:

- player goes to 2P.
- player clicks Create Private Room.
- player chooses an online accepted friend.
- invite is sent.
- inviter waits up to 60 seconds.
- invited friend sees `___ challenges you to a duel`.
- invited friend can Accept or Decline.

If accepted:

- both players go to the Challenge / Ready page.
- players proceed through the PvP Ready / Match Start flow.
- players play the active PvP match.
- players go to the private/friend PvP results page.

If declined or timed out:

- inviter sees `Invitation not accepted.`
- if the invited friend does not respond within 60 seconds, that friend sees `You have declined the challenge.`

Private/friend match results should include:

- normal PvP results.
- Aura gained.
- Rematch.
- Back button.

Private/friend match results do not show Add Friend because both players are already friends.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="flow-pvp-ready-match-start"></a>

### vi. PvP Ready / Match Start Flow

PvP matches use the same Challenge / Ready page pattern for Quick Match and accepted private friend challenges.

Ready flow:

- Matchmaking Module is authoritative for Ready / Stop state.
- ready page shows `___ VS ___`.
- ready page shows a large Ready button.
- the 30-second Ready window starts when both players arrive on the Challenge / Ready page.
- each player has 30 seconds to press Ready.
- if one player presses Ready, that player's state becomes Ready while the other remains Not Ready.
- if both players press Ready, show `Match begins in...`.
- match countdown is 5 seconds.
- if one or both players do not press Ready within 30 seconds, the match auto-starts.
- during the 5-second match countdown, the square Stop icon cancels the countdown and resets both players to Not Ready with a fresh 30-second Ready window.
- if a player disconnects or leaves the Challenge / Ready page before Active Match starts, the room is cancelled/released and the remaining player returns to the previous PvP page with `Opponent left.`
- once Active Match starts, Stop is no longer available.
- after Active Match starts, quit/disconnect uses the PvP reconnect / void flow.

After the countdown or auto-start, the active PvP match begins.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="flow-pvp-results"></a>

### vii. PvP Results Flow

PvP results appear after completed or voided PvP matches.

PvP results should show:

- win/loss/voided outcome.
- accuracy.
- correct answers.
- match longest streak.
- Aura gained.
- relevant progression updates.
- random result quote from the relevant quote pool.

Quick Match results show:

- Rematch.
- Add Friend.
- Back button.

Private/friend match results show:

- Rematch.
- Back button.

Voided PvP matches award `0 AP`.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="flow-pvp-rematch"></a>

### viii. PvP Rematch Flow

Rematch is a same-opponent rematch request from the PvP results page.

Rematch flow:

- one player clicks Rematch.
- that player waits for the other player to accept.
- if both players choose Rematch, both return to the Challenge / Ready page.
- the rematch starts a new match with fresh runtime state.
- the rematch creates its own final match summary if completed or voided.

If one player requests Rematch and the other player leaves or presses Back, show:

- `Rematch not accepted.`

For private/friend matches, the friend-results session/chat context remains available only while players stay in the results flow.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="flow-pvp-quit-disconnect-reconnect"></a>

### ix. PvP Quit / Disconnect / Reconnect Flow

PvP active-match quit and disconnect use the reconnect grace flow.

PvP quit/disconnect flow:

- player presses Quit or disconnects.
- active match pauses for both players.
- both players see a 10-second reconnect / return countdown.
- if reconnect / return succeeds, show `Player connected!`.
- after reconnect succeeds, show a 5-second countdown before resuming.
- if reconnect / return fails, the match is voided.
- disconnected or quitting player's D/C count increases by 1.
- match persists as voided in `pvp_matches`.
- Aura gained is `0 AP`.
- both players go to voided PvP results.

<a href="#table-of-contents">Back to Table of Contents</a>

