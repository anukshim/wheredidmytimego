import React from 'react';
import { TimeStats, createTimelineData } from '../utils/timeUtils';

interface TimelineSectionProps {
  stats: TimeStats;
}

// Get chart color by index (same palette as SnapshotSection)
const getChartColor = (index: number): string => {
  const colors = [
    'rgb(79, 70, 229)',   // indigo
    'rgb(34, 197, 94)',   // green
    'rgb(245, 158, 11)',  // amber
    'rgb(239, 68, 68)',   // red
  ];
  return colors[index % colors.length];
};

const TimelineSection: React.FC<TimelineSectionProps> = ({ stats }) => {
  const timelineData = createTimelineData(stats);
  const hourLabels = [0, 6, 12, 18, 24];

  // Map hostname to consistent color index
  const hostnames = Object.keys(stats);
  const getHostnameColor = (hostname: string | null): string => {
    if (!hostname) return 'rgb(var(--muted))';
    const index = hostnames.indexOf(hostname);
    return getChartColor(index);
  };

  return (
    <div className="dashboard-card mb-8">
      <h2 className="section-title">⏱️ Timeline Strip</h2>
      
      <div className="space-y-4">
        {/* Timeline grid - 10px high, 24 segments, 2px gaps */}
        <div className="timeline-container">
          {timelineData.map((segment, index) => (
            <div
              key={index}
              className="timeline-segment"
              style={{ 
                backgroundColor: segment.dominantHost 
                  ? getHostnameColor(segment.dominantHost)
                  : 'rgba(var(--muted), 0.2)'
              }}
              title={`${segment.hour}:00 - ${segment.dominantHost || 'No activity'}`}
            />
          ))}
        </div>
        
        {/* Hour labels */}
        <div className="flex justify-between text-xs text-[rgb(var(--muted))] px-1">
          {hourLabels.map((hour) => (
            <div key={hour} className="font-medium">
              {hour}
            </div>
          ))}
        </div>
      </div>
      
      {Object.keys(stats).length === 0 && (
        <div className="text-center text-[rgb(var(--muted))] mt-6">
          <div className="text-sm">📅 Timeline will show your hourly activity distribution</div>
        </div>
      )}
    </div>
  );
};

export default TimelineSection;