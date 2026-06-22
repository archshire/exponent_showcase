'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DemoClient } from '@/game/demo_client';
import { useDashboardUser } from '@/context/DashboardContext';
import { useT } from '@/i18n/I18nContext';
import { Button } from '@/components/ui';

export default function Page() {
  const user = useDashboardUser();
  const t = useT();
  return (
    <div className="flex flex-col gap-4">
      <Link href="/dashboard" className="self-start">
        <Button variant="ghost" size="sm">
          <ArrowLeft size={16} /> {t('nav.home')}
        </Button>
      </Link>
      <DemoClient mode="pvp" playerId={user.id} />
    </div>
  );
}
