import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getYesterdayCommitment, saveCommitmentResult, getTodayDateString } from '../utils/timeUtils';

const YesterdayCommitmentSection: React.FC = () => {
  const [commitment, setCommitment] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const yesterdayCommitment = getYesterdayCommitment();
    if (yesterdayCommitment) {
      setCommitment(yesterdayCommitment);
      setIsVisible(true);
    }
  }, []);

  const handleCheck = () => {
    setIsChecked(true);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];
    
    saveCommitmentResult(yesterdayKey, true);
    
    // Fade out after a delay
    setTimeout(() => {
      setIsVisible(false);
    }, 1500);
  };

  if (!commitment || !isVisible) {
    return null;
  }

  return (
    <div className={`dashboard-card transition-all duration-500 ${isChecked ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4 text-[rgb(var(--fg))]">📅 Yesterday's Commitment</h2>
          <p className="text-[rgb(var(--muted))] mb-6 leading-relaxed">{commitment}</p>
          
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheck}
              className="w-4 h-4 text-[rgb(var(--accent))] border-[rgb(var(--muted))] rounded focus:ring-[rgb(var(--accent))] focus:ring-2 transition-all duration-200"
            />
            <span className="text-sm text-[rgb(var(--fg))] group-hover:text-[rgb(var(--accent))] transition-colors duration-200">
              ✅ Did you follow through?
            </span>
          </label>
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] transition-colors duration-200 p-1 rounded-lg hover:bg-[rgba(var(--muted),0.1)]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default YesterdayCommitmentSection;