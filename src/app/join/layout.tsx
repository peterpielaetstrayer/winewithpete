import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join the Founding Table | Wine With Pete',
  description: 'Join the free Wine With Pete email list for occasional stories, useful recipes and guides, and invitations to gather. No account required.',
  alternates: { canonical: '/join' },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
