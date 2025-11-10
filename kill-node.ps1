# Kill all Node.js processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "All Node.js processes killed"

