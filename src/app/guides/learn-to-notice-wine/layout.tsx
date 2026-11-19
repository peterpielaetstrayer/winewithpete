import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learn to Notice Wine · A Field Lesson | Wine With Pete',
  description: 'A beginner-friendly, self-paced exercise in paying attention, finding your own tasting language, and returning to the glass with curiosity.',
};

export default function LearnToNoticeWineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
