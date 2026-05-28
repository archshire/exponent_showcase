# Database Schema

## Overview

PostgreSQL database managed via Prisma ORM. The schema consists of four tables: `user`, `player`, `match`, and `friend`. A `user` represents an authenticated account, while `player` holds gameplay-specific data linked one-to-one with a user.

## Tables

### user

| Column        | Type          | Constraints                  | Description                  |
|---------------|---------------|------------------------------|------------------------------|
| user_id       | INT           | PRIMARY KEY, AUTO_INCREMENT  | Unique user identifier       |
| username      | VARCHAR(50)   | UNIQUE, NOT NULL             | Display name                 |
| password_hash | VARCHAR(255)  | NOT NULL                     | Bcrypt-hashed password       |
| email         | VARCHAR(250)  | UNIQUE, NOT NULL             | User email address           |
| created_at    | TIMESTAMP     | NOT NULL, DEFAULT NOW()      | Account creation time        |
| last_login    | TIMESTAMP     |                              | Last successful login        |
| status        | VARCHAR(10)   | NOT NULL, DEFAULT 'offline'  | Online presence status       |

### player

| Column          | Type          | Constraints                         | Description                        |
|-----------------|---------------|-------------------------------------|------------------------------------|
| player_id       | INT           | PRIMARY KEY, AUTO_INCREMENT         | Unique player identifier           |
| user_id         | INT           | UNIQUE, NOT NULL, FK → user.user_id | Linked user account                |
| mmr             | INT           | NOT NULL, DEFAULT 0                 | Matchmaking rating                 |
| experience      | INT           | NOT NULL, DEFAULT 0                 | Total experience points            |
| level           | INT           | NOT NULL, DEFAULT 1                 | Current level                      |
| attribute       | INT           | NOT NULL, DEFAULT 0                 | Player attribute score             |
| avatar          | VARCHAR(100)  |                                     | Avatar image path or URL           |
| wins            | INT           | NOT NULL, DEFAULT 0                 | Total matches won                  |
| matches_played  | INT           | NOT NULL, DEFAULT 0                 | Total matches played               |
| avg_time_played | INT           | NOT NULL, DEFAULT 0                 | Average match duration (seconds)   |

### match

| Column      | Type    | Constraints                     | Description                     |
|-------------|---------|---------------------------------|---------------------------------|
| session_id | INT | PRIMARY KEY, AUTO_INCREMENT     | Unique match session identifier  |
| player1_id | INT | NOT NULL, FK → player.player_id | First player in the match        |
| player2_id | INT | NOT NULL, FK → player.player_id | Second player in the match       |
| duration   | INT | NOT NULL                        | Match duration in seconds        |
| winner_id  | INT | NOT NULL, FK → player.player_id | Player who won the match         |

### friend

| Column    | Type        | Constraints                      | Description                             |
|-----------|-------------|----------------------------------|-----------------------------------------|
| id        | INT         | PRIMARY KEY, AUTO_INCREMENT      | Unique friendship record identifier     |
| player_id | INT         | NOT NULL, FK → player.player_id  | Player who sent the friend request      |
| friend_id | INT         | NOT NULL, FK → player.player_id  | Player who received the request         |
| status    | VARCHAR(10) | NOT NULL, DEFAULT 'pending'      | Request status: `pending` or `accepted` |

## Relationships

### User → Player
- One-to-one: each `user` has at most one `player` profile
- `player.user_id` → `user.user_id` (CASCADE DELETE)

### Player → Match
- A player can participate in many matches as either player1 or player2
- `match.player1_id` → `player.player_id` (CASCADE DELETE)
- `match.player2_id` → `player.player_id` (CASCADE DELETE)
- `match.winner_id` → `player.player_id` — records who won the match

### Player → Friend
- Many-to-many (self-referential via `friend` table)
- `friend.player_id` → `player.player_id` — the requester
- `friend.friend_id` → `player.player_id` — the recipient
- Unique constraint on `(player_id, friend_id)` prevents duplicate entries
- A player cannot add themselves as a friend

## Constraints

- All primary keys are auto-incremented integers
- `user.username` and `user.email` are globally unique
- `player.user_id` is unique (enforces one-to-one with `user`)
- `friend.(player_id, friend_id)` composite unique — no duplicate friend requests
- `friend.status` is limited to `pending` or `accepted`

## Entity-Relationship Diagram

```
user (user_id PK)
 └── player (player_id PK, user_id FK) [1:1]
      ├── match (session_id PK, player1_id FK, player2_id FK, winner_id FK) [M:N via two players]
      └── friend (id PK, player_id FK, friend_id FK) [self-referential M:N]
```

## Database Design Notes

- Managed by **Prisma ORM** — schema source of truth is `packages/db/prisma/schema.prisma`
- `duration` in `match` is stored as `INT` (seconds) rather than PostgreSQL `INTERVAL` for ORM compatibility
- `status` fields use `VARCHAR(10)` with application-level validation
- CASCADE DELETE is applied throughout — deleting a `user` removes their `player`, `match`, and `friend` records
