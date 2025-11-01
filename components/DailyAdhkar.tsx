
import React from 'react';
import { DAILY_ADHKAR } from '../constants';

const DailyAdhkar: React.FC = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-green-400 mb-8 text-center">Daily Adhkar for Reflection</h2>

      <div className="space-y-8">
        {DAILY_ADHKAR.map((adhkar) => (
          <div
            key={adhkar.id}
            className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 transform hover:scale-[1.01] transition-transform duration-200"
          >
            <h3 className="text-2xl font-semibold text-white mb-3 text-center sm:text-left">
              {adhkar.transliteration}
            </h3>
            <p className="text-3xl sm:text-4xl font-arabic text-green-300 text-right mb-4 leading-relaxed">
              {adhkar.arabic}
            </p>
            <p className="text-lg text-gray-300 leading-relaxed text-center sm:text-left">
              <span className="font-medium text-green-200">Meaning:</span> {adhkar.meaning}
            </p>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 italic mt-10 text-lg">
        "Remember Me, and I will remember you." – Quran 2:152
      </p>
    </div>
  );
};

export default DailyAdhkar;
