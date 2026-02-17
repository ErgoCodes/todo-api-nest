# Development Dockerfile
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies)
RUN pnpm install 

# Copy source code
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Expose application port
EXPOSE 3000

# Start in development mode with hot reload
CMD ["pnpm", "run", "start:dev"]
