import { DirectorRepository } from '../repositories/DirectorRepository';
import { Director, CreateDirectorDTO, UpdateDirectorDTO } from '../models/Director';

export class DirectorService {
  constructor(private readonly directorRepository: DirectorRepository) {}

  async getAllDirectors(): Promise<Director[]> {
    console.info('[DirectorService] Fetching all directors');
    const directors = await this.directorRepository.findAll();
    console.info(`[DirectorService] Found ${directors.length} directors`);
    return directors;
  }

  async getDirectorById(id: string): Promise<Director> {
    console.info(`[DirectorService] Fetching director with id: ${id}`);
    const director = await this.directorRepository.findById(id);
    if (!director) {
      console.info(`[DirectorService] Director not found: ${id}`);
      throw { status: 404, message: 'Director not found' };
    }
    return director;
  }

  async createDirector(data: CreateDirectorDTO): Promise<Director> {
    console.info(`[DirectorService] Creating director: ${data.name}`);
    const existing = await this.directorRepository.findByName(data.name);
    if (existing) {
      console.info(`[DirectorService] Conflict: director with name "${data.name}" already exists`);
      throw { status: 409, message: 'A director with this name already exists' };
    }
    const director = await this.directorRepository.create(data);
    console.info(`[DirectorService] Director created with id: ${director.id}`);
    return director;
  }

  async updateDirector(id: string, data: UpdateDirectorDTO): Promise<Director> {
    console.info(`[DirectorService] Updating director: ${id}`);
    await this.getDirectorById(id);

    const existing = await this.directorRepository.findByName(data.name);
    if (existing && existing.id !== id) {
      throw { status: 409, message: 'A director with this name already exists' };
    }

    const updated = await this.directorRepository.update(id, data);
    if (!updated) throw { status: 404, message: 'Director not found' };
    console.info(`[DirectorService] Director updated: ${id}`);
    return updated;
  }

  async deleteDirector(id: string): Promise<void> {
    console.info(`[DirectorService] Deleting director: ${id}`);
    await this.getDirectorById(id);

    const hasMovies = await this.directorRepository.hasMovies(id);
    if (hasMovies) {
      console.info(`[DirectorService] Conflict: director ${id} has movies linked`);
      throw { status: 409, message: 'Cannot delete director with linked movies' };
    }

    await this.directorRepository.delete(id);
    console.info(`[DirectorService] Director deleted: ${id}`);
  }
}
