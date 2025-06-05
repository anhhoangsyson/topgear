# Development Workflow Guide

## 🔄 Daily Development Workflow

### 1. Bắt đầu ngày làm việc
```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Start development server
npm run dev
```

### 2. Trước khi code
- [ ] Check [Technical Debt Tracker](./TECHNICAL_DEBT.md) for priority items
- [ ] Review [Improvement Plan](./IMPROVEMENT_PLAN.md) for current sprint goals
- [ ] Update [Learning Log](./LEARNING_LOG.md) if continuing previous work

### 3. Khi develop feature mới
1. **Tạo branch mới:**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Plan trước khi code:**
   - Viết plan trong [Learning Log](./LEARNING_LOG.md)
   - Xác định components/files cần tạo/sửa
   - Identify potential technical debt

3. **Coding process:**
   - Follow [Code Review Checklist](./CODE_REVIEW_CHECKLIST.md)
   - Apply [Refactoring Guide](./REFACTORING_GUIDE.md) principles
   - Write clean, typed code

4. **Testing:**
   - Manual testing
   - Check for console errors
   - Test edge cases

### 4. Trước khi commit
- [ ] Run linting: `npm run lint`
- [ ] Format code: `npm run format`
- [ ] Review changes in git diff
- [ ] Update documentation if needed

### 5. Commit và push
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add user authentication system

- Implement login/logout functionality
- Add form validation
- Update user context
- Add error handling for auth failures"

# Push to remote
git push origin feature/feature-name
```

### 6. Kết thúc ngày
- [ ] Update [Learning Log](./LEARNING_LOG.md) với progress
- [ ] Note any issues in [Technical Debt Tracker](./TECHNICAL_DEBT.md)
- [ ] Commit work in progress if incomplete

---

## 📝 Commit Message Convention

### Format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Maintenance tasks

### Examples:
```bash
feat(auth): implement user login system
fix(cart): resolve item quantity update bug
docs(readme): update installation instructions
refactor(components): extract reusable button component
style(header): improve mobile responsiveness
test(auth): add unit tests for login validation
chore(deps): update dependencies to latest versions
```

---

## 🔍 Code Review Process

### Self Review Checklist
Before creating PR, ensure:
- [ ] Code follows project conventions
- [ ] No console.log statements
- [ ] Proper TypeScript types
- [ ] Error handling implemented
- [ ] Documentation updated
- [ ] Performance considered

### Review Others' Code
When reviewing PRs:
- [ ] Understand the feature/fix
- [ ] Check for potential issues
- [ ] Suggest improvements
- [ ] Approve or request changes
- [ ] Be constructive and kind

---

## 🚀 Feature Development Process

### 1. Planning Phase
```markdown
## Feature: [Feature Name]
### Requirements:
- Functional requirements
- Non-functional requirements (performance, security)

### Technical Design:
- Components to create/modify
- API endpoints needed
- Database changes
- State management approach

### Acceptance Criteria:
- [ ] User can do X
- [ ] System handles Y
- [ ] Performance meets Z
```

### 2. Implementation Phase
- Start with data layer (types, API)
- Build UI components
- Implement business logic
- Add error handling
- Test functionality

### 3. Testing Phase
- Unit tests (if applicable)
- Integration testing
- Manual testing scenarios
- Performance testing
- Accessibility testing

### 4. Documentation Phase
- Update README if needed
- Add inline code comments
- Update API documentation
- Record learnings in Learning Log

---

## 🐛 Bug Fix Process

### 1. Investigation
- [ ] Reproduce the bug
- [ ] Identify root cause
- [ ] Assess impact and priority
- [ ] Plan the fix approach

### 2. Implementation
- [ ] Fix the immediate issue
- [ ] Add safeguards to prevent recurrence
- [ ] Consider related areas that might be affected
- [ ] Add/update tests

### 3. Verification
- [ ] Test the fix works
- [ ] Ensure no regression
- [ ] Test edge cases
- [ ] Verify in different environments

### 4. Documentation
- [ ] Update Technical Debt if related
- [ ] Record lessons learned
- [ ] Update documentation if needed

---

## 📊 Performance Monitoring

### Daily Checks
- [ ] Page load speed
- [ ] Bundle size
- [ ] Console errors
- [ ] Network requests

### Weekly Reviews
- [ ] Core Web Vitals
- [ ] Lighthouse scores
- [ ] Error tracking review
- [ ] User feedback analysis

---

## 🎯 Learning Goals

### Weekly Learning Targets
Set specific learning goals each week:
- [ ] Learn new TypeScript pattern
- [ ] Improve React performance technique
- [ ] Study security best practice
- [ ] Explore new tool/library

### Monthly Skill Assessment
Review progress on:
- **Technical Skills**: TypeScript, React, Next.js
- **Best Practices**: Code quality, security, performance
- **Tools**: Development tools, debugging, testing
- **Soft Skills**: Problem-solving, documentation

---

## 🔧 Tools and Extensions

### Required VS Code Extensions
- TypeScript Hero
- ESLint
- Prettier/Biome
- Auto Rename Tag
- GitLens
- Thunder Client (for API testing)

### Useful Development Tools
- React Developer Tools
- Chrome DevTools
- Postman/Thunder Client
- MongoDB Compass (if using MongoDB)

---

## 🆘 When You're Stuck

### Problem-Solving Steps
1. **Understand the problem clearly**
2. **Break it down into smaller pieces**
3. **Search documentation/Stack Overflow**
4. **Try different approaches**
5. **Ask for help** (with specific questions)

### Resources for Help
- Official documentation (Next.js, React, TypeScript)
- Stack Overflow
- GitHub Discussions
- Discord/Reddit communities
- Team members

### Document Your Solution
When you solve a problem:
- [ ] Add to Learning Log
- [ ] Create reusable utility if applicable
- [ ] Update documentation
- [ ] Share knowledge with team
