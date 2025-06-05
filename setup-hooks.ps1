# Git Hooks Setup
# Run this script to set up automatic code validation

Write-Host "🔧 Setting up Git hooks for Top Gear project..." -ForegroundColor Cyan

# Create .git/hooks directory if it doesn't exist
$hooksDir = ".git/hooks"
if (-not (Test-Path $hooksDir)) {
    New-Item -ItemType Directory -Path $hooksDir -Force
}

# Pre-commit hook content
$preCommitHook = @"
#!/bin/sh
# Top Gear pre-commit hook
# Automatically runs code quality checks before each commit

echo "🔍 Running pre-commit checks..."

# Check if Node.js is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed or not in PATH"
    exit 1
fi

# Run linting
echo "Checking code quality..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Please fix the issues before committing."
    exit 1
fi

# Format code
echo "Formatting code..."
npm run format

# Check TypeScript
echo "Checking TypeScript..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ TypeScript check failed. Please fix the errors before committing."
    exit 1
fi

# Check for console.log statements
echo "Checking for console.log statements..."
if grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" > /dev/null; then
    echo "⚠️ Warning: console.log statements found in source code."
    echo "Consider removing them before committing to production."
    echo "Files with console.log:"
    grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" -l
    
    # Ask for confirmation
    echo "Do you want to continue? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Commit aborted."
        exit 1
    fi
fi

echo "✅ All pre-commit checks passed!"
"@

# Pre-push hook content
$prePushHook = @"
#!/bin/sh
# Top Gear pre-push hook
# Runs additional checks before pushing to remote

echo "🚀 Running pre-push checks..."

# Run build test
echo "Testing build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the issues before pushing."
    exit 1
fi

echo "✅ All pre-push checks passed!"
"@

# Commit message hook content
$commitMsgHook = @"
#!/bin/sh
# Top Gear commit message hook
# Validates commit message format

commit_regex='^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "❌ Invalid commit message format!"
    echo ""
    echo "Commit message should follow this format:"
    echo "  <type>(<scope>): <description>"
    echo ""
    echo "Types: feat, fix, docs, style, refactor, test, chore"
    echo "Example: feat(auth): add user login functionality"
    echo ""
    echo "Your commit message:"
    cat "$1"
    echo ""
    exit 1
fi
"@

# Write hooks to files
try {
    # Pre-commit hook
    $preCommitPath = "$hooksDir/pre-commit"
    $preCommitHook | Out-File -FilePath $preCommitPath -Encoding ASCII -NoNewline
    
    # Pre-push hook
    $prePushPath = "$hooksDir/pre-push"
    $prePushHook | Out-File -FilePath $prePushPath -Encoding ASCII -NoNewline
    
    # Commit message hook
    $commitMsgPath = "$hooksDir/commit-msg"
    $commitMsgHook | Out-File -FilePath $commitMsgPath -Encoding ASCII -NoNewline
    
    Write-Host "✅ Git hooks created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Hooks installed:" -ForegroundColor Yellow
    Write-Host "  - pre-commit: Runs linting and TypeScript checks" -ForegroundColor White
    Write-Host "  - pre-push: Tests build before pushing" -ForegroundColor White
    Write-Host "  - commit-msg: Validates commit message format" -ForegroundColor White
    Write-Host ""
    Write-Host "Note: On Windows, you may need to ensure Git can execute shell scripts." -ForegroundColor Yellow
    Write-Host "If hooks don't work, you can manually run checks using dev-helper.ps1" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Failed to create Git hooks: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You can manually create these hooks or use dev-helper.ps1 for validation." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "1. Test the hooks by making a commit" -ForegroundColor White
Write-Host "2. Use conventional commit messages (feat:, fix:, etc.)" -ForegroundColor White
Write-Host "3. Run .\dev-helper.ps1 commit 'message' for guided commits" -ForegroundColor White
