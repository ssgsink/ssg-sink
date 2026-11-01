'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function AnalyticsEvents() {
  useEffect(() => {
    const trackConsultation = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      const method = href.startsWith('tel:') ? 'phone' : href.startsWith('sms:') ? 'sms' : null;
      if (!method) return;
      window.gtag?.('event', 'consultation_click', {
        consultation_method: method,
        link_location: window.location.pathname,
      });
    };
    document.addEventListener('click', trackConsultation, true);
    return () => document.removeEventListener('click', trackConsultation, true);
  }, []);
  return null;
}
