# NEXT - CORE GAME MECHANICS (MVP SPEC)

---

## Purpose

Define the exact rules of the game engine for the MVP.

This document is the gameplay rules source for the engine.

Only the engine implements these rules. UI displays engine state. Stats observe engine outcomes.

---

# Game Structure

---

## Game Modes

The game supports:

- PvP: player vs player.
- PVC: player vs computer.

### PvP Purpose

PvP is the primary competitive mode where players use speed, accuracy, DEFEND timing, streak pressure, revenge, and question-mode adaptation against real players.

### PVC Purpose

PVC serves two purposes:

- onboard players so they become familiar with the game mechanics.
- allow players to practice skills that can transfer to real-player PvP matches.

PVC should preserve the same core mechanic language as PvP unless later clarified otherwise.

CPU 1 and CPU 2 should teach the core combat mechanics required to begin playing.

The following mechanics may be discovered through play rather than explicitly taught by CPU 1 or CPU 2:

- `Additional DMG` from same-time answers.
- wrong-answer punishment.
- fight-round spinner and question-mode adaptation.
- PvP-only `?` mode reaction sequences.
- full match/tie/final-round structure.

These discoverable mechanics are not currently considered severe enough to block basic player readiness if the player does not know them before progressing.

### PVC CPU Opponents

PVC can use CPU characters as mechanic-focused trainers.

The CPU character visuals may inspire the design, but the rules do not need to strictly follow the generated visual.

#### CPU 1 - Streak Trainer

Purpose:

- introduce the streak mechanic to the player.
- train the player to recognize why consecutive correct attacks matter.
- teach attack power, no-action `SHOCK!`, revenge activation, and revenge attack payoff.
- help the player become proficient with streak-building before facing real players.

This CPU character is the first PVC onboarding opponent.

### CPU 1 Tutorial Sequence

CPU 1 uses a scripted onboarding sequence before normal PVC behavior is clarified.

#### Step 1 - Round Start

- Fight round starts normally.
- Display: `Round 1 - Go!`

#### Step 2 - First Guided Attack

- Screen freezes.
- The shared power bar indicator slowly animates to 5 attack power.
- The game prompts the player to answer the question.
- When the player answers correctly:
  - CPU loses 5 HP.
  - CPU health bar visually shows the HP deduction.

#### Step 3 - Full-Power Guided Attack

- Next question round begins.
- Screen animates the shared power bar indicator moving to 30 attack power.
- The game prompts the player to answer.
- When the player answers correctly:
  - CPU takes damage based on the 30 attack power.
  - CPU health bar visually shows the HP deduction.

#### Step 4 - Two Free Attack Rounds

- The game prompts the player to attack for the next 2 question rounds.
- If the player does not attack:
  - both CPU and player receive `SHOCK!`.
  - both lose 10 HP.
  - the game explains that if no attack is dealt, the arena shocks both players.

#### Step 5 - Forced Shock Demonstration

- If the player successfully attacks during the 2 free attack rounds, the game stops the player from attacking in the subsequent question round.
- This forces a `SHOCK!` demonstration.
- The game explains what happens when players do not attack.

#### Step 6 - CPU Streak Demonstration

- CPU says: `I will strike hard and strike fast!`
- CPU demonstrates a 5-hit streak.
- With each successive hit:
  - the player takes streak-scaled damage.
  - the player's revenge gauge fills.
- On the 5th hit:
  - the player's revenge gauge activates.
  - the player's attack status bar shows `+100% DMG`.

#### Step 7 - Guided Revenge Attack

- The game animates the shared attack power bar indicator moving to 30.
- The game prompts the player to attack.
- When the player answers correctly:
  - the player performs a revenge attack.
  - the CPU takes large damage.
  - the CPU HP bar visually emphasizes the damage.

#### Step 8 - Player Streak Task

- The game prompts the player to build a 5-hit streak.

#### Step 9 - Simplified Practice Fight

After the scripted tutorial sequence, CPU 1 continues into a simplified practice fight.

During this simplified practice fight:

- DEFEND is not available.
- The player practices attacking, revenge usage, and streak-building without DEFEND complexity.
- CPU attacks with moderate frequency.
- CPU attacks often enough to interrupt and reset the player's streak.
- CPU pressure should make the player practice rebuilding streak momentum.
- The player can lose CPU 1 so the stakes are felt early.
- The player must totally defeat CPU 1 to clear this opponent.
- The game screen should state this as the active objective.
- After the player passes the scripted sequence, replay attempts may skip the scripted sequence and start from the simplified practice fight.
- The fight menu should provide an option to replay the tutorial with scripted sequences.
- After the player clears CPU 1, the player moves on to CPU 2 immediately.

#### CPU 2 - DEFEND Trainer

Purpose:

- introduce the DEFEND mechanic to the player.
- teach that DEFEND can disrupt incoming attacks and streak pressure.
- first teach DEFEND against a normal incoming attack.

CPU 2 is the next PVC onboarding opponent after CPU 1.

### CPU 2 Tutorial Sequence

CPU 2 begins with scripted DEFEND demonstrations.

#### Step 1 - CPU DEFEND Demonstration

- CPU activates DEFEND.
- Task objective tells the player to attack.
- Player attacks.
- CPU successfully defends against the attack.
- CPU DEFEND/status space displays `SUCCESS`.

#### Step 2 - Repeat CPU DEFEND Demonstration

- Repeat the CPU DEFEND demonstration a second time.
- CPU activates DEFEND.
- Task objective tells the player to attack.
- Player attacks.
- CPU successfully defends against the attack.
- CPU DEFEND/status space displays `SUCCESS`.

#### Step 3 - Player DEFEND Demonstration

- Task objective tells the player to press DEFEND.
- CPU attacks.
- Player successfully defends against the CPU attack.
- Player DEFEND/status space flashes `SUCCESS`.

#### Step 4 - DEFEND Cooldown / Alternate-Turn Lesson

- Teach that DEFEND has cooldown / alternate-turn availability.
- Show that DEFEND cannot be spammed every question round.
- After the player uses DEFEND, highlight that DEFEND is greyed out and unavailable for 1 turn.
- Teach the cooldown through button/state visibility rather than forcing a failed DEFEND input.

#### Step 5 - DEFEND Disrupts A Streak

- Script an event that teaches DEFEND can disrupt an opponent streak.
- CPU is scripted to successfully build a visible 3-4 hit streak before the player is prompted.
- Task objective tells the player to use DEFEND.
- Successful DEFEND interrupts the streak.

#### Step 6 - DEFEND Turns Revenge Into Advantage

- Script an event that teaches DEFEND can turn a revenge situation into advantage.
- The tutorial should show DEFEND interacting with revenge pressure.
- The player should receive scripted streak damage that activates the player's revenge gauge.
- After the player's revenge gauge activates, freeze the screen and prompt the player to press DEFEND.
- After the player presses DEFEND, the tutorial may resume/continue into the next beat.
- Immediately after the player presses DEFEND, prompt the player to answer and release the revenge attack.
- Successful DEFEND should create advantage for the defending player.

After the scripted DEFEND lessons, CPU 2 continues into a simplified DEFEND practice fight.

- The player can lose CPU 2 so the stakes are felt early.
- The player must totally defeat CPU 2 to clear the fight.
- During this practice fight, CPU 2 should have a higher chance of dealing streak damage.
- The increased CPU streak pressure should make the player's revenge meter more likely to activate.
- The practice fight should reinforce DEFEND, streak disruption, and revenge-advantage conversion.
- After the player passes the scripted sequence, replay attempts may skip the scripted sequence and start from the simplified DEFEND practice fight.
- The fight menu should provide an option to replay the tutorial with scripted sequences.

Exact progression after CPU 2 remains unresolved.

### Tutorial Task UI

CPU 1 should use a visible task tracker.

The task tracker should:

- show the current task, such as `Task: Attack opponent`.
- show an incomplete marker beside the task.
- change the incomplete marker into a tick when the player completes the task.
- update as the tutorial sequence advances.

The task tracker exists to make onboarding objectives explicit.

Exact CPU behavior during the simplified practice fight, difficulty tuning, and teaching progression remain unresolved.

---

## Quit / Disconnect Handling

Quit and disconnect handling affects both game rules and player records.

### PVC Quit Handling

PVC should have an explicit quit button.

If a player presses the PVC quit button:

- freeze the game screen.
- display the quit warning in front of the question so the question is blocked from view.
- warn only that match stats will be voided.

If a player quits a PVC round before completing the relevant scripted tutorial sequence:

- the game should remember that the scripted tutorial sequence has not been completed.
- when the player restarts that PVC fight, the scripted tutorial sequence should be played again.

If a player quits a PVC round after completing the relevant scripted tutorial sequence:

- the current PVC match should be voided.
- the voided PVC match should not count toward match statistics.
- replay may skip the scripted sequence and start from the non-scripted practice fight unless the player chooses tutorial replay from the fight menu.

### PvP Disconnect Handling

The game should attempt to detect which player disconnected from a PvP game.

- A detected disconnect should be logged in the disconnecting player's record as a `D/C`.
- Any dropped PvP connection that is detected should count as `D/C`.
- There is no reconnection grace window before recording `D/C`.
- Explicit player quit should use a separate event label from detected connection drop.
- A quit button should be available somewhere on the PvP fight screen.
- If a player presses the quit button, show a warning message before confirming quit.
- When the quit button is pressed, freeze the game screen.
- The quit warning should be displayed in front of the question so the question is blocked from view.
- On the opponent's screen, show a message that the opponent pressed quit.
- The warning should tell the player that:
  - match stats will be voided.
  - the quit will add to their `D/C` count.
- The number of times a player presses quit during a match should be logged.
- PvP only: if the quit button is pressed for the 3rd time in a match without the player actually quitting, show an escalation warning:
  - pressing quit again will automatically forfeit the game.
  - the automatic forfeit will result in a loss.
- A PvP game affected by disconnect should have its match stats voided and marked invalid.
- The `D/C` stat should remain valid and should be recorded separately from voided match stats.
- A player's `D/C` stat should be visible/published when another player is preparing to fight them.
- Internal event labels:
  - `QUIT_CONFIRMED`: player deliberately confirmed quit through the quit button.
  - `CONNECTION_DROPPED`: game detected that the player's connection dropped.
- Both `QUIT_CONFIRMED` and `CONNECTION_DROPPED` contribute to the player's public `D/C` count.

Purpose:

- provide a soft deterrent against disconnecting in-game.
- incentivize players to complete matches they enter.
- preserve fairness by not treating disconnected-game performance stats as valid match results.

