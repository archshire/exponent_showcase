# Game PRD 3.0 Implementation Details

This document contains the implementation and architecture details split out from the main PRD.

Main PRD: [GAME_PRD_3.0.md](GAME_PRD_3.0.md)

Page inventory: [GAME_PRD_3.0_PAGES.md](GAME_PRD_3.0_PAGES.md)

## Table of Contents

<a id="table-of-contents"></a>

- <a href="#implementation-details">Implementation Details</a>
   - <a href="#feature-runtime-traffic-flows">0. Runtime Traffic Flows</a>
      - <a href="#traffic-flow-non-game-page-flow">i. Non-game Page Flow</a>
      - <a href="#traffic-flow-game-realtime-flow">ii. Game / Realtime Flow</a>
   - <a href="#feature-services-and-runtime-ownership">i. Services And Runtime Ownership</a>
      - <a href="#service-nginx-entrypoint-reverse-proxy">1) Nginx Entrypoint / Reverse Proxy Service</a>
         - <a href="#nginx-http-route-config-area">i. HTTP route config area</a>
         - <a href="#nginx-rest-api-route-config-area">ii. REST API route config area</a>
         - <a href="#nginx-websocket-upgrade-config-area">iii. WebSocket upgrade config area</a>
         - <a href="#nginx-tls-proxy-security-config-area">iv. TLS / proxy security config area</a>
      - <a href="#service-nextjs-frontend">2) React + Next.js Frontend Service</a>
         - <a href="#frontend-app-shell-module">i. App Shell Module</a>
         - <a href="#frontend-routing-module">ii. Routing Module</a>
         - <a href="#frontend-page-ui-modules">iii. Page UI Modules</a>
         - <a href="#frontend-rest-client-module">iv. REST Client Module</a>
         - <a href="#frontend-websocket-client-module">v. WebSocket / Socket.IO Client Module</a>
         - <a href="#frontend-state-module">vi. Frontend State Module</a>
         - <a href="#frontend-localization-module">vii. Localization Module</a>
         - <a href="#frontend-active-match-host-module">viii. Active Match Host Module</a>
         - <a href="#layer-excalibur-active-match">Excalibur Active Match Layer</a>
         - <a href="#excalibur-match-scene-module">Match Scene Module</a>
         - <a href="#excalibur-combatant-view-module">Combatant View Module</a>
         - <a href="#excalibur-hud-view-module">HUD View Module</a>
         - <a href="#excalibur-question-view-module">Question View Module</a>
         - <a href="#excalibur-effects-module">Effects Module</a>
         - <a href="#excalibur-overlay-module">Overlay Module</a>
         - <a href="#excalibur-input-presentation-module">Input Presentation Module</a>
      - <a href="#feature-backend-modular-monolith">3) Node.js + Express Backend Service / Backend Modular Monolith</a>
         - <a href="#backend-additional-runtime-responsibilities">x. Additional Backend Runtime Responsibilities</a>
         - <a href="#backend-runtime-memory-responsibility">Backend Runtime Memory</a>
         - <a href="#backend-community-chat-runtime-handler">Community Chat Runtime Handler</a>
         - <a href="#backend-internal-module-handoffs">Internal Module Handoffs</a>
         - <a href="#backend-rest-api-groups">REST API Groups</a>
         - <a href="#backend-boundary-and-data-ownership-notes">Boundary And Data Ownership Notes</a>
         - <a href="#module-auth-module">i. Auth Module</a>
         - <a href="#module-player-profile-module">ii. Player Profile Module</a>
         - <a href="#module-friends-management-module">iii. Friends Management Module</a>
         - <a href="#module-stats-leaderboard-module">iv. Stats / Leaderboard Module</a>
         - <a href="#module-matchmaking-module">v. Matchmaking Module (Pre-Match)</a>
         - <a href="#module-live-match-module">vi. Live Match Module (Runtime)</a>
         - <a href="#module-match-summary-module">vii. Match Summary Module (Post-Match)</a>
         - <a href="#module-question-generation-module">viii. Question Generation Module</a>
         - <a href="#module-cpu-opponent-module">ix. CPU Opponent Module</a>
      - <a href="#service-database">4) PostgreSQL Database Service</a>
         - <a href="#database-users-schema-persistence-area">i. Users schema / persistence area</a>
         - <a href="#database-player-profiles-schema-persistence-area">ii. Player Profiles schema / persistence area</a>
         - <a href="#database-friendships-schema-persistence-area">iii. Friendships schema / persistence area</a>
         - <a href="#database-pvp-matches-schema-persistence-area">iv. PvP Matches schema / persistence area</a>
         - <a href="#database-cpu-progression-schema-persistence-area">v. CPU Progression schema / persistence area</a>
         - <a href="#database-constraint-index-area">vi. Constraint / Index area</a>
   - <a href="#feature-deployment-dockerization">ii. Deployment / Dockerization</a>
   - <a href="#feature-database-persistent-data-management">iii. Database Tables / Persistent Data Management</a>
      - <a href="#feature-users-table">`users`</a>
      - <a href="#feature-player-profiles-table">`player_profiles`</a>
      - <a href="#feature-player-friendships-table">`player_friendships`</a>
      - <a href="#feature-pvp-matches-table">`pvp_matches`</a>
      - <a href="#feature-player-cpu-progression-table">`player_cpu_progression`</a>
   - <a href="#feature-runtime-match-state">iv. Runtime Match State</a>
   - <a href="#feature-realtime-runtime-requirements">v. Realtime Runtime Requirements</a>
   - <a href="#feature-implementation-ownership-map">vi. Implementation Ownership Map</a>
   - <a href="#feature-typescript-domain-core-contract">vii. TypeScript Domain Core Contract</a>
   - <a href="#feature-live-server-event-api-contract">viii. Live Server Event / API Contract</a>
   - <a href="#feature-excalibur-scene-hud-presentation-event-contract">ix. Excalibur Scene / HUD Presentation Event Contract</a>

<a id="implementation-details"></a>

## Implementation Details

Architecture features describe what the system must persist, compute, or coordinate to support the MVP app features.

Architecture Features explain module ownership and data/runtime boundaries for the player-facing requirements listed earlier.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-runtime-traffic-flows"></a>

### 0. Runtime Traffic Flows

Runtime traffic uses two main flows.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="traffic-flow-non-game-page-flow"></a>

#### i. Non-game Page Flow

- browser requests enter through the Nginx entrypoint / reverse proxy service.
- Nginx routes non-game page and asset requests to the React + Next.js frontend service.
- React + Next.js owns non-game page routing, React page UI, and page composition.
- static non-game pages, such as Privacy Policy and Terms Of Service, can return from Next.js without backend data.
- dynamic non-game pages use REST/API requests from React + Next.js or browser-loaded frontend code to the Node.js + Express backend service.
- Node.js + Express backend modules compute, validate, or retrieve the requested backend data.
- Node.js + Express connects to the PostgreSQL Database Service when durable data is needed.
- PostgreSQL Database Service reads/writes its mounted persistent database storage.
- Node.js + Express returns backend data to the requester.
- if the requester is Next.js during page composition, Next.js builds the completed non-game page response, which returns through Nginx to the browser.
- if the requester is browser-loaded frontend code after the page has loaded, the browser updates the already-loaded page using the returned backend data.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="traffic-flow-game-realtime-flow"></a>

#### ii. Game / Realtime Flow

- browser requests enter through the Nginx entrypoint / reverse proxy service.
- Nginx routes game page and asset requests to the React + Next.js frontend service.
- React + Next.js serves Active Match Host code, Excalibur scene/view code, React page UI code, REST client code, and WebSocket / Socket.IO client code to the browser.
- the browser runs the downloaded Active Match Host code.
- Active Match Host mounts / starts the Excalibur Active Match layer in the browser.
- browser-loaded Active Match Host opens and uses a WebSocket / Socket.IO connection through Nginx to the Node.js + Express backend service.
- Nginx proxies WebSocket / Socket.IO traffic; it does not own gameplay rules or request backend data by itself.
- Node.js + Express backend realtime modules own authoritative runtime state and emit authoritative events.
- backend events return through Nginx to the browser-loaded WebSocket / Socket.IO Client / Active Match Host.
- Active Match Host passes presentation updates into Excalibur scene/view modules.
- Excalibur renders the Active Match scene, HUD, effects, overlays, and local input presentation.

Runtime traffic rules:

- Nginx only routes/proxies traffic; it does not compose pages, decide gameplay, or request database data on its own.
- REST/API traffic is used for stable non-game request/response data.
- WebSocket + Socket.IO transport is used for server-pushed realtime flows.
- persistence is not part of the live game rendering loop.
- Node.js + Express talks to the PostgreSQL Database Service; Browser, React + Next.js, and Excalibur do not directly read/write the mounted database volume.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-services-and-runtime-ownership"></a>

### i. Services And Runtime Ownership

PRD 3.0 MVP uses four runtime services in Dockerized deployment:

- Nginx entrypoint / reverse proxy service.
- React + Next.js frontend service.
- Node.js + Express backend service / backend modular monolith.
- PostgreSQL Database Service.
- Socket.IO is the selected MVP realtime library on top of WebSocket-compatible transport.

Service vocabulary:

- a service is a runtime responsibility unit that may run inside a container.
- a container is a Docker deployment unit.
- a backend module is an implementation responsibility group inside the Node.js + Express backend service.
- a frontend module is an implementation responsibility group inside the React + Next.js frontend service.
- an Excalibur scene/view module is an implementation responsibility group inside the Active Match Excalibur layer.
- a reverse proxy config area is an Nginx routing/configuration responsibility, not a custom Nginx code module.
- a database schema / persistence area is a table, constraint, index, or persistence responsibility, not an application module.
- modules, scene/view modules, config areas, and schema areas are not separate containers or microservices unless explicitly stated.

Runtime traffic flow details are defined in <a href="#feature-runtime-traffic-flows">Runtime Traffic Flows</a>.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="service-nginx-entrypoint-reverse-proxy"></a>

#### 1) Nginx Entrypoint / Reverse Proxy Service

Owns reverse proxy config areas:

- <a id="nginx-http-route-config-area"></a>i. HTTP route config area: routes frontend page and asset traffic.
- <a id="nginx-rest-api-route-config-area"></a>ii. REST API route config area: forwards stable API traffic to the backend service.
- <a id="nginx-websocket-upgrade-config-area"></a>iii. WebSocket / Socket.IO upgrade config area: forwards realtime connections to the backend service.
- <a id="nginx-tls-proxy-security-config-area"></a>iv. TLS / proxy security config area: handles proxy security configuration where needed.

Does not own app pages, gameplay rules, auth logic, runtime match state, or database access.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="service-nextjs-frontend"></a>

#### 2) React + Next.js Frontend Service

Owns frontend modules:

- <a id="frontend-app-shell-module"></a>i. App Shell Module: React authenticated app frame, shared layout, and top-level navigation.
- <a id="frontend-routing-module"></a>ii. Routing Module: Next.js page routing for Auth, Home, 1P, 2P, Community, Profile, legal pages, match pages, and results pages.
- <a id="frontend-page-ui-modules"></a>iii. Page UI Modules: React player-facing screens and page-specific UI behavior.
- <a id="frontend-rest-client-module"></a>iv. REST Client Module: stable page-data requests to backend APIs.
- <a id="frontend-websocket-client-module"></a>v. WebSocket / Socket.IO Client Module: queue, ready, active match, rematch, reconnect, and Community Chat realtime connections.
- <a id="frontend-state-module"></a>vi. Frontend State Module: client-side state needed to coordinate pages, local input display, and server event consumption.
- <a id="frontend-localization-module"></a>vii. Localization Module: shared UI text resources and language preference application.
- <a id="frontend-active-match-host-module"></a>viii. Active Match Host Module: browser-loaded frontend controller/glue that mounts the Excalibur Active Match layer, opens/uses realtime connections, handles local active-match input, receives backend events through the Socket.IO/WebSocket Client, and passes presentation updates into Excalibur.

React + Next.js frontend service rules:

- React + Next.js composes non-game pages from static content and backend data.
- dynamic non-game pages may use REST/API requests to Node.js + Express backend modules for persisted or derived data.
- React + Next.js serves Active Match Host and Excalibur frontend code to the browser for the game/realtime flow.
- after the game page loads, Active Match Host and Excalibur run in the browser.
- React + Next.js does not decide final answer acceptance, damage, HP truth, winners, Aura, or persistence.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="layer-excalibur-active-match"></a>

##### Excalibur Active Match Layer

Owns scene/view modules:

- <a id="excalibur-match-scene-module"></a>Match Scene Module.
- <a id="excalibur-combatant-view-module"></a>Combatant View Module.
- <a id="excalibur-hud-view-module"></a>HUD View Module.
- <a id="excalibur-question-view-module"></a>Question View Module.
- <a id="excalibur-effects-module"></a>Effects Module.
- <a id="excalibur-overlay-module"></a>Overlay Module.
- <a id="excalibur-input-presentation-module"></a>Input Presentation Module.

Does not own final answer acceptance, server timestamp ordering, damage calculation, HP truth, match winners, Aura awards, or database persistence.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-backend-modular-monolith"></a>

#### 3) Node.js + Express Backend Service / Backend Modular Monolith

The Node.js + Express backend service uses a modular monolith architecture for MVP.

The backend runs as one Node.js + Express backend service/container with clear internal modules. Each module should have a primary responsibility and communicate through TypeScript interfaces, shared domain functions, REST routes, Socket.IO/WebSocket events, or internal calls where appropriate.

The MVP does not claim the optional backend-as-microservices module.

Recommended backend module clusters:

| Module Cluster | Houses | Purpose |
| --- | --- | --- |
| Identity & Player Data Modules | i. Auth Module, ii. Player Profile Module | Handles account identity, player profile state, tutorial completion, language preference, and stored Aura total. |
| Community Management and Ranking Modules | iii. Friends Management Module, iv. Stats / Leaderboard Module | Handles friend relationships, social lookup, derived player stats, and leaderboard views. |
| PvP Modules | v. Matchmaking Module (pre-match), vi. Live Match Module (runtime), vii. Match Summary Module (post-match) | Handles PvP queueing, private invites, room assignment, ready flow, live match synchronization, reconnects, void handling, and match-end persistence. |
| Gameplay Modules | viii. Question Generation Module, ix. CPU Opponent Module | Handles arithmetic question generation, difficulty rules, PvP-only `?` mode, and CPU opponent behavior for PvC. |

Recommended backend modules:

| Backend Module | Owns | Interfaces / Notes |
| --- | --- | --- |
| i. Auth Module | signup, login, unique username, email, password hash, account status, last login. | Persists to `users`; exposes account/auth APIs. |
| ii. Player Profile Module | profile picture upload, premade avatar selection, username change, email change, password change, language preference, tutorial completion, last active timestamp, Aura total. | Persists account updates to `users` and profile updates to `player_profiles`; exposes player profile APIs; does not store accuracy or other derived stats. |
| iii. Friends Management Module | friend search, autocomplete, friend requests, accepted friends, declined/unfriended states. | Persists to `player_friendships`; reads player display data from Auth/Profile modules or a controlled projection. |
| iv. Stats / Leaderboard Module | derived PvP stats, D/C count, CPU unlock state, PvP match history view, leaderboard ranking. | Computes from persisted data; leaderboard reads stored `player_profiles.aura_points`. |
| v. Matchmaking Module (pre-match) | Quick Match queue, room assignment, room cap, private invite delivery, invite timeout, room lifecycle, ready flow. | Runtime state for queues, rooms, invites, and ready flows; hands off to Live Match Module when a match starts. |
| vi. Live Match Module (runtime) | live match state, timers, HP, attack power, questions in play, answer validation, DEFEND, revenge, reconnect, void handling, runtime accuracy, runtime Aura gain. | Uses WebSocket + Socket.IO realtime transport; owns runtime match state until match ends. |
| vii. Match Summary Module (post-match) | final PvP match summary write, Aura profile update, PvC win/unlock update. | Persists PvP match history to `pvp_matches`; increments `player_profiles.aura_points`; updates PvC wins/unlocks in `player_cpu_progression`. |
| viii. Question Generation Module | arithmetic prompt generation, difficulty weighting, PvP-only `?` mode selection, expected answer generation. | Called by Live Match Module during active matches; detailed question history is NOT IN MVP persistence. |
| ix. CPU Opponent Module | CPU behavior timing, CPU fighter type behavior, CPU answer/DEFEND/revenge behavior. | Called by Live Match Module for PvC; CPU unlock rule definitions live in backend static game configuration. |

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="backend-additional-runtime-responsibilities"></a>

##### x. Additional Backend Runtime Responsibilities

These backend responsibilities are part of the Node.js + Express backend service, but they are not additional backend modules.

They describe shared runtime memory, transport handling, cross-module handoffs, API grouping, and ownership boundaries around the 9 backend modules.

- <a id="backend-runtime-memory-responsibility"></a>Backend Runtime Memory: temporary backend process state for queues, rooms, ready/reconnect timers, active match coordination, WebSocket / Socket.IO sessions, and the Community Chat latest-50 buffer.
- <a id="backend-community-chat-runtime-handler"></a>Community Chat Runtime Handler: Socket.IO/WebSocket runtime handler that validates chat messages, censors offensive language, stores only the latest 50 messages in memory, and broadcasts censored chat events.
- <a id="backend-internal-module-handoffs"></a>Internal Module Handoffs: backend-to-backend calls/events such as Matchmaking -> Live Match, Live Match -> Question Generation, Live Match -> CPU Opponent, and Live Match -> Match Summary.
- <a id="backend-rest-api-groups"></a>REST API Groups: backend route groups for Auth, Profile, Friends, Stats / Leaderboard, CPU Progress, and any legal/localization resources that are not bundled statically.
- <a id="backend-boundary-and-data-ownership-notes"></a>Boundary And Data Ownership Notes: rules that keep runtime memory, database persistence, module ownership, and cross-module reads/writes separated.

Detailed references:

- Backend runtime memory is defined in the <a href="#feature-implementation-ownership-map">Implementation Ownership Map</a>.
- Community Chat realtime handling is defined in the <a href="#feature-realtime-runtime-requirements">Realtime Runtime Requirements</a> and <a href="#feature-live-server-event-api-contract">Live Server Event / API Contract</a>.
- Internal module handoffs and REST API groups are defined in the <a href="#feature-live-server-event-api-contract">Live Server Event / API Contract</a>.
- boundary and data ownership rules are defined below in the Modular monolith boundary notes and Data ownership principle.

Module detail notes:

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="module-auth-module"></a>

##### i. Auth Module

Owns account identity and login state.

Responsibilities:

- signup.
- login.
- unique username enforcement.
- unique email enforcement.
- password hash storage.
- account status.
- latest successful login timestamp.

Primary persisted table:

- `users`.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="module-player-profile-module"></a>

##### ii. Player Profile Module

Owns player profile preferences, player identity image, account setting updates, and player-facing profile totals.

Responsibilities:

- profile picture upload and replacement.
- premade player avatar selection and replacement.
- username change.
- email change.
- password change.
- language preference.
- tutorial completion flag.
- last active timestamp.
- persisted Aura total.

Primary persisted tables:

- `users`.
- `player_profiles`.

Notes:

- username and email uniqueness are enforced before updates.
- profile picture uploads accept common image formats and are validated on the client and server.
- premade player avatars are selected from built-in frontend/game assets and stored as profile identity selection metadata.
- does not store lifetime accuracy for MVP.
- does not store PvP wins/losses or D/C count because those are derived from `pvp_matches`.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="module-friends-management-module"></a>

##### iii. Friends Management Module

Owns friend relationships and friend request state.

Responsibilities:

- exact and partial player-name search.
- player-name autocomplete suggestions.
- sending friend requests.
- friend request rate limiting / cooldown enforcement.
- accepting friend requests.
- declining friend requests.
- unfriending.
- listing accepted friends.
- exposing friend display data through module reads or controlled projections.

Primary persisted table:

- `player_friendships`.

Primary persisted reads:

- `users.username`.
- `player_profiles.profile_picture_url`.
- `player_profiles.aura_points`.

Notes:

- partial player-name search and autocomplete should use indexed lookup or equivalent search support.
- inactive friendship status is not part of PRD 3.0 MVP.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="module-stats-leaderboard-module"></a>

##### iv. Stats / Leaderboard Module

Owns derived stats views and leaderboard views.

Responsibilities:

