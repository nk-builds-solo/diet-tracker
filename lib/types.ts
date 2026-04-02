export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: '朝食',
  lunch: '昼食',
  dinner: '夕食',
  snack: '間食',
};

export const MEAL_TYPE_COLORS: Record<MealType, string> = {
  breakfast: 'bg-orange-400',
  lunch: 'bg-yellow-400',
  dinner: 'bg-indigo-400',
  snack: 'bg-pink-400',
};

export interface Meal {
  id: number;
  date: string;
  meal_type: MealType;
  name: string;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  image_url: string;
  memo: string;
  created_at: string;
}

export interface WeightLog {
  id: number;
  date: string;
  weight_kg: number;
  created_at: string;
}

export interface FoodItem {
  id: number;
  name: string;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
}

export interface DailySummary {
  date: string;
  total_calories: number;
  breakfast_cal: number;
  lunch_cal: number;
  dinner_cal: number;
  snack_cal: number;
}

export interface Settings {
  target_calories: number;
  target_weight_kg: number | null;
}
