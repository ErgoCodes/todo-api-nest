# Todo API - NestJS

A robust and scalable API built with NestJS, Prisma, and PostgreSQL, designed to be a production-ready MVP.

## 🚀 Features

- **JWT Authentication**: Register, login, and protected profile management.
- **Security**: Hashing with `Argon2`, security headers with `Helmet`, CORS protection, and Throttling (Rate Limiting).
- **Database**: PostgreSQL with Prisma ORM.
- **Strict Validation**: DTO validation with `class-validator` and configuration validation with `Joi`.
- **Documentation**: Integrated interactive Swagger/OpenAPI.
- **Dockerized**: Container support with Multi-stage builds.
- **Testing**: Robust unit test coverage for Services and Controllers.

---

## 🛠️ Technologies

- [NestJS](https://nestjs.com/) (v11)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Jest](https://jestjs.io/)
- [Swagger](https://swagger.io/)

---

## 📋 Prerequisites

- **Node.js**: v22 or higher.
- **pnpm**: Recommended for package management.
- **Docker & Docker Compose**: To quickly spin up the database environment.

---

## ⚙️ Quick Start Guide

### 1. Clone and Install

```bash
git clone <repo-url>
cd todo-api-nest
pnpm install
```

### 2. Configure Environment

Copy the example file and configure your `JWT_SECRET` and `DATABASE_URL`.

```bash
cp .env.example .env
```

### 3. Spin up the Database

If you have Docker installed, you can spin up a PostgreSQL instance ready to use:

```bash
docker-compose up -d db
```

### 4. Initialize Prisma

Generate the client and run migrations to create tables:

```bash
pnpm exec prisma migrate dev
```

### 5. Run the Application

```bash
# Development mode with hot reload
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

---

## 🐳 Usage with Docker

If you prefer to run the entire stack (API + DB) in containers:

```bash
docker-compose up --build
```

The API will be available at `http://localhost:3000` (or the configured port).

---

## 📖 API Documentation (Swagger)

Once the application is running, you can access the interactive documentation at:

👉 [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

Here you can test all Authentication, User, and Todo endpoints.

---

## 🧪 Testing

We have prioritized robust unit tests that isolate business logic and controllers:

```bash
# Run all unit tests
pnpm run test

# View test coverage
pnpm run test:cov
```

---

## 🛣️ Roadmap

Check the [ROADMAP.md](./ROADMAP.md) file to see project progress and pending tasks (Logging, CI/CD, etc.).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
