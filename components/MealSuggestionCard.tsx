import React from 'react';
import { MealSuggestion } from '../types';

interface MealSuggestionCardProps {
  suggestion: MealSuggestion | null;
  isLoading: boolean;
}

const MealSuggestionCard: React.FC<MealSuggestionCardProps> = ({ suggestion, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-5 rounded-2xl shadow-sm border border-indigo-200 my-6">
        <div className="flex items-start">
          <i className="fa-solid fa-utensils text-2xl text-indigo-400 mr-4 mt-1 animate-pulse"></i>
          <div>
            <h3 className="text-lg font-bold text-indigo-800 mb-2">Your Next Meal Idea</h3>
            <div className="space-y-2">
              <div className="h-4 bg-indigo-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-indigo-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-indigo-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!suggestion) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-5 rounded-2xl shadow-sm border border-indigo-200 my-6">
      <div className="flex items-start">
        <i className="fa-solid fa-wand-magic-sparkles text-2xl text-indigo-500 mr-4 mt-1"></i>
        <div>
          <h3 className="text-lg font-bold text-indigo-800 mb-2">Your Next Meal Idea</h3>
          <p className="text-indigo-900 font-semibold text-lg mb-1">{suggestion.mealName}</p>
          <p className="text-indigo-800 text-sm mb-3">{suggestion.reason}</p>
          <div className="flex gap-4 text-xs text-indigo-700">
            <span>~<span className="font-bold">{suggestion.estimatedCalories}</span> kcal</span>
            <span>~<span className="font-bold">{suggestion.estimatedProtein}</span>g protein</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealSuggestionCard;