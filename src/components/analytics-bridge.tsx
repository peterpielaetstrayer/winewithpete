'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export function AnalyticsBridge() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const tracked = target.closest<HTMLElement>('[data-analytics-event]');
      if (tracked) {
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
        return;
      }

      const link = target.closest<HTMLAnchorElement>('a[href]');
      if (!link) return;

      const href = link.getAttribute('href') || '';
      const pathname = window.location.pathname;

      if (href.startsWith('mailto:')) {
        const label = pathname === '/signature-table'
          ? 'signature_table'
          : pathname === '/plan'
            ? 'gathering_blueprint'
            : pathname.replace(/^\//, '') || 'site';

        trackEvent({
          action: 'inquiry_start',
          category: 'conversion',
          label,
          value: 1,
        });
        return;
      }

      if (href === '/gather' || href.startsWith('/gather?')) {
        trackEvent({ action: 'gather_enter', category: 'navigation', label: pathname });
      } else if (href === '/journal' || href.startsWith('/journal?')) {
        trackEvent({ action: 'journal_enter', category: 'navigation', label: pathname });
      } else if (href === '/join' || href.startsWith('/join?')) {
        trackEvent({ action: 'founding_table_enter', category: 'navigation', label: pathname });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
