// Background script for time tracking - SIMPLIFIED VERSION
let activeTabId = null;
let activeStartTime = null;
let todayStats = {};

console.log('🚀 Time tracking extension background script loaded');

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('✅ Extension installed, initializing...');
  await loadTodayStats();
  await startTrackingCurrentTab();
});

// Initialize on startup
chrome.runtime.onStartup.addListener(async () => {
  console.log('✅ Extension started, initializing...');
  await loadTodayStats();
  await startTrackingCurrentTab();
});

// Start tracking current tab
async function startTrackingCurrentTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0 && tabs[0].url && !isExcludedUrl(tabs[0].url)) {
      console.log('🎯 Starting tracking for current tab:', tabs[0].url);
      activeTabId = tabs[0].id;
      activeStartTime = Date.now();
    }
  } catch (error) {
    console.error('❌ Error starting tracking:', error);
  }
}

// Load today's stats
async function loadTodayStats() {
  try {
    const result = await chrome.storage.local.get(['todayStats', 'lastActiveDate']);
    const today = new Date().toDateString();
    
    if (result.lastActiveDate !== today) {
      console.log('📅 New day detected, resetting stats');
      todayStats = {};
      await chrome.storage.local.set({ 
        todayStats: {},
        lastActiveDate: today 
      });
    } else {
      todayStats = result.todayStats || {};
      console.log('📊 Loaded existing stats:', todayStats);
    }
  } catch (error) {
    console.error('❌ Error loading stats:', error);
    todayStats = {};
  }
}

// Track tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('🔄 Tab activated:', activeInfo.tabId);
  await switchToTab(activeInfo.tabId);
});

// Track tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    console.log('🔄 Tab updated:', tab.url);
    await switchToTab(tabId);
  }
});

// Track tab removal
chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (tabId === activeTabId) {
    console.log('🗑️ Active tab was closed, stopping tracking');
    await stopCurrentTrackingWithoutTab();
  }
});

// Track window focus
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    console.log('👋 Browser lost focus, stopping tracking');
    await stopCurrentTracking();
  } else {
    console.log('👀 Browser gained focus, resuming tracking');
    await startTrackingCurrentTab();
  }
});

// Switch tracking to new tab
async function switchToTab(tabId) {
  try {
    // Record time for previous tab
    await stopCurrentTracking();
    
    // Start tracking new tab
    const tab = await getTabSafely(tabId);
    if (tab && tab.url && !isExcludedUrl(tab.url)) {
      console.log('▶️ Starting tracking:', getHostnameFromUrl(tab.url));
      activeTabId = tabId;
      activeStartTime = Date.now();
    } else {
      console.log('⏭️ Skipping excluded URL:', tab?.url);
      activeTabId = null;
      activeStartTime = null;
    }
  } catch (error) {
    console.error('❌ Error switching tabs:', error);
  }
}

// Stop current tracking and record time
async function stopCurrentTracking() {
  if (activeTabId && activeStartTime) {
    try {
      const tab = await getTabSafely(activeTabId);
      if (tab && tab.url) {
        const hostname = getHostnameFromUrl(tab.url);
        const timeSpent = Math.floor((Date.now() - activeStartTime) / 1000);
        
        if (timeSpent >= 3) {
          const previousTime = todayStats[hostname] || 0;
          todayStats[hostname] = previousTime + timeSpent;
          
          await chrome.storage.local.set({ todayStats });
          
          console.log(`⏱️ Recorded ${timeSpent}s on ${hostname} (total: ${todayStats[hostname]}s)`);
        } else {
          console.log(`⚡ Short session (${timeSpent}s) on ${hostname}, not recording`);
        }
      }
    } catch (error) {
      console.error('❌ Error stopping tracking:', error);
      // If we can't get the tab, try to stop without tab info
      await stopCurrentTrackingWithoutTab();
      return;
    }
  }
  
  activeTabId = null;
  activeStartTime = null;
}

// Stop tracking when we can't access the tab (e.g., tab was closed)
async function stopCurrentTrackingWithoutTab() {
  if (activeStartTime) {
    console.log('⏹️ Stopping tracking for closed/inaccessible tab');
    // We can't identify the hostname, so we just reset the tracking state
    activeTabId = null;
    activeStartTime = null;
  }
}

// Safely get tab information
async function getTabSafely(tabId) {
  try {
    return await chrome.tabs.get(tabId);
  } catch (error) {
    // Tab doesn't exist anymore
    console.log(`📭 Tab ${tabId} no longer exists`);
    return null;
  }
}

// Get current stats including active session
async function getCurrentStats() {
  const stats = { ...todayStats };
  
  // Add current session if active
  if (activeTabId && activeStartTime) {
    try {
      const tab = await getTabSafely(activeTabId);
      if (tab && tab.url && !isExcludedUrl(tab.url)) {
        const hostname = getHostnameFromUrl(tab.url);
        const currentTime = Math.floor((Date.now() - activeStartTime) / 1000);
        
        if (currentTime >= 1) {
          const previousTime = stats[hostname] || 0;
          stats[hostname] = previousTime + currentTime;
          console.log(`📱 Including current session: ${currentTime}s on ${hostname}`);
        }
      }
    } catch (error) {
      console.error('❌ Error getting current session:', error);
      // Reset tracking state if tab is gone
      activeTabId = null;
      activeStartTime = null;
    }
  }
  
  return stats;
}

// Message handling
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('📨 Received message:', request.action);
  
  try {
    if (request.action === 'getStats') {
      const currentStats = await getCurrentStats();
      console.log('📤 Sending stats:', currentStats);
      sendResponse({ stats: currentStats });
    } else if (request.action === 'resetStats') {
      console.log('🗑️ Resetting stats');
      todayStats = {};
      activeTabId = null;
      activeStartTime = null;
      await chrome.storage.local.set({ todayStats: {} });
      sendResponse({ success: true });
    }
  } catch (error) {
    console.error('❌ Error handling message:', error);
    sendResponse({ error: error.message });
  }
  
  return true;
});

// Utility functions
function getHostnameFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

function isExcludedUrl(url) {
  const excludedPatterns = [
    'chrome://', 'chrome-extension://', 'edge://', 'firefox://',
    'about:', 'moz-extension://', 'file://', 'data:', 'javascript:'
  ];
  return excludedPatterns.some(pattern => url.startsWith(pattern));
}

// Clean up on shutdown
chrome.runtime.onSuspend.addListener(async () => {
  console.log('🛑 Extension suspending');
  await stopCurrentTracking();
});

// Simple periodic save every 30 seconds
setInterval(async () => {
  try {
    if (Object.keys(todayStats).length > 0) {
      await chrome.storage.local.set({ todayStats });
      console.log('💾 Periodic save:', todayStats);
    }
  } catch (error) {
    console.error('❌ Periodic save error:', error);
  }
}, 30000);

console.log('🎉 Background script initialization complete'); 