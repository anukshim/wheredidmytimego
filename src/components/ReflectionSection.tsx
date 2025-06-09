import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { saveReflection, getReflection, getTodayDateString } from '../utils/timeUtils';
import { useToast } from '../hooks/use-toast';

const ReflectionSection: React.FC = () => {
  const [highlight, setHighlight] = useState('');
  const [trade, setTrade] = useState('');
  const { toast } = useToast();
  const today = getTodayDateString();

  useEffect(() => {
    // Load existing reflection for today
    const existingReflection = getReflection(today);
    if (existingReflection) {
      setHighlight(existingReflection.highlight);
      setTrade(existingReflection.trade);
    }
  }, [today]);

  const handleSave = () => {
    saveReflection(today, highlight, trade);
    toast({
      description: "Reflection saved ✅",
      duration: 2000,
    });
  };

  // Auto-save on change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (highlight.trim() || trade.trim()) {
        handleSave();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [highlight, trade]);

  return (
    <div className="dashboard-card mb-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Reflection</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Highlight of the day?
          </label>
          <textarea
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            placeholder="What went well today? What made you feel accomplished or happy?"
            className="reflection-textarea h-24"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            One activity I'd trade for sleep?
          </label>
          <textarea
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            placeholder="What did you spend time on that you wish you could get back?"
            className="reflection-textarea h-24"
          />
        </div>
        
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Check className="w-4 h-4" />
          Auto-saved to your browser
        </div>
      </div>
    </div>
  );
};

export default ReflectionSection;