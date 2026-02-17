# Production Ready Roadmap for Todo API

This document describes the action plan to bring the `todo-api-nest` repository to an **MVP state ready for production**.

## 1. Security (Priority: CRITICAL)

- [x] **Password Hashing**:
  - Replace plain text password storage.
  - Implement `bcrypt` or `argon2` in `AuthService` and `UserService`.
- [x] **HTTP Protection**:
  - Install and configure `helmet` to set secure HTTP security headers.
- [x] **CORS (Cross-Origin Resource Sharing)**:
  - Enable and strictly configure CORS in `main.ts` to allow only trusted origins.
- [x] **Rate Limiting**:
  - Implement `@nestjs/throttler` to protect against brute force and DDoS attacks.
- [x] **Data Validation**:
  - Ensure `class-validator` and `class-transformer` are correctly configured globally (configured in `main.ts` and decorated in DTOs).

## 2. Error Handling and Logging

- [x] **Global Exception Filters**:
  - Create an `AllExceptionsFilter` to standardize error responses (structured JSON).
  - Map Prisma errors (P2002, P2025) to correct HTTP codes (409 Conflict, 404 Not Found).
- [x] **404 Handling**:
  - Ensure `findById` and similar methods throw `NotFoundException` instead of returning `null` or an empty `200 OK`.
- [ ] **Logging**:
  - Implement a structured logger (e.g., `winston` or `pino`) instead of `console.log`.

## 3. Documentation

- [x] **OpenAPI / Swagger**:
  - Integrate `@nestjs/swagger`.
  - Decorate DTOs and Controllers with `@ApiProperty`, `@ApiOperation`, `@ApiResponse`.
  - Enable the `/api/docs` route.

## 4. Testing

- [x] **Unit Tests**:
  - Create unit tests for `AuthService`, `TodoService`, `UserService` and their controllers.
  - Mock repositories and external dependencies.
- [x] **Integration Tests**:
  - _Removed by user request to prioritize robust unit tests._

## 5. DevOps and Configuration

- [x] **Docker**:
  - Create optimized `Dockerfile` for production (multi-stage build).
  - Create `docker-compose.yml` to spin up the API and Database locally.
- [x] **Environment Variables**:
  - Validate environment variables at startup using `joi` or `class-validator` (ensure DB_URL, JWT_SECRET, etc., exist).
  - Create `.env.example`.
- [ ] **CI/CD (Future)**:
  - Define basic pipelines (GitHub Actions) to run linter and tests on each PR.

## 6. Code Quality and Refactoring

- [x] **Strict Typing**:
  - Eliminate the use of `any` (especially in `@Req() req: any`).
  - Create `@User()` decorator to safely extract the user from the request.
- [x] **Cleanup**:
  - Correct typos (e.g., `singIn` -> `signIn`).
  - Remove dead or commented-out code.
