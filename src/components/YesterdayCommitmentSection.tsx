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
    <div className={`dashboard-card transition-opacity duration-500 ${isChecked ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-3 text-slate-800">Yesterday's Commitment</h2>
          <p className="text-slate-600 mb-4">{commitment}</p>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheck}
              className="w-4 h-4 text-[rgb(79_70_229)] border-slate-300 rounded focus:ring-[rgb(79_70_229)]"
            />
            <span className="text-sm text-slate-700">Did you follow through?</span>
          </label>
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default YesterdayCommitmentSection;