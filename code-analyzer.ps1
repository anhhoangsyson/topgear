# Code Quality Analyzer for Top Gear Project
# PowerShell script to analyze code quality and generate reports

param(
    [Parameter(Position=0)]
    [string]$Command = "full",
    [switch]$Detailed,
    [switch]$Export
)

# Color codes for output
$Colors = @{
    Info = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
    Header = "Magenta"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Colors[$Color]
}

function Get-ProjectStats {
    Write-ColorOutput "`n[PROJECT STATISTICS]" "Header"
    Write-ColorOutput "===================" "Header"
    
    # Check if src directory exists
    if (-not (Test-Path "src")) {
        Write-ColorOutput "Warning: src directory not found!" "Warning"
        return
    }
    
    # Count files
    $tsxFiles = (Get-ChildItem -Recurse -Include "*.tsx" -Path "src" -ErrorAction SilentlyContinue).Count
    $tsFiles = (Get-ChildItem -Recurse -Include "*.ts" -Path "src" -ErrorAction SilentlyContinue).Count
    $totalFiles = $tsxFiles + $tsFiles
    
    Write-ColorOutput "TypeScript files: $tsFiles" "Info"
    Write-ColorOutput "React components: $tsxFiles" "Info"
    Write-ColorOutput "Total source files: $totalFiles" "Info"
    
    # Count lines of code
    $totalLines = 0
    try {
        Get-ChildItem -Recurse -Include "*.ts", "*.tsx" -Path "src" -ErrorAction SilentlyContinue | ForEach-Object {
            $content = Get-Content $_.FullName -ErrorAction SilentlyContinue
            if ($content) {
                $totalLines += $content.Count
            }
        }
        Write-ColorOutput "Total lines of code: $totalLines" "Info"
    } catch {
        Write-ColorOutput "Could not count lines of code" "Warning"
    }
      # Package.json analysis
    if (Test-Path "package.json") {
        try {
            $packageJson = Get-Content "package.json" | ConvertFrom-Json
            $dependencies = 0
            $devDependencies = 0
            
            if ($packageJson.dependencies) {
                $dependencies = ($packageJson.dependencies | Get-Member -MemberType NoteProperty).Count
            }
            if ($packageJson.devDependencies) {
                $devDependencies = ($packageJson.devDependencies | Get-Member -MemberType NoteProperty).Count
            }
            
            Write-ColorOutput "Dependencies: $dependencies" "Info"
            Write-ColorOutput "Dev Dependencies: $devDependencies" "Info"
        } catch {
            Write-ColorOutput "Could not parse package.json" "Warning"
        }
    }
}

function Test-CodeQuality {
    Write-ColorOutput "`n[CODE QUALITY ANALYSIS]" "Header"
    Write-ColorOutput "=======================" "Header"
    
    $issues = @()
    
    if (-not (Test-Path "src")) {
        Write-ColorOutput "Warning: src directory not found!" "Warning"
        return $issues
    }
    
    # Check for console.log statements
    Write-ColorOutput "`nChecking for console.log statements..." "Info"
    try {
        $consoleLogFiles = Get-ChildItem -Recurse -Include "*.ts", "*.tsx" -Path "src" -ErrorAction SilentlyContinue | 
            Select-String -Pattern "console\.log" -ErrorAction SilentlyContinue | 
            Group-Object Filename | 
            Select-Object Name, Count
        
        if ($consoleLogFiles) {
            Write-ColorOutput "Warning: Found console.log statements in:" "Warning"
            $consoleLogFiles | ForEach-Object {
                Write-ColorOutput "  - $($_.Name): $($_.Count) occurrences" "Warning"
                $issues += "Console.log statements in $($_.Name)"
            }
        } else {
            Write-ColorOutput "OK: No console.log statements found" "Success"
        }
    } catch {
        Write-ColorOutput "Could not check for console.log statements" "Warning"
    }
    
    # Check for any types
    Write-ColorOutput "`nChecking for 'any' types..." "Info"
    try {
        $anyTypeFiles = Get-ChildItem -Recurse -Include "*.ts", "*.tsx" -Path "src" -ErrorAction SilentlyContinue | 
            Select-String -Pattern ": any" -ErrorAction SilentlyContinue | 
            Group-Object Filename | 
            Select-Object Name, Count
        
        if ($anyTypeFiles) {
            Write-ColorOutput "Warning: Found 'any' types in:" "Warning"
            $anyTypeFiles | ForEach-Object {
                Write-ColorOutput "  - $($_.Name): $($_.Count) occurrences" "Warning"
                $issues += "'any' types in $($_.Name)"
            }
        } else {
            Write-ColorOutput "OK: No 'any' types found" "Success"
        }
    } catch {
        Write-ColorOutput "Could not check for 'any' types" "Warning"
    }
    
    # Check for TODO/FIXME comments
    Write-ColorOutput "`nChecking for TODO/FIXME comments..." "Info"
    try {
        $todoFiles = Get-ChildItem -Recurse -Include "*.ts", "*.tsx" -Path "src" -ErrorAction SilentlyContinue | 
            Select-String -Pattern "(TODO|FIXME|HACK)" -ErrorAction SilentlyContinue | 
            Group-Object Filename | 
            Select-Object Name, Count
        
        if ($todoFiles) {
            Write-ColorOutput "Info: Found TODO/FIXME comments in:" "Info"
            $todoFiles | ForEach-Object {
                Write-ColorOutput "  - $($_.Name): $($_.Count) occurrences" "Info"
            }
        } else {
            Write-ColorOutput "OK: No TODO/FIXME comments found" "Success"
        }
    } catch {
        Write-ColorOutput "Could not check for TODO/FIXME comments" "Warning"
    }
    
    # Check for large files (>300 lines)
    Write-ColorOutput "`nChecking for large files (>300 lines)..." "Info"
    try {
        $largeFiles = Get-ChildItem -Recurse -Include "*.ts", "*.tsx" -Path "src" -ErrorAction SilentlyContinue | Where-Object {
            $content = Get-Content $_.FullName -ErrorAction SilentlyContinue
            $content -and $content.Count -gt 300
        } | Select-Object Name, @{Name="Lines";Expression={(Get-Content $_.FullName -ErrorAction SilentlyContinue).Count}}
        
        if ($largeFiles) {
            Write-ColorOutput "Warning: Large files found:" "Warning"
            $largeFiles | ForEach-Object {
                Write-ColorOutput "  - $($_.Name): $($_.Lines) lines" "Warning"
                $issues += "Large file: $($_.Name) ($($_.Lines) lines)"
            }
        } else {
            Write-ColorOutput "OK: No overly large files found" "Success"
        }
    } catch {
        Write-ColorOutput "Could not check for large files" "Warning"
    }
    
    return $issues
}

