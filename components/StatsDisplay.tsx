
import React, { useState } from 'react';
import { DailyLog, Dhikr } from '../types';
import Button from './Button';
import Modal from './Modal';

interface StatsDisplayProps {
  currentDailyLog: DailyLog | null;
  allTimeTotal: number;
  allDhikrs: Dhikr[];
  onResetAllStatistics: () => void;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  currentDailyLog,
  allTimeTotal,
  allDhikrs,
  onResetAllStatistics,
}) => {
  const [showConfirmResetModal, setShowConfirmResetModal] = useState(false);

  const getDhikrPhrase = (id: string) => {
    return allDhikrs.find(d => d.id === id)?.phrase || 'Unknown Dhikr';
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleResetClick = () => {
    setShowConfirmResetModal(true);
  };

  const confirmReset = () => {
    onResetAllStatistics();
    setShowConfirmResetModal(false);
  };

  const cancelReset = () => {
    setShowConfirmResetModal(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-green-400 mb-8 text-center">Your Dhikr Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 text-center transform hover:scale-[1.01] transition-transform duration-200">
          <p className="text-lg text-gray-300 mb-2">Total Dhikr (All Time)</p>
          <p className="text-5xl font-extrabold text-white">{allTimeTotal}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 text-center transform hover:scale-[1.01] transition-transform duration-200">
          <p className="text-lg text-gray-300 mb-2">Today's Total ({todayDate})</p>
          <p className="text-5xl font-extrabold text-white">
            {currentDailyLog?.totalToday || 0}
          </p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <h3 className="text-2xl font-bold text-green-400 mb-4 text-center">Today's Dhikr Breakdown</h3>
        {currentDailyLog && currentDailyLog.dhikrCounts.length > 0 ? (
          <ul className="space-y-3">
            {currentDailyLog.dhikrCounts
              .filter(dc => dc.count > 0) // Only show dhikrs that have been counted today
              .sort((a, b) => getDhikrPhrase(a.dhikrId).localeCompare(getDhikrPhrase(b.dhikrId)))
              .map((dailyCount) => (
                <li
                  key={dailyCount.dhikrId}
                  className="flex justify-between items-center bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-600"
                >
                  <span className="text-lg text-white font-medium">{getDhikrPhrase(dailyCount.dhikrId)}</span>
                  <span className="text-xl text-green-300 font-bold">{dailyCount.count}</span>
                </li>
              ))}
              {currentDailyLog.dhikrCounts.every(dc => dc.count === 0) && (
                  <p className="text-lg text-gray-400 text-center italic">No dhikr recorded yet for today.</p>
              )}
          </ul>
        ) : (
          <p className="text-lg text-gray-400 text-center italic">No dhikr recorded yet for today.</p>
        )}
      </div>

      {allDhikrs.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mt-6">
          <h3 className="text-2xl font-bold text-green-400 mb-4 text-center">All Dhikr Totals</h3>
          <ul className="space-y-3">
            {allDhikrs
              .filter(d => d.count > 0) // Only show dhikrs with an all-time count
              .sort((a, b) => a.phrase.localeCompare(b.phrase))
              .map((dhikr) => (
                <li
                  key={dhikr.id}
                  className="flex justify-between items-center bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-600"
                >
                  <span className="text-lg text-white font-medium">{dhikr.phrase}</span>
                  <span className="text-xl text-green-300 font-bold">{dhikr.count}</span>
                </li>
              ))}
               {allDhikrs.every(d => d.count === 0) && (
                  <p className="text-lg text-gray-400 text-center italic">No dhikr recorded yet across all time.</p>
              )}
          </ul>
        </div>
      )}

      <div className="mt-8 text-center">
        <Button onClick={handleResetClick} variant="danger" size="md">
          Reset All Statistics
        </Button>
      </div>

      <Modal isOpen={showConfirmResetModal} onClose={cancelReset} title="Confirm Reset">
        <div className="text-center text-gray-200 text-lg mb-6">
          Are you sure you want to reset all statistics? This action cannot be undone.
          All your dhikr counts and daily logs will be cleared.
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={cancelReset} variant="secondary">
            Cancel
          </Button>
          <Button onClick={confirmReset} variant="danger">
            Reset All
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default StatsDisplay;
