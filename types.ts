
export interface Dhikr {
  id: string;
  phrase: string;
  count: number; // Total count for this specific dhikr across all sessions
}

export interface DailyDhikrCount {
  dhikrId: string;
  count: number; // Count for this specific dhikr for the current day
}

export interface DailyLog {
  date: string; // YYYY-MM-DD format
  dhikrCounts: DailyDhikrCount[];
  totalToday: number;
}

export interface AppStorage {
  dhikrs: Dhikr[];
  selectedDhikrId: string | null;
  dailyLogs: DailyLog[];
  allTimeTotal: number;
}

export interface AdhkarItem {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
}
