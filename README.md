# GearShift — Car Dealership Inventory System

[![TDD Kata](https://img.shields.io/badge/TDD%20Kata-Passed-00C853?style=for-the-badge&logo=jest&logoColor=white)](https://github.com/JaniDhruv/GearShift)
[![Stack MERN](https://img.shields.io/badge/Stack-MERN%20%28MongoDB%2C%20Express%2C%20React%2C%20Node%29-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Vite + Tailwind CSS](https://img.shields.io/badge/Frontend-Vite%20%2B%20Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Swagger API Docs](https://img.shields.io/badge/OpenAPI-Interactive%20Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:5000/api-docs)

> A modern, robust, full-stack **Car Dealership Inventory System** built from scratch using strict **Test-Driven Development (TDD)**, **SOLID Principles**, clean layered architecture, and **Extreme Programming (XP)** practices. All vehicle pricing and inventory models are seeded with authentic Indian Market showroom catalog data in **Indian Rupees (₹)**.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Core Architecture & Clean Code](#-core-architecture--clean-code)
3. [Key Features](#-key-features)
4. [Detailed Setup & Installation Instructions](#-detailed-setup--installation-instructions)
5. [Demo Credentials (Seeded)](#-demo-credentials-seeded)
6. [API Endpoints Reference](#-api-endpoints-reference)
7. [Screenshots & Visual Application Showcase](#-screenshots--visual-application-showcase)
8. [Test-Driven Development (TDD) & Automated Test Report](#-test-driven-development-tdd--automated-test-report)
9. [My AI Usage (Mandatory Section)](#-my-ai-usage-mandatory-section)
10. [Deployment & Production Details](#-deployment--production-details)

---

## 🎯 Project Overview

**GearShift** is a full-stack **Car Dealership Inventory System** designed to serve as an intuitive, high-performance automotive showroom and management dashboard. The system enables customers and sales staff to browse, search, filter, and purchase vehicles in real-time across categories like **SUV, SEDAN, ELECTRIC, HYBRID, LUXURY, SPORTS, and HATCHBACK**, while granting administrative personnel secure tools to manage dealership inventory, restock quantities, and update vehicle specifications.

### Tech Stack Highlights

- **Backend API**: Node.js & Express.js (RESTful architecture with comprehensive Swagger/OpenAPI interactive docs).
- **Database**: Persistent database using **MongoDB / Mongoose ODM** with automated seeding (`npm run seed`) and schema validation.
- **Authentication & Security**: JWT-based stateless authentication, `bcryptjs` password hashing, Role-Based Access Control (RBAC) (`Admin`, `Staff`, `User`), rate limiting, and HTTP security headers via `helmet`.
- **Frontend SPA**: React 19, Vite, Vanilla/Tailwind CSS styling system, Lucide icons, responsive glassmorphism aesthetic, Indian Rupee (`₹`) localized formatting, and optimistic inventory UI updates.

---

## 🏗 Core Architecture & Clean Code

The application adheres strictly to **Clean Code** and **SOLID Principles**:

```
Client (React 19 SPA)
   │
   ▼ HTTP REST / JSON (JWT Authorization Header)
Express Router Layer  ──► Swagger OpenAPI Specification (/api-docs)
   │
   ▼
Controller Layer      ──► Request Validation & HTTP Response Formatting
   │
   ▼
Service Layer         ──► Core Business Logic & Domain Rule Enforcement (RBAC, Inventory Bounds)
   │
   ▼
Repository / ODM      ──► MongoDB (Mongoose Schema & Optimistic Concurrency Control)
```

- **Single Responsibility Principle (SRP)**: Controllers strictly handle request/response transformation; business domain validation resides in pure Service classes.
- **Atomic Inventory Mutations**: Purchases (`POST /api/vehicles/:id/purchase`) and restocks (`POST /api/vehicles/:id/restock`) use database-level atomic operations (`$inc`) to prevent race conditions or negative inventory balances.

---

## ✨ Key Features

1. **User Authentication & Role-Based Access Control (RBAC)**:
   - Secure registration (`POST /api/auth/register`) and login (`POST /api/auth/login`) returning JWT access tokens.
   - Role-scoped route protection distinguishing between standard `User`, `Staff`, and `Admin` permissions.
2. **Vehicle Catalog & Showroom**:
   - Each vehicle contains a unique `id`, `make`, `model`, `category` (e.g., *SUV, SEDAN, ELECTRIC, HYBRID, LUXURY, SPORTS, HATCHBACK*), `price` in INR (`₹`), and `quantity` in stock.
   - Multi-criteria Search & Filtering (`GET /api/vehicles/search`) by keyword, make, category, and dynamic Rupee price bands (e.g., ₹5,00,000 to ₹90,00,000).
3. **Protected Inventory Management**:
   - **Purchase Action** (`POST /api/vehicles/:id/purchase`): Decreases stock quantity atomically by 1. Automatically disables the UI purchase button when `quantity === 0` (e.g., seeded **Mahindra Scorpio-N** at `0` stock).
   - **Restock Action** (`POST /api/vehicles/:id/restock`): Increases stock quantity (Admin only).
   - **Full CRUD Management**: Add (`POST /api/vehicles`), Update (`PUT /api/vehicles/:id`), and Delete (`DELETE /api/vehicles/:id`, Admin only).

---

## 🚀 Detailed Setup & Installation Instructions

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9+ or higher)
- **MongoDB** (Local instance running on `mongodb://127.0.0.1:27017/gearshift` or MongoDB Atlas URI)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/JaniDhruv/GearShift.git
cd GearShift
```

---

### Step 2: Backend Setup & Seeding

Navigate into the `backend/` directory, install dependencies, configure environment variables, and run the database seeder:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` root (or use the provided defaults):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/gearshift
JWT_SECRET=gearshift_super_secret_jwt_key_for_development_2026
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

Seed the database with the 20 Indian Market vehicles and demo users:

```bash
npm run seed
```

Start the backend development server:

```bash
npm run dev
```

> **Server URL**: The API server will run at `http://localhost:5000`  
> **Interactive API Docs**: Open **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)** in your browser to explore and test all API routes via Swagger UI.

---

### Step 3: Frontend Setup & Running the SPA

Open a new terminal window, navigate into the `frontend/` directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the modern React SPA development server:

```bash
npm run dev
```

> **Frontend Application**: Open your browser at **[http://localhost:5173](http://localhost:5173)** to interact with the Car Dealership application.

---

## 👥 Demo Credentials (Seeded)

After executing `npm run seed` in the backend, you can instantly sign in using any of the seeded accounts below:

| Role | Email | Password | Permissions & Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gearshift.com` | `Password123!` | Full Admin control: Add, Edit, Delete vehicles, Restock inventory, and Purchase vehicles. |
| **Staff** | `staff@gearshift.com` | `Password123!` | View vehicles, Search/Filter, Purchase vehicles, and view dealership analytics. |
| **Standard User** | `user@gearshift.com` | `Password123!` | View vehicles, Search & Filter catalog, and Purchase vehicles. |

---

## 🔌 API Endpoints Reference

All protected routes require an Authorization header: `Authorization: Bearer <JWT_TOKEN>`.

### Authentication Endpoints
| HTTP Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |

### Vehicles & Inventory Endpoints
| HTTP Method | Endpoint | Description | Auth Required | Minimum Role |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/api/vehicles` | Get a paginated list of available vehicles | Yes | Any User |
| `GET` | `/api/vehicles/search` | Search vehicles by make, model, category, or INR price range | Yes | Any User |
| `POST` | `/api/vehicles` | Create and add a new vehicle to inventory | Yes | Staff / Admin |
| `PUT` | `/api/vehicles/:id` | Update vehicle details and specifications | Yes | Staff / Admin |
| `DELETE` | `/api/vehicles/:id` | Permanently delete a vehicle from inventory | Yes | **Admin Only** |
| `POST` | `/api/vehicles/:id/purchase` | Purchase vehicle (decreases `quantity` by 1) | Yes | Any User |
| `POST` | `/api/vehicles/:id/restock` | Restock vehicle inventory (increases `quantity`) | Yes | **Admin Only** |

---

## 🖼 Screenshots & Visual Application Showcase

Below are actual visual previews of GearShift running against seeded Indian market inventory (`Mercedes-Benz E-Class E350d`, `Tata Nexon`, `Mahindra Scorpio-N`, and `Tata Tiago EV`).

### 1. Showroom & Dynamic Fleet Grid
![GearShift Showroom Dashboard](./docs/screenshots/showroom.png)
*Displays real-time stock levels, localized INR (`₹`) prices, and interactive Purchase actions. Notice that zero-stock vehicles like the seeded **Mahindra Scorpio-N** render an immediate disabled state.*

### 2. Multi-Criteria Search & Filter Interface
![GearShift Search and Filter Interface](./docs/screenshots/search-filter.png)
*Allows users to instantly filter across makes (**Tata, Mahindra, Maruti Suzuki, Hyundai, Toyota, BYD, Mercedes-Benz, BMW**), categories (**SUV, SEDAN, ELECTRIC, HYBRID, LUXURY, SPORTS, HATCHBACK**), and custom Rupee price bands.*

### 3. Role-Protected Admin Management Portal
![GearShift Admin Management Portal](./docs/screenshots/admin-portal.png)
*Provides administrators with intuitive modals for restocking inventory counts and managing showroom catalog data.*

---

## 🧪 Test-Driven Development (TDD) & Automated Test Report

This application was engineered adhering strictly to the **Red-Green-Refactor** TDD methodology:
1. **Red**: Wrote failing integration and domain unit tests defining expected HTTP status codes, payload structures, RBAC permissions, and inventory boundary conditions.
2. **Green**: Implemented clean service and controller logic to pass the specs.
3. **Refactor**: Optimized code modularity, extracted reusable validation rules, and ensured clean separation of concerns.

### Running the Automated Test Suite

To execute the automated backend test suite locally:

```bash
cd backend
npm test
```

### Verified Automated Test Runner Output

Below is the literal, unedited output from our Jest integration and unit test run (`npm test`):

```
PASS tests/integration/inventory.test.js
PASS tests/integration/vehicle.update.test.js
PASS tests/integration/rbac/authorize.test.js
PASS tests/integration/vehicle.create.test.js
PASS tests/integration/vehicle.delete.test.js
PASS tests/integration/auth.middleware.test.js
PASS tests/integration/auth.login.test.js
PASS tests/integration/vehicle.search.test.js
PASS tests/integration/seed.test.js
PASS tests/integration/auth.register.test.js
PASS tests/integration/vehicle.list.test.js
PASS tests/integration/health.test.js
PASS tests/integration/vehicle.domain.test.js
PASS tests/integration/swagger.test.js
PASS tests/unit/errors.test.js
PASS tests/unit/apiResponse.test.js

Test Suites: 16 passed, 16 total
Tests:       86 passed, 86 total
Snapshots:   0 total
Time:        44.862 s, estimated 67 s
Ran all test suites.
```

#### Key Verified Test Scenarios:
- **RBAC & Authorization (`rbac/authorize.test.js`)**: Verifies that protected admin routes reject standard users and staff members with `403 Forbidden`.
- **Atomic Inventory Operations (`inventory.test.js`)**: Verifies that `POST /api/vehicles/:id/purchase` correctly decrements stock by 1 for any authenticated user, and returns `400 Bad Request` when attempting to purchase a vehicle with `quantity === 0`.
- **Domain Model Validation (`vehicle.domain.test.js`)**: Verifies strict Mongoose schema constraints on category enums, positive prices, and non-negative stock counts.

---

## 🤖 My AI Usage (Mandatory Section)

In accordance with modern software engineering practices and the assessment guidelines, AI assistants were leveraged collaboratively throughout the development cycle. Below is a concrete breakdown of how each tool was used and concrete examples of our interactions.

### 1. Which AI Tools Were Used

- **Claude AI**: Used for Git resolving, commit history organization, and merge conflict resolution across branches.
- **Antigravity AI (Google DeepMind Agentic Assistant)**: Used as an interactive pair programmer during backend API construction, TDD execution, and refactoring business logic.
- **ChatGPT**: Used during initial phase brainstorming to structure our **Extreme Programming (XP)** checkpoints and design test matrices for RBAC edge cases.
- **Stitch with Google (Google UI Design System / Guidance)**: Used for UI design inspiration, layout composition, and interactive state feedback on the frontend SPA.

---

### 2. Concrete Examples of How We Used Them

- **Debugging Atomic Inventory Operations (Antigravity AI)**:
  During implementation of `POST /api/vehicles/:id/purchase` and `POST /api/vehicles/:id/restock`, we encountered potential race conditions when concurrent requests hit an item near zero stock. Instead of a typical read-then-write Mongoose update (`const v = await Vehicle.findById(id); v.quantity--; await v.save()`), Antigravity suggested atomic MongoDB updates using `$inc: { quantity: -1 }` with a query guard `{ quantity: { $gt: 0 } }` to guarantee that inventory never drops below zero under concurrent load.
- **Structuring TDD Edge Cases (ChatGPT)**:
  Before writing our authentication and authorization middleware, we used ChatGPT to outline every possible failure mode. It helped us distinguish between `401 Unauthorized` (missing/expired JWT token) and `403 Forbidden` (valid token but insufficient role permissions), ensuring we wrote distinct integration specs for both scenarios before writing the route handlers.
- **Designing Zero-Stock Visual States (Stitch with Google)**:
  Stitch with Google informed our visual treatments for zero-stock vehicles (such as the seeded `Mahindra Scorpio-N`). It recommended high-contrast crimson badge styling (`OUT OF STOCK`) paired with disabled CTA buttons (`cursor-not-allowed opacity-50`) so users immediately understand why an item cannot be purchased.
- **Git Merge Conflict Resolution (Claude AI)**:
  When merging our JWT authentication refactor branch with the search/filtering branch, Claude AI helped untangle overlapping route declarations in `vehicle.routes.js` while maintaining clean semantic commit messages.

---

### 3. Reflection on AI Impact

Working with AI tools across different domains fundamentally improved our workflow:

1. **Test Discipline Before Implementation**: Generating test outlines with ChatGPT and Antigravity AI before writing implementation code kept our engineering disciplined. We caught edge cases early (like validating invalid MongoDB ObjectIDs and handling non-numeric restock payloads).
2. **Architectural Robustness**: Pair programming with Antigravity AI prevented sloppy coupling between controllers and database models, reinforcing strict Controller-Service-Repository separation.
3. **Accountability & Human Ownership**: While AI tools accelerated boilerplate generation and debugging, every commit was reviewed, tested against our Jest suite, and validated by the developer.

---

### 4. AI Co-Authorship Commit Convention

In compliance with the project's AI usage policy, commits augmented by AI tools include formal co-author trailers at the bottom of commit messages:

```bash
git commit -m "feat: Implement protected vehicle purchase endpoint with stock validation

Executed Red-Green-Refactor cycle ensuring purchase requests atomically
decrement quantity and prevent negative stock levels.

Co-authored-by: Antigravity AI <antigravity@example.com>"
```

---

## 🌐 Deployment & Production Details

- **Frontend Build**: Built for production deployment using `npm run build` inside `frontend/` (compatible with Vercel, Netlify, or Cloudflare Pages).
- **Backend Deployment**: Stateless Node.js/Express server ready for deployment on Render, Heroku, AWS ECS, or Fly.io with MongoDB Atlas connection string configured via environment variables.

---

*Built with clean code, rigorous testing, and AI-augmented pair programming.*
