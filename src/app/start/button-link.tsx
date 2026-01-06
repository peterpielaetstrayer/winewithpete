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
      className={`group relative block w-full py-4 px-6 rounded-full text-[#1f1f1f] font-medium text-center border border-[#1f1f1f]/15 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18] overflow-hidden ${className}`}
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
      {/* Parchment texture overlay */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 69, 19, 0.08) 2px, rgba(139, 69, 19, 0.08) 3px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(160, 82, 45, 0.06) 2px, rgba(160, 82, 45, 0.06) 3px),
            repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(101, 50, 30, 0.04) 3px, rgba(101, 50, 30, 0.04) 4px),
            repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(120, 60, 35, 0.03) 4px, rgba(120, 60, 35, 0.03) 5px)
          `,
          backgroundSize: '100% 100%, 80% 80%, 120% 120%, 90% 90%',
          mixBlendMode: 'multiply',
        }}
      ></div>
      
      {/* Subtle paper grain noise */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200% 200%',
          mixBlendMode: 'overlay',
        }}
      ></div>
      
      {/* Text content - relative z-index to appear above texture */}
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

