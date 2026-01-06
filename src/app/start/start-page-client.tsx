'use client';

import { useEffect } from 'react';

export function StartPageClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hide header and footer for this standalone page
    const style = document.createElement('style');
    style.id = 'start-page-styles';
    style.textContent = `
      header, footer { display: none !important; }
      main { padding: 0 !important; margin: 0 !important; }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup on unmount
      const existingStyle = document.getElementById('start-page-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return <>{children}</>;
}

