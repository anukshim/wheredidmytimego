// Hash decoding and utility functions for the time dashboard

export interface TimeStats {
  [hostname: string]: number; // seconds per hostname
}

// Decode Base64 JSON from URL hash
export const decodeHashData = (): TimeStats => {
  try {
    const raw = window.location.hash.slice(1);
    if (!raw) return {};
    return JSON.parse(atob(raw));
  } catch (error) {
    console.error('Failed to decode hash data:', error);
    return {};
  }
};

// Format seconds to hours and minutes
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours} h ${minutes} m`;
};

// Calculate total time online
export const getTotalTime = (stats: TimeStats): number => {
  return Object.values(stats).reduce((sum, seconds) => sum + seconds, 0);
};

// Get total sites visited
export const getTotalSites = (stats: TimeStats): number => {
  return Object.keys(stats).length;
};

// Get longest single stretch in minutes
export const getLongestStretch = (stats: TimeStats): number => {
  if (Object.keys(stats).length === 0) return 0;
  const maxSeconds = Math.max(...Object.values(stats));
  return Math.round((maxSeconds / 60) * 10) / 10; // 1 decimal place
};

// Generate color for hostname (simple hash-based color)
export const getHostnameColor = (hostname: string): string => {
  let hash = 0;
  for (let i = 0; i < hostname.length; i++) {
    hash = hostname.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 60%)`;
};

// Create timeline data (24 segments representing hours)
export const createTimelineData = (stats: TimeStats): Array<{hour: number, dominantHost: string, color: string}> => {
  const timeline = [];
  
  // For demo purposes, distribute the time across hours based on total time
  const totalTime = getTotalTime(stats);
  const hosts = Object.keys(stats);
  
  for (let hour = 0; hour < 24; hour++) {
    // Simple distribution - use first host as dominant for demo
    const dominantHost = hosts[hour % hosts.length] || '';
    timeline.push({
      hour,
      dominantHost,
      color: dominantHost ? getHostnameColor(dominantHost) : '#e5e7eb'
    });
  }
  
  return timeline;
};

// Call OpenAI API for insights
export const getAIInsights = async (
  stats: TimeStats, 
  apiKey?: string, 
  reflectionData?: { highlight: string; trade: string }
): Promise<string> => {
  if (!apiKey) {
    // Return enhanced mock data for demo
    const hasReflection = reflectionData && (reflectionData.highlight || reflectionData.trade);
    if (hasReflection) {
      return `**Story**
Your reflection shows a thoughtful approach to your digital day. You've identified what worked well and what didn't, which is the first step to building better habits.

**Insights**
➜ Your awareness of time trade-offs shows growing digital mindfulness
➜ Highlighting positive moments helps reinforce productive patterns

**Tomorrow**
Try: Start your day by reviewing yesterday's reflection before opening any apps.`;
    }
    
    return `**Story**
You spent most of your digital day in productivity mode, with occasional creative breaks. A balanced approach to screen time that shows intention behind your clicks.

**Insights**
➜ Peak focus happened during morning hours
➜ Social apps used strategically, not compulsively

**Tomorrow**
Try: Block the first hour for deep work without any notifications.`;
  }

  try {
    // Build enhanced prompt with reflection data
    let prompt = `You are a concise productivity coach analyzing digital habits.

TIME DATA (seconds per website):
${JSON.stringify(stats)}`;

    if (reflectionData && (reflectionData.highlight || reflectionData.trade)) {
      prompt += `

USER'S REFLECTION:
Highlight of the day: "${reflectionData.highlight}"
Activity to trade for sleep: "${reflectionData.trade}"`;
    }

    prompt += `

Respond in Markdown using this template exactly:
**Story**
<two sentences connecting their time data with their reflection, empathetic, light humor>
**Insights**
➜ <insight 1 based on data + reflection, ≤15 words>
➜ <insight 2 based on patterns you see, ≤15 words>
**Tomorrow**
Try: <one specific, actionable suggestion based on their reflection and data>`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 250
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Unable to generate insights.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'Unable to generate insights. Please check your API key.';
  }
};

// Local storage helpers
export const saveReflection = (date: string, highlight: string, trade: string): void => {
  const reflectionKey = `reflection-${date}`;
  localStorage.setItem(reflectionKey, JSON.stringify({ highlight, trade }));
};

export const getReflection = (date: string): {highlight: string, trade: string} | null => {
  const reflectionKey = `reflection-${date}`;
  const data = localStorage.getItem(reflectionKey);
  return data ? JSON.parse(data) : null;
};

export const getYesterdayCommitment = (): string | null => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = `commitment-${yesterday.toISOString().split('T')[0]}`;
  return localStorage.getItem(yesterdayKey);
};

export const saveCommitmentResult = (date: string, followed: boolean): void => {
  const resultKey = `commitment-result-${date}`;
  localStorage.setItem(resultKey, JSON.stringify({ followed, timestamp: Date.now() }));
};

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};