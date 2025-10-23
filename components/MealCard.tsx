import React from 'react';
import { Meal } from '../types';
import { MEAL_ICONS } from '../constants';

interface MealCardProps {
  meal: Meal;
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center text-gray-500 text-sm">
                <i className={`${MEAL_ICONS[meal.type]} mr-2`}></i>
                <h3 className="font-bold text-lg text-gray-800">{meal.type}</h3>
            </div>
            <p className="text-gray-600 mt-1 italic">"{meal.description}"</p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="text-2xl font-bold text-indigo-600">{Math.round(meal.totalCalories)}</p>
            <p className="text-sm text-gray-500 -mt-1">kcal</p>
          </div>
        </div>

        <div className="pt-3">
          <ul className="space-y-2">
            {meal.foodItems.map((item, index) => (
              <li key={index} className="grid grid-cols-3 gap-2 text-sm text-gray-700 items-center">
                <span className="col-span-2 font-medium">{item.name} <span className="text-gray-500 font-normal">({item.quantity})</span></span>
                <span className="text-right font-semibold">{Math.round(item.calories)} kcal</span>
              </li>
            ))}
          </ul>
        </div>
        {meal.summary && <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">{meal.summary}</p>}
      </div>
    </div>
  );
};

export default MealCard;