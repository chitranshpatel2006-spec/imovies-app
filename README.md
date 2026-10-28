# 🎬 IMovies - Next-Gen Cinema Reservation & Real-Time Seat Booking Platform

**IMovies** is a seamless online platform engineered to enhance the cinema-going experience. Built on a full-stack **MERN** architecture (MongoDB, Express.js, React.js, Node.js) with Bootstrap 5 and JWT authentication, it empowers users to explore movie catalogs, inspect showtimes, reserve seats with real-time collision prevention, and obtain contactless digital tickets.

---

## 📋 Project Statistics & Scope

- **Total Epics**: 6
- **Total Stories / Tasks**: 19
- **Architecture**: Decoupled Client-Server RESTful Architecture
- **Authentication**: Stateless JSON Web Token (JWT) with Bcrypt Password Hashing
- **UI Framework**: React.js 18 + Bootstrap 5 + Bootstrap Icons

---

## 🎯 Epics & 19 Tasks Breakdown

### Epic 1: User Authentication & Role-Based Access Control
- **Task 1: User Registration** — User signup endpoint with password validation and salted `bcryptjs` hashing.
- **Task 2: User Login & JWT Issuance** — Secure authentication issuing signed JWT tokens (`7d` validity).
- **Task 3: Protected Session State** — Persistent `AuthContext` using `localStorage` and request interceptors.
- **Task 4: Role-Based Authorization** — Middleware distinguishing regular `user` from privileged `admin`.

### Epic 2: Movie Catalog & Exploration
- **Task 5: Movie Catalog Grid** — Responsive movie poster grid showing ratings, certifications, and languages.
- **Task 6: Multi-Criteria Filter & Search** — Filter movies by genre, audio language, and live text search.
- **Task 7: Detailed Movie View** — Movie synopsis, cast, director, duration, and embedded video trailer modal.

### Epic 3: Theater & Showtime Scheduling
- **Task 8: Screen & Theater Formats** — Multi-auditorium support (IMAX Laser 3D, Dolby Atmos 4K, 4DX Motion).
- **Task 9: Dynamic Showtime Scheduling** — Multi-tiered pricing structure (Standard, Premium, VIP).
- **Task 10: Date & Showtime Selector UI** — Day tabs (Today, Tomorrow, Day After) with real-time seat availability.

### Epic 4: Interactive Real-Time Seat Reservation
- **Task 11: Visual Seat Matrix Layout** — Ergonomic screen-facing seat map across rows A through F.
- **Task 12: Real-Time Collision Locking** — Server-side validation preventing double-booking of seats.
- **Task 13: Dynamic Fare Breakdown** — Live calculation of tickets subtotal, convenience fee, and GST.

### Epic 5: Booking Management & Digital Ticketing
- **Task 14: Checkout & Order Creation** — Transactional order confirmation generating unique reference IDs (`IMV-XXXXXX`).
- **Task 15: Digital E-Ticket Pass** — Pass with scannable QR code graphic, theater specs, and print support.
- **Task 16: User Booking History & Cancellation** — My Bookings portal with one-click cancellation and seat release.

### Epic 6: Administration Dashboard & Analytics
- **Task 17: Platform KPI Overview** — Metrics cards displaying total revenue, orders, tickets sold, and active catalog.
- **Task 18: Movie Catalog Management** — Admin modal to add new movie titles, posters, trailers, and attributes.
- **Task 19: Cinema Booking Ledger** — Global transaction audit log listing customer bookings and booking statuses.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend UI** | React.js 18, React Router DOM 6, Vite |
| **Styling & Icons** | Bootstrap 5.3, Bootstrap Icons, Custom Cinema CSS |
| **Backend API** | Node.js, Express.js |
| **Database** | MongoDB & Mongoose (with high-performance in-memory fallback) |
| **Security** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` encryption |
| **HTTP Client** | Axios with automated bearer token interceptor |

---

## ⚡ Quick Start Guide

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed on your system.
*(MongoDB is optional: if a local MongoDB server is not running, IMovies automatically activates its integrated in-memory data store with pre-seeded movies and showtimes so you can run and evaluate immediately without extra setup!)*

### 2. Install Dependencies

In the root directory, or individually in `server` and `client`:

```bash
# In imovies-app/server
cd server
npm install

# In imovies-app/client
cd ../client
npm install
```

### 3. Start the Application

Open two terminal windows (or run concurrently):

#### Terminal 1 — Start the Backend Server:
```bash
cd server
npm start
```
*Backend runs on: `http://localhost:5000`*
*Health Check: `http://localhost:5000/api/health`*

#### Terminal 2 — Start the Frontend UI:
```bash
cd client
npm run dev
```
*Frontend opens at: `http://localhost:3000`*

---

## 🔑 Pre-Seeded Accounts

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Administrator** | `admin@imovies.com` | `password123` | Full access, Admin Analytics Dashboard, Movie Management |
| **Customer** | `alex@example.com` | `password123` | Movie browsing, Seat reservation, Ticket download, Cancel booking |

> **Tip**: The login page features **One-Click Quick Fill** buttons for testing both Admin and Regular User accounts instantly.

---

## 📡 RESTful API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`, `phone`)
- `POST /api/auth/login` — Sign in and obtain JWT token
- `GET /api/auth/me` — Retrieve authenticated user profile (Requires Bearer Token)

### Movies (`/api/movies`)
- `GET /api/movies` — List movies (Supports `?genre=`, `?language=`, `?search=`, `?nowShowing=`)
- `GET /api/movies/:id` — Get full movie details with synopsis, cast, and trailer
- `POST /api/movies` — Create movie *(Admin only)*
- `PUT /api/movies/:id` — Update movie *(Admin only)*
- `DELETE /api/movies/:id` — Delete movie *(Admin only)*

### Showtimes (`/api/showtimes`)
- `GET /api/showtimes/movie/:movieId?date=YYYY-MM-DD` — Showtimes for a movie
- `GET /api/showtimes/:id` — Detailed showtime status with booked seats
- `POST /api/showtimes` — Create showtime *(Admin only)*
- `DELETE /api/showtimes/:id` — Remove showtime *(Admin only)*

### Bookings (`/api/bookings`)
- `POST /api/bookings` — Create a new ticket reservation
- `GET /api/bookings/my` — Fetch current user's booking history
- `GET /api/bookings/:id` — Retrieve digital ticket pass details
- `POST /api/bookings/:id/cancel` — Cancel reservation and free seats

### Admin (`/api/admin`)
- `GET /api/admin/stats` — Revenue, ticket volume, and reservation statistics
- `GET /api/admin/bookings` — View platform-wide customer orders
