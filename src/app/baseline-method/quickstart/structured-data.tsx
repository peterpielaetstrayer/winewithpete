export function QuickStartStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Baseline Method Quick Start Guide',
    description: 'A condensed guide to start the Baseline Method today. An evergreen framework to rebuild your physical and mental baseline through small, repeatable daily anchors.',
    author: {
      '@type': 'Person',
      name: 'Pete',
      url: 'https://winewithpete.me/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Wine With Pete',
      url: 'https://winewithpete.me',
      logo: {
        '@type': 'ImageObject',
        url: 'https://winewithpete.me/images/hero/hero-campfire.png.png',
      },
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://winewithpete.me/baseline-method/quickstart',
    },
    image: [
      'https://winewithpete.me/images/baseline-method/quickstart/1.png',
    ],
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://winewithpete.me',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Baseline Method',
          item: 'https://winewithpete.me/baseline-method',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Quick Start Guide',
          item: 'https://winewithpete.me/baseline-method/quickstart',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

