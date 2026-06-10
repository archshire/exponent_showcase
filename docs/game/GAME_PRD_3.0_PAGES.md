# Game PRD 3.0 Pages

This document contains the detailed page inventory split out from the main PRD.

Main PRD: [GAME_PRD_3.0.md](GAME_PRD_3.0.md)

Implementation details: [GAME_PRD_3.0_IMPLEMENTATION.md](GAME_PRD_3.0_IMPLEMENTATION.md)

## Table of Contents

<a id="table-of-contents"></a>

- <a href="#page-navigation">Page Navigation</a>
  - <a href="#page-navigation-contents">Page Navigation Contents</a>
  - <a href="#page-top-level-app-entry">Top-Level App Entry</a>
    - <a href="#page-auth">Auth</a>
      - <a href="#page-signup">Signup</a>
      - <a href="#page-login">Login</a>
    - <a href="#page-home-page">Home Page</a>
      - <a href="#page-1p">1P</a>
        - <a href="#page-1p-tutorial">1P Tutorial</a>
          - <a href="#page-1p-tutorial-cpu-1">CPU 1 Tutorial</a>
          - <a href="#page-1p-tutorial-cpu-1-practice">CPU 1 Practice Fight</a>
          - <a href="#page-1p-tutorial-cpu-2">CPU 2 Tutorial</a>
          - <a href="#page-1p-tutorial-cpu-2-practice">CPU 2 Practice Fight</a>
        - <a href="#page-1p-duel-cpu">1P Duel CPU</a>
          - <a href="#page-cpu-select">CPU Select</a>
            - <a href="#page-cpu-vs">CPU VS</a>
        - <a href="#page-1p-stats">1P Stats</a>
      - <a href="#page-2p">2P</a>
        - <a href="#page-quick-match">Quick Match</a>
          - <a href="#page-quick-match-finding">Finding Match</a>
          - <a href="#page-room-full-message">Room Cap Message</a>
        - <a href="#page-create-private-room">Create Private Room</a>
          - <a href="#page-friend-challenge-select">Friend Challenge Select</a>
          - <a href="#page-private-invite-waiting">Private Invite Waiting</a>
          - <a href="#page-private-invite-notification">Private Invite Notification</a>
        - <a href="#page-challenge-ready">Challenge / Ready</a>
        - <a href="#page-active-match">Active Match</a>
          - <a href="#page-round-prep">Round Prep</a>
          - <a href="#page-pvp-reconnect-overlay">PvP Reconnect Overlay</a>
          - <a href="#page-pvc-exit-confirmation">PvC Exit Confirmation</a>
        - <a href="#page-results">Results</a>
          - <a href="#page-pvp-results">PvP Results</a>
            - <a href="#page-rematch-request">Rematch Request</a>
            - <a href="#page-add-friend-result-action">Add Friend Result Action</a>
          - <a href="#page-pvc-results">PvC Results</a>
      - <a href="#page-community">Community</a>
        - <a href="#page-friends-list">Friends List</a>
        - <a href="#page-add-friend-search">Add Friend / Search</a>
        - <a href="#page-friend-requests">Friend Requests</a>
        - <a href="#page-community-chat">Community Chat</a>
        - <a href="#page-leaderboard">Leaderboard</a>
      - <a href="#page-profile">Profile</a>
      - <a href="#page-privacy-policy">Privacy Policy</a>
      - <a href="#page-terms-of-service">Terms Of Service</a>

<a id="page-navigation"></a>

## Page Navigation

This section is a clickable page-navigation map for the PRD 3.0 MVP app.

Use the links like page navigation. Each link jumps to the corresponding page or screen section further down this document.

User flows describe journeys. Page Navigation describes what the player sees and where each screen can go next.

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-navigation-contents"></a>

### Page Navigation Contents

#### Navigation Contents

