// Popup script for time tracking extension - FIXED VERSION
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Popup loading...');
  
  // Setup buttons immediately - don't wait for data
  setupDashboardButton();
  setupResetButton();
  
  // Hide the default loading state and show our own
  hideDefaultLoadingState();
  
  // Load data with timeout
  loadTimeDataWithTimeout();
  
  console.log('✅ Popup loaded successfully');
});

// Hide the default loading state from HTML
function hideDefaultLoadingState() {
  const loadingState = document.getElementById('loadingState');
  const noDataState = document.getElementById('noDataState');
  const sitesList = document.getElementById('sitesList');
  
  if (loadingState) loadingState.style.display = 'none';
  if (noDataState) noDataState.style.display = 'none';
  if (sitesList) sitesList.style.display = 'none';
}

// Load data with a 3-second timeout
async function loadTimeDataWithTimeout() {
  const container = document.getElementById('sitesContainer');
  
  // Show immediate loading state
  container.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <div style="margin-bottom: 10px;">📊</div>
      <div>Loading your stats...</div>
    </div>
  `;

  try {
    // Race between data loading and timeout
    const result = await Promise.race([
      loadTimeData(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      )
    ]);
  } catch (error) {
    console.log('⚠️ Data loading failed or timed out:', error.message);
    // Try direct storage access
    await loadFromStorageDirectly();
  }
}

// Load time data from background script
async function loadTimeData() {
  try {
    console.log('📊 Requesting stats from background...');
    
    const response = await sendMessageToBackground({ action: 'getStats' });
    
    if (response && response.stats && Object.keys(response.stats).length > 0) {
      console.log('📈 Received stats:', response.stats);
      displayStats(response.stats);
    } else {
      console.log('📭 No stats from background, trying storage...');
      await loadFromStorageDirectly();
    }
  } catch (error) {
    console.error('❌ Background script error:', error);
    await loadFromStorageDirectly();
  }
}

// Direct storage access - most reliable
async function loadFromStorageDirectly() {
  try {
    console.log('💾 Loading directly from storage...');
    const result = await chrome.storage.local.get(['todayStats']);
    const stats = result.todayStats || {};
    
    if (Object.keys(stats).length > 0) {
      console.log('✅ Found data in storage:', stats);
      displayStats(stats);
    } else {
      console.log('📭 No data found');
      displayNoActivity();
    }
  } catch (error) {
    console.error('❌ Storage access failed:', error);
    displayNoActivity();
  }
}

// Send message with timeout
function sendMessageToBackground(message) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Message timeout'));
    }, 2000);

    chrome.runtime.sendMessage(message, (response) => {
      clearTimeout(timeout);
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

// Display statistics
function displayStats(stats) {
  const container = document.getElementById('sitesContainer');
  
  // Filter and sort sites
  const sortedSites = Object.entries(stats)
    .filter(([, seconds]) => seconds > 0)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  if (sortedSites.length === 0) {
    displayNoActivity();
    return;
  }

  let html = '<div class="sites-list" style="display: flex; flex-direction: column; gap: 8px;">';
  let totalTime = 0;

  sortedSites.forEach(([site, seconds]) => {
    totalTime += seconds;
    const timeStr = formatDuration(seconds);
    const percentage = Math.min(100, (seconds / Math.max(...Object.values(stats))) * 100);
    
    html += `
      <div style="display: flex; flex-direction: column; gap: 4px; padding: 8px; background: rgba(255,255,255,0.5); border-radius: 6px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 500; font-size: 14px;">${site}</span>
          <span style="color: #666; font-size: 12px;">${timeStr}</span>
        </div>
        <div style="width: 100%; height: 4px; background: rgba(0,0,0,0.1); border-radius: 2px;">
          <div style="width: ${percentage}%; height: 100%; background: #007AFF; border-radius: 2px;"></div>
        </div>
      </div>
    `;
  });

  html += '</div>';

  // Add total
  if (totalTime > 0) {
    html += `
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.1); text-align: center; font-weight: 600; color: #333;">
        Total: ${formatDuration(totalTime)}
      </div>
    `;
  }

  container.innerHTML = html;
  console.log(`✅ Displayed ${sortedSites.length} sites`);
}

// Show no activity
function displayNoActivity() {
  const container = document.getElementById('sitesContainer');
  container.innerHTML = `
    <div class="no-data-state" style="display: block; text-align: center; padding: 30px 20px; color: #666;">
      <div class="empty-icon" style="font-size: 24px; margin-bottom: 8px;">📊</div>
      <p style="font-weight: 500; margin-bottom: 4px;">No activity detected today</p>
      <small style="font-size: 12px;">Browse some websites to see tracking!</small>
    </div>
  `;
  console.log('📭 Showing no activity');
}

// Format duration
function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// Setup dashboard button - FIXED TO MATCH HTML
function setupDashboardButton() {
  const dashboardBtn = document.getElementById('openDashboard');
  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', async () => {
      console.log('🔗 Opening dashboard...');
      
      try {
        // Get the current time tracking data
        const result = await chrome.storage.local.get(['todayStats']);
        const stats = result.todayStats || {};
        
        console.log('📊 Sending stats to dashboard:', stats);
        
        // Encode the data as Base64 JSON for the dashboard
        let dashboardUrl = 'http://localhost:8080/';
        
        if (Object.keys(stats).length > 0) {
          const jsonString = JSON.stringify(stats);
          const base64Data = btoa(jsonString);
          dashboardUrl += '#' + base64Data;
          console.log('✅ Dashboard URL with data:', dashboardUrl);
        } else {
          console.log('⚠️ No time data found, opening dashboard without data');
        }
        
        chrome.tabs.create({ url: dashboardUrl });
        window.close();
        
      } catch (error) {
        console.error('❌ Failed to load data for dashboard:', error);
        // Fallback: open dashboard without data
        chrome.tabs.create({ url: 'http://localhost:8080/' });
        window.close();
      }
    });
    console.log('✅ Dashboard button setup complete');
  } else {
    console.error('❌ Dashboard button not found');
  }
}

// Setup reset button - FIXED TO MATCH HTML
function setupResetButton() {
  const resetBtn = document.getElementById('resetData');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      if (confirm('Clear all time tracking data?')) {
        try {
          console.log('🗑️ Clearing data...');
          
          // Clear storage directly - most reliable
          await chrome.storage.local.clear();
          
          // Try to reset background script too
          try {
            await sendMessageToBackground({ action: 'resetStats' });
          } catch (error) {
            console.log('Background reset failed, but storage cleared');
          }
          
          // Reload popup
          window.location.reload();
          
        } catch (error) {
          console.error('❌ Reset failed:', error);
          alert('Reset failed. Please try reloading the extension.');
        }
      }
    });
    console.log('✅ Reset button ready');
  } else {
    console.error('❌ Reset button not found! ID: resetData');
  }
}

// Debug function to check what's in storage
async function checkStorage() {
    try {
        const result = await chrome.storage.local.get(null);
        console.log('📦 Full storage contents:', result);
        console.log('📦 Number of items in storage:', Object.keys(result).length);
        
        // Check for time tracking data
        const timeSpent = result.timeSpent || {};
        console.log('⏰ Time tracking data:', timeSpent);
        
        // Check for specific sites
        const sites = Object.keys(timeSpent);
        console.log('🌐 Tracked sites:', sites);
        
        sites.forEach(site => {
            console.log(`  ${site}: ${timeSpent[site]} seconds`);
        });
        
        return result;
    } catch (error) {
        console.error('❌ Error checking storage:', error);
    }
}

// Make debugging functions available in console
window.debugTimeTracker = {
    checkStorage,
    checkBackgroundScript,
    getCurrentTab,
    forceTrackCurrentSite,
    // NEW: Test dashboard data passing
    testDashboardData: async () => {
      try {
        const result = await chrome.storage.local.get(['todayStats']);
        const stats = result.todayStats || {};
        
        console.log('📊 Current stats:', stats);
        
        if (Object.keys(stats).length > 0) {
          const jsonString = JSON.stringify(stats);
          const base64Data = btoa(jsonString);
          const dashboardUrl = 'http://localhost:8080/#' + base64Data;
          
          console.log('📋 JSON data:', jsonString);
          console.log('🔗 Base64 encoded:', base64Data);
          console.log('🌐 Dashboard URL:', dashboardUrl);
          
          // Test decoding
          const decoded = JSON.parse(atob(base64Data));
          console.log('✅ Decoded test:', decoded);
          
          return { stats, jsonString, base64Data, dashboardUrl, decoded };
        } else {
          console.log('❌ No stats found in storage');
          return null;
        }
      } catch (error) {
        console.error('❌ Test failed:', error);
        return null;
      }
    }
};

// Make functions available in console for debugging
window.debugExtension = {
  loadData: loadTimeDataWithTimeout,
  clearData: () => chrome.storage.local.clear(),
  checkStorage: () => chrome.storage.local.get(['todayStats']).then(console.log),
  testButtons: () => {
    console.log('Dashboard button:', document.getElementById('openDashboard'));
    console.log('Reset button:', document.getElementById('resetData'));
    console.log('Sites container:', document.getElementById('sitesContainer'));
  },
  // NEW DEBUGGING FUNCTIONS
  checkBackgroundScript: async () => {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getStats' });
      console.log('Background script response:', response);
      return response;
    } catch (error) {
      console.error('Background script error:', error);
      return null;
    }
  },
  getCurrentTab: async () => {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('Current tab:', tabs[0]);
      return tabs[0];
    } catch (error) {
      console.error('Tab query error:', error);
      return null;
    }
  },
  forceTrackCurrentSite: async () => {
    try {
      const tab = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab[0]) {
        console.log('Forcing track for:', tab[0].url);
        // Add 60 seconds to current site for testing
        const hostname = new URL(tab[0].url).hostname;
        const result = await chrome.storage.local.get(['todayStats']);
        const stats = result.todayStats || {};
        stats[hostname] = (stats[hostname] || 0) + 60;
        await chrome.storage.local.set({ todayStats: stats });
        console.log('Added 60 seconds to', hostname);
        // Reload popup to show changes
        window.location.reload();
      }
    } catch (error) {
      console.error('Force track error:', error);
    }
  }
}; 