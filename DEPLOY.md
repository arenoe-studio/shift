# Deployment Guide

## Frontend — Vercel
1. Connect GitHub repo to Vercel
2. Framework: Next.js (auto-detected)
3. Root directory: / (repo root)
4. Environment variable to set in Vercel dashboard:
   NEXT_PUBLIC_API_URL = https://api-shift.arenoe-studio.my.id
5. Custom domain: shift.arenoe-studio.my.id

## Backend — Coolify
1. New Resource → Docker → Dockerfile
2. Repository: github.com/arenoe-studio/shift
3. Branch: main
4. Docker build context: /backend
5. Dockerfile path: /backend/Dockerfile
6. Port: 8000
7. Environment variables to set in Coolify:
   DATABASE_URL = (NeonDB connection string)
   BMKG_WILAYAH_CODE = 32.14.03.2001
   FRONTEND_URL = https://shift.arenoe-studio.my.id
   PORT = 8000
8. Custom domain: api-shift.arenoe-studio.my.id
9. Health check path: /health

## Post-deployment checklist
- [ ] Verify https://shift.arenoe-studio.my.id loads
- [ ] Verify https://api-shift.arenoe-studio.my.id/health returns ok
- [ ] Verify https://api-shift.arenoe-studio.my.id/api/waduk/current returns data
- [ ] Verify BMKG fetch works (check is_cached: false)
- [ ] Verify NASA POWER fetch works from server (check is_fallback: false)

