import { useState, useMemo, useCallback, useEffect } from 'react';
import { Meal, MealAnalysis, MealType, UserGoal, MealSuggestion } from '../types';
import { analyzeMeal, getRecommendations, getMealSuggestion } from '../services/geminiService';

export const useMealTracker = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [recommendations, setRecommendations] = useState<string>('');
  const [mealSuggestion, setMealSuggestion] = useState<MealSuggestion | null>(null);
  const [goal, setGoal] = useState<UserGoal>('Balanced Diet');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dailyTotals = useMemo(() => {
    return meals.reduce(
      (acc, meal) => {
        acc.calories += meal.totalCalories;
        meal.foodItems.forEach(item => {
          acc.protein += item.protein;
          acc.carbs += item.carbs;
          acc.fat += item.fat;
        });
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

  const logMeal = useCallback(async (description: string, mealType: MealType) => {
    setIsLoading(true);
    setError(null);
    try {
      const analysis: MealAnalysis = await analyzeMeal(description);
      const newMeal: Meal = {
        id: Date.now(),
        type: mealType,
        description,
        ...analysis,
      };
      setMeals(prevMeals => [...prevMeals, newMeal]);
    } catch (err) {
      console.error(err);
      setError('Sorry, I couldn\'t analyze that meal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchInsights = useCallback(async () => {
    if (meals.length === 0) return;

    const fullLog = meals.map(({ type, foodItems, totalCalories }) => ({
        meal: type,
        totalCalories,
        items: foodItems.map(i => `${i.name} (${i.quantity})`).join(', ')
    }));
    const logString = JSON.stringify(fullLog, null, 2);

    setIsRecommendationLoading(true);
    getRecommendations(logString)
      .then(setRecommendations)
      .catch(err => {
        console.error("Failed to get recommendations:", err);
      })
      .finally(() => setIsRecommendationLoading(false));

    setIsSuggestionLoading(true);
    getMealSuggestion(logString, {calories: dailyTotals.calories, protein: dailyTotals.protein}, goal)
        .then(setMealSuggestion)
        .catch(err => {
            console.error("Failed to get meal suggestion:", err);
            setMealSuggestion(null);
        })
        .finally(() => setIsSuggestionLoading(false));

  }, [meals, dailyTotals, goal]);

  useEffect(() => {
    if (meals.length > 0) {
        const handler = setTimeout(() => {
            fetchInsights();
        }, 1000); // Debounce API calls
        return () => clearTimeout(handler);
    } else {
        setRecommendations('');
        setMealSuggestion(null);
    }
  }, [meals, goal, fetchInsights]);

  return {
    meals,
    dailyTotals,
    goal,
    setGoal,
    logMeal,
    recommendations,
    mealSuggestion,
    isLoading,
    isRecommendationLoading,
    isSuggestionLoading,
    error,
  };
};