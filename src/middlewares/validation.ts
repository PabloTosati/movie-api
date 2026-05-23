import { Request, Response, NextFunction } from 'express';

const CURRENT_YEAR = new Date().getFullYear();

export function validateMovie(req: Request, res: Response, next: NextFunction): void {
  const { title, description, releaseYear, genre, directorId } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ error: 'Field "title" is required and must be a non-empty string' });
    return;
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      res.status(400).json({ error: 'Field "description" must be a string' });
      return;
    }
    if (description.length > 255) {
      res.status(400).json({ error: 'Field "description" must have at most 255 characters' });
      return;
    }
  }

  if (releaseYear === undefined || releaseYear === null || releaseYear === '') {
    res.status(400).json({ error: 'Field "releaseYear" is required' });
    return;
  }

  const year = Number(releaseYear);
  if (!Number.isInteger(year) || year < 1888 || year > CURRENT_YEAR) {
    res.status(400).json({ error: `Field "releaseYear" must be a valid year between 1888 and ${CURRENT_YEAR}` });
    return;
  }

  if (!genre || typeof genre !== 'string' || genre.trim() === '') {
    res.status(400).json({ error: 'Field "genre" is required and must be a non-empty string' });
    return;
  }

  if (!directorId || typeof directorId !== 'string' || directorId.trim() === '') {
    res.status(400).json({ error: 'Field "directorId" is required' });
    return;
  }

  req.body.releaseYear = year;
  next();
}

export function validateDirector(req: Request, res: Response, next: NextFunction): void {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ error: 'Field "name" is required and must be a non-empty string' });
    return;
  }

  if (name.trim().length < 3 || name.trim().length > 50) {
    res.status(400).json({ error: 'Field "name" must be between 3 and 50 characters' });
    return;
  }

  req.body.name = name.trim();
  next();
}
