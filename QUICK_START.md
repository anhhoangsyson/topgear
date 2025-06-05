# 🚀 Quick Start Guide

## ⚡ 30-Second Setup

```powershell
# Clone and setup
git clone <repository-url>
cd top-gear
npm install
cp .env.example .env.local

# Start development
npm run dev
```

**Open**: http://localhost:3000

---

## 📋 Essential Commands

### Development
```powershell
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Check code quality
npm run format       # Format code
```

### Quick Checks
```powershell
# Check if everything works
npm run lint && npm run format

# Check TypeScript
npx tsc --noEmit

# Check for unused dependencies
npx depcheck
```

---

## 🔧 Must-Have Environment Variables

Add to `.env.local`:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/topgear
NEXT_PUBLIC_API_URL_NEXT_SERVER=http://localhost:3000
```

---

## 📁 Key Files to Know

### Core Files
- `src/app/layout.tsx` - Root layout
- `src/app/page.tsx` - Homepage
- `src/components/` - Reusable components
- `src/lib/auth.ts` - Authentication setup

### Config Files
- `tailwind.config.ts` - Styling config
- `next.config.ts` - Next.js config
- `tsconfig.json` - TypeScript config
- `biome.json` - Code formatting

---

## 🎯 First Tasks for New Developers

### 1. Explore Codebase (15 mins)
- [ ] Browse `src/app/` folder structure
- [ ] Look at `src/components/ui/` components
- [ ] Check `src/types/` for TypeScript definitions

### 2. Make First Change (30 mins)
- [ ] Edit homepage title in `src/app/page.tsx`
- [ ] Update a component style
- [ ] Add your name to a comment somewhere

### 3. Run Quality Checks (5 mins)
- [ ] Run `npm run lint`
- [ ] Run `npm run format`
- [ ] Check no console errors

---

## 🚨 Common Issues & Quick Fixes

### Issue: MongoDB Connection Error
```bash
# Solution: Check MongoDB is running
# Windows:
net start MongoDB

# Or use MongoDB Atlas connection string
```

### Issue: NextAuth Error
```bash
# Solution: Add NEXTAUTH_SECRET to .env.local
NEXTAUTH_SECRET=your-random-secret-key
```

### Issue: TypeScript Errors
```bash
# Solution: Install dependencies and restart TS server
npm install
# In VS Code: Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

### Issue: Styling Not Working
```bash
# Solution: Check Tailwind setup
npm run dev
# Ensure globals.css is imported in layout.tsx
```

---

## 📚 Next Steps

After quick start:
1. **Read**: [Setup Guide](./SETUP_GUIDE.md) for detailed setup
2. **Follow**: [Development Workflow](./DEVELOPMENT_WORKFLOW.md)
3. **Use**: [Code Review Checklist](./CODE_REVIEW_CHECKLIST.md)
4. **Track**: Progress in [Learning Log](./LEARNING_LOG.md)

---

## 💡 Pro Tips

### VS Code Setup
Install these extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Hero
- Auto Rename Tag

### Keyboard Shortcuts
- `Ctrl+Shift+P` - Command palette
- `Ctrl+`` - Toggle terminal
- `Alt+Shift+F` - Format document
- `F2` - Rename symbol

### Development Workflow
1. **Always** run `npm run lint` before commit
2. **Use** TypeScript strict mode
3. **Follow** conventional commit messages
4. **Update** documentation when needed

---

## 🆘 Need Help?

1. **Check documentation** in this repo
2. **Search existing issues** in GitHub
3. **Ask specific questions** with code examples
4. **Use debugging tools** (React DevTools, Chrome DevTools)

### Useful Resources
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev/)