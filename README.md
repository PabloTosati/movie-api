# Movie Collection API

[![CI](https://github.com/PabloTosati/movie-api/actions/workflows/ci.yml/badge.svg)](https://github.com/PabloTosati/movie-api/actions/workflows/ci.yml)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)

REST API to manage a movie collection and its directors, built with Node.js, Express and TypeScript.

🇧🇷 [Leia em português](README.pt-BR.md)

## Highlights

- **Layered architecture**: routes → controllers → services → repositories, with dependency injection
- **Business rules**: unique director names (case-insensitive), a director with movies cannot be deleted, release year validation
- **Filters**: search movies by title, genre and release year
- **50 automated tests** (unit + end-to-end with an in-memory database), **~93% coverage**
- **Docker** ready, with the database kept in a persistent volume
- **Safe errors**: unexpected errors are logged but never exposed to the client

## Tech stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript |
| HTTP framework | Express |
| Database | SQLite |
| Tests | Jest + Supertest |
| Containers | Docker + Docker Compose |
| CI | GitHub Actions |

## Getting started

Requirements: Node.js 18+.

```bash
git clone https://github.com/PabloTosati/movie-api.git
cd movie-api
npm install
npm run dev
```

The API runs on `http://localhost:3000`. Tables are created automatically on startup.

### With Docker

```bash
docker compose up --build
```

The SQLite database is stored in the `db_data` volume, so data survives container restarts.

### Tests

```bash
npm test               # run all tests
npm run test:coverage  # with coverage report
```

The end-to-end tests use an in-memory SQLite database, so they never touch your local data.

## Endpoints

### Movies (`/movies`)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/movies` | List movies (filters: `title`, `genre`, `releaseYear`) |
| GET | `/movies/:id` | Get a movie by ID |
| POST | `/movies` | Create a movie |
| PUT | `/movies/:id` | Update a movie |
| DELETE | `/movies/:id` | Delete a movie |

### Directors (`/directors`)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/directors` | List directors |
| GET | `/directors/:id` | Get a director by ID |
| GET | `/directors/:id/movies` | List all movies by a director |
| POST | `/directors` | Create a director |
| PUT | `/directors/:id` | Rename a director |
| DELETE | `/directors/:id` | Delete a director (fails if it has movies) |

### Status codes

| Code | When |
| --- | --- |
| `200` / `201` / `204` | Success |
| `400` | Invalid body (missing field, invalid year, malformed JSON) |
| `404` | Movie, director or route not found |
| `409` | Duplicated director name, or deleting a director that has movies |
| `500` | Unexpected error (details only in the server logs) |

## Examples

Create a director:

```bash
curl -X POST http://localhost:3000/directors \
  -H "Content-Type: application/json" \
  -d '{"name": "Christopher Nolan"}'
```

Create a movie:

```bash
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "description": "A mind-bending thriller",
    "releaseYear": 2010,
    "genre": "Sci-Fi",
    "directorId": "<director-id>"
  }'
```

Filter movies:

```bash
curl "http://localhost:3000/movies?genre=Sci-Fi&releaseYear=2010"
```

## Validation rules

| Field | Rule |
| --- | --- |
| `title` | Required, non-empty text |
| `description` | Optional, up to 255 characters |
| `releaseYear` | Required, integer between 1888 and the current year |
| `genre` | Required, non-empty text |
| `directorId` | Required, must belong to an existing director |
| Director `name` | Required, 3 to 50 characters, unique |

## Project structure

```
src/
├── app.ts            # Express app and dependency injection
├── index.ts          # Server entry point (runs migrations, then listens)
├── controllers/      # HTTP layer
├── services/         # Business rules
├── repositories/     # SQL queries
├── database/         # SQLite connection and migrations
├── middlewares/      # Validation and error handling
├── models/           # TypeScript types
├── routes/           # Route definitions
└── tests/            # Unit and end-to-end tests
```

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port |
| `DB_PATH` | `./database.sqlite` | SQLite file path (`:memory:` for an in-memory database) |

## Author

**Pablo Tosati**: backend developer (Node.js, TypeScript)
[GitHub](https://github.com/PabloTosati)
