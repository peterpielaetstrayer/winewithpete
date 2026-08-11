export function SiteStructuredData() {
  const description =
    'Wine With Pete is a gathering culture project rebuilding the table through food, wine, fire, hospitality, conversation, stories, and thoughtfully designed gatherings.';

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wine With Pete',
    url: 'https://winewithpete.me',
    logo: 'https://winewithpete.me/images/hero/hero-campfire.png.png',
    description,
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
    description,
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
