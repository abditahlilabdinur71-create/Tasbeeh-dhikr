
import { AdhkarItem } from './types';

export const DAILY_ADHKAR: AdhkarItem[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhanallah',
    meaning: 'Glory be to Allah. (To be said 33 times)',
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'All praise is due to Allah. (To be said 33 times)',
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah is the Greatest. (To be said 33 times)',
  },
];

export const APP_STORAGE_KEY = 'tasbeehAppStorage';
