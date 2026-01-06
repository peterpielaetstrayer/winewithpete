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
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', event);
  }
  
  // Send to Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }
};

// Common events for Wine With Pete
export const analyticsEvents = {
  // Store events
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
  
  // Event events
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
  
  // Newsletter events
  newsletterSignup: () => trackEvent({
    action: 'sign_up',
    category: 'newsletter',
  }),
  
  // Navigation events
  pageView: (pageName: string) => trackEvent({
    action: 'page_view',
    category: 'navigation',
    label: pageName,
  }),
};
