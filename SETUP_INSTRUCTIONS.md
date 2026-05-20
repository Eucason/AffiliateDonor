# Complete Setup Instructions for AffiliateDonor

This guide will walk you through setting up the entire AffiliateDonor platform from scratch.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed
- [ ] Go 1.21+ installed (`go version`)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/command line access

## 🔧 Step 1: Clone & Install

### Frontend Setup

```bash
# Navigate to project directory
cd c:\MASTER\AffiliateDonations

# Install all frontend dependencies
npm install

# This installs:
# - React, React Router, React Query
# - Framer Motion, Three.js
# - TailwindCSS, Lucide Icons
# - Stripe, Supabase clients
# - And more...
```

### Backend Setup

```bash
# Navigate to backend
cd backend

# Download Go dependencies
go mod download

# This installs:
# - Gin web framework
# - Gorilla WebSocket
# - Stripe Go SDK
# - Supabase Go client
```

## 🌐 Step 2: Create External Accounts

### Supabase Setup (Required)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization
4. Create a new project:
   - Name: `affiliatedonor`
   - Database password: (save this!)
   - Region: Choose closest to your users
5. Wait for project to initialize (~2 minutes)

6. Get your credentials:
   - Go to Settings → API
   - Copy `Project URL` (starts with https://)
   - Copy `anon/public` key
   - Copy `service_role` key (for backend)

7. Create database tables:
   - Go to SQL Editor
   - Run this schema:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  total_donations DECIMAL DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  causes_supported INTEGER DEFAULT 0,
  impact_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Causes table
CREATE TABLE public.causes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image TEXT,
  goal DECIMAL NOT NULL,
  raised DECIMAL DEFAULT 0,
  supporters INTEGER DEFAULT 0,
  location TEXT,
  start_date TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  cause_id UUID REFERENCES public.causes,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  method TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  tx_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT,
  price DECIMAL NOT NULL,
  image TEXT,
  category TEXT,
  affiliate_link TEXT NOT NULL,
  cause_id UUID REFERENCES public.causes,
  donation_percent DECIMAL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.causes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies (allow read for all, write for authenticated)
CREATE POLICY "Public read access" ON public.causes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view own donations" ON public.donations FOR SELECT USING (auth.uid() = user_id);
```

### Stripe Setup (Required for Payments)

1. Go to [stripe.com](https://stripe.com)
2. Click "Sign up" → Create account
3. Complete verification (can use test mode initially)
4. Go to Developers → API keys
5. Copy:
   - `Publishable key` (starts with pk_test_)
   - `Secret key` (starts with sk_test_)
6. Go to Developers → Webhooks
7. Add endpoint: `https://your-backend-url.com/api/payments/stripe/webhook`
8. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
9. Copy webhook signing secret (starts with whsec_)

### PayPal Setup (Optional)

1. Go to [developer.paypal.com](https://developer.paypal.com)
2. Log in or create account
3. Go to Dashboard → My Apps & Credentials
4. Create new app in Sandbox
5. Copy Client ID and Secret

### Coinbase Commerce (Optional - for Crypto)

1. Go to [commerce.coinbase.com](https://commerce.coinbase.com)
2. Sign up for Coinbase Commerce
3. Go to Settings → API Keys
4. Create new API key
5. Copy API key

## 🔑 Step 3: Configure Environment Variables

### Frontend (.env)

Create `c:\MASTER\AffiliateDonations\.env`:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx

# Backend API
VITE_API_URL=http://localhost:8080

# PayPal (optional)
VITE_PAYPAL_CLIENT_ID=xxxxx

# Coinbase (optional)
VITE_COINBASE_API_KEY=xxxxx
```

### Backend (.env)

Create `c:\MASTER\AffiliateDonations\backend\.env`:

```env
# Server
PORT=8080
GIN_MODE=debug

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...your_service_key

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# PayPal (optional)
PAYPAL_CLIENT_ID=xxxxx
PAYPAL_CLIENT_SECRET=xxxxx

# Coinbase (optional)
COINBASE_API_KEY=xxxxx

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 🚀 Step 4: Run the Application

### Terminal 1 - Backend

```bash
cd c:\MASTER\AffiliateDonations\backend
go run main.go
```

Expected output:
```
Server starting on port 8080
```

### Terminal 2 - Frontend

```bash
cd c:\MASTER\AffiliateDonations
npm run dev
```

Expected output:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Open Browser

Navigate to: `http://localhost:3000`

You should see the AffiliateDonor homepage with animated hero!

## ✅ Step 5: Verify Everything Works

### Test Checklist:

- [ ] Homepage loads with 3D animation
- [ ] Navigate to "Browse Causes" - causes display
- [ ] Navigate to "Shop & Donate" - products show
- [ ] Navigate to "Merchandise" - merch items visible
- [ ] Click "Add to Cart" - cart modal opens
- [ ] Cart shows items and total
- [ ] Click "Proceed to Checkout" - payment modal opens
- [ ] Select payment method - appropriate form shows
- [ ] Click "Cryptocurrency" - crypto modal with QR codes
- [ ] Check browser console - no errors
- [ ] Backend logs show API requests

## 🐛 Troubleshooting

### Frontend won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend errors

```bash
# Make sure Go modules are downloaded
cd backend
go mod tidy
go mod download
```

### "Module not found" errors

```bash
# Install missing dependencies
npm install @stripe/stripe-js @supabase/supabase-js
```

### Port already in use

```bash
# Change port in .env
# Frontend: Vite will auto-increment
# Backend: Change PORT=8081 in backend/.env
```

### CORS errors

Make sure backend `.env` has:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 📦 Step 6: Build for Production

### Frontend Build

```bash
npm run build
```

Creates optimized bundle in `dist/` folder.

### Backend Build

```bash
cd backend
go build -o affiliatedonor-api .
```

Creates `affiliatedonor-api` executable.

## 🌍 Step 7: Deploy to Production

### Frontend → Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Add environment variables in Vercel dashboard.

### Backend → Render (Recommended)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. New Web Service → Connect repo
4. Build: `go build -o main .`
5. Start: `./main`
6. Add environment variables
7. Deploy!

Update frontend `.env`:
```env
VITE_API_URL=https://your-backend.onrender.com
```

## 🎉 You're Done!

Your AffiliateDonor platform is now running!

### Next Steps:

1. Populate database with real causes
2. Add affiliate partnerships
3. Set up payment webhooks in production
4. Enable Stripe production mode
5. Add Google Analytics
6. Configure custom domain
7. Enable HTTPS
8. Set up monitoring

### Need Help?

- Check `README.md` for more details
- Review code comments
- Search GitHub issues
- Contact: support@affiliatedonor.com

Happy coding! 🚀💖
