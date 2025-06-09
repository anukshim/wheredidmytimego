import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { saveReflection, getReflection, getTodayDateString } from '../utils/timeUtils';

const ReflectionCard: React.FC = () => {
  const [highlight, setHighlight] = useState('');
  const [trade, setTrade] = useState('');
  const [showGoodNight, setShowGoodNight] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load existing reflection
    const today = getTodayDateString();
    const existingReflection = getReflection(today);
    if (existingReflection) {
      setHighlight(existingReflection.highlight);
      setTrade(existingReflection.trade);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (!highlight.trim() && !trade.trim()) return;

    const today = getTodayDateString();
    saveReflection(today, highlight, trade);
    setIsSaved(true);

    // Play soft "tink" sound
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjiR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQEJHfH8N2QQAoUXrTp66hVFApGn+DyvmIdAjuR1/LKdSQE=');
      audio.volume = 0.3; // -12 dB roughly
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    } catch (error) {
      // Ignore audio errors
    }

    // Show good-night moment
    if (highlight.trim() && trade.trim()) {
      setShowGoodNight(true);
      setTimeout(() => {
        document.body.classList.add('good-night');
        setTimeout(() => {
          setShowGoodNight(false);
          document.body.classList.remove('good-night');
        }, 2000);
      }, 1000);
    }
  };

  useEffect(() => {
    // Auto-save on change with debounce
    const timer = setTimeout(() => {
      if ((highlight.trim() || trade.trim()) && !isSaved) {
        handleSave();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [highlight, trade, isSaved]);

  return (
    <div className="keynote-card">
      <div className="space-y-6">
        <div>
          <label className="block text-foreground font-semibold mb-2">
            Highlight of the day
          </label>
          <textarea
            className="reflection-textarea"
            placeholder="One moment worth reliving…"
            value={highlight}
            onChange={(e) => {
              setHighlight(e.target.value);
              setIsSaved(false);
            }}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-foreground font-semibold mb-2">
            Trade for sleep
          </label>
          <textarea
            className="reflection-textarea"
            placeholder="One activity I'd trade for sleep…"
            value={trade}
            onChange={(e) => {
              setTrade(e.target.value);
              setIsSaved(false);
            }}
            rows={3}
          />
        </div>

        {showGoodNight && (
          <div className="flex items-center justify-center gap-3 text-primary py-4">
            <Check className="checkmark" />
            <span className="text-lg font-medium">See you tomorrow.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionCard;