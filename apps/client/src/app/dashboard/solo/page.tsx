'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, type CpuUnlockProgress } from '@/lib/api';
import { useT } from '@/i18n/I18nContext';
import { Badge, Button, Card, PageLoader, SectionTitle } from '@/components/ui';

const CPU_META: Record<string, { emoji: string; name: string; tagline: string }> = {
  max: { emoji: '👊', name: 'Max', tagline: 'Streak fighter — builds momentum fast.' },
  min: { emoji: '🤏🏻', name: 'Min', tagline: 'Vanilla fighter — steady constant damage.' },
  fury: { emoji: '🔥', name: 'Fury', tagline: 'Avenge fighter — revenge-forward aggression.' },
  shi_eld: { emoji: '🛡️', name: 'Shi-eld', tagline: 'Block specialist — punishes your attacks.' },
};

export default function SoloPage() {
  const t = useT();
  const router = useRouter();
  const [progress, setProgress] = useState<CpuUnlockProgress[] | null>(null);
  const [tutorialDone, setTutorialDone] = useState(false);

  useEffect(() => {
    api.stats().then((s) => setProgress(s.cpuUnlockProgress)).catch(() => setProgress([]));
    api.me().then((u) => setTutorialDone(u.tutorialCompleted)).catch(() => {});
  }, []);

  if (!progress) return <PageLoader />;

  function duel() {
    router.push('/dashboard/matchmaking');
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title={t('solo.title')} subtitle={t('solo.subtitle')} />

      <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🎓</span>
          <div>
            <h3 className="text-lg font-bold">{t('solo.tutorial')}</h3>
            <p className="text-sm" style={{ color: 'var(--sf-muted)' }}>
              Learn attack power, SHOCK, streaks, revenge and DEFEND.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {tutorialDone && <Badge style={{ color: 'var(--sf-emerald)' }}>✓ Completed</Badge>}
          <Button onClick={duel}>{tutorialDone ? 'Replay' : 'Start'}</Button>
        </div>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        {progress.map((p) => {
          const meta = CPU_META[p.cpuKey] ?? { emoji: '🤖', name: p.cpuKey, tagline: '' };
          return (
            <Card key={p.cpuKey} className="flex flex-col gap-3 p-6" hover={p.unlocked}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{meta.emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold">{meta.name}</h3>
                    <p className="text-sm" style={{ color: 'var(--sf-muted)' }}>{meta.tagline}</p>
                  </div>
                </div>
                <Badge style={p.unlocked ? { color: 'var(--sf-emerald)' } : { color: 'var(--sf-faint)' }}>
                  {p.unlocked ? t('stats.unlocked') : '🔒 ' + t('solo.locked')}
                </Badge>
              </div>

              {!p.unlocked ? (
                <div className="flex flex-col gap-2 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-xs" style={{ color: 'var(--sf-muted)' }}>{p.description}</p>
                  {p.requirements.map((r) => (
                    <div key={r.label}>
                      <div className="mb-1 flex justify-between text-xs" style={{ color: 'var(--sf-muted)' }}>
                        <span>{r.label}</span>
                        <span>{r.current}/{r.target}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(r.current / r.target) * 100}%`, background: 'var(--sf-accent-grad)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Button className="self-start" onClick={duel}>{t('solo.play')}</Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
