import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { saveReflection, getReflection, getTodayDateString } from '../utils/timeUtils';
import { useToast } from '../hooks/use-toast';

interface ReflectionSectionProps {
  onReflectionChange?: (highlight: string, trade: string) => void;
}

const ReflectionSection: React.FC<ReflectionSectionProps> = ({ onReflectionChange }) => {
  const [highlight, setHighlight] = useState('');
  const [trade, setTrade] = useState('');
  const [showSaveIcon, setShowSaveIcon] = useState(false);
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
    setShowSaveIcon(true);
    setTimeout(() => setShowSaveIcon(false), 2000);
    toast({
      description: "Reflection saved ✅",
      duration: 2000,
    });
  };

  // Auto-save on blur with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (highlight.trim() || trade.trim()) {
        handleSave();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [highlight, trade]);

  const handleTextareaBlur = () => {
    const today = getTodayDateString();
    saveReflection(today, highlight, trade);
    
    // Notify parent component of changes
    if (onReflectionChange) {
      onReflectionChange(highlight, trade);
    }
    
    // Show save icon briefly
    setShowSaveIcon(true);
    setTimeout(() => setShowSaveIcon(false), 2000);
  };

  return (
    <div className="dashboard-card mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">💭 Reflection</h2>
        {showSaveIcon && (
          <Check className="success-icon" />
        )}
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted))] mb-3">
            ✨ Highlight of the day?
          </label>
          <textarea
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            onBlur={handleTextareaBlur}
            placeholder="What went well today? What made you feel accomplished or happy? 😊"
            className="reflection-textarea min-h-[100px] resize-y"
            rows={4}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--muted))] mb-3">
            😴 One activity I'd trade for sleep?
          </label>
          <textarea
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            onBlur={handleTextareaBlur}
            placeholder="What did you spend time on that you wish you could get back? 🤔"
            className="reflection-textarea min-h-[100px] resize-y"
            rows={4}
          />
        </div>
        
        <div className="text-xs text-[rgb(var(--muted))] flex items-center gap-2 pt-2">
          <Check className="w-4 h-4" />
          💾 Auto-saved to your browser
        </div>
      </div>
    </div>
  );
};

export default ReflectionSection;