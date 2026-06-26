# Game Asset Library

This folder consolidates the assets currently used by the NeXT Duel playable demo so the final game handoff has one server-side reference set.

The live Demo 6 React client still reads from `apps/client/public/assets/game/...`; these files are copied here as a curated library, not moved.

## Folders

- `backgrounds/` - arena and page background images.
- `audio/music/` - loopable game music.
- `audio/sfx/` - combat and UI sound effects.
- `avatars/` - avatar manifests. Current avatars are emoji-based, so they are stored as JSON metadata.
- `effects/` - visual effect sprites/textures available for future rendering work.

## Current Demo 6 Asset Map

- Background: `backgrounds/math-arena-audience-v3.png`
- Alternate background: `backgrounds/tech-room-arena-v1.png`
- Alternate background: `backgrounds/tech-wall-arena-v1.png`
- Alternate background: `backgrounds/campus-entrance-arena-v1.png`
- Music: `audio/music/active-match-theme.mp3`
- SFX:
  - `audio/sfx/correct-hit.ogg`
  - `audio/sfx/wrong-answer.ogg`
  - `audio/sfx/shock.ogg`
  - `audio/sfx/revenge-ready.ogg`
  - `audio/sfx/defend-activate.ogg`
  - `audio/sfx/defend-success.ogg`
  - `audio/sfx/revenge-hit-heavy.ogg`
  - `audio/sfx/clash.ogg`
- Avatars: `avatars/emoji-avatars.json`
- Effects:
  - `effects/shock-burst.png`
  - `effects/clash-trace.png`
