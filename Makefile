.PHONY: up down setup logs logs-all test test-cov clean redis-cli db-push db-migrate help

# Default target
help: ## Show available commands
	@echo ""
	@echo "  Todo API - Available Commands"
	@echo "  ─────────────────────────────"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""

# ── Docker ────────────────────────────────────────────

up: ## Start all services (API + DB + Redis)
	docker compose up -d --build

down: ## Stop all services
	docker compose down

clean: ## Stop all services and remove volumes (fresh start)
	docker compose down -v

restart: down up ## Restart all services

# ── Setup ─────────────────────────────────────────────

setup: up ## First-time setup: start services + run DB migrations
	@echo "⏳ Waiting for services to be ready..."
	@sleep 10
	@docker exec todo-api-nest-api-1 npx prisma db push
	@echo "✅ Setup complete! API available at http://localhost:3002"

# ── Logs ──────────────────────────────────────────────

logs: ## Follow API container logs
	docker logs todo-api-nest-api-1 --tail 50 -f

logs-all: ## Follow all container logs
	docker compose logs -f --tail 50

# ── Database ──────────────────────────────────────────

db-push: ## Push Prisma schema to database (no migration history)
	docker exec todo-api-nest-api-1 npx prisma db push

db-migrate: ## Run Prisma migrations
	docker exec todo-api-nest-api-1 npx prisma migrate dev

db-studio: ## Open Prisma Studio (database GUI)
	pnpm exec prisma studio

# ── Redis ─────────────────────────────────────────────

redis-cli: ## Open Redis CLI inside the container
	docker exec -it todo-api-nest-redis-1 redis-cli

redis-flush: ## Flush all Redis cache
	docker exec todo-api-nest-redis-1 redis-cli FLUSHALL

# ── Testing ───────────────────────────────────────────

test: ## Run unit tests
	pnpm test

test-cov: ## Run tests with coverage report
	pnpm test:cov

test-watch: ## Run tests in watch mode
	pnpm test:watch

# ── Development ───────────────────────────────────────

dev: ## Run locally without Docker (requires local DB + Redis)
	pnpm run start:dev

lint: ## Run linter
	pnpm lint
