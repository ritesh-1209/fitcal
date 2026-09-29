import {
  UserProfile,
  DashboardSummary,
  MealParseResponse,
  ActivityResult,
  BudgetMealOption,
  ChatMessage
} from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

async function safeFetch<T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn(`API network fallback activated for ${endpoint}:`, error);
  }
  if (fallbackData !== undefined) {
    return fallbackData;
  }
  throw new Error(`Failed to fetch ${endpoint} and no fallback provided`);
}

export const api = {
  getProfile: async (): Promise<UserProfile> => {
    return safeFetch<UserProfile>('/profile', {}, {
      user_id: 'user_123',
      name: 'Ritesh',
      age: 24,
      sex: 'male',
      height_cm: 175,
      weight_kg: 72,
      activity_level: 'light',
      goal: 'weight_loss',
      dietary_preference: 'vegetarian',
      daily_budget_inr: 100,
      location: 'India'
    });
  },

  updateProfile: async (profile: UserProfile): Promise<UserProfile> => {
    return safeFetch<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    }, profile);
  },

  getDashboard: async (): Promise<DashboardSummary> => {
    return safeFetch<DashboardSummary>('/dashboard', {}, {
      user_name: 'Ritesh',
      date: 'Today',
      target_calories: 2200,
      consumed_calories: 1450,
      burned_calories: 210,
      net_consumed_calories: 1240,
      remaining_calories: 960,
      target_protein_g: 130,
      consumed_protein_g: 78,
      remaining_protein_g: 52,
      target_carbs_g: 220,
      consumed_carbs_g: 140,
      target_fat_g: 55,
      consumed_fat_g: 38,
      daily_budget_inr: 100,
      spent_budget_inr: 45,
      remaining_budget_inr: 55,
      ai_insight_headline: 'You have about 960 kcal and 52g protein remaining today.',
      ai_insights: [
        'You have 960 kcal left for today. Make sure to fuel up with a high protein meal.',
        'You are currently 52g short on your daily protein target.',
        'Your remaining food budget for today is ₹55.'
      ]
    });
  },

  parseMealText: async (text: string): Promise<MealParseResponse> => {
    return safeFetch<MealParseResponse>('/ai/parse-meal', {
      method: 'POST',
      body: JSON.stringify({ text })
    }, {
      original_text: text,
      parsed_items: [
        { name: 'Whole Wheat Roti', quantity: 3, unit: 'piece', calories: 240, protein: 9, carbs: 49, fat: 1.8, estimated_cost_inr: 12 },
        { name: 'Yellow Dal (Tadka)', quantity: 1, unit: 'bowl', calories: 160, protein: 9, carbs: 22, fat: 3.5, estimated_cost_inr: 18 }
      ],
      total_calories: 400,
      total_protein: 18,
      total_carbs: 71,
      total_fat: 5.3,
      total_fiber: 9.5,
      total_cost_inr: 30,
      confidence_note: 'Estimated using Indian Food Dataset'
    });
  },

  logMeal: async (parseResult: MealParseResponse): Promise<any> => {
    return safeFetch('/meals', {
      method: 'POST',
      body: JSON.stringify(parseResult)
    }, { status: 'success' });
  },

  logActivity: async (activity_type: string, duration_minutes: number, intensity: string = 'moderate'): Promise<ActivityResult> => {
    return safeFetch<ActivityResult>('/activities', {
      method: 'POST',
      body: JSON.stringify({ activity_type, duration_minutes, intensity })
    }, {
      activity_type,
      duration_minutes,
      intensity,
      met_value: 5.0,
      calories_burned: Math.round(5.0 * 3.5 * 72 / 200 * duration_minutes),
      disclaimer: 'Estimated Calories Burned (MET formula)'
    });
  },

  getBudgetMealRecommendations: async (budget?: number, diet?: string, meal_type?: string): Promise<BudgetMealOption[]> => {
    return safeFetch<BudgetMealOption[]>('/budget/recommend', {
      method: 'POST',
      body: JSON.stringify({ budget_inr: budget, diet_preference: diet, meal_type })
    }, [
      {
        id: 'opt_1',
        title: 'High-Protein Soy & Rice Bowl',
        diet: 'vegetarian',
        prep_complexity: 'Easy (15 mins)',
        estimated_cost_inr: 43.0,
        estimated_calories: 592.0,
        estimated_protein_g: 40.4,
        estimated_carbs_g: 78.0,
        estimated_fat_g: 6.5,
        items: [
          { name: 'Soy Chunks', quantity: 50, unit: 'g', calories: 172, protein: 26, cost: 10 },
          { name: 'Cooked Rice', quantity: 200, unit: 'g', calories: 260, protein: 5.4, cost: 15 },
          { name: 'Yellow Dal', quantity: 150, unit: 'bowl', calories: 160, protein: 9, cost: 18 }
        ],
        price_checked_date: 'Today (Live Estimate)',
        sources: ['Blinkit, Instamart, Local Market'],
        ai_explanation: 'Recommended because it provides 40.4g protein for just ₹43, staying well within your ₹55 daily budget while meeting your calorie target.'
      },
      {
        id: 'opt_2',
        title: 'Sattu Shake & Roasted Chana Power Snack',
        diet: 'vegan',
        prep_complexity: 'Instant (3 mins)',
        estimated_cost_inr: 45.0,
        estimated_calories: 600.0,
        estimated_protein_g: 28.4,
        estimated_carbs_g: 98.0,
        estimated_fat_g: 8.5,
        items: [
          { name: 'Sattu Powder', quantity: 60, unit: 'g', calories: 240, protein: 15, cost: 18 },
          { name: 'Roasted Chana', quantity: 50, unit: 'g', calories: 180, protein: 11, cost: 15 },
          { name: 'Banana', quantity: 2, unit: 'piece', calories: 180, protein: 2.4, cost: 12 }
        ],
        price_checked_date: 'Today (Live Estimate)',
        sources: ['Local Grocery Market'],
        ai_explanation: 'Instant 3-minute prep meal delivering 28.4g protein for ₹45.'
      }
    ]);
  },

  sendAIChatMessage: async (message: string): Promise<string> => {
    const res = await safeFetch<{ reply: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    }, {
      reply: "You have about 960 kcal and 52g protein remaining today. With ₹55 left in your budget, I recommend a Soy Chunks Rice Bowl for high protein at ₹43!"
    });
    return res.reply;
  }
};
