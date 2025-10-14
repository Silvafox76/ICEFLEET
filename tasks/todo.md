# Render Health Check Failure - ICE FLEET

## Problem
Health check endpoint `/api/health` is failing with "service unavailable" on Render deployment.
The app keeps retrying but health check never passes.

## Root Cause Analysis ✓

**FOUND THE BUG!**

The standalone build creates this structure:
```
.next/standalone/
  app/
    server.js     <-- The actual server
    .next/
    node_modules/
```

But in the Dockerfile, we copy from builder to runner:
```dockerfile
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
```

This copies the standalone directory content to `/app`, creating:
```
/app/
  app/
    server.js     <-- Server is HERE
```

But start.sh tries to run:
```bash
node server.js    <-- Looking in /app/ (WRONG!)
```

**The Fix:**
Change start.sh to run: `node app/server.js` (correct path)

## Solutions Applied ✓

### Fix 1: Correct server.js path in start.sh
**Changed start.sh line 9:**
```bash
# Before:
exec node server.js

# After:
exec node app/server.js
```

The standalone build nests everything in an `app/` directory, so we must run `node app/server.js`.

### Fix 2: Update migration lock file provider
**Changed app/prisma/migrations/migration_lock.toml:**
```toml
# Before:
provider = "sqlite"

# After:
provider = "postgresql"
```

This was causing P3019 error: "datasource provider `postgresql` does not match migration_lock.toml `sqlite`"

### Fix 3: Fix start.sh line endings
**Issue:** File had CRLF (Windows) line endings, causing Docker to fail with `./start.sh: not found`
**Fix:** Converted to LF (Unix) line endings using dos2unix

## Summary of Changes

**Files Modified:**
1. `start.sh` - Fixed server path and line endings
2. `app/prisma/migrations/migration_lock.toml` - Changed provider from sqlite to postgresql

**What These Fixes Resolve:**
- ✅ Server will start correctly (was looking for server.js in wrong directory)
- ✅ Migrations will run successfully (provider mismatch fixed)
- ✅ Docker can execute start.sh (line endings fixed)

**Ready to Deploy:**
All issues identified and fixed. Next step: commit and push to trigger Render deployment.
