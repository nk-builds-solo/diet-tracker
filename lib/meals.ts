import { getDb } from './db';
import type { Meal, MealType, DailySummary } from './types';

export function getMealsByDate(date: string): Meal[] {
  const db = getDb();
  return db.prepare('SELECT * FROM meals WHERE date = ? ORDER BY created_at ASC').all(date) as Meal[];
}

export function addMeal(data: { date: string; meal_type: MealType; name: string; calories: number; memo?: string }): Meal {
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO meals (date, meal_type, name, calories, memo) VALUES (?, ?, ?, ?, ?) RETURNING *'
  ).get(data.date, data.meal_type, data.name, data.calories, data.memo ?? '') as Meal;
  return result;
}

export function deleteMeal(id: number): void {
  const db = getDb();
  db.prepare('DELETE FROM meals WHERE id = ?').run(id);
}

export function getDailySummaries(days: number): DailySummary[] {
  const db = getDb();
  return db.prepare(`
    SELECT
      date,
      SUM(calories) as total_calories,
      SUM(CASE WHEN meal_type='breakfast' THEN calories ELSE 0 END) as breakfast_cal,
      SUM(CASE WHEN meal_type='lunch'     THEN calories ELSE 0 END) as lunch_cal,
      SUM(CASE WHEN meal_type='dinner'    THEN calories ELSE 0 END) as dinner_cal,
      SUM(CASE WHEN meal_type='snack'     THEN calories ELSE 0 END) as snack_cal
    FROM meals
    GROUP BY date
    ORDER BY date DESC
    LIMIT ?
  `).all(days) as DailySummary[];
}
