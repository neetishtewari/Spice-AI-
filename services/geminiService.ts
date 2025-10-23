import { GoogleGenAI, Type } from '@google/genai';
import { MealAnalysis, MealSuggestion, UserGoal } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Schemas for structured responses ---

const mealAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    foodItems: {
      type: Type.ARRAY,
      description: 'A list of food items identified in the meal.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Name of the food item.' },
          quantity: { type: Type.STRING, description: 'Estimated quantity (e.g., "1 bowl", "2 pieces").' },
          calories: { type: Type.NUMBER, description: 'Estimated calories for the item.' },
          protein: { type: Type.NUMBER, description: 'Estimated protein in grams.' },
          carbs: { type: Type.NUMBER, description: 'Estimated carbohydrates in grams.' },
          fat: { type: Type.NUMBER, description: 'Estimated fat in grams.' },
        },
        required: ['name', 'quantity', 'calories', 'protein', 'carbs', 'fat']
      }
    },
    totalCalories: {
      type: Type.NUMBER,
      description: 'The sum of calories for all food items.'
    },
    summary: {
      type: Type.STRING,
      description: 'A brief, one-sentence summary of the meal\'s nutritional profile.'
    }
  },
  required: ['foodItems', 'totalCalories', 'summary']
};

const mealSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        mealName: { type: Type.STRING, description: 'The name of the suggested meal (e.g., "Grilled Chicken Salad").' },
        reason: { type: Type.STRING, description: 'A brief, one-sentence explanation of why this meal is a good choice for the user\'s goal.'},
        estimatedCalories: { type: Type.NUMBER, description: 'The estimated calorie count for the suggested meal.' },
        estimatedProtein: { type: Type.NUMBER, description: 'The estimated protein in grams for the suggested meal.' },
    },
    required: ['mealName', 'reason', 'estimatedCalories', 'estimatedProtein']
}

// --- Prompt Templates for Maintainability ---

const ANALYZE_MEAL_PROMPT = (description: string) => `
You are an expert nutritionist with deep knowledge of a wide variety of regional Indian cuisines (e.g., North Indian like Paneer Butter Masala, South Indian like Dosa, Eastern like Litti Chokha, Western like Dhokla), common street foods (e.g., Pani Puri, Vada Pav), and traditional snacks.
Analyze the following meal description: "${description}".
Break down the meal into individual food items. For each item, estimate the quantity, calories, protein (in grams), carbohydrates (in grams), and fat (in grams).
Provide a brief one-sentence summary of the meal's nutritional profile.
Respond ONLY with a valid JSON object that adheres to the provided schema. Do not include any text, explanation, or markdown formatting outside of the JSON object.
`;

const GET_RECOMMENDATIONS_PROMPT = (mealsLog: string) => `
You are a helpful and encouraging nutritionist. Based on the following JSON log of meals consumed today, provide 3-4 concise, actionable, and positive recommendations for improving the user's diet.
Frame the advice in a friendly tone. Do not repeat the daily totals. Focus on what they can do next.

Today's Meal Log:
${mealsLog}

Your Recommendations (as a single block of plain text, with each recommendation on a new line):
`;

const GET_MEAL_SUGGESTION_PROMPT = (mealsLog: string, dailyTotals: {calories: number, protein: number}, goal: UserGoal) => `
You are an expert nutritionist AI. The user's goal is "${goal}".
Based on their meal log so far today, suggest a specific, healthy Indian dish or meal combination for their *next* meal.
Keep the suggestion relevant to their goal (e.g., low-calorie for weight loss, high-protein for muscle gain).

User's Goal: ${goal}
Today's Meals Log: ${mealsLog}
Today's Totals: ${Math.round(dailyTotals.calories)} kcal, ${Math.round(dailyTotals.protein)}g protein.

Your task is to provide a single meal suggestion as a JSON object. The reason should be concise and encouraging.
Respond ONLY with a valid JSON object that adheres to the provided schema. Do not include any other text.
`;


// --- Service Functions ---

export async function analyzeMeal(description: string): Promise<MealAnalysis> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: ANALYZE_MEAL_PROMPT(description),
    config: {
      responseMimeType: 'application/json',
      responseSchema: mealAnalysisSchema,
    },
  });

  const jsonText = response.text.trim();
  try {
    return JSON.parse(jsonText) as MealAnalysis;
  } catch (e: any) {
    console.error("Failed to parse Gemini JSON response for meal analysis:", {
      responseText: jsonText,
      error: e.message,
    });
    throw new Error("Received an invalid format from the AI.");
  }
}

export async function getRecommendations(mealsLog: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: GET_RECOMMENDATIONS_PROMPT(mealsLog),
  });
  
  return response.text.trim();
}

export async function getMealSuggestion(mealsLog: string, dailyTotals: {calories: number, protein: number}, goal: UserGoal): Promise<MealSuggestion> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: GET_MEAL_SUGGESTION_PROMPT(mealsLog, dailyTotals, goal),
        config: {
            responseMimeType: 'application/json',
            responseSchema: mealSuggestionSchema,
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as MealSuggestion;
    } catch (e: any) {
        console.error("Failed to parse Gemini JSON response for meal suggestion:", {
          responseText: jsonText,
          error: e.message,
        });
        throw new Error("Received an invalid format from the AI for the meal suggestion.");
    }
}