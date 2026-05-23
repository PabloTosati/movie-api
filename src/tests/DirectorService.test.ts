import { DirectorService } from '../services/DirectorService';
import { Director } from '../models/Director';

const mockDirectorRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  hasMovies: jest.fn(),
};

const directorService = new DirectorService(mockDirectorRepository as any);

beforeEach(() => jest.clearAllMocks());

describe('DirectorService', () => {
  describe('getAllDirectors', () => {
    it('should return all directors', async () => {
      const directors: Director[] = [{ id: '1', name: 'Kubrick' }];
      mockDirectorRepository.findAll.mockResolvedValue(directors);

      const result = await directorService.getAllDirectors();
      expect(result).toEqual(directors);
      expect(mockDirectorRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDirectorById', () => {
    it('should return director when found', async () => {
      const director: Director = { id: '1', name: 'Kubrick' };
      mockDirectorRepository.findById.mockResolvedValue(director);

      const result = await directorService.getDirectorById('1');
      expect(result).toEqual(director);
    });

    it('should throw 404 when director not found', async () => {
      mockDirectorRepository.findById.mockResolvedValue(undefined);

      await expect(directorService.getDirectorById('999')).rejects.toMatchObject({
        status: 404,
        message: 'Director not found',
      });
    });
  });

  describe('createDirector', () => {
    it('should create and return a new director', async () => {
      const newDirector: Director = { id: 'abc', name: 'Nolan' };
      mockDirectorRepository.findByName.mockResolvedValue(undefined);
      mockDirectorRepository.create.mockResolvedValue(newDirector);

      const result = await directorService.createDirector({ name: 'Nolan' });
      expect(result).toEqual(newDirector);
    });

    it('should throw 409 when director name already exists', async () => {
      mockDirectorRepository.findByName.mockResolvedValue({ id: '1', name: 'Nolan' });

      await expect(directorService.createDirector({ name: 'Nolan' })).rejects.toMatchObject({
        status: 409,
      });
    });
  });

  describe('deleteDirector', () => {
    it('should delete director when no movies linked', async () => {
      mockDirectorRepository.findById.mockResolvedValue({ id: '1', name: 'Kubrick' });
      mockDirectorRepository.hasMovies.mockResolvedValue(false);
      mockDirectorRepository.delete.mockResolvedValue(true);

      await expect(directorService.deleteDirector('1')).resolves.toBeUndefined();
    });

    it('should throw 409 when director has movies', async () => {
      mockDirectorRepository.findById.mockResolvedValue({ id: '1', name: 'Kubrick' });
      mockDirectorRepository.hasMovies.mockResolvedValue(true);

      await expect(directorService.deleteDirector('1')).rejects.toMatchObject({
        status: 409,
        message: 'Cannot delete director with linked movies',
      });
    });
  });

  describe('updateDirector', () => {
    it('should update director name', async () => {
      const updated: Director = { id: '1', name: 'New Name' };
      mockDirectorRepository.findById.mockResolvedValue({ id: '1', name: 'Old Name' });
      mockDirectorRepository.findByName.mockResolvedValue(undefined);
      mockDirectorRepository.update.mockResolvedValue(updated);

      const result = await directorService.updateDirector('1', { name: 'New Name' });
      expect(result).toEqual(updated);
    });

    it('should throw 409 if name is taken by another director', async () => {
      mockDirectorRepository.findById.mockResolvedValue({ id: '1', name: 'Old Name' });
      mockDirectorRepository.findByName.mockResolvedValue({ id: '2', name: 'New Name' });

      await expect(directorService.updateDirector('1', { name: 'New Name' })).rejects.toMatchObject({
        status: 409,
      });
    });
  });
});
