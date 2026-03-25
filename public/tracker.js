// Non-blocking visitor tracker
(function () {
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

      console.log("Sending tracking data:", data);

      const res = await fetch('https://traffic-analyzer-9xqm.onrender.com/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      console.log("Track status:", res.status);
    } catch (error) {
      console.log('Tracker failed:', error);
    }
  }

  // Track when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackVisit);
  } else {
    trackVisit();
  }

  // Re-track when tab becomes active
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(trackVisit, 1000);
    }
  });

})();