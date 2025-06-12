import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { TimeStats, getAIInsights } from '../utils/timeUtils';

interface AIInsightsSectionProps {
  stats: TimeStats;
  reflectionData?: {
    highlight: string;
    trade: string;
  };
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ stats, reflectionData }) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);

  useEffect(() => {
    if (Object.keys(stats).length > 0) {
      generateInsights();
    }
  }, [stats, reflectionData]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const result = await getAIInsights(stats, apiKey || undefined, reflectionData);
      setInsights(result);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      setInsights('Failed to generate insights. Please try again.');
    }
    setLoading(false);
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      generateInsights();
      setShowApiInput(false);
    }
  };

  return (
    <div className="dashboard-card mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="section-title">🤖 AI Story & Insights</h2>
        {!loading && (
          <button
            onClick={() => setShowApiInput(!showApiInput)}
            className="text-sm insight-text hover:underline transition-all duration-200"
          >
            🔑 Use your OpenAI key
          </button>
        )}
      </div>

      {showApiInput && (
        <div className="mb-6 p-6 bg-[rgba(var(--accent),0.05)] rounded-xl border border-[rgba(var(--accent),0.1)]">
          <div className="flex gap-3">
            <input
              type="password"
              placeholder="🔐 Enter your OpenAI API key for personalized insights"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 p-3 rounded-xl border-0 bg-[rgb(var(--card))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] transition-all duration-200"
            />
            <button
              onClick={handleApiKeySubmit}
              className="dashboard-button"
            >
              ✨ Use Key
            </button>
          </div>
          <div className="text-xs text-[rgb(var(--muted))] mt-3">
            🔒 Your API key is used only for this session and not stored.
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <div className="text-[rgb(var(--muted))] font-medium">🧠 Crunching your day…</div>
          </div>
        </div>
      ) : (
        <div className="prose prose-slate max-w-none">
          {insights ? (
            <div 
              className="text-[rgb(var(--fg))] leading-relaxed text-[15px]"
              dangerouslySetInnerHTML={{ 
                __html: insights
                  .replace(/\*\*(.*?)\*\*/g, '<h3 class="text-lg font-semibold mt-6 mb-3 text-[rgb(var(--fg))]">$1</h3>')
                  .replace(/➜ (.*?)(?=\n|$)/g, '<div class="flex items-start gap-3 mb-3"><span class="text-[rgb(var(--accent))] font-medium text-base">💡</span><span class="text-[15px] leading-relaxed">$1</span></div>')
                  .replace(/Try: (.*?)(?=\n|$)/g, '<div class="mt-4 mb-4"><span class="insight-text font-semibold">🎯 Try:</span> <span class="text-[rgb(var(--fg))]">$1</span></div>')
              }}
            />
          ) : (
            <div className="text-[rgb(var(--muted))] text-center py-12">
              {Object.keys(stats).length === 0 
                ? '🤔 AI insights will appear when you have time data to analyze.'
                : '👆 Click above to add your OpenAI key for personalized insights.'
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInsightsSection;