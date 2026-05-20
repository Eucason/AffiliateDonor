# 🚀 Quick Start Guide

Get AffiliateDonor running in 5 minutes!

## ⚡ Fast Setup

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
go mod download
cd ..
```

### 2. Create Environment Files

**Frontend `.env`:**
```bash
# Copy example file
cp .env.example .env
```

Edit `.env` - minimum required:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:8080
```

**Backend `backend/.env`:**
```bash
cd backend
cp .env.example .env
cd ..
```

Edit `backend/.env` - minimum required:
```env
PORT=8080
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
go run main.go
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4. Open Browser

Navigate to: **http://localhost:3000**

## 🎯 What You'll See

✅ **Homepage** with 3D animated hero  
✅ **Browse Causes** - list of charitable organizations  
✅ **Shop & Donate** - affiliate products  
✅ **Merchandise** - official merch with cart  
✅ **Dashboard** - impact tracking  
✅ **Payment flows** - multiple payment methods including crypto  

## 🔧 Without External Services

The app works out-of-the-box with **mock data** even without:
- Supabase account
- Stripe account
- Payment processors

Just use placeholder values in `.env` files.

## 📝 Full Features Require

For **full functionality**, you'll need:

1. **Supabase** (free tier) - for auth & database
2. **Stripe** (test mode) - for payments
3. **PayPal Sandbox** (optional) - for PayPal payments
4. **Coinbase Commerce** (optional) - for crypto

See `SETUP_INSTRUCTIONS.md` for detailed setup.

## 🐛 Common Issues

### Port already in use
```bash
# Frontend will auto-increment (3001, 3002, etc.)
# For backend, change PORT in backend/.env
```

### Module not found
```bash
npm install
cd backend && go mod download
```

### CORS errors
Check `backend/.env`:
```env
ALLOWED_ORIGINS=http://localhost:3000
```

## 📚 Next Steps

1. ✅ Run the app (you're here!)
2. 📖 Read `SETUP_INSTRUCTIONS.md` for full setup
3. 🎨 Explore the codebase
4. 🚀 Deploy to production
5. 🤝 Contribute! See `CONTRIBUTING.md`

## 💡 Tips

- **Hot reload** is enabled - changes auto-refresh
- **Mock data** powers the app initially
- **API calls** work between frontend/backend
- **Payment flows** can be tested in UI (no actual charges)

## 🎉 You're Ready!

Start building features, customizing designs, or deploying to production!

Need help? Check:
- `README.md` - Full documentation
- `SETUP_INSTRUCTIONS.md` - Detailed setup
- `backend/README.md` - API documentation

Happy coding! 💖
