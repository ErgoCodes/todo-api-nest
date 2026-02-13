# Production Ready Roadmap for Todo API

Este documento describe el plan de acción para llevar el repositorio `todo-api-nest` a un estado de **MVP listo para producción**.

## 1. Seguridad (Prioridad: CRÍTICA)

- [x] **Hashing de Contraseñas**:
  - Reemplazar el almacenamiento de contraseñas en texto plano.
  - Implementar `bcrypt` o `argon2` en `AuthService` y `UserService`.
- [x] **Protección HTTP**:
  - Instalar y configurar `helmet` para establecer cabeceras de seguridad HTTP seguras.
- [x] **CORS (Cross-Origin Resource Sharing)**:
  - Habilitar y configurar CORS estrictamente en `main.ts` para permitir solo orígenes confiables.
- [x] **Rate Limiting**:
  - Implementar `@nestjs/throttler` proteger contra ataques de fuerza bruta y DDoS.
- [ ] **Validación de Datos**:
  - Asegurar que `class-validator` y `class-transformer` estén correctamente configurados globalmente (ya iniciado en `main.ts`, revisar cobertura).

## 2. Manejo de Errores y Logging

- [x] **Filtros de Excepción Globales**:
  - Crear un `AllExceptionsFilter` para estandarizar las respuestas de error (JSON estructurado).
  - Mapear errores de Prisma (P2002, P2025) a códigos HTTP correctos (409 Conflict, 404 Not Found).
- [x] **Manejo de 404**:
  - Asegurar que `findById` y métodos similares lancen excepciones `NotFoundException` en lugar de devolver `null` o `200 OK` vacío.
- [ ] **Logging**:
  - Implementar un logger estructurado (ej. `winston` o `pino`) en lugar de `console.log`.

## 3. Documentación

- [x] **OpenAPI / Swagger**:
  - Integrar `@nestjs/swagger`.
  - Decorar los DTOs y Controladores con `@ApiProperty`, `@ApiOperation`, `@ApiResponse`.
  - Habilitar la ruta `/api/docs`.

## 4. Testing

- [ ] **Unit Tests**:
  - Crear pruebas unitarias para `AuthService`, `TodoService`, `UserService`.
  - Mockear repositorios y dependencias externas.
- [ ] **Integration Tests**:
  - Expandir los tests e2e para cubrir flujos críticos (Registro -> Login -> Crear Todo -> Listar).

## 5. DevOps y Configuración

- [x] **Docker**:
  - Crear `Dockerfile` optimizado para producción (multi-stage build).
  - Crear `docker-compose.yml` para levantar la API y la Base de Datos localmente.
- [x] **Variables de Entorno**:
  - Validar variables de entorno al inicio usando `joi` o `class-validator` (asegurar que DB_URL, JWT_SECRET, etc., existan).
  - Crear `.env.example`.
- [ ] **CI/CD (Futuro)**:
  - Definir pipelines básicos (GitHub Actions) para correr linter y tests en cada PR.

## 6. Calidad de Código y Refactorización

- [x] **Tipado Estricto**:
  - Eliminar el uso de `any` (especialmente en `@Req() req: any`).
  - Crear decorador `@User()` para extraer el usuario del request de forma segura.
- [x] **Limpieza**:
  - Corregir typos (ej. `singIn` -> `signIn`).
  - Remover código muerto o comentado.
