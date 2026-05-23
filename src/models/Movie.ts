export interface Movie {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  directorId: string;
}

export interface MovieWithDirector extends Movie {
  directorName: string;
}

export interface CreateMovieDTO {
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  directorId: string;
}

export interface UpdateMovieDTO {
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  directorId: string;
}

export interface MovieFilters {
  title?: string;
  genre?: string;
  releaseYear?: number;
}
