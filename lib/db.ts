import { createClient } from '@libsql/client';

const globalForDb = globalThis as unknown as { _dbClient?: ReturnType<typeof createClient> };

export function getDb() {
  if (!globalForDb._dbClient) {
    globalForDb._dbClient = createClient({
      url: process.env.TURSO_DATABASE_URL ?? 'file:data/diet.db',
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return globalForDb._dbClient;
}

export async function initSchema() {
  const db = getDb();
  await db.batch([
    `CREATE TABLE IF NOT EXISTS meals (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      date        TEXT    NOT NULL,
      meal_type   TEXT    NOT NULL,
      name        TEXT    NOT NULL,
      calories    INTEGER NOT NULL,
      protein_g   REAL    DEFAULT 0,
      fat_g       REAL    DEFAULT 0,
      carbs_g     REAL    DEFAULT 0,
      image_url   TEXT    DEFAULT '',
      memo        TEXT    DEFAULT '',
      created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(date)`,
    `CREATE TABLE IF NOT EXISTS weight_logs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      date        TEXT    NOT NULL UNIQUE,
      weight_kg   REAL    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_weight_date ON weight_logs(date)`,
    `CREATE TABLE IF NOT EXISTS food_items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL UNIQUE,
      calories    INTEGER NOT NULL,
      protein_g   REAL    DEFAULT 0,
      fat_g       REAL    DEFAULT 0,
      carbs_g     REAL    DEFAULT 0,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`,
    `INSERT OR IGNORE INTO settings(key, value) VALUES ('target_calories', '2000')`,
    `INSERT OR IGNORE INTO settings(key, value) VALUES ('target_weight_kg', '')`,
  ], 'write');

  // Migrate old tables that may be missing columns
  const info = await db.execute('PRAGMA table_info(meals)');
  const cols = info.rows.map(r => (r as Record<string, unknown>).name as string);
  const migrations: string[] = [];
  if (!cols.includes('protein_g')) migrations.push('ALTER TABLE meals ADD COLUMN protein_g REAL DEFAULT 0');
  if (!cols.includes('fat_g'))     migrations.push('ALTER TABLE meals ADD COLUMN fat_g REAL DEFAULT 0');
  if (!cols.includes('carbs_g'))   migrations.push('ALTER TABLE meals ADD COLUMN carbs_g REAL DEFAULT 0');
  if (!cols.includes('image_url')) migrations.push('ALTER TABLE meals ADD COLUMN image_url TEXT DEFAULT \'\'');
  if (!cols.includes('memo'))      migrations.push('ALTER TABLE meals ADD COLUMN memo TEXT DEFAULT \'\'');
  if (migrations.length > 0) await db.batch(migrations, 'write');
}
