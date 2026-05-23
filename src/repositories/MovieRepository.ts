import { v4 as uuidv4 } from 'uuid';
import { runQuery, getOne, getAll } from '../database/connection';
import { Movie, MovieWithDirector, CreateMovieDTO, UpdateMovieDTO, MovieFilters } from '../models/Movie';

export class MovieRepository {
  private readonly selectWithDirector = `
    SELECT m.*, d.name as directorName
    FROM movies m
    JOIN directors d ON m.directorId = d.id
  `;

  async findAll(filters: MovieFilters = {}): Promise<MovieWithDirector[]> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filters.title) {
      conditions.push("LOWER(m.title) LIKE LOWER(?)");
      params.push(`%${filters.title}%`);
    }
    if (filters.genre) {
      conditions.push("LOWER(m.genre) LIKE LOWER(?)");
      params.push(`%${filters.genre}%`);
    }
    if (filters.releaseYear) {
      conditions.push("m.releaseYear = ?");
      params.push(filters.releaseYear);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `${this.selectWithDirector} ${where} ORDER BY m.title ASC`;

    return getAll<MovieWithDirector>(sql, params);
  }

  async findById(id: string): Promise<MovieWithDirector | undefined> {
    return getOne<MovieWithDirector>(
      `${this.selectWithDirector} WHERE m.id = ?`,
      [id]
    );
  }

  async findByDirectorId(directorId: string): Promise<MovieWithDirector[]> {
    return getAll<MovieWithDirector>(
      `${this.selectWithDirector} WHERE m.directorId = ? ORDER BY m.releaseYear DESC`,
      [directorId]
    );
  }

  async create(data: CreateMovieDTO): Promise<MovieWithDirector> {
    const id = uuidv4();
    await runQuery(
      'INSERT INTO movies (id, title, description, releaseYear, genre, directorId) VALUES (?, ?, ?, ?, ?, ?)',
      [id, data.title, data.description ?? '', data.releaseYear, data.genre, data.directorId]
    );
    return this.findById(id) as Promise<MovieWithDirector>;
  }

  async update(id: string, data: UpdateMovieDTO): Promise<MovieWithDirector | undefined> {
    await runQuery(
      'UPDATE movies SET title = ?, description = ?, releaseYear = ?, genre = ?, directorId = ? WHERE id = ?',
      [data.title, data.description ?? '', data.releaseYear, data.genre, data.directorId, id]
    );
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await runQuery('DELETE FROM movies WHERE id = ?', [id]);
    return result.changes > 0;
  }
}
