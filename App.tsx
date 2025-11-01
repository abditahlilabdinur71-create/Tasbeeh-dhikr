
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs
import { AppStorage, Dhikr, DailyLog } from './types';
import { loadAppState, saveAppState } from './services/localStorageService';
import Header from './components/Header';
import DhikrCounter from './components/DhikrCounter';
import DhikrForm from './components/DhikrForm';
import DailyAdhkar from './components/DailyAdhkar';
import StatsDisplay from './components/StatsDisplay';
import { DAILY_ADHKAR } from './constants';

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppStorage>({
    dhikrs: [],
    selectedDhikrId: null,
    dailyLogs: [],
    allTimeTotal: 0,
  });
  const [currentDailyLog, setCurrentDailyLog] = useState<DailyLog | null>(null);

  // Initialize app state from localStorage on mount
  useEffect(() => {
    const initialAppState = loadAppState();

    // Merge default daily adhkar if not already present
    const defaultAdhkar: Dhikr[] = DAILY_ADHKAR.map(item => ({
      id: item.id,
      phrase: item.transliteration,
      count: 0,
    }));

    const mergedDhikrs = [...initialAppState.dhikrs];
    defaultAdhkar.forEach(defaultDhikr => {
      if (!mergedDhikrs.some(d => d.id === defaultDhikr.id)) {
        mergedDhikrs.unshift(defaultDhikr); // Add to the beginning for easy access
      }
    });

    // Ensure selectedDhikrId is valid or set it to the first available if not
    let initialSelectedDhikrId = initialAppState.selectedDhikrId;
    if (initialSelectedDhikrId && !mergedDhikrs.some(d => d.id === initialSelectedDhikrId)) {
      initialSelectedDhikrId = mergedDhikrs.length > 0 ? mergedDhikrs[0].id : null;
    } else if (!initialSelectedDhikrId && mergedDhikrs.length > 0) {
      initialSelectedDhikrId = mergedDhikrs[0].id;
    }

    const updatedAppState: AppStorage = {
      ...initialAppState,
      dhikrs: mergedDhikrs,
      selectedDhikrId: initialSelectedDhikrId,
    };

    setAppState(updatedAppState);
  }, []); // Empty dependency array means this runs once on mount

  // Update currentDailyLog whenever appState.dailyLogs changes
  useEffect(() => {
    const today = getTodayDateString();
    let logForToday = appState.dailyLogs.find(log => log.date === today);

    if (!logForToday) {
      // Create new daily log if it doesn't exist for today
      logForToday = {
        date: today,
        dhikrCounts: appState.dhikrs.map(d => ({ dhikrId: d.id, count: 0 })),
        totalToday: 0,
      };
      setAppState(prevState => {
        const updatedDailyLogs = [...prevState.dailyLogs, logForToday!];
        return { ...prevState, dailyLogs: updatedDailyLogs };
      });
    } else {
        // Ensure logForToday contains all current dhikrs, initializing missing ones to 0
        const existingDhikrIdsInLog = new Set(logForToday.dhikrCounts.map(dc => dc.dhikrId));
        appState.dhikrs.forEach(dhikr => {
            if (!existingDhikrIdsInLog.has(dhikr.id)) {
                logForToday!.dhikrCounts.push({ dhikrId: dhikr.id, count: 0 });
            }
        });
    }

    setCurrentDailyLog(logForToday);
  }, [appState.dailyLogs, appState.dhikrs]);

  // Save app state to localStorage whenever it changes
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  const addDhikr = useCallback((phrase: string) => {
    setAppState(prevState => {
      const newDhikr: Dhikr = { id: uuidv4(), phrase, count: 0 };
      const updatedDhikrs = [...prevState.dhikrs, newDhikr];

      // Also update current daily log with the new dhikr
      const today = getTodayDateString();
      const updatedDailyLogs = prevState.dailyLogs.map(log => {
        if (log.date === today) {
          return {
            ...log,
            dhikrCounts: [...log.dhikrCounts, { dhikrId: newDhikr.id, count: 0 }],
          };
        }
        return log;
      });

      return {
        ...prevState,
        dhikrs: updatedDhikrs,
        selectedDhikrId: prevState.selectedDhikrId || newDhikr.id, // Auto-select if nothing selected
        dailyLogs: updatedDailyLogs,
      };
    });
  }, []);

  const removeDhikr = useCallback((id: string) => {
    setAppState(prevState => {
      const updatedDhikrs = prevState.dhikrs.filter(d => d.id !== id);
      const updatedDailyLogs = prevState.dailyLogs.map(log => ({
        ...log,
        dhikrCounts: log.dhikrCounts.filter(dc => dc.dhikrId !== id),
      }));

      // If removed dhikr was selected, select the first available, or null
      let newSelectedDhikrId = prevState.selectedDhikrId;
      if (newSelectedDhikrId === id) {
        newSelectedDhikrId = updatedDhikrs.length > 0 ? updatedDhikrs[0].id : null;
      }

      return {
        ...prevState,
        dhikrs: updatedDhikrs,
        selectedDhikrId: newSelectedDhikrId,
        dailyLogs: updatedDailyLogs,
        // allTimeTotal is not adjusted on removal for simplicity; it reflects what was *done*
      };
    });
  }, []);


  const incrementDhikrCount = useCallback(() => {
    if (!appState.selectedDhikrId) return;

    setAppState(prevState => {
      let currentDhikrId = prevState.selectedDhikrId!;

      const updatedDhikrs = prevState.dhikrs.map(d =>
        d.id === currentDhikrId ? { ...d, count: d.count + 1 } : d
      );

      const today = getTodayDateString();
      const updatedDailyLogs = prevState.dailyLogs.map(log => {
        if (log.date === today) {
          const updatedDhikrCounts = log.dhikrCounts.map(dc =>
            dc.dhikrId === currentDhikrId ? { ...dc, count: dc.count + 1 } : dc
          );
          return {
            ...log,
            dhikrCounts: updatedDhikrCounts,
            totalToday: log.totalToday + 1,
          };
        }
        return log;
      });

      return {
        ...prevState,
        dhikrs: updatedDhikrs,
        dailyLogs: updatedDailyLogs,
        allTimeTotal: prevState.allTimeTotal + 1,
      };
    });
  }, [appState.selectedDhikrId]);

  const resetCurrentDhikrDailyCount = useCallback(() => {
    if (!appState.selectedDhikrId) return;

    setAppState(prevState => {
      const currentDhikrId = prevState.selectedDhikrId!;
      const today = getTodayDateString();

      const updatedDailyLogs = prevState.dailyLogs.map(log => {
        if (log.date === today) {
          const dhikrCountEntry = log.dhikrCounts.find(dc => dc.dhikrId === currentDhikrId);
          if (dhikrCountEntry) {
            const currentCountForDhikr = dhikrCountEntry.count;
            const updatedDhikrCounts = log.dhikrCounts.map(dc =>
              dc.dhikrId === currentDhikrId ? { ...dc, count: 0 } : dc
            );
            return {
              ...log,
              dhikrCounts: updatedDhikrCounts,
              totalToday: Math.max(0, log.totalToday - currentCountForDhikr),
            };
          }
        }
        return log;
      });

      return {
        ...prevState,
        dailyLogs: updatedDailyLogs,
      };
    });
  }, [appState.selectedDhikrId]);

  const resetAllStatistics = useCallback(() => {
    setAppState(prevState => {
      const defaultAdhkar: Dhikr[] = DAILY_ADHKAR.map(item => ({
        id: item.id,
        phrase: item.transliteration,
        count: 0,
      }));

      // Filter out custom dhikrs and reset counts for default ones
      const initialDhikrsForReset = prevState.dhikrs
        .filter(d => DAILY_ADHKAR.some(ad => ad.id === d.id)) // Keep only default adhkar
        .map(d => ({ ...d, count: 0 })); // Reset their counts

      // Ensure all default adhkar are present, even if user removed them previously
      DAILY_ADHKAR.forEach(defaultItem => {
        if (!initialDhikrsForReset.some(d => d.id === defaultItem.id)) {
          initialDhikrsForReset.unshift({
            id: defaultItem.id,
            phrase: defaultItem.transliteration,
            count: 0,
          });
        }
      });

      const today = getTodayDateString();
      const newDailyLogForToday: DailyLog = {
        date: today,
        dhikrCounts: initialDhikrsForReset.map(d => ({ dhikrId: d.id, count: 0 })),
        totalToday: 0,
      };

      return {
        dhikrs: initialDhikrsForReset,
        selectedDhikrId: initialDhikrsForReset.length > 0 ? initialDhikrsForReset[0].id : null,
        dailyLogs: [newDailyLogForToday], // Start with only today's log, all zeros
        allTimeTotal: 0,
      };
    });
  }, []);

  const selectDhikr = useCallback((id: string) => {
    setAppState(prevState => ({ ...prevState, selectedDhikrId: id }));
  }, []);

  const selectedDhikr = appState.dhikrs.find(d => d.id === appState.selectedDhikrId) || null;
  const currentDailyCountForSelectedDhikr = currentDailyLog?.dhikrCounts.find(
    dc => dc.dhikrId === appState.selectedDhikrId
  )?.count || 0;

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
        <Header title="Tasbeeh Dhikr Counter" />
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <DhikrCounter
                  selectedDhikr={selectedDhikr}
                  currentDailyCount={currentDailyCountForSelectedDhikr}
                  onIncrement={incrementDhikrCount}
                  onResetDailyCount={resetCurrentDhikrDailyCount}
                  allDhikrs={appState.dhikrs}
                  onSelectDhikr={selectDhikr}
                />
              }
            />
            <Route
              path="/custom-dhikr"
              element={
                <DhikrForm
                  onAddDhikr={addDhikr}
                  allDhikrs={appState.dhikrs.filter(d => !DAILY_ADHKAR.some(ad => ad.id === d.id))} // Only show truly custom dhikrs
                  onRemoveDhikr={removeDhikr}
                />
              }
            />
            <Route path="/adhkar" element={<DailyAdhkar />} />
            <Route
              path="/stats"
              element={
                <StatsDisplay
                  currentDailyLog={currentDailyLog}
                  allTimeTotal={appState.allTimeTotal}
                  allDhikrs={appState.dhikrs}
                  onResetAllStatistics={resetAllStatistics}
                />
              }
            />
          </Routes>
        </main>
        <footer className="bg-gray-800 p-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Tasbeeh Dhikr Counter. All rights reserved.
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
