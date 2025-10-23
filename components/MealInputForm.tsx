import React, { useState } from 'react';
import { MealType } from '../types';

interface MealInputFormProps {
  onLogMeal: (description: string, mealType: MealType) => void;
  isLoading: boolean;
}

const MealInputForm: React.FC<MealInputFormProps> = ({ onLogMeal, isLoading }) => {
  const [description, setDescription] = useState('');
  const [mealType, setMealType] = useState<MealType>('Lunch');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && !isLoading) {
      onLogMeal(description, mealType);
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="meal-description" className="sr-only">Meal Description</label>
        <textarea
          id="meal-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., 2 rotis, a bowl of dal fry, and a side of salad"
          className="w-full p-3 bg-gray-100 border-2 border-transparent rounded-xl focus:ring-2 focus:ring-indigo-400 focus:bg-white focus:border-indigo-400 transition-all resize-none"
          rows={2}
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-grow">
          <label htmlFor="meal-type" className="sr-only">Meal Type</label>
          <select
            id="meal-type"
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            className="w-full p-3 border-2 border-transparent bg-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:bg-white focus:border-indigo-400 transition-all"
            disabled={isLoading}
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading || !description.trim()}
          className="px-6 h-full bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
             <>
              <i className="fa-solid fa-plus mr-2"></i> Log Meal
             </>
          )}
        </button>
      </div>
    </form>
  );
};

export default MealInputForm;