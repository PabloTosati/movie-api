import { Router } from 'express';
import { MovieController } from '../controllers/MovieController';
import { validateMovie } from '../middlewares/validation';

export function createMovieRouter(controller: MovieController): Router {
  const router = Router();

  router.get('/', controller.getAllMovies);
  router.get('/:id', controller.getMovieById);
  router.post('/', validateMovie, controller.createMovie);
  router.put('/:id', validateMovie, controller.updateMovie);
  router.delete('/:id', controller.deleteMovie);

  return router;
}
