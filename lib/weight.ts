import { getDb, initSchema } from './db';
import type { WeightLog } from './types';

function rowToWeightLog(row: Record<string, unknown>): WeightLog {
  return {
    id: Number(row.id),
    date: String(row.date),
    weight_kg: Number(row.weight_kg),
    created_at: String(row.created_at),
  };
}

export async function getWeightLogs(limit = 30): Promise<WeightLog[]> {
  await initSchema();
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM weight_logs ORDER BY date DESC LIMIT ?',
    args: [limit],
  });
  return result.rows.map(r => rowToWeightLog(r as Record<string, unknown>));
}

export async function upsertWeight(date: string, weight_kg: number): Promise<WeightLog> {
  const db = getDb();
  const result = await db.execute({
    sql: 'INSERT OR REPLACE INTO weight_logs (date, weight_kg) VALUES (?, ?) RETURNING *',
    args: [date, weight_kg],
  });
  return rowToWeightLog(result.rows[0] as Record<string, unknown>);
}

export async function deleteWeight(id: number): Promise<void> {
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM weight_logs WHERE id = ?', args: [id] });
}

export async function getSettings(): Promise<{ target_calories: number; target_weight_kg: number | null }> {
  await initSchema();
  const db = getDb();
  const result = await db.execute('SELECT key, value FROM settings');
  const map = Object.fromEntries(result.rows.map(r => [String(r.key), String(r.value)]));
  return {
    target_calories: parseInt(map.target_calories ?? '2000', 10),
    target_weight_kg: map.target_weight_kg ? parseFloat(map.target_weight_kg) : null,
  };
}

export async function saveSetting(key: string, value: string): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    args: [key, value],
  });
}
