import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { TimeStats, getAIInsights } from '../utils/timeUtils';

interface AIInsightsSectionProps {
  stats: TimeStats;
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ stats }) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);

  useEffect(() => {
    if (Object.keys(stats).length > 0) {
      generateInsights();
    }
  }, [stats]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const result = await getAIInsights(stats, apiKey || undefined);
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
        <h2 className="text-2xl font-bold text-slate-800">AI Story & Insights</h2>
        {!loading && (
          <button
            onClick={() => setShowApiInput(!showApiInput)}
            className="text-sm text-[rgb(79_70_229)] hover:underline"
          >
            Use your OpenAI key
          </button>
        )}
      </div>

      {showApiInput && (
        <div className="mb-6 p-4 bg-[rgb(224_231_255)] rounded-lg">
          <div className="flex gap-3">
            <input
              type="password"
              placeholder="Enter your OpenAI API key for personalized insights"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(79_70_229)]"
            />
            <button
              onClick={handleApiKeySubmit}
              className="dashboard-button"
            >
              Use Key
            </button>
          </div>
          <div className="text-xs text-slate-600 mt-2">
            Your API key is used only for this session and not stored.
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[rgb(79_70_229)]" />
            <div className="text-slate-600">Crunching your day...</div>
          </div>
        </div>
      ) : (
        <div className="prose prose-slate max-w-none">
          {insights ? (
            <div 
              className="text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: insights
                  .replace(/\*\*(.*?)\*\*/g, '<h3 class="text-lg font-semibold mt-6 mb-3 text-slate-800">$1</h3>')
                  .replace(/➜ (.*?)(?=\n|$)/g, '<div class="flex items-start gap-2 mb-2"><span class="text-[rgb(79_70_229)] font-medium">➜</span><span>$1</span></div>')
                  .replace(/Try: (.*?)(?=\n|$)/g, '<div class="mt-4 p-3 bg-[rgb(224_231_255)] rounded-lg"><strong class="text-[rgb(79_70_229)]">Try:</strong> $1</div>')
              }}
            />
          ) : (
            <div className="text-slate-500 text-center py-8">
              {Object.keys(stats).length === 0 
                ? 'AI insights will appear when you have time data to analyze.'
                : 'Click above to add your OpenAI key for personalized insights.'
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInsightsSection;