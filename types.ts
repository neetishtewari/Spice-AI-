export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealAnalysis {
  foodItems: FoodItem[];
  totalCalories: number;
  summary: string;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface Meal extends MealAnalysis {
  id: number;
  type: MealType;
  description: string;
}

export type UserGoal = 'Weight Loss' | 'Muscle Gain' | 'Balanced Diet';

export interface MealSuggestion {
  mealName: string;
  reason: string;
  estimatedCalories: number;
  estimatedProtein: number;
}
