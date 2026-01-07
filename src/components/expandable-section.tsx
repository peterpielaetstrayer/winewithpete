'use client';

import { useState, useRef, useEffect } from 'react';
import { ButtonLink } from '@/app/start/button-link';

interface ExpandableSectionProps {
  id: string;
  title: string;
  buttonText: string;
  buttonHref: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  variant?: 'primary' | 'secondary';
}

export function ExpandableSection({
  id,
  title,
  buttonText,
  buttonHref,
  children,
  isExpanded,
  onToggle,
  variant = 'primary',
}: ExpandableSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        setHeight(contentRef.current.scrollHeight);
      } else {
        setHeight(0);
      }
    }
  }, [isExpanded, children]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(id);
  };

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-serif font-medium text-[#f6f3ef]/95 text-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
        {title}
      </h2>
      <button
        onClick={handleButtonClick}
        className="w-full"
        aria-expanded={isExpanded}
        aria-controls={`expandable-${id}`}
      >
        <div className="group relative block w-full py-4 px-6 rounded-full text-[#1f1f1f] font-medium text-center border border-[#1f1f1f]/15 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18] overflow-hidden"
          style={{
            background: variant === 'primary'
              ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(246, 243, 239, 0.97) 50%, rgba(246, 243, 239, 0.95) 100%)'
              : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgba(246, 243, 239, 0.94) 50%, rgba(246, 243, 239, 0.90) 100%)',
            boxShadow: variant === 'primary'
              ? `0 1px 0 rgba(255, 255, 255, 0.6) inset, 0 -1px 0 rgba(0, 0, 0, 0.05) inset, 0 4px 16px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.15)`
              : `0 1px 0 rgba(255, 255, 255, 0.5) inset, 0 -1px 0 rgba(0, 0, 0, 0.05) inset, 0 3px 12px rgba(0, 0, 0, 0.18), 0 6px 18px rgba(0, 0, 0, 0.12)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = variant === 'primary' ? 'translateY(-2px)' : 'translateY(-1px)';
            e.currentTarget.style.boxShadow = variant === 'primary'
              ? `0 1px 0 rgba(255, 255, 255, 0.7) inset, 0 -1px 0 rgba(0, 0, 0, 0.05) inset, 0 6px 20px rgba(0, 0, 0, 0.25), 0 12px 32px rgba(0, 0, 0, 0.2)`
              : `0 1px 0 rgba(255, 255, 255, 0.6) inset, 0 -1px 0 rgba(0, 0, 0, 0.05) inset, 0 4px 16px rgba(0, 0, 0, 0.22), 0 8px 24px rgba(0, 0, 0, 0.18)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = variant === 'primary'
              ? `0 1px 0 rgba(255, 255, 255, 0.6) inset, 0 -1px 0 rgba(0, 0, 0, 0.05) inset, 0 4px 16px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.15)`
              : `0 1px 0 rgba(255, 255, 255, 0.5) inset, 0 -1px 0 rgba(0, 0, 0, 0.05) inset, 0 3px 12px rgba(0, 0, 0, 0.18), 0 6px 18px rgba(0, 0, 0, 0.12)`;
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(1px)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = variant === 'primary' ? 'translateY(-2px)' : 'translateY(-1px)';
          }}
        >
          <span className="relative z-10">{buttonText}</span>
        </div>
      </button>
      
      {/* Expandable Content */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isExpanded ? `${height}px` : '0px',
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div
          ref={contentRef}
          className="mt-4 pt-4 border-t border-[#f6f3ef]/20"
        >
          {children}
        </div>
      </div>
    </section>
  );
}

