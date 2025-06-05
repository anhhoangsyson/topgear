# Top Gear - E-commerce Platform

A modern e-commerce platform built with Next.js, TypeScript, and Tailwind CSS. This project focuses on delivering a high-quality, maintainable codebase following industry best practices.

## 🚀 Project Overview

Top Gear is an e-commerce platform specializing in laptops and tech accessories. The project emphasizes:
- **Code Quality**: Clean, maintainable, and well-documented code
- **Performance**: Optimized for speed and user experience
- **Security**: Following security best practices
- **Developer Experience**: Easy to understand and contribute to

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Query + Zustand
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Code Quality**: ESLint + Biome

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── store/              # State management (Zustand)
├── types/              # TypeScript type definitions
└── schemaValidations/  # Form validation schemas
```

## 🎯 Getting Started

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd top-gear
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
# Fill in your environment variables
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Documentation

### 📖 Getting Started
- **[Quick Start](./QUICK_START.md)** - 30-second setup guide
- **[Setup Guide](./SETUP_GUIDE.md)** - Complete installation and configuration guide
- **[Development Workflow](./DEVELOPMENT_WORKFLOW.md)** - Daily development practices and workflows

### 🔧 Development Resources
- **[Code Review Checklist](./CODE_REVIEW_CHECKLIST.md)** - Ensure code quality standards
- **[Refactoring Guide](./REFACTORING_GUIDE.md)** - Best practices for code improvements
- **[Technical Debt Tracker](./TECHNICAL_DEBT.md)** - Monitor and manage technical debt

### 📝 Project Management
- **[Learning Log](./LEARNING_LOG.md)** - Track learning progress and improvements
- **[Daily Progress](./DAILY_PROGRESS.md)** - Daily development tracking
- **[Improvement Plan](./IMPROVEMENT_PLAN.md)** - Roadmap for project enhancements

### 🤖 Automation Tools
- **[Tools Guide](./TOOLS_GUIDE.md)** - Complete guide to all automation tools
- **[dev-helper.ps1](./dev-helper.ps1)** - PowerShell automation for common tasks
- **[code-analyzer.ps1](./code-analyzer.ps1)** - Code quality analysis and reporting
- **[setup-hooks.ps1](./setup-hooks.ps1)** - Git hooks setup for automatic validation
- **[dev-scripts.json](./dev-scripts.json)** - Development workflows and checklists

### 📋 Quick Reference
- **Environment Setup**: Copy `.env.example` to `.env.local` and configure
- **Code Standards**: Follow TypeScript strict mode and ESLint rules
- **Commit Format**: Use conventional commits (feat/fix/docs/refactor)
- **Before PR**: Run `npm run lint` and `npm run format`

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Biome

# Automation Tools (PowerShell)
.\dev-helper.ps1 setup        # Quick project setup
.\dev-helper.ps1 dev          # Start development with checks
.\dev-helper.ps1 check        # Run all quality checks
.\dev-helper.ps1 commit "msg" # Smart commit with validation
.\code-analyzer.ps1           # Analyze code quality
.\code-analyzer.ps1 stats     # Project statistics
```

## 📋 Best Practices

This project follows several best practices:

1. **Code Organization**: Clear folder structure and component organization
2. **Type Safety**: Comprehensive TypeScript usage
3. **Error Handling**: Consistent error handling patterns
4. **Performance**: Optimized images, code splitting, and caching
5. **Accessibility**: WCAG compliant UI components
6. **Testing**: (In progress) Unit and integration tests

## 🤝 Contributing

1. **Before contributing**, read our documentation:
   - Check the [Code Review Checklist](./CODE_REVIEW_CHECKLIST.md)
   - Review the [Refactoring Guide](./REFACTORING_GUIDE.md)
   - Update the [Learning Log](./LEARNING_LOG.md) with your changes

2. **Development workflow:**
   - Create a feature branch
   - Make your changes following our guidelines
   - Test your changes thoroughly
   - Submit a pull request with detailed description

## 📊 Project Metrics

- **Code Quality**: Maintaining high standards with linting and formatting
- **Performance**: Monitoring Core Web Vitals
- **Security**: Regular security audits and best practices
- **Documentation**: Comprehensive documentation for all features

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main branch

For other platforms, use the standard Next.js build process:
```bash
npm run build
npm run start
```

## 📞 Support

For questions or issues:
- Check the documentation in this repository
- Review the [Technical Debt Tracker](./TECHNICAL_DEBT.md) for known issues
- Create an issue in the repository

---

**Note**: This project is continuously improved based on best practices and lessons learned. Check the [Learning Log](./LEARNING_LOG.md) for the latest updates and improvements.
