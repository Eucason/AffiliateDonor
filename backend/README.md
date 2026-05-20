# AffiliateDonor Backend

Go-based REST API for the AffiliateDonor platform.

## Features

- RESTful API with Gin framework
- Supabase integration for auth & database
- Payment processing (Stripe, PayPal, crypto)
- Real-time updates via WebSockets
- Affiliate tracking and analytics
- CORS enabled for frontend integration

## Setup

### Prerequisites

- Go 1.21 or higher
- Supabase account
- Stripe account (for payment processing)

### Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

3. Install dependencies:

```bash
go mod download
```

4. Run the server:

```bash
go run main.go
```

The server will start on `http://localhost:8080`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Causes
- `GET /api/causes` - Get all causes
- `GET /api/causes/:id` - Get cause by ID
- `GET /api/causes/:id/donations` - Get cause donations

### Donations
- `POST /api/donations` - Create donation
- `GET /api/donations` - Get donations (filtered)
- `GET /api/donations/:id` - Get donation by ID
- `POST /api/donations/track` - Track donation event

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products/search` - Search products

### Payments
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/stripe/webhook` - Stripe webhook
- `POST /api/payments/paypal/webhook` - PayPal webhook
- `GET /api/payments/:id/status` - Get payment status

### Crypto
- `POST /api/crypto/generate-address` - Generate crypto payment address
- `POST /api/crypto/verify-payment` - Verify crypto payment
- `GET /api/crypto/payment/:id/status` - Get crypto payment status

### Affiliates
- `POST /api/affiliates/click` - Track affiliate click
- `POST /api/affiliates/conversion` - Track conversion
- `GET /api/affiliates/stats` - Get affiliate stats

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/me/donations` - Get user donations
- `GET /api/users/me/impact` - Get user impact metrics
- `PUT /api/users/me` - Update user profile

### WebSocket
- `GET /ws` - WebSocket connection for real-time updates

## Docker Deployment

Build and run with Docker:

```bash
docker build -t affiliatedonor-backend .
docker run -p 8080:8080 --env-file .env affiliatedonor-backend
```

## Environment Variables

See `.env.example` for all required environment variables.

## Development

Run with hot reload using Air:

```bash
go install github.com/cosmtrek/air@latest
air
```

## Testing

```bash
go test ./...
```

## Production Deployment

### Render

1. Create new Web Service
2. Connect repository
3. Set build command: `go build -o main .`
4. Set start command: `./main`
5. Add environment variables

### Fly.io

```bash
fly launch
fly secrets set SUPABASE_URL=xxx STRIPE_SECRET_KEY=xxx
fly deploy
```

## License

MIT
