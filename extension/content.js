// Content script for enhanced time tracking
let isPageActive = true;
let lastActivityTime = Date.now();
let pageTitle = document.title;
let hostname = window.location.hostname.replace(/^www\./, '');

// Track page visibility and user activity
document.addEventListener('visibilitychange', () => {
  isPageActive = !document.hidden;
  if (isPageActive) {
    lastActivityTime = Date.now();
    sendActivityUpdate();
  }
});

// Track user interactions for more accurate time tracking
const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
let activityThrottleTimeout;

activityEvents.forEach(eventType => {
  document.addEventListener(eventType, throttleActivity, { passive: true });
});

function throttleActivity() {
  if (activityThrottleTimeout) return;
  
  activityThrottleTimeout = setTimeout(() => {
    lastActivityTime = Date.now();
    activityThrottleTimeout = null;
  }, 1000); // Throttle to once per second
}

// Send activity updates to background script
function sendActivityUpdate() {
  try {
    chrome.runtime.sendMessage({
      action: 'pageActivity',
      data: {
        hostname: hostname,
        title: pageTitle,
        isActive: isPageActive,
        timestamp: lastActivityTime,
        url: window.location.href
      }
    });
  } catch (error) {
    // Extension might be updating or unavailable
    console.debug('Could not send activity update:', error);
  }
}

// Detect page title changes (for SPAs)
let titleObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && document.title !== pageTitle) {
      pageTitle = document.title;
      sendActivityUpdate();
    }
  });
});

// Start observing title changes
titleObserver.observe(document.querySelector('title') || document.head, {
  childList: true,
  subtree: true
});

// Detect URL changes in SPAs (Single Page Applications)
let currentUrl = window.location.href;
let urlCheckInterval = setInterval(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    hostname = window.location.hostname.replace(/^www\./, '');
    pageTitle = document.title;
    sendActivityUpdate();
  }
}, 1000);

// Track focus/blur events
window.addEventListener('focus', () => {
  isPageActive = true;
  lastActivityTime = Date.now();
  sendActivityUpdate();
});

window.addEventListener('blur', () => {
  isPageActive = false;
  sendActivityUpdate();
});

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
  clearInterval(urlCheckInterval);
  if (titleObserver) {
    titleObserver.disconnect();
  }
  
  // Send final activity update
  sendActivityUpdate();
});

// Initialize
sendActivityUpdate(); 