- derived PvP wins.
- derived PvP losses.
- derived PvP mutual losses.
- derived D/C count.
- completed PvP match count for CPU unlock checks.
- last 10 PvP match history rows for 1P Stats.
- CPU defeat count display.
- CPU unlock progress display.
- global Aura leaderboard.
- friend-filtered Aura leaderboard.
- pinned current-player rank.

Primary persisted reads:

- `player_profiles.aura_points`.
- `pvp_matches`.
- `player_cpu_progression`.
- `player_friendships`.

Notes:

- leaderboard does not require a separate MVP source-of-truth table.
- CPU unlock display is computed from `player_cpu_progression`, completed PvP match count, and static CPU unlock rules.
- CPU unlock rule definitions remain static game configuration, not player data.
- CPU Opponent Module owns live CPU behavior; Stats / Leaderboard Module owns CPU progress and unlock display views.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="module-matchmaking-module"></a>

##### v. Matchmaking Module (Pre-Match)

Owns PvP pre-match coordination before an active match starts.

Responsibilities:

- Quick Match queue.
- backend-managed room assignment.
- 50-room cap enforcement.
- private friend invite delivery.
- private invite timeout.
- room lifecycle before match start.
- Challenge / Ready page state.
- Ready button state.
- Ready timeout auto-start.
- Stop/reset synchronization on the Ready page.
- handoff to Live Match Module when a match starts.

Runtime state owned before handoff:

- queued players.
- pending invites.
- assigned rooms.
- pre-match ready state.
- pre-match countdowns.

Notes:

- public Quick Match rooms and private rooms share the same room cap.
- public-facing room browsing is not part of MVP.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="module-live-match-module"></a>

##### vi. Live Match Module (Runtime)

Owns active match state while a PvP or PvC match is live.

Responsibilities:

- live match state.
- fight-round timers.
- HP.
- attack power.
- question state in play.
- answer submission validation.
- answer timing validation.
- correct/wrong answer handling.
- `MISSED!` handling.
- `SHOCK!` handling.
- DEFEND legality.
- DEFEND cooldown / unavailable state.
- stun after successful DEFEND.
- same-time answer resolution.
- Additional DMG resolution.
- revenge gauge state.
- revenge attack handling.
- streak counters.
- runtime accuracy counters.
- runtime Aura gain calculation for PvP results display.
- reconnect detection for PvP.
- pause/resume synchronization for PvP reconnect.
- void handling for PvP failed reconnect or quit.
- PvC quit/disconnect void handling without reconnect grace.

Runtime state owned:

- active fight-round state.
- current question state.
- combat state.
- answer counters.
- streak counters.
- connection/reconnect state.

Notes:

- uses WebSocket + Socket.IO realtime transport.
- server is authoritative for PvP match-critical state.
- runtime state is not a persistent database source of truth.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="module-match-summary-module"></a>

##### vii. Match Summary Module (Post-Match)

Owns final post-match persistence after Live Match Module ends or voids a match.

Responsibilities:

- write final PvP match summary.
- persist PvP completed/voided outcome.
- persist PvP winner or mutual final-round loss.
- persist PvP D/C player and void reason when applicable.
- increment each player's persisted Aura total after completed valid PvP matches.
- apply `0 AP` for voided PvP matches.
- update PvC CPU win count after completed PvC wins.
- update CPU unlock state when CPU unlock rules are satisfied.

Primary persisted writes:

- `pvp_matches`.
- `player_profiles.aura_points`.
- `player_cpu_progression`.

Notes:

- PvC does not write full match history for MVP.
- per-match Aura gain is not persisted for MVP.
- match accuracy is not persisted for MVP.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="module-question-generation-module"></a>

##### viii. Question Generation Module

Owns arithmetic prompt generation and expected-answer generation.

Responsibilities:

- fight-round question type selection.
- fight-round difficulty selection.
- addition generator.
- subtraction generator.
- mixed addition/subtraction generator.
- PvP-only `?` mode subtype selection.
- reaction sequence generation.
- expected answer generation.
- comeback Easy rule support.
- CPU-specific difficulty pressure support where applicable.

Called by:

- Live Match Module.

Notes:

- detailed question history is not persisted for MVP.
- all active combatants receive the same generated prompt for each question round.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="module-cpu-opponent-module"></a>

##### ix. CPU Opponent Module

Owns CPU behavior and CPU fighter personalities for PvC.

Responsibilities:

- CPU answer timing.
- CPU fighter type behavior.
- CPU attack behavior.
- CPU DEFEND behavior.
- CPU revenge behavior.
- CPU weakness timing where applicable.
- CPU behavior profile for Max, Min, Fury, Shi-eld, Peasy, and Skore.

Called by:

- Live Match Module during PvC.

Notes:

- CPU unlock rule definitions live in backend static game configuration.
- CPU win/unlock persistence is handled by Match Summary Module.

Modular monolith boundary notes:

- the backend runs as one runtime container/process in final Dockerized deployment.
- each backend module should keep clear ownership of its routes, handlers, runtime state, and database writes.
- the implementation uses one shared database for MVP simplicity, but each module should only write to the tables it owns.
- cross-module reads should use internal module APIs, controlled projections, or clearly documented direct reads where MVP simplicity requires it.
- runtime match state remains temporary and should not be treated as database source-of-truth.
- localization can be implemented as shared app configuration/resources instead of a separate microservice for MVP.

Data ownership principle:

- source-of-truth account data belongs to `users`.
- source-of-truth profile preference data belongs to `player_profiles`.
- source-of-truth Aura total belongs to `player_profiles.aura_points`.
- source-of-truth friendship data belongs to `player_friendships`.
- source-of-truth PvP match history belongs to `pvp_matches`.
- source-of-truth PvC unlock progress belongs to `player_cpu_progression`.
- live gameplay state belongs to backend runtime match state.
- Community Chat state belongs to the backend runtime chat buffer.
- derived stats and leaderboards are calculated from persisted source-of-truth data.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="service-database"></a>

#### 4) PostgreSQL Database Service

Runs PostgreSQL and exposes database connections to the Node.js + Express backend service.

PostgreSQL Database Service storage rule:

- PostgreSQL Database Service reads/writes its data directory in a mounted persistent database volume.
- schemas, tables, indexes, and rows live in that database storage and should survive container restart/rebuild.
- Node.js + Express backend service connects to the PostgreSQL Database Service.
- Node.js + Express backend service does not directly read/write the mounted database volume.
- Browser, React + Next.js, and Excalibur do not directly access the PostgreSQL Database Service or the mounted database volume.

Owns database schema / persistence areas:

- <a id="database-users-schema-persistence-area"></a>i. Users schema / persistence area.
- <a id="database-player-profiles-schema-persistence-area"></a>ii. Player Profiles schema / persistence area.
- <a id="database-friendships-schema-persistence-area"></a>iii. Friendships schema / persistence area.
- <a id="database-pvp-matches-schema-persistence-area"></a>iv. PvP Matches schema / persistence area.
- <a id="database-cpu-progression-schema-persistence-area"></a>v. CPU Progression schema / persistence area.
- <a id="database-constraint-index-area"></a>vi. Constraint / Index area.

Does not own live timers, active HP, temporary combat status effects, Community Chat messages, or per-question visual events.

Detailed table contracts are defined in <a href="#feature-database-persistent-data-management">Database Tables / Persistent Data Management</a>.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-deployment-dockerization"></a>

### ii. Deployment / Dockerization

MVP deployment uses Docker Compose or an equivalent single-command container setup.

Required MVP containers:

| # | Container | Purpose |
| --- | --- | --- |
| 1 | Reverse proxy container | Runs the Nginx entrypoint / reverse proxy service and forwards browser requests to frontend/backend containers. |
| 2 | Frontend container | Runs the React + Next.js frontend service, including app pages, frontend clients, Socket.IO/WebSocket client code, and the Excalibur Active Match layer. |
| 3 | Backend container | Runs the Node.js + Express backend service / modular monolith, including backend modules, REST APIs, Socket.IO/WebSocket runtime handlers, and DB access. |
| 4 | Database container | Runs the PostgreSQL database service and stores MVP persisted data for `users`, `player_profiles`, `player_friendships`, `pvp_matches`, and `player_cpu_progression`. |

Container rules:

- each runtime container should run one main foreground process.
- if any startup-critical backend module fails to initialize, the backend process should fail startup and exit instead of continuing in a partially initialized state.
- startup-critical failures include missing required environment variables, database connection failure, schema validation failure, auth configuration failure, Socket.IO/WebSocket initialization failure, and route/module registration failure.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-database-persistent-data-management"></a>

### iii. Database Tables / Persistent Data Management

PRD 3.0 MVP uses 5 main persisted tables.

Persistence principle:

- store source-of-truth data once where practical.
- do not add separate tables for data that can be computed from these 5 MVP tables.
- do not store profile-level stats when they can be derived from persisted match history.
- exception: store `player_profiles.aura_points` as a persisted player-facing total because it powers the MVP leaderboard.
- PvP per-match history should stay in `pvp_matches`.
- PvC durable progress should stay in `player_cpu_progression`; full PvC match history is not persisted for MVP.
- session-only realtime state, such as active room timers, queues, ready state, reconnect countdowns, post-match accuracy, runtime answer counters, runtime Aura gain, and Community Chat messages, is not persisted for MVP.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-users-table"></a>

#### `users`

Stores account/auth identity.

Recommended fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key; also used as the player's ID. |
| `username` | `varchar(32)` | Unique login/search identity; also used as the player's public name. Duplicate player names are not allowed. |
| `email` | `varchar(255)` | Unique account email. |
| `password_hash` | `text` | Hashed password, not plaintext. |
| `status` | `varchar(24)` | Account status, such as `active`, `disabled`, or `deleted`. |
| `created_at` | `timestamptz` | Account creation timestamp. |
| `last_login_at` | `timestamptz` | Nullable; latest successful login timestamp. |

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-player-profiles-table"></a>

#### `player_profiles`

Stores player preferences and MVP progress markers that are not already captured by account identity or match history.

Identity rule:

- one account equals one player for MVP.
- `users.id` is the player ID.
- `users.username` is the player-facing name.
- player names must be unique.
- `player_profiles.player_id` references `users.id`.

Recommended fields:

| Field | Type | Notes |
| --- | --- | --- |
| `player_id` | `uuid` | Primary key and foreign key to `users.id`. |
| `profile_picture_url` | `text` | Nullable reference/path for the uploaded profile picture. |
| `premade_avatar_key` | `varchar(64)` | Nullable key for the selected built-in premade player avatar. |
| `identity_image_source` | `varchar(16)` | Selected identity source, such as `upload` or `premade_avatar`. |
| `language_code` | `varchar(8)` | UI language preference, such as `ms`, `zh`, `es`, `ja`, or `ko`. |
| `aura_points` | `integer` | Persisted total Aura Points; default `0`; updated after completed valid PvP matches. |
| `tutorial_completed` | `boolean` | `true` after tutorial completion; default `false`; supports CPU availability after tutorial. |
| `last_active_at` | `timestamptz` | Nullable; supports friend offline last-activity display. |
| `created_at` | `timestamptz` | Player profile creation timestamp. |
| `updated_at` | `timestamptz` | Player profile update timestamp. |

Identity image rule:

- exactly one selected player identity source should be active for display at a time.
- if `identity_image_source = upload`, `profile_picture_url` identifies the selected uploaded image.
- if `identity_image_source = premade_avatar`, `premade_avatar_key` identifies the selected built-in avatar.
- uploads and premade selections may replace each other as the selected identity image.

PvP wins/losses, D/C count, and last 10 PvP match history are derived from persisted PvP match history at runtime or query time. Aura total is stored in `aura_points`. CPU unlock progress is stored in `player_cpu_progression`.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-player-friendships-table"></a>

#### `player_friendships`

Stores friend relationships and request status.

Recommended fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key. |
| `requester_player_id` | `uuid` | Foreign key to `player_profiles.player_id`; latest requester. |
| `receiver_player_id` | `uuid` | Foreign key to `player_profiles.player_id`; latest receiver. |
| `status` | `varchar(24)` | Friendship/request state. |
| `created_at` | `timestamptz` | Row creation timestamp. |
| `updated_at` | `timestamptz` | Latest status/request update timestamp. |

Recommended statuses:

- `pending`.
- `accepted`.
- `declined`.
- `unfriended`.

Persistence rule:

- use one friendship row per player pair.
- a player pair should not create duplicate friendship rows over time.
- if a `declined` or `unfriended` relationship already exists, a new request should update the existing row's `status` and `updated_at` instead of inserting another row.
- the requester/receiver fields may update depending on who sends the new request.
- enforce uniqueness for the unordered player pair, either with normalized pair columns or an equivalent database constraint.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-pvp-matches-table"></a>

#### `pvp_matches`

Stores PvP match history for Quick Match and private/friend matches.

PvC matches are not stored here. PvC durable state is stored only as CPU unlock progression in `player_cpu_progression`.

Recommended fields:

| Field | Type | Notes |
| --- | --- | --- |
| `match_id` | `uuid` | Primary key. |
| `is_private_match` | `boolean` | `false` for Quick Match; `true` for private/friend match. |
| `status` | `varchar(16)` | Persistence outcome; identifies whether the PvP match completed or was voided. |
| `p1_player_id` | `uuid` | Foreign key to `player_profiles.player_id`. |
| `p2_player_id` | `uuid` | Foreign key to `player_profiles.player_id`; required for PvP. |
| `winner_player_id` | `uuid` | Nullable; null for mutual final-round loss or voided matches. |
| `dc_player_id` | `uuid` | Nullable; player who disconnected/quit when applicable. |
| `void_reason` | `varchar(64)` | Nullable; reason the match was voided, such as failed reconnect or quit. |
| `started_at` | `timestamptz` | Match start timestamp. |
| `ended_at` | `timestamptz` | Nullable until match is completed/voided. |

Recommended `status` values:

- `completed`.
- `voided`.

Field purpose notes:

- `is_private_match` distinguishes Quick Match from private/friend PvP without storing a broader match mode.
- PvC is identified outside this table; PvC has no `p2_player_id` and updates `player_cpu_progression`.
- `status` tells the app whether the PvP match should count toward stats/Aura or be treated as voided.
- `void_reason` explains why a PvP match was voided for results messaging, support, and analytics.
- correct answers, answer attempts, match accuracy, and match Aura gain are tracked in runtime match state and shown on the post-match results page.
- match accuracy is not persisted for MVP.
- match Aura gain is calculated at match end and applied to `player_profiles.aura_points`; per-match Aura gain is not persisted for MVP.
- `started_at` and `ended_at` support match history ordering, duration, support/debugging, and analytics.

Derived PvP match data:

| Data | Formula | Presented In |
| --- | --- | --- |
| Player result | If `status = voided`, show voided/D/C result. Else if `winner_player_id = player_id`, show win. Else if `winner_player_id` is null, show mutual final-round loss. Else show loss. | PvP post-match results, match history, personal stats. |
| Match source | If `is_private_match = true`, show private/friend match behavior. Else show Quick Match behavior. | PvP post-match results, match history. |
| Mutual final-round loss | `status = completed` and `winner_player_id` is null. | PvP post-match results, personal stats. |
| Aura gained per player | Runtime only: if match is voided, `0 AP`. Else if player wins, `50 + runtime correct answers x 10`. Else `runtime correct answers x 10`. | PvP post-match results; then added to `player_profiles.aura_points`. |
| Voided/D/C Aura | If `status = voided`, runtime Aura gain is `0 AP`. | PvP post-match results. |

Computed PvP data:

| Data | Formula | Presented In |
| --- | --- | --- |
| Global leaderboard | Read `player_profiles.aura_points`; order players by Aura descending; show top 50. | Community leaderboard. |
| Friend-filtered leaderboard | Find accepted friends from `player_friendships`, include the current player, read each included player's `aura_points`, then order by Aura descending. | Community leaderboard friend filter. |
| Pinned player rank | Calculate the current player's rank from the same `aura_points` ordering used by the global leaderboard. | Top/pinned row of Community leaderboard. |

No leaderboard source-of-truth table is required for MVP.

Aura total is persisted on `player_profiles.aura_points`. Match Aura gain is calculated during runtime at match end and then added to the player's persisted Aura total.

Derived runtime / presentation data:

| Data | Formula | Presented In |
| --- | --- | --- |
| PvP wins | Count `pvp_matches` where `status = completed` and `winner_player_id = player_id`. | 1P Stats, profile/stat surfaces. |
| PvP losses | Count `pvp_matches` where `status = completed`, player participated, and `winner_player_id` is another player. | 1P Stats, profile/stat surfaces. |
| PvP mutual losses | Count `pvp_matches` where `status = completed`, player participated, and `winner_player_id` is null. | 1P Stats, profile/stat surfaces. |
| Completed PvP matches | Count `pvp_matches` where `status = completed` and player participated. | CPU unlock checks, 1P Stats. |
| Match correct answers | Runtime-only count for the completed match. | PvP post-match results. |
| Match answer attempts | Runtime-only submitted attempts for the completed match. | Used for post-match accuracy calculation. |
| Match accuracy | Runtime correct answers / runtime answer attempts; if answer attempts is `0`, show `0%` or no accuracy value. | PvP post-match results. |
| D/C count | Count `pvp_matches` where `status = voided` and `dc_player_id = player_id`. | 1P Stats, voided/D/C result handling. |
| Aura total | Read `player_profiles.aura_points`. | Community leaderboard, pinned player rank, profile/stat surfaces if shown. |

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-player-cpu-progression-table"></a>

#### `player_cpu_progression`

Stores per-player CPU unlock progress for PvC.

This table is used only for MVP CPU unlock progression. It is not a full PvC match history table.

Recommended fields:

| Field | Type | Notes |
| --- | --- | --- |
| `player_id` | `uuid` | Foreign key to `player_profiles.player_id`; part of composite primary key. |
| `cpu_key` | `varchar(32)` | CPU opponent key; part of composite primary key. |
| `wins` | `integer` | Lifetime wins against this CPU; default `0`. |
| `unlocked_at` | `timestamptz` | Nullable; set when this CPU becomes available to the player. |
| `updated_at` | `timestamptz` | Latest CPU progress update timestamp. |

Recommended `cpu_key` values:

- `max`.
- `min`.
- `fury`.
- `shi_eld`.
- `peasy`.
- `skore`.

Persistence rule:

- use one `player_cpu_progression` row per player and CPU pair.
- update `wins` after a completed PvC win.
- update `unlocked_at` when backend CPU unlock rules are satisfied.
- PvC losses are not persisted for MVP unless later accepted.
- full PvC match history is NOT IN MVP.

CPU unlock rules:

- CPU unlock conditions are static MVP game rules.
- the PRD CPU unlock progression table in the 1P Features section is the product source of truth.
- implementation should store CPU unlock rules in backend static game configuration, not in player data.
- example implementation locations may include `backend/game/config/cpuUnlockRules.ts` or `backend/config/gameRules/cpuUnlockRules.json`.
- the tutorial-complete gate for Max and Min should live in the same backend config as the later CPU unlock criteria.
- the backend compares `player_cpu_progression`, `player_profiles.tutorial_completed`, and completed PvP match count from `pvp_matches` against those rules.

Computed CPU progression data:

| Data | Formula | Presented In |
| --- | --- | --- |
| CPU win count | Read `wins` for the matching `player_id` and `cpu_key`. | CPU opponent VS screen, 1P Stats. |
| CPU unlock state | CPU is unlocked when `unlocked_at` is not null. | CPU opponent select/VS screen, 1P Stats. |
| CPU unlock progress | Compare current CPU win counts and completed PvP match count against backend CPU unlock rules. | CPU opponent VS screen, 1P Stats. |
| Completed PvC wins | Sum `wins` across `player_cpu_progression` rows for the player. | 1P Stats if shown. |

KIV persistence (NOT IN MVP):

- detailed question/event log table (NOT IN MVP).
- full PvC match history table (NOT IN MVP).
- leaderboard cache table (NOT IN MVP).
- persisted chat messages table (NOT IN MVP).
- separate stats table (NOT IN MVP).

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-runtime-match-state"></a>

### iv. Runtime Match State

Runtime match state is the temporary, server-owned data space used while a match is live.

This state is required for gameplay calculations, synchronization, timers, and authoritative rule checks. It is not persisted as a source-of-truth table for MVP.

Runtime ownership:

- the realtime server owns runtime match state.
- clients may display runtime state, but should not be authoritative for match-critical calculations.
- PvP runtime state must be synchronized to both active players.
- PvC runtime state runs server-side through Live Match Module; only CPU win/unlock progress is persisted for MVP.

Runtime match state should include:

| Runtime Data | Purpose | Persisted After Match? |
| --- | --- | --- |
| `room_id` | Identifies the active backend-managed room. | No. |
| `match_id` | Links PvP runtime state to the final persisted PvP match row. | Yes for PvP, as `pvp_matches.match_id`; no for PvC unless later needed. |
| runtime match type | Applies PvP/PvC rules during the live match. | No; PvP source is persisted through `is_private_match`, while PvC updates CPU progress. |
| player connection state | Tracks connected, disconnected, reconnecting, and quit states. | Partially; final D/C player persists as `dc_player_id`. |
| ready state | Tracks each player's Ready / Stop state and countdowns. | No. |
| active fight-round state | Tracks current round number, round timer, round wins, ties, and Final round state. | No, except final match result. |
| current question state | Tracks generated prompt, expected answer, question mode, and generation time. | No. |
| combat state | Tracks HP, attack power, damage, same-time answers, `Additional DMG`, revenge, DEFEND, stun, `MISSED!`, `SHOCK!`, and vulnerability windows according to the Core Gameplay rules. | No, except final summary stats. |
| answer counters | Tracks correct answers and submitted attempts during the match. | No; used for post-match display, post-match accuracy, and runtime Aura calculation only. |
| streak counters | Tracks current streak and match longest streak during the match. | No; shown on the post-match results page only. |
| reconnect state | Tracks pause/resume state and reconnect countdown. | Partially; failed reconnect persists as voided match data. |
| community chat state | Tracks latest 50 Community Chat messages for the current server session. | No. |

Runtime-to-persistence rule:

- when the match starts, create runtime match state.
- while the match is active, update runtime match state only.
- when a PvP match completes or is voided, write one final summary row to `pvp_matches`.
- when a completed valid PvP match awards Aura, calculate Aura gain from runtime answer counters and increment `player_profiles.aura_points`.
- when a PvC match completes, update `player_cpu_progression` only if relevant to CPU wins/unlocks.
- after both players leave the room/results flow, runtime match state can be discarded.
- if the server crashes before final persistence, MVP recovery behavior is KIV unless later clarified.

Final persisted PvP summary:

- `is_private_match`.
- `status`.
- `p1_player_id`.
- `p2_player_id`.
- `winner_player_id`.
- `dc_player_id`.
- `void_reason`.
- `started_at`.
- `ended_at`.

Final persisted PvP profile update:

- increment `player_profiles.aura_points` by each player's runtime-calculated Aura gain.

Final persisted PvC progress:

- `player_id`.
- `cpu_key`.
- `wins`.
- `unlocked_at`.
- `updated_at`.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-realtime-runtime-requirements"></a>

### v. Realtime Runtime Requirements

Realtime behavior is not a separate MVP backend process by itself. It is a runtime requirement implemented mainly across Matchmaking Module, Live Match Module, and Community Chat runtime handling, using WebSocket + Socket.IO realtime transport.

Realtime transport rule:

- use REST/API request-response for stable non-game data.
- use WebSocket + Socket.IO realtime transport when the server must push updates immediately.
- Socket.IO/WebSocket flow is required for Quick Match queue / room assignment, private invites, Challenge / Ready, Active Match, reconnect / pause / resume / void, rematch state, and Community Chat.
- live runtime state stays in backend runtime memory during active realtime flows unless another MVP persistence rule explicitly says to persist the final result.
- PostgreSQL Database Service / persistent volume is not part of the live game rendering loop.

Matchmaking Module realtime requirements:

- Quick Match queue.
- backend-managed room assignment.
- 50-room cap enforcement.
- private invite delivery.
- private invite timeout.
- ready-state synchronization.
- Stop/reset synchronization.

Live Match Module realtime requirements:

- active match synchronization.
- fight-round timer synchronization.
- answer timing validation.
- DEFEND legality.
- same-time answer resolution.
- HP/damage updates.
- status/effect state synchronization.
- reconnect detection for PvP.
- pause/resume synchronization for PvP reconnect.
- void match handling.

Match Summary Module realtime-adjacent requirement:

- receive the match-end trigger from Live Match Module.
- persist the final PvP or PvC outcome according to MVP persistence rules.
- return post-match summary data needed by the results page.

For PvP, the server should be authoritative for match-critical state.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-implementation-ownership-map"></a>

### vi. Implementation Ownership Map

The Implementation Ownership Map defines which system area owns each kind of MVP truth during implementation.

It should prevent gameplay rules, runtime coordination, frontend presentation, and persisted data from being mixed together.

Ownership principle:

- gameplay truth is decided by server-owned domain/runtime logic.
- clients and Excalibur display authoritative results; they do not decide match-critical outcomes.
- backend runtime memory coordinates temporary matchmaking, active match, reconnect, and Community Chat state for the MVP single-backend deployment.
- database tables persist final source-of-truth records; they do not run live timers or combat calculations.
- shared TypeScript/domain helpers may express game rules, but the authoritative runtime caller for PvP and PvC is the backend Live Match Module.

Implementation ownership table:

| Area | Primary Owner | Owns | Does Not Own | Notes |
| --- | --- | --- | --- | --- |
| Core gameplay rules | Shared TypeScript domain logic called by Live Match Module | Combat formulas, HP changes, attack power capture, streak multipliers, revenge damage, DEFEND resolution, `MISSED!`, `SHOCK!`, same-time / `Additional DMG`, round/match transitions. | Network transport, visual animation timing, persisted match rows. | Keep rules deterministic and testable so PvP and PvC use the same combat contract. |
| Authoritative live match state | Live Match Module | Current question, server receive timestamps, valid answer ordering, action eligibility, fight-round timer, question timer, HP, damage events, status effects, revenge gauge, DEFEND cooldown, reconnect/void decisions. | Permanent match history after match end, frontend animation, friend search, account/profile data. | This is the source of truth for active PvP and PvC matches. |
| Pre-match PvP coordination | Matchmaking Module | Quick Match queue, private invite flow, room assignment, room cap, Challenge / Ready state, Ready/Stop reset, auto-start, handoff to Live Match Module. | Active combat resolution, post-match persistence. | Before Active Match starts, Matchmaking Module owns the room lifecycle. |
| Post-match result persistence | Match Summary Module | Final PvP match row, void/completed outcome, winner/mutual loss, D/C player, Aura total update, PvC CPU win/unlock updates. | Live combat timers, same-time decisions, Excalibur effects. | Receives final outcome from Live Match Module and writes durable results. |
| Question generation | Question Generation Module | Fight-round question type, difficulty, prompt generation, expected answer, `?` mode generation, comeback Easy support, CPU-specific difficulty pressure support. | Answer ordering, damage resolution, display animation. | Live Match Module requests questions and then owns the in-play question state. |
| CPU behavior | CPU Opponent Module | CPU answer timing, CPU attack/DEFEND/revenge decisions, CPU weakness behavior, CPU profile behavior for Max, Min, Fury, Shi-eld, Peasy, and Skore. | Player input, final CPU progression writes, visual animation. | Live Match Module calls CPU behavior during PvC and applies the returned action through the same combat rules. |
| Backend runtime memory | Backend process | Temporary state for queues, rooms, ready/reconnect timers, active match coordination, Socket.IO/WebSocket sessions, and Community Chat latest-50 buffer. | Durable account data, PvP match history, Aura totals, CPU progression. | Runtime state can be cleared without becoming the MVP source of truth. |
| Database persistence | Database tables | `users`, `player_profiles`, `player_friendships`, `pvp_matches`, `player_cpu_progression`. | Live timers, active HP, temporary status effects, Community Chat messages, per-question visual events. | Persist only MVP source-of-truth data described in Database Tables / Persistent Data Management. |
| Excalibur presentation | Excalibur Active Match scene/view modules | Avatar movement, HUD bars, prompt fly-in animation, attack/hit effects, damage number display, overlay callouts, screen shake, pose swaps, visual countdown bars, and local input presentation. | Socket.IO/WebSocket ownership, deciding whether an answer is valid, whether DEFEND worked, damage amount, HP truth, revenge activation, match winner. | Excalibur renders presentation updates passed in by browser-loaded Active Match Host; it does not communicate directly with backend modules. |
| Frontend page/input coordination | React + Next.js frontend modules, including browser-loaded Active Match Host | Page routing, non-gameplay UI, REST and Socket.IO/WebSocket clients, passing backend events into Excalibur, sending answer/DEFEND/quit commands from active-match input presentation, and rendering disabled/active button state from server and local UI state. | Final answer acceptance, server timestamp ordering, combat calculations. | React + Next.js serves frontend code; during Active Match, the browser-loaded Active Match Host owns the connection/presentation bridge between backend events and Excalibur. |
| Stats and leaderboard views | Stats / Leaderboard Module | Derived PvP wins/losses/mutual losses, D/C count, CPU unlock progress display, global and friend Aura leaderboard. | Writing final match outcomes, active combat, friend relationship source of truth. | Reads persisted source-of-truth data and returns derived views. |
| Friend and social data | Friends Management Module | Friend search, autocomplete, requests, accepted friend list, friend relationship status. | Matchmaking combat rooms after invite acceptance, match results, leaderboard ranking calculations. | Provides social relationships used by private challenge and friend leaderboard flows. |

Boundary rules:

- If a rule affects HP, damage, status, answer validity, round winner, or match winner, it belongs to server-owned gameplay/domain logic.
- If a behavior affects how a moment looks or feels after the rule is decided, it belongs to Excalibur/frontend presentation.
- If a value must survive after the app restarts, it belongs in the database only if it is part of the MVP persistence model.
- If a value is needed only while players are queueing, readying, fighting, reconnecting, or viewing Community Chat's latest-50 server-session buffer, it belongs in backend runtime memory.
- If a backend module needs data owned by another backend module, it should read through an API, controlled projection, or documented MVP direct read rather than silently taking ownership.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-typescript-domain-core-contract"></a>

### vii. TypeScript Domain Core Contract

The TypeScript domain core is the shared, deterministic game-rule layer used by backend runtime modules.

It should express the PRD gameplay rules as testable state transitions. It should not perform rendering, Socket.IO/WebSocket transport, runtime-cache reads/writes, database persistence, HTTP routing, or Excalibur animation.