function Test-Dependencies {
    Write-ColorOutput "`n[DEPENDENCY ANALYSIS]" "Header"
    Write-ColorOutput "====================" "Header"
      # Check for outdated packages
    Write-ColorOutput "Checking for outdated packages..." "Info"
    try {
        $outdatedResult = & npm outdated --json 2>$null
        if ($LASTEXITCODE -ne 0 -and $outdatedResult) {
            $outdated = $outdatedResult | ConvertFrom-Json
            if ($outdated -and ($outdated | Get-Member -MemberType NoteProperty).Count -gt 0) {
                Write-ColorOutput "Warning: Outdated packages found:" "Warning"
                $outdated | Get-Member -MemberType NoteProperty | ForEach-Object {
                    $package = $_.Name
                    $info = $outdated.$package
                    Write-ColorOutput "  - $package`: $($info.current) -> $($info.latest)" "Warning"
                }
            } else {
                Write-ColorOutput "OK: All packages are up to date" "Success"
            }
        } else {
            Write-ColorOutput "OK: All packages are up to date" "Success"
        }
    } catch {
        Write-ColorOutput "Info: Could not check outdated packages" "Info"
    }
    
    # Security audit
    Write-ColorOutput "`nRunning security audit..." "Info"
    try {
        & npm audit --json 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "OK: No security vulnerabilities found" "Success"
        } else {
            Write-ColorOutput "Warning: Security vulnerabilities found. Run 'npm audit' for details" "Warning"
        }
    } catch {
        Write-ColorOutput "Info: Could not run security audit" "Info"
    }
}

function Test-Performance {
    Write-ColorOutput "`n[PERFORMANCE ANALYSIS]" "Header"
    Write-ColorOutput "=====================" "Header"
    
    # Check bundle size (if .next exists)
    if (Test-Path ".next") {
        Write-ColorOutput "Analyzing bundle size..." "Info"
        $buildManifest = ".next/static/chunks/_buildManifest.js"
        if (Test-Path $buildManifest) {
            try {
                $size = (Get-Item $buildManifest).Length
                $sizeKB = [math]::Round($size / 1024, 2)
                
                if ($sizeKB -gt 500) {
                    Write-ColorOutput "Warning: Large bundle size: ${sizeKB}KB" "Warning"
                } else {
                    Write-ColorOutput "OK: Bundle size looks good: ${sizeKB}KB" "Success"
                }
            } catch {
                Write-ColorOutput "Could not analyze bundle size" "Warning"
            }
        }
    } else {
        Write-ColorOutput "Info: No build found. Run 'npm run build' first for bundle analysis" "Info"
    }
    
    # Check for heavy dependencies
    Write-ColorOutput "`nChecking for heavy dependencies..." "Info"
    if (Test-Path "package.json") {
        try {
            $heavyDeps = @("lodash", "moment", "axios")
            $packageJson = Get-Content "package.json" | ConvertFrom-Json
            $foundHeavy = @()
            
            foreach ($dep in $heavyDeps) {
                if (($packageJson.dependencies -and $packageJson.dependencies.$dep) -or 
                    ($packageJson.devDependencies -and $packageJson.devDependencies.$dep)) {
                    $foundHeavy += $dep
                }
            }
            
            if ($foundHeavy.Count -gt 0) {
                Write-ColorOutput "Warning: Heavy dependencies found:" "Warning"
                $foundHeavy | ForEach-Object {
                    Write-ColorOutput "  - $_" "Warning"
                }
                Write-ColorOutput "Consider lighter alternatives" "Info"
            } else {
                Write-ColorOutput "OK: No heavy dependencies found" "Success"
            }
        } catch {
            Write-ColorOutput "Could not check dependencies" "Warning"
        }
    }
}

