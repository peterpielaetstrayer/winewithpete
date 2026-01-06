export function SiteStructuredData() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wine With Pete',
    url: 'https://winewithpete.me',
    logo: 'https://winewithpete.me/images/hero/hero-campfire.png.png',
    description: 'A community for philosophical conversation, fire-cooked meals, and meaningful connections.',
    sameAs: [
      process.env.NEXT_PUBLIC_INSTAGRAM_URL,
      process.env.NEXT_PUBLIC_TWITTER_URL,
    ].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'pete@winewithpete.me',
      contactType: 'Customer Service',
    },
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wine With Pete',
    description: 'Join our community for philosophical conversation, fire-cooked meals, and meaningful connections.',
    url: 'https://winewithpete.me',
    publisher: {
      '@type': 'Organization',
      name: 'Wine With Pete',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  );
}

