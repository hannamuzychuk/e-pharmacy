# E-Pharmacy

Franchise pharmacy management platform. Owners can register, create and edit a shop, manage medicine inventory, browse drug stores, and view sales statistics.

Monorepo with a React frontend and an Express + MongoDB API.

## Tech stack

| Layer | Stack |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router, React Hook Form, Axios |
| Backend | Node.js, Express 5, MongoDB (Mongoose), JWT, Joi, Multer |
| Tooling | npm workspaces, Nodemon, Oxlint |

## Project structure

```
e-pharmacy/
├── frontend/          # React + Vite app
├── backend/           # Express API
├── package.json       # workspace root
└── README.md
```

## Features

- **Auth** — register / login with JWT access + refresh tokens; logout blacklists tokens
- **Shop** — create shop, edit details, upload logo
- **Medicine** — catalog with filters, pagination, product details and reviews
- **Drug stores** — browse stores with pagination
- **Statistics** — dashboard cards, recent customers, income/expenses, products & suppliers tables
- **Legal** — privacy policy and terms & conditions pages

## Prerequisites

- Node.js 18+ (LTS recommended)
- MongoDB Atlas URI or a local MongoDB instance

## Getting started

### 1. Install dependencies

From the repo root:

```bash
npm install
```

### 2. Configure the backend

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/epharmacy?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=change_me_access_secret
JWT_REFRESH_SECRET=change_me_refresh_secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=30d
```

Use strong, unique values for the JWT secrets in any shared or production environment.

### 3. Run locally

Use two terminals:

```bash
# API (default http://localhost:5000)
npm run dev:backend

# Frontend (default http://localhost:5173)
npm run dev
```

Vite proxies `/api` and `/uploads` to the backend, so the frontend can call the API without a separate `VITE_API_URL` in local development.

Optional: set `VITE_API_URL` in a frontend env file if the API is hosted elsewhere (for example after deploy).

### 4. Seed sample data (optional)

```bash
npm run seed:customer-goods -w backend
npm run seed:shop-products -w backend
```

Force reseed of customer goods:

```bash
npm run seed:customer-goods:force -w backend
```

## Scripts

| Command | Description |
| --- | --- |
| `npm install` | Install all workspace dependencies |
| `npm run dev` | Start frontend (Vite) |
| `npm run dev:backend` | Start backend with Nodemon |
| `npm run start:backend` | Start backend (production) |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview the frontend production build |
| `npm run lint` | Lint the frontend |

## API overview

Base URL (local): `http://localhost:5000`

| Prefix | Purpose |
| --- | --- |
| `GET /api/health` | Health check |
| `/api/user` | Auth and user profile |
| `/api/shop` | Shop, products, and related resources |
| `/api/statistics` | Dashboard statistics |
| `/api/image` | Image proxy |
| `/uploads` | Static uploaded files (logos, product images) |

## Frontend routes

| Path | Access | Page |
| --- | --- | --- |
| `/login`, `/register` | Public | Authentication |
| `/create-shop`, `/edit-shop` | Private | Shop setup |
| `/shop` | Private | Drug stores |
| `/medicine`, `/medicine/:productId` | Private | Medicine catalog / details |
| `/statistics` | Private | Statistics dashboard |
| `/privacy-policy`, `/terms-conditions` | Private | Legal pages |

## License

ISC
