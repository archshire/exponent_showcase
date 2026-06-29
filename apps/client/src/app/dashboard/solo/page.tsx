'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GraduationCap, Lock, ArrowLeft } from 'lucide-react';
import { api, type CpuUnlockProgress } from '@/lib/api';
import { useDashboardUser } from '@/context/DashboardContext';
import { useT } from '@/i18n/I18nContext';
import { GameClient } from '@/game/game-client';
import { Badge, Button, Card, CpuBadge, CPU_META, PageLoader, SectionTitle } from '@/components/ui';

export default function SoloPage() {
  const t = useT();
  const user = useDashboardUser();
  const [progress, setProgress] = useState<CpuUnlockProgress[] | null>(null);
  const [tutorialDone, setTutorialDone] = useState(false);
  const [opponent, setOpponent] = useState<string | null>(null);
  const [isTutorialRun, setIsTutorialRun] = useState(false);

  useEffect(() => {
    api
      .stats()
      .then((s) => setProgress(s.cpuUnlockProgress))
      .catch(() => setProgress([]));
    api
      .me()
      .then((u) => setTutorialDone(u.tutorialCompleted))
      .catch(() => {});
  }, []);

  if (!progress) return <PageLoader />;

  function duel(cpuKey = 'max', tutorial = false) {
    setIsTutorialRun(tutorial);
    setOpponent(cpuKey);
  }

  // Launch the duel flow in-place against the chosen CPU.
  if (opponent) {
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" className="self-start" onClick={() => setOpponent(null)}>
          <ArrowLeft size={18} /> {t('solo.title')}
        </Button>
        <GameClient mode="pvc" cpuKey={opponent} playerId={user.id} isTutorial={isTutorialRun} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/dashboard" className="self-start">
        <Button variant="ghost" size="sm">
          <ArrowLeft size={16} /> {t('nav.home')}
        </Button>
      </Link>
      <SectionTitle title={t('solo.title')} subtitle={t('solo.subtitle')} />

      <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <GraduationCap size={36} style={{ color: 'var(--sf-yellow)' }} />
          <div>
            <h3 className="text-lg font-bold">{t('solo.tutorial')}</h3>
            <p className="text-sm" style={{ color: 'var(--sf-muted)' }}>
              {t('solo.tutorialDesc')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {tutorialDone && (
            <Badge style={{ color: 'var(--sf-emerald)' }}>✓ {t('solo.completed')}</Badge>
          )}
          <Button onClick={() => duel('max', true)}>
            {tutorialDone ? t('solo.replay') : t('solo.start')}
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        {progress.map((p) => {
          const meta = CPU_META[p.cpuKey] ?? { name: p.cpuKey, tagline: '' };
          return (
            <Card key={p.cpuKey} className="flex flex-col gap-3 p-6" hover={p.unlocked}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CpuBadge cpuKey={p.cpuKey} size={52} />
                  <div>
                    <h3 className="text-lg font-bold">{meta.name}</h3>
                    <p className="text-sm" style={{ color: 'var(--sf-muted)' }}>
                      {meta.tagline}
                    </p>
                  </div>
                </div>
                <Badge
                  style={p.unlocked ? { color: 'var(--sf-emerald)' } : { color: 'var(--sf-faint)' }}
                >
                  {p.unlocked ? (
                    t('stats.unlocked')
                  ) : (
                    <>
                      <Lock size={12} /> {t('solo.locked')}
                    </>
                  )}
                </Badge>
              </div>

              {!p.unlocked ? (
                <div
                  className="flex flex-col gap-2 rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <p className="text-xs" style={{ color: 'var(--sf-muted)' }}>
                    {p.description}
                  </p>
                  {p.requirements.map((r) => (
                    <div key={r.label}>
                      <div
                        className="mb-1 flex justify-between text-xs"
                        style={{ color: 'var(--sf-muted)' }}
                      >
                        <span>{r.label}</span>
                        <span>
                          {r.current}/{r.target}
                        </span>
                      </div>
                      <div
                        className="h-1.5 overflow-hidden rounded-full"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(r.current / r.target) * 100}%`,
                            background: 'var(--sf-accent-grad)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Button className="self-start" onClick={() => duel(p.cpuKey)}>
                  {t('solo.play')}
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
