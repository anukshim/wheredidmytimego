import React from 'react';
import { TimeStats, createTimelineData } from '../utils/timeUtils';

interface TimelineSectionProps {
  stats: TimeStats;
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ stats }) => {
  const timelineData = createTimelineData(stats);
  const hourLabels = [0, 6, 12, 18, 24];

  return (
    <div className="dashboard-card mb-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Timeline Strip</h2>
      
      <div className="relative">
        {/* Timeline bar */}
        <div className="flex rounded-lg overflow-hidden border border-slate-200">
          {timelineData.map((segment, index) => (
            <div
              key={index}
              className="timeline-segment"
              style={{ backgroundColor: segment.color }}
              title={`${segment.hour}:00 - ${segment.dominantHost || 'No activity'}`}
            />
          ))}
        </div>
        
        {/* Hour labels */}
        <div className="flex justify-between mt-3">
          {hourLabels.map((hour) => (
            <div key={hour} className="hour-label" style={{ marginLeft: hour === 0 ? 0 : '-0.5rem' }}>
              {hour}
            </div>
          ))}
        </div>
      </div>
      
      {Object.keys(stats).length === 0 && (
        <div className="text-center text-slate-500 mt-4">
          <div className="text-sm">Timeline will show your hourly activity distribution</div>
        </div>
      )}
    </div>
  );
};

export default TimelineSection;