'use client';

import { useState, useEffect } from 'react';
import { egwAPI } from '@/lib/egw-api';
import { 
  ChartBarIcon, 
  TrashIcon, 
  ArrowPathIcon,
  ClockIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';

export function CacheStats() {
  const [stats, setStats] = useState<any>(null);
  const [showStats, setShowStats] = useState(false);

  const refreshStats = () => {
    const cacheStats = egwAPI.getCacheStats();
    setStats(cacheStats);
  };

  useEffect(() => {
    if (showStats) {
      refreshStats();
      const interval = setInterval(refreshStats, 1000);
      return () => clearInterval(interval);
    }
  }, [showStats]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (timestamp: number | null): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString();
  };

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        {/* Toggle Button */}
        <button
          onClick={() => setShowStats(!showStats)}
          className="flex items-center space-x-2 w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
        >
          <CircleStackIcon className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Cache Stats
          </span>
          <ChartBarIcon className="h-4 w-4 text-gray-500" />
        </button>

        {/* Stats Panel */}
        {showStats && stats && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 min-w-80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                API Cache Statistics
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={refreshStats}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Refresh"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    egwAPI.clearCache();
                    refreshStats();
                  }}
                  className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  title="Clear Cache"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Basic Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Entries</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.size}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Memory</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatBytes(stats.totalMemory)}
                  </div>
                </div>
              </div>

              {/* Method Breakdown */}
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Cached Methods
                </div>
                <div className="space-y-1">
                  {Object.entries(stats.methods).map(([method, count]) => (
                    <div key={method} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {method}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {count as number}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Cache Timeline
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Oldest Entry
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(stats.oldestEntry)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Newest Entry
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(stats.newestEntry)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}