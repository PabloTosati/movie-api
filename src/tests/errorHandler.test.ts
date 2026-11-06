import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../middlewares/errorHandler';

function buildRes() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('errorHandler', () => {
  const req = {} as Request;
  const next = jest.fn() as NextFunction;

  it('returns the status and message of known errors', () => {
    const res = buildRes();
    errorHandler({ status: 404, message: 'Movie not found' }, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Movie not found' });
  });

  it('hides the internal message of unexpected errors', () => {
    const res = buildRes();
    errorHandler(new Error('SQLITE_ERROR: no such table: movies'), req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
