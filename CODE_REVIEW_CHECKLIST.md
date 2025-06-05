# Code Review Checklist

## 🔍 Pre-Commit Checklist

### 1. Code Quality
- [ ] Code follows consistent naming conventions
- [ ] No unused imports or variables
- [ ] No console.log statements in production code
- [ ] Proper error handling implemented
- [ ] Code is properly commented where necessary

### 2. TypeScript
- [ ] All types are properly defined
- [ ] No `any` types used unnecessarily
- [ ] Proper interface/type definitions
- [ ] Generic types used appropriately

### 3. React/Next.js
- [ ] Components are properly structured
- [ ] Hooks are used correctly
- [ ] Proper key props for lists
- [ ] Server/Client components used appropriately
- [ ] No memory leaks (useEffect cleanup)

### 4. Performance
- [ ] Images are optimized
- [ ] Components are memoized when needed
- [ ] No unnecessary re-renders
- [ ] Proper loading states

### 5. Security
- [ ] User inputs are sanitized
- [ ] Proper authentication checks
- [ ] No sensitive data exposed
- [ ] CORS properly configured

### 6. Accessibility
- [ ] Proper ARIA labels
- [ ] Keyboard navigation works
- [ ] Color contrast meets standards
- [ ] Screen reader friendly

### 7. Testing
- [ ] Unit tests written for complex logic
- [ ] Integration tests for critical paths
- [ ] Manual testing completed
- [ ] Edge cases considered

---

## 📝 Code Review Template

### Before implementing a feature:
```markdown
## Feature: [Tên feature]
### Requirements:
- [ ] Requirement 1
- [ ] Requirement 2

### Technical approach:
- **Architecture**: Mô tả cách implement
- **Components needed**: List components
- **API changes**: Describe API changes
- **Database changes**: Describe DB changes

### Testing plan:
- [ ] Unit tests for [specific functions]
- [ ] Integration tests for [user flows]
- [ ] Manual testing checklist
```

### After implementing a feature:
```markdown
## Completed: [Tên feature]
### Changes made:
- **Files modified**: List of files
- **New files**: List of new files
- **Dependencies added**: List of new dependencies

### Testing completed:
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Performance tested

### Next steps:
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Performance monitoring
```

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All tests pass
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Performance benchmarks met

### Post-deployment
- [ ] Application starts successfully
- [ ] All features work as expected
- [ ] Performance monitoring active
- [ ] Error tracking functional
- [ ] Rollback plan ready

---

## 📊 Performance Metrics to Track

### Core Web Vitals
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] First Input Delay (FID) < 100ms
- [ ] Cumulative Layout Shift (CLS) < 0.1

### Bundle Size
- [ ] Main bundle < 500KB
- [ ] Total bundle < 1MB
- [ ] Unused code eliminated

### API Performance
- [ ] API response times < 200ms
- [ ] Database queries optimized
- [ ] Caching implemented where appropriate
