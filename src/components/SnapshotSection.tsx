import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { TimeStats, formatDuration, getTotalTime, getTotalSites, getLongestStretch, getHostnameColor } from '../utils/timeUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SnapshotSectionProps {
  stats: TimeStats;
}

const SnapshotSection: React.FC<SnapshotSectionProps> = ({ stats }) => {
  const totalTime = getTotalTime(stats);
  const totalSites = getTotalSites(stats);
  const longestStretch = getLongestStretch(stats);

  // Prepare chart data
  const chartData = {
    labels: Object.keys(stats),
    datasets: [
      {
        data: Object.values(stats),
        backgroundColor: Object.keys(stats).map(hostname => getHostnameColor(hostname)),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            family: 'Inter',
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const seconds = context.raw;
            return `${context.label}: ${formatDuration(seconds)}`;
          },
        },
      },
    },
    cutout: '60%',
  };

  return (
    <div className="dashboard-card mb-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Snapshot</h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Chart */}
        <div className="flex-1">
          <div className="relative h-80">
            {Object.keys(stats).length > 0 ? (
              <>
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-slate-800">Total online:</div>
                    <div className="text-xl font-bold text-[rgb(79_70_229)]">
                      {formatDuration(totalTime)}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-500">
                  <div className="text-lg font-medium mb-2">No data available</div>
                  <div className="text-sm">Open via the extension to see your stats</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="flex flex-col gap-4 lg:w-64">
          <div className="metric-card">
            <div className="metric-value">{totalSites}</div>
            <div className="metric-label">Total sites visited</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-value">{longestStretch}</div>
            <div className="metric-label">Longest single stretch (min)</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-value">0% / 100%</div>
            <div className="metric-label">% Focus vs Distraction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnapshotSection;