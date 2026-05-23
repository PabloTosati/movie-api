import { MovieService } from '../services/MovieService';
import { MovieWithDirector } from '../models/Movie';

const mockMovieRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByDirectorId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockDirectorRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  hasMovies: jest.fn(),
};

const movieService = new MovieService(mockMovieRepository as any, mockDirectorRepository as any);

const mockMovie: MovieWithDirector = {
  id: '1',
  title: 'Inception',
  description: 'A mind-bending thriller',
  releaseYear: 2010,
  genre: 'Sci-Fi',
  directorId: 'd1',
  directorName: 'Nolan',
};

beforeEach(() => jest.clearAllMocks());

describe('MovieService', () => {
  describe('getAllMovies', () => {
    it('should return all movies', async () => {
      mockMovieRepository.findAll.mockResolvedValue([mockMovie]);
      const result = await movieService.getAllMovies();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Inception');
    });

    it('should apply filters', async () => {
      mockMovieRepository.findAll.mockResolvedValue([mockMovie]);
      await movieService.getAllMovies({ genre: 'Sci-Fi' });
      expect(mockMovieRepository.findAll).toHaveBeenCalledWith({ genre: 'Sci-Fi' });
    });
  });

  describe('getMovieById', () => {
    it('should return movie when found', async () => {
      mockMovieRepository.findById.mockResolvedValue(mockMovie);
      const result = await movieService.getMovieById('1');
      expect(result).toEqual(mockMovie);
    });

    it('should throw 404 when movie not found', async () => {
      mockMovieRepository.findById.mockResolvedValue(undefined);
      await expect(movieService.getMovieById('999')).rejects.toMatchObject({
        status: 404,
        message: 'Movie not found',
      });
    });
  });

  describe('createMovie', () => {
    it('should create movie when director exists', async () => {
      mockDirectorRepository.findById.mockResolvedValue({ id: 'd1', name: 'Nolan' });
      mockMovieRepository.create.mockResolvedValue(mockMovie);

      const result = await movieService.createMovie({
        title: 'Inception',
        description: '',
        releaseYear: 2010,
        genre: 'Sci-Fi',
        directorId: 'd1',
      });
      expect(result).toEqual(mockMovie);
    });

    it('should throw 404 when directorId does not exist', async () => {
      mockDirectorRepository.findById.mockResolvedValue(undefined);

      await expect(
        movieService.createMovie({
          title: 'Inception',
          description: '',
          releaseYear: 2010,
          genre: 'Sci-Fi',
          directorId: 'nonexistent',
        })
      ).rejects.toMatchObject({ status: 404, message: 'Director not found' });
    });
  });

  describe('deleteMovie', () => {
    it('should delete movie when it exists', async () => {
      mockMovieRepository.findById.mockResolvedValue(mockMovie);
      mockMovieRepository.delete.mockResolvedValue(true);

      await expect(movieService.deleteMovie('1')).resolves.toBeUndefined();
    });

    it('should throw 404 when movie does not exist', async () => {
      mockMovieRepository.findById.mockResolvedValue(undefined);

      await expect(movieService.deleteMovie('999')).rejects.toMatchObject({ status: 404 });
    });
  });

  describe('updateMovie', () => {
    it('should update movie when director exists', async () => {
      mockMovieRepository.findById.mockResolvedValue(mockMovie);
      mockDirectorRepository.findById.mockResolvedValue({ id: 'd1', name: 'Nolan' });
      mockMovieRepository.update.mockResolvedValue(mockMovie);

      const result = await movieService.updateMovie('1', {
        title: 'Inception',
        description: 'Updated',
        releaseYear: 2010,
        genre: 'Sci-Fi',
        directorId: 'd1',
      });
      expect(result).toEqual(mockMovie);
    });
  });

  describe('getMoviesByDirectorId', () => {
    it('should return movies for a valid director', async () => {
      mockDirectorRepository.findById.mockResolvedValue({ id: 'd1', name: 'Nolan' });
      mockMovieRepository.findByDirectorId.mockResolvedValue([mockMovie]);

      const result = await movieService.getMoviesByDirectorId('d1');
      expect(result).toHaveLength(1);
    });

    it('should throw 404 for nonexistent director', async () => {
      mockDirectorRepository.findById.mockResolvedValue(undefined);
      await expect(movieService.getMoviesByDirectorId('x')).rejects.toMatchObject({ status: 404 });
    });
  });
});
