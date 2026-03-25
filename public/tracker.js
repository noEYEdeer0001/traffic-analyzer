// Non-blocking visitor tracker
(function() {
  'use strict';

  async function getVisitorIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      // Fallback: generate pseudo-random IP
      return '127.0.0.' + Math.floor(Math.random() * 255);
    }
  }

  function detectDevice() {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return 'mobile';
    if (/tablet/i.test(ua)) return 'tablet';
    return 'desktop';
  }

  async function trackVisit() {
    try {
      const ip = await getVisitorIP();
      const data = {
        ip,
        pageUrl: window.location.href,
        deviceType: detectDevice(),
        userAgent: navigator.userAgent.slice(0, 200)
      };

      await fetch('http://localhost:3000/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      // Silent fail - don't block page load
      console.log('Tracker failed:', error);
    }
  }

  // Track when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackVisit);
  } else {
    trackVisit();
  }

  // Re-track on page visibility change (SPA support)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(trackVisit, 1000);
    }
  });

})();