- <a href="#page-top-level-app-entry">Top-Level App Entry</a>
  - <a href="#page-auth">Auth</a>
    - <a href="#page-signup">Signup</a>
    - <a href="#page-login">Login</a>
  - <a href="#page-home-page">Home Page</a>
    - <a href="#page-1p">1P</a>
      - <a href="#page-1p-tutorial">1P Tutorial</a>
        - <a href="#page-1p-tutorial-cpu-1">CPU 1 Tutorial</a>
        - <a href="#page-1p-tutorial-cpu-1-practice">CPU 1 Practice Fight</a>
        - <a href="#page-1p-tutorial-cpu-2">CPU 2 Tutorial</a>
        - <a href="#page-1p-tutorial-cpu-2-practice">CPU 2 Practice Fight</a>
      - <a href="#page-1p-duel-cpu">1P Duel CPU</a>
        - <a href="#page-cpu-select">CPU Select</a>
          - <a href="#page-cpu-vs">CPU VS</a>
      - <a href="#page-1p-stats">1P Stats</a>
    - <a href="#page-2p">2P</a>
      - <a href="#page-quick-match">Quick Match</a>
        - <a href="#page-quick-match-finding">Finding Match</a>
        - <a href="#page-room-full-message">Room Cap Message</a>
      - <a href="#page-create-private-room">Create Private Room</a>
        - <a href="#page-friend-challenge-select">Friend Challenge Select</a>
        - <a href="#page-private-invite-waiting">Private Invite Waiting</a>
        - <a href="#page-private-invite-notification">Private Invite Notification</a>
      - <a href="#page-challenge-ready">Challenge / Ready</a>
      - <a href="#page-active-match">Active Match</a>
        - <a href="#page-round-prep">Round Prep</a>
        - <a href="#page-pvp-reconnect-overlay">PvP Reconnect Overlay</a>
        - <a href="#page-pvc-exit-confirmation">PvC Exit Confirmation</a>
      - <a href="#page-results">Results</a>
        - <a href="#page-pvp-results">PvP Results</a>
          - <a href="#page-rematch-request">Rematch Request</a>
          - <a href="#page-add-friend-result-action">Add Friend Result Action</a>
        - <a href="#page-pvc-results">PvC Results</a>
    - <a href="#page-community">Community</a>
      - <a href="#page-friends-list">Friends List</a>
      - <a href="#page-add-friend-search">Add Friend / Search</a>
      - <a href="#page-friend-requests">Friend Requests</a>
      - <a href="#page-community-chat">Community Chat</a>
      - <a href="#page-leaderboard">Leaderboard</a>
    - <a href="#page-profile">Profile</a>
    - <a href="#page-privacy-policy">Privacy Policy</a>
    - <a href="#page-terms-of-service">Terms Of Service</a>

Detailed page testing checkpoints live in [GAME_PRD_3.0_TEST_PLAN.md](GAME_PRD_3.0_TEST_PLAN.md).

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-top-level-app-entry"></a>

### Top-Level App Entry

#### <a href="#page-auth">Auth</a>

Signup and login entry for player accounts.

Visible nested pages:

- <a href="#page-signup">Signup</a>
- <a href="#page-login">Login</a>

#### <a href="#page-home-page">Home Page</a>

Primary post-login navigation.

Visible nested pages:

- <a href="#page-1p">1P</a>
- <a href="#page-2p">2P</a>
- <a href="#page-community">Community</a>
- <a href="#page-profile">Profile</a>
- <a href="#page-privacy-policy">Privacy Policy</a>
- <a href="#page-terms-of-service">Terms Of Service</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-auth"></a>

### Auth

#### Page Purpose

Auth lets the player create an account or sign in.

Immediate pages:

- <a href="#page-signup">Signup</a>
- <a href="#page-login">Login</a>

Next pages:

- successful signup or login -> <a href="#page-home-page">Home Page</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-signup"></a>

### Signup

#### Page Purpose

Signup creates the player's MVP account and initial profile.

Immediate page behavior:

- collect unique player name.
- collect unique email.
- collect password.
- allow optional initial profile picture upload or premade avatar selection.
- create `users` and `player_profiles` records after successful signup.
- show validation errors for duplicate player name, duplicate email, invalid email, weak password, or failed signup.

Next pages:

- signup succeeds -> <a href="#page-home-page">Home Page</a>
- already has account -> <a href="#page-login">Login</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-login"></a>

### Login

#### Page Purpose

Login lets an existing player enter the app.

Immediate page behavior:

- collect login identity.
- collect password.
- show failed-login error when credentials are invalid.
- update latest successful login timestamp after successful login.

Next pages:

- login succeeds -> <a href="#page-home-page">Home Page</a>
- needs account -> <a href="#page-signup">Signup</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-home-page"></a>

### Home Page

#### Page Purpose

Home Page is the primary post-login navigation page.

Immediate pages:

- <a href="#page-1p">1P</a>
- <a href="#page-2p">2P</a>
- <a href="#page-community">Community</a>
- <a href="#page-profile">Profile</a>
- <a href="#page-privacy-policy">Privacy Policy</a>
- <a href="#page-terms-of-service">Terms Of Service</a>

Immediate page behavior:

- show player selected identity image.
- show player name.
- show Aura Points.
- show available primary navigation choices.
- show accessible links to Privacy Policy and Terms Of Service.

Next pages:

- choose 1P -> <a href="#page-1p">1P</a>
- choose 2P -> <a href="#page-2p">2P</a>
- choose Community -> <a href="#page-community">Community</a>
- choose Profile -> <a href="#page-profile">Profile</a>
- choose Privacy Policy -> <a href="#page-privacy-policy">Privacy Policy</a>
- choose Terms Of Service -> <a href="#page-terms-of-service">Terms Of Service</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-1p"></a>

### 1P

#### Page Purpose

1P is the single-player entry point for tutorial, CPU duels, and personal stats.

Immediate pages:

- <a href="#page-1p-tutorial">Tutorial</a>
- <a href="#page-1p-duel-cpu">Duel CPU</a>
- <a href="#page-1p-stats">1P Stats</a>

Immediate page behavior:

- show Tutorial entry if tutorial is incomplete.
- show Duel CPU entry.
- show 1P Stats entry.
- provide Back navigation to <a href="#page-home-page">Home Page</a>.

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-1p-tutorial"></a>

### 1P Tutorial

#### Page Purpose

Tutorial teaches the core combat mechanics through CPU 1 and CPU 2.

Immediate pages:

- <a href="#page-1p-tutorial-cpu-1">CPU 1 Tutorial</a>
- <a href="#page-1p-tutorial-cpu-1-practice">CPU 1 Practice Fight</a>
- <a href="#page-1p-tutorial-cpu-2">CPU 2 Tutorial</a>
- <a href="#page-1p-tutorial-cpu-2-practice">CPU 2 Practice Fight</a>

Next pages:

- start tutorial -> <a href="#page-1p-tutorial-cpu-1">CPU 1 Tutorial</a>
- Back -> <a href="#page-1p">1P</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-1p-tutorial-cpu-1"></a>

### CPU 1 Tutorial

#### Page Purpose

CPU 1 Tutorial teaches attack power, `SHOCK!`, streak pressure, revenge activation, revenge attack, and streak building.

Immediate page behavior:

- guide the player through attack power basics.
- demonstrate `SHOCK!`.
- demonstrate streak pressure.
- demonstrate revenge activation.
- demonstrate revenge attack.
- teach player streak-building.

Next pages:

- tutorial beats complete -> <a href="#page-1p-tutorial-cpu-1-practice">CPU 1 Practice Fight</a>
- Back -> <a href="#page-1p-tutorial">1P Tutorial</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-1p-tutorial-cpu-1-practice"></a>

### CPU 1 Practice Fight

#### Page Purpose

CPU 1 Practice Fight lets the player practice attack power, `SHOCK!`, streaks, and revenge without DEFEND.

Immediate page behavior:

- load simplified PvC fight.
- DEFEND is unavailable.
- use addition-only tutorial questions.
- route to tutorial results when the practice fight ends.

Next pages:

- CPU 1 practice complete -> <a href="#page-1p-tutorial-cpu-2">CPU 2 Tutorial</a>
- quit confirmed or disconnect -> <a href="#page-pvc-results">PvC Results</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-1p-tutorial-cpu-2"></a>

### CPU 2 Tutorial

#### Page Purpose

CPU 2 Tutorial teaches DEFEND.

Immediate page behavior:

- demonstrate DEFEND.
- demonstrate DEFEND cooldown / unavailable state.
- show how DEFEND disrupts streak pressure.
- show how DEFEND turns revenge into advantage.

Next pages:

- tutorial beats complete -> <a href="#page-1p-tutorial-cpu-2-practice">CPU 2 Practice Fight</a>
- Back -> <a href="#page-1p-tutorial">1P Tutorial</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-1p-tutorial-cpu-2-practice"></a>

### CPU 2 Practice Fight

#### Page Purpose

CPU 2 Practice Fight reinforces DEFEND, streak disruption, and revenge advantage.

Immediate page behavior:

- load simplified PvC fight.
- DEFEND is available.
- use addition-only tutorial questions.
- route to tutorial results when the practice fight ends.
- mark tutorial completed after successful tutorial completion.

Next pages:

- tutorial complete -> <a href="#page-1p-duel-cpu">Duel CPU</a>
- quit confirmed or disconnect -> <a href="#page-pvc-results">PvC Results</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-1p-duel-cpu"></a>

### 1P Duel CPU

#### Page Purpose

Duel CPU lets the player choose CPU opponents and progress through CPU unlocks.

Immediate pages:

- <a href="#page-cpu-select">CPU Select</a>
- <a href="#page-cpu-vs">CPU VS</a>
- <a href="#page-active-match">Active Match</a>
- <a href="#page-pvc-results">PvC Results</a>

Next pages:

- choose Duel CPU -> <a href="#page-cpu-select">CPU Select</a>
- Back -> <a href="#page-1p">1P</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-cpu-select"></a>

### CPU Select

#### Page Purpose

CPU Select lets the player inspect and choose Duel CPU opponents.

Immediate page behavior:

- show Max and Min as available after tutorial.
- show Fury, Shi-eld, Peasy, and Skore locked until unlock criteria are met.
- show each CPU's visual identity.
- show each CPU's unlock state.
- show CPU win count where available.

Next pages:

- select unlocked CPU -> <a href="#page-cpu-vs">CPU VS</a>
- select locked CPU -> <a href="#page-cpu-vs">CPU VS</a>
- Back -> <a href="#page-1p-duel-cpu">Duel CPU</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-cpu-vs"></a>

### CPU VS

#### Page Purpose

CPU VS previews the selected CPU opponent and explains unlock/progression state.

Immediate page behavior:

- show player selected identity image and selected CPU identity.
- if CPU is unlocked, show Start Match.
- if CPU is locked, show unlock criteria and current progress.
- show relevant CPU defeat count.
- provide Back navigation.

Next pages:

- Start Match -> <a href="#page-active-match">Active Match</a>
- Back -> <a href="#page-cpu-select">CPU Select</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-1p-stats"></a>

### 1P Stats

#### Page Purpose

1P Stats is a private personal progress page.

Immediate page behavior:

- show CPU defeat counts first.
- show CPU unlock progress second.
- show PvP stats third.
- show D/C count fourth.
- do not show lifetime accuracy for MVP.
- provide Back navigation.

Next pages:

- Back -> <a href="#page-1p">1P</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-2p"></a>

### 2P

#### Page Purpose

2P is the multiplayer entry point for Quick Match and private friend challenges.

Immediate pages:

- <a href="#page-quick-match">Quick Match</a>
- <a href="#page-create-private-room">Create Private Room</a>

Immediate page behavior:

- show Quick Match.
- show Create Private Room.
- do not show public lobby browsing.
- provide Back navigation to <a href="#page-home-page">Home Page</a>.

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-quick-match"></a>

### Quick Match

#### Page Purpose

Quick Match queues the player for public PvP matchmaking.

Immediate pages:

- <a href="#page-quick-match-finding">Finding Match</a>
- <a href="#page-room-full-message">Room Cap Message</a>
- <a href="#page-challenge-ready">Challenge / Ready</a>

Action flow:

- click Quick Match -> <a href="#page-quick-match-finding">Finding Match</a>
- match found -> <a href="#page-challenge-ready">Challenge / Ready</a>
- room cap reached -> <a href="#page-room-full-message">Room Cap Message</a>
- Back/cancel -> <a href="#page-2p">2P</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-quick-match-finding"></a>

### Finding Match

#### Page Purpose

Finding Match appears while the backend queues the player and waits for a match.

Immediate page behavior:

- show matchmaking-in-progress state.
- allow Back/cancel while not yet matched.
- route both matched players to Challenge / Ready when a room is assigned.

Next pages:

- matched -> <a href="#page-challenge-ready">Challenge / Ready</a>
- room cap reached -> <a href="#page-room-full-message">Room Cap Message</a>
- Back/cancel -> <a href="#page-quick-match">Quick Match</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-room-full-message"></a>

### Room Cap Message

#### Page Purpose

Room Cap Message appears when the shared 50-room cap has been reached.

Immediate page behavior:

- show `Game rooms are full. Please return in 5 minutes.`
- provide Back navigation.

Next pages:

- Back -> <a href="#page-2p">2P</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-create-private-room"></a>

### Create Private Room

#### Page Purpose

Create Private Room starts a private friend challenge.

Immediate pages:

- <a href="#page-friend-challenge-select">Friend Challenge Select</a>
- <a href="#page-private-invite-waiting">Private Invite Waiting</a>
- <a href="#page-private-invite-notification">Private Invite Notification</a>
- <a href="#page-challenge-ready">Challenge / Ready</a>

Immediate page behavior:

- show online accepted friends eligible for private challenge.
- do not show non-friends.
- do not show offline friends as selectable for immediate private challenge.
- provide Back navigation.

Next pages:

- choose online friend -> <a href="#page-private-invite-waiting">Private Invite Waiting</a>
- invited friend accepts -> <a href="#page-challenge-ready">Challenge / Ready</a>
- Back -> <a href="#page-2p">2P</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-friend-challenge-select"></a>

### Friend Challenge Select

#### Page Purpose

Friend Challenge Select lets the player choose an online accepted friend to challenge.

Immediate page behavior:

- show accepted online friends.
- show friend selected identity image.
- show friend player name.
- show friend Aura Points.
- show challenge action for eligible friends.
- show empty state when no online friends are eligible.

Next pages:

- Challenge -> <a href="#page-private-invite-waiting">Private Invite Waiting</a>
- Back -> <a href="#page-create-private-room">Create Private Room</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-private-invite-waiting"></a>

### Private Invite Waiting

#### Page Purpose

Private Invite Waiting appears while the inviter waits for the invited friend to respond.

Immediate page behavior:

- show invited friend's selected identity image and player name.
- show 60-second invite countdown.
- show waiting state.
- show `Invitation not accepted.` if declined or timed out.

Next pages:

- friend accepts -> <a href="#page-challenge-ready">Challenge / Ready</a>
- friend declines or invite times out -> <a href="#page-create-private-room">Create Private Room</a>
- Back/cancel -> <a href="#page-create-private-room">Create Private Room</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-private-invite-notification"></a>

### Private Invite Notification

#### Page Purpose

Private Invite Notification lets the invited friend accept or decline a private challenge.

Immediate page behavior:

- show `___ challenges you to a duel`.
- show challenger selected identity image.
- show challenger player name.
- show challenger Aura Points.
- provide Accept.
- provide Decline.
- show `You have declined the challenge.` if the invite times out.

Next pages:

- Accept -> <a href="#page-challenge-ready">Challenge / Ready</a>
- Decline -> return to current page or previous page.
- timeout -> return to current page or previous page.

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-challenge-ready"></a>

### Challenge / Ready

#### Page Purpose

Challenge / Ready lets matched PvP players prepare before the active match starts.

Immediate page behavior:

- show `___ VS ___`.
- show both players' selected identity images.
- show both player names.
- show both players' Aura Points.
- show large Ready button.
- use Matchmaking Module as the authoritative Ready / Stop state owner.
- show 30-second Ready window.
- start the 30-second Ready window when both players arrive on Challenge / Ready.
- if one player presses Ready, show that player as Ready while the other remains Not Ready.
- if both players press Ready, show `Match begins in...`.
- show 5-second match countdown.
- if one or both players do not press Ready within 30 seconds, auto-start the match.
- during the 5-second match countdown, show square Stop icon that cancels the countdown and resets both players to Not Ready with a fresh 30-second Ready window.
- if a player disconnects or leaves before Active Match starts, cancel/release the room and return the remaining player to the previous PvP page with `Opponent left.`
- once Active Match starts, hide Stop and use the PvP reconnect / void flow for quit/disconnect.

Next pages:

- countdown completes or auto-start triggers -> <a href="#page-active-match">Active Match</a>
- Stop icon -> <a href="#page-challenge-ready">Challenge / Ready</a>
- Back before match start -> <a href="#page-2p">2P</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-active-match"></a>

### Active Match

#### Page Purpose

Active Match displays the live PvP or PvC fight.

Immediate page behavior:

- show selected match background.
- show both combatants and their current visual states.
- show health bars.
- show attack/status bars.
- show shared attack power bar.
- show question prompt.
- show answer input.
- show fight-round timer.
- do not show fight score / round-win score during active gameplay.
- show current match phase only when needed, such as Final round or reconnect/void state.
- show DEFEND state.
- show status feedback such as `MISSED!`, `SHOCK!`, stun, and Additional DMG.
- show quit button.
- ignore inactive gameplay keys except number keys, `-`, Spacebar, and Enter.
- follow the <a href="GAME_PRD_3.0.md#feature-gameplay-screen-hud-presentation-contract">Gameplay Screen / HUD Presentation Contract</a>.

Nested pages:

- <a href="#page-round-prep">Round Prep</a>
- <a href="#page-pvp-reconnect-overlay">PvP Reconnect Overlay</a>
- <a href="#page-pvc-exit-confirmation">PvC Exit Confirmation</a>

Next pages:

- PvP match completes -> <a href="#page-pvp-results">PvP Results</a>
- PvP reconnect fails -> <a href="#page-pvp-results">PvP Results</a>
- PvC match completes -> <a href="#page-pvc-results">PvC Results</a>
- PvC quit confirmed or disconnects -> <a href="#page-pvc-results">PvC Results</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-round-prep"></a>

### Round Prep

#### Page Purpose

Round Prep shows the 3-second preparation sequence before each fight round.

Immediate page behavior:

- spin and show question type for 1 second.
- spin and show difficulty level for 1 second.
- show `Ready... Go!` for 1 second.
- then start the fight round.

Next pages:

- prep completes -> <a href="#page-active-match">Active Match</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-pvp-reconnect-overlay"></a>

### PvP Reconnect Overlay

#### Page Purpose

PvP Reconnect Overlay pauses the active PvP match while a player reconnects or returns after Quit/disconnect.

Immediate page behavior:

- pause the match for both players.
- show 10-second reconnect / return countdown.
- if return succeeds, show `Player connected!`.
- after successful return, show 5-second countdown before resuming.
- if return fails, show voided result path.

Next pages:

- reconnect succeeds -> <a href="#page-active-match">Active Match</a>
- reconnect fails -> <a href="#page-pvp-results">PvP Results</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-pvc-exit-confirmation"></a>

### PvC Exit Confirmation

#### Page Purpose

PvC Exit Confirmation asks the player to confirm before voiding a CPU match.

Immediate page behavior:

- show title `Exit match?`.
- show text `This CPU match will be voided and no progress will be recorded.`
- show `Cancel`.
- show `Exit Match`.

Next pages:

- Cancel -> <a href="#page-active-match">Active Match</a>
- Exit Match -> <a href="#page-pvc-results">PvC Results</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-results"></a>

### Results

#### Page Purpose

Results pages show the match outcome, performance, progression, quote, and next actions.

Immediate pages:

- <a href="#page-pvp-results">PvP Results</a>
- <a href="#page-pvc-results">PvC Results</a>
- <a href="#page-rematch-request">Rematch Request</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-pvp-results"></a>

