# My Server Comprehension Journal

## Contents

- [Browser Communication: HTTP And HTTPS](#browser-communication-http-and-https)
- [Common HTTP Methods](#common-http-methods)
- [REST API And Request/Response Contracts](#rest-api-and-requestresponse-contracts)
- [Modules And Microservices](#modules-and-microservices)
- [Shared Code And Per-Match Runtime State](#shared-code-and-per-match-runtime-state)
- [Browser, Frontend, And Excalibur](#browser-frontend-and-excalibur)
- [Backend Folders And Game Modules](#backend-folders-and-game-modules)

## Browser Communication: HTTP And HTTPS

Date: 2026-06-06

### What I Understand Now

The browser communicates with web apps using HTTP-style requests and responses.

HTTP is the communication protocol. It is like the agreed language/format the browser and server use to talk.

HTTPS is not a totally different app-language. HTTPS is HTTP carried through a secure encrypted layer.

Simple way to remember:

- HTTP tells the browser and server how to structure the conversation.
- HTTPS protects that conversation while it travels over the network.

So it is okay to say "HTTP request" even when the real deployed URL uses `https://`. The request is still an HTTP request, just secured by HTTPS.

### Browser To Frontend And Backend

The browser can use HTTP/HTTPS to request:

- frontend pages and assets, such as HTML, JavaScript, CSS, and images.
- backend REST API data, such as login, profile, stats, or match history.

For live gameplay, the browser can also open a WebSocket / Socket.IO connection after the page loads. That is used when the backend must push realtime updates immediately.

## Common HTTP Methods

Date: 2026-06-06

### What I Understand Now

HTTP methods are verbs. They tell the server what kind of action the browser/client wants.

| Method | Common Use | Example Meaning |
| --- | --- | --- |
| `GET` | Read or fetch data. | Get the player's profile or get leaderboard rows. |
| `POST` | Create something or submit an action. | Submit login details or create a friend request. |
| `PUT` | Replace a whole resource. | Replace the full profile settings object. |
| `PATCH` | Update part of a resource. | Change only the player's language preference. |
| `DELETE` | Remove something. | Remove a friend or delete a saved item. |

Example:

```text
POST /auth/login
```

This means:

- `POST`: I am submitting data.
- `/auth/login`: I am submitting it to the login endpoint.
- the request body usually carries the login data.

The request body is often JSON, for example:

```json
{
  "username": "player1",
  "password": "secret"
}
```

## REST API And Request/Response Contracts

Date: 2026-06-06

### What I Understand Now

REST API stands for Representational State Transfer Application Programming Interface.

API means an interface that lets one part of the app communicate with another part.

REST is a style of designing that communication around resources and HTTP methods.

A REST API is not only one specific code file. It is the agreement that:

- the frontend sends a request to a known endpoint.
- the request uses a method such as `GET` or `POST`.
- the request may include structured data, often JSON.
- the backend receives it, runs logic, and returns a structured response.

Simple way to remember:

```text
I give you this request shape.
You give me this response shape back.
```

That is why REST APIs feel like a contract.

Example:

```text
POST /auth/login
```

Request body:

```json
{
  "username": "player1",
  "password": "secret"
}
```

Possible response:

```json
{
  "userId": "123",
  "username": "player1",
  "session": "..."
}
```

For live match gameplay, REST is usually not the main tool because live gameplay needs immediate server-pushed updates. That is why live gameplay uses Socket.IO/WebSocket instead.

## Modules And Microservices

Date: 2026-06-06

### What I Understand Now

A module is an internal responsibility area inside the backend code.

A microservice is a separately running and separately deployable backend service. It usually has its own process/container boundary and communicates with other services over a network boundary.

So a file in `services/` is not automatically a microservice.

For MVP, question generator does not need to be a microservice. It can be an internal backend module/service file called by Live Match.

Simple way to remember:

- module: a section of code inside the backend.
- microservice: a separately running backend app/service.

Microservices are usually considered when there is a real need, such as:

- one part must scale independently.
- one part has very different performance needs.
- one part must be deployed separately.
- one part has separate ownership or failure boundaries.

For MVP, the app can use one backend container with internal modules.

## Shared Code And Per-Match Runtime State

Date: 2026-06-06

### What I Understand Now

The same question generator code can serve multiple rooms because the code is shared, but the match state is separate.

The question generator should not store room-specific truth inside itself.

Instead:

- Live Match owns each match session's runtime state.
- Question Generator is called when a match needs a new question.
- The generated question is then stored inside that match's runtime state.

So if there are 10 rooms, the backend does not need 10 different question-generator code files.

It needs:

- one reusable question generator module.
- 10 separate live match session states.

This is why the generator should stay mostly stateless/lightweight.

## Browser, Frontend, And Excalibur

Date: 2026-06-06

### What I Understand Now

Excalibur is not separate from the browser in runtime terms. It is a frontend game engine library that runs inside the browser.

The browser loads frontend code.

That frontend code can include:

- React + Next.js page code.
- Active Match Host code.
- Excalibur game scene code.
- Socket.IO/WebSocket client code.

Excalibur renders the game scene, HUD, effects, and local input presentation.

But Excalibur does not decide backend truth.

The backend Live Match module decides match-critical truth such as:

- whether an answer is accepted.
- how much damage lands.
- whether DEFEND worked.
- current HP truth.
- round winner.
- match winner.

Simple way to remember:

```text
Excalibur shows the fight.
Live Match decides the fight.
```

The browser may cache or load visual assets so the match feels smooth, but this is not the same as copying backend logic into the browser. The backend remains authoritative for live gameplay truth.

<a id="backend-folders-and-game-modules"></a>

## Locked Understanding: Backend Folders And Game Modules

Date: 2026-06-06

### What I Understand Now

My game-code work is not only one isolated file. It naturally overlaps with the full match lifecycle:

- pre-match: preparing rooms, ready state, countdowns, and handoff into the match.
- live match: questions, CPU behavior, answers, HP, DEFEND, revenge, round results, and match results.
- post-match: final result summary, Aura gain, CPU progress/unlock updates, and persistence handoff.

This overlap is normal. It does not mean the game code is badly scoped. It means the game has a lifecycle.

### The Main Mental Model

In this backend structure, `services/` is where the actual feature logic lives.

For game work, `services/` is the best place to start reading because it contains the logic, computation, and rules that govern a feature.

The other folders are mostly boundaries, support, or glue around the services.

| Folder | My Understanding |
| --- | --- |
| `services/` | The actual feature logic. This is where the backend "brain" usually lives. |
| `config/` | Tunable settings and constants that services read, such as CPU personality numbers. |
| `socket/` | Realtime communication glue for Socket.IO/WebSocket events, especially live gameplay. |
| `routes/` | HTTP REST address mapping, such as deciding which URL goes to which handler. |
| `controllers/` | HTTP request/response handlers that receive a request, call a service, and send back a response. |
| `middleware/` | Shared checks before a request reaches the controller, such as auth, validation, or rate limiting. |
| `packages/shared/` | Shared TypeScript contract shapes so frontend and backend agree on payloads/events. |

### How This Applies To Game Modules

For game-related modules like pre-match, live match, post-match, question generation, and CPU opponent behavior, the main work is mostly:

- `services/` for the rules and logic.
- `socket/` for realtime gameplay communication.
- `config/` for tunable game constants.
- `packages/shared/` for frontend/backend contract shapes.

Controllers and routes are not usually the center of live gameplay.

Controllers and routes become relevant when the frontend needs slower REST-style page data, such as:

- match history.
- stats.
- leaderboard.
- CPU progress.
- final saved match summary.

Middleware becomes relevant when a shared check is needed, such as:

- whether the player is logged in.
- whether the player is allowed to join a room or match.
- whether a payload is valid.
- whether a user is sending requests too quickly.

### Simple Sentence To Remember

`services/` are the brain, `socket/` is the realtime conversation, `routes/controllers` are normal HTTP doors, `middleware` is the checkpoint, and `config` is the tuning board.

### Current Build Direction

For my game-code focus, it makes sense to understand and build in this order:

1. Question Generator Service.
2. CPU Opponent Service and CPU Opponent Config.
3. Live Match Service.
4. Match Summary Service.
5. Pre-match / Matchmaking Service.
6. Socket wiring between frontend actions and backend services.

This order helps me understand the directory structure through the actual game lifecycle instead of trying to memorize the folders abstractly.
