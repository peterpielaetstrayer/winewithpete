'use client';

import Link from 'next/link';
import { analyticsEvents } from '@/lib/analytics';

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function ButtonLink({ href, children, variant = 'primary', className = '' }: ButtonLinkProps) {
  const isPrimary = variant === 'primary';
  
  const handleClick = () => {
    // Track button click on start page
    const buttonText = typeof children === 'string' ? children : 'Button';
    analyticsEvents.startPageButtonClicked(buttonText);
  };
  
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
            onClick={handleClick}
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
      {/* Aged paper base color variation */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none opacity-[0.25]"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(218, 190, 155, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(200, 170, 130, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(185, 155, 115, 0.2) 0%, transparent 60%)
          `,
          mixBlendMode: 'multiply',
        }}
      ></div>

      {/* Deep parchment weave texture */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(139, 69, 19, 0.15) 1px, rgba(139, 69, 19, 0.15) 2px),
            repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(160, 82, 45, 0.12) 1px, rgba(160, 82, 45, 0.12) 2px),
            repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(101, 50, 30, 0.1) 2px, rgba(101, 50, 30, 0.1) 3px),
            repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(120, 60, 35, 0.08) 2px, rgba(120, 60, 35, 0.08) 3px),
            repeating-linear-gradient(22.5deg, transparent, transparent 3px, rgba(150, 100, 60, 0.06) 3px, rgba(150, 100, 60, 0.06) 4px)
          `,
          backgroundSize: '150% 150%, 120% 120%, 180% 180%, 140% 140%, 200% 200%',
          mixBlendMode: 'multiply',
        }}
      ></div>

      {/* Irregular wrinkles and creases */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none opacity-[0.2]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(15deg, transparent, transparent 8px, rgba(139, 100, 60, 0.1) 8px, rgba(139, 100, 60, 0.1) 9px),
            repeating-linear-gradient(75deg, transparent, transparent 12px, rgba(120, 85, 50, 0.08) 12px, rgba(120, 85, 50, 0.08) 13px),
            repeating-linear-gradient(105deg, transparent, transparent 10px, rgba(150, 110, 70, 0.09) 10px, rgba(150, 110, 70, 0.09) 11px)
          `,
          backgroundSize: '300% 300%, 250% 250%, 280% 280%',
          mixBlendMode: 'multiply',
        }}
      ></div>
      
      {/* Deep paper grain noise */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none opacity-[0.25]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '150% 150%',
          mixBlendMode: 'multiply',
        }}
      ></div>

      {/* Subtle age spots and imperfections */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none opacity-[0.15]"
        style={{
          background: `
            radial-gradient(circle at 15% 25%, rgba(160, 120, 80, 0.2) 0%, transparent 3%),
            radial-gradient(circle at 85% 60%, rgba(140, 100, 65, 0.18) 0%, transparent 2.5%),
            radial-gradient(circle at 45% 80%, rgba(150, 110, 75, 0.15) 0%, transparent 2%),
            radial-gradient(circle at 70% 20%, rgba(145, 105, 70, 0.12) 0%, transparent 1.5%)
          `,
          mixBlendMode: 'multiply',
        }}
      ></div>

      {/* Edge aging effect */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none opacity-[0.2]"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 60%, rgba(139, 100, 65, 0.3) 100%)
          `,
          mixBlendMode: 'multiply',
        }}
      ></div>
      
      {/* Text content - relative z-index to appear above texture */}
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

