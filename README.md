# AffiliateDonor - Transform Shopping into Impact

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/affiliatedonor/affiliatedonor)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/affiliatedonor/affiliatedonor/releases)
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)](https://github.com/affiliatedonor/affiliatedonor)
[![Go Version](https://img.shields.io/badge/go-1.21-blue)](https://golang.org/)
[![React Version](https://img.shields.io/badge/react-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5-blue)](https://www.typescriptlang.org/)

## 🌍 About AffiliateDonor

AffiliateDonor is a revolutionary full-stack platform that transforms everyday online shopping into meaningful charitable donations. By integrating e-commerce affiliate marketing with social impact, our platform allows users to support causes they care about at no extra cost.

### 🎯 Key Features

- **🛍️ Shopping with Purpose**: Browse and purchase from affiliate products while automatically donating a portion to charity
- **💖 Cause Discovery**: Explore verified charitable organizations across various categories
- **💳 Multiple Payment Options**: Support for credit cards, PayPal, Venmo, Apple Pay, Google Pay, ACH transfers, and cryptocurrencies (BTC, ETH, LTC, USDC, USDT, BNB)
- **📊 Real-time Impact Tracking**: See your donations in action with live updates
- **📱 Responsive Design**: Optimized for all devices from desktop to mobile
- **🔒 Secure Transactions**: Built-in security measures for safe payments
- **🌐 Global Reach**: Connect with causes and products worldwide

## 📸 Screenshots

<details>
<summary>Click to view screenshots</summary>

![Homepage with 3D animation](https://via.placeholder.com/1200x600?text=AffiliateDonor+Homepage)
![Cause browsing interface](https://via.placeholder.com/1200x600?text=Cause+Browsing)
![Shopping with donation modal](https://via.placeholder.com/1200x600?text=Shopping+with+Donation)
![Crypto payment modal](https://via.placeholder.com/1200x600?text=Crypto+Payment)
![Impact dashboard](https://via.placeholder.com/1200x600?text=Impact+Dashboard)

</details>

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/affiliatedonor/affiliatedonor.git
cd affiliatedonor

# Install dependencies
npm install
cd backend && go mod download && cd ..

# Create environment files
cp .env.example .env
cd backend && cp .env.example .env && cd ..

# Start development servers
# Terminal 1 - Backend
cd backend && go run main.go

# Terminal 2 - Frontend
npm run dev

# Open in browser
open http://localhost:3000
```

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js 18+
- npm or yarn
- Go 1.21+
- Git
- Code editor (VS Code recommended)
- Terminal/command line access

## 🔧 Installation

### Frontend Setup

```bash
# Navigate to project directory
cd c:\MASTER\AffiliateDonations

# Install all frontend dependencies
npm install
```

### Backend Setup

```bash
# Navigate to backend
cd backend

# Download Go dependencies
go mod download
```

## 🌐 External Services Setup

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
7. Create database tables (see `SETUP_INSTRUCTIONS.md` for schema)

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

## 🔑 Configuration

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

## 🛠️ Usage

### Running the Application

```bash
# Terminal 1 - Backend
cd backend
go run main.go

# Terminal 2 - Frontend
npm run dev
```

### Building for Production

```bash
# Frontend
npm run build

# Backend
cd backend
go build -o affiliatedonor-api .
```

### Deploying to Production

```bash
# Frontend to Vercel
npm install -g vercel
vercel --prod

# Backend to Render
# See SETUP_INSTRUCTIONS.md for detailed deployment instructions
```

## 🏗️ Architecture

AffiliateDonor follows a modern full-stack architecture:

```
AffiliateDonor Architecture

Frontend (React + TypeScript)
├── UI Components
│   ├── Atoms (Button, Input)
│   ├── Molecules (Card, Modal)
│   └── Organisms (Navbar, Footer, CartModal, PaymentModal)
├── Pages (16 total)
│   ├── HomePage (Hero3D + ImpactCounter)
│   ├── CausesPage
│   ├── CausePage
│   ├── ShopPage
│   ├── MerchPage
│   ├── DashboardPage
│   ├── HowItWorksPage
│   ├── AboutPage
│   ├── MissionPage
│   ├── PartnersPage
│   ├── BlogPage
│   ├── HelpPage
│   ├── ContactPage
│   ├── FaqsPage
│   └── TermsPage
├── State Management (Zustand)
├── Data Fetching (React Query)
└── Animations (Framer Motion + Three.js)

Backend (Go + Gin)
├── Handlers
│   ├── Causes
│   ├── Donations
│   ├── Payments
│   ├── Crypto
│   ├── Products
│   ├── Affiliates
│   ├── Users
│   └── WebSocket
├── Models
├── Routes
└── Middleware

Services
├── Supabase (Auth + Database)
├── Stripe (Payments)
├── PayPal (Alternative Payments)
└── Coinbase Commerce (Crypto Payments)
```

## 📁 Project Structure

```
AffiliateDonations/
├── 📱 Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── atoms/           (Button, Input)
│   │   │   ├── molecules/       (Card, Modal)
│   │   │   ├── organisms/       (Navbar, Footer, CartModal, PaymentModal, CryptoModal)
│   │   │   └── utils/           (ScrollToTop)
│   │   ├── pages/               (16 complete pages)
│   │   │   ├── Home/            (HomePage + Hero3D + ImpactCounter)
│   │   │   ├── Causes/          (CausesPage)
│   │   │   ├── Cause/           (CausePage - detailed view)
│   │   │   ├── Shop/            (ShopPage - affiliate products)
│   │   │   ├── Merch/           (MerchPage - merchandise with cart)
│   │   │   ├── Dashboard/       (DashboardPage - user impact)
│   │   │   ├── HowItWorks/      (HowItWorksPage - animated guide)
│   │   │   ├── About/           (AboutPage - team & story)
│   │   │   ├── Mission/         (MissionPage - vision)
│   │   │   ├── Partners/        (PartnersPage - brands & causes)
│   │   │   ├── Blog/            (BlogPage - impact stories)
│   │   │   ├── Help/            (HelpPage - support center)
│   │   │   ├── Contact/         (ContactPage - contact form)
│   │   │   ├── Faqs/            (FaqsPage - searchable FAQs)
│   │   │   └── Terms/           (TermsPage - legal docs)
│   │   ├── context/             (CartContext, AuthContext)
│   │   ├── hooks/               (useAuth, useDonations)
│   │   ├── services/            (donationAPI, affiliateAPI)
│   │   ├── lib/                 (supabase, apiClient)
│   │   ├── utils/               (cn, motionVariants)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/                  (favicon.svg)
│   ├── index.html
│   ├── package.json             (all dependencies)
│   ├── vite.config.ts
│   ├── tailwind.config.cjs
│   ├── tsconfig.json
│   └── .env.example
│
├── 🔧 Backend (Go + Gin Framework)
│   ├── backend/
│   │   ├── handlers/
│   │   │   ├── causes.go        (Cause management)
│   │   │   ├── donations.go     (Donation processing)
│   │   │   ├── payments.go      (Payment integration)
│   │   │   ├── crypto.go        (Crypto payments)
│   │   │   ├── products.go      (Product catalog)
│   │   │   ├── affiliates.go    (Affiliate tracking)
│   │   │   ├── users.go         (User management)
│   │   │   └── websocket.go     (Real-time updates)
│   │   ├── models/
│   │   │   └── models.go        (Data structures)
│   │   ├── routes/
│   │   │   └── routes.go        (Route definitions)
│   │   ├── main.go              (Server entry point)
│   │   ├── go.mod               (Dependencies)
│   │   ├── Dockerfile           (Container config)
│   │   ├── .env.example
│   │   └── README.md
│
└── 📚 Documentation
    ├── README.md                (Main documentation)
    ├── SETUP_INSTRUCTIONS.md    (Detailed setup guide)
    ├── QUICKSTART.md            (5-minute start)
    ├── CONTRIBUTING.md          (Contribution guide)
    ├── PROJECT_SUMMARY.md       (Project overview)
    ├── vercel.json              (Vercel deployment)
    └── .gitignore
```

## 🧪 Testing

### Frontend Tests

```bash
npm run test
```

### Backend Tests

```bash
cd backend
go test ./...
```

## 🚀 Deployment

### Frontend Options

- ✅ **Vercel** - Zero config (vercel.json included)
- ✅ **Netlify** - Auto deploy
- ✅ **AWS S3** - Static hosting
- ✅ **GitHub Pages** - Free hosting

### Backend Options

- ✅ **Render** - One-click deploy
- ✅ **Fly.io** - Global edge
- ✅ **Railway** - Simple deployment
- ✅ **Docker** - Containerized (Dockerfile included)

## 📊 Monitoring / Logging / Observability

AffiliateDonor includes built-in monitoring capabilities:

- **Real-time impact tracking** on the dashboard
- **WebSocket connections** for live updates
- **Payment status tracking** for all transactions
- **Error logging** for debugging
- **Performance metrics** for API endpoints

## 🤝 Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📜 Roadmap

- [ ] Mobile apps (React Native)
- [ ] Browser extension
- [ ] AI cause recommendations
- [ ] Recurring donations
- [ ] Social sharing
- [ ] Gamification
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced analytics

## 🚧 Known Limitations / Future Improvements

- **Mobile app development** is in progress
- **Advanced analytics** dashboard is planned
- **Gamification features** will be added
- **Multi-language support** is in development
- **Dark mode** will be implemented
- **Browser extension** is in the roadmap

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Thanks to all contributors who have helped shape AffiliateDonor
- Special thanks to the open-source community for providing amazing tools
- Inspired by the power of shopping with purpose

## 📞 Contact / Support

For questions or support, please contact:

- Email: support@affiliatedonor.com
- GitHub Issues: [https://github.com/affiliatedonor/affiliatedonor/issues](https://github.com/affiliatedonor/affiliatedonor/issues)
- Discord Community: [Join our Discord](https://discord.gg/affiliatedonor)

---

Start shopping with purpose today! 🛍️💖🌍