Domain core principles:

- pure rule functions should receive current state plus an explicit command/input and return updated state plus domain events.
- domain functions should not read wall-clock time directly; module callers pass server timestamps and elapsed times into the domain layer.
- domain logic should be reusable for PvP and PvC.
- Live Match Module remains the authoritative runtime caller for active matches.
- Excalibur receives presentation events derived from domain events; it does not call combat-rule functions to decide outcomes.
- all match-critical calculations should be covered by deterministic tests.

Recommended domain modules:

| Domain Module | Owns | Key Outputs |
| --- | --- | --- |
| `combat` | HP, attack power capture, normal damage, streak multipliers, revenge damage, DEFEND resolution, stun, `MISSED!`, `SHOCK!`, same-time / `Additional DMG`, round/match winner transitions. | Updated combatant state, damage events, status events, round/match result events. |
| `matchState` | Shared match state shape, fight-round state, question-round state, timers passed in by module callers, active phase transitions. | Updated match state and phase-change events. |
| `questions` | Question state shape, expected answer validation, selected type/difficulty metadata, comeback Easy flag handling. | Answer correctness result and question metadata for runtime state. |
| `cpuDrivers` | CPU decision interface and CPU profile decision outputs for PvC. | CPU action command such as answer, DEFEND, wait, or no action. |
| `results` | Runtime result summary derivation for post-match display and Match Summary Module handoff. | Final result payload, runtime accuracy, correct answer count, longest streak, Aura gain input values. |
| `events` | Domain event names and payload shapes consumed by backend transport and frontend presentation. | Stable event payloads for Live Match, Excalibur, results, and tests. |

Core state objects:

| State Object | Purpose | Required Data |
| --- | --- | --- |
| `MatchState` | Represents one active PvP or PvC match. | match id, mode, phase, fight-round state, question-round state, two combatants, runtime counters, pending `Additional DMG`, connection/reconnect state when applicable. |
| `CombatantState` | Represents one player or CPU during combat. | combatant id, driver type, HP, current streak count, revenge blocks, revenge active flag, DEFEND availability, active status effects, submitted answer state, runtime correct/attempt counters. |
| `FightRoundState` | Represents the current 60-second fight round. | round number, round start timestamp, elapsed time, round wins, tied-round count, Final round flag. |
| `QuestionRoundState` | Represents the current question exchange. | prompt, expected answer, generated question metadata, prompt construction complete flag, question start timestamp, 6-second deadline, captured actions, attack power at resolution. |
| `StatusEffectState` | Represents temporary lockouts and effects. | effect type, target combatant, start timestamp, end timestamp, whether it prevents answer, whether it prevents DEFEND. |
| `RuntimeCounters` | Represents runtime-only match measurements. | submitted attempts, correct answers, current streak, longest streak, runtime Aura inputs. |
| `DomainEvent` | Represents an authoritative game event. | event name, server timestamp, affected combatants, payload needed by services and presentation. |

Domain commands:

| Command | Called By | Domain Responsibility |
| --- | --- | --- |
| `startFightRound` | Live Match Module | Initialize fight-round state after round prep completes. |
| `constructQuestionComplete` | Live Match Module | Mark the prompt construction as complete and start the 6-second question timer. |
| `submitAnswer` | Live Match Module | Validate action eligibility at the server timestamp, compare answer to expected answer, record correct/wrong answer, and resolve attack/draw/miss behavior when appropriate. |
| `activateDefend` | Live Match Module | Validate DEFEND availability, start the 1-second active DEFEND window, and mark DEFEND unavailable for the rest of the current question and next question. |
| `resolveQuestionTimeout` | Live Match Module | Apply `SHOCK!` if both combatants have no valid answer by the 6-second deadline, or resolve any valid prior answer according to Core Gameplay rules. |
| `applyCpuAction` | Live Match Module | Apply a CPU decision through the same answer/DEFEND/wait command path used for human actions. |
| `advanceStatusEffects` | Live Match Module | Clear expired `MISSED!`, `DEFEND`, and `STUNNED` states based on server time passed into the domain layer. |
| `endFightRound` | Live Match Module | Determine round winner, tied round, Final round transition, match winner, or mutual final-round loss. |
| `finalizeMatchResult` | Live Match Module / Match Summary Module handoff | Produce the final runtime result payload needed for persistence and results display. |

Required domain events:

| Event | Meaning | Presentation / Module Use |
| --- | --- | --- |
| `questionConstructed` | Prompt construction is complete and the question timer starts. | Start attack power movement and answer input window. |
| `answerAccepted` | A submitted answer was eligible and processed. | Update local/server answer state. |
| `answerRejected` | A submitted answer was late, locked out, or otherwise ineligible. | Keep UI aligned without changing combat state. |
| `missed` | A wrong answer triggered `MISSED!`. | Show `MISSED!` and 1-second receding bar. |
| `shockApplied` | No valid answer before timeout triggered `SHOCK!`. | Show shock effect and HP deduction. |
| `attackLanded` | A normal attack dealt damage. | Animate attack, hit, HP bar deduction, and `-___ HP`. |
| `drawTriggered` | Same-time answers created `DRAW!` and `Additional DMG`. | Show `DRAW!` and arm carryover display. |
| `tieBreakerApplied` | The next exchange consumed `Additional DMG`. | Show `TIE-BREAKER!` and apply stacked damage or clear if blocked/timed out. |
| `defendActivated` | DEFEND became active. | Show DEFEND active state and countdown. |
| `defendBlocked` | DEFEND absorbed incoming damage. | Show shield effect; if revenge was blocked, show `DEFENDER!`. |
| `stunApplied` | Successful DEFEND stunned the attacker. | Show `STUNNED` and 1.5-second receding bar. |
| `revengeGaugeChanged` | A successful incoming hit filled revenge gauge progress. | Update 5-block revenge gauge. |
| `revengeActivated` | Revenge became available on the next question. | Show full glowing revenge gauge / aura. |
| `revengeAttackLanded` | Revenge attack dealt damage. | Show `Revenge ATT!`; show `CRITICAL!` only when the relevant combat rule says so. |
| `roundEnded` | A fight round ended with winner or tie. | Transition to next round prep or match result. |
| `matchEnded` | Match ended with winner, mutual final-round loss, or void. | Route to results and trigger persistence handoff. |

Domain output shape:

Every domain command should return:

```text
{
  state: updated MatchState,
  events: DomainEvent[],
  errors?: DomainError[]
}
```

Domain errors should be explicit, such as:

- `ACTION_LOCKED_OUT`.
- `QUESTION_NOT_ACTIVE`.
- `ANSWER_AFTER_TIMEOUT`.
- `DEFEND_UNAVAILABLE`.
- `MATCH_NOT_ACTIVE`.
- `INVALID_COMMAND_FOR_PHASE`.

Minimum domain test contract:

| Test Area | Required Coverage |
| --- | --- |
| Attack power | Power starts at `1`, reaches `30` over 5 seconds, and stays at `30` for the final second of a 6-second question round. |
| Damage | Normal damage uses captured attack power times streak multiplier; HP can become decimal. |
| Streak | Streak multipliers advance from `1.1x` to `1.5x` and cap at `1.5x`. |
| Timeout | Both no-answer before 6 seconds applies `SHOCK! -10 HP` to both combatants. |
| Wrong answer | Wrong answer applies `MISSED!` for 1 second with no extra damage penalty. |
| Same-time | Two valid correct answers within `150ms` create `DRAW!` and `Additional DMG`. |
| Additional DMG | Carryover equals captured attack power and clears after the next exchange whether it lands, is blocked, or times out. |
| DEFEND | Active DEFEND blocks damage only at damage-land moment, blocks normal/revenge/Additional DMG, and does not retroactively block. |
| DEFEND cooldown | DEFEND is unavailable for the rest of the current question and the next question. |
| Stun | Successful DEFEND stuns the attacker for `1.5s` and blocks answering during stun. |
| Revenge | Incoming successful hits fill revenge blocks; 5 blocks activates revenge on the next question. |
| Revenge damage | Revenge damage is `2 x attack power`, does not use streak multiplier, and does not count as a streak. |
| CPU actions | CPU actions are applied through the same answer/DEFEND command path as human actions. |
| Round result | Higher HP wins the fight round; equal HP creates a tied round. |
| Match result | First to 2 fight-round wins wins; unresolved tied flow enters Final round; equal HP in Final round makes both players lose. |

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-live-server-event-api-contract"></a>

### viii. Live Server Event / API Contract

The Live Server Event / API Contract defines the high-level server communication boundary for MVP.

It describes what kinds of actions, events, and handoffs the backend must support. It assumes Socket.IO over WebSocket-compatible transport for MVP realtime behavior, but it does not prescribe exact TypeScript interface shapes.

Transport split:

| Transport / Boundary | Used For | Primary Owner |
| --- | --- | --- |
| REST APIs | Stable request/response data for Auth, Profile, Friends, Stats, Leaderboard, CPU Progress, Match Summary, and non-game page data. | Owning backend module for each resource. |
| WebSocket + Socket.IO realtime transport | Server-pushed realtime updates for Quick Match queue, room assignment, private invites, Ready / Stop state, Active Match state, gameplay actions, reconnect, void, rematch, and Community Chat. | Matchmaking Module before Active Match; Live Match Module after Active Match starts; Community Chat runtime handler for chat. |
| Internal module events / APIs | Matchmaking handoff to Live Match, Live Match calls to Question Generation / CPU Opponent, and Live Match finalization handoff to Match Summary. | Sending and receiving backend modules. |

Transport boundary rules:

- Nginx forwards REST/API and Socket.IO/WebSocket traffic; it does not initiate backend data requests.
- browser-loaded Active Match Host sends gameplay commands through the Socket.IO/WebSocket Client.
- Node.js + Express sends authoritative realtime events back through Nginx to the browser-loaded Socket.IO/WebSocket Client / Active Match Host.
- backend events do not return through the Next.js server during the live game/realtime flow.
- Active Match Host passes presentation updates into Excalibur; Excalibur does not communicate directly with backend modules.

Standard realtime payload rules:

