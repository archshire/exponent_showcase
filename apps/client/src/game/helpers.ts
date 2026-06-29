import type { TranslationKey } from '@/i18n/translations';
import type {
  GameCombatant,
  GameEvent,
  GameSlot,
  GameSnapshot,
  GameSummary,
  PlayerPresentation,
} from './types';
import {
  AUDIO_EVENT_NAMES,
  CPU_AVATARS,
  DAMAGE_EVENT_NAMES,
  VISUAL_EVENT_NAMES,
} from './constants';
import { readNumberPayload, readSlotPayload } from './event-helpers';

export function getOrCreatePlayerId(): string {
  const key = 'next-duel-game-player-id';
  const existing = window.localStorage.getItem(key);
  if (existing !== null) {
    return existing;
  }

  const next = `player-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(key, next);
  return next;
}

export function inferPlayerSlot(
  snapshot: GameSnapshot | null,
  playerId: string
): GameSlot | undefined {
  if (snapshot?.playerSlot !== undefined) {
    return snapshot.playerSlot;
  }

  if (snapshot?.readyState?.p1PlayerId === playerId) {
    return 'p1';
  }

  if (snapshot?.readyState?.p2PlayerId === playerId) {
    return 'p2';
  }

  if (snapshot?.combatants?.p1.id === playerId) {
    return 'p1';
  }

  if (snapshot?.combatants?.p2.id === playerId) {
    return 'p2';
  }

  return undefined;
}

export function labelFor(combatant: GameCombatant, playerId: string): string {
  if (combatant.id === playerId) {
    return combatant.slot.toUpperCase();
  }

  if (combatant.driver === 'cpu') {
    return combatant.id.replace('cpu:', '').toUpperCase();
  }

  return combatant.slot.toUpperCase();
}

// Battle token for a combatant: humans use the shared chosen avatar (so both
// players see the same tokens); CPUs keep their themed emoji.
export function avatarFor(
  combatant: GameCombatant,
  players: Record<string, PlayerPresentation> | undefined
): string {
  const pres = players?.[combatant.id];
  if (pres !== undefined && !pres.isCpu) {
    return pres.avatar;
  }
  if (combatant.driver === 'cpu') {
    return CPU_AVATARS[combatant.id] ?? '👊';
  }
  return pres?.avatar ?? '❔';
}

export function isLocked(combatant: GameCombatant, now: number): boolean {
  return combatant.statusEffects.some((effect) => effect.endsAtMs > now);
}

// Locks typing entirely (stunned / missed). Defend does NOT hard-lock — the
// player can pre-type an answer while shielding but can't submit until it expires.
export function isHardLocked(combatant: GameCombatant, now: number): boolean {
  return combatant.statusEffects.some(
    (e) => e.endsAtMs > now && (e.type === 'stunned' || e.type === 'missed')
  );
}

export function winnerText(
  t: (key: TranslationKey) => string,
  summary: GameSummary,
  playerId: string
): string {
  if (summary.status === 'voided') {
    return summary.dcCombatantId === playerId
      ? t('summary.youDisconnected')
      : t('summary.matchVoided');
  }

  if (summary.mutualFinalRoundLoss) {
    return t('summary.mutualLoss');
  }

  const winnerCombatantId = resolveWinnerCombatantId(summary);

  if (winnerCombatantId === undefined) {
    return t('summary.matchComplete');
  }

  return winnerCombatantId === playerId ? t('summary.youWin') : t('summary.youLose');
}

export function matchEndDetail(
  t: (key: TranslationKey) => string,
  summary: GameSummary,
  playerId: string,
  players?: Record<string, PlayerPresentation>
): string {
  if (summary.status === 'voided') {
    if (summary.dcCombatantId === playerId) {
      return t('summary.reconnectFailed');
    }
    if (summary.dcCombatantId !== undefined) {
      const name =
        players?.[summary.dcCombatantId]?.username ?? labelCombatantId(summary.dcCombatantId);
      return `${name} ${t('summary.disconnectedSuffix')}`;
    }
    return summary.voidReason === undefined
      ? t('summary.matchVoidedPlain')
      : summary.voidReason.replaceAll('_', ' ');
  }

  const winnerCombatantId = resolveWinnerCombatantId(summary);

  if (summary.mutualFinalRoundLoss) {
    return t('summary.noWinner');
  }

  if (winnerCombatantId === undefined) {
    return t('summary.matchComplete');
  }

  if (winnerCombatantId === playerId) {
    return t('summary.youWonMatch');
  }

  return `${players?.[winnerCombatantId]?.username ?? labelCombatantId(winnerCombatantId)} ${t('summary.winsSuffix')}`;
}

export function resolveWinnerCombatantId(summary: GameSummary): string | undefined {
  if (summary.status === 'voided') {
    return undefined;
  }

  if (summary.winnerCombatantId !== undefined) {
    return summary.winnerCombatantId;
  }

  const p1Hp = summary.combatants.p1.hp;
  const p2Hp = summary.combatants.p2.hp;

  if (p1Hp <= 0 && p2Hp > 0) {
    return summary.combatants.p2.combatantId;
  }

  if (p2Hp <= 0 && p1Hp > 0) {
    return summary.combatants.p1.combatantId;
  }

  return undefined;
}

export function labelCombatantId(combatantId: string): string {
  if (combatantId.startsWith('cpu:')) {
    const cpuName = combatantId.slice(4);
    return cpuName === 'shi_eld'
      ? 'Shi-eld'
      : `${cpuName.slice(0, 1).toUpperCase()}${cpuName.slice(1)}`;
  }

  return combatantId;
}

// "You" for the local player, the CPU's name (Min/Max/…) for a bot, or "Rival"
// for a human opponent — used to label per-player stats in the summary.
export function combatantLabel(
  t: (key: TranslationKey) => string,
  combatant: GameSummary['combatants'][GameSlot],
  playerId: string
): string {
  if (combatant.combatantId === playerId) return t('common.you');
  if (combatant.combatantId.startsWith('cpu:')) return labelCombatantId(combatant.combatantId);
  return t('summary.rival');
}

export function labelQuestionType(questionType: string): string {
  return questionType.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatPrompt(prompt: string): string {
  return prompt.replaceAll('*', '×').replaceAll('x', '×');
}

export function questionDisplayClass(prompt: string): string {
  const formatted = formatPrompt(prompt);
  const operatorCount = (formatted.match(/[+\-×]/g) ?? []).length;

  if (formatted.length >= 11 || operatorCount >= 3) {
    return 'compact';
  }

  if (formatted.length >= 8 || operatorCount >= 2) {
    return 'wide';
  }

  return '';
}

export function sanitizeAnswerInput(value: string): string {
  const cleaned = value.replace(/[^\d-]/g, '');
  const isNegative = cleaned.startsWith('-');
  const digits = cleaned.replace(/-/g, '');
  return isNegative ? `-${digits}` : digits;
}

export function eventKey(event: GameEvent): string {
  const attacker = readSlotPayload(event, 'attackerSlot') ?? '';
  const target = readSlotPayload(event, 'targetCombatantSlot') ?? '';
  const streak = readNumberPayload(event, 'attackerStreak') ?? '';
  const damage = readNumberPayload(event, 'damage') ?? '';
  return `${event.serverTimestampMs}-${event.name}-${attacker}-${target}-${streak}-${damage}`;
}

export function outcomeClass(event: GameEvent): string {
  if (event.name === 'attack.landed') {
    return readSlotPayload(event, 'attackerSlot') === 'p2' ? 'from-right' : 'from-left';
  }

  if (event.name === 'revenge.attack_landed') {
    return readSlotPayload(event, 'attackerSlot') === 'p2' ? 'revenge-right' : 'revenge-left';
  }

  if (event.name === 'defend.activated') {
    return 'defend';
  }

  if (event.name === 'defend.blocked') {
    return 'stunned';
  }

  if (event.name === 'missed') {
    return 'missed';
  }

  if (event.name === 'shock.applied') {
    return 'shock';
  }

  if (event.name === 'draw.triggered') {
    return 'draw';
  }

  return '';
}

export function outcomeMessage(
  t: (key: TranslationKey) => string,
  event: GameEvent,
  playerSlot?: GameSlot
): string {
  const mine = (slot?: GameSlot) => slot !== undefined && slot === playerSlot;
  // Streak multiplier suffix, e.g. " ×1.2" (omitted at 1×).
  const streak = (m?: number) => (m === undefined || m <= 1 ? '' : ` ×${formatCombatNumber(m)}`);

  switch (event.name) {
    case 'attack.landed': {
      const attacker = readSlotPayload(event, 'attackerSlot');
      const m = streak(readNumberPayload(event, 'streakMultiplier'));
      return mine(attacker) ? `${t('outcome.directHit')}${m}` : `${t('outcome.youreHit')}${m}`;
    }
    case 'revenge.attack_landed': {
      const attacker = readSlotPayload(event, 'attackerSlot');
      return mine(attacker) ? t('outcome.revengeStrike') : t('outcome.revengeIncoming');
    }
    case 'defend.activated': {
      const slot = readSlotPayload(event, 'combatantSlot');
      return mine(slot) ? t('outcome.shieldUp') : t('outcome.rivalShields');
    }
    case 'defend.blocked': {
      // defenderSlot blocked the attacker — good if that's you, painful if not.
      const defender = readSlotPayload(event, 'defenderSlot');
      return mine(defender) ? t('outcome.blockedNice') : t('outcome.blockedStunned');
    }
    case 'missed': {
      const slot = readSlotPayload(event, 'combatantSlot');
      return mine(slot) ? t('outcome.missed') : t('outcome.rivalFumbles');
    }
    case 'shock.applied':
      return t('outcome.bothShocked');
    case 'draw.triggered':
      return t('outcome.clashTiebreaker');
    default:
      return event.message;
  }
}

export function latestVisualEvent(eventLog: GameSnapshot['eventLog']): GameEvent | undefined {
  return eventLog?.find((event) => VISUAL_EVENT_NAMES.has(event.name));
}

export function latestDamageEvent(eventLog: GameSnapshot['eventLog']): GameEvent | undefined {
  return eventLog?.find((event) => DAMAGE_EVENT_NAMES.has(event.name));
}

export function latestAudioEvent(eventLog: GameSnapshot['eventLog']): GameEvent | undefined {
  return eventLog?.find((event) => AUDIO_EVENT_NAMES.has(event.name));
}

export function latestRoundPrepEvent(eventLog: GameSnapshot['eventLog']): GameEvent | undefined {
  return eventLog?.find((event) => event.name === 'round.prep.started');
}

export function formatCombatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
}

export function avatarPadClass(
  combatant: GameCombatant,
  slot: GameSlot,
  eventLog: GameSnapshot['eventLog'],
  now: number
): string {
  const classes = ['avatar-pad', slot];
  const hpPercent = (combatant.hp / combatant.maxHp) * 100;
  const latest = latestVisualEvent(eventLog);

  if (hpPercent <= 33) {
    classes.push('hp-critical');
  } else if (hpPercent <= 66) {
    classes.push('hp-danger');
  }

  if (combatant.revengeActive) {
    classes.push('revenge-ready');
  }

  if (combatant.statusEffects.some((effect) => effect.type === 'defend' && effect.endsAtMs > now)) {
    classes.push('defend');
  }

  if (
    combatant.statusEffects.some((effect) => effect.type === 'stunned' && effect.endsAtMs > now)
  ) {
    classes.push('stunned');
  }

  if (latest?.name === 'revenge.attack_landed') {
    const targetSlot = readSlotPayload(latest, 'targetCombatantSlot');
    const attackerSlot = readSlotPayload(latest, 'attackerSlot');
    if (targetSlot === slot) {
      classes.push(slot === 'p1' ? 'revenge-hit-left' : 'revenge-hit-right');
    }
    if (attackerSlot === slot) {
      classes.push(slot === 'p1' ? 'revenge-release-left' : 'revenge-release-right');
    }
  } else if (latest?.name === 'attack.landed') {
    const targetSlot = readSlotPayload(latest, 'targetCombatantSlot');
    if (targetSlot === slot) {
      classes.push(slot === 'p1' ? 'knock-left' : 'knock-right');
    }
  }

  if (latest?.name === 'defend.blocked' && readSlotPayload(latest, 'defenderSlot') === slot) {
    classes.push('block');
  }

  if (latest?.name === 'missed' && latest.message.toLowerCase().includes(slot)) {
    classes.push('missed-shake');
  }

  if (latest?.name === 'shock.applied') {
    classes.push('shock');
  }

  return classes.join(' ');
}

export function stageClassFor(eventLog: GameSnapshot['eventLog']): string {
  const latest = latestVisualEvent(eventLog);
  if (latest === undefined) {
    return '';
  }

  if (latest.name === 'shock.applied') {
    return 'stage-shock';
  }

  // Landing an attack shakes the arena — harder hits (and revenge) shake more.
  if (latest.name === 'attack.landed' || latest.name === 'revenge.attack_landed') {
    const damage = readNumberPayload(latest, 'damage') ?? 0;
    return latest.name === 'revenge.attack_landed' || damage >= 16
      ? 'stage-hit-strong'
      : 'stage-hit';
  }

  return '';
}

export function summaryClass(summary: GameSummary, playerId: string): string {
  if (summary.status === 'voided') {
    return summary.dcCombatantId === playerId ? 'lose' : 'draw';
  }

  const winnerCombatantId = resolveWinnerCombatantId(summary);

  if (summary.mutualFinalRoundLoss || winnerCombatantId === undefined) {
    return 'draw';
  }

  return winnerCombatantId === playerId ? 'win' : 'lose';
}
