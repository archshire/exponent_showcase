# Integration Contract Guide

This folder stores human-readable contracts for how the app's parts connect.

A contract is not only an endpoint list. It is the agreement between two parts of the system:

- who calls whom.
- what information must be sent.
- what information comes back.
- who owns the final decision.
- what should happen when the request/action is rejected.

## Current Contract Set

| Contract | Purpose |
| --- | --- |
| [live-match.md](live-match.md) | Defines the active match runtime boundary, including current backend events and future Socket.IO integration points. |
| [matchmaking.md](matchmaking.md) | Defines the pre-match room/start boundary before handoff into Live Match. |
| [question-generator.md](question-generator.md) | Defines how Live Match asks for prompt truth and answer validation. |
| [cpu-opponent.md](cpu-opponent.md) | Defines how Live Match asks CPU opponents for behavior decisions. |
| [match-summary.md](match-summary.md) | Defines the final match result handoff to persistence and results display. |

## Standard Contract Sections

Each contract should use these sections where useful:

| Section | Meaning |
| --- | --- |
| Purpose | Why this boundary exists. |
| Owner | Which module owns the decision or truth. |
| Participants | Which parts send or receive information. |
| Does Not Own | What must stay outside this contract. |
| Inputs | What the caller sends. |
| Outputs | What the callee returns or emits. |
| Rejections / Errors | What happens when the request is invalid or not allowed. |
| Open Items | Known unfinished integration work. |

## Relationship To TypeScript Contracts

These docs are for human agreement. Later, stable payloads should be mirrored as TypeScript types in `packages/shared/src/contracts/` so both frontend and backend can import the same shapes.

When the TypeScript contracts are added, this folder should still explain the "why" and flow, while `packages/shared` enforces the exact code shape.
