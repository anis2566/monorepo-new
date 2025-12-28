# Quick Deployment Reference

## 🚀 Deploy to Coolify (or similar platforms)

### Required Build Arguments

```
DATABASE_URL=postgresql://user:password@host:5432/database
```

### Required Environment Variables (Runtime)

```
DATABASE_URL=postgresql://user:password@host:5432/database
NODE_ENV=production
PORT=3000
```

### Pre-Deployment Steps

1. **Run migrations first!**

   ```bash
   # Option 1: Locally
   export DATABASE_URL="your_production_db_url"
   cd packages/database
   pnpm run db:deploy

   # Option 2: In temporary container
   docker build --build-arg DATABASE_URL="your_db_url" --target builder -t migrations .
   docker run --rm -e DATABASE_URL="your_db_url" migrations pnpm --filter=@workspace/db run db:deploy
   ```

2. **Push your changes to Git**

   ```bash
   git add .
   git commit -m "Updated Docker configuration for database package"
   git push
   ```

3. **Configure Coolify**
   - Set `DATABASE_URL` in Build Arguments
   - Set `DATABASE_URL` in Environment Variables
   - Ensure port 3000 is exposed
   - Deploy!

## 📦 What's Included

### Build Process

1. ✅ Installs all dependencies (including UI package deps)
2. ✅ Generates Prisma Client
3. ✅ Builds Next.js app with standalone output
4. ✅ Creates minimal production image (~150-250MB)

### Production Image Contains

- Next.js standalone server
- Static assets
- Public files
- Prisma generated client
- **NO** node_modules (bundled in standalone)
- **NO** build tools

## 🔍 Troubleshooting

### Build fails with "Can't resolve 'tailwindcss'"

- ✅ **Fixed!** All package.json files are now copied

### Build fails with "Prisma Client not found"

- Ensure `DATABASE_URL` is set as build argument
- Check that the database is accessible during build

### Container fails to start

- Check that `DATABASE_URL` is set as environment variable
- Ensure migrations have been run
- Check container logs: `docker logs <container-name>`

### "Module not found" errors

- ✅ **Fixed!** Standalone build bundles all dependencies

## 📊 Image Size Comparison

| Configuration           | Size         | Status         |
| ----------------------- | ------------ | -------------- |
| Old (with node_modules) | ~800MB-1.2GB | ❌ Inefficient |
| New (standalone)        | ~150MB-250MB | ✅ Optimized   |

## 🔐 Security Features

- ✅ Runs as non-root user (`nextjs`)
- ✅ Minimal attack surface (only necessary files)
- ✅ No build tools in production image
- ✅ Proper file permissions

## 📝 Quick Commands

```bash
# Local build
docker build --build-arg DATABASE_URL="postgresql://..." -t app .

# Local run
docker run -p 3000:3000 -e DATABASE_URL="postgresql://..." app

# Docker Compose (includes PostgreSQL)
docker-compose up -d

# View logs
docker logs -f <container-name>

# Run migrations
docker run --rm -e DATABASE_URL="..." app pnpm --filter=@workspace/db run db:deploy
```

## ✅ Deployment Checklist

- [ ] Database is accessible from build environment
- [ ] `DATABASE_URL` set as build argument
- [ ] `DATABASE_URL` set as runtime environment variable
- [ ] Migrations have been run
- [ ] Git changes pushed
- [ ] Port 3000 is exposed
- [ ] Health checks configured (optional)
- [ ] Logs are being collected (optional)

## 🎯 Expected Build Output

```
✓ Prisma Client generated successfully
✓ Next.js build completed
✓ Standalone output created
✓ Production image built (~150-250MB)
```

## 🆘 Need Help?

See `DOCKER.md` for comprehensive documentation including:

- Detailed build instructions
- Migration strategies
- Production deployment guide
- Architecture explanation