Implementation note:

- A server-authoritative implementation can usually detect which client connection dropped.
- The game may not always be able to prove whether the disconnect was intentional or caused by network failure.

Exact stats schema remains unresolved, but explicit quit and detected connection drop now have distinct internal labels.

## Game Tab Navigation

When a player opens the `Game` tab, the first game screen should present:

- `1P`
- `2P`

After choosing `1P`, a separate `1P Menu` page should open.

The `1P Menu` should present:

- `Tutorial`
- `Duel CPU`
- `Stats`
- `Shop` after the player defeats CPU 2

Players should choose one `1P` path at a time.

The `Tutorial` path uses the already clarified tutorial structure.

The `Duel CPU` path should allow players to fight CPU opponents outside the tutorial path.

The `Duel CPU` option should open a CPU character fight selection screen.

On the CPU character fight selection screen:

- the player selects a CPU opponent to fight.
- if the selected fighter is available, the fight screen loads.
- if the selected fighter is locked/unavailable, the game shows a message explaining the criteria required to fight that fighter.

The `Stats` option should show player stats.

For Version 1, the `Shop` option should only appear in the `1P Menu`.

The `Shop` option should not appear in the `2P` menu or PvP lobby for now.

Initial player stats include:

- number of wins.
- longest streak.
- match where the longest streak happened.
- opponent/player associated with that longest streak.
- date of the longest-streak match.
- total accuracy score.
- number of matches played.
- number of matches disconnected from / D/C.
- coins earned.
- number of times each CPU opponent has been defeated, such as number of times defeated Maki.

Additional stats may be added later.

MVP player profile data should include:

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
- friend list.
- pending friend requests.

Match record persistence should use one central match record as the source of truth.

Each completed or voided match should be saved once under a central `match_id`.

Player profiles should store lightweight match references rather than duplicate full match records.

Conceptually:

- central match records contain the full match data.
- each involved player profile stores a reference to the central `match_id`.
- player match history can be built from those references.

After choosing `2P`, a separate VS option page should open.

The VS option page should present:

- `Quick Match`
- `Enter Game Lobby`
- `Leaderboard`

All pages should have a `Back` button that lets players return to the previous page.

If the player chooses `Quick Match`:

- show a `Finding a match...` page while the system searches for an available room.
- assign the player to the available lobby room that was created earliest.
- do not confirm that a room is found until Quick Match allocates that room space to the waiting player.
- if another player joins the inspected room first, Quick Match should recognize that the room is unavailable and continue searching for another room.
- each room should only be inspected by one Quick Match process at a time.
- while a room is being inspected by one Quick Match process, another Quick Match process should not inspect that same room.
- if the player presses `Back` while `Finding a match...` is active, cancel finding a match and return the player to the previous page.
- if no available room is found because all rooms are full or no rooms exist, tell the player that no available rooms were found.
- after no available room is found, ask whether the player would like to start a VS room.
- present `Private Match` and `Public Match` options.

If the player chooses `Enter Game Lobby`, show the room lobby.

The room lobby should show a room list.

If no rooms are open, the lobby should show:

```text
No rooms open at the moment.
```

The game lobby should not have a fixed connected-player cap for MVP.

Idle lobby users should be removed from the lobby after `10` minutes of inactivity.

The game lobby should host a maximum of `100` rooms for now.

If `100` rooms have already been created:

- show a message saying the lobby has the maximum number of rooms.
- tell the player to come back later.

Each public room row/card should show:

- room name.
- host/player name.
- player count, such as `1/2`.
- `Join` button.

If a room has two players and both players have pressed ready:

- the room status in the lobby should show `in-game`.
- other players should see a `View` option.
- selecting `View` allows the player to view the current game.
- spectator view should be live.
- spectator `View` mode should be read-only.
- spectators should not be able to interact during a live match.
- spectators should see the same full player game UI in read-only mode.
- each game should allow a maximum of `10` viewers for now.

If a match already has the maximum number of viewers:

- grey out the `View` option.
- if a player tries to view anyway, show a message saying the room has the maximum number of viewers and to try viewing another room.

If a match ends while a player is trying to enter as a spectator:

- return a message saying `Match has ended!`.

When a player chooses a room from the room list:

- the player joins that room.
- the game opens a separate room-ready page.
- the room-ready page allows the two players in the room to press the ready button.

If a room becomes full while a player is clicking `Join`:

- the join attempt fails.
- the player is returned/kept outside the room because they were too slow.

If a room auto-closes at the same time another player tries to join:

- room closing takes priority.
- the joining player receives a `could not join room` message.

The room-ready page should show:

- `Player ___ VS Player ___`
- the ready button in the middle.
- after both players press ready, the 3-second countdown appears above the ready button.

When only the room creator is in the room-ready page:

- show `Player ___ VS Waiting...`.
- show the ready button as disabled.
- replace `Waiting...` with the opponent player's name when another player joins.
- keep the room in `waiting` state for `2` minutes.
- if no player joins within `2` minutes, automatically close the room and tell the creator that the room was closed because no player joined.

Private rooms:

- allow the player to invite a friend from the player's friend list to the game.

Duel CPU roster:

- `Maki`
- `Kander`
- `Fury`
- fighter 4: `Shi-eld`
- fighter 5: `Peasy`
- fighter 6: `Skore`

The player initially has access to two Duel CPU opponents:

- `Maki`
- `Kander`

Four additional Duel CPU opponents should be unlockable successively using coins earned from:

- repeatedly fighting the available CPU opponents.
- fighting PvP opponents.

Players cannot unlock a later CPU opponent only because they have enough coins.

To unlock the next Duel CPU opponent, the player must:

- beat the preceding required CPU opponent or opponents.
- have enough coins to pay that opponent's unlock cost.

To unlock `Fury`, the player must:

- beat `Maki`.
- beat `Kander`.
- have at least `500` coins.

Locked Duel CPU unlock costs:

- first locked opponent, `Fury`: `500` coins.
- second locked opponent, `Shi-eld`: `1000` coins.
- third locked opponent, `Peasy`: `1500` coins.
- fourth locked opponent, `Skore`: `3000` coins.

Sequential unlock chain:

- unlock `Fury` by beating `Maki`, beating `Kander`, and paying `500` coins.
- unlock `Shi-eld` by beating `Fury` and paying `1000` coins.
- unlock `Peasy` by beating `Shi-eld` and paying `1500` coins.
- unlock `Skore` by beating `Peasy` and paying `3000` coins.

Maki profile:

- fighter type: `Vanilla`.
- distinct characteristic: attacks with `1.2x` damage at all times.
- limitation: cannot build streaks.
- attack timing pattern: answers between `2` and `3` seconds with `70%` probability.
- fallback attack behavior: attacks normally in the `2` to `3` second window.
- block pattern: activates block when the player is on a streak greater than `3x` with `70%` probability.
- block fallback behavior: if the block condition is met but block does not activate, Maki does not block and continues attacking normally.

Kander profile:

- fighter type: `Streak`.
- distinct characteristic: attempts to attack with streaks `70%` of the time.
- attack timing pattern: answers between `1` and `2` seconds with `70%` probability.
- fallback attack behavior: attacks normally in the `2` to `3` second window.
- block pattern: activates block when the player is on a streak greater than `3x` with `70%` probability.
- block fallback behavior: if the block condition is met but block does not activate, Kander does not block and continues attacking normally.

Fury profile:

- fighter type: `Avenge`.
- unlock status: first locked Duel CPU opponent.
- unlock cost: `500` coins.
- unlock requirements: beat `Maki`, beat `Kander`, and have enough coins.
- distinct characteristic: revenge gauge is constantly filled and cannot empty.
- limitation: cannot do streak attacks.
- block pattern: successfully blocks all kinds of attacks `80%` of the time.
- block failure pattern: gets hit `20%` of the time.
- vulnerability punish pattern: attempts to take advantage of the player's wrong-answer vulnerability window.
- attack pattern after successful block: attempts to maximize attack damage at attack power `30`.
- critical hit behavior: has a `50%` chance to score a critical hit when attacking at attack power `30`.
- critical hit damage: described as standard revenge-style damage.
- critical hit formula: `attackPower x 3`.
- player-facing critical hit label: `+200% DMG`.
- concrete critical hit example: if the attack bar stops at `30` and Fury scores a critical hit, the damage should be `90`.
- formula note: `+200% DMG` means base attack plus an additional `200%` bonus. For example, attack power `20` becomes `60`, and attack power `30` becomes `90`.
- question difficulty modifier: harder questions appear `60%` of the time for all match rounds when fighting Fury.

Shi-eld profile:

- roster position: fighter 4.
- fighter type: block specialist.
- name note: `Shi-eld` is the fighter name; `Shield` describes the role/readable identity.
- block pattern: blocks the player's attacks `90%` of the time.
- attack trigger: attacks when it scores a successful block.
- hidden vulnerability: will not block attacks given after the `2.5` second mark `90%` of the time.
- end-of-turn preference: would rather take end-of-turn damage than attack `90%` of the time.
- surprise attack behavior: attacks `10%` of the time to surprise the player opponent.

Peasy profile:

- roster position: fighter 5.
- fighter type: expert `Streak`.
- distinct characteristic: constantly uses streaks to damage opponents.
- attack timing pattern: answers between `0` and `1` second with `80%` probability.
- block pattern: successfully blocks the player's attack `50%` of the time.
- main attack pattern:
  - uses streak attacks.
  - blocks the player's attempt to break its streak by answering.
  - unloads another barrage of streaks after blocking the disruption attempt.
- vulnerability punish pattern: attempts to take advantage of the player's wrong-answer vulnerability window.

Skore profile:

- roster position: fighter 6.
- question manipulation: can change the question type, including addition, subtraction, and chained type.
- question type change rule: changes question type randomly after every `3` questions.
- question difficulty modifier: questions given when fighting Skore are always hard.
- revenge behavior: can activate revenge mode after just `1` hit.
- attack baseline: starts at `1.2x` attack.
- health: `200 HP`.
- streak behavior: tries to attack using streaks `70%` of the time.
- revenge-mode behavior: when Skore has revenge mode, Skore tries to maximize it by blocking a player attack and scoring attack power `30`.
- non-revenge answer timing pattern: when Skore does not have revenge mode, Skore answers between `0` and `1.5` seconds with `80%` probability to score streak damage.
- non-revenge fallback behavior: in the remaining `20%`, Skore blocks.
- block special rule: Skore's block has no recovery.
- block special rule: Skore can block as many times as it wants without penalty.
- rule boundary: Skore's no-recovery unlimited block is a Skore-specific CPU behavior and does not change normal player DEFEND cooldown/recovery rules.

