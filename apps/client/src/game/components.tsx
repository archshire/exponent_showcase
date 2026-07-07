import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '@/lib/api';
import { useT } from '@/i18n/I18nContext';
import type {
  Difficulty,
  GameCombatant,
  GameMode,
  GameSlot,
  GameSnapshot,
  GameSummary,
  PlayerPresentation,
} from './types';
import {
  GAME_AVATARS,
  GAME_BACKGROUNDS,
  REVENGE_BLOCKS,
  VERY_HARD_PVP_THRESHOLD,
} from './constants';
import { readNumberPayload, readSlotPayload } from './event-helpers';
import {
  combatantLabel,
  eventKey,
  formatCombatNumber,
  latestDamageEvent,
  latestRoundPrepEvent,
  latestVisualEvent,
  matchEndDetail,
  outcomeClass,
  outcomeMessage,
  winnerText,
} from './helpers';

export function PlayerToken({
  avatar,
  label,
  tone,
  isReady,
}: {
  avatar: string;
  label: string;
  tone: GameSlot | 'pending';
  isReady?: boolean;
}) {
  return (
    <div className={`game-player-token ${tone}`}>
      <span>{avatar}</span>
      <strong
        style={
          isReady ? { color: '#22c55e', textShadow: '0 0 8px rgba(34,197,94,0.45)' } : undefined
        }
      >
        {label}
      </strong>
    </div>
  );
}

export function AvatarPicker({
  selected,
  onPick,
}: {
  selected: string;
  onPick: (avatar: string) => void;
}) {
  return (
    <div className="game-avatar-picker" aria-label="Choose player avatar">
      {GAME_AVATARS.map((avatar) => (
        <button
          className={avatar === selected ? 'active' : ''}
          key={avatar}
          type="button"
          onClick={() => onPick(avatar)}
        >
          {avatar}
        </button>
      ))}
    </div>
  );
}

