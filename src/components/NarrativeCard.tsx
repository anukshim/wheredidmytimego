import React, { useState, useEffect } from 'react';
import { TimeStats, getAIInsights } from '../utils/timeUtils';

interface NarrativeCardProps {
  stats: TimeStats;
}

const NarrativeCard: React.FC<NarrativeCardProps> = ({ stats }) => {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      if (Object.keys(stats).length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getAIInsights(stats);
        setInsights(result);
      } catch (error) {
        console.error('Failed to get insights:', error);
        setInsights('Unable to generate insights at this time.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [stats]);

  const renderInsights = () => {
    if (!insights) return null;

    const sections = insights.split('**').filter(Boolean);
    let content = '';

    sections.forEach((section, index) => {
      if (section.includes('Story')) {
        const story = section.replace('Story', '').trim();
        content += `<h3>Story</h3><p>${story}</p>`;
      } else if (section.includes('Insights')) {
        const insightsText = section.replace('Insights', '').trim();
        content += `<h3 class="insights">Insights</h3><div>${insightsText}</div>`;
      } else if (section.includes('Tomorrow')) {
        const tomorrowText = section.replace('Tomorrow', '').trim();
        content += `<h3 class="tomorrow">Tomorrow</h3><div>${tomorrowText}</div>`;
      }
    });

    return { __html: content };
  };

  if (Object.keys(stats).length === 0) {
    return null;
  }

  return (
    <div className="keynote-card narrative-card">
      {isLoading ? (
        <div className="narrative-loading">
          <div className="keynote-spinner"></div>
          <span>Crunching your day…</span>
        </div>
      ) : (
        <div 
          className="narrative-content"
          dangerouslySetInnerHTML={renderInsights()}
        />
      )}
    </div>
  );
};

export default NarrativeCard;