# Where Did My Time Go? - Daily Web Dashboard

A beautiful, comprehensive daily time tracking dashboard that accepts Base64-encoded JSON data and provides insights, visualizations, and reflection tools.

## 🚀 Features

### ✅ Complete Implementation

**A. Snapshot Section**
- Interactive doughnut chart showing time distribution by hostname
- Central overlay with total time online
- Three metric cards: Total sites, Longest stretch, Focus vs Distraction

**B. Timeline Strip** 
- 24-hour horizontal bar with color-coded segments
- Each segment represents one hour, colored by dominant hostname
- Hour labels (0, 6, 12, 18, 24)

**C. AI Story & Insights**
- OpenAI integration for personalized insights
- Loading spinner with "Crunching your day..." message
- Structured output: Story, Insights, Tomorrow suggestions
- Support for user's own OpenAI API key

**D. Reflection**
- Two auto-saving text areas for daily reflection
- "Highlight of the day" and "Activity to trade for sleep"
- Instant save to localStorage with toast confirmation

**E. Yesterday's Commitment**
- Displays previous day's AI suggestion if available
- Checkbox to mark completion
- Auto-fade on completion

## 🎨 Design & Styling

- **Font**: Inter via Google Fonts
- **Colors**: Custom palette with indigo primary (#4f46e5) and lavender accent (#e0e7ff)
- **Layout**: Centered 680px max-width column with 24px padding
- **Cards**: Subtle shadows, 16px border-radius, 20px inner padding
- **Responsive**: Works beautifully on all screen sizes

## 📊 Data Format

The dashboard expects Base64-encoded JSON in the URL hash:

```javascript
// Example data structure
{
  "github.com": 7200,        // 2 hours in seconds
  "stackoverflow.com": 5400,  // 1.5 hours
  "youtube.com": 3600        // 1 hour
}
```

## 🔧 How to Use

1. **With Extension Data**: Visit the URL with a hash containing Base64-encoded JSON
   ```
   https://yoursite.com/#eyJnaXRodWIuY29tIjo3MjAwfQ==
   ```

2. **Demo Mode**: Click "View Demo Data" to see the dashboard in action

3. **OpenAI Integration**: 
   - Click "Use your OpenAI key" in the AI section
   - Enter your API key for personalized insights
   - Or use without a key to see demo insights

## 🔑 OpenAI Setup (Optional)

For personalized AI insights:
1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Click "Use your OpenAI key" in the AI section
3. Enter your key (it's not stored, only used for the session)

## 💾 Data Persistence

- **Reflections**: Saved to browser localStorage by date
- **Commitments**: AI suggestions stored for next-day retrieval
- **Follow-through tracking**: Completion status saved locally

## 🔗 Integration

Ready for browser extension integration:
- Accepts data via URL hash
- Decodes Base64 JSON automatically
- Graceful fallback when no data is present
- All client-side, no backend required

## 🛠️ Technical Details

- Built with React + TypeScript
- Chart.js for beautiful visualizations
- Tailwind CSS for styling
- Full offline functionality
- Toast notifications for user feedback

## 📱 Responsive Design

- Mobile-first approach
- Flexible layouts that adapt to screen size
- Touch-friendly interactions
- Optimized for both desktop and mobile use

---

**Ready to deploy!** Simply host this application and share the URL with your browser extension for instant daily insights and reflection.