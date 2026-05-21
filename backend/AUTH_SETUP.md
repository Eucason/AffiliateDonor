# Backend Authentication Setup Guide

## Overview
The backend is now wired up with authentication middleware and Supabase integration. Follow these steps to complete the setup.

## Step 1: Add Environment Variables

Update your `.env` file in the `backend/` directory with:

```bash
# Supabase Configuration (get these from your Supabase project)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Configuration (from Supabase project settings)
SUPABASE_JWT_SECRET=your_jwt_secret_here

# Server Configuration
PORT=8080

# Existing vars (if any)
STRIPE_SECRET_KEY=your_stripe_key
```

### How to Get Supabase Credentials:
1. Go to your Supabase project at https://app.supabase.com
2. Click "Settings" → "API"
3. Copy:
   - `URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`
4. Click "Settings" → "Auth" → Copy the JWT secret

## Step 2: Run Database Migrations

Run the migration to create the users table and related tables:

### Option A: Using Supabase CLI
```bash
# From backend directory
supabase db push
```

### Option B: Using SQL Editor in Supabase Dashboard
1. Go to your Supabase project
2. Click "SQL Editor"
3. Click "New Query"
4. Copy the contents of `backend/migrations/001_create_users_table.sql`
5. Paste and run

### Option C: Using psql (if you have PostgreSQL installed)
```bash
psql -h your-supabase-host -U postgres -d postgres -f backend/migrations/001_create_users_table.sql
```

## Step 3: Verify Database Tables

After running migrations, verify these tables exist in your Supabase project:
- `users`
- `donations`
- `purchases`
- `user_preferences`
- `user_impact`

Check by going to Supabase Dashboard → Database → Tables

## Step 4: Install Go Dependencies

If you haven't already, install the required Go packages:

```bash
cd backend

# Install JWT library
go get github.com/golang-jwt/jwt/v5

# Update module
go mod tidy
```

## Step 5: Update Route Protection (Optional)

Currently, all `/api/users/*` routes require authentication. You can make some routes optional by using `middleware.OptionalAuthMiddleware()` if needed.

Example for public donations endpoint:
```go
donations := rg.Group("/donations")
{
    donations.Use(middleware.OptionalAuthMiddleware())
    donations.GET("", handlers.GetDonations)
}
```

## Step 6: Test Authentication Flow

### Test 1: Create a New User (Sign Up)
1. Open frontend at `http://localhost:3000`
2. Click "Sign In" button
3. Click "Sign up" to go to signup form
4. Enter email, password, confirm password
5. Click "Create Account"
6. Check Supabase: Database → `users` table - new user should appear

### Test 2: Authenticate with Backend
```bash
# Get your user's access token from browser console:
# Open DevTools → Console
# Run: localStorage.getItem('sb-jwt')

# Use the token to call protected endpoint:
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     http://localhost:8080/api/users/me
```

Expected response:
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "",
  "profile_image": "",
  "total_donations": 0,
  "total_purchases": 0,
  "causes_supported": 0,
  "impact_score": 0,
  "created_at": "2026-05-21T...",
  "updated_at": "2026-05-21T..."
}
```

### Test 3: Update User Profile
```bash
curl -X PUT -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "profile_image": "https://..."}' \
     http://localhost:8080/api/users/me
```

## Authentication Flow Explained

### Frontend Flow:
1. User enters email/password or clicks "Sign with Google"
2. Supabase handles authentication and issues JWT token
3. Token stored in browser's `localStorage` (handled by `@supabase/supabase-js`)
4. Token automatically added to `Authorization: Bearer {token}` header

### Backend Flow:
1. Request comes in with `Authorization` header
2. `AuthMiddleware` validates the token format
3. User ID extracted from token and stored in Gin context
4. Handler retrieves user from Supabase database or creates new profile
5. Returns user data or updates profile

### Database Flow:
1. On first login, `GetOrCreateUserProfile` creates new user record
2. Subsequent requests retrieve existing profile
3. User data synced between Supabase Auth and Users table

## Troubleshooting

### Issue: "missing authorization header" error
**Solution**: Make sure you're including the JWT token in requests:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/users/me
```

### Issue: "failed to initialize Supabase client"
**Solution**: Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set correctly:
```bash
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

### Issue: "user not found" when calling /users/me
**Solution**: Check that migration ran successfully and `users` table exists:
- Go to Supabase Dashboard → Database → Tables
- Verify `users` table is present with correct schema

### Issue: Frontend can't create user
**Solution**: Verify Supabase Auth is enabled:
1. Go to Supabase Dashboard
2. Click "Authentication" → "Providers"
3. Verify "Email" provider is enabled
4. Check that sign-up is allowed in "Settings"

## Next Steps

1. **Email Verification**: Add email verification flow
2. **Password Reset**: Implement forgot password endpoint
3. **User Roles/Permissions**: Add admin role support
4. **Audit Logging**: Track user actions
5. **Two-Factor Authentication**: Add 2FA support

## Useful Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Go Client](https://github.com/supabase-community/supabase-go)
- [JWT Best Practices](https://auth0.com/blog/oauth-2-0-best-practices/)
- [Gin Framework Documentation](https://gin-gonic.com/)
