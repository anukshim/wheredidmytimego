import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { TimeStats, formatDuration, getTotalTime, getTotalSites, getLongestStretch } from '../utils/timeUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SnapshotSectionProps {
  stats: TimeStats;
}

// Chart color palette: indigo, green, amber, red, then repeat
const getChartColor = (index: number): string => {
  const colors = [
    'rgb(79, 70, 229)',   // indigo
    'rgb(34, 197, 94)',   // green
    'rgb(245, 158, 11)',  // amber
    'rgb(239, 68, 68)',   // red
  ];
  return colors[index % colors.length];
};

const SnapshotSection: React.FC<SnapshotSectionProps> = ({ stats }) => {
  const totalTime = getTotalTime(stats);
  const totalSites = getTotalSites(stats);
  const longestStretch = getLongestStretch(stats);

  // Prepare chart data with new color palette
  const chartData = {
    labels: Object.keys(stats),
    datasets: [
      {
        data: Object.values(stats),
        backgroundColor: Object.keys(stats).map((_, index) => getChartColor(index)),
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Remove legend as requested
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(79, 70, 229, 0.2)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const seconds = context.raw;
            return `${context.label}: ${formatDuration(seconds)}`;
          },
        },
      },
    },
    cutout: '65%',
    animation: {
      animateRotate: true,
      duration: 1000,
      easing: 'easeOutCubic' as const,
    },
  };

  return (
    <div className="dashboard-card mb-8">
      <h2 className="section-title">📊 Snapshot</h2>
      
      <div className="snapshot-container">
        {/* Chart Container */}
        <div className="chart-container">
          <div className="relative h-80">
            {Object.keys(stats).length > 0 ? (
              <>
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-lg font-medium text-[rgb(var(--muted))] mb-1">⏰ Total online</div>
                    <div className="text-2xl font-semibold text-[rgb(var(--accent))]">
                      {formatDuration(totalTime)}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-[rgb(var(--muted))]">
                  <div className="text-lg font-medium mb-2">📈 No data available</div>
                  <div className="text-sm">Open via the extension to see your stats</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Container */}
        <div className="stats-container">
          <div className="stat-row">
            <span className="stat-label">🌐 Total sites visited</span>
            <span className="stat-value">{totalSites}</span>
          </div>
          
          <div className="stat-row">
            <span className="stat-label">🔥 Longest stretch</span>
            <span className="stat-value">{longestStretch} min</span>
          </div>
          
          <div className="stat-row">
            <span className="stat-label">⚖️ Focus vs Distraction</span>
            <span className="stat-value">0% / 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnapshotSection;