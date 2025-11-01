
import { AppStorage, Dhikr, DailyLog } from '../types';
import { APP_STORAGE_KEY } from '../constants';

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
};

export const loadAppState = (): AppStorage => {
  try {
    const serializedState = localStorage.getItem(APP_STORAGE_KEY);
    if (serializedState === null) {
      return {
        dhikrs: [],
        selectedDhikrId: null,
        dailyLogs: [],
        allTimeTotal: 0,
      };
    }
    const loadedState: AppStorage = JSON.parse(serializedState);

    // Initialize daily log for the current day if not present
    const today = getTodayDateString();
    let currentDailyLog = loadedState.dailyLogs.find(log => log.date === today);

    if (!currentDailyLog) {
      currentDailyLog = {
        date: today,
        dhikrCounts: loadedState.dhikrs.map(d => ({ dhikrId: d.id, count: 0 })),
        totalToday: 0,
      };
      loadedState.dailyLogs.push(currentDailyLog);
      // Keep only recent daily logs (e.g., last 30 days) to prevent array from growing too large
      loadedState.dailyLogs = loadedState.dailyLogs
        .filter(log => new Date(log.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
        // Ensure all existing dhikrs have an entry in the daily log for today
        const existingDailyDhikrIds = new Set(currentDailyLog.dhikrCounts.map(dc => dc.dhikrId));
        loadedState.dhikrs.forEach(dhikr => {
            if (!existingDailyDhikrIds.has(dhikr.id)) {
                currentDailyLog!.dhikrCounts.push({ dhikrId: dhikr.id, count: 0 });
            }
        });
    }

    // Ensure selectedDhikrId is valid or set to null
    if (loadedState.selectedDhikrId && !loadedState.dhikrs.some(d => d.id === loadedState.selectedDhikrId)) {
        loadedState.selectedDhikrId = null;
    }

    return loadedState;
  } catch (error) {
    console.error("Error loading app state from localStorage:", error);
    return {
      dhikrs: [],
      selectedDhikrId: null,
      dailyLogs: [],
      allTimeTotal: 0,
    };
  }
};

export const saveAppState = (state: AppStorage): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(APP_STORAGE_KEY, serializedState);
  } catch (error) {
    console.error("Error saving app state to localStorage:", error);
  }
};
