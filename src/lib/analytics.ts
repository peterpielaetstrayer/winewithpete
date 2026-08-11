// Analytics tracking for Wine With Pete
// Supports Google Analytics 4 and Vercel Analytics

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

export const trackEvent = (event: AnalyticsEvent) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', event);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }
};

export const analyticsEvents = {
  productViewed: (productName: string) => trackEvent({
    action: 'view_item',
    category: 'store',
    label: productName,
  }),

  checkoutStarted: (productName: string, price: number) => trackEvent({
    action: 'begin_checkout',
    category: 'store',
    label: productName,
    value: price,
  }),

  purchaseCompleted: (productName: string, price: number) => trackEvent({
    action: 'purchase',
    category: 'store',
    label: productName,
    value: price,
  }),

  eventViewed: (eventTitle: string) => trackEvent({
    action: 'view_item',
    category: 'events',
    label: eventTitle,
  }),

  rsvpSubmitted: (eventTitle: string) => trackEvent({
    action: 'rsvp',
    category: 'events',
    label: eventTitle,
  }),

  communityInterestSubmitted: (interestType: string) => trackEvent({
    action: 'community_interest',
    category: 'gather',
    label: interestType,
    value: 1,
  }),

  newsletterSignup: () => trackEvent({
    action: 'sign_up',
    category: 'founding_table',
    label: 'founding_table',
    value: 1,
  }),

  pageView: (pageName: string) => trackEvent({
    action: 'page_view',
    category: 'navigation',
    label: pageName,
  }),

  essayClicked: (essayTitle: string, essayUrl: string) => trackEvent({
    action: 'click',
    category: 'essays',
    label: `${essayTitle} | ${essayUrl}`,
    value: 1,
  }),

  essayViewed: (essayTitle: string) => trackEvent({
    action: 'view_item',
    category: 'essays',
    label: essayTitle,
  }),

  baselineMethodQuickstartViewed: () => trackEvent({
    action: 'view_item',
    category: 'baseline_method',
    label: 'quickstart_guide',
  }),

  baselineMethodQuickstartToFullGuide: () => trackEvent({
    action: 'conversion',
    category: 'baseline_method',
    label: 'quickstart_to_full_guide',
    value: 1,
  }),

  baselineMethodFormStarted: () => trackEvent({
    action: 'begin_checkout',
    category: 'baseline_method',
    label: 'form_started',
  }),

  baselineMethodFormSubmitted: () => trackEvent({
    action: 'purchase',
    category: 'baseline_method',
    label: 'form_submitted',
    value: 1,
  }),

  startPageButtonClicked: (buttonLabel: string) => trackEvent({
    action: 'click',
    category: 'start_page',
    label: buttonLabel,
  }),
};