function Generate-Report {
    param([array]$Issues)
    
    Write-ColorOutput "`n[QUALITY REPORT SUMMARY]" "Header"
    Write-ColorOutput "========================" "Header"
    
    if ($Issues.Count -eq 0) {
        Write-ColorOutput "SUCCESS: No quality issues found! Great job!" "Success"
        $score = 100
    } else {
        Write-ColorOutput "Found $($Issues.Count) quality issues:" "Warning"
        $Issues | ForEach-Object {
            Write-ColorOutput "  - $_" "Warning"
        }
        $score = [math]::Max(0, 100 - ($Issues.Count * 10))
    }
    
    Write-ColorOutput "`nQuality Score: $score/100" "Info"
    
    if ($score -ge 90) {
        Write-ColorOutput "Grade: A - Excellent!" "Success"
    } elseif ($score -ge 80) {
        Write-ColorOutput "Grade: B - Good, minor improvements needed" "Info"
    } elseif ($score -ge 70) {
        Write-ColorOutput "Grade: C - Needs attention" "Warning"  
    } else {
        Write-ColorOutput "Grade: D - Needs significant improvement" "Error"
    }
    
    # Export report if requested
    if ($Export) {
        try {
            $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
            $reportFile = "quality-report-$timestamp.txt"
            
            $issuesList = $Issues | ForEach-Object { "- $_" }
            $issuesText = $issuesList -join "`n"
            
            $report = @"
TOP GEAR QUALITY REPORT
Generated: $(Get-Date)
========================

Quality Score: $score/100
Issues Found: $($Issues.Count)

Issues:
$issuesText

Recommendations:
- Fix console.log statements for production
- Replace 'any' types with proper TypeScript types
- Consider breaking down large files (>300 lines)
- Keep dependencies up to date
- Monitor bundle size for performance

Next Steps:
1. Address high-priority issues first
2. Update Technical Debt tracker
3. Plan refactoring for large files
4. Schedule dependency updates
"@
            
            $report | Out-File -FilePath $reportFile -Encoding UTF8
            Write-ColorOutput "`nReport exported to: $reportFile" "Success"
        } catch {
            Write-ColorOutput "Could not export report" "Error"
        }
    }
}

function Show-Help {
    Write-ColorOutput "`n[Code Quality Analyzer]" "Header"
    Write-ColorOutput "=======================" "Header"
    Write-ColorOutput "`nUsage:" "Info"
    Write-ColorOutput "  .\code-analyzer.ps1 [command] [options]" "Info"
    Write-ColorOutput "`nCommands:" "Info"
    Write-ColorOutput "  full        - Run complete analysis (default)" "Info"
    Write-ColorOutput "  stats       - Show project statistics only" "Info"
    Write-ColorOutput "  quality     - Run code quality checks only" "Info"
    Write-ColorOutput "  deps        - Check dependencies only" "Info"
    Write-ColorOutput "  perf        - Performance analysis only" "Info"
    Write-ColorOutput "`nOptions:" "Info"
    Write-ColorOutput "  -Detailed   - Show detailed output" "Info"
    Write-ColorOutput "  -Export     - Export report to file" "Info"
    Write-ColorOutput "`nExamples:" "Info"
    Write-ColorOutput "  .\code-analyzer.ps1" "Info"
    Write-ColorOutput "  .\code-analyzer.ps1 quality -Export" "Info"
    Write-ColorOutput "  .\code-analyzer.ps1 stats" "Info"
}

# Main execution
Write-ColorOutput "Top Gear Code Quality Analyzer" "Header"
Write-ColorOutput "==============================" "Header"

$issues = @()

switch ($Command.ToLower()) {
    "stats" {
        Get-ProjectStats
    }
    "quality" {
        $issues = Test-CodeQuality
        Generate-Report -Issues $issues
    }
    "deps" {
        Test-Dependencies
    }
    "perf" {
        Test-Performance
    }
    "full" {
        Get-ProjectStats
        $issues = Test-CodeQuality
        Test-Dependencies
        Test-Performance
        Generate-Report -Issues $issues
    }
    "help" {
        Show-Help
    }
    default {
        Show-Help
    }
}

Write-ColorOutput "`nAnalysis complete!" "Success"
