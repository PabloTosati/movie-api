import { createApp } from './app';
import { runMigrations } from './database/migrate';

const PORT = process.env.PORT ?? 3000;

async function start(): Promise<void> {
  // Tables are created with IF NOT EXISTS, so this is safe on every start.
  await runMigrations();

  const app = createApp();
  app.listen(PORT, () => {
    console.info(`[Server] Movie API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});