- every realtime message should include an event/action name.
- every realtime message should include a server timestamp when produced by the server.
- match-scoped messages should include `match_id` when a match exists.
- room-scoped messages should include `room_id` when a room exists.
- request/response-style actions should include a client-generated or server-generated correlation ID where useful.
- match-critical timing uses server receive timestamps, not client clocks.
- clients may show local optimistic input text, but authoritative accepted/rejected action results come from the server.
- event names may be adapted to implementation naming style, but the behavioral contract should remain stable.

Client-to-server realtime actions:

| Action | Sent From | Required Fields | Server Owner | Result / Notes |
| --- | --- | --- | --- | --- |
| `queue.join` | Quick Match page. | player identity/session. | Matchmaking Module. | Adds player to Quick Match queue if eligible and room cap allows. |
| `queue.cancel` | Finding Match page. | queue/session identity. | Matchmaking Module. | Removes player from queue if not yet matched. |
| `private_invite.send` | Create Private Room / friend challenge surfaces. | inviter player, invited friend, request timestamp. | Matchmaking Module. | Sends private challenge if players are accepted friends, invited friend is online, and room cap allows. |
| `private_invite.respond` | Private Invite Notification. | invite ID, response `accept` or `decline`. | Matchmaking Module. | Accept routes both players to Challenge / Ready; decline returns inviter message. |
| `ready.set` | Challenge / Ready page. | room ID, player ID. | Matchmaking Module. | Marks that player Ready during the 30-second Ready window. |
| `ready.stop` | Challenge / Ready countdown. | room ID, player ID. | Matchmaking Module. | Cancels the 5-second countdown and resets both players to Not Ready with a fresh 30-second Ready window. |
| `match.leave_prematch` | Challenge / Ready page before Active Match. | room ID, player ID. | Matchmaking Module. | Cancels/releases room and returns remaining player with `Opponent left.` |
| `answer.submit` | Active Match. | match ID, player ID, displayed answer string. | Live Match Module. | Server timestamps receipt, validates eligibility, compares answer, and emits accepted/rejected or combat events. |
| `defend.activate` | Active Match. | match ID, player ID. | Live Match Module. | Server timestamps receipt and activates DEFEND only if available and legal. |
| `match.quit` | Active Match. | match ID, player ID. | Live Match Module. | PvP enters reconnect/return grace; PvC voids through PvC quit flow after confirmation. |
| `reconnect.resume` | Reconnecting client. | match ID, player ID, session identity. | Live Match Module. | Reattaches player if the reconnect window is still open. |
| `rematch.request` | PvP Results. | match ID or results session ID, player ID. | Live Match Module or Matchmaking Module. | Marks rematch requested and waits for the opponent. |
| `rematch.respond` | PvP Results. | match ID or results session ID, player ID, response `accept` or `decline`. | Live Match Module or Matchmaking Module. | If both accept, creates a fresh Challenge / Ready flow; otherwise shows rematch not accepted. |
| `community_chat.send` | Community Chat. | sender player ID, message text. | Backend Community Chat runtime handler. | Validates length, censors offensive language, stores in latest-50 runtime buffer, and broadcasts censored message. |

Server-to-client realtime events:

| Event | Emitted By | Meaning / Required Use |
| --- | --- | --- |
| `queue.updated` | Matchmaking Module. | Queue state changed for the waiting player. |
| `room.full` | Matchmaking Module. | Room cap reached; client shows `Game rooms are full. Please return in 5 minutes.` |
| `room.assigned` | Matchmaking Module. | Two players are assigned to a room and should route to Challenge / Ready. |
| `private_invite.received` | Matchmaking Module. | Invited friend sees `___ challenges you to a duel`. |
| `private_invite.expired` | Matchmaking Module. | Inviter sees `Invitation not accepted.`; invited friend may see `You have declined the challenge.` |
| `ready.state` | Matchmaking Module. | Ready / Not Ready state, Ready window remaining time, and countdown state changed. |
| `match.countdown` | Matchmaking Module. | 5-second match countdown is active or reset. |
| `prematch.cancelled` | Matchmaking Module. | Challenge / Ready room was cancelled before Active Match; remaining player sees `Opponent left.` |
| `match.started` | Live Match Module. | Active Match runtime state is created and clients route to Active Match. |
| `round.prep.started` | Live Match Module. | 3-second round prep begins: question type, difficulty, then `Ready... Go!`. |
| `round.started` | Live Match Module. | A 60-second fight round begins. |
| `question.constructing` | Live Match Module. | Prompt construction animation data is available for the client presentation layer. |
| `question.started` | Live Match Module. | Prompt construction is complete; 6-second question timer and attack power movement begin. |
| `answer.accepted` | Live Match Module. | Submitted answer was eligible and processed. |
| `answer.rejected` | Live Match Module. | Submitted answer was late, locked out, invalid for phase, or otherwise ineligible. |
| `missed` | Live Match Module. | Wrong answer triggered `MISSED!` and lockout. |
| `shock.applied` | Live Match Module. | Timeout/no-action rule applied `SHOCK!` HP loss. |
| `attack.landed` | Live Match Module. | Damage landed and HP should update to authoritative value. |
| `draw.triggered` | Live Match Module. | Same-time answers created `DRAW!` and armed `Additional DMG`. |
| `tie_breaker.applied` | Live Match Module. | `Additional DMG` was consumed on the next exchange. |
| `defend.activated` | Live Match Module. | DEFEND active window started. |
| `defend.blocked` | Live Match Module. | DEFEND absorbed incoming damage. |
| `stun.applied` | Live Match Module. | Successful DEFEND stunned the attacker. |
| `revenge.gauge_changed` | Live Match Module. | Incoming-hit revenge gauge changed. |
| `revenge.activated` | Live Match Module. | Revenge becomes available on the next question. |
| `revenge.attack_landed` | Live Match Module. | Revenge attack landed and should show revenge presentation. |
| `round.ended` | Live Match Module. | Fight round ended with winner or tie. |
| `reconnect.paused` | Live Match Module. | PvP match paused for reconnect/return countdown. |
| `reconnect.resumed` | Live Match Module. | Player returned; show `Player connected!` and 5-second resume countdown. |
| `match.voided` | Live Match Module. | Match was voided due to failed reconnect, quit, or PvC disconnect handling. |
| `match.ended` | Live Match Module. | Match ended with winner, loss, mutual final-round loss, or void. |
| `results.ready` | Live Match Module / Match Summary Module. | Results payload is ready for the results page. |
| `rematch.state` | Live Match Module or Matchmaking Module. | Rematch request/acceptance state changed. |
| `community_chat.message` | Backend Community Chat runtime handler. | Censored Community Chat message is broadcast with sender selected identity image, username, text, and Singapore-time display timestamp. |

Internal module handoffs:

| Handoff | From | To | Minimum Payload | Result |
| --- | --- | --- | --- | --- |
| `live_match.create` | Matchmaking Module. | Live Match Module. | room ID, match ID, PvP mode/private flag, p1 player ID, p2 player ID, player display data needed for runtime, match start timestamp. | Live Match Module creates authoritative runtime match state. |
| `question.generate` | Live Match Module. | Question Generation Module. | match ID, round number, match mode, selected question type, selected difficulty, comeback Easy flag, CPU-specific difficulty pressure flags if applicable. | Question Generation Module returns prompt, prompt parts, expected answer, and question metadata. |
| `cpu.action.request` | Live Match Module. | CPU Opponent Module. | match ID, CPU key, current question metadata, combat state summary, server timestamp. | CPU Opponent Module returns answer, DEFEND, wait, or no-action decision. |
| `match.summary.finalize` | Live Match Module. | Match Summary Module. | match ID, mode, private flag if PvP, status, player IDs, winner ID nullable, D/C player nullable, void reason nullable, started/ended timestamps, runtime correct answers, answer attempts, longest streak, runtime Aura gain values, CPU key and PvC win flag when applicable. | Match Summary Module writes durable PvP summary, Aura update, or PvC CPU progress update. |
| `results.summary.return` | Match Summary Module. | Live Match Module / client-facing results flow. | persisted outcome confirmation and result payload values needed by the results page. | Results page can display final outcome and progression updates. |

REST API groups:

| API Group | Primary Module | MVP Purpose |
| --- | --- | --- |
| Auth APIs | Auth Module. | Signup, login, session/account status, unique username/email validation. |
| Profile APIs | Player Profile Module. | Profile picture upload, username change, email change, password change, language preference, tutorial completion, last active timestamp, Aura total reads. |
| Friends APIs | Friends Management Module. | Friend list, exact/partial player search, autocomplete, friend request send/accept/decline, remove friend, friend display data. |
| Stats / Leaderboard APIs | Stats / Leaderboard Module. | 1P Stats, PvP derived stats, D/C count, CPU progress display, global leaderboard, friend-filtered leaderboard, pinned player rank. |
| CPU Progress APIs | Stats / Leaderboard Module. | CPU select/VS unlock state, CPU defeat counts, unlock progress. |
| Legal / Localization Resource APIs | Client/shared resource layer or relevant app service. | Legal page content and language resources when not bundled statically. |

Standard error behavior:

- server errors should be explicit and machine-readable.
- player-facing text can be localized separately from error codes.
- rejected realtime actions should not mutate match-critical state.
- duplicate gameplay actions for the same resolved question should be rejected or ignored idempotently.
- unauthorized room/match access should be rejected.

Recommended error codes:

- `INVALID_PAYLOAD`.
- `UNAUTHORIZED`.
- `NOT_ROOM_MEMBER`.
- `ROOM_NOT_FOUND`.
- `ROOM_CAP_REACHED`.
- `INVITE_EXPIRED`.
- `READY_WINDOW_CLOSED`.
- `MATCH_NOT_ACTIVE`.
- `INVALID_COMMAND_FOR_PHASE`.
- `QUESTION_NOT_ACTIVE`.
- `ACTION_LOCKED_OUT`.
- `ANSWER_AFTER_TIMEOUT`.
- `DEFEND_UNAVAILABLE`.
- `DUPLICATE_ACTION`.
- `RECONNECT_WINDOW_EXPIRED`.

Reconnect and void event rules:

- PvP quit/disconnect emits `reconnect.paused` and pauses the active match for both players.
- the reconnect / return window is 10 seconds.
- a successful return emits `reconnect.resumed`, then a 5-second resume countdown.
- failed return emits `match.voided`, then `match.ended` / `results.ready`.
- the disconnected or quitting player is persisted as the D/C player for PvP voids.
- PvC sudden disconnect does not use this reconnect sequence and immediately follows the PvC void result path.

