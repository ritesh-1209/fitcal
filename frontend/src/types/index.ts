export interface UserProfile {
  user_id: string;
  name: string;
  age: number;
  sex: 'male' | 'female';
  height_cm: number;
  weight_kg: number;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'very_active';
  goal: 'weight_loss' | 'maintenance' | 'weight_gain';
  dietary_preference: 'vegetarian' | 'vegan' | 'eggitarian' | 'non-vegetarian';
  daily_budget_inr: number;
  location: string;
}

export interface DashboardSummary {
  user_name: string;
  date: string;
  target_calories: number;
  consumed_calories: number;
  burned_calories: number;
  net_consumed_calories: number;
  remaining_calories: number;
  target_protein_g: number;
  consumed_protein_g: number;
  remaining_protein_g: number;
  target_carbs_g: number;
  consumed_carbs_g: number;
  target_fat_g: number;
  consumed_fat_g: number;
  daily_budget_inr: number;
  spent_budget_inr: number;
  remaining_budget_inr: number;
  ai_insight_headline: string;
  ai_insights: string[];
}

export interface ParsedFoodItem {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  estimated_cost_inr: number;
}

export interface MealParseResponse {
  original_text: string;
  parsed_items: ParsedFoodItem[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  total_cost_inr: number;
  confidence_note: string;
}

export interface ActivityResult {
  activity_type: string;
  duration_minutes: number;
  intensity: string;
  met_value: number;
  calories_burned: number;
  disclaimer: string;
}

export interface BudgetMealOption {
  id: string;
  title: string;
  diet: string;
  prep_complexity: string;
  estimated_cost_inr: number;
  estimated_calories: number;
  estimated_protein_g: number;
  estimated_carbs_g: number;
  estimated_fat_g: number;
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    cost: number;
  }>;
  price_checked_date: string;
  sources: string[];
  ai_explanation?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  tools_called?: string[];
}
