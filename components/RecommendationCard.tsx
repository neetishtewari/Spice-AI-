import React from 'react';

interface RecommendationCardProps {
  recommendations: string;
  isLoading: boolean;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendations, isLoading }) => {
  return (
    <div className="bg-gray-100 p-5 rounded-2xl border border-gray-200 my-6">
      <div className="flex items-start">
        <i className="fa-solid fa-lightbulb text-2xl text-indigo-500 mr-4 mt-1"></i>
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">AI Recommendations</h3>
          {isLoading ? (
             <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{recommendations}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;