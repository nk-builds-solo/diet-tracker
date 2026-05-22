import { getDb, initSchema } from './db';
import type { Meal, MealType, DailySummary } from './types';

function rowToMeal(row: Record<string, unknown>): Meal {
  return {
    id: Number(row.id),
    date: String(row.date),
    meal_type: String(row.meal_type) as MealType,
    name: String(row.name),
    calories: Number(row.calories),
    protein_g: Number(row.protein_g ?? 0),
    fat_g: Number(row.fat_g ?? 0),
    carbs_g: Number(row.carbs_g ?? 0),
    image_url: String(row.image_url ?? ''),
    memo: String(row.memo ?? ''),
    created_at: String(row.created_at),
  };
}

export async function getMealsByDate(userId: string, date: string): Promise<Meal[]> {
  await initSchema();
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM meals WHERE user_id = ? AND date = ? ORDER BY created_at ASC',
    args: [userId, date],
  });
  return result.rows.map(r => rowToMeal(r as Record<string, unknown>));
}

export async function addMeal(userId: string, data: {
  date: string;
  meal_type: MealType;
  name: string;
  calories: number;
  protein_g?: number;
  fat_g?: number;
  carbs_g?: number;
  image_url?: string;
  memo?: string;
}): Promise<Meal> {
  const db = getDb();
  const result = await db.execute({
    sql: `INSERT INTO meals (user_id, date, meal_type, name, calories, protein_g, fat_g, carbs_g, image_url, memo)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
    args: [
      userId, data.date, data.meal_type, data.name, data.calories,
      data.protein_g ?? 0, data.fat_g ?? 0, data.carbs_g ?? 0,
      data.image_url ?? '', data.memo ?? '',
    ],
  });
  return rowToMeal(result.rows[0] as Record<string, unknown>);
}

export async function getMealById(userId: string, id: number): Promise<Meal | null> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM meals WHERE id = ? AND user_id = ?',
    args: [id, userId],
  });
  if (result.rows.length === 0) return null;
  return rowToMeal(result.rows[0] as Record<string, unknown>);
}

export async function updateMeal(userId: string, id: number, data: {
  meal_type: MealType; name: string; calories: number;
  protein_g?: number; fat_g?: number; carbs_g?: number;
  image_url?: string; memo?: string;
}): Promise<Meal> {
  const db = getDb();
  const result = await db.execute({
    sql: `UPDATE meals SET meal_type=?, name=?, calories=?, protein_g=?, fat_g=?, carbs_g=?, image_url=?, memo=?
          WHERE id=? AND user_id=? RETURNING *`,
    args: [
      data.meal_type, data.name, data.calories,
      data.protein_g ?? 0, data.fat_g ?? 0, data.carbs_g ?? 0,
      data.image_url ?? '', data.memo ?? '', id, userId,
    ],
  });
  return rowToMeal(result.rows[0] as Record<string, unknown>);
}

export async function deleteMeal(userId: string, id: number): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: 'DELETE FROM meals WHERE id = ? AND user_id = ?',
    args: [id, userId],
  });
}

export async function getDailySummaries(userId: string, days: number): Promise<DailySummary[]> {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT
      date,
      SUM(calories) as total_calories,
      SUM(CASE WHEN meal_type='breakfast' THEN calories ELSE 0 END) as breakfast_cal,
      SUM(CASE WHEN meal_type='lunch'     THEN calories ELSE 0 END) as lunch_cal,
      SUM(CASE WHEN meal_type='dinner'    THEN calories ELSE 0 END) as dinner_cal,
      SUM(CASE WHEN meal_type='snack'     THEN calories ELSE 0 END) as snack_cal
    FROM meals
    WHERE user_id = ?
    GROUP BY date
    ORDER BY date DESC
    LIMIT ?`,
    args: [userId, days],
  });
  return result.rows.map(r => ({
    date: String(r.date),
    total_calories: Number(r.total_calories),
    breakfast_cal: Number(r.breakfast_cal),
    lunch_cal: Number(r.lunch_cal),
    dinner_cal: Number(r.dinner_cal),
    snack_cal: Number(r.snack_cal),
  }));
}
