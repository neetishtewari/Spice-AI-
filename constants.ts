import { MealType, UserGoal } from './types';

export const PIE_CHART_COLORS = {
  protein: '#6366f1', // indigo-500
  carbs: '#fbbf24',   // amber-400
  fat: '#94a3b8',      // slate-400
};

export const MEAL_ICONS: Record<MealType, string> = {
    Breakfast: 'fa-solid fa-mug-saucer',
    Lunch: 'fa-solid fa-plate-wheat',
    Dinner: 'fa-solid fa-utensils',
    Snack: 'fa-solid fa-apple-whole',
};

export const USER_GOALS: { id: UserGoal; label: string; icon: string; }[] = [
  { id: 'Weight Loss', label: 'Weight Loss', icon: 'fa-solid fa-person-running' },
  { id: 'Muscle Gain', label: 'Muscle Gain', icon: 'fa-solid fa-dumbbell' },
  { id: 'Balanced Diet', label: 'Balanced Diet', icon: 'fa-solid fa-scale-balanced' },
];