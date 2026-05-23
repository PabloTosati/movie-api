import { Request, Response, NextFunction } from 'express';
import { DirectorService } from '../services/DirectorService';
import { MovieService } from '../services/MovieService';

export class DirectorController {
  constructor(
    private readonly directorService: DirectorService,
    private readonly movieService: MovieService
  ) {}

  getAllDirectors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.info('[DirectorController] GET /directors');
      const directors = await this.directorService.getAllDirectors();
      console.info(`[DirectorController] Returning ${directors.length} directors`);
      res.status(200).json(directors);
    } catch (err) {
      next(err);
    }
  };

  getDirectorById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.info(`[DirectorController] GET /directors/${req.params.id}`);
      const director = await this.directorService.getDirectorById(req.params.id);
      res.status(200).json(director);
    } catch (err) {
      next(err);
    }
  };

  getMoviesByDirector = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.info(`[DirectorController] GET /directors/${req.params.id}/movies`);
      const movies = await this.movieService.getMoviesByDirectorId(req.params.id);
      res.status(200).json(movies);
    } catch (err) {
      next(err);
    }
  };

  createDirector = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.info('[DirectorController] POST /directors', req.body);
      const director = await this.directorService.createDirector(req.body);
      console.info(`[DirectorController] Director created: ${director.id}`);
      res.status(201).json(director);
    } catch (err) {
      next(err);
    }
  };

  updateDirector = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.info(`[DirectorController] PUT /directors/${req.params.id}`, req.body);
      const director = await this.directorService.updateDirector(req.params.id, req.body);
      res.status(200).json(director);
    } catch (err) {
      next(err);
    }
  };

  deleteDirector = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.info(`[DirectorController] DELETE /directors/${req.params.id}`);
      await this.directorService.deleteDirector(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
