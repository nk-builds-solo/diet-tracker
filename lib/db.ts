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
      user_id     TEXT    NOT NULL DEFAULT '',
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
    `CREATE INDEX IF NOT EXISTS idx_meals_user ON meals(user_id)`,
    `CREATE TABLE IF NOT EXISTS weight_logs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     TEXT    NOT NULL DEFAULT '',
      date        TEXT    NOT NULL,
      weight_kg   REAL    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_weight_date ON weight_logs(date)`,
    `CREATE INDEX IF NOT EXISTS idx_weight_user ON weight_logs(user_id)`,
    `CREATE TABLE IF NOT EXISTS food_items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     TEXT    NOT NULL DEFAULT '',
      name        TEXT    NOT NULL,
      calories    INTEGER NOT NULL,
      protein_g   REAL    DEFAULT 0,
      fat_g       REAL    DEFAULT 0,
      carbs_g     REAL    DEFAULT 0,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      user_id TEXT NOT NULL DEFAULT '',
      key     TEXT NOT NULL,
      value   TEXT NOT NULL,
      PRIMARY KEY (user_id, key)
    )`,
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
  if (!cols.includes('user_id'))   migrations.push('ALTER TABLE meals ADD COLUMN user_id TEXT NOT NULL DEFAULT \'\'');

  const wInfo = await db.execute('PRAGMA table_info(weight_logs)');
  const wCols = wInfo.rows.map(r => (r as Record<string, unknown>).name as string);
  if (!wCols.includes('user_id'))  migrations.push('ALTER TABLE weight_logs ADD COLUMN user_id TEXT NOT NULL DEFAULT \'\'');

  const fInfo = await db.execute('PRAGMA table_info(food_items)');
  const fCols = fInfo.rows.map(r => (r as Record<string, unknown>).name as string);
  if (!fCols.includes('user_id'))  migrations.push('ALTER TABLE food_items ADD COLUMN user_id TEXT NOT NULL DEFAULT \'\'');

  if (migrations.length > 0) await db.batch(migrations, 'write');
}
