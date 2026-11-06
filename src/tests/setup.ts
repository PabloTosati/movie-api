// Runs before every test file.
// Uses an in-memory SQLite database so tests never touch database.sqlite.
process.env.DB_PATH = ':memory:';

// Keeps the test output clean: the app logs every request and error.
jest.spyOn(console, 'info').mockImplementation(() => undefined);
jest.spyOn(console, 'error').mockImplementation(() => undefined);
