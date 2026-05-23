import { v4 as uuidv4 } from 'uuid';
import { runQuery, getOne, getAll } from '../database/connection';
import { Director, CreateDirectorDTO, UpdateDirectorDTO } from '../models/Director';

export class DirectorRepository {
  async findAll(): Promise<Director[]> {
    return getAll<Director>('SELECT * FROM directors ORDER BY name ASC');
  }

  async findById(id: string): Promise<Director | undefined> {
    return getOne<Director>('SELECT * FROM directors WHERE id = ?', [id]);
  }

  async findByName(name: string): Promise<Director | undefined> {
    return getOne<Director>('SELECT * FROM directors WHERE LOWER(name) = LOWER(?)', [name]);
  }

  async create(data: CreateDirectorDTO): Promise<Director> {
    const id = uuidv4();
    await runQuery('INSERT INTO directors (id, name) VALUES (?, ?)', [id, data.name]);
    return { id, name: data.name };
  }

  async update(id: string, data: UpdateDirectorDTO): Promise<Director | undefined> {
    await runQuery('UPDATE directors SET name = ? WHERE id = ?', [data.name, id]);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await runQuery('DELETE FROM directors WHERE id = ?', [id]);
    return result.changes > 0;
  }

  async hasMovies(id: string): Promise<boolean> {
    const row = await getOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM movies WHERE directorId = ?',
      [id]
    );
    return (row?.count ?? 0) > 0;
  }
}