Implementation notes:

- this contract is intentionally high-level and may be translated into exact TypeScript types during implementation.
- event names should remain stable enough for frontend, backend, and tests to share expectations.
- exact runtime cache structures, HTTP route paths, and Socket.IO event/type shapes remain implementation details unless later accepted into PRD scope.

<a href="#table-of-contents">Back to Table of Contents</a>

<a id="feature-excalibur-scene-hud-presentation-event-contract"></a>

### ix. Excalibur Scene / HUD Presentation Event Contract

The Excalibur Scene / HUD Presentation Event Contract defines how the browser-loaded Active Match Host and Excalibur game scene consume authoritative server/domain events and turn them into readable gameplay presentation.

It does not define gameplay truth. Browser-loaded Active Match Host collects local active-match input, owns the browser-side Socket.IO/WebSocket bridge, and passes presentation updates into Excalibur. Excalibur displays state and animates events. They do not decide answer validity, damage, DEFEND success, revenge activation, round winners, match winners, Aura, or persistence outcomes.

Presentation principles:

- authoritative gameplay state comes from Live Match Module events.
- backend realtime events reach the browser through Nginx and the Socket.IO/WebSocket Client, not through the Next.js server.
- Active Match Host receives backend events and passes presentation updates into Excalibur.
- Excalibur should render the latest authoritative state plus short-lived presentation effects.
- animations may ease, delay, or emphasize visual moments, but must not change HP truth, timers, lockouts, or results.
- local answer typing may be displayed optimistically, but submitted answer acceptance/rejection comes from the server.
- the HUD should remain readable over every MVP background.
- visual effects should prioritize combat clarity over decoration.
- presentation state should be reset cleanly between questions, fight rounds, matches, rematches, reconnects, and results.

Recommended Excalibur scene areas:

| Scene Area | Owns | Inputs | Output |
| --- | --- | --- | --- |
| `MatchScene` | Overall active-match scene lifecycle, background, camera/screen shake, scene reset, and transition to results. | `match.started`, `round.prep.started`, `round.started`, `match.ended`, `match.voided`. | Active gameplay scene display and route transition request. |
| `CombatantView` | Avatar sprite/state, attack motion, hit reaction, win/lose pose, injury pose, revenge aura, shield overlay, stun mark. | combatant state snapshots and combat events. | Left/right combatant presentation. |
| `HudView` | HP bars, DEFEND button state, attack status bar, revenge gauge, state status bar, fight-round timer, quit button. | authoritative match state and status events. | Stable gameplay HUD. |
| `QuestionView` | Prompt item construction, prompt display, attack power bar, question timer, input displays. | `question.constructing`, `question.started`, local input state, answer events. | Center play area presentation. |
| `OverlayView` | `MISSED!`, `SHOCK!`, `DRAW!`, `TIE-BREAKER!`, `Revenge ATT!`, `CRITICAL!`, `DEFENDER!`, reconnect and pause overlays. | presentation events and reconnect events. | Short-lived callouts and modal overlays. |
| `ResultsTransitionView` | End-of-match transition moment before results page routing. | `round.ended`, `match.ended`, `results.ready`. | Win/loss/void transition display. |

Authoritative state-to-HUD mapping:

| State / Event | HUD / Scene Response |
| --- | --- |
| fight-round timer update | Update visible timer; do not show active-play fight score / round-win score for MVP. |
| HP update | Update HP bar to authoritative HP value and color band; display damage number only for new damage events. |
| DEFEND available | Show DEFEND button colored and bold. |
| DEFEND unavailable | Show DEFEND button greyed out or translucent. |
| `defend.activated` | Show `DEFEND` state label and `1s` receding bar; prevent local answer submission UI until server state allows action again. |
| `defend.blocked` | Show shield flash/overlay and block feedback; show `DEFENDER!` when a revenge attack was blocked. |
| `missed` | Show `MISSED!`, wrong-answer shake/tint, and `1s` receding lockout bar. |
| `shock.applied` | Show `SHOCK!`, electric burst, HP deduction, and momentary state feedback. |
| `stun.applied` | Show `STUNNED` and `1.5s` receding bar on the stunned attacker. |
| `revenge.gauge_changed` | Update 5-block revenge gauge from authoritative count. |
| `revenge.activated` | Show full glowing/throbbing revenge gauge and fire aura. |
| `revenge.attack_landed` | Show `Revenge ATT!` and blinding white impact burst. |
| `attack.landed` | Animate attacker motion, victim hit reaction, HP bar update, and `-___ HP` damage value. |
| `draw.triggered` | Show `DRAW!` and indicate `Additional DMG` is armed. |
| `tie_breaker.applied` | Show `TIE-BREAKER!` and clear carryover display after the exchange. |
| `round.prep.started` | Show type spin, difficulty spin, and `Ready... Go!` sequence. |
| `question.constructing` | Fly prompt items in sequentially from the provided or generated top/bottom direction data. |
| `question.started` | Start local visual question timer and attack power animation synced to server timing. |
| `answer.accepted` | Clear or lock submitted input display according to authoritative result. |
| `answer.rejected` | Keep HUD aligned with server state; do not apply damage or success effects. |
| `reconnect.paused` | Pause active gameplay presentation and show reconnect / return countdown overlay. |
| `reconnect.resumed` | Show `Player connected!` and 5-second resume countdown. |
| `match.voided` | Stop combat presentation and route toward voided results state. |

Prompt and attack power presentation rules:

- `question.constructing` starts the visual prompt construction sequence.
- prompt parts appear item by item in the same order as the arithmetic prompt.
- each prompt part flies in from top or bottom according to the presentation data for that question.
- if direction data is not supplied by the server, the client may generate the 50/50 top/bottom presentation choice locally because direction is visual-only.
- `question.started` marks the moment the prompt is fully readable and the 6-second question timer begins.
- the attack power bar visually starts at `1` on `question.started`.
- the attack power indicator reaches `30` over the first 5 seconds and remains at `30` for the final 1 second.
- local animation timing should resync to server timestamps if drift is detected.

Input presentation rules:

- active gameplay input accepts only number keys, `-`, Spacebar, and Enter.
- local input display shows only numbers and `-`.
- Enter sends `answer.submit`.
- Spacebar sends `defend.activate` when server/local state indicates DEFEND is available.
- local input should be disabled or ignored when authoritative state says the player is in active DEFEND, `MISSED!` lockout, `STUNNED`, reconnect pause, match end, or invalid phase.
- if the client is unsure whether input is legal, it may send the action, but it must obey the server's accepted/rejected response.

Animation timing guidance:

| Moment | Presentation Timing |
| --- | --- |
| successful attack | Start attacker motion immediately after authoritative event receipt. |
| hit reaction | Trigger almost immediately after attack motion begins. |
| HP bar update | Update with the hit reaction using authoritative HP value. |
| damage number | Show near the damaged combatant during the hit reaction. |
| successful DEFEND | Show shield flash at block moment, then stun marker on attacker. |
| revenge attack | Use fire aura while active, then blinding white impact burst when revenge lands. |
| high-impact attack | Use heavier attack motion and optional screen shake. |
| wrong answer | Use shake or tint, but do not imply HP loss unless the server sends damage. |
| round end | Hold enough time for result readability, then transition to next round prep or results. |

Presentation event queue rules:

- short-lived effects should be queued and played in server event order.
- HP, timers, status effects, and result state should always snap or reconcile to the latest authoritative state.
- if an old animation is still playing when a newer authoritative state arrives, the newer state wins.
- reconnect pause should stop gameplay animations that imply active combat, except for pause/reconnect overlay animations.
- rematch should clear all previous match presentation effects and create fresh scene state.

Performance / asset loading rules:

- Active Match Host should preload the visual assets needed for the active match before live combat begins.
- active-match asset preload should include the required combatant state assets, background assets, effect assets, HUD assets, and any audio assets accepted for MVP.
- live combat presentation should use already-loaded browser assets instead of waiting on new image/effect fetches during answer, DEFEND, damage, revenge, or reconnect moments.
- Excalibur scene/view modules should reuse loaded assets and long-lived actors/effect pools where practical instead of repeatedly creating heavyweight objects during active combat.
- backend realtime events should stay compact and carry authoritative gameplay state or event data, not image files, large asset payloads, full profile records, or complete match history.
- Active Match Host / Excalibur may map compact backend event names and state snapshots to local presentation assets and animations.
- asset loading failures should fail into a readable fallback presentation rather than blocking authoritative gameplay state updates.
- frontend performance verification should include checking that no required active-combat visual asset is first fetched during the 6-second question timer, damage impact, DEFEND, revenge, or reconnect overlay path.

Frontend verification checkpoints:

| Test Area | Required Coverage |
| --- | --- |
| Prompt construction | Prompt parts appear sequentially and the attack power bar starts only after the final prompt item appears. |
| Attack power display | Bar moves from `1` to `30` over 5 seconds and stays at `30` for the final second. |
| HP display | HP bar uses authoritative HP, supports decimals, and changes yellow/orange/red bands at PRD thresholds. |
| DEFEND display | Available, unavailable, active, blocked, and cooldown states are visually distinct. |
| Lockout bars | `MISSED!`, `DEFEND`, and `STUNNED` show receding bars with correct durations. |
| Revenge display | Gauge fills from incoming-hit events, full gauge glows/throbs, and active revenge shows fire aura. |
| Combat callouts | `DRAW!`, `TIE-BREAKER!`, `Revenge ATT!`, `CRITICAL!`, and `DEFENDER!` appear only from authoritative events. |
| Reconnect overlay | PvP pause, reconnect countdown, successful return, resume countdown, and void path are displayed. |
| Input filtering | Active gameplay accepts only number keys, `-`, Spacebar, and Enter. |
| Asset preload | Required active-match assets are loaded before live combat moments that need them. |
| Layout readability | HUD remains readable over all MVP backgrounds on desktop and mobile. |

Implementation notes:

- Excalibur scene graph, component names, animation durations beyond locked gameplay timers, and exact easing curves remain implementation details.
- The frontend may use non-Excalibur UI components for page chrome or overlays where appropriate, but Active Match combat presentation should use Excalibur for the gameplay scene.
- Any visual-only timing or easing must be documented in frontend code if it could be mistaken for gameplay timing.

<a href="#table-of-contents">Back to Table of Contents</a>
