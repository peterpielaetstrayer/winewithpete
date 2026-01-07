'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { analyticsEvents } from '@/lib/analytics';

export function QuickStartCTA() {
  return (
    <Link 
      href="/baseline-method"
      onClick={() => analyticsEvents.baselineMethodQuickstartToFullGuide()}
    >
      <Button className="bg-dr-terracotta hover:bg-dr-terracotta/90 text-white px-8 py-6 text-lg font-medium">
        Get the Full Baseline Method Guide
      </Button>
    </Link>
  );
}

