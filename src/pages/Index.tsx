import React, { useState, useEffect } from 'react';
import { TimeStats, decodeHashData } from '../utils/timeUtils';
import { demoStats, generateDemoHash } from '../utils/demoData';
import SnapshotSection from '../components/SnapshotSection';
import TimelineSection from '../components/TimelineSection';
import AIInsightsSection from '../components/AIInsightsSection';
import ReflectionSection from '../components/ReflectionSection';
import YesterdayCommitmentSection from '../components/YesterdayCommitmentSection';

const Index = () => {
  const [stats, setStats] = useState<TimeStats>({});

  useEffect(() => {
    // Decode hash data on page load
    const hashData = decodeHashData();
    setStats(hashData);
  }, []);

  const loadDemoData = () => {
    setStats(demoStats);
    // Update URL with demo hash
    window.location.hash = generateDemoHash();
  };

  return (
    <div className="min-h-screen bg-[rgb(253_253_253)]">
      <div className="dashboard-container">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Where Did My Time Go?
          </h1>
          <p className="text-slate-600 mb-4">
            Daily Dashboard & Reflection
          </p>
          
          {Object.keys(stats).length === 0 && (
            <div className="dashboard-card max-w-md mx-auto">
              <p className="text-slate-600 mb-4">
                No data detected. Use the browser extension to track your time, or try the demo:
              </p>
              <button 
                onClick={loadDemoData}
                className="dashboard-button"
              >
                View Demo Data
              </button>
            </div>
          )}
        </header>

        {/* Section A: Snapshot */}
        <SnapshotSection stats={stats} />

        {/* Section B: Timeline Strip */}
        <TimelineSection stats={stats} />

        {/* Section C: AI Story & Insights */}
        <AIInsightsSection stats={stats} />

        {/* Section D: Reflection */}
        <ReflectionSection />

        {/* Section E: Yesterday's Commitment */}
        <YesterdayCommitmentSection />
      </div>
    </div>
  );
};

export default Index;
