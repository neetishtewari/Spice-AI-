import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Meal, MealAnalysis, MealType, UserGoal, MealSuggestion } from './types';
import { analyzeMeal, getRecommendations, getMealSuggestion } from './services/geminiService';
import MealInputForm from './components/MealInputForm';
import MealCard from './components/MealCard';
import DailySummary from './components/DailySummary';
import RecommendationCard from './components/RecommendationCard';
import Header from './components/Header';
import Loader from './components/Loader';
import GoalSelector from './components/GoalSelector';
import MealSuggestionCard from './components/MealSuggestionCard';

const App: React.FC = () => {
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
  
  const handleLogMeal = useCallback(async (description: string, mealType: MealType) => {
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

    // Fetch general recommendations
    setIsRecommendationLoading(true);
    getRecommendations(logString)
      .then(setRecommendations)
      .catch(err => console.error("Failed to get recommendations:", err))
      .finally(() => setIsRecommendationLoading(false));

    // Fetch next meal suggestion
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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meals, goal]); // Rerun if goal changes too

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto max-w-2xl p-4 pb-40">
        <DailySummary totals={dailyTotals} />

        <GoalSelector selectedGoal={goal} onGoalChange={setGoal} />

        <MealSuggestionCard suggestion={mealSuggestion} isLoading={isSuggestionLoading} />

        {recommendations && meals.length > 0 && <RecommendationCard recommendations={recommendations} isLoading={isRecommendationLoading} />}
        
        <h2 className="text-2xl font-bold text-gray-700 mt-8 mb-4">Today's Meals</h2>
        
        {meals.length === 0 && !isLoading && (
          <div className="text-center py-10 px-6 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500">No meals logged yet. Add your first meal below!</p>
          </div>
        )}

        <div className="space-y-4">
          {meals.map(meal => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>

        {isLoading && <Loader />}

        {error && <div className="mt-4 text-center text-red-500 bg-red-100 p-3 rounded-xl">{error}</div>}
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200/80">
          <div className="container mx-auto max-w-2xl p-4">
            <MealInputForm onLogMeal={handleLogMeal} isLoading={isLoading} />
          </div>
      </div>
    </div>
  );
};

export default App;