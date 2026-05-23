# Movie Collection API

REST API para gerenciamento de filmes e diretores, desenvolvida com Node.js, Express e TypeScript.

## Funcionalidades

### Filmes (`/movies`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/movies` | Lista todos os filmes (filtros: `title`, `genre`, `releaseYear`) |
| GET | `/movies/:id` | Retorna um filme pelo ID |
| POST | `/movies` | Cria um novo filme |
| PUT | `/movies/:id` | Atualiza um filme completo |
| DELETE | `/movies/:id` | Remove um filme |

### Diretores (`/directors`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/directors` | Lista todos os diretores |
| GET | `/directors/:id` | Retorna um diretor pelo ID |
| GET | `/directors/:id/movies` | Retorna todos os filmes de um diretor |
| POST | `/directors` | Cria um novo diretor |
| PUT | `/directors/:id` | Atualiza o nome de um diretor |
| DELETE | `/directors/:id` | Remove um diretor (falha se tiver filmes vinculados) |

## Como instalar e executar

### Pré-requisitos
- Node.js 18+ instalado
- npm (vem junto com Node.js)

### Instalação

```bash
# Clone ou baixe o projeto
cd movie-api

# Instale as dependências
npm install

# Rode as migrations (cria as tabelas no banco)
npm run migrate

# Inicie em modo desenvolvimento
npm run dev
```

A API estará disponível em `http://localhost:3000`

### Executar testes

```bash
npm test
```

### Build para produção

```bash
npm run build
npm start
```

### Com Docker

```bash
docker-compose up
```

## Exemplos de uso

### Criar um diretor
```bash
curl -X POST http://localhost:3000/directors \
  -H "Content-Type: application/json" \
  -d '{"name": "Christopher Nolan"}'
```

### Criar um filme
```bash
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "description": "A mind-bending thriller",
    "releaseYear": 2010,
    "genre": "Sci-Fi",
    "directorId": "<id-do-diretor>"
  }'
```

### Filtrar filmes
```bash
curl "http://localhost:3000/movies?genre=Sci-Fi&releaseYear=2010"
```

## Tecnologias
- Node.js + TypeScript
- Express.js
- SQLite3
- Jest (testes unitários)
- Docker (bônus)
