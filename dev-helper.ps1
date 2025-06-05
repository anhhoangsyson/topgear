# Top Gear Development Helper Script
# PowerShell script to streamline development workflow

param(
    [Parameter(Position=0)]
    [string]$Command,
    [string]$Message,
    [string]$Type,
    [switch]$Help
)

# Display help information
function Show-Help {
    Write-Host "`n🚀 Top Gear Development Helper" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "`nAvailable commands:" -ForegroundColor Yellow
    Write-Host "  setup           - Initial project setup"
    Write-Host "  dev             - Start development server"
    Write-Host "  check           - Run all quality checks"
    Write-Host "  clean           - Clean and reinstall dependencies"
    Write-Host "  commit <msg>    - Smart commit with conventional format"
    Write-Host "  deploy          - Build and deploy preparation"
    Write-Host "  log             - Update daily progress log"
    Write-Host "  debt            - Check technical debt status"
    Write-Host "  backup          - Create project backup"
    Write-Host "`nExamples:" -ForegroundColor Green
    Write-Host "  .\dev-helper.ps1 setup"
    Write-Host "  .\dev-helper.ps1 commit 'add user authentication'"
    Write-Host "  .\dev-helper.ps1 check"
    Write-Host "`n"
}

# Initial project setup
function Start-Setup {
    Write-Host "🔧 Setting up Top Gear project..." -ForegroundColor Cyan
    
    # Check if Node.js is installed
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
        return
    }
    
    # Install dependencies
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    # Copy environment file if it doesn't exist
    if (-not (Test-Path ".env.local")) {
        Write-Host "📄 Creating .env.local from template..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env.local"
        Write-Host "⚠️  Please update .env.local with your actual values" -ForegroundColor Yellow
    }
    
    Write-Host "✅ Setup complete! Run '.\dev-helper.ps1 dev' to start development." -ForegroundColor Green
}

# Start development server
function Start-Development {
    Write-Host "🚀 Starting development server..." -ForegroundColor Cyan
    
    # Check if .env.local exists
    if (-not (Test-Path ".env.local")) {
        Write-Host "⚠️  .env.local not found. Run '.\dev-helper.ps1 setup' first." -ForegroundColor Yellow
    }
    
    npm run dev
}

# Run quality checks
function Start-QualityCheck {
    Write-Host "🔍 Running quality checks..." -ForegroundColor Cyan
    
    Write-Host "`n1. Checking linting..." -ForegroundColor Yellow
    npm run lint
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Linting failed. Please fix the issues." -ForegroundColor Red
        return
    }
    
    Write-Host "`n2. Checking TypeScript..." -ForegroundColor Yellow
    npx tsc --noEmit
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ TypeScript check failed. Please fix the issues." -ForegroundColor Red
        return
    }
    
    Write-Host "`n3. Formatting code..." -ForegroundColor Yellow
    npm run format
    
    Write-Host "`n✅ All quality checks passed!" -ForegroundColor Green
}

# Clean and reinstall dependencies
function Start-Clean {
    Write-Host "🧹 Cleaning project..." -ForegroundColor Cyan
    
    # Remove node_modules and package-lock.json
    if (Test-Path "node_modules") {
        Write-Host "Removing node_modules..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force "node_modules"
    }
    
    if (Test-Path "package-lock.json") {
        Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
        Remove-Item "package-lock.json"
    }
    
    if (Test-Path ".next") {
        Write-Host "Removing .next..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force ".next"
    }
    
    Write-Host "Reinstalling dependencies..." -ForegroundColor Yellow
    npm install
    
    Write-Host "✅ Clean complete!" -ForegroundColor Green
}

# Smart commit with conventional format
function Start-Commit {
    param([string]$CommitMessage)
    
    if (-not $CommitMessage) {
        Write-Host "❌ Please provide a commit message." -ForegroundColor Red
        Write-Host "Example: .\dev-helper.ps1 commit 'add user authentication'" -ForegroundColor Yellow
        return
    }
    
    Write-Host "🔍 Running pre-commit checks..." -ForegroundColor Cyan
    
    # Run quality checks first
    npm run lint
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Commit aborted: Linting failed." -ForegroundColor Red
        return
    }
    
    npm run format
    
    # Determine commit type based on message
    $commitType = "feat"
    if ($CommitMessage -match "fix|bug") { $commitType = "fix" }
    elseif ($CommitMessage -match "doc|readme") { $commitType = "docs" }
    elseif ($CommitMessage -match "style|format") { $commitType = "style" }
    elseif ($CommitMessage -match "refactor|improve") { $commitType = "refactor" }
    elseif ($CommitMessage -match "test") { $commitType = "test" }
    elseif ($CommitMessage -match "chore|update") { $commitType = "chore" }
    
    $formattedMessage = "$commitType`: $CommitMessage"
    
    Write-Host "📝 Committing with message: $formattedMessage" -ForegroundColor Green
    
    git add .
    git commit -m $formattedMessage
    
    Write-Host "✅ Commit successful!" -ForegroundColor Green
}

# Prepare for deployment
function Start-Deploy {
    Write-Host "🚀 Preparing for deployment..." -ForegroundColor Cyan
    
    # Run all checks
    Start-QualityCheck
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Deployment preparation failed due to quality check issues." -ForegroundColor Red
        return
    }
    
    # Build the project
    Write-Host "`nBuilding project..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed. Please fix the issues." -ForegroundColor Red
        return
    }
    
    Write-Host "✅ Deployment preparation complete!" -ForegroundColor Green
    Write-Host "You can now deploy to your hosting platform." -ForegroundColor Cyan
}

# Update daily progress log
function Update-ProgressLog {
    $today = Get-Date -Format "yyyy-MM-dd"
    $logFile = "DAILY_PROGRESS.md"
    
    Write-Host "📝 Opening daily progress log for $today..." -ForegroundColor Cyan
    
    if (Get-Command code -ErrorAction SilentlyContinue) {
        code $logFile
    } else {
        notepad $logFile
    }
}

# Check technical debt status
function Check-TechnicalDebt {
    Write-Host "Checking technical debt status..." -ForegroundColor Cyan
    
    $debtFile = "TECHNICAL_DEBT.md"
    
    if (Test-Path $debtFile) {
        if (Get-Command code -ErrorAction SilentlyContinue) {
            code $debtFile
        } else {
            notepad $debtFile
        }
    } else {
        Write-Host "Technical debt tracker not found." -ForegroundColor Red
    }
}


# Create project backup
function Create-Backup {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupName = "top-gear-backup-$timestamp.zip"
    
    Write-Host "Creating backup: $backupName..." -ForegroundColor Cyan
    
    # Create backup excluding node_modules and .git
    $exclude = @("node_modules", ".git", ".next", "*.zip")
    
    Compress-Archive -Path "*" -DestinationPath $backupName -CompressionLevel Optimal
    
    Write-Host "✅ Backup created: $backupName" -ForegroundColor Green
}

# Main script logic
switch ($Command.ToLower()) {
    "setup" { Start-Setup }
    "dev" { Start-Development }
    "check" { Start-QualityCheck }
    "clean" { Start-Clean }
    "commit" { Start-Commit -CommitMessage $Message }
    "deploy" { Start-Deploy }
    "log" { Update-ProgressLog }
    "debt" { Check-TechnicalDebt }
    "backup" { Create-Backup }
    "help" { Show-Help }
    "" { Show-Help }
    default { 
        Write-Host "❌ Unknown command: $Command" -ForegroundColor Red
        Show-Help 
    }
}

if ($Help) { Show-Help }