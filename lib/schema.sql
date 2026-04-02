PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS meals (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  date        TEXT    NOT NULL,
  meal_type   TEXT    NOT NULL CHECK(meal_type IN ('breakfast','lunch','dinner','snack')),
  name        TEXT    NOT NULL,
  calories    INTEGER NOT NULL CHECK(calories >= 0),
  memo        TEXT    DEFAULT '',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(date);

CREATE TABLE IF NOT EXISTS weight_logs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  date        TEXT    NOT NULL UNIQUE,
  weight_kg   REAL    NOT NULL CHECK(weight_kg > 0 AND weight_kg < 500),
  created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE INDEX IF NOT EXISTS idx_weight_date ON weight_logs(date);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT OR IGNORE INTO settings(key, value) VALUES ('target_calories', '2000');
INSERT OR IGNORE INTO settings(key, value) VALUES ('target_weight_kg', '');
