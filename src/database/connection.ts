import sqlite3 from 'sqlite3';
import path from 'path';

// DB_PATH can point to any file, or to ':memory:' (used by the integration tests).
const DB_PATH = process.env.DB_PATH ?? path.resolve(__dirname, '../../database.sqlite');

let db: sqlite3.Database | null = null;

export function getDatabase(): sqlite3.Database {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error connecting to database:', err.message);
        throw err;
      }
      console.info('Connected to SQLite database at:', DB_PATH);
    });
    db.run('PRAGMA foreign_keys = ON');
  }
  return db;
}

export function closeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) return resolve();
    db.close((err) => {
      if (err) return reject(err);
      db = null;
      resolve();
    });
  });
}

export function runQuery(sql: string, params: unknown[] = []): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    getDatabase().run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function getOne<T>(sql: string, params: unknown[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    getDatabase().get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row as T | undefined);
    });
  });
}

export function getAll<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    getDatabase().all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows as T[]);
    });
  });
}
