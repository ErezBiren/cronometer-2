export interface NutritionEntry {
  id: string;
  date: string;
  food: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const DEFAULT_TARGETS: NutritionTargets = {
  calories: 2000,
  protein: 180,
  carbs: 300,
  fat: 68,
};

export const DAILY_EXPENDITURE = 2500;

export function calculateDailyTotals(entries: NutritionEntry[], date: string): DailyTotals {
  const dateEntries = entries.filter(e => e.date === date);
  return {
    calories: dateEntries.reduce((sum, e) => sum + e.calories, 0),
    protein: Math.round(dateEntries.reduce((sum, e) => sum + e.protein, 0) * 10) / 10,
    carbs: Math.round(dateEntries.reduce((sum, e) => sum + e.carbs, 0) * 10) / 10,
    fat: Math.round(dateEntries.reduce((sum, e) => sum + e.fat, 0) * 10) / 10,
  };
}

export function calculateProgress(current: number, target: number): { percent: number; isOver: boolean } {
  const percent = Math.round((current / target) * 100);
  return {
    percent: Math.min(100, percent),
    isOver: current > target,
  };
}

export function getStoredTargets(): NutritionTargets {
  if (typeof window === 'undefined') return DEFAULT_TARGETS;
  try {
    const stored = localStorage.getItem('nutritionTargets');
    return stored ? JSON.parse(stored) : DEFAULT_TARGETS;
  } catch {
    return DEFAULT_TARGETS;
  }
}

export function setStoredTargets(targets: NutritionTargets): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nutritionTargets', JSON.stringify(targets));
  }
}
