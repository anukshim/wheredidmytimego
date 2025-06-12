import React, { useState, useEffect } from 'react';
import { TimeStats, decodeHashData, getReflection, getTodayDateString } from '../utils/timeUtils';
import { demoStats, generateDemoHash } from '../utils/demoData';
import SnapshotSection from '../components/SnapshotSection';
import TimelineSection from '../components/TimelineSection';
import AIInsightsSection from '../components/AIInsightsSection';
import ReflectionSection from '../components/ReflectionSection';
import YesterdayCommitmentSection from '../components/YesterdayCommitmentSection';

const Index = () => {
  const [stats, setStats] = useState<TimeStats>({});
  const [reflectionData, setReflectionData] = useState<{highlight: string, trade: string}>({
    highlight: '',
    trade: ''
  });

  useEffect(() => {
    // Decode hash data on page load
    const hashData = decodeHashData();
    setStats(hashData);
    
    // Load today's reflection data
    const todayReflection = getReflection(getTodayDateString());
    if (todayReflection) {
      setReflectionData(todayReflection);
    }
  }, []);

  const handleReflectionChange = (highlight: string, trade: string) => {
    setReflectionData({ highlight, trade });
  };

  const loadDemoData = () => {
    setStats(demoStats);
    // Update URL with demo hash
    window.location.hash = generateDemoHash();
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <div className="dashboard-container">
        <header className="text-center mb-16 relative">
          {/* Gradient background */}
          <div className="absolute inset-0 -mx-8 -mt-8 bg-gradient-to-br from-[rgba(var(--accent),0.05)] via-transparent to-[rgba(var(--accent),0.02)] rounded-3xl"></div>
          
          <div className="relative z-10 pt-12 pb-8">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="flex flex-col items-center gap-6">
                {/* Icon and Title Row */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[rgb(var(--accent))] to-[rgba(var(--accent),0.7)] rounded-3xl flex items-center justify-center text-white text-2xl font-semibold shadow-xl">
                    ⏰
                  </div>
                  <div className="text-left">
                    <h1 className="text-5xl font-bold text-[rgb(var(--fg))] tracking-tight leading-tight">
                      Where Did My Time Go?
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-[rgb(var(--accent))] to-[rgba(var(--accent),0.3)] rounded-full mt-2"></div>
                  </div>
                </div>
                
                {/* Subtitle with better spacing */}
                <div className="text-center max-w-2xl">
                  <p className="text-[rgb(var(--muted))] text-xl font-medium leading-relaxed">
                    Transform your digital habits with insights that matter
                  </p>
                  <p className="text-[rgb(var(--muted))] text-base mt-2 opacity-80">
                    See where today went. Shape where tomorrow goes.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Stats preview or call to action */}
            {Object.keys(stats).length > 0 ? (
              <div className="flex items-center justify-center gap-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[rgb(var(--accent))] mb-1">
                    {Object.keys(stats).length}
                  </div>
                  <div className="text-sm text-[rgb(var(--muted))] font-medium">Sites Tracked</div>
                </div>
                <div className="w-px h-12 bg-[rgba(var(--muted),0.3)]"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[rgb(var(--accent))] mb-1">
                    {Math.round(Object.values(stats).reduce((a, b) => a + b, 0) / 3600)}h
                  </div>
                  <div className="text-sm text-[rgb(var(--muted))] font-medium">Total Time</div>
                </div>
                <div className="w-px h-12 bg-[rgba(var(--muted),0.3)]"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[rgb(var(--accent))] mb-1">
                    📊
                  </div>
                  <div className="text-sm text-[rgb(var(--muted))] font-medium">Live Dashboard</div>
                </div>
              </div>
            ) : (
              <div className="dashboard-card max-w-xl mx-auto mb-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[rgb(var(--accent))] to-[rgba(var(--accent),0.7)] rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl">
                    🚀
                  </div>
                  <h3 className="text-xl font-semibold text-[rgb(var(--fg))] mb-4">
                    Ready to discover your digital habits?
                  </h3>
                  <p className="text-[rgb(var(--muted))] mb-8 leading-relaxed text-base">
                    📱 No data detected. Use the browser extension to track your time, or explore with our demo to see what's possible.
                  </p>
                  <button 
                    onClick={loadDemoData}
                    className="dashboard-button mb-6 text-base px-8 py-3"
                  >
                    🎮 View Demo Data
                  </button>
                  <div className="text-sm text-[rgb(var(--muted))] flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Safe & private - data stays in your browser
                  </div>
                </div>
              </div>
            )}
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-[rgba(var(--card),0.7)] border border-[rgba(var(--muted),0.15)] hover:bg-[rgba(var(--card),0.9)] transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <div className="text-base font-semibold text-[rgb(var(--fg))] mb-1">Visual Analytics</div>
                  <div className="text-sm text-[rgb(var(--muted))]">Interactive charts & timeline</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-[rgba(var(--card),0.7)] border border-[rgba(var(--muted),0.15)] hover:bg-[rgba(var(--card),0.9)] transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <div className="text-base font-semibold text-[rgb(var(--fg))] mb-1">AI Insights</div>
                  <div className="text-sm text-[rgb(var(--muted))]">Smart pattern analysis</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-[rgba(var(--card),0.7)] border border-[rgba(var(--muted),0.15)] hover:bg-[rgba(var(--card),0.9)] transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                  💭
                </div>
                <div>
                  <div className="text-base font-semibold text-[rgb(var(--fg))] mb-1">Daily Reflection</div>
                  <div className="text-sm text-[rgb(var(--muted))]">Build mindful habits</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Section A: Snapshot */}
        <SnapshotSection stats={stats} />

        {/* Section B: Timeline Strip */}
        <TimelineSection stats={stats} />

        {/* Section C: Reflection (moved above AI) */}
        <ReflectionSection onReflectionChange={handleReflectionChange} />

        {/* Section D: AI Story & Insights (now uses reflection data) */}
        <AIInsightsSection stats={stats} reflectionData={reflectionData} />

        {/* Section E: Yesterday's Commitment */}
        <YesterdayCommitmentSection />
      </div>
    </div>
  );
};

export default Index;
