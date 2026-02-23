# Todo API - NestJS

A robust and scalable API built with NestJS, Prisma, and PostgreSQL, designed to be a production-ready MVP.

## 🚀 Features

- **JWT Authentication**: Register, login, and protected profile management.
- **Security**: Hashing with `Argon2`, security headers with `Helmet`, CORS protection, and Throttling (Rate Limiting).
- **Database**: PostgreSQL with Prisma ORM.
- **Caching**: Redis with `ioredis` for high-performance caching.
- **Strict Validation**: DTO validation with `class-validator` and configuration validation with `Joi`.
- **Documentation**: Integrated interactive Swagger/OpenAPI.
- **Dockerized**: Development-ready Docker Compose with hot reload.
- **Testing**: Robust unit test coverage for Services and Controllers.

---

## 🛠️ Technologies

- [NestJS](https://nestjs.com/) (v11)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/)
- [Jest](https://jestjs.io/)
- [Swagger](https://swagger.io/)

---

## 📋 Prerequisites

- **Node.js**: v22 or higher.
- **pnpm**: Recommended for package management.
- **Docker & Docker Compose**: To quickly spin up the full environment.

---

## ⚙️ Quick Start Guide

### 1. Clone and Install

```bash
git clone <repo-url>
cd todo-api-nest
pnpm install
```

### 2. Configure Environment

Copy the example file and configure your variables.

```bash
cp .env.example .env
```

| Variable       | Description                  | Default                  |
| -------------- | ---------------------------- | ------------------------ |
| `PORT`         | Application port             | `3000`                   |
| `DATABASE_URL` | PostgreSQL connection string | Required                 |
| `JWT_SECRET`   | JWT signing secret           | Required                 |
| `REDIS_URL`    | Redis connection string      | `redis://localhost:6379` |

### 3. Run with Docker (Recommended)

The easiest way — one command to start API + PostgreSQL + Redis with hot reload and run DB migrations:

```bash
make setup
```

Or if you prefer manual control:

```bash
docker compose up -d --build
docker exec todo-api-nest-api-1 npx prisma db push
```

The API will be available at `http://localhost:3002`.

### 4. Run Locally (Without Docker)

If you prefer running without Docker, make sure PostgreSQL and Redis are available locally:

```bash
make dev
```

Or manually:

```bash
pnpm exec prisma migrate dev
pnpm run start:dev
```

---

## 🔧 Make Commands

Run `make help` to see all available commands. Here's a summary:

| Command            | Description                                       |
| ------------------ | ------------------------------------------------- |
| `make setup`       | First-time setup: start services + run migrations |
| `make up`          | Start all services (API + DB + Redis)             |
| `make down`        | Stop all services                                 |
| `make restart`     | Restart all services                              |
| `make clean`       | Stop services and remove volumes (fresh start)    |
| `make logs`        | Follow API container logs                         |
| `make logs-all`    | Follow all container logs                         |
| `make db-push`     | Push Prisma schema to database                    |
| `make db-migrate`  | Run Prisma migrations                             |
| `make db-studio`   | Open Prisma Studio (database GUI)                 |
| `make redis-cli`   | Open Redis CLI inside the container               |
| `make redis-flush` | Flush all Redis cache                             |
| `make test`        | Run unit tests                                    |
| `make test-cov`    | Run tests with coverage report                    |
| `make lint`        | Run linter                                        |

---

## 📖 API Documentation (Swagger)

Once the application is running, access the interactive documentation at:

👉 [http://localhost:3002/api/docs](http://localhost:3002/api/docs)

Here you can test all Authentication, User, and Todo endpoints.

---

## 🧪 Testing

We have prioritized robust unit tests that isolate business logic and controllers:

```bash
make test

# Or with coverage
make test-cov
```

---

## 🛣️ Roadmap

Check the [ROADMAP.md](./ROADMAP.md) file to see project progress and pending tasks.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
