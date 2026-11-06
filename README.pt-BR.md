# Movie Collection API

API REST para gerenciar uma coleção de filmes e seus diretores, feita com Node.js, Express e TypeScript.

🇺🇸 [Read in English](README.md)

## Destaques

- **Arquitetura em camadas**: rotas → controllers → services → repositories, com injeção de dependências
- **Regras de negócio**: nome de diretor único (sem diferenciar maiúsculas), diretor com filmes não pode ser removido, validação do ano de lançamento
- **Filtros**: busca de filmes por título, gênero e ano
- **50 testes automatizados** (unitários + de ponta a ponta com banco em memória), **~93% de cobertura**
- **Docker** pronto, com o banco salvo em um volume persistente
- **Erros seguros**: erros inesperados ficam no log do servidor e não são expostos ao cliente

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Linguagem | TypeScript |
| Framework HTTP | Express |
| Banco de dados | SQLite |
| Testes | Jest + Supertest |
| Contêineres | Docker + Docker Compose |
| CI | GitHub Actions |

## Como executar

Pré-requisito: Node.js 18+.

```bash
git clone https://github.com/PabloTosati/movie-api.git
cd movie-api
npm install
npm run dev
```

A API fica disponível em `http://localhost:3000`. As tabelas são criadas automaticamente na inicialização.

### Com Docker

```bash
docker compose up --build
```

O banco SQLite fica no volume `db_data`, então os dados continuam salvos quando o contêiner reinicia.

### Testes

```bash
npm test               # roda todos os testes
npm run test:coverage  # com relatório de cobertura
```

Os testes de ponta a ponta usam um banco SQLite em memória e nunca mexem nos seus dados locais.

## Endpoints

### Filmes (`/movies`)

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/movies` | Lista filmes (filtros: `title`, `genre`, `releaseYear`) |
| GET | `/movies/:id` | Retorna um filme pelo ID |
| POST | `/movies` | Cria um filme |
| PUT | `/movies/:id` | Atualiza um filme |
| DELETE | `/movies/:id` | Remove um filme |

### Diretores (`/directors`)

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/directors` | Lista diretores |
| GET | `/directors/:id` | Retorna um diretor pelo ID |
| GET | `/directors/:id/movies` | Lista os filmes de um diretor |
| POST | `/directors` | Cria um diretor |
| PUT | `/directors/:id` | Renomeia um diretor |
| DELETE | `/directors/:id` | Remove um diretor (falha se ele tiver filmes) |

## Exemplos

Criar um diretor:

```bash
curl -X POST http://localhost:3000/directors \
  -H "Content-Type: application/json" \
  -d '{"name": "Christopher Nolan"}'
```

Criar um filme:

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

Filtrar filmes:

```bash
curl "http://localhost:3000/movies?genre=Sci-Fi&releaseYear=2010"
```

## Configuração

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `PORT` | `3000` | Porta HTTP |
| `DB_PATH` | `./database.sqlite` | Caminho do arquivo SQLite (`:memory:` para banco em memória) |

## Autor

**Pablo Tosati**: desenvolvedor backend (Node.js, TypeScript)
[GitHub](https://github.com/PabloTosati)
