# Docker Deployment Guide

This guide explains how to build and deploy the monorepo application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier orchestration)

## Building the Docker Image

### Option 1: Using Docker Compose (Recommended)

The easiest way to run the application with a PostgreSQL database:

```bash
# Start all services (database + web app)
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This deletes database data)
docker-compose down -v
```

### Option 2: Using Docker Build Directly

If you want to build the image manually:

```bash
# Build the image with DATABASE_URL as build argument
docker build \
  --build-arg DATABASE_URL="your_database_url_here" \
  -t monorepo-web:latest \
  .

# Run the container
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="your_database_url_here" \
  --name monorepo-web \
  monorepo-web:latest
```

## Important Notes

### Database URL

The `DATABASE_URL` is required in **two places**:

1. **Build time** (as `--build-arg`): Required for Prisma to generate the client
2. **Runtime** (as `-e` environment variable): Required for the app to connect to the database

### Running Migrations

Before running the application for the first time, you need to run database migrations.

**IMPORTANT**: Migrations should be run **before** starting the application containers.

#### Option 1: Run migrations locally before deployment

```bash
# Set your DATABASE_URL
export DATABASE_URL="your_production_database_url"

# Run migrations
cd packages/database
pnpm run db:deploy
```

#### Option 2: Run migrations in a temporary container

```bash
# Build a temporary image for migrations
docker build \
  --build-arg DATABASE_URL="your_database_url" \
  --target builder \
  -t monorepo-migrations \
  .

# Run migrations
docker run --rm \
  -e DATABASE_URL="your_database_url" \
  monorepo-migrations \
  pnpm --filter=@workspace/db run db:deploy
```

#### Option 3: Using docker-compose

```bash
# Start only the database
docker-compose up -d postgres

# Wait for database to be ready, then run migrations
docker-compose run --rm web pnpm --filter=@workspace/db run db:deploy

# Start all services
docker-compose up -d
```

### Environment Variables

For production deployments, you should set these environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Set to `production`
- Any other app-specific environment variables

Example `.env.production`:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
NODE_ENV=production
```

## Troubleshooting

### Prisma Client Not Generated

If you see errors about missing Prisma client:

1. Ensure `DATABASE_URL` is passed as a build argument
2. Check that the database package is being built correctly
3. Verify the Prisma schema is valid

### Database Connection Issues

1. Ensure the database is accessible from the container
2. Check that the `DATABASE_URL` is correct
3. Verify network connectivity between containers (if using docker-compose)

### Build Cache Issues

If you're experiencing stale builds:

```bash
# Clear Docker build cache
docker builder prune -a

# Rebuild without cache
docker-compose build --no-cache
```

## Production Deployment

For production deployments, consider:

1. Using a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
2. Setting up proper secrets management
3. Implementing health checks
4. Using a reverse proxy (nginx, Traefik)
5. Setting up SSL/TLS certificates
6. Implementing proper logging and monitoring

## Multi-stage Build Benefits

The Dockerfile uses a multi-stage build with Next.js standalone output which:

- **Minimal Image Size**: Uses Next.js standalone output which includes only necessary files
- **No Node Modules**: The standalone build bundles dependencies, eliminating the need for `node_modules` in production
- **Fast Startup**: Reduced image size means faster container startup times
- **Security**: Runs as non-root user (`nextjs`) for improved security
- **Optimized Caching**: Layer caching ensures faster rebuilds when only code changes
- **Monorepo Support**: Properly handles workspace dependencies including `@workspace/ui` and `@workspace/db`

## Architecture

### Builder Stage

1. Copies all `package.json` files for optimal caching
2. Installs all dependencies (including devDependencies needed for build)
3. Generates Prisma Client
4. Builds Next.js app with standalone output

### Runner Stage

1. Creates non-root user for security
2. Copies only the standalone output (minimal footprint)
3. Copies static assets and public files
4. Copies Prisma generated client
5. Runs the application as non-root user

### Image Size Comparison

- **Without standalone**: ~800MB - 1.2GB (includes all node_modules)
- **With standalone**: ~150MB - 250MB (only necessary files)
