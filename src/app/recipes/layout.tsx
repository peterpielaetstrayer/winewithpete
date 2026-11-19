import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recipes & Guides | Wine With Pete',
  description: 'Free field recipes, kitchen-test guides, and practical resources for cooking and bringing people together.',
  alternates: { canonical: '/recipes' },
};

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
