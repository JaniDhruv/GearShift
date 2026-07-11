# GearShift Backend API

Production-ready REST API for the **GearShift** Car Dealership Inventory System built with Node.js, Express, MongoDB, and Clean Architecture principles using Test-Driven Development (TDD).

## ✨ Key Features

- **Clean Architecture**: Decoupled domain models, repositories, application services, and HTTP interface adapters.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions supporting `admin`, `staff`, and `user` roles.
- **Interactive OpenAPI Docs**: Full Swagger API documentation mounted at `/api-docs`.
- **Database Seeding**: Development seed script with demo users and 20 sample vehicles across all categories.
- **Standardized Responses & Error Handling**: Consistent JSON payload responses and structured application error hierarchy.
- **100% Tested**: Comprehensive automated integration and unit test suite.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Seed Demo Data
Populate MongoDB with demo users (`Admin`, `Staff`, `User`) and 20 sample vehicles:
```bash
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 📖 API Documentation (Swagger)

Once the server is running, open your browser to view interactive OpenAPI documentation:
- **Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **OpenAPI JSON**: [http://localhost:5000/api-docs.json](http://localhost:5000/api-docs.json)

---

## 🧪 Testing

Run the full automated test suite:
```bash
npm test
```
