import { MovieRepository } from '../repositories/MovieRepository';
import { DirectorRepository } from '../repositories/DirectorRepository';
import { Movie, MovieWithDirector, CreateMovieDTO, UpdateMovieDTO, MovieFilters } from '../models/Movie';

export class MovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly directorRepository: DirectorRepository
  ) {}

  async getAllMovies(filters: MovieFilters = {}): Promise<MovieWithDirector[]> {
    console.info('[MovieService] Fetching all movies with filters:', filters);
    const movies = await this.movieRepository.findAll(filters);
    console.info(`[MovieService] Found ${movies.length} movies`);
    return movies;
  }

  async getMovieById(id: string): Promise<MovieWithDirector> {
    console.info(`[MovieService] Fetching movie with id: ${id}`);
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      console.info(`[MovieService] Movie not found: ${id}`);
      throw { status: 404, message: 'Movie not found' };
    }
    return movie;
  }

  async getMoviesByDirectorId(directorId: string): Promise<MovieWithDirector[]> {
    console.info(`[MovieService] Fetching movies for director: ${directorId}`);
    const director = await this.directorRepository.findById(directorId);
    if (!director) {
      throw { status: 404, message: 'Director not found' };
    }
    const movies = await this.movieRepository.findByDirectorId(directorId);
    console.info(`[MovieService] Found ${movies.length} movies for director ${directorId}`);
    return movies;
  }

  async createMovie(data: CreateMovieDTO): Promise<MovieWithDirector> {
    console.info(`[MovieService] Creating movie: ${data.title}`);
    const director = await this.directorRepository.findById(data.directorId);
    if (!director) {
      throw { status: 404, message: 'Director not found' };
    }
    const movie = await this.movieRepository.create(data);
    console.info(`[MovieService] Movie created with id: ${movie.id}`);
    return movie;
  }

  async updateMovie(id: string, data: UpdateMovieDTO): Promise<MovieWithDirector> {
    console.info(`[MovieService] Updating movie: ${id}`);
    await this.getMovieById(id);

    const director = await this.directorRepository.findById(data.directorId);
    if (!director) {
      throw { status: 404, message: 'Director not found' };
    }

    const updated = await this.movieRepository.update(id, data);
    if (!updated) throw { status: 404, message: 'Movie not found' };
    console.info(`[MovieService] Movie updated: ${id}`);
    return updated;
  }

  async deleteMovie(id: string): Promise<void> {
    console.info(`[MovieService] Deleting movie: ${id}`);
    await this.getMovieById(id);
    await this.movieRepository.delete(id);
    console.info(`[MovieService] Movie deleted: ${id}`);
  }
}
