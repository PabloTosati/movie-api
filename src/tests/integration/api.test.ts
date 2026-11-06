import request from 'supertest';
import { createApp } from '../../app';
import { runMigrations } from '../../database/migrate';
import { runQuery, closeDatabase } from '../../database/connection';

const app = createApp();

async function createDirector(name = 'Christopher Nolan') {
  const res = await request(app).post('/directors').send({ name });
  return res.body as { id: string; name: string };
}

async function createMovie(directorId: string, overrides: Record<string, unknown> = {}) {
  const res = await request(app)
    .post('/movies')
    .send({
      title: 'Inception',
      description: 'A mind-bending thriller',
      releaseYear: 2010,
      genre: 'Sci-Fi',
      directorId,
      ...overrides,
    });
  return res.body as { id: string; title: string };
}

beforeAll(async () => {
  await runMigrations();
});

beforeEach(async () => {
  await runQuery('DELETE FROM movies');
  await runQuery('DELETE FROM directors');
});

afterAll(async () => {
  await closeDatabase();
});

describe('Directors API', () => {
  it('POST /directors creates a director', async () => {
    const res = await request(app).post('/directors').send({ name: '  Greta Gerwig  ' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: expect.any(String), name: 'Greta Gerwig' });
  });

  it('POST /directors returns 400 for an invalid name', async () => {
    const res = await request(app).post('/directors').send({ name: 'ab' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/between 3 and 50/);
  });

  it('POST /directors returns 409 for a duplicated name (case-insensitive)', async () => {
    await createDirector('Christopher Nolan');
    const res = await request(app).post('/directors').send({ name: 'christopher nolan' });

    expect(res.status).toBe(409);
  });

  it('GET /directors lists directors sorted by name', async () => {
    await createDirector('Wes Anderson');
    await createDirector('Bong Joon-ho');

    const res = await request(app).get('/directors');

    expect(res.status).toBe(200);
    expect(res.body.map((d: { name: string }) => d.name)).toEqual(['Bong Joon-ho', 'Wes Anderson']);
  });

  it('GET /directors/:id returns 404 when not found', async () => {
    const res = await request(app).get('/directors/does-not-exist');

    expect(res.status).toBe(404);
  });

  it('PUT /directors/:id renames a director', async () => {
    const director = await createDirector();
    const res = await request(app).put(`/directors/${director.id}`).send({ name: 'C. Nolan' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('C. Nolan');
  });

  it('GET /directors/:id/movies returns the director movies', async () => {
    const director = await createDirector();
    await createMovie(director.id, { title: 'Interstellar', releaseYear: 2014 });
    await createMovie(director.id, { title: 'Memento', releaseYear: 2000 });

    const res = await request(app).get(`/directors/${director.id}/movies`);

    expect(res.status).toBe(200);
    expect(res.body.map((m: { title: string }) => m.title)).toEqual(['Interstellar', 'Memento']);
  });

  it('DELETE /directors/:id returns 409 when the director has movies', async () => {
    const director = await createDirector();
    await createMovie(director.id);

    const res = await request(app).delete(`/directors/${director.id}`);

    expect(res.status).toBe(409);
  });

  it('DELETE /directors/:id removes a director without movies', async () => {
    const director = await createDirector();

    const res = await request(app).delete(`/directors/${director.id}`);
    const after = await request(app).get(`/directors/${director.id}`);

    expect(res.status).toBe(204);
    expect(after.status).toBe(404);
  });
});

describe('Movies API', () => {
  it('POST /movies creates a movie with the director name', async () => {
    const director = await createDirector();
    const res = await request(app).post('/movies').send({
      title: 'Inception',
      releaseYear: '2010',
      genre: 'Sci-Fi',
      directorId: director.id,
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: 'Inception',
      releaseYear: 2010,
      genre: 'Sci-Fi',
      directorName: 'Christopher Nolan',
    });
  });

  it('POST /movies returns 404 when the director does not exist', async () => {
    const res = await request(app).post('/movies').send({
      title: 'Inception',
      releaseYear: 2010,
      genre: 'Sci-Fi',
      directorId: 'unknown',
    });

    expect(res.status).toBe(404);
  });

  it('POST /movies returns 400 for an invalid release year', async () => {
    const director = await createDirector();
    const res = await request(app).post('/movies').send({
      title: 'Too Early',
      releaseYear: 1700,
      genre: 'Drama',
      directorId: director.id,
    });

    expect(res.status).toBe(400);
  });

  it('GET /movies filters by title, genre and year', async () => {
    const director = await createDirector();
    await createMovie(director.id, { title: 'Inception', genre: 'Sci-Fi', releaseYear: 2010 });
    await createMovie(director.id, { title: 'Dunkirk', genre: 'War', releaseYear: 2017 });

    const byGenre = await request(app).get('/movies?genre=sci');
    const byYear = await request(app).get('/movies?releaseYear=2017');
    const byTitle = await request(app).get('/movies?title=dunk');

    expect(byGenre.body.map((m: { title: string }) => m.title)).toEqual(['Inception']);
    expect(byYear.body.map((m: { title: string }) => m.title)).toEqual(['Dunkirk']);
    expect(byTitle.body.map((m: { title: string }) => m.title)).toEqual(['Dunkirk']);
  });

  it('GET /movies/:id returns 404 when not found', async () => {
    const res = await request(app).get('/movies/does-not-exist');

    expect(res.status).toBe(404);
  });

  it('PUT /movies/:id updates a movie', async () => {
    const director = await createDirector();
    const movie = await createMovie(director.id);

    const res = await request(app).put(`/movies/${movie.id}`).send({
      title: 'Inception (Remastered)',
      releaseYear: 2010,
      genre: 'Sci-Fi',
      directorId: director.id,
    });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Inception (Remastered)');
  });

  it('DELETE /movies/:id removes a movie', async () => {
    const director = await createDirector();
    const movie = await createMovie(director.id);

    const res = await request(app).delete(`/movies/${movie.id}`);
    const after = await request(app).get(`/movies/${movie.id}`);

    expect(res.status).toBe(204);
    expect(after.status).toBe(404);
  });
});

describe('Error handling', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Route not found' });
  });

  it('returns 400 for malformed JSON', async () => {
    const res = await request(app)
      .post('/directors')
      .set('Content-Type', 'application/json')
      .send('{"name": ');

    expect(res.status).toBe(400);
  });
});
