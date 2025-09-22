// Analytics and monitoring utilities
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export interface AnalyticsConfig {
  googleAnalyticsId?: string;
  enableInDevelopment?: boolean;
}

class Analytics {
  private config: AnalyticsConfig;
  private isInitialized = false;

  constructor(config: AnalyticsConfig = {}) {
    this.config = config;
  }

  // Initialize analytics services
  init() {
    if (this.isInitialized) return;

    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment && !this.config.enableInDevelopment) {
      console.log('Analytics disabled in development mode');
      return;
    }

    this.initGoogleAnalytics();
    this.initPerformanceMonitoring();
    this.isInitialized = true;
  }

  // Google Analytics setup
  private initGoogleAnalytics() {
    const gaId = this.config.googleAnalyticsId || (window as any).VITE_GA_ID;
    
    if (!gaId) {
      console.warn('Google Analytics ID not provided');
      return;
    }

    // Load GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer?.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', gaId, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }

  // Performance monitoring
  private initPerformanceMonitoring() {
    // Basic performance monitoring
    if ('performance' in window && 'PerformanceObserver' in window) {
      try {
        // Monitor navigation timing
        window.addEventListener('load', () => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            this.event('page_load_time', {
              event_category: 'performance',
              value: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
            });
          }
        });
      } catch (error) {
        console.warn('Performance monitoring setup failed:', error);
      }
    }
  }

  // Track page views
  pageView(path: string, title?: string) {
    if (!this.isInitialized) return;

    if (window.gtag) {
      window.gtag('config', this.config.googleAnalyticsId, {
        page_path: path,
        page_title: title || document.title,
      });
    }
  }

  // Track custom events
  event(action: string, parameters?: Record<string, any>) {
    if (!this.isInitialized) return;

    if (window.gtag) {
      window.gtag('event', action, parameters);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', { action, parameters });
    }
  }

  // Track user interactions
  trackClick(elementName: string, additionalData?: Record<string, any>) {
    this.event('click', {
      event_category: 'engagement',
      event_label: elementName,
      ...additionalData,
    });
  }

  // Track form submissions
  trackFormSubmit(formName: string, success: boolean, additionalData?: Record<string, any>) {
    this.event('form_submit', {
      event_category: 'form',
      event_label: formName,
      success,
      ...additionalData,
    });
  }

  // Track API calls
  trackApiCall(endpoint: string, method: string, status: number, duration: number) {
    this.event('api_call', {
      event_category: 'api',
      endpoint,
      method,
      status,
      duration,
    });
  }

  // Track errors
  trackError(error: Error, errorInfo?: any) {
    this.event('exception', {
      description: error.message,
      fatal: false,
      error_info: JSON.stringify(errorInfo),
    });

    // In production, you might want to send to error tracking service
    if (process.env.NODE_ENV !== 'development') {
      console.error('Tracked Error:', error, errorInfo);
    }
  }
}

// Create singleton instance
export const analytics = new Analytics({
  enableInDevelopment: false,
});

// React hook for analytics
export const useAnalytics = () => {
  return {
    pageView: analytics.pageView.bind(analytics),
    event: analytics.event.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackFormSubmit: analytics.trackFormSubmit.bind(analytics),
    trackApiCall: analytics.trackApiCall.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
  };
};

export default analytics;
