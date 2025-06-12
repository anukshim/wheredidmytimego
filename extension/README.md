# Where Did My Time Go? - Chrome Extension

A privacy-focused time tracking extension that automatically monitors your website usage and provides insights through a beautiful dashboard.

## 🚀 Features

- **Automatic Time Tracking**: Seamlessly tracks time spent on websites
- **Smart Insights**: Real-time analysis of your digital habits  
- **Real-time Updates**: Live data sync with dashboard
- **Quick Reflection**: Capture thoughts directly in the popup
- **Dashboard Integration**: Beautiful visualization of your time data
- **Privacy First**: All data stays local - nothing leaves your browser

## 📦 Installation

### Development Mode (Chrome/Edge)
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. The extension should appear in your toolbar

### Development Mode (Firefox)
1. Open Firefox and go to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select any file in the `extension` folder

## 🔧 Troubleshooting

### ⚠️ **Time Data Issues**

If you see incorrect time values (like 972020 hours), follow these steps:

1. **Reset Extension Data**:
   - Click the extension icon
   - Click the 🗑️ Reset button
   - Confirm the reset

2. **Manual Reset**:
   - Open Chrome DevTools on the popup (right-click extension → Inspect)
   - In console, type: `resetExtensionData()`
   - Press Enter

3. **Reload Extension**:
   - Go to `chrome://extensions/`
   - Find "Where Did My Time Go?"
   - Click the refresh button 🔄

4. **Fresh Install**:
   - Remove the extension
   - Close all browser windows
   - Reload the extension

### 🔍 **Debug Information**

To see what's happening:
1. Right-click the extension icon → Inspect
2. Check the Console tab for logs
3. Look for "Raw stats from storage" and "Cleaned stats"

## 🎯 How to Use

1. **Start Tracking**: Simply browse normally - tracking is automatic
2. **View Stats**: Click the extension icon to see your top sites
3. **Quick Reflection**: Add notes about your digital habits
4. **Dashboard**: Click "📊 Open Dashboard" for detailed insights
5. **AI Insights**: Use your OpenAI key for personalized productivity coaching

## 🛠️ Technical Details

- **Architecture**: Manifest V3, background service worker
- **Storage**: Chrome local storage API
- **Permissions**: Minimal - only `activeTab`, `storage`, `tabs`
- **Tracking**: Only active tab with 3+ second minimum
- **Data Format**: `{hostname: seconds}` JSON structure

## 🔗 Dashboard Integration

The extension automatically syncs with your dashboard at:
- http://localhost:8080/ (or your configured port)
- Data passed via URL hash as Base64-encoded JSON
- Real-time reflection sync

## 🔒 Privacy & Security

- **Local Only**: All data stored in your browser
- **No Servers**: No external data collection
- **Minimal Permissions**: Only necessary browser APIs
- **Open Source**: Full code transparency

## 📱 Data Flow

1. **Background Script**: Tracks active tabs and time
2. **Content Script**: Monitors page activity and focus
3. **Popup**: Displays stats and quick reflection
4. **Dashboard**: Comprehensive analysis and AI insights

## 🐛 Known Issues & Fixes

- **Large Time Values**: Fixed in latest version with data validation
- **Mock Data**: Disabled - now uses real tracking data only
- **Extension Reload**: Required after any code changes
- **Focus Tracking**: Stops when browser loses focus (intended)

---

**Last Updated**: December 2024  
**Version**: 1.1.0 - Fixed Time Tracking  
**Status**: ✅ Production Ready 