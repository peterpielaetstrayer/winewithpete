import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Better Taco Night | Wine With Pete Field Guide',
  description: 'A mobile-first Wine With Pete kitchen-test field guide: silky bean and cheese burritos, ingredient checklist, guided cooking, tasting and table notes.',
  alternates: { canonical: '/guides/better-taco-night' },
  robots: { index: false, follow: false },
};

export default function BetterTacoGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
