
import React from 'react';
import Button from './Button';
import { Dhikr } from '../types';

interface DhikrCounterProps {
  selectedDhikr: Dhikr | null;
  currentDailyCount: number;
  onIncrement: () => void;
  onResetDailyCount: () => void;
  allDhikrs: Dhikr[];
  onSelectDhikr: (id: string) => void;
}

const DhikrCounter: React.FC<DhikrCounterProps> = ({
  selectedDhikr,
  currentDailyCount,
  onIncrement,
  onResetDailyCount,
  allDhikrs,
  onSelectDhikr,
}) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectDhikr(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      {allDhikrs.length > 0 ? (
        <>
          <div className="w-full max-w-md mb-6">
            <label htmlFor="dhikr-select" className="block text-lg font-medium text-gray-300 mb-2 sr-only">
              Select Dhikr
            </label>
            <select
              id="dhikr-select"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-lg text-white focus:ring-green-500 focus:border-green-500 appearance-none transition-colors"
              value={selectedDhikr?.id || ''}
              onChange={handleSelectChange}
            >
              {!selectedDhikr && <option value="">Select a Dhikr</option>}
              {allDhikrs.map((dhikr) => (
                <option key={dhikr.id} value={dhikr.id}>
                  {dhikr.phrase}
                </option>
              ))}
            </select>
          </div>

          {selectedDhikr ? (
            <>
              <p className="text-2xl font-semibold text-green-300 mb-4 text-center">
                {selectedDhikr.phrase}
              </p>
              <div className="mb-8 text-center">
                <p className="text-xl text-gray-300">Today's Count:</p>
                <p className="text-6xl font-extrabold text-white">{currentDailyCount}</p>
              </div>

              <button
                onClick={onIncrement}
                className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-green-600 hover:bg-green-700 text-white text-4xl sm:text-5xl font-bold flex items-center justify-center shadow-lg transform transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-75 focus:ring-offset-2 focus:ring-offset-gray-900 mb-8"
                aria-label="Increment Dhikr Count"
              >
                Tap to Count
              </button>

              <Button
                onClick={onResetDailyCount}
                variant="secondary"
                size="md"
                className="text-lg"
              >
                Reset Daily Count for "{selectedDhikr.phrase}"
              </Button>
            </>
          ) : (
            <p className="text-xl text-gray-400 mt-8 text-center">
              Please select a Dhikr from the dropdown above to start counting.
            </p>
          )}
        </>
      ) : (
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-md border border-gray-700 max-w-md mx-auto">
          <p className="text-2xl text-green-400 font-bold mb-4">No Dhikr Added Yet!</p>
          <p className="text-lg text-gray-300 mb-6">
            Go to "Custom Dhikr" to add your first dhikr phrase.
          </p>
          <Button onClick={() => window.location.hash = '/custom-dhikr'} variant="primary" size="lg">
            Add Custom Dhikr
          </Button>
        </div>
      )}
    </div>
  );
};

export default DhikrCounter;
