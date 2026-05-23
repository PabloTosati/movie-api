import { Router } from 'express';
import { DirectorController } from '../controllers/DirectorController';
import { validateDirector } from '../middlewares/validation';

export function createDirectorRouter(controller: DirectorController): Router {
  const router = Router();

  router.get('/', controller.getAllDirectors);
  router.get('/:id', controller.getDirectorById);
  router.get('/:id/movies', controller.getMoviesByDirector);
  router.post('/', validateDirector, controller.createDirector);
  router.put('/:id', validateDirector, controller.updateDirector);
  router.delete('/:id', controller.deleteDirector);

  return router;
}
