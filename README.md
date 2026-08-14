# Fixora - Home Services Platform

A full-stack home services marketplace platform where users can book professional service providers for various home services.

## Project Structure

```
fixora-frontend/
├── fixora-backend/          # Node.js/Express API
├── user-frontend/            # React (Create React App) - Customer portal
├── admin-frontend/           # React (Vite) - Admin dashboard
└── README.md
```

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator

### Frontend
- **User Portal**: React (Create React App), Material UI, React Bootstrap
- **Admin Portal**: React (Vite), Recharts
- **Routing**: React Router DOM

## Prerequisites

- Node.js (v14+)
- MongoDB (running locally or cloud instance)
- npm or yarn

## Installation & Setup

### 1. Backend Setup

```bash
cd fixora-backend
npm install
```

Create a `.env` file in `fixora-backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fixora
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```

Start the backend server:

```bash
npm start
# or for development with auto-reload
npm run dev
```

### 2. Seed Database (Optional)

```bash
# Seed categories and services
node seed.js

# Create admin user
node seedAdmin.js
```

Default admin credentials:
- Email: admin@fixora.com
- Password: admin123

### 3. User Frontend Setup

```bash
cd user-frontend
npm install
npm start
```

Runs at: http://localhost:3000

### 4. Admin Frontend Setup

```bash
cd admin-frontend
npm install
npm run dev
```

Runs at: http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile

### Services
- `GET /api/services` - Get all services (with pagination)
- `GET /api/services/category/:category` - Get services by category
- `GET /api/services/:id` - Get service by ID

### Categories
- `GET /api/categories` - Get all categories

### Bookings
- `POST /api/bookings/create` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/all` - Get all bookings (admin)
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/assign` - Assign provider to booking

### Providers
- `POST /api/providers/register` - Register as provider
- `GET /api/providers` - Get all providers
- `GET /api/providers/:id` - Get provider by ID

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/providers` - Manage providers
- `GET /api/admin/bookings` - Manage bookings
- `PUT /api/admin/provider/:id/verify` - Verify provider
- `PUT /api/admin/booking/:id/status` - Update booking status

## Features Implemented

### User Features
- User registration and login
- Browse services by category
- View service details
- Book services
- View booking history
- Manage profile

### Admin Features
- Admin login
- Dashboard with analytics
- Manage users (block/unblock)
- Manage providers (verify/approve)
- Manage bookings
- View revenue statistics

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Input validation

## Folder Structure

### Backend
```
fixora-backend/
├── config/           # Database config
├── controllers/      # Route controllers
├── middleware/       # Auth middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions
├── seed.js          # Database seeder
├── seedAdmin.js     # Admin user seeder
├── server.js        # Entry point
└── package.json
```

### User Frontend
```
user-frontend/
├── public/
├── src/
│   ├── assets/          # Images, icons
│   ├── components/      # Reusable components
│   ├── context/         # React contexts (Auth, Cart)
│   ├── data/            # Static data
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── App.js           # Main app
│   └── index.js         # Entry point
└── package.json
```

### Admin Frontend
```
admin-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/      # Reusable components
│   ├── context/         # React contexts
│   ├── data/            # Mock data
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── styles/          # CSS files
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## Running the Application

1. Start MongoDB
2. Start backend: `cd fixora-backend && npm start`
3. Start user frontend: `cd user-frontend && npm start`
4. Start admin frontend: `cd admin-frontend && npm run dev`

## Default Admin Credentials

- **Email**: admin@fixora.com
- **Password**: admin123

## License

This project is for educational purposes.