export function BackgroundPicker({
  selectedId,
  onPick,
}: {
  selectedId: string;
  onPick: (background: (typeof GAME_BACKGROUNDS)[number]) => void;
}) {
  const t = useT();
  return (
    <div className="game-background-picker" aria-label="Choose match background">
      {GAME_BACKGROUNDS.map((background) => (
        <button
          className={background.id === selectedId ? 'active' : ''}
          key={background.id}
          type="button"
          onClick={() => onPick(background)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src={background.src} />
          <span>{t(background.labelKey)}</span>
        </button>
      ))}
    </div>
  );
}

export function DifficultyPicker({
  selected,
  pvpMatchCount,
  onPick,
}: {
  selected: Difficulty;
  pvpMatchCount: number;
  onPick: (d: Difficulty) => void;
}) {
  const t = useT();
  const remaining = Math.max(0, VERY_HARD_PVP_THRESHOLD - pvpMatchCount);
  const veryHardUnlocked = remaining === 0;

  const options: { value: Difficulty; label: string; locked: boolean; hint?: string }[] = [
    { value: 'very_easy', label: t('difficulty.veryEasy'), locked: false },
    { value: 'easy', label: t('difficulty.easy'), locked: false },
    {
      value: 'very_hard',
      label: veryHardUnlocked ? t('difficulty.veryHard') : t('difficulty.veryHardLocked'),
      locked: !veryHardUnlocked,
      hint: !veryHardUnlocked
        ? t('difficulty.veryHardUnlockHint').replace('{n}', String(remaining))
        : undefined,
    },
  ];

  return (
    <div className="difficulty-picker">
      <span className="game-setup-label">{t('difficulty.label')}</span>
      <div className="difficulty-options">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`difficulty-option${selected === opt.value ? ' active' : ''}${opt.locked ? ' locked' : ''}`}
            onClick={() => {
              if (!opt.locked) onPick(opt.value);
            }}
            disabled={opt.locked}
            title={opt.hint}
          >
            {opt.label}
            {opt.hint !== undefined && <small>{opt.hint}</small>}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FighterFace({ pres }: { pres?: PlayerPresentation }) {
  const url = pres ? assetUrl(pres.profilePictureUrl) : null;
  const initial = (pres?.username?.[0] ?? '?').toUpperCase();
  return (
    <span className="hp-face" aria-hidden>
      {url !== null ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" />
      ) : (
        <span className="hp-face-initial">{initial}</span>
      )}
    </span>
  );
}

// A small green check per round this fighter has won, shown under the HP bar.
function RoundWinTicks({ count, align }: { count: number; align: 'left' | 'right' }) {
  if (count <= 0) return null;
  return (
    <div
      className={`round-wins ${align}`}
      aria-label={`${count} round${count === 1 ? '' : 's'} won`}
    >
      {Array.from({ length: count }, (_, i) => (
        <svg
          key={i}
          className="round-win-tick"
          viewBox="0 0 24 24"
          width="38"
          height="38"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9.5" />
          <path d="M7.5 12.5l3 3 6-6.5" />
        </svg>
      ))}
    </div>
  );
}

export function HpBar({
  combatant,
  label,
  align,
  pres,
  roundWins = 0,
}: {
  combatant: GameCombatant;
  label: string;
  align: 'left' | 'right';
  pres?: PlayerPresentation;
  roundWins?: number;
}) {
  const hpPercent = Math.max(0, Math.min(100, (combatant.hp / combatant.maxHp) * 100));
  const roundedHp = Math.round(combatant.hp * 10) / 10;
  const name = pres?.username ?? label;
  const meter =
    align === 'right' ? (
      <div className="hp-meter p2-hp">
        <strong>{roundedHp}</strong>
        <div className="hp-track">
          <i style={{ width: `${hpPercent}%` }} />
        </div>
        <span>{name}</span>
        <FighterFace pres={pres} />
      </div>
    ) : (
      <div className="hp-meter p1-hp">
        <FighterFace pres={pres} />
        <span>{name}</span>
        <div className="hp-track">
          <i style={{ width: `${hpPercent}%` }} />
        </div>
        <strong>{roundedHp}</strong>
      </div>
    );

  return (
    <div className={`hp-side ${align}`}>
      {meter}
      <RoundWinTicks count={roundWins} align={align} />
    </div>
  );
}

// Shield that signals a fighter's DEFEND availability: bright when the block is
// ready, pulsing while the shield is actively up, faded once spent (recharges
// next question). Shown on each answer box so both players can read it.
export function ShieldPip({ combatant, now }: { combatant: GameCombatant; now: number }) {
  const active = combatant.statusEffects.some((e) => e.type === 'defend' && e.endsAtMs > now);
  const state = active ? 'active' : combatant.defendAvailable ? 'ready' : 'used';
  return (
    <i
      className={`shield-pip ${state}`}
      aria-label={`Defend ${state}`}
      title={`Defend ${state === 'used' ? 'used' : 'ready'}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 2 4 5v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V5l-8-3Z" />
      </svg>
    </i>
  );
}

export function OutcomeBanner({
  eventLog,
  playerSlot,
}: {
  eventLog: GameSnapshot['eventLog'];
  playerSlot?: GameSlot;
}) {
  const t = useT();
  const latest = latestVisualEvent(eventLog);
  if (latest === undefined) {
    return null;
  }

  return (
    <div className={`outcome-banner show ${outcomeClass(latest)}`} key={eventKey(latest)}>
      {outcomeMessage(t, latest, playerSlot)}
    </div>
  );
}

export function RoundIntroOverlay({ snapshot, now }: { snapshot: GameSnapshot; now: number }) {
  const t = useT();
  if (snapshot.phase !== 'round_prep' || snapshot.summary !== undefined) {
    return null;
  }

  const event = latestRoundPrepEvent(snapshot.eventLog);
  const elapsedMs = event === undefined ? 0 : Math.max(0, now - event.serverTimestampMs);
  const isGo = elapsedMs >= 1400;
  const roundLabel =
    snapshot.isFinalRound === true
      ? t('round.finalLong')
      : `${t('round.roundPrefixCaps')} ${snapshot.roundNumber ?? 1}`;

  return (
    <div className={`round-intro-overlay ${isGo ? 'go' : 'round'}`} aria-live="polite">
      <strong>{isGo ? t('round.go') : roundLabel}</strong>
    </div>
  );
}

export function RoundWinnerOverlay({ snapshot, now }: { snapshot: GameSnapshot; now: number }) {
  const t = useT();
  if (snapshot.phase !== 'round_ended' || snapshot.summary !== undefined) {
    return null;
  }

  const event = snapshot.eventLog?.find((entry) => entry.name === 'round.ended');
  if (event === undefined || now - event.serverTimestampMs >= 1000) {
    return null;
  }

  const winnerSlot = readSlotPayload(event, 'winnerSlot');
  const winner = winnerSlot === undefined ? undefined : snapshot.combatants?.[winnerSlot];
  if (winner === undefined) {
    return null;
  }

  const winnerName = snapshot.players?.[winner.id]?.username ?? winner.id;
  return (
    <div className="round-winner-overlay" role="status" aria-live="assertive">
      <strong>{t('round.winnerBanner').replace('{name}', winnerName)}</strong>
    </div>
  );
}

export function ReconnectOverlay({
  snapshot,
  playerSlot,
  now,
}: {
  snapshot: GameSnapshot;
  playerSlot?: GameSlot;
  now: number;
}) {
  const t = useT();
  const reconnectState = snapshot.reconnectState;
  if (reconnectState === undefined || snapshot.summary !== undefined) {
    return null;
  }

  const isDisconnectedPlayer = reconnectState.disconnectedSlot === playerSlot;
  if (reconnectState.status === 'resuming') {
    const seconds = Math.max(
      0,
      Math.ceil(((reconnectState.resumeDeadlineAtMs ?? now) - now) / 1000)
    );
    return (
      <div className="reconnect-overlay success" aria-live="assertive">
        <strong>{t('reconnect.success')}</strong>
        <span>{t('reconnect.getReadyExcl')}</span>
        <b>{seconds}</b>
      </div>
    );
  }

  const seconds = Math.max(0, Math.ceil((reconnectState.deadlineAtMs - now) / 1000));
  return (
    <div className="reconnect-overlay" aria-live="assertive">
      <strong>{t('reconnect.reconnecting')}</strong>
      <span>
        {isDisconnectedPlayer
          ? t('reconnect.youDisconnected')
          : `${reconnectState.disconnectedSlot.toUpperCase()} ${t('reconnect.disconnectedSuffix')}`}
      </span>
      <b>{seconds}</b>
    </div>
  );
}

export function DamageCallout({ eventLog }: { eventLog: GameSnapshot['eventLog'] }) {
  const latest = latestDamageEvent(eventLog);
  if (latest === undefined) {
    return null;
  }

  const targetSlot = readSlotPayload(latest, 'targetCombatantSlot');
  const shock = latest.name === 'shock.applied';
  const damage = latest.name === 'shock.applied' ? 10 : readNumberPayload(latest, 'damage');
  if (damage === undefined) {
    return null;
  }

  if (shock) {
    return (
      <>
        <div className="damage-callout p1 show" key={`${eventKey(latest)}-p1`}>
          -10 HP
        </div>
        <div className="damage-callout p2 show" key={`${eventKey(latest)}-p2`}>
          -10 HP
        </div>
      </>
    );
  }

  if (targetSlot === undefined) {
    return null;
  }

  return (
    <div className={`damage-callout ${targetSlot} show`} key={eventKey(latest)}>
      -{formatCombatNumber(damage)} HP
    </div>
  );
}

export function RevengeGauge({
  combatant,
  align,
}: {
  combatant: GameCombatant;
  align: 'left' | 'right';
}) {
  const t = useT();
  const blocks = Array.from({ length: REVENGE_BLOCKS }, (_, index) => index);
  return (
    <div className={`revenge-gauge ${align} ${combatant.revengeActive ? 'ready' : ''}`}>
      {blocks.map((index) => (
        <i className={index < combatant.revengeBlocks ? 'filled' : ''} key={index} />
      ))}
      {combatant.revengeActive && <b>{t('game.revengeLabel')}</b>}
    </div>
  );
}

export function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="game-summary-card">
      <span>{label}</span>
      {detail !== undefined && <small>{detail}</small>}
      <strong>{value}</strong>
    </div>
  );
}

function AuraSummaryCard({
  label,
  correctAnswers,
  auraGain,
  isWinner,
}: {
  label: string;
  correctAnswers: number;
  auraGain: number;
  isWinner: boolean;
}) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 2500;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * auraGain));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [auraGain]);

  const formula = isWinner ? `${correctAnswers} × ✓  +  50` : `${correctAnswers} × ✓`;

  return (
    <div className="game-summary-card game-summary-card--aura">
      <span>{label}</span>
      <small className="aura-formula">{formula}</small>
      <strong className="aura-total">
        +{displayed} <em>aura</em>
      </strong>
    </div>
  );
}

// Match result shown as a centered overlay *inside* the arena frame (over a
// dimmed board) rather than a side panel that shrinks the stage.
export type RematchState =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'received'; fromUsername: string }
  | { status: 'rejected' };

export function MatchSummaryOverlay({
  className,
  mode,
  playerId,
  players,
  roundNumber,
  summary,
  seriesWins,
  rematchState,
  onRematchRequest,
  onRematchAccept,
  onRematchReject,
  onReset,
  onPlayAgain,
}: {
  className: string;
  mode?: GameMode;
  playerId: string;
  players?: Record<string, PlayerPresentation>;
  roundNumber: number;
  summary: GameSummary;
  seriesWins: Record<string, number>;
  rematchState: RematchState;
  onRematchRequest: () => void;
  onRematchAccept: () => void;
  onRematchReject: () => void;
  onReset: () => void;
  onPlayAgain: () => void;
}) {
  const t = useT();
  const isPvp = mode === 'pvp';
  // A voided match (disconnect/reconnect-timeout forfeit) has no opponent
  // left to rematch against.
  const canRematch = isPvp && summary.status !== 'voided';

  return (
    <div
      className={`game-summary-overlay show ${className}`}
      aria-label="Match summary"
      aria-live="polite"
    >
      <div className="game-summary-overlay-card">
        <h2>{winnerText(t, summary, playerId)}</h2>
        <p className="game-summary-overlay-detail">
          {matchEndDetail(t, summary, playerId, players)}
        </p>
        <div className="game-summary-overlay-stats">
          <SummaryCard
            label={t('summary.mode')}
            value={isPvp ? t('summary.pvpLabel') : t('summary.cpuLabel')}
          />
          <SummaryCard
            label={t('summary.endedOn')}
            value={`${t('game.roundPrefix')} ${roundNumber}`}
          />
          <SummaryCard
            label={`${combatantLabel(t, summary.combatants.p1, playerId).replace(t('common.you'), t('summary.your'))} ${t('summary.accuracySuffix')}`}
            value={`${Math.round(summary.combatants.p1.accuracy * 100)}%`}
          />
          {isPvp && (
            <SummaryCard
              label={`${combatantLabel(t, summary.combatants.p2, playerId).replace(t('common.you'), t('summary.your'))} ${t('summary.accuracySuffix')}`}
              value={`${Math.round(summary.combatants.p2.accuracy * 100)}%`}
            />
          )}
          {isPvp && (
            <AuraSummaryCard
              label={`${combatantLabel(t, summary.combatants.p1, playerId).replace(t('common.you'), t('summary.your'))} ${t('summary.auraSuffix')}`}
              correctAnswers={summary.combatants.p1.correctAnswers}
              auraGain={summary.combatants.p1.auraGain}
              isWinner={summary.winnerCombatantId === summary.combatants.p1.combatantId}
            />
          )}
          {isPvp && (
            <AuraSummaryCard
              label={`${combatantLabel(t, summary.combatants.p2, playerId).replace(t('common.you'), t('summary.your'))} ${t('summary.auraSuffix')}`}
              correctAnswers={summary.combatants.p2.correctAnswers}
              auraGain={summary.combatants.p2.auraGain}
              isWinner={summary.winnerCombatantId === summary.combatants.p2.combatantId}
            />
          )}
        </div>

        {isPvp && (
          <section className="game-summary-series" aria-label={t('summary.seriesScore')}>
            <h3>{t('summary.seriesScore')}</h3>
            <div>
              {(['p1', 'p2'] as const).map((slot) => {
                const combatant = summary.combatants[slot];
                const name =
                  players?.[combatant.combatantId]?.username ??
                  combatantLabel(t, combatant, playerId);
                return (
                  <article
                    className={combatant.combatantId === playerId ? 'you' : ''}
                    key={combatant.combatantId}
                  >
                    <span>{name}</span>
                    <strong>{seriesWins[combatant.combatantId] ?? 0}</strong>
                    <small>{t('summary.winCount')}</small>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {canRematch && rematchState.status === 'received' && (
          <p className="game-rematch-received-msg" aria-live="polite">
            ⚔️ {rematchState.fromUsername} {t('summary.wantsRematch')}
          </p>
        )}

        <div className="game-summary-overlay-actions" aria-label="Post-match actions">
          {canRematch && rematchState.status === 'idle' && (
            <button type="button" onClick={onRematchRequest}>
              {t('summary.rematch')}
            </button>
          )}
          {canRematch && rematchState.status === 'pending' && (
            <button type="button" disabled>
              {t('game.waiting')}
            </button>
          )}
          {canRematch && rematchState.status === 'rejected' && (
            <button type="button" disabled>
              {t('summary.declined')}
            </button>
          )}
          {canRematch && rematchState.status === 'received' && (
            <button type="button" className="game-summary-accept" onClick={onRematchAccept}>
              {t('community.accept')}
            </button>
          )}
          {!isPvp && (
            <button type="button" onClick={onPlayAgain}>
              {t('summary.playAgain')}
            </button>
          )}
          {canRematch && rematchState.status === 'received' ? (
            <button type="button" onClick={onRematchReject}>
              {t('community.decline')}
            </button>
          ) : (
            <button type="button" onClick={onReset}>
              {t('common.back')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
