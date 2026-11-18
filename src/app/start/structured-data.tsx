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
      image: 'https://winewithpete.me/images/explore-v03/hero-seoul-bowl.webp',
    },
  };

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wine With Pete',
    url: 'https://winewithpete.me',
    image: 'https://winewithpete.me/images/explore-v03/hero-seoul-bowl.webp',
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




