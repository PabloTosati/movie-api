import express from 'express';
import { DirectorRepository } from './repositories/DirectorRepository';
import { MovieRepository } from './repositories/MovieRepository';
import { DirectorService } from './services/DirectorService';
import { MovieService } from './services/MovieService';
import { DirectorController } from './controllers/DirectorController';
import { MovieController } from './controllers/MovieController';
import { createDirectorRouter } from './routes/directorRoutes';
import { createMovieRouter } from './routes/movieRoutes';
import { errorHandler } from './middlewares/errorHandler';

export function createApp(): express.Express {
  const app = express();

  app.use(express.json());

  // Dependency injection
  const directorRepository = new DirectorRepository();
  const movieRepository = new MovieRepository();
  const directorService = new DirectorService(directorRepository);
  const movieService = new MovieService(movieRepository, directorRepository);
  const directorController = new DirectorController(directorService, movieService);
  const movieController = new MovieController(movieService);

  // Routes
  app.use('/directors', createDirectorRouter(directorController));
  app.use('/movies', createMovieRouter(movieController));

  // 404 handler
  app.use((req, res) => {
    console.info(`[Server] Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Route not found' });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}
