// Demo data for showcasing the dashboard functionality
export const demoStats = {
  "github.com": 7200, // 2 hours
  "stackoverflow.com": 5400, // 1.5 hours  
  "docs.google.com": 4800, // 1.33 hours
  "youtube.com": 3600, // 1 hour
  "twitter.com": 2700, // 45 minutes
  "linkedin.com": 1800, // 30 minutes
  "medium.com": 1500, // 25 minutes
  "reddit.com": 900, // 15 minutes
};

// Generate demo hash for sharing
export const generateDemoHash = (): string => {
  const jsonString = JSON.stringify(demoStats);
  const base64 = btoa(jsonString);
  return base64;
};