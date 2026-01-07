'use client';

import { useEffect } from 'react';
import { analyticsEvents } from '@/lib/analytics';

export function QuickStartClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Track quickstart page view
    analyticsEvents.baselineMethodQuickstartViewed();
  }, []);

  return <>{children}</>;
}

