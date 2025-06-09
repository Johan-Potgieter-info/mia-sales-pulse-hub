
import { useEffect, useRef } from 'react';

interface CalendlyEmbedWidgetProps {
  url: string;
  height?: string;
  className?: string;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: Record<string, string>;
  };
  utm?: {
    utmCampaign?: string;
    utmSource?: string;
    utmMedium?: string;
    utmContent?: string;
    utmTerm?: string;
  };
}

export const CalendlyEmbedWidget = ({
  url,
  height = '700px',
  className = '',
  prefill,
  utm
}: CalendlyEmbedWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing embed
    containerRef.current.innerHTML = '';

    // Build the embed URL with parameters
    const embedUrl = new URL(url);
    
    // Add prefill parameters
    if (prefill) {
      if (prefill.name) embedUrl.searchParams.set('name', prefill.name);
      if (prefill.email) embedUrl.searchParams.set('email', prefill.email);
      if (prefill.customAnswers) {
        Object.entries(prefill.customAnswers).forEach(([key, value]) => {
          embedUrl.searchParams.set(key, value);
        });
      }
    }

    // Add UTM parameters
    if (utm) {
      if (utm.utmCampaign) embedUrl.searchParams.set('utm_campaign', utm.utmCampaign);
      if (utm.utmSource) embedUrl.searchParams.set('utm_source', utm.utmSource);
      if (utm.utmMedium) embedUrl.searchParams.set('utm_medium', utm.utmMedium);
      if (utm.utmContent) embedUrl.searchParams.set('utm_content', utm.utmContent);
      if (utm.utmTerm) embedUrl.searchParams.set('utm_term', utm.utmTerm);
    }

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl.toString();
    iframe.width = '100%';
    iframe.height = height;
    iframe.frameBorder = '0';
    iframe.title = 'Calendly Booking Widget';
    iframe.style.border = 'none';

    containerRef.current.appendChild(iframe);

    // Listen for Calendly events
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://calendly.com') return;

      if (event.data?.event) {
        switch (event.data.event) {
          case 'calendly.event_scheduled':
            console.log('Event scheduled:', event.data.payload);
            // Dispatch custom event for parent components to listen to
            window.dispatchEvent(new CustomEvent('calendly:event_scheduled', {
              detail: event.data.payload
            }));
            break;
          case 'calendly.profile_page_viewed':
            console.log('Profile page viewed:', event.data.payload);
            break;
          case 'calendly.event_type_viewed':
            console.log('Event type viewed:', event.data.payload);
            break;
          case 'calendly.date_and_time_selected':
            console.log('Date and time selected:', event.data.payload);
            break;
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [url, height, prefill, utm]);

  return (
    <div 
      ref={containerRef} 
      className={`calendly-inline-widget ${className}`}
      style={{ minWidth: '320px', height }}
    />
  );
};
