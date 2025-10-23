import React from 'react';
import MealInputForm from './components/MealInputForm';
import MealCard from './components/MealCard';
import DailySummary from './components/DailySummary';
import RecommendationCard from './components/RecommendationCard';
import Header from './components/Header';
import Loader from './components/Loader';
import GoalSelector from './components/GoalSelector';
import MealSuggestionCard from './components/MealSuggestionCard';
import { useMealTracker } from './hooks/useMealTracker';

const App: React.FC = () => {
  const {
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
  } = useMealTracker();

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
            <MealInputForm onLogMeal={logMeal} isLoading={isLoading} />
          </div>
      </div>
    </div>
  );
};

export default App;