### PvP Results

#### Page Purpose

PvP Results appears after completed or voided PvP matches.

Immediate page behavior:

- show win/loss/voided outcome.
- show accuracy.
- show correct answers.
- show match longest streak.
- show Aura gained.
- show relevant progression updates.
- show random result quote.
- show Back.
- for Quick Match, show Rematch and Add Friend.
- for private/friend match, show Rematch.
- for voided/D/C matches, show `0 AP`.

Nested pages:

- <a href="#page-rematch-request">Rematch Request</a>
- <a href="#page-add-friend-result-action">Add Friend Result Action</a>

Next pages:

- Rematch -> <a href="#page-rematch-request">Rematch Request</a>
- Add Friend -> <a href="#page-add-friend-result-action">Add Friend Result Action</a>
- Back -> <a href="#page-2p">2P</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-pvc-results"></a>

### PvC Results

#### Page Purpose

PvC Results appears after completed or voided CPU matches.

Immediate page behavior:

- show win/loss/voided outcome.
- show accuracy.
- show match longest streak.
- show CPU unlock progress.
- show random result quote.
- show Back.
- do not show Aura.
- do not show coins.
- if confirmed quit, show `CPU match voided.` and `No CPU win or unlock progress was recorded.`
- if sudden disconnect, show `CPU match voided due to disconnect.` and `No CPU win or unlock progress was recorded.`

Next pages:

- Back -> <a href="#page-cpu-select">CPU Select</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-rematch-request"></a>

### Rematch Request

#### Page Purpose

Rematch Request handles same-opponent rematch acceptance from PvP Results.

Immediate page behavior:

- one player clicks Rematch.
- requesting player waits for the other player to accept.
- if both players choose Rematch, both return to Challenge / Ready.
- if the other player leaves or presses Back, show `Rematch not accepted.`

Next pages:

- both players accept -> <a href="#page-challenge-ready">Challenge / Ready</a>
- not accepted -> <a href="#page-pvp-results">PvP Results</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-add-friend-result-action"></a>

### Add Friend Result Action

#### Page Purpose

Add Friend Result Action lets a Quick Match player send a friend request from PvP Results.

Immediate page behavior:

- show opponent selected identity image.
- show opponent player name.
- show opponent Aura Points.
- show Add Friend when eligible.
- show pending state after request is sent.
- show unavailable state if already friends, already pending, or rate-limited.

Next pages:

- request sent -> <a href="#page-pvp-results">PvP Results</a>
- Back -> <a href="#page-pvp-results">PvP Results</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-community"></a>

### Community

#### Page Purpose

Community houses friends, friend requests, Community Chat, and leaderboard views.

Immediate pages:

- <a href="#page-friends-list">Friends List</a>
- <a href="#page-add-friend-search">Add Friend / Search</a>
- <a href="#page-friend-requests">Friend Requests</a>
- <a href="#page-community-chat">Community Chat</a>
- <a href="#page-leaderboard">Leaderboard</a>

Next pages:

- Friends -> <a href="#page-friends-list">Friends List</a>
- Add Friend -> <a href="#page-add-friend-search">Add Friend / Search</a>
- Requests -> <a href="#page-friend-requests">Friend Requests</a>
- Chat -> <a href="#page-community-chat">Community Chat</a>
- Leaderboard -> <a href="#page-leaderboard">Leaderboard</a>
- Back -> <a href="#page-home-page">Home Page</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-friends-list"></a>

### Friends List

#### Page Purpose

Friends List shows accepted friends and their availability.

Immediate page behavior:

- show accepted friends.
- show each friend's selected identity image.
- show each friend's player name.
- show each friend's Aura Points.
- show online/offline state.
- show last activity if the friend is offline and data is available.
- allow Remove Friend.
- allow private challenge for online accepted friends.

Next pages:

- Challenge online friend -> <a href="#page-create-private-room">Create Private Room</a>
- Remove Friend -> <a href="#page-friends-list">Friends List</a>
- Back -> <a href="#page-community">Community</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-add-friend-search"></a>

### Add Friend / Search

#### Page Purpose

Add Friend / Search lets the player find another player by exact or partial player name.

Immediate page behavior:

- show search input.
- support exact player-name search.
- support partial player-name search.
- show autocomplete suggestions that help complete player names.
- show search results with selected identity image, player name, and Aura Points.
- show Add Friend when eligible.
- show pending/already-friends/unavailable states when relevant.
- rate-limit or cooldown-protect friend request sending.

Next pages:

- send request -> <a href="#page-add-friend-search">Add Friend / Search</a>
- Back -> <a href="#page-community">Community</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-friend-requests"></a>

### Friend Requests

#### Page Purpose

Friend Requests lets the player respond to incoming friend requests.

Immediate page behavior:

- show incoming pending friend requests.
- show requester selected identity image.
- show requester player name.
- show requester Aura Points.
- provide Accept.
- provide Decline.
- update request state after response.

Next pages:

- Accept -> <a href="#page-friends-list">Friends List</a>
- Decline -> <a href="#page-friend-requests">Friend Requests</a>
- Back -> <a href="#page-community">Community</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-community-chat"></a>

### Community Chat

#### Page Purpose

Community Chat lets logged-in users send and receive basic realtime chat messages.

Immediate page behavior:

- show latest Community Chat messages from the current server session.
- show 10 visible message rows.
- allow scrolling through the latest 50 message rows.
- show sender selected identity image.
- show sender username.
- show message text.
- show message timestamp formatted for Singapore time.
- provide message input.
- enforce `280` character message limit.
- reject empty messages.
- use WebSockets or equivalent realtime transport.
- server censors offensive language before broadcasting messages.
- chat messages do not persist to the database.

Next pages:

- send message -> <a href="#page-community-chat">Community Chat</a>
- Back -> <a href="#page-community">Community</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-leaderboard"></a>

### Leaderboard

#### Page Purpose

Leaderboard shows Aura ranking.

Immediate page behavior:

- show pinned current-player rank at the top.
- show pinned current-player Aura Points.
- show global top 50 players by Aura Points.
- support friend filter.
- friend filter shows accepted friends and the current player.
- do not use a separate leaderboard source-of-truth table.

Next pages:

- switch to friend filter -> <a href="#page-leaderboard">Leaderboard</a>
- switch to global filter -> <a href="#page-leaderboard">Leaderboard</a>
- Back -> <a href="#page-community">Community</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-profile"></a>

### Profile

#### Page Purpose

Profile lets the player manage account identity, player identity image, password, and language preference.

Immediate page behavior:

- show current selected identity image.
- allow profile picture upload/replacement from the user's device.
- allow choosing/replacing a premade player avatar.
- accept common image formats, including `jpg`, `jpeg`, `png`, and `webp`.
- show current username.
- allow username change if the requested username is unique.
- show current email.
- allow email change if the requested email is unique and valid.
- allow password change after validating the current password.
- show current language preference.
- support Malay, Chinese, Spanish, Japanese, and Korean.
- save selected language preference to player profile.
- provide Back navigation.

Next pages:

- save profile update -> <a href="#page-profile">Profile</a>
- Back -> <a href="#page-home-page">Home Page</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-privacy-policy"></a>

### Privacy Policy

#### Page Purpose

Privacy Policy provides accessible information about how user data is handled.

Immediate page behavior:

- show project-appropriate privacy policy content.
- cover account, profile, friend, match, and activity data at a high level.
- do not ship as an empty or placeholder page.
- provide Back navigation.

Next pages:

- Back -> <a href="#page-home-page">Home Page</a>

---

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="page-terms-of-service"></a>

### Terms Of Service

#### Page Purpose

Terms Of Service provides accessible terms for using the app.

Immediate page behavior:

- show project-appropriate terms of service content.
- cover acceptable use, account responsibility, fair play, and service limitations at a high level.
- do not ship as an empty or placeholder page.
- provide Back navigation.

Next pages:

- Back -> <a href="#page-home-page">Home Page</a>

<a href="#table-of-contents">Back to Table of Contents</a>
