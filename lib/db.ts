import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'diet.db');
const SCHEMA_PATH = path.join(process.cwd(), 'lib', 'schema.sql');

const globalForDb = globalThis as unknown as { _db?: Database.Database };

export function getDb(): Database.Database {
  if (!globalForDb._db) {
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

    globalForDb._db = new Database(DB_PATH);
    globalForDb._db.pragma('journal_mode = WAL');
    globalForDb._db.pragma('foreign_keys = ON');

    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    globalForDb._db.exec(schema);
  }
  return globalForDb._db;
}
