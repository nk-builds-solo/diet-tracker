import { getDb } from './db';
import type { FoodItem } from './types';

function rowToFood(row: Record<string, unknown>): FoodItem {
  return {
    id: Number(row.id),
    name: String(row.name),
    calories: Number(row.calories),
    protein_g: Number(row.protein_g ?? 0),
    fat_g: Number(row.fat_g ?? 0),
    carbs_g: Number(row.carbs_g ?? 0),
  };
}

export async function searchFoods(query: string): Promise<FoodItem[]> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM food_items WHERE name LIKE ? ORDER BY name LIMIT 10',
    args: [`%${query}%`],
  });
  return result.rows.map(r => rowToFood(r as Record<string, unknown>));
}

export async function saveFoodItem(data: Omit<FoodItem, 'id'>): Promise<FoodItem> {
  const db = getDb();
  const result = await db.execute({
    sql: `INSERT OR REPLACE INTO food_items (name, calories, protein_g, fat_g, carbs_g)
          VALUES (?, ?, ?, ?, ?) RETURNING *`,
    args: [data.name, data.calories, data.protein_g, data.fat_g, data.carbs_g],
  });
  return rowToFood(result.rows[0] as Record<string, unknown>);
}

export async function deleteFoodItem(id: number): Promise<void> {
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM food_items WHERE id = ?', args: [id] });
}

export async function getAllFoods(): Promise<FoodItem[]> {
  const db = getDb();
  const result = await db.execute('SELECT * FROM food_items ORDER BY name');
  return result.rows.map(r => rowToFood(r as Record<string, unknown>));
}