The `2P` option should take the player to the VS option page.

The VS option page should allow a player to:

- use quick match.
- enter the game lobby.
- view the leaderboard.

The game lobby should allow a player to:

- start a private room.
- start a public room.
- join available public rooms.
- view in-game matches when viewer capacity is available.

## PvP Rooms / Match Entry

When a player starts a PvP room, the player should choose:

- public room.
- private room.

PvP match entry should support:

- invite online friends through a friend list.
- start a room and wait for other players to join.
- show public rooms in a game room lobby.
- join an existing room.

The room lobby is distinct from the room-ready page:

- the room lobby is for viewing the room list and choosing a room to join.
- the room-ready page is for the two joined players to prepare for match start.

Public rooms:

- are visible in the public lobby.
- can be joined from the public lobby.

Private rooms:

- are invite-only.
- are not visible in the public lobby.
- can be joined only through invitation.
- invited players should receive a direct notification/invite popup.
- the private room invite popup should include accept and decline actions.
- accepting a private room invite should take the invited player directly into the room immediately.
- declining a private room invite should notify the host that the invite was declined.

### Friend Invite Section

On the player side, there should be an invite section.

When the invite section is pressed:

- show a dropdown menu.
- the dropdown shows the player's online friends.
- the player can invite an online friend from that dropdown.

### Friend Requests

Friends can be added from the post-match results page.

The post-match results page should eventually show match stats, grading, and an add friend button.

If a player presses the add friend button:

- a friend request is sent to the other player.
- the other player's screen should show a popup notifying them that a friend request has been sent.
- the receiving player can check their friend list and choose yes or no.

On the sender's friend list:

- the requested friend should appear with status: `waiting for response`.
- if the request is accepted, the friend's online/offline status becomes visible to the sender.
- if the request is declined, the friend status space should show `request declined`.
- the sender can click an `X` box to delete the `request declined` message.

### Post-Match Results

For PvP matches, the post-match results screen should include:

- an `Add Friend` button.
- a `Replay` button.

If a player presses `Replay`:

- that player becomes the replay initiator.
- a `15` second countdown timer should display on the initiator's side.
- the initiator's side should also display `waiting...`.
- the other player's side should show the same replay waiting appearance with `waiting...`.

If the other player also presses `Replay` during the waiting period:

- a `3` second countdown starts.
- after the `3` second countdown, the match starts.

If the `15` second replay waiting timer expires before the other player presses `Replay`:

- the `Replay` button should grey out.
- players can no longer replay from that result screen.

The post-match results screen should include a `Back` button that returns the player to the PvP lobby.

The winning player's post-match results screen should display:

- `WIN!`

The performance section should show:

- accuracy score as a percentage.
  - accuracy is calculated from correct submitted answers out of submitted answer attempts.
  - no-answer, timeout, stunned lockout, and DEFEND-only situations do not count against accuracy unless the player submits an answer.
  - `MISSED!` counts against accuracy because it is caused by a wrong submitted answer.
- player type.
  - `Streaker`: mainly wins through streak attacks.
  - `Strategist`: mainly uses attacks after successful blocks.
  - `Avenger`: uses the revenge gauge frequently.
  - `Vanilla`: mainly uses normal attacks and blocks, without sustained streak/revenge/DEFEND-counter identity.
  - `Wrongster`: gets more than 70% of questions wrong but still wins.
- longest streak.
- other meaningful persistent stats remain unresolved.

The reward section should show:

- `Reward`
- reward breakdown.

Coin rewards are calculated from correct answers and match outcome.

The number of correct questions used in reward calculation should be the total number of questions answered correctly across the whole match, including all rounds in that match.

PvP reward formula:

- winner coins = `(number of correct questions x 10) + 50`
- loser coins = `(number of correct questions x 10) + 25`

PvC reward formula:

- winner coins = `(number of correct questions x 5) + 10`
- loser coins = `(number of correct questions x 5)`

PvC losers receive no outcome bonus.

Voided matches should show:

- `Reward: 0 coins`

This visible zero reward is intended to deter disconnections and quits that void a match.

Voided match result screens should include a quote randomly selected from the voided-match quote pool.

Explicit quits and dropped connections should use the same voided-match quote pool.

Initial voided-match quote examples:

- `Play with a stable connection.`
- `Finish what you started.`
- `Try not to ....D/C`

Reward breakdown format:

- `Reward: <number_of_correct_questions> (tick) questions x 10 coins + <outcome_bonus> coins (<outcome_bonus_label>) = <total_reward> coins`

Example winner reward display:

- `Reward: 13 (tick) questions x 10 coins + 50 coins (win bonus) = 180 coins`

Outcome bonus:

- PvP winner: `50 coins`
- PvP loser: `25 coins`
- PvC winner: `10 coins`
- PvC loser: `0 coins`

For loser reward display, the loser outcome bonus should be labeled `match bonus`.

The losing player's post-match results screen should show the same performance categories:

- accuracy score.
- player type.
- longest streak.
- `Reward`.
- reward breakdown.

The losing player's reward should be lower than the winning player's reward because the loser receives a smaller outcome bonus.

The losing player's post-match screen should include generic encouraging improvement tips.

The losing player's improvement tip should be randomly selected from the tip pool.

Initial result-tip examples:

- `Sometimes, strategy trumps speed!`
- `Timing! Timing! Timing!`
- `Defend can only be used once every two turns. Defend wisely.`
- `Round off to the nearest 10 to speed up calculation.`
- `Watch out when you are on a roll!`
- `Disrupt your opponent's streaks with Defend.`
- `Don't rely on calculators to win.`

The winning player's post-match screen should also include a challenge quote.

The winning player's challenge quote should be randomly selected from the challenge quote pool.

Initial winner challenge quote examples:

- `How long can you maintain this win streak?`
- `Hit a 100 win streak and get a surprise!`
- `You won a friend. Now challenge your parents!`
- `Winners don't use calculators. They ARE calculators!`
- `Bet you can't win a duel in 10 seconds!`

### Version 1 Shop

The Version 1 shop should be introduced after the player defeats the second CPU tutorial opponent.

The first available shop item should be:

- `Change Duelist Name`

`Change Duelist Name` is a repeatable purchase.

Name-change cost:

- first name change: `100` coins.
- subsequent name changes: `1000` coins each.

The other Version 1 shop items should be Duel CPU opponent unlocks:

- unlock CPU opponent 3: `Fury`
- unlock CPU opponent 4: `Shi-eld`
- unlock CPU opponent 5: `Peasy`
- unlock CPU opponent 6: `Skore`

CPU opponent unlocks are one-time purchases.

Once a CPU opponent is unlocked, that unlock should persist.

Example:

```text
Fury unlocked == true
```

The Version 1 shop should not include gameplay-affecting match modifiers.

Match modifiers are held for future development and should not be part of the current shop offering.

The current shop intent is:

- reward players with coins.
- encourage continued play.
- give players a first identity purchase after onboarding.
- support Duel CPU progression through coin-gated opponent unlocks.
- preserve normal PvP as skill-first rather than shop-advantage driven.

### Identity Purchases

Every player starts with a default generated name:

- `unknown_duelist_<number_id>`

Name change is a locked identity feature.

Every name change requires coins.

Players earn coins to change their name to a chosen name.

There is no limit on the number of name changes if the player can pay the required coin cost.

The player's first name-change opportunity should come from rewards from the first two tutorial matches.

The first two tutorial matches should guarantee enough coins for the player's first name change.

After the first two tutorial matches, the player can be prompted to unlock and change their name.

Multiple players may use the same display name.

The hidden number ID remains unique.

Version 1 avatars should use simple unlockable icon badges.

Static profile pictures and animated mascots should be earned identity items.

Static profile pictures and animated mascots can be unlocked through coins.

Icon badges, static profile pictures, animated mascots, and other identity purchases are future shop expansion candidates unless explicitly added to the current Version 1 shop.

Avatar identity should be friendly to all players.

Avatar form should consider:

- Excalibur engine resource constraints.
- cute theme animations.
- friendly visual tone.
- lightweight implementation for Version 1.

Other identity-building features may be sold later, but remain unresolved.

### Internal Engagement Analytics

Future modifier governance is deferred until the MVP is stable.

To support later sense-making, the game should capture internal player engagement data.

This data is for the game team, not for player-facing profile display.

Engagement analytics should help answer:

- which modes players actually play.
- where players stop or repeat.
- which mechanics create engagement.
- which CPU opponents create friction or motivation.
- whether players return after tutorial, PvC, PvP, shop, and results screens.
- whether social features such as rooms, friends, replays, and spectatorship increase continued play.

Recommended engagement matrix:

| Dimension | Recommended Signals | Why |
| --- | --- | --- |
| Session and retention | first played, last played, session count, total play time, days active. | Shows whether players return and how long they stay. |
| Mode engagement | tutorial starts/completions, Duel CPU matches, PvP matches, Quick Match use, lobby visits, spectator views. | Shows which game paths carry attention. |
| Match completion | matches started, matches completed, voided matches, confirmed quits, disconnects, replay requests. | Shows whether players finish matches or drop out. |
| Combat mechanics | attack count, DEFEND uses, successful DEFENDs, revenge activations, revenge attacks used, longest streak reached, wrong answers. | Shows which mechanics players actually use and understand. |
| Learning friction | tutorial retries, CPU opponent attempts/wins, repeated losses to a CPU opponent, high wrong-answer clusters. | Shows where onboarding or CPU tuning may need adjustment. |
| Economy engagement | shop unlock, shop visits, name changes purchased, CPU unlock purchases, coin spends, coin balance changes. | Shows whether coins create motivation after onboarding. |
| Social engagement | friend requests sent/accepted/declined, rooms created, rooms joined, private invites sent/accepted, rematches accepted. | Shows whether multiplayer/social loops are working. |
| Navigation friction | page exits, back-button exits, finding-match cancellations, failed joins, max-room/max-viewer messages. | Shows where the flow confuses or blocks players. |

Recommended persistence approach:

- store raw engagement events as player-linked activity records.
- store a summarized internal engagement profile for quick review.
- keep engagement analytics separate from public player profile views.
- avoid exposing internal engagement scores to players unless a future feature explicitly requires it.

Recommended activity event examples:

- `tutorial_started`
- `tutorial_completed`
- `cpu_match_started`
- `cpu_match_completed`
- `pvp_match_started`
- `pvp_match_completed`
- `shop_opened`
- `item_purchased`
- `room_created`
- `room_joined`
- `quick_match_started`
- `quick_match_cancelled`
- `spectator_view_started`
- `rematch_requested`
- `rematch_accepted`
- `match_quit_pressed`
- `match_disconnected`

Engagement analytics should be used to inform future tuning decisions such as:

- player-type threshold tuning.
- CPU opponent difficulty tuning.
- tutorial pacing.
- question difficulty probabilities.
- shop expansion priorities.
- whether future modifier governance is worth reopening.

### Version 1 Team Integration Context

The game MVP is owned by the game developer and lives inside the game tab.

Other teammates are responsible for surrounding application areas.

Current team boundary:

- one teammate is responsible for the starting web page and site-level sections such as About.
- the game is one section/tab within that wider site.
- one teammate is responsible for webhooks.
- one teammate is responsible for database work.

The game MVP should expose clear integration needs to teammates rather than asking teammates to build the game itself.

### Realtime Server Handoff

`docs/game/handoff/GAME_REALTIME_SERVER_HANDOFF.md` is the current teammate-facing handoff artifact for realtime multiplayer server work.

It maps the clarified game requirements to the existing `apps/server` area.

The realtime server handoff covers:

- PvP room coordination.
- Quick Match allocation and locking.
- ready state and countdown synchronization.
- PvP match authority.
- spectator admission and read-only sync.
- quit and disconnect accountability.
- capacity protection.
- persistence touchpoints.
- socket event sketches.
- webhook boundaries.

The realtime server handoff does not replace:

- `docs/game/handoff/GAME_DATABASE_HANDOFF.md` for database schema and persistence design.
- the TypeScript domain rules for combat logic.
- Excalibur implementation decisions for rendering and animation.

### MVP Readiness Checklist

`docs/game/GAME_MVP_READINESS_CHECKLIST.md` summarizes whether the current game ground truth is ready for implementation and teammate handoff.

It identifies:

- MVP-ready areas.
- teammate handoff artifacts.
- intentionally deferred issues.
- implementation cautions.
- the recommended next implementation-planning artifact.

The checklist does not replace the constitution or handoff documents. It is an orientation document for deciding whether to move from clarification into build planning.

Needed handoff areas include:

- what the game tab needs from the web/navigation layer.
- what game events may need webhook support.
- what player, match, economy, identity, and stats data the database must store.
- what outputs from the game should be visible elsewhere in the web app.

### Clarification To Implementation Order

Before integration contracts are created, the game should continue clarifying unresolved game design and gameplay rules.

The intended workflow is:

1. establish shared understanding in markdown.
2. capture ground truth in the game markdown files.
3. translate stabilized ground truth into TypeScript logic.
4. move/adapt that logic into Excalibur.
5. create teammate-facing integration contracts after the game ground truth is stable enough.

The markdown files are the current source of shared semantic truth.

Integration planning should not outrun unresolved game logic clarification.

Candidate shop cards include:

- `Extra 50 HP`: gives the player extra HP.
- `VENGEFUL`: keeps the player in revenge state, but the player starts with 70% HP.
- `Auto Guard`: automatically defends an incoming attack 3 times per round when the player does not block.
- `BASHFUL`: keeps attack multiplier constantly at 1.2x attack damage, but disables streak.
  - because streak is disabled, the opponent's revenge gauge is not triggered unless the opponent uses a `VENGEFUL` card.
- `SKIP`: unlocks a `Skip` button in match, allowing the player to skip a question.

Shop modifiers are deferred because including them at this stage may make development messy.

Open questions include:

- whether explicit modifier-enabled matches require both-player consent.
- how modifier use affects fairness, ranking, records, and rewards.
- whether modifiers are consumed per match or reusable.
- whether modifiers should appear on the post-match results screen.
- what other identity-building features can be sold.

### Room Ready / Start Flow

When a player is detected to join a PvP room:

- both players are given a ready button.
- each player must press ready.
- only when both players have pressed ready does the room advance.
- after both players are ready, a 3-second countdown timer appears above the ready button on both players' screens.
- after the 3-second countdown completes, the match page loads.

If one player leaves the PvP room before both players press ready:

- the room should remain open in the lobby.
- another player should be able to join the room.

If one player leaves after both players press ready and the 3-second countdown has started:

- cancel the countdown.
- return the remaining player to the room.

If the room creator/host leaves before the match starts:

- room ownership transfers to the remaining player.
- the public room stays alive.

### Pre-Match Host Controls

Before the match starts, the room creator/host can:

- kick/remove the other player from the room.
- close/delete the room.
- rename the room.
- use invite-only controls.

These pre-match host controls should appear inside a host-options menu.

If the host closes the room while another player is inside but not ready:

- return the other player to the lobby.
- show a message saying `Host has closed the room.`

Match start still requires both players to press ready.

If a player disconnects during a PvP match:

- return all players to the game lobby.
- show a message saying `A player D/C the game.`

Exact post-match grading, persistent stat set, and shop modifier governance remain unresolved.

---

## Match

- A match consists of at least 2 fight rounds.
- The first player to win 2 fight rounds wins the match.
- If the 3rd fight round ends in a tie, a Final round is initiated.
- If the Final round also ends in a tie, both players lose.

---

## Fight Round

Each fight round:

- lasts 60 seconds.
- starts both players at 200 HP.
- consists of multiple question rounds.
- ends when the 60-second fight-round timer expires or a terminal HP condition is reached.

### Fight-Round Winner

At the end of a fight round:

- Higher HP wins the fight round.
- Equal HP creates a fight-round tie.
- Equal HP is checked at fight-round end, not continuously during the fight round.

### Terminal HP

If one player's HP reaches 0 or below before the 60-second timer ends:

- the other player wins the fight round.

If both players reach 0 or below on the same resolution:

- the fight round is a tie.

---

## Question Round

Question rounds are the repeated combat loop inside a fight round.

```text
Question -> Shared Attack Timer -> Player Action(s) -> Resolution -> HP Update -> Continue
```

Each question round should resolve with HP loss for at least one player, except when both players answer at the same time and trigger `Additional DMG`.

---

# Question Generation

Question generation affects gameplay feel, pressure, comeback chances, and variety.

## Fight-Round Spinner

At the beginning of each 60-second fight round, a spinner selects the question mode for that fight round.

The spinner is used again for the next fight round or match segment.

Spinner modes:

- addition.
- subtraction.
- mixed addition/subtraction.
- `?` mode.

`?` mode is PvP-only.

---

## Easy-Tier Probability

Questions can be generated as normal or easy tier.

Easy-tier selection is probability-weighted rather than mandatory.

| Condition | Easy-Tier Chance |
| --- | --- |
| Baseline | 40% |
| Player has active revenge | 60% |
| Player is one hit away from revenge | 60% |
| Player HP is half or less than opponent HP | 65% |

When multiple easy-tier probability conditions apply, use the highest applicable easy-tier probability.

---

## Addition Mode

Addition mode uses two-number addition prompts.

| Tier | Operand Range |
| --- | --- |
| Easy | 1 to 15 |
| Normal | 1 to 30 |

---

## Subtraction Mode

Subtraction mode uses two-number subtraction prompts.

| Tier | Operand Range | Negative Answers |
| --- | --- | --- |
| Easy | 1 to 40 | allowed |
| Normal | 1 to 100 | allowed |

Operands do not need to be ordered to prevent negative answers.

---

## Mixed Addition/Subtraction Mode

Mixed mode uses three-term chained arithmetic prompts.

Mixed-mode numbers use the 1 to 50 range.

Mixed-mode prompts may start with a negative number.

The two operation signs are randomly chosen from `+` and `-`.

| Tier | Prompt Shape | Example |
| --- | --- | --- |
| Easy | one 2-digit number and two 1-digit numbers | `17 + 8 + 5`, `-6 + 28 - 3` |
| Difficult | two 2-digit numbers and one 1-digit number | `22 + 9 + 18`, `31 - 5 + 11` |

---

## `?` Mode

`?` mode is PvP-only.

It adds variety through a mix of arithmetic and arcade-like reaction tasks.

### Content Distribution

| Content Type | Total `?` Mode Chance |
| --- | --- |
| Reaction-based number sequence | 30% |
| Mixed addition/subtraction | 42% |
| Addition of two 3-digit numbers | 28% |

The 42% / 28% split comes from the remaining 70% of `?` mode content:

- 60% mixed addition/subtraction.
- 40% addition of two 3-digit numbers.

### Reaction-Based Number Sequence

Reaction-based number sequence tasks:

- appear randomly.
- use a random sequence length from 4 to 9 numbers.
- award the attack to the player who completes the input sequence first.

### Two 3-Digit Addition

Two 3-digit addition prompts use:

```text
100 to 999 + 100 to 999
```

---

# Player State

Each player has:

```ts
type PlayerStatus =
  | "NORMAL"
  | "DEFEND"
  | "STUNNED"
  | "SHOCK"
  | "MISSED"
  | "ADDITIONAL_DMG";

type Player = {
  hp: number;                 // starts at 200 per fight round
  streak: number;             // starts at 0
  hasRevenge: boolean;        // starts false
  status: PlayerStatus;
  defendCooldown: number;     // question rounds remaining before DEFEND is available
  canBlockThisQuestion: boolean;
};
```

## Player Status Display

Each player should have:

- an attack status bar.
- a DEFEND button that also serves as DEFEND status space.

### Attack Status Bar

The attack status bar displays attack buffs and attack-state information, including:

- revenge gauge state.
- active revenge `+100% DMG`.
- streak multiplier.

### DEFEND Status Space

The DEFEND button also communicates defensive and error state.

If DEFEND is available:

- the button should appear bold and bright.

If DEFEND is unavailable:

- the button should appear greyed out or faint.

If DEFEND succeeds:

- show `SUCCESS` in the DEFEND status space.

If the player inputs a wrong answer:

- show `Miss!` in the DEFEND/status space.

---

# Shared Attack Power Bar

---

## Power Bar

- There is one shared attack power bar.
- Both players use the same bar.
- Range: 1 to 30 attack power.
- Duration: 5 seconds.
- The indicator increases linearly from 1 to 30 over the 5-second attack timer.

## Capture Rule

```text
Correct Enter press -> capture current shared bar value -> attackPower
```

The attack goes to whoever answers first, unless the second valid answer occurs inside the same-time answer window.

## Reset

The shared power bar resets at the start of each question round.

---

# Player Actions

---

## ATTACK / Answer

- Player submits an answer.
- If correct, the player attempts to claim the current shared attack power.
- If incorrect, the player enters `MISSED`.

---

## DEFEND

DEFEND is a tactical defensive action.

DEFEND can:

- predict and block an incoming revenge attack.
- disrupt an incoming streak barrage.
- act as a turn-level defensive resource.

### DEFEND Duration

- DEFEND lasts 1 second.
- During the 1-second DEFEND window, the player cannot answer or perform other actions.
- During the 1-second DEFEND window, the player can only resolve DEFEND against an incoming attack.

### DEFEND Availability

- DEFEND can only be used once every 2 question rounds.
- If a player uses DEFEND this question round, they cannot use DEFEND in the next question round.
- DEFEND becomes available again on the following question round.
- If a player uses DEFEND but does not successfully block an incoming attack, they cannot block again for that question round.

### DEFEND Cost

Pressing DEFEND breaks the user's own streak.

### Successful DEFEND

If DEFEND successfully blocks an incoming attack:

- incoming attack is nullified.
- attacking opponent is stunned for 1.5 seconds.
- stunned opponent cannot answer during the stun.
- attacker's streak resets.
- blocker gains a short initiative advantage to answer and build streak pressure.

---

# Damage System

---

## Attack Power

Attack power is the shared bar value captured by the first correct answer.

```text
attackPower = current shared power bar value
```

Range:

```text
1 <= attackPower <= 30
```

---

## Streak Multiplier

Streak multipliers reward consecutive successful attacks.

| Consecutive Hit | Multiplier |
| --- | --- |
| 1 | x1.0 |
| 2 | x1.1 |
| 3 | x1.2 |
| 4 | x1.3 |
| 5+ | x1.4 |

The streak multiplier caps at x1.4.

### Streak Reset Triggers

A player's streak can reset when:

- the player's attack is successfully blocked.
- the player presses DEFEND.
- the player gives a wrong answer.
- the opponent lands an attack.

---

## Revenge

Revenge is a comeback mechanic for the player receiving a streak.

### Activation

A player's revenge gauge activates after they receive a x1.4 attack hit from an opponent.

This means the opponent has hit them 5 consecutive times.

### Effect

Conceptually:

```text
revengeDamage = attackPower x 2
```

Visually:

```text
+100% DMG
```

Revenge does not stack with a stronger streak multiplier.

### Streak Position After Revenge

A revenge attack serves as the beginning attack of a streak sequence.

If the revenge attacker lands a follow-up consecutive attack, that next attack uses the x1.1 streak multiplier.

### Removal

An activated revenge gauge resets when:

- the player with active revenge answers correctly and performs the revenge attack.
- the revenge attack is blocked.

---

## Additional DMG

`Additional DMG` is created by same-time answers.

### Same-Time Answer Window

If the second valid answer occurs within 0.15 seconds / 150ms of the first valid answer, both answers count as same-time.

Example:

```text
Player A answers at 1.00s.
Player B answers from 1.00s through 1.15s.
Result: same-time answer.
```

If the second valid answer occurs after the 150ms window, the first valid answer wins the attack.

### Effect

When same-time answers occur:

- no immediate HP damage is applied in that question round.
- the current shared attack damage becomes one shared `Additional DMG` value.
- `Additional DMG` is added to the next question round and resolved in that round.
- status should show `Additional DMG`.
- streak and revenge buffs do not reset.
- streak and revenge buffs apply to the stacked damage when resolved.

---

# Question Round Resolution

---

## Step 1 - No-Action Timeout

If both players take no action by the end of the 5-second attack timer:

- both players lose 10 HP.
- both players show `SHOCK!`.
- question round ends.

---

## Step 2 - Answer Timing

If at least one player submits a correct answer:

- record the first valid answer timestamp.
- wait for the 150ms same-time window.
- if the opponent submits a valid answer inside that window, resolve as `Additional DMG`.
- otherwise, the first valid answer wins the attack.

---

## Step 3 - Same-Time Answer Resolution

If both valid answers occur within the 150ms same-time window:

- no immediate HP damage is applied.
- create one shared `Additional DMG` value from the current shared attack value.
- preserve streaks.
- preserve revenge gauges.
- end the question round.

---

## Step 4 - DEFEND Resolution

If a player uses DEFEND against an incoming attack and the block succeeds:

- nullify the attack.
- stun the attacker for 1.5 seconds.
- reset the attacker's streak.
- consume the defender's DEFEND availability for the next question round.
- end the question round.

If a player uses DEFEND but does not block an incoming attack:

- reset that player's streak.
- consume DEFEND availability.
- that player cannot block again for the current question round.

---

## Step 5 - Wrong Answer Resolution

If a player gives a wrong answer:

- reset all benefit buffs for that player.
- reset that player's streak.
- apply `MISSED!` to that player's status bar.
- that player enters a 1-second vulnerability window.
- during that 1-second window, that player cannot answer, defend, or perform any action.

Incoming opponent damage during `MISSED!` uses the normal attack formula.

`MISSED!` does not add bonus incoming damage.

---

## Step 6 - Damage Application

For a normal attack:

```text
damage = attackPower x streakMultiplier
```

For a revenge attack:

```text
damage = attackPower x 2
```

For stacked `Additional DMG`:

```text
damage = (attackPower + Additional DMG) x applicable modifiers
```

Apply:

- defender HP -= damage.

---

## Step 7 - State Update

After a successful attack:

- attacker streak advances according to the streak table.
- defender streak resets.
- if defender receives a x1.4 hit, defender gains revenge.
- if attacker used revenge, attacker revenge resets.

After a blocked revenge attack:

- revenge resets.

---

## Step 8 - Next Question Round

If the fight round has not ended:

- reset question-round input.
- reset shared power bar.
- update DEFEND availability.
- start next question immediately.

---

# Edge Cases

---

## Simultaneous DEFEND

If both players use DEFEND:

- no damage is applied.
- both players break their own streaks.
- both consume DEFEND availability.
- continue to the next question round if the fight round has not ended.

---

## Final Round Tie

If the Final round ends with both players at equal HP:

- both players lose the match.

---

# UI And Page Flow Map

---

## Page Flow Purpose

This section consolidates the screen-to-screen flow for the Game tab.

The page flow should help players move from mode selection into tutorial, CPU duels, PvP rooms, active matches, post-match results, and return paths without changing the combat rules.

All pages should provide a `Back` action where a previous-page return is valid.

---

## Game Tab Entry

Opening the `Game` tab should present two primary choices:

- `1P`
- `2P`

`1P` routes to solo/tutorial content.

`2P` routes to multiplayer VS content.

---

## 1P Flow

Choosing `1P` opens a separate `1P Menu` page.

The `1P Menu` contains:

- `Tutorial`
- `Duel CPU`
- `Shop`
- `Stats`

### Tutorial Path

`Tutorial` starts the onboarding sequence.

Tutorial progression:

1. CPU 1 teaches streak, attack power, `SHOCK!`, revenge activation, and revenge attack payoff.
2. Clearing CPU 1 immediately moves the player to CPU 2.
3. CPU 2 teaches DEFEND, DEFEND cooldown, streak disruption, and revenge-to-advantage conversion.

After scripted sequences are passed, replay attempts may skip scripts and start from the simplified practice fights.

The fight menu should still provide an option to replay scripted tutorials.

### Duel CPU Path

`Duel CPU` opens a CPU character selection screen.

If a selected CPU opponent is available:

- load the CPU fight screen.

If a selected CPU opponent is locked:

- show the criteria needed to unlock that fighter.

Initial available CPU opponents:

- Maki
- Kander

Locked CPU progression:

| Opponent | Unlock Cost | Required Prior Clear |
| --- | ---: | --- |
| Fury | 500 coins | Beat Maki and Kander |
| Shi-eld | 1000 coins | Beat Fury |
| Peasy | 1500 coins | Beat Shi-eld |
| Skore | 3000 coins | Beat Peasy |

### Shop Path

For Version 1, `Shop` appears only in the `1P Menu`.

The shop should unlock after the player defeats CPU 2.

Before CPU 2 is defeated, the `Shop` option should remain hidden so the shop is first introduced as a post-onboarding progression feature.

Recommended shop screen behavior:

- show current coin balance.
- show `Change Duelist Name`.
- show CPU unlock items for `Fury`, `Shi-eld`, `Peasy`, and `Skore`.
- show locked/unavailable CPU unlock criteria directly on each CPU item.
- show owned CPU unlocks as already unlocked and not purchasable again.
- show name change as repeatable.
- show name-change pricing as `100` coins for the first change and `1000` coins for later changes.
- require purchase confirmation before spending coins.
- show an insufficient-coins message when the player cannot afford an item.
- after a successful purchase, update coin balance and the relevant owned/unlocked state immediately.
- include a `Back` button returning to the `1P Menu`.

Recommended name-change behavior:

- present a text input for the desired duelist name.
- show the current cost before confirmation.
- allow duplicate display names.
- preserve the hidden unique number ID behind the display name.
- after confirmation, update the visible display name and record the coin spend.

### Stats Path

`Stats` opens the player stats page.

The Stats page should show player progression and records such as:

- number of wins.
- longest streak, including match, opponent, and date.
- total accuracy score.
- number of matches played.
- number of matches D/C.
- coins earned or coin progression summary.
- CPU opponent defeat counts, such as number of times Maki was defeated.

---

## 2P Flow

Choosing `2P` opens a separate VS option page.

The VS option page contains:

- `Quick Match`
- `Enter Game Lobby`
- `Leaderboard`

### Quick Match Path

`Quick Match` opens a `Finding a match...` page.

While this page is active:

- the system searches for an available public room.
- the system should prefer the available room that was created earliest.
- the player may press `Back` to cancel matchmaking and return to the previous page.

Quick Match must not confirm a room until that room space is allocated to the waiting player.

If another player joins the inspected room first:

- Quick Match should treat that room as unavailable.
- Quick Match should continue searching.

Each room should only be inspected by one Quick Match process at a time.

If no available rooms are found:

- show `No available rooms found.`
- ask whether the player wants to start a VS room.
- present `Private Match` and `Public Match` options.

### Enter Game Lobby Path

`Enter Game Lobby` opens the room lobby.

The room lobby shows public rooms.

If no rooms are open:

- show `No rooms open at the moment.`

Public room rows should show:

- room name.
- host/player name.
- player count, such as `1/2`.
- `Join` action.

The lobby may host up to `100` rooms for MVP.

If the lobby has `100` rooms:

- show a message that the lobby has the maximum number of rooms and the player should come back later.

MVP should not impose a fixed maximum number of connected lobby players.

Idle lobby users should be removed after `10` minutes of inactivity.

### Public And Private Room Creation

Public rooms:

- are visible in the public lobby.
- can be joined by available players.
- can be selected by Quick Match.

Private rooms:

- are hidden from the public lobby.
- are joined through direct invite.
- allow the room creator to invite online friends.

Private invite notifications should include:

- direct notification to the invited friend.
- `Accept` action.
- `Decline` action.

### Leaderboard Path

`Leaderboard` opens the leaderboard page from the VS option page.

The leaderboard page should follow the MVP leaderboard rules in the Stats System section.

The leaderboard should include a `Back` button returning to the VS option page.

---

## Room Ready Page

Joining or creating a room opens a separate room-ready page.

The room-ready page should display:

- `Player ___ VS Player ___` when two players are present.
- `Player ___ VS Waiting...` when only the room creator is present.
- the ready button in the middle.

If only one player is present:

- the ready button remains visible but disabled.

When both players press ready:

- show a `3` second countdown above the ready button.
- after the countdown, load the match page.

If a room remains in waiting state for `2` minutes with no second player:

- auto-close the room.
- notify the creator that the room closed because no player joined.

Host controls should live in a host-options menu.

Host controls include:

- kick/remove the other player from the room.
- close/delete the room.
- rename the room.
- invite controls for private rooms.

If the host closes the room while another player is present:

- return the other player to the lobby.
- show `Host has closed the room.`

If a player leaves during the ready countdown:

- cancel the countdown.
- return the remaining player to the room-ready state.

---

## Match Page

The match page should display the active fight UI.

Core match UI should include:

- player health bars.
- attack status bars.
- DEFEND button/status space.
- shared attack power bar.
- question prompt.
- fight-round timer.
- match/round status.
- quit button.

Tutorial match UI should additionally include:

- task objective.
- task completion indicator, such as an `X` changing to a tick when completed.

### Quit Overlay

Pressing quit should freeze the active match screen.

The quit warning overlay should appear in front of the question so the question is not visible.

For PVC:

- warning message says match stats will be void.

For PvP:

- warning message says match stats will be void and the quit will add to the player's D/C count.
- the opponent sees a message that the other player pressed quit.
- quit presses are logged.
- on the third quit press without actually quitting, warn that pressing quit again will automatically forfeit the game and result in a loss.

The repeated-quit anti-abuse forced forfeit applies only to PvP.

---

## Spectator View

Rooms in `in-game` state may show a `View` option in the lobby.

Spectator view should be:

- live.
- read-only.
- the same full player game UI.

Each match should allow a maximum of `10` viewers.

If a match has reached the viewer cap:

- `View` should be greyed out.
- show a message that the room has the maximum number of viewers and the player should try another room.

If the match ends while a player is trying to view:

- show `Match has ended!`

If a player D/Cs mid-game:

- all players and viewers should return to the game lobby.
- show `A player D/C the game.`

---

## Post-Match Results Page

Completed, voided, and forfeited matches route to a post-match results page when appropriate.

The winner screen should display:

- `WIN!`
- accuracy score.
- player type.
- longest streak.
- `Reward` breakdown.
- random winner challenge quote.

The loser screen should display:

- accuracy score.
- player type.
- longest streak.
- `Reward` breakdown.
- random improvement tip.

Voided matches should display:

- `Reward: 0 coins`.
- random voided-match quote.

PvP result pages should include:

- `Add Friend`.
- `Replay`.
- `Back`.

If a player presses `Replay`:

- show a `15` second countdown on the initiator side with `waiting...`.
- show the same waiting state on the other player's side.
- if the other player also presses replay, show a `3` second countdown before the match starts.
- if the countdown expires, grey out `Replay` and prevent replay from that result screen.

`Back` returns the player to the PvP lobby.

### Add Friend Flow

After a PvP match, pressing `Add Friend` sends a friend request to the other player.

The recipient should see a notification that a friend request was sent.

The recipient can check their friend list and select:

- `Accept`
- `Decline`

The sender's friend list should show:

- request sent.
- waiting for response.
- accepted state if accepted.
- declined message if declined.

If declined, the sender may dismiss the declined message.

---

# Stats System

---

## MVP Player Profile Data

MVP player profile data should include:

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
- friend list.
- pending friend requests.

---

## Match Record Persistence

Match record persistence should use one central match record as the source of truth.

Each completed or voided match should be saved once under a central `match_id`.

Player profiles should store lightweight match references rather than duplicate full match records.

Conceptually:

- central match records contain the full match data.
- each involved player profile stores a reference to the central `match_id`.
- player match history can be built from those references.

### MVP Central Match Record Fields

Identity fields:

- `match_id`
- `match_mode`: `PVP` or `PVC`
- `match_type`: `tutorial`, `duel_cpu`, `public_pvp`, `private_pvp`, or `quick_match`
- `match_status`: `completed`, `voided`, or `forfeited`
- `void_reason`: `connection_dropped`, `quit_confirmed`, or `none`

Participant fields:

- `player_ids`
- `display_names_at_match_time`
- `cpu_opponent_id`, for PVC
- `cpu_opponent_name`, for PVC

Outcome fields:

- `winner_id`
- `loser_id`
- `rounds_played`
- `round_wins_by_player`
- `final_hp_by_player`
- `final_round_score`

Performance fields:

- `correct_answers_by_player`
- `total_questions_by_player`
- `accuracy_by_player`
- `longest_streak_by_player`
- `player_type_by_player`

Reward fields:

- `reward_by_player`
- `reward_breakdown_by_player`
- `coins_awarded_by_player`
- `stats_valid`

Disconnect / quit fields:

- `dc_or_quit_by_player`
- `quit_press_count_by_player`
- `disconnect_event_type`: `connection_dropped`, `quit_confirmed`, or `none`

Timing fields:

- `started_at`
- `ended_at`
- `duration_seconds`

Question logs:

- detailed question logs should persist under the central `match_id`.
- these logs should remain match-scoped, not duplicated into player profiles.
- player profiles may derive summaries from match records, but the full question evidence stays under the match details.

---

## Public Pre-Match Profile Visibility

Before a PvP match, the public pre-match profile should show:

- display name.
- hidden unique number ID as a short tag, such as `#1042`.
- selected badge/avatar.
- total matches played.
- win rate.
- D/C count or D/C rate.
- current win streak, if any.

Before a PvP match, the public pre-match profile should not show:

- coin balance.
- full match history.
- friend list.
- pending friend requests.
- exact total correct answers/questions.
- unlock inventory.
- detailed rewards/economy data.

---

## MVP Friend List Display

Each friend list row should show:

- display name.
- hidden unique number ID as a short tag, such as `#1042`.
- selected badge/avatar.
- online status: `online`, `in match`, or `offline`.
- friend request status where relevant: `pending` or `declined`.

Friend list row actions should depend on state:

- show `Invite` if the friend is online and available.
- show `View` profile if the friend is not inviteable.
- show `Accept` / `Decline` for incoming friend requests.
- show `Cancel Request` or `Dismiss` for pending or declined outgoing requests.

---

## Stats Calculation Rules

Stats should be calculated from match outcomes and question-round outcomes.

Stats observe engine outcomes. Stats should not decide combat outcomes.

### Stats Validity

Completed matches produce valid performance stats.

Voided matches produce:

- `Reward: 0 coins`.
- no valid performance-stat updates.
- valid D/C accountability updates where applicable.

For PvP dropped connections and confirmed quits:

- match performance stats are voided.
- the responsible player's D/C count is updated.
- D/C accountability remains valid even though match performance stats are invalid.

For PvC quits:

- match stats are voided.
- no PvP D/C count is applied.
- incomplete tutorial state must still be remembered if the scripted tutorial was not completed.

For forced PvP forfeits caused by repeated quit-button abuse:

- the offending player receives a valid loss.
- the offending player receives `D/C +1`.
- the offending player receives `Reward: 0 coins`.
- match performance stats are invalid and should not update performance aggregates.
- the non-offending player receives a valid win.
- the non-offending player's reward handling follows the normal winner reward formula unless later implementation discovers an abuse risk.

### Per-Question Capture

Each question round should produce a lightweight log for aggregation and future sensemaking.

Question logs should persist under the central `match_id` as match details.

The required purpose is:

- preserve which question was asked.
- preserve which player submitted the correct answer.
- preserve when the correct answer was submitted.
- preserve who won the question round.
- preserve the winning timing.

These logs support future sensemaking, replay/debugging, stat audits, and possible anti-cheat review.

They should not replace the match-level summary fields. Match-level stats remain the fast summary; question logs are supporting evidence under the match record.

```ts
type MatchQuestionLog = {
  logId: string;
  matchId: string;
  fightRoundNumber: number;
  questionRoundNumber: number;
  questionId: string;
  questionText: string;
  correctAnswer: number | string;
  questionMode: QuestionMode;
  correct_player_ids: string[];
  correct_answer_time_ms_by_player: Record<string, number>;
  question_winner_player_id: string | null;
  winning_time_ms: number | null;
  outcome: "attack_won" | "same_time" | "shock" | "blocked" | "no_winner";
};
```

Optional implementation extensions may include:

```ts
type MatchQuestionLogDetails = MatchQuestionLog & {
  answer_submissions_by_player: Record<string, {
    answerSubmitted: boolean;
    submittedAnswer: number | string | null;
    correct: boolean;
    submittedAtMs: number | null;
  }>;
  attackPower: number;
  damage: number;
  wasBlocked: boolean;
  usedRevenge: boolean;
  streakCountAfterAction: number;
  status_by_player: Record<string, PlayerStatus>;
};
```

### Match-Level Performance Stats

Match-level stats should be written into the central `MatchRecord`.

| Stat | Calculation | Notes |
| --- | --- | --- |
| `correct_answers_by_player` | Count correct answers submitted by each player across the whole match. | Same-time correct answers count for both players. Reaction task success counts as a correct action for the player who completes the sequence first. |
| `total_questions_by_player` | Count submitted answer attempts accepted for accuracy scoring. | Correct and wrong submitted answers count. No-answer, timeout/no-action, stunned lockout, and DEFEND-only situations do not count unless an answer is submitted. Field name may later be refined to `accuracy_attempts_by_player` for precision. |
| `accuracy_by_player` | `correct_answers_by_player / total_questions_by_player * 100` | Display as a percentage. If denominator is `0`, display `0%` or `N/A`; exact UI treatment remains low-risk. |
| `longest_streak_by_player` | Highest consecutive successful attack streak reached by each player in the match. | Uses clarified streak reset rules. Revenge attack begins a streak sequence. |
| `player_type_by_player` | Classify from attack behavior, revenge usage, DEFEND-success attacks, streak length, and wrong-answer rate. | Use the Version 1 MVP thresholds below; tune after playtesting if needed. |
| `reward_by_player` | Use PvP/PvC reward formulas and voided-match rules. | Reward display uses the clarified `Reward:` breakdown format. |
| `stats_valid` | `true` for valid completed matches; `false` for voided matches and forced quit-abuse forfeits. | Consolidated. |

