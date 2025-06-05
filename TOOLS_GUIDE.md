# 🛠️ Automation Tools Usage Guide

## 📋 Overview

Top Gear project bao gồm một bộ automation tools để giúp streamline development workflow và maintain code quality. Tất cả tools đều được thiết kế để chạy trên Windows PowerShell.

---

## 🚀 Quick Commands

### Daily Development
```powershell
# Setup project lần đầu
.\dev-helper.ps1 setup

# Bắt đầu development
.\dev-helper.ps1 dev

# Check code quality
.\dev-helper.ps1 check

# Commit với validation
.\dev-helper.ps1 commit "add new feature"
```

### Code Analysis
```powershell
# Phân tích toàn bộ project
.\code-analyzer.ps1

# Chỉ xem statistics
.\code-analyzer.ps1 stats

# Xuất report ra file
.\code-analyzer.ps1 -Export
```

---

## 🔧 Tool Details

### 1. dev-helper.ps1
**Mục đích**: Automation cho daily development tasks

**Available Commands**:
- `setup` - Initial project setup
- `dev` - Start development server with checks
- `check` - Run all quality checks (linting, TypeScript, formatting)
- `clean` - Clean and reinstall dependencies
- `commit <message>` - Smart commit with validation
- `deploy` - Prepare for deployment
- `log` - Open daily progress log
- `debt` - Check technical debt tracker
- `backup` - Create project backup

**Examples**:
```powershell
.\dev-helper.ps1 setup
.\dev-helper.ps1 commit "fix user authentication bug"
.\dev-helper.ps1 check
```

### 2. code-analyzer.ps1
**Mục đích**: Analyze code quality và generate reports

**Available Commands**:
- `full` - Complete analysis (default)
- `stats` - Project statistics only
- `quality` - Code quality checks only
- `deps` - Dependency analysis only
- `perf` - Performance analysis only

**Options**:
- `-Export` - Export report to file
- `-Detailed` - Show detailed output

**Examples**:
```powershell
.\code-analyzer.ps1
.\code-analyzer.ps1 quality -Export
.\code-analyzer.ps1 stats
```

### 3. setup-hooks.ps1
**Mục đích**: Setup Git hooks for automatic validation

**Usage**:
```powershell
.\setup-hooks.ps1
```

**What it does**:
- Creates pre-commit hook (runs linting, TypeScript checks)
- Creates pre-push hook (tests build)
- Creates commit-msg hook (validates commit message format)

---

## 📊 Code Quality Checks

### Automated Checks
The tools automatically check for:

1. **Console.log statements** - Should be removed for production
2. **TypeScript 'any' types** - Should use proper types
3. **Large files (>300 lines)** - Consider refactoring
4. **Outdated dependencies** - Keep packages updated
5. **Security vulnerabilities** - npm audit
6. **Bundle size** - Monitor performance impact

### Quality Score
The analyzer generates a quality score (0-100) based on:
- Number of issues found
- Code maintainability factors
- Security considerations
- Performance implications

---

## 🔄 Recommended Workflow

### Daily Routine
```powershell
# Morning setup
git pull origin main
.\dev-helper.ps1 dev

# Before any commit
.\dev-helper.ps1 check
.\dev-helper.ps1 commit "your message"

# End of day
.\code-analyzer.ps1 -Export
# Update DAILY_PROGRESS.md
```

### Weekly Tasks
```powershell
# Weekly code quality review
.\code-analyzer.ps1 full -Export

# Dependency updates
npm outdated
npm update

# Project cleanup
.\dev-helper.ps1 clean
```

### Before Release
```powershell
# Complete preparation
.\dev-helper.ps1 deploy

# Final quality check
.\code-analyzer.ps1 -Export

# Backup
.\dev-helper.ps1 backup
```

---

## 📝 Integration with Documentation System

### Automatic Updates
Tools tích hợp với documentation system:

1. **Learning Log** - `.\dev-helper.ps1 log` opens learning log
2. **Technical Debt** - `.\dev-helper.ps1 debt` opens debt tracker
3. **Daily Progress** - Auto-updated with each development session
4. **Quality Reports** - Exported to track improvements over time

### Workflow Integration
```powershell
# Complete development cycle
1. .\dev-helper.ps1 dev          # Start development
2. # Make your changes
3. .\dev-helper.ps1 check        # Validate code
4. .\dev-helper.ps1 commit "msg" # Commit with validation
5. .\code-analyzer.ps1 -Export   # Generate quality report
6. # Update documentation as needed
```

---

## 🚨 Troubleshooting

### Common Issues

#### PowerShell Execution Policy
```powershell
# If scripts won't run, set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Git Hooks Not Working
```powershell
# Re-run hook setup
.\setup-hooks.ps1

# Or use manual validation
.\dev-helper.ps1 check
```

#### Node.js/NPM Issues
```powershell
# Clean and reinstall
.\dev-helper.ps1 clean

# Check Node.js version
node --version  # Should be 18+
```

---

## 📈 Continuous Improvement

### Metrics Tracking
Use these tools to track improvement over time:

1. **Quality Score Trend** - Export weekly reports
2. **Technical Debt Reduction** - Monitor debt tracker
3. **Code Statistics** - Track lines of code, files, complexity
4. **Dependency Health** - Monitor outdated packages

### Optimization Tips

1. **Run quality checks frequently** - Don't let issues accumulate
2. **Use conventional commits** - Better project history
3. **Export reports regularly** - Track improvement trends
4. **Update dependencies monthly** - Stay secure and current
5. **Review large files quarterly** - Consider refactoring

---

## 🎯 Best Practices

### Development Workflow
1. Always run `.\dev-helper.ps1 check` before commits
2. Use `.\dev-helper.ps1 commit` for guided commits
3. Export quality reports weekly
4. Update documentation regularly

### Code Quality
1. Aim for 90+ quality score
2. Remove console.log statements before production
3. Use proper TypeScript types (avoid 'any')
4. Keep files under 300 lines
5. Monitor bundle size

### Project Maintenance
1. Review technical debt weekly
2. Update dependencies monthly
3. Create backups before major changes
4. Export quality reports for historical tracking

---

## 🔗 Related Documentation

- [Quick Start Guide](./QUICK_START.md) - Get started quickly
- [Development Workflow](./DEVELOPMENT_WORKFLOW.md) - Detailed workflow
- [Code Review Checklist](./CODE_REVIEW_CHECKLIST.md) - Quality standards
- [Technical Debt Tracker](./TECHNICAL_DEBT.md) - Monitor debt
- [Learning Log](./LEARNING_LOG.md) - Track improvements

---

*These tools are designed to make your development experience smoother and help maintain high code quality. Use them regularly for best results!*
