import React, { useState, useEffect } from 'react';
import { TimeStats, decodeHashData } from '../utils/timeUtils';
import { demoStats, generateDemoHash } from '../utils/demoData';
import HeroLoader from '../components/HeroLoader';
import SnapshotSection from '../components/SnapshotSection';
import TimelineSection from '../components/TimelineSection';
import NarrativeCard from '../components/NarrativeCard';
import ReflectionCard from '../components/ReflectionCard';
import YesterdayCommitmentSection from '../components/YesterdayCommitmentSection';

const Index = () => {
  const [stats, setStats] = useState<TimeStats>({});
  const [showHero, setShowHero] = useState(true);
  const [showVisual, setShowVisual] = useState(false);
  const [showNarrative, setShowNarrative] = useState(false);

  useEffect(() => {
    // Decode hash data on page load
    const hashData = decodeHashData();
    if (Object.keys(hashData).length === 0) {
      // Load demo data if no hash
      setStats(demoStats);
      window.location.hash = generateDemoHash();
    } else {
      setStats(hashData);
    }
  }, []);

  const handleHeroComplete = () => {
    setShowHero(false);
    setShowVisual(true);
    
    // Show narrative after visual truth animation
    setTimeout(() => {
      setShowNarrative(true);
    }, 4000); // 4s after visual truth shows
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--canvas-bg))]">
      <div className="keynote-container">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[rgb(var(--keynote-text))] mb-2">
            Where Did My Time Go?
          </h1>
          <p className="text-xl text-[rgb(var(--keynote-text-secondary))]">
            See where today went. Shape where tomorrow goes.
          </p>
        </div>

        {/* Hero Loader (0-3s) */}
        {showHero && (
          <HeroLoader onComplete={handleHeroComplete} />
        )}

        {/* Visual Truth & Timeline (3-7s) */}
        {showVisual && (
          <>
            <SnapshotSection stats={stats} />
            <TimelineSection stats={stats} />
          </>
        )}

        {/* Narrative Card (slides up after 7s) */}
        {showNarrative && (
          <NarrativeCard stats={stats} />
        )}

        {/* Reflection Card */}
        {showNarrative && (
          <ReflectionCard />
        )}

        {/* Yesterday's Commitment */}
        {showNarrative && (
          <YesterdayCommitmentSection />
        )}

      </div>
    </div>
  );
};

export default Index;
