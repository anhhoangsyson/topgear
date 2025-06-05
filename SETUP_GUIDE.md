# Project Setup Instructions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- MongoDB database (local or Atlas)

### 1. Clone and Setup
```bash
# Clone repository
git clone <your-repository-url>
cd top-gear

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

### 2. Environment Configuration
Edit `.env.local` with your values:

```bash
# Required for basic functionality
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-secret-key

# Database
MONGODB_URI=mongodb://localhost:27017/topgear

# API URLs
NEXT_PUBLIC_API_URL_NEXT_SERVER=http://localhost:3000
NEXT_PUBLIC_EXPRESS_API_URL=https://top-gear-be.vercel.app/api/v1
```

### 3. Start Development
```bash
# Start development server
npm run dev

# Open browser
# Visit http://localhost:3000
```

---

## 🔧 Detailed Setup

### Local MongoDB Setup
If you don't have MongoDB Atlas:

1. **Install MongoDB locally:**
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB service:**
   ```bash
   # Windows (if installed as service)
   net start MongoDB
   
   # macOS/Linux
   mongod
   ```

3. **Update .env.local:**
   ```bash
   MONGODB_URI=mongodb://localhost:27017/topgear
   ```

### MongoDB Atlas Setup (Recommended)
1. **Create account** at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Create new cluster** (free tier available)
3. **Get connection string** and update `.env.local`
4. **Whitelist your IP** in Atlas security settings

---

## 📦 Scripts Overview

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Biome
npm run type-check   # Check TypeScript types (if available)

# Database (if using Prisma - future enhancement)
# npm run db:push     # Push schema changes
# npm run db:seed     # Seed database with test data
```

---

## 🗂️ Project Structure Explanation

```
src/
├── app/                     # Next.js 14 App Router
│   ├── (client)/           # Client-side pages
│   ├── admin/              # Admin panel
│   ├── api/                # API routes
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI components
│   ├── common/             # Common components
│   └── [feature]/          # Feature-specific components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
│   ├── auth.ts             # Authentication config
│   ├── mongodb.ts          # Database connection
│   └── utils.ts            # General utilities
├── store/                  # State management (Zustand)
├── types/                  # TypeScript definitions
└── schemaValidations/      # Form validation schemas
```

---

## 🎨 Styling Setup

### Tailwind CSS
The project uses Tailwind CSS for styling:

1. **Configuration**: `tailwind.config.ts`
2. **Global styles**: `src/app/globals.css`
3. **Component library**: Radix UI + Tailwind

### CSS Custom Properties
Available CSS variables in `globals.css`:
```css
:root {
  --background: /* background color */
  --foreground: /* text color */
  --primary: /* primary brand color */
  /* ... more variables */
}
```

---

## 🔐 Authentication Setup

### NextAuth.js Configuration
1. **Basic setup** is in `src/lib/auth.ts`
2. **Add providers** (Google, GitHub, etc.) in the same file
3. **Configure OAuth apps** in respective platforms
4. **Update environment variables** with client IDs/secrets

### Example OAuth Setup:
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

---

## 📱 API Structure

### Next.js API Routes
Located in `src/app/api/`:
- `auth/` - Authentication endpoints
- `user/` - User management
- `products/` - Product operations
- `category/` - Category management

### External API Integration
The app integrates with an external backend:
- Base URL: `NEXT_PUBLIC_EXPRESS_API_URL`
- Used for: Product data, inventory, orders

---

## 🧪 Testing Setup (Future Enhancement)

### Jest + Testing Library
```bash
# Install testing dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
npm run test:watch
npm run test:coverage
```

### Testing Structure
```
__tests__/
├── components/     # Component tests
├── hooks/          # Hook tests
├── utils/          # Utility function tests
└── pages/          # Page tests
```

---

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main

### Other Platforms
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Variables for Production
Make sure to set all required environment variables:
- `NEXTAUTH_URL` (your domain)
- `NEXTAUTH_SECRET` (secure random string)
- `MONGODB_URI` (production database)
- All OAuth credentials

---

## 🔍 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: MongoServerError: bad auth
```
**Solution**: Check username/password in connection string

#### 2. NextAuth.js Error
```
Error: NEXTAUTH_SECRET environment variable is not set
```
**Solution**: Add `NEXTAUTH_SECRET` to `.env.local`

#### 3. Build Errors
```
Type error: Cannot find module
```
**Solution**: Check import paths and TypeScript configuration

#### 4. Styling Issues
```
Styles not applying correctly
```
**Solution**: Check Tailwind configuration and CSS import order

### Getting Help
1. **Check documentation** in this repository
2. **Review error logs** carefully
3. **Search GitHub Issues** for similar problems
4. **Create detailed issue** with reproduction steps

---

## 📋 Post-Setup Checklist

After completing setup:
- [ ] Development server starts without errors
- [ ] Database connection works
- [ ] Authentication flow works
- [ ] All pages load correctly
- [ ] No console errors
- [ ] Linting passes: `npm run lint`
- [ ] Code formatting works: `npm run format`

### Next Steps
1. **Read** [Development Workflow](./DEVELOPMENT_WORKFLOW.md)
2. **Review** [Code Review Checklist](./CODE_REVIEW_CHECKLIST.md)
3. **Start** with [Learning Log](./LEARNING_LOG.md)
4. **Check** [Technical Debt Tracker](./TECHNICAL_DEBT.md) for immediate tasks

---

## 💡 Tips for New Developers

1. **Start small**: Begin with simple components or pages
2. **Follow patterns**: Look at existing code for patterns to follow
3. **Use TypeScript**: Take advantage of type checking
4. **Document learning**: Keep the Learning Log updated
5. **Ask questions**: Don't hesitate to ask for help

### Recommended Learning Path
1. **Explore the codebase** structure
2. **Make a small change** (e.g., update a component)
3. **Add a simple feature** (e.g., new page or component)
4. **Work on** items from Technical Debt Tracker
5. **Contribute to** major features
