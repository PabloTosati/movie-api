import { Request, Response, NextFunction } from 'express';
import { MovieService } from '../services/MovieService';
import { MovieFilters } from '../models/Movie';

export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  getAllMovies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.info('[MovieController] GET /movies', req.query);
      const filters: MovieFilters = {};
      if (req.query.title) filters.title = String(req.query.title);
      if (req.query.genre) filters.genre = String(req.query.genre);
      if (req.query.releaseYear) filters.releaseYear = Number(req.query.releaseYear);

      const movies = await this.movieService.getAllMovies(filters);
      console.info(`[MovieController] Returning ${movies.length} movies`);
      res.status(200).json(movies);
    } catch (err) {
      next(err);
    }
  };

  getMovieById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.info(`[MovieController] GET /movies/${req.params.id}`);
      const movie = await this.movieService.getMovieById(req.params.id);
      res.status(200).json(movie);
    } catch (err) {
      next(err);
    }
  };

  createMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.info('[MovieController] POST /movies', req.body);
      const movie = await this.movieService.createMovie(req.body);
      console.info(`[MovieController] Movie created: ${movie.id}`);
      res.status(201).json(movie);
    } catch (err) {
      next(err);
    }
  };

  updateMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.info(`[MovieController] PUT /movies/${req.params.id}`, req.body);
      const movie = await this.movieService.updateMovie(req.params.id, req.body);
      res.status(200).json(movie);
    } catch (err) {
      next(err);
    }
  };

  deleteMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.info(`[MovieController] DELETE /movies/${req.params.id}`);
      await this.movieService.deleteMovie(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
