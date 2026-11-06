import { runQuery } from './connection';

export async function runMigrations(): Promise<void> {
  console.info('Running database migrations...');

  await runQuery(`
    CREATE TABLE IF NOT EXISTS directors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    )
  `);
  console.info('Migration 001: directors table created.');

  await runQuery(`
    CREATE TABLE IF NOT EXISTS movies (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      releaseYear INTEGER NOT NULL,
      genre TEXT NOT NULL,
      directorId TEXT NOT NULL,
      FOREIGN KEY (directorId) REFERENCES directors(id) ON DELETE RESTRICT
    )
  `);
  console.info('Migration 002: movies table created.');

  console.info('All migrations completed successfully.');
}

// Allows running this file directly: `npm run migrate`
if (require.main === module) {
  runMigrations().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}
