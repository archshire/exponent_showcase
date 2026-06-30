import { useEffect, useRef, useState } from 'react';
import { useT } from '@/i18n/I18nContext';
import type { TranslationKey } from '@/i18n/translations';
import type { GameCombatant, GameEvent, GameSlot, PlayerPresentation } from './types';
import { ATTACK_STRENGTH_MS, AUDIO_ASSETS, GAME_BACKGROUNDS, REVENGE_BLOCKS } from './constants';
import { playSfx } from './audio';
import {
  avatarFor,
  avatarPadClass,
  eventKey,
  formatPrompt,
  latestVisualEvent,
  MAX_ANSWER_DIGITS,
  questionDisplayClass,
  sanitizeAnswerInput,
  stageClassFor,
} from './helpers';
import { DamageCallout, HpBar, OutcomeBanner, RevengeGauge, ShieldPip } from './components';

// ---------------------------------------------------------------------------
// Scripted tutorial walkthrough
// ---------------------------------------------------------------------------
//
// A fully client-side, deterministic mini-fight that reuses the same render
// helpers as the real live arena (HpBar, RevengeGauge, ShieldPip, the avatar
// animations driven by avatarPadClass/eventLog, etc.) so it looks identical,
// but is driven by local state instead of the server — the real PvC CPU's
// randomized accuracy/timing can't guarantee a SHOCK or a block landing
// inside the 1.5s defend window on cue, so this never touches the live match
// engine. Once the script finishes, onComplete() hands off to a real match.
type TutorialStepId =
  | 'welcome'
  | 'first-question'
  | 'streak'
  | 'gauge'
  | 'shock-demo'
  | 'shock-explain'
  | 'defend-prompt'
  | 'defend-explain'
  | 'blocking'
  | 'stun-explain'
  | 'no-attack-while-defend'
  | 'revenge-gauge'
  | 'revenge-damage'
  | 'finish';

const TUTORIAL_BOX_CONTENT: Record<
  TutorialStepId,
  { bodyKey: TranslationKey; showNext: boolean; arrow?: 'gauge' | 'revenge' } | null
> = {
  welcome: {
    bodyKey: 'tutorial.welcome',
    showNext: true,
  },
  'first-question': {
    bodyKey: 'tutorial.firstQuestion',
    showNext: false,
  },
  streak: {
    bodyKey: 'tutorial.streak',
    showNext: true,
  },
  gauge: {
    bodyKey: 'tutorial.gauge',
    showNext: true,
    arrow: 'gauge',
  },
  'shock-demo': null,
  'shock-explain': {
    bodyKey: 'tutorial.shockExplain',
    showNext: true,
  },
  'defend-prompt': {
    bodyKey: 'tutorial.defendPrompt',
    showNext: false,
  },
  'defend-explain': {
    bodyKey: 'tutorial.defendExplain',
    showNext: true,
  },
  blocking: null,
  'stun-explain': {
    bodyKey: 'tutorial.stunExplain',
    showNext: true,
  },
  'no-attack-while-defend': {
    bodyKey: 'tutorial.noAttackWhileDefend',
    showNext: true,
  },
  'revenge-gauge': {
    bodyKey: 'tutorial.revengeGauge',
    showNext: true,
    arrow: 'revenge',
  },
  'revenge-damage': {
    bodyKey: 'tutorial.revengeDamage',
    showNext: true,
  },
  finish: {
    bodyKey: 'tutorial.finish',
    showNext: true,
  },
};

function makeTutorialCombatant(slot: GameSlot, id: string, driver: 'human' | 'cpu'): GameCombatant {
  return {
    slot,
    id,
    driver,
    hp: 100,
    maxHp: 100,
    currentStreak: 0,
    longestStreak: 0,
    revengeBlocks: 0,
    revengeActive: false,
    defendAvailable: true,
    submittedAttempts: 0,
    correctAnswers: 0,
    statusEffects: [],
  };
}