### Accuracy

```text
accuracy = correct_answer_submissions / submitted_answer_attempts
```

Accuracy is based on submitted answer attempts, not every question opportunity or arena pressure moment.

This preserves the distinction between mathematical competence and in-game pressure:

Therefore:

- correct submitted answer = counts in numerator and denominator.
- wrong submitted answer = counts in denominator and triggers `MISSED!`.
- `MISSED!` counts against accuracy because it originates from a wrong submitted answer.
- no answer before resolution = does not count toward accuracy.
- timeout/no-action = does not count toward accuracy, even if it causes in-game damage such as `SHOCK!`.
- stunned lockout with no answer submission = does not count toward accuracy.
- DEFEND-only question round = does not count toward accuracy unless the player also submits an answer that the game accepts.
- slow-but-correct answer = counts as correct if the game state still accepts the answer.
- same-time correct answer = correct for both players.
- reaction sequence success = correct for the player who wins the reaction race.

### Longest Streak

Longest streak is the highest consecutive successful attack streak reached by a player during the match.

Streak reset follows the combat rules:

- successful block by opponent.
- player presses DEFEND.
- wrong answer.
- opponent attacks.

Revenge attack counts as the beginning attack of a streak sequence.

### Player Type Classification

Player type appears on the post-match result screen.

Existing player types:

- `Streaker`: mainly wins through streak attacks.
- `Strategist`: mainly uses attacks after successful blocks.
- `Avenger`: uses the revenge gauge frequently.
- `Vanilla`: mainly uses normal attacks and blocks, without sustained streak/revenge/DEFEND-counter identity.
- `Wrongster`: gets more than 70% of questions wrong but still wins.

Version 1 MVP classification should use priority order.

Priority matters: the first matching type wins.

Version 1 MVP thresholds:

1. `Wrongster` if the player wins and wrong-answer rate is greater than `70%`.
2. `Avenger` if revenge attacks account for the player's largest special damage source, or the player uses revenge attacks at least `3` times in the match.
3. `Strategist` if attacks after successful DEFEND/block outcomes make up at least `35%` of the player's successful attacks.
4. `Streaker` if the player reaches a streak of `4+`, or more than `40%` of successful attacks occur inside streak sequences.
5. `Vanilla` if none of the above apply and the player mostly uses normal attacks/blocks.

Vanilla should not be disqualified by one isolated 3-hit streak.

Repeated 3-hit streak behavior may be treated as Streaker-leaning during playtest tuning, but Version 1 MVP should use the `4+` hard threshold unless the `40%` streak-sequence rule is met.

These thresholds are locked as Version 1 MVP defaults and remain tunable after playtesting.

### Reward Stats

Reward calculation uses total correct answers across the whole match.

PvP:

- winner reward = `(correct answers x 10) + 50`
- loser reward = `(correct answers x 10) + 25`

PvC:

- winner reward = `(correct answers x 5) + 10`
- loser reward = `(correct answers x 5)`

Voided matches:

- reward = `0 coins`

### Profile-Level Aggregate Stats

Profile-level stats are updated from valid match records and accountability events.

| Profile Stat | Calculation / Source | Notes |
| --- | --- | --- |
| `total_matches_played` | Count valid completed matches. | Forced quit-abuse forfeits count as valid win/loss outcomes but do not count as valid performance-stat matches. |
| `wins` | Count valid completed matches won. | Mutual final-round loss does not count as win. |
| `losses` | Count valid completed matches lost. | Mutual final-round loss handling for profile loss count remains to clarify if needed. |
| `dc_count` | Count PvP `QUIT_CONFIRMED` and `CONNECTION_DROPPED` events assigned to the player. | D/C count remains valid even when match stats are voided. |
| `total_correct_answers` | Sum correct answers from valid match records. | Used for lifetime accuracy. |
| `total_questions_answered` | Sum submitted answer attempts accepted for accuracy scoring from valid match records. | Correct and wrong submitted answers count; no-answer and unable-to-act moments do not. |
| `total_accuracy_score` | `total_correct_answers / total_questions_answered * 100` | Public exact totals remain hidden; percentage may be shown. |
| `longest_streak` | Highest `longest_streak_by_player` across valid match records. | Store linked `match_id`, opponent, and date for Stats page display. |
| `current_win_streak` | Consecutive valid completed wins since last valid loss. | Voided matches should not reset this by default. |
| `coin_balance` | Sum coin ledger gains and spends. | Current spendable currency. |
| lifetime coins earned | Sum positive coin ledger entries. | Can be derived from `coin_ledger`; does not need to duplicate `coin_balance`. |
| CPU opponent defeat counts | Count valid PvC wins by `cpu_opponent_id`. | Supports Stats page entries such as times defeated Maki/Kander/etc. |

### Public Stats

Public pre-match display may show:

- total matches played.
- win rate.
- D/C count or D/C rate.
- current win streak.
- selected badge/avatar.

Public display should not show:

- coin balance.
- exact total correct answers/questions.
- full match history.
- friend list.
- unlock inventory.

Recommended D/C rate formula:

```text
dc_rate = dc_count / (valid_completed_matches + dc_count)
```

This is a recommended display formula, not a locked gameplay rule.

### Leaderboard

Leaderboard is part of the MVP stats surface.

For MVP, leaderboard should rank PvP matches only.

PvC/Duel CPU leaderboard is deferred for future development.

Players should complete at least `10` valid PvP matches before appearing on the leaderboard.

Leaderboard eligibility and leaderboard win-rate calculation are separate:

- `pvp_matches_played` controls leaderboard eligibility.
- `pvp_decisive_matches` controls win-rate denominator.
- a valid completed PvP match may count toward `pvp_matches_played`.
- only PvP matches that produce a win or loss count toward `pvp_decisive_matches`.
- mutual final-round loss may count as a completed PvP match for eligibility, but does not count as a win, loss, or win-rate denominator event.

Leaderboard ranking priority:

1. win rate.
2. accuracy, if win rate is equal.
3. current win streak, if win rate and accuracy are equal.

Leaderboard displayed stats:

- rank.
- player display name / identity.
- win rate.
- accuracy.
- current win streak.

Leaderboard display behavior:

- show the player's own current rank at the top.
- show top `20` players by default.
- provide page down / pagination to show the next `20`.
- support browsing up to rank `100`.
- show rank at the side of each row.
- show the three main stat columns: win rate, accuracy, and win streak.

Leaderboard update behavior:

- leaderboard should update after every valid completed PvP match.
- voided matches should not update leaderboard performance stats.
- D/C accountability may still update player records, but voided match performance should not improve leaderboard placement.
- mutual final-round loss should not change leaderboard win/loss rate.

Leaderboard calculations:

```text
pvp_win_rate = pvp_wins / pvp_decisive_matches * 100
pvp_accuracy = pvp_correct_answers / pvp_questions_answered * 100
```

If a denominator is `0`, the implementation should use a safe fallback such as `0%` or exclude the player until they have enough valid PvP match data. Exact empty-record UI treatment is low-risk and may be finalized during implementation.

The leaderboard should derive from player profile aggregates rather than duplicating full match records.

---

# TypeScript Domain Architecture

---

## Architecture Purpose

The TypeScript domain layer should translate the stabilized markdown ground truth into portable game logic.

The domain layer should be the source of truth for:

- combat rules.
- question generation.
- fight-round lifecycle.
- match lifecycle.
- tutorial script progression.
- CPU decision logic.
- reward calculation.
- stats aggregation.
- internal game events.

Excalibur should display, animate, and collect input. It should not own core combat outcomes.

Database records should persist completed outcomes. They should not be used as the live match state.

---

## In-Game Keyboard Input Boundary

When an in-game match is active, only the following keyboard inputs should be accepted:

- number keys.
- `-` key, for negative answers.
- `Spacebar`, for DEFEND.
- `Enter`, for attack / answer submission.

All other keys should be disabled or ignored during active in-game play.

This input whitelist applies to active match control. It does not necessarily apply to menus, lobby screens, results screens, chat, profile forms, or name-entry flows.

---

## Recommended Domain Shape

Use a neutral two-combatant duel core.

The core should not hard-code `player` versus `cpu`.

Instead, it should model:

- `CombatantA`
- `CombatantB`
- driver type for each combatant.

Driver type means who or what drives a combatant's actions in software.

It does not mean a physical game controller.

The player input device remains keyboard unless later changed.

Driver types may include:

- human local player.
- human remote player.
- CPU opponent.
- tutorial script controller.
- read-only spectator view.

This lets PvP, PVC, tutorial, Duel CPU, and spectator modes reuse the same combat rules.

---

## Recommended Module Boundaries

| Module | Owns | Should Not Own |
| --- | --- | --- |
| `domain/types.ts` | Shared domain types, enums, IDs, discriminated unions. | Rendering, database adapters, socket transport. |
| `domain/matchState.ts` | Match, fight-round, question-round, combatant, status, and clock state shapes. | Animation timing implementation. |
| `domain/combatRules.ts` | Damage, streak, revenge, DEFEND, stun, `MISSED!`, `SHOCK!`, same-time, and `Additional DMG` resolution. | UI status drawing or Excalibur actors. |
| `domain/questionGenerator.ts` | Spinner mode, arithmetic generation, difficulty probability, `?` mode generation. | Visual spinner animation. |
| `domain/matchReducer.ts` | State transitions from domain actions/events. | Direct database writes or socket emits. |
| `domain/tutorialScripts.ts` | CPU 1 and CPU 2 scripted onboarding steps, task objectives, and gates. | Excalibur animation code. |
| `domain/cpuControllers.ts` | CPU decision policies for tutorial and Duel CPU opponents. | Combat formulas owned by `combatRules.ts`. |
| `domain/rewardRules.ts` | PvP/PvC rewards, voided rewards, forced-forfeit reward behavior. | Coin database mutation. |
| `domain/statsRules.ts` | Match-level stats, player-type classification, profile aggregate patches. | Persistent storage. |
| `domain/events.ts` | Internal game event names and domain event payload sketches. | External webhook contracts. |

---

## Runtime State Categories

### Persistent Identity State

Use for stable player identity and profile references.

Examples:

