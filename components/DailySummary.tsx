import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PIE_CHART_COLORS } from '../constants';

interface DailySummaryProps {
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const DailySummary: React.FC<DailySummaryProps> = ({ totals }) => {
  const { calories, protein, carbs, fat } = totals;

  const macroData = [
    { name: 'Protein (g)', value: Math.round(protein) },
    { name: 'Carbs (g)', value: Math.round(carbs) },
    { name: 'Fat (g)', value: Math.round(fat) },
  ].filter(d => d.value > 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
      <h2 className="text-lg font-semibold text-gray-600 mb-4">Daily Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="text-center">
          <p className="text-gray-500">Total Calories</p>
          <p className="text-5xl font-bold text-indigo-600 tracking-tight">{Math.round(calories)}</p>
          <p className="text-gray-500">kcal</p>
        </div>
        <div style={{ width: '100%', height: 200 }}>
           <ResponsiveContainer>
            <PieChart>
              <Pie
                data={macroData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                <Cell key="protein" fill={PIE_CHART_COLORS.protein} />
                <Cell key="carbs" fill={PIE_CHART_COLORS.carbs} />
                <Cell key="fat" fill={PIE_CHART_COLORS.fat} />
              </Pie>
              <Tooltip formatter={(value) => `${value}g`} />
              <Legend iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;