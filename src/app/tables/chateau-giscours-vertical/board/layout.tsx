import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Red Wine Exploration Board | Wine With Pete',
  description: 'A private-by-default, browser-local tasting companion for comparing the four vintages described in the public Château Giscours Vertical table story.',
  robots: { index: false, follow: false },
};

export default function ExplorationBoardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
