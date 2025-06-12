// Test script to verify time tracking is working
// Run this in the browser console to check tracking status

async function testTimeTracking() {
  console.log('🧪 Testing Time Tracking Extension...');
  
  try {
    // Test getting current stats
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'getStats' }, resolve);
    });
    
    console.log('📊 Current Stats:', response.stats);
    
    // Check if we have any data
    const hasData = Object.keys(response.stats || {}).length > 0;
    console.log('📈 Has tracking data:', hasData);
    
    if (hasData) {
      console.log('✅ Tracking appears to be working!');
      
      // Show formatted time for each site
      for (const [hostname, seconds] of Object.entries(response.stats)) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        console.log(`🌐 ${hostname}: ${minutes}m ${remainingSeconds}s`);
      }
    } else {
      console.log('⚠️ No tracking data found. Try browsing for a few seconds then run this again.');
    }
    
  } catch (error) {
    console.error('❌ Error testing tracking:', error);
  }
}

// Auto-run the test
testTimeTracking();

// Export for manual use
window.testTimeTracking = testTimeTracking; 