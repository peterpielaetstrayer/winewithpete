'use client';

import Link from 'next/link';

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function ButtonLink({ href, children, variant = 'primary', className = '' }: ButtonLinkProps) {
  const isPrimary = variant === 'primary';
  
  const baseStyles = {
    background: isPrimary
      ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(246, 243, 239, 0.97) 50%, rgba(246, 243, 239, 0.95) 100%)'
      : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgba(246, 243, 239, 0.94) 50%, rgba(246, 243, 239, 0.90) 100%)',
    boxShadow: isPrimary
      ? `
        0 1px 0 rgba(255, 255, 255, 0.6) inset,
        0 -1px 0 rgba(0, 0, 0, 0.05) inset,
        0 4px 16px rgba(0, 0, 0, 0.2),
        0 8px 24px rgba(0, 0, 0, 0.15)
      `
      : `
        0 1px 0 rgba(255, 255, 255, 0.5) inset,
        0 -1px 0 rgba(0, 0, 0, 0.05) inset,
        0 3px 12px rgba(0, 0, 0, 0.18),
        0 6px 18px rgba(0, 0, 0, 0.12)
      `,
  };

  const hoverShadow = isPrimary
    ? `
      0 1px 0 rgba(255, 255, 255, 0.7) inset,
      0 -1px 0 rgba(0, 0, 0, 0.05) inset,
      0 6px 20px rgba(0, 0, 0, 0.25),
      0 12px 32px rgba(0, 0, 0, 0.2)
    `
    : `
      0 1px 0 rgba(255, 255, 255, 0.6) inset,
      0 -1px 0 rgba(0, 0, 0, 0.05) inset,
      0 4px 16px rgba(0, 0, 0, 0.22),
      0 8px 24px rgba(0, 0, 0, 0.18)
    `;

  const activeShadow = isPrimary
    ? `
      0 1px 0 rgba(255, 255, 255, 0.5) inset,
      0 -1px 0 rgba(0, 0, 0, 0.1) inset,
      0 2px 8px rgba(0, 0, 0, 0.2),
      0 4px 12px rgba(0, 0, 0, 0.15)
    `
    : `
      0 1px 0 rgba(255, 255, 255, 0.4) inset,
      0 -1px 0 rgba(0, 0, 0, 0.1) inset,
      0 2px 6px rgba(0, 0, 0, 0.18),
      0 3px 10px rgba(0, 0, 0, 0.12)
    `;

  return (
    <Link
      href={href}
      className={`group relative block w-full py-4 px-6 rounded-full text-[#1f1f1f] font-medium text-center border border-[#1f1f1f]/15 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18] ${className}`}
      style={baseStyles}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = hoverShadow;
        e.currentTarget.style.transform = isPrimary ? 'translateY(-2px)' : 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = baseStyles.boxShadow;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(1px)';
        e.currentTarget.style.boxShadow = activeShadow;
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = isPrimary ? 'translateY(-2px)' : 'translateY(-1px)';
        e.currentTarget.style.boxShadow = hoverShadow;
      }}
    >
      {children}
    </Link>
  );
}

