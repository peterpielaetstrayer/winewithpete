export function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wine With Pete',
    description: 'Food, fire, and conversations that stay with you long after the embers die.',
    url: 'https://winewithpete.me',
    publisher: {
      '@type': 'Organization',
      name: 'Wine With Pete',
      url: 'https://winewithpete.me',
      logo: {
        '@type': 'ImageObject',
        url: 'https://winewithpete.me/images/hero/hero-campfire.png.png',
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://winewithpete.me/essays?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
    </>
  );
}