- player ID.
- hidden number ID.
- display name.
- selected badge/avatar.
- unlocks.
- coin balance.

### Match Runtime State

Use only while a match is active.

Examples:

- combatant HP.
- current streak.
- revenge state.
- DEFEND availability.
- current question.
- shared power bar state.
- round timer.
- question-round input timestamps.
- tutorial task state.

### Derived Result State

Compute after match completion, void, or forfeit.

Examples:

- winner/loser.
- accuracy.
- longest streak.
- player type.
- reward breakdown.
- D/C accountability.
- result screen DTO.

### Persistence Output State

Map after runtime resolution.

Examples:

- `MatchRecord`.
- `PlayerProfileUpdate`.
- `CoinLedgerEntry`.
- `PlayerMatchRef`.

---

## Core Runtime Type Sketches

These sketches are implementation references, not final code.

```ts
type MatchMode = "PVP" | "PVC";

type MatchType =
  | "tutorial"
  | "duel_cpu"
  | "public_pvp"
  | "private_pvp"
  | "quick_match";

type CombatantDriverType =
  | "human_local"
  | "human_remote"
  | "cpu"
  | "tutorial_script"
  | "spectator_readonly";
```

```ts
type MatchRuntimeState = {
  matchId: string;
  mode: MatchMode;
  matchType: MatchType;
  combatants: Record<string, CombatantRuntimeState>;
  drivers: Record<string, CombatantDriverType>;
  currentFightRound: FightRoundRuntimeState;
  roundsWonByCombatant: Record<string, number>;
  matchStatus: "active" | "paused" | "completed" | "voided" | "forfeited";
  internalEvents: GameDomainEvent[];
};
```

```ts
type CombatantRuntimeState = {
  combatantId: string;
  displayName: string;
  hp: number;
  maxHp: number;
  streakCount: number;
  revengeActive: boolean;
  defendAvailable: boolean;
  defendUnavailableForTurns: number;
  status: CombatantStatus;
  statusEndsAtMs: number | null;
  quitPressCount: number;
};
```

```ts
type CombatantStatus =
  | "normal"
  | "defending"
  | "stunned"
  | "missed"
  | "shocked";
```

```ts
type FightRoundRuntimeState = {
  roundNumber: number;
  durationMs: 60000;
  startedAtMs: number;
  questionMode: QuestionMode;
  currentQuestionRound: QuestionRoundRuntimeState;
  additionalDamageCarryover: number;
};
```

```ts
type QuestionRoundRuntimeState = {
  questionId: string;
  prompt: string;
  answer: number | string;
  powerBar: PowerBarRuntimeState;
  firstValidAnswer: AnswerAttempt | null;
  answerAttempts: AnswerAttempt[];
  sameTimeWindowMs: 150;
};
```

```ts
type PowerBarRuntimeState = {
  minPower: 1;
  maxPower: 30;
  durationMs: 5000;
  startedAtMs: number;
};
```

```ts
type AnswerAttempt = {
  combatantId: string;
  submittedAtMs: number;
  value: number | string;
  correct: boolean;
};
```

---

## Domain Action Sketch

The reducer should accept domain actions and produce a new state plus internal events.

Example actions:

```ts
type DomainAction =
  | { type: "MATCH_STARTED"; nowMs: number }
  | { type: "FIGHT_ROUND_STARTED"; nowMs: number }
  | { type: "ANSWER_SUBMITTED"; combatantId: string; value: number | string; nowMs: number }
  | { type: "DEFEND_PRESSED"; combatantId: string; nowMs: number }
  | { type: "QUESTION_TIMER_EXPIRED"; nowMs: number }
  | { type: "STATUS_EXPIRED"; combatantId: string; nowMs: number }
  | { type: "QUIT_PRESSED"; combatantId: string; nowMs: number }
  | { type: "QUIT_CONFIRMED"; combatantId: string; nowMs: number }
  | { type: "CONNECTION_DROPPED"; combatantId: string; nowMs: number };
```

Reducer output:

```ts
type DomainStepResult = {
  state: MatchRuntimeState;
  events: GameDomainEvent[];
};
```

---

## Excalibur Boundary

Excalibur should:

- render health bars, attack status bars, DEFEND button state, shared power bar, questions, timers, overlays, and task objectives.
- collect keyboard/button input.
- animate state changes emitted by the domain layer.
- display spectator read-only state.

Excalibur should not:

- calculate final damage independently.
- decide whether a DEFEND succeeds independently.
- decide match winner independently.
- update profile stats directly.
- award coins directly.

Visual animation may lag or dramatize state changes, but the TypeScript domain state remains the source of truth.

---

## Excalibur Mapping Notes

These notes come from a first-pass review of Excalibur documentation.

They are implementation guidance only. They do not change gameplay rules.

### Excalibur Source References

| Excalibur Area | Documentation URL | Relevant Use |
| --- | --- | --- |
| Welcome / overview | `https://excaliburjs.com/docs/` | Excalibur is a TypeScript 2D web game engine. |
| Quick Start | `https://excaliburjs.com/docs/quick-start/` | Confirms the `Engine`, `Scene`, `Actor` organization model. |
| Engine | `https://excaliburjs.com/docs/engine/` | Game loop, engine configuration, scene registration, scene switching. |
| Scenes | `https://excaliburjs.com/docs/scenes/` | Page/state composition, scene lifecycle, activation data, cleanup. |
| Actors | `https://excaliburjs.com/docs/actors/` | Visual game objects, actor lifecycle, update hooks, custom drawing. |
| Keyboard | `https://excaliburjs.com/docs/keyboard/` | Active-match keyboard whitelist and domain action emission. |
| HTML UI | `https://excaliburjs.com/docs/html/` | Menus, lobby, results, overlays, and polished web UI around canvas. |
| Screen Elements | `https://excaliburjs.com/docs/screen-elements/` | HUD-like in-canvas UI when canvas-native placement is better. |
| Actions | `https://excaliburjs.com/docs/actions/` | Scripted visual sequences, tutorials, movement, delays, repeated effects. |
| Timers | `https://excaliburjs.com/docs/timers/` | Scene-synchronized timed callbacks where needed. |
| Animation | `https://excaliburjs.com/docs/animation/` | Sprite/frame animation for attacks, status effects, mascot movement. |
| Display Modes | `https://excaliburjs.com/docs/displaymodes/` | Responsive canvas sizing and fit/fill behavior. |
| Screen / Viewport | `https://excaliburjs.com/docs/screens/` | Coordinate systems, viewport/resolution, HiDPI considerations. |
| Loaders | `https://excaliburjs.com/docs/loaders/` | Asset loading and loading-screen behavior. |

### Game Concept To Excalibur Mapping

| Game Concept | Recommended Excalibur Mapping | Boundary |
| --- | --- | --- |
| Game engine shell | `ex.Engine` | Owns Excalibur loop and canvas; does not own combat rules. |
| Game tab match experience | Excalibur canvas mounted inside the web `Game` tab | Website navigation still owns the outer page. |
| Match screen | `MatchScene extends ex.Scene` | Reads/writes through TypeScript domain actions. |
| Tutorial fights | `TutorialScene` or `MatchScene` with tutorial script driver | Tutorial script gates prompts; shared combat rules still resolve outcomes. |
| Duel CPU fights | `MatchScene` with CPU combatant driver | CPU chooses actions; combat rules resolve outcomes. |
| PvP match view | `MatchScene` driven by server-authoritative player actions | Networking/server authority remains outside Excalibur. |
| Spectator view | `MatchScene` in read-only mode | Same visual state; no input action emission. |
| Combatant visuals | `Actor` subclasses or composed Actors | Actors display combatants but do not store authoritative HP/streak truth. |
| HP bars, power bar, status bars | `ScreenElement`, Actor-based HUD, or HTML overlay | Choose based on polish/performance; domain state remains source. |
| DEFEND/status space | ScreenElement/HTML HUD bound to domain state | Button availability follows domain state. |
| Question text and overlays | HTML UI for polish or ScreenElement for canvas-native flow | Quit overlay must block question visibility. |
| Keyboard input | `engine.input.keyboard` queried in update or keyboard events | Only allowed keys emit domain actions during active matches. |
| Attack power bar motion | visual interpolation from domain `PowerBarRuntimeState` | Domain computes captured power from time; animation must not decide damage. |
| Scripted tutorial beats | Actions, Timers, scene state, and tutorial script state | Visual freezes/prompts gate input but do not create new combat rules. |
| Damage/status animation | Actions, Animation, Actor graphics, or ScreenElement effects | Animation dramatizes domain events. |
| Menus/lobby/results | Prefer HTML/React UI outside canvas unless canvas-native feel is required | Lobby, matchmaking, persistence, and social data remain app/server concerns. |

### Excalibur Mapping Boundaries

| Boundary | Rule |
| --- | --- |
| Domain authority | TypeScript domain reducer decides combat state, damage, status, match outcome, rewards, and stats. |
| Excalibur authority | Excalibur owns scene lifecycle, rendering, animation, keyboard collection, and canvas-specific UI. |
| HTML/app authority | Menus, lobby, room creation, results, profiles, friend list, and non-match forms may remain normal web UI. |
| Server authority | PvP rooms, Quick Match allocation, live spectators, D/C detection, server-validated quit/disconnect accountability, and persistence are outside Excalibur. |
| Animation boundary | Excalibur animation may delay visual feedback, but persisted outcomes should come from domain/server state, not animation completion. |
| Input boundary | Active-match keyboard input should whitelist number keys, `-`, `Spacebar`, and `Enter`; other keys are ignored during combat. |

### First-Pass Implementation Confidence

The current constitution appears sufficient to guide an Excalibur implementation agent at the architecture level.

The agent should still inspect official Excalibur documentation during implementation and preserve citations or rationale for any major mapping decisions.

Exact Excalibur scene names, Actor classes, ScreenElement usage, HTML overlay split, and animation sequencing remain implementation details.

---

## Persistence Boundary

The domain layer should produce final runtime outcomes.

Mapper functions should convert those outcomes into:

- central match records.
- player profile updates.
- coin ledger entries.
- friend or unlock updates where relevant.
- post-match result views.

Runtime match state should not be stored wholesale as the database schema.

---

# Open Clarifications

The following items remain intentionally unresolved:

- Exact player-type thresholds after playtesting.
- Exact TypeScript state-machine names.
- Exact Excalibur animation bindings.
- Additional anti-staleness depth layer beyond the core pressure/streak/revenge/defense loop.

---

# Core Principle

Engine defines rules.

UI displays results.

Stats observe outcomes.

---

# END
