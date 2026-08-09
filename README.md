# Grocery E-Commerce Website

Production-ready grocery e-commerce platform built with React, Vite, Tailwind CSS, Redux Toolkit, Node.js, Express, MongoDB, and Mongoose.

## Project Structure

- `client/` - React frontend
- `server/` - Express API

## Development

1. Install dependencies from the repository root.
2. Run the client and server together with the root dev script.

```bash
npm install
npm run dev
```

### Seeding the database (development)

To populate a local MongoDB with sample categories, products, and an admin user run:

```bash
# set MONGO_URI in .env and then run from the server folder
node src/seeds/seed.js
```

The seed creates an admin user: `admin@freshcart.test` / `Admin@123`.

## Phase Plan

- Phase 1: Project setup and folder structure
- Phase 2: Frontend UI
- Phase 3: Backend API
- Phase 4: Authentication
- Phase 5: Admin panel
- Phase 6: WhatsApp integration
- Phase 7: Testing
- Phase 8: Deployment
