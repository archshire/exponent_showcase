'use client';

import { Suspense, useCallback, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { DemoClient, type DemoClientHandle } from '@/game/demo_client';
import { useDashboardUser } from '@/context/DashboardContext';
import { useT } from '@/i18n/I18nContext';
import { Button } from '@/components/ui';

function Arena() {
  const user = useDashboardUser();
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const inviteRoom = params.get('invite');
  const from = params.get('from') ?? 'A friend';
  const invite = inviteRoom !== null ? { roomId: inviteRoom, fromUsername: from } : undefined;
  const demoRef = useRef<DemoClientHandle>(null);
  const [atTopLevel, setAtTopLevel] = useState(true);
  const handleAtTopLevelChange = useCallback((v: boolean) => setAtTopLevel(v), []);

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="self-start"
        onClick={() => (atTopLevel ? router.push('/dashboard') : demoRef.current?.goBackToChooser())}
      >
        <ArrowLeft size={16} /> {atTopLevel ? t('nav.home') : t('common.back')}
      </Button>
      {/* Key on the invite so accepting an invite remounts into the join flow. */}
      <DemoClient
        ref={demoRef}
        key={inviteRoom ?? 'pvp'}
        mode="pvp"
        playerId={user.id}
        invite={invite}
        onAtTopLevelChange={handleAtTopLevelChange}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Arena />
    </Suspense>
  );
}
