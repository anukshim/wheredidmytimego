import React, { useState, useEffect } from 'react';

interface HeroLoaderProps {
  onComplete: () => void;
}

const HeroLoader: React.FC<HeroLoaderProps> = ({ onComplete }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Show spinner immediately, then text after 500ms
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 500);

    // Complete after 3 seconds total
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="hero-loader">
      <div className="keynote-spinner mb-6"></div>
      {showText && (
        <div className="hero-text">
          Here's where your day went.
        </div>
      )}
    </div>
  );
};

export default HeroLoader;