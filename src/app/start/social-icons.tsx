'use client';

import Link from 'next/link';
import { Instagram, Twitter, Mail } from 'lucide-react';

interface SocialIconsProps {
  instagramUrl?: string;
  twitterUrl?: string;
  email?: string;
}

export function SocialIcons({ instagramUrl, twitterUrl, email }: SocialIconsProps = {}) {
  // Use props if provided, otherwise fall back to environment variables
  const instagram = instagramUrl || process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  const twitter = twitterUrl || process.env.NEXT_PUBLIC_TWITTER_URL;
  const contactEmail = email || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'pete@winewithpete.me';

  return (
    <div className="flex items-center justify-center gap-6 mt-8">
      {instagram && (
        <Link
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#f6f3ef]/70 hover:text-[#f6f3ef] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18] rounded-full p-2"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5" />
        </Link>
      )}
      {twitter && (
        <Link
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#f6f3ef]/70 hover:text-[#f6f3ef] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18] rounded-full p-2"
          aria-label="Twitter / X"
        >
          <Twitter className="w-5 h-5" />
        </Link>
      )}
      <Link
        href={`mailto:${contactEmail}`}
        className="text-[#f6f3ef]/70 hover:text-[#f6f3ef] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c98a2b]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a18] rounded-full p-2"
        aria-label="Email"
      >
        <Mail className="w-5 h-5" />
      </Link>
    </div>
  );
}

