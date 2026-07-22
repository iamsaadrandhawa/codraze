import { useEffect } from 'react';
import { visitorTracker } from '../lib/visitorTracker';

export function VisitorTracker() {
  useEffect(() => {
    console.log('📍 VisitorTracker component mounted');
    
    // Track visitor after page load
    const timer = setTimeout(() => {
      visitorTracker.track();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // This component doesn't render anything
  return null;
}