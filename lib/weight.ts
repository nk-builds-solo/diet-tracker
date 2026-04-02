import { getDb } from './db';
import type { WeightLog } from './types';

export function getWeightLogs(limit = 30): WeightLog[] {
  const db = getDb();
  return db.prepare('SELECT * FROM weight_logs ORDER BY date DESC LIMIT ?').all(limit) as WeightLog[];
}

export function upsertWeight(date: string, weight_kg: number): WeightLog {
  const db = getDb();
  return db.prepare(
    'INSERT OR REPLACE INTO weight_logs (date, weight_kg) VALUES (?, ?) RETURNING *'
  ).get(date, weight_kg) as WeightLog;
}

export function deleteWeight(id: number): void {
  const db = getDb();
  db.prepare('DELETE FROM weight_logs WHERE id = ?').run(id);
}

export function getSettings(): { target_calories: number; target_weight_kg: number | null } {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return {
    target_calories: parseInt(map.target_calories ?? '2000', 10),
    target_weight_kg: map.target_weight_kg ? parseFloat(map.target_weight_kg) : null,
  };
}

export function saveSetting(key: string, value: string): void {
  const db = getDb();
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
}
