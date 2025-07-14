# ShareInfo Backend Setup Guide

## 🚀 Complete Full-Stack Implementation

Your ShareInfo application now includes a complete backend infrastructure with PostgreSQL database, authentication, file storage, and API endpoints.

## 📋 Prerequisites

1. **PostgreSQL Database** (Choose one):
   - Local PostgreSQL installation
   - **Supabase** (Recommended) - Free tier available
   - **Neon** - Serverless PostgreSQL
   - **PlanetScale** - MySQL alternative
   - **Railway** - PostgreSQL with hosting

2. **Cloudinary Account** (Free tier available)
   - Sign up at: https://cloudinary.com
   - Get: Cloud Name, API Key, API Secret

## 🔧 Setup Instructions

### 1. Environment Configuration

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# Database (Example for Supabase)
DATABASE_URL="postgresql://username:password@hostname:5432/database?sslmode=require"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="another-secret-key-for-jwt-tokens"

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 2. Database Setup

**Option A: Using Supabase (Recommended)**

1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string to `DATABASE_URL`

**Option B: Local PostgreSQL**

```bash
# Install PostgreSQL locally
createdb shareinfo
# Update DATABASE_URL with local credentials
```

### 3. Install Dependencies & Setup Database

```bash
# Install all dependencies
npm install

# Generate Prisma client and setup database
npm run setup

# Alternative: Step by step
npm run db:generate
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Profile Management

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile/[identifier]` - Get public profile

### File Upload

- `POST /api/upload` - Upload images (profile, cover, portfolio)
- `DELETE /api/upload` - Delete images

### Contact Fields

- `POST /api/profile/contact-fields` - Add contact field
- `PUT /api/profile/contact-fields` - Update contact fields

### vCard Generation

- `GET /api/vcard` - Download user's vCard
- `POST /api/vcard` - Generate public vCard

## 📊 Database Schema

The application includes comprehensive tables:

- **users** - User authentication
- **profiles** - User profile data
- **contact_fields** - Contact information
- **social_links** - Social media links
- **skills** - Professional skills
- **work_experience** - Career history
- **achievements** - Certifications & awards
- **portfolio_items** - Project showcase
- **testimonials** - Client reviews
- **profile_analytics** - Usage analytics

## 🔐 Security Features

- ✅ **Password hashing** with bcrypt
- ✅ **JWT authentication** with HTTP-only cookies
- ✅ **Input validation** with Zod schemas
- ✅ **File upload security** with type/size limits
- ✅ **SQL injection protection** with Prisma
- ✅ **Route protection** with middleware

## 📁 File Storage Features

- ✅ **Cloudinary integration** for images
- ✅ **Automatic image optimization**
- ✅ **Profile and cover image upload**
- ✅ **Portfolio image management**
- ✅ **Image deletion and cleanup**

## 🎯 Key Features Implemented

### ✅ Complete Authentication System

- User registration with profile creation
- Secure login/logout
- JWT token management
- Protected routes and API endpoints

### ✅ Full Profile Management

- Complete CRUD operations
- Real-time updates
- Public profile sharing
- Custom URL support

### ✅ File Upload & Storage

- Profile image upload
- Cover image management
- Portfolio images
- Cloudinary optimization

### ✅ vCard Generation

- Dynamic vCard creation
- Download functionality
- Public sharing support
- Analytics tracking

### ✅ Contact Management

- Multiple contact fields
- Social media links
- Public/private visibility
- Custom ordering

## 🚀 Production Deployment

### 1. Environment Setup

```env
NODE_ENV=production
DATABASE_URL="your-production-db-url"
NEXTAUTH_URL="https://yourdomain.com"
```

### 2. Database Migration

```bash
npm run db:push
```

### 3. Build Application

```bash
npm run build
npm start
```

## 📱 Frontend Integration

The frontend automatically connects to the backend:

- **Profile Store** - Now syncs with real database
- **Real-time Updates** - Instant sync across pages
- **Authentication** - Complete user management
- **File Uploads** - Direct Cloudinary integration

## 🔍 Database Management

```bash
# Open Prisma Studio (Database GUI)
npm run db:studio

# Reset database (careful!)
npm run db:push --force-reset

# View database
npm run db:studio
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Check database is running
   - Ensure SSL settings match

2. **Cloudinary Upload Fails**
   - Verify API credentials
   - Check file size limits
   - Ensure file types are supported

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check cookie settings
   - Ensure NEXTAUTH_URL matches domain

### Useful Commands:

```bash
# Check database connection
npx prisma db pull

# Reset and reseed database
npx prisma migrate reset

# Generate new Prisma client
npx prisma generate
```

## 🎉 You're Ready!

Your ShareInfo application now has:

- ✅ **Complete Backend API**
- ✅ **PostgreSQL Database**
- ✅ **File Storage (Cloudinary)**
- ✅ **Authentication System**
- ✅ **Real-time Sync**
- ✅ **Production Ready**

Navigate to `http://localhost:3000` and start using your full-stack ShareInfo application!

## 📞 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify all environment variables
3. Ensure database is accessible
4. Check Cloudinary configuration
