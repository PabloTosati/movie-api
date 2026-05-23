import { validateMovie, validateDirector } from '../middlewares/validation';
import { Request, Response, NextFunction } from 'express';

function mockReq(body: object): Partial<Request> {
  return { body };
}

function mockRes(): { status: jest.Mock; json: jest.Mock; _status: number; _body: unknown } {
  const res = {
    _status: 0,
    _body: {},
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res as any;
}

const next: NextFunction = jest.fn();

beforeEach(() => (next as jest.Mock).mockClear());

describe('validateMovie middleware', () => {
  const validBody = {
    title: 'Inception',
    description: 'A movie',
    releaseYear: 2010,
    genre: 'Sci-Fi',
    directorId: 'some-uuid',
  };

  it('should call next() for valid input', () => {
    const req = mockReq(validBody);
    const res = mockRes();
    validateMovie(req as Request, res as any, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 when title is missing', () => {
    const req = mockReq({ ...validBody, title: '' });
    const res = mockRes();
    validateMovie(req as Request, res as any, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 when releaseYear is in the future', () => {
    const req = mockReq({ ...validBody, releaseYear: 9999 });
    const res = mockRes();
    validateMovie(req as Request, res as any, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when description exceeds 255 chars', () => {
    const req = mockReq({ ...validBody, description: 'a'.repeat(256) });
    const res = mockRes();
    validateMovie(req as Request, res as any, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when genre is missing', () => {
    const req = mockReq({ ...validBody, genre: '' });
    const res = mockRes();
    validateMovie(req as Request, res as any, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when directorId is missing', () => {
    const req = mockReq({ ...validBody, directorId: '' });
    const res = mockRes();
    validateMovie(req as Request, res as any, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('validateDirector middleware', () => {
  it('should call next() for valid director name', () => {
    const req = mockReq({ name: 'Nolan' });
    const res = mockRes();
    validateDirector(req as Request, res as any, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 when name is too short', () => {
    const req = mockReq({ name: 'AB' });
    const res = mockRes();
    validateDirector(req as Request, res as any, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when name is too long', () => {
    const req = mockReq({ name: 'A'.repeat(51) });
    const res = mockRes();
    validateDirector(req as Request, res as any, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when name is empty', () => {
    const req = mockReq({ name: '' });
    const res = mockRes();
    validateDirector(req as Request, res as any, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