export function TutorialWalkthrough({
  selectedAvatar,
  background,
  cpuKey,
  onComplete,
}: {
  selectedAvatar: string;
  background: (typeof GAME_BACKGROUNDS)[number];
  cpuKey: string;
  onComplete: () => void;
}) {
  const t = useT();
  const cpuId = `cpu:${cpuKey}`;
  const [step, setStep] = useState<TutorialStepId>('welcome');
  const [p1, setP1] = useState<GameCombatant>(() =>
    makeTutorialCombatant('p1', 'tutorial-player', 'human')
  );
  const [p2, setP2] = useState<GameCombatant>(() => makeTutorialCombatant('p2', cpuId, 'cpu'));
  const [eventLog, setEventLog] = useState<GameEvent[]>([]);
  const [question, setQuestion] = useState<{
    prompt: string;
    expectedAnswer: number;
    startedAtMs: number;
  } | null>(null);
  const [answer, setAnswer] = useState('');
  const [now, setNow] = useState(Date.now());
  const answerInputRef = useRef<HTMLInputElement | null>(null);

  const players: Record<string, PlayerPresentation> = {
    'tutorial-player': {
      playerId: 'tutorial-player',
      username: t('common.you'),
      avatar: selectedAvatar,
      profilePictureUrl: null,
      identityImageSource: 'avatar',
      premadeAvatarKey: null,
      isCpu: false,
    },
  };

  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    if (step === 'first-question' || step === 'defend-prompt') {
      answerInputRef.current?.focus();
    }
  }, [step]);

  function pushEvent(name: string, payload: Record<string, unknown>) {
    setEventLog((prev) =>
      [{ name, message: '', serverTimestampMs: Date.now(), payload }, ...prev].slice(0, 8)
    );
  }

  function startQuestion(prompt: string, expectedAnswer: number) {
    setQuestion({ prompt, expectedAnswer, startedAtMs: Date.now() });
    setAnswer('');
  }

  function submitAnswer() {
    if (step !== 'first-question' || question === null) return;
    if (Number(answer) !== question.expectedAnswer) {
      setAnswer('');
      return;
    }
    const damage = 8;
    setP2((prev) => ({ ...prev, hp: Math.max(0, prev.hp - damage) }));
    setP1((prev) => ({
      ...prev,
      currentStreak: 1,
      longestStreak: 1,
      correctAnswers: 1,
      submittedAttempts: prev.submittedAttempts + 1,
    }));
    pushEvent('attack.landed', {
      attackerSlot: 'p1',
      targetCombatantSlot: 'p2',
      damage,
      attackerStreak: 1,
    });
    playSfx(AUDIO_ASSETS.hit, 0.34);
    setQuestion(null);
    setAnswer('');
    setStep('streak');
  }

  function activateDefend() {
    if (step !== 'defend-prompt') return;
    const startedAtMs = Date.now();
    setP1((prev) => ({
      ...prev,
      defendAvailable: false,
      statusEffects: [
        ...prev.statusEffects,
        { type: 'defend', startedAtMs, endsAtMs: startedAtMs + 1500 },
      ],
    }));
    pushEvent('defend.activated', { combatantSlot: 'p1' });
    playSfx(AUDIO_ASSETS.defend, 0.46);
    setQuestion(null);
    setStep('defend-explain');
  }

  // Auto-runs the question timer to its deadline without anyone answering,
  // guaranteeing the SHOCK demonstration instead of leaving it to chance.
  useEffect(() => {
    if (step !== 'shock-demo') return;
    startQuestion('9 + 4', 13);
    const timer = window.setTimeout(() => {
      setP1((prev) => ({ ...prev, hp: Math.max(0, prev.hp - 10) }));
      setP2((prev) => ({ ...prev, hp: Math.max(0, prev.hp - 10) }));
      pushEvent('shock.applied', { shockDamage: 10 });
      playSfx(AUDIO_ASSETS.shock, 0.72);
      window.setTimeout(() => setStep('shock-explain'), 900);
    }, ATTACK_STRENGTH_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // The simulated CPU "attacks" shortly after the player presses Next on
  // defend-explain — comfortably inside the 1.5s defend window, so the block
  // (and the stun it causes) is guaranteed rather than left to CPU timing.
  useEffect(() => {
    if (step !== 'blocking') return;
    const timer = window.setTimeout(() => {
      const stunnedAtMs = Date.now();
      setP2((prev) => ({
        ...prev,
        currentStreak: 0,
        statusEffects: [
          ...prev.statusEffects,
          { type: 'stunned', startedAtMs: stunnedAtMs, endsAtMs: stunnedAtMs + 1000 },
        ],
      }));
      pushEvent('defend.blocked', { attackerSlot: 'p2', defenderSlot: 'p1' });
      pushEvent('stun.applied', { combatantSlot: 'p2' });
      playSfx(AUDIO_ASSETS.block, 0.66);
      window.setTimeout(() => setStep('stun-explain'), 900);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const canAdvance = TUTORIAL_BOX_CONTENT[step]?.showNext === true;
      if (event.code === 'Space') {
        event.preventDefault();
        if (step === 'defend-prompt') {
          activateDefend();
        } else if (canAdvance) {
          handleNext();
        }
        return;
      }
      if (event.key === 'Enter' && canAdvance) {
        event.preventDefault();
        handleNext();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function handleNext() {
    switch (step) {
      case 'welcome':
        startQuestion('7 + 5', 12);
        setStep('first-question');
        return;
      case 'streak':
        setStep('gauge');
        return;
      case 'gauge':
        setStep('shock-demo');
        return;
      case 'shock-explain':
        startQuestion('6 + 6', 12);
        setStep('defend-prompt');
        return;
      case 'defend-explain':
        setStep('blocking');
        return;
      case 'stun-explain':
        setStep('no-attack-while-defend');
        return;
      case 'no-attack-while-defend':
        setP1((prev) => ({ ...prev, revengeBlocks: REVENGE_BLOCKS, revengeActive: true }));
        playSfx(AUDIO_ASSETS.revengeReady, 0.6);
        setStep('revenge-gauge');
        return;
      case 'revenge-gauge':
        setStep('revenge-damage');
        return;
      case 'revenge-damage':
        setStep('finish');
        return;
      case 'finish':
        onComplete();
        return;
      default:
        return;
    }
  }

  const attackProgress =
    question === null
      ? 0
      : Math.min(100, Math.max(0, ((now - question.startedAtMs) / ATTACK_STRENGTH_MS) * 100));
  const inputEnabled = step === 'first-question';
  const box = TUTORIAL_BOX_CONTENT[step];
  const latestVisual = latestVisualEvent(eventLog);
  const visualAnimationKey = latestVisual === undefined ? 'none' : eventKey(latestVisual);

  return (
    <section className="game-live game-live-playing" aria-label="Tutorial walkthrough">
      <div className="game-stage-card">
        <div
          className={`stage show-avatars show-question game-service-stage background-${background.id} ${stageClassFor(eventLog)}`}
        >
          <img alt={t(background.labelKey)} src={background.src} />
          <div className="top-hud" aria-label="Fight round status">
            <HpBar combatant={p1} label="P1" align="left" pres={players[p1.id]} />
            <div className="round-clock" aria-label="Fight round timer">
              <span>{t('solo.tutorial')}</span>
              <strong className="digital-display">-</strong>
            </div>
            <HpBar combatant={p2} label="P2" align="right" />
          </div>

          <div
            key={`p1-${visualAnimationKey}`}
            className={avatarPadClass(p1, 'p1', eventLog, now)}
          >
            <div className="emoji-avatar" aria-label="P1 avatar">
              {avatarFor(p1, players)}
            </div>
          </div>
          <div
            key={`p2-${visualAnimationKey}`}
            className={avatarPadClass(p2, 'p2', eventLog, now)}
          >
            <div className="emoji-avatar" aria-label="P2 avatar">
              {avatarFor(p2, undefined)}
            </div>
          </div>

          <div
            key={`shock-flash-${visualAnimationKey}`}
            className="shock-flash-layer"
            aria-hidden="true"
          />
          <OutcomeBanner eventLog={eventLog} playerSlot="p1" />
          <DamageCallout eventLog={eventLog} />

          <div className="question-stack">
            <strong
              className={`calc-display ${questionDisplayClass(question?.prompt ?? t('tutorial.ready'))}`}
            >
              {question !== null ? formatPrompt(question.prompt) : t('tutorial.ready')}
            </strong>
            <form
              className="answer-row game-service-answer-row"
              onSubmit={(event) => {
                event.preventDefault();
                submitAnswer();
              }}
            >
              <label className={!inputEnabled ? 'locked' : 'input-ready'}>
                <span className="answer-box-head">
                  <span>P1 {t('tutorial.answer')}</span>
                  <ShieldPip combatant={p1} now={now} />
                </span>
                <input
                  ref={answerInputRef}
                  disabled={!inputEnabled}
                  inputMode="numeric"
                  maxLength={MAX_ANSWER_DIGITS + 1}
                  pattern="-?[0-9]{1,6}"
                  value={answer}
                  onChange={(event) => setAnswer(sanitizeAnswerInput(event.target.value))}
                />
              </label>
              <label className="opponent-box">
                <span className="answer-box-head">
                  <span>P2 {t('tutorial.answer')}</span>
                  <ShieldPip combatant={p2} now={now} />
                </span>
                <output>{step === 'shock-demo' ? '…' : t('tutorial.cpuThinking')}</output>
              </label>
            </form>

            <div className="revenge-row" aria-label="Revenge gauges">
              <RevengeGauge combatant={p1} align="left" />
              <RevengeGauge combatant={p2} align="right" />
              {box?.arrow === 'revenge' && (
                <span className="tutorial-arrow revenge" aria-hidden="true">
                  ⬆
                </span>
              )}
            </div>

            <div className="power-meter" aria-label="Attack strength preview">
              <span>{t('tutorial.attackStrength')}</span>
              <div className="power-track game-service-power-track">
                <i style={{ left: `calc(${attackProgress}% - 5px)` }} />
                <b>⚡</b>
              </div>
              <div className="power-markers" aria-label="Attack strength scale">
                <span>1</span>
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
                <span>25</span>
                <span>30</span>
              </div>
              {box?.arrow === 'gauge' && (
                <span className="tutorial-arrow gauge" aria-hidden="true">
                  ⬇
                </span>
              )}
            </div>
          </div>

          {box !== null && (
            <div className="tutorial-box" role="status" aria-live="polite">
              <p>{t(box.bodyKey)}</p>
              {box.showNext && (
                <button type="button" className="game-start-button" onClick={handleNext}>
                  {t('tutorial.next')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
