'use client';

import { Button } from '@/components/ui/button';

interface ScrollToFormButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollToFormButton({ children, className }: ScrollToFormButtonProps) {
  const scrollToForm = () => {
    const formElement = document.getElementById('email-form');
    formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Button
      onClick={scrollToForm}
      className={className}
    >
      {children}
    </Button>
  );
}

