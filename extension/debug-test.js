// Debug Test Script for Time Tracking Extension
// Run this in the extension's background script console

console.log('🔍 Starting debug test...');

// Test 1: Check if background script is loaded
console.log('✅ Background script is running');

// Test 2: Check current stats
chrome.runtime.sendMessage({ action: 'getStats' }, (response) => {
  console.log('📊 Current stats:', response);
});

// Test 3: Check storage directly
chrome.storage.local.get(['todayStats', 'lastActiveDate'], (result) => {
  console.log('💾 Storage contents:', result);
});

// Test 4: Get current active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length > 0) {
    console.log('🎯 Current active tab:', tabs[0].url);
    console.log('🔗 Hostname:', new URL(tabs[0].url).hostname);
  }
});

// Test 5: Check if tracking is active
console.log('⏱️ Active tracking state:');
console.log('  - activeTabId:', typeof activeTabId !== 'undefined' ? activeTabId : 'undefined');
console.log('  - activeStartTime:', typeof activeStartTime !== 'undefined' ? activeStartTime : 'undefined');

// Test function to manually add test data
window.addTestData = function() {
  const testStats = {
    'example.com': 120, // 2 minutes
    'google.com': 300,  // 5 minutes
    'github.com': 180   // 3 minutes
  };
  
  chrome.storage.local.set({ 
    todayStats: testStats,
    lastActiveDate: new Date().toDateString()
  }, () => {
    console.log('✅ Test data added:', testStats);
    console.log('🔄 Reload the popup to see test data');
  });
};

// Test function to clear all data
window.clearTestData = function() {
  chrome.storage.local.clear(() => {
    console.log('🗑️ All data cleared');
    console.log('🔄 Reload the popup to see empty state');
  });
};

console.log('🎉 Debug test complete!');
console.log('💡 Available functions:');
console.log('  - addTestData() - Add sample tracking data');
console.log('  - clearTestData() - Clear all data'); 