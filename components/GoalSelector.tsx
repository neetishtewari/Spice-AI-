import React from 'react';
import { UserGoal } from '../types';
import { USER_GOALS } from '../constants';

interface GoalSelectorProps {
  selectedGoal: UserGoal;
  onGoalChange: (goal: UserGoal) => void;
}

const GoalSelector: React.FC<GoalSelectorProps> = ({ selectedGoal, onGoalChange }) => {
  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold text-gray-600 mb-3 text-center">What's Your Goal?</h3>
      <div className="grid grid-cols-3 gap-3 bg-gray-100 p-1.5 rounded-xl">
        {USER_GOALS.map((goal) => (
          <button
            key={goal.id}
            onClick={() => onGoalChange(goal.id)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 rounded-lg text-sm font-bold transition-all duration-300 ${
              selectedGoal === goal.id
                ? 'bg-white text-indigo-600 shadow'
                : 'bg-transparent text-gray-500 hover:bg-gray-200'
            }`}
          >
            <i className={`${goal.icon} text-base`}></i>
            <span className="text-center sm:text-left">{goal.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GoalSelector;