# Game PRD 3.0 Test Plan

This test plan captures page and flow verification checkpoints for [GAME_PRD_3.0.md](GAME_PRD_3.0.md).

It is a planning checklist, not a required test framework or implementation file layout.

<a id="test-plan-contents"></a>

## Test Plan Contents

- <a href="#page-test-navigation">Page Navigation Testing</a>
- <a href="#page-test-auth-home-page">Auth And Home Page Testing</a>
- <a href="#page-test-1p">1P Page Testing</a>
- <a href="#page-test-2p">2P Page Testing</a>
- <a href="#page-test-active-match">Active Match Testing</a>
- <a href="#page-test-results">Results Testing</a>
- <a href="#page-test-community">Community Testing</a>
- <a href="#page-test-profile">Profile Testing</a>
- <a href="#page-test-legal-pages">Legal Pages Testing</a>

---

<a id="page-test-navigation"></a>

## Page Navigation Testing

### Test Purpose

Verify that the app's main page paths match the PRD 3.0 Page Navigation section.

Relevant PRD sections:

- [Top-Level App Entry](GAME_PRD_3.0.md#page-top-level-app-entry)
- [Home Page](GAME_PRD_3.0.md#page-home-page)
- [1P](GAME_PRD_3.0.md#page-1p)
- [2P](GAME_PRD_3.0.md#page-2p)
- [Community](GAME_PRD_3.0.md#page-community)
- [Profile](GAME_PRD_3.0.md#page-profile)
- [Privacy Policy](GAME_PRD_3.0.md#page-privacy-policy)
- [Terms Of Service](GAME_PRD_3.0.md#page-terms-of-service)

Testing checkpoints:

- player can reach Home Page after valid signup or login.
- Home Page routes to 1P, 2P, Community, Profile, Privacy Policy, and Terms Of Service.
- each major page provides expected Back navigation.
- no MVP page routes to shop, public lobby browsing, spectator mode, or replay wording.
- page links and route names remain consistent enough for implementation handoff.

---

<a href="#test-plan-contents">Back to Test Plan Contents</a>

<a id="page-test-auth-home-page"></a>

## Auth And Home Page Testing

### Test Purpose

Verify account entry and post-login navigation.

Relevant PRD sections:

- [Auth](GAME_PRD_3.0.md#page-auth)
- [Signup](GAME_PRD_3.0.md#page-signup)
- [Login](GAME_PRD_3.0.md#page-login)
- [Home Page](GAME_PRD_3.0.md#page-home-page)

Testing checkpoints:

- signup requires unique player name and unique email.
- signup creates account and profile state.
- login succeeds with valid credentials.
- login failure shows an error without entering the app.
- Home Page shows player profile picture, player name, Aura Points, primary navigation, and legal links.

---

<a href="#test-plan-contents">Back to Test Plan Contents</a>

<a id="page-test-1p"></a>

## 1P Page Testing

### Test Purpose

Verify tutorial, CPU selection, CPU unlock display, and 1P Stats pages.

Relevant PRD sections:

- [1P](GAME_PRD_3.0.md#page-1p)
- [1P Tutorial](GAME_PRD_3.0.md#page-1p-tutorial)
- [1P Duel CPU](GAME_PRD_3.0.md#page-1p-duel-cpu)
- [CPU Select](GAME_PRD_3.0.md#page-cpu-select)
- [CPU VS](GAME_PRD_3.0.md#page-cpu-vs)
- [1P Stats](GAME_PRD_3.0.md#page-1p-stats)

Testing checkpoints:

- tutorial pages progress through CPU 1 and CPU 2 beats.
- tutorial practice fights route to PvC results when completed or voided.
- Max and Min are available after tutorial completion.
- locked CPUs show criteria and current progress.
- unlocked CPUs can enter Active Match from CPU VS.
- 1P Stats displays CPU defeat counts, CPU unlock progress, PvP stats, last 10 PvP match history, then D/C count.
- 1P Stats PvP match history shows Match #, opponent, match type, result, and played-at time.
- 1P Stats PvP match history does not show Aura gained.
- lifetime accuracy is not shown in 1P Stats for MVP.

---

<a href="#test-plan-contents">Back to Test Plan Contents</a>

<a id="page-test-2p"></a>

## 2P Page Testing

### Test Purpose

Verify Quick Match, private friend challenge, and Challenge / Ready screens.

Relevant PRD sections:

- [2P](GAME_PRD_3.0.md#page-2p)
- [Quick Match](GAME_PRD_3.0.md#page-quick-match)
- [Finding Match](GAME_PRD_3.0.md#page-quick-match-finding)
- [Create Private Room](GAME_PRD_3.0.md#page-create-private-room)
- [Private Invite Waiting](GAME_PRD_3.0.md#page-private-invite-waiting)
- [Private Invite Notification](GAME_PRD_3.0.md#page-private-invite-notification)
- [Challenge / Ready](GAME_PRD_3.0.md#page-challenge-ready)

Testing checkpoints:

- 2P shows Quick Match and Create Private Room only.
- Quick Match can enter Finding Match, cancel, or route to Challenge / Ready when matched.
- room cap state shows `Game rooms are full. Please return in 5 minutes.`
- Create Private Room only allows online accepted friends for immediate challenge.
- private invite accepts, declines, and timeouts follow PRD messages.
- Challenge / Ready shows both players, Ready state, 30-second ready window, 5-second match countdown, auto-start, and Stop reset.

---

<a href="#test-plan-contents">Back to Test Plan Contents</a>

<a id="page-test-active-match"></a>

## Active Match Testing

### Test Purpose

Verify the live PvP/PvC match screen and match interruption overlays.

Relevant PRD sections:

- [Active Match](GAME_PRD_3.0.md#page-active-match)
- [Round Prep](GAME_PRD_3.0.md#page-round-prep)
- [PvP Reconnect Overlay](GAME_PRD_3.0.md#page-pvp-reconnect-overlay)
- [PvC Exit Confirmation](GAME_PRD_3.0.md#page-pvc-exit-confirmation)

Testing checkpoints:

- Round Prep shows question type, difficulty, and `Ready... Go!` sequence.
- Active Match shows combatants, background, health bars, attack/status bars, shared attack power bar, prompt, timer, DEFEND state, and quit button.
- allowed active gameplay keys are number keys, `-`, Spacebar, and Enter.
- wrong answer, no-action, DEFEND, stun, revenge, and Additional DMG feedback can be displayed.
- PvP quit/disconnect shows reconnect overlay and routes to PvP results if reconnect fails.
- PvC quit shows exit confirmation and routes to PvC results if confirmed.

---

<a href="#test-plan-contents">Back to Test Plan Contents</a>

<a id="page-test-results"></a>

## Results Testing

### Test Purpose

Verify PvP and PvC results display, next actions, and void messaging.

Relevant PRD sections:

- [Results](GAME_PRD_3.0.md#page-results)
- [PvP Results](GAME_PRD_3.0.md#page-pvp-results)
- [PvC Results](GAME_PRD_3.0.md#page-pvc-results)
- [Rematch Request](GAME_PRD_3.0.md#page-rematch-request)
- [Add Friend Result Action](GAME_PRD_3.0.md#page-add-friend-result-action)

Testing checkpoints:

- PvP Results show outcome, accuracy, correct answers, longest streak, Aura gained, progression updates, quote, and Back.
- Quick Match results show Rematch and Add Friend.
- private/friend match results show Rematch.
- voided PvP results show `0 AP`.
- PvC Results show outcome, accuracy, longest streak, CPU unlock progress, quote, and Back.
- PvC Results do not show Aura or coins.
- PvC confirmed quit and sudden disconnect show their required void messages.
- Rematch accepted routes to Challenge / Ready; not accepted returns to PvP Results with `Rematch not accepted.`

---

<a href="#test-plan-contents">Back to Test Plan Contents</a>

<a id="page-test-community"></a>

## Community Testing

### Test Purpose

Verify friends, friend requests, Add Friend search, Community Chat, and leaderboard pages.

Relevant PRD sections:

- [Community](GAME_PRD_3.0.md#page-community)
- [Friends List](GAME_PRD_3.0.md#page-friends-list)
- [Add Friend / Search](GAME_PRD_3.0.md#page-add-friend-search)
- [Friend Requests](GAME_PRD_3.0.md#page-friend-requests)
- [Community Chat](GAME_PRD_3.0.md#page-community-chat)
- [Leaderboard](GAME_PRD_3.0.md#page-leaderboard)

Testing checkpoints:

- Friends List shows accepted friends with profile picture, player name, Aura Points, online/offline state, and last activity when available.
- online accepted friends can be challenged from friend surfaces.
- Add Friend / Search supports exact and partial player-name search.
- autocomplete suggestions help complete player names.
- search results show profile picture, player name, Aura Points, and Add Friend eligibility.
- friend request sending shows pending/already-friends/unavailable states and respects cooldown/rate limiting.
- Friend Requests show requester profile picture, player name, Aura Points, Accept, and Decline.
- Community Chat sends and receives messages through WebSockets.
- Community Chat enforces `280` character message limit.
- Community Chat shows 10 visible messages and allows scrolling through latest 50 messages.
- Community Chat censors offensive language before broadcast.
- Community Chat messages do not persist after server restart.
- Leaderboard shows pinned current-player rank, global top 50 by Aura, and friend filter.

---

<a href="#test-plan-contents">Back to Test Plan Contents</a>

<a id="page-test-profile"></a>

## Profile Testing

### Test Purpose

Verify MVP profile, account setting, profile picture, and language preference behavior.

Relevant PRD sections:

- [Profile](GAME_PRD_3.0.md#page-profile)
- [User Profile And Settings](GAME_PRD_3.0.md#feature-user-profile-and-settings)
- [Localization](GAME_PRD_3.0.md#feature-localization)

Testing checkpoints:

- Profile shows current profile picture, username, email, and language preference.
- Profile supports profile picture upload/replacement from the user's device.
- Profile accepts `jpg`, `jpeg`, `png`, and `webp` profile pictures when validation passes.
- Profile rejects invalid profile picture file types and oversized files.
- Profile supports username change when the requested username is unique.
- Profile supports email change when the requested email is unique and valid.
- Profile supports password change after validating the current password.
- Profile supports Malay, Chinese, Spanish, Japanese, and Korean language preference.
- saving language updates player profile preference.
- saved language preference is restored after future login.
- translated UI text covers MVP menu labels, status messages, result messages, and errors where localization resources exist.

---

<a href="#test-plan-contents">Back to Test Plan Contents</a>

<a id="page-test-legal-pages"></a>

## Legal Pages Testing

### Test Purpose

Verify Privacy Policy and Terms Of Service are accessible from the Home Page.

Relevant PRD sections:

- [Privacy Policy](GAME_PRD_3.0.md#page-privacy-policy)
- [Terms Of Service](GAME_PRD_3.0.md#page-terms-of-service)
- [Legal Pages](GAME_PRD_3.0.md#feature-legal-pages)

Testing checkpoints:

- Home Page provides accessible links to Privacy Policy and Terms Of Service.
- Privacy Policy page is reachable and contains project-appropriate privacy content before release.
- Terms Of Service page is reachable and contains project-appropriate terms before release.
- Privacy Policy and Terms Of Service are not empty or placeholder pages.
- each legal page provides Back navigation to Home Page.

<a href="#test-plan-contents">Back to Test Plan Contents</a>

