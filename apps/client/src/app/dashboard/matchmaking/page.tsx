'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { DemoClient } from '@/game/demo_client';
import { useDashboardUser } from '@/context/DashboardContext';
import { useT } from '@/i18n/I18nContext';
import { Button } from '@/components/ui';

function Arena() {
  const user = useDashboardUser();
  const t = useT();
  const params = useSearchParams();
  const inviteRoom = params.get('invite');
  const from = params.get('from') ?? 'A friend';
  const invite = inviteRoom !== null ? { roomId: inviteRoom, fromUsername: from } : undefined;

  return (
    <div className="flex flex-col gap-4">
      <Link href="/dashboard" className="self-start">
        <Button variant="ghost" size="sm">
          <ArrowLeft size={16} /> {t('nav.home')}
        </Button>
      </Link>
      {/* Key on the invite so accepting an invite remounts into the join flow. */}
      <DemoClient key={inviteRoom ?? 'pvp'} mode="pvp" playerId={user.id} invite={invite} />
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
