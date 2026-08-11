'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export function AnalyticsBridge() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const tracked = target?.closest<HTMLElement>('[data-analytics-event]');
      if (!tracked) return;

      const action = tracked.dataset.analyticsEvent;
      if (!action) return;

      const rawValue = tracked.dataset.analyticsValue;
      const value = rawValue ? Number(rawValue) : undefined;

      trackEvent({
        action,
        category: tracked.dataset.analyticsCategory || 'site',
        label: tracked.dataset.analyticsLabel,
        value: Number.isFinite(value) ? value : undefined,
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
