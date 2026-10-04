# Free port 3000 if a stale Node process is stuck, then start Next.js dev.
$ErrorActionPreference = "SilentlyContinue"
$Port = 3000

$connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
foreach ($conn in $connections) {
  $pid = $conn.OwningProcess
  if ($pid -gt 0) {
    Write-Host "Stopping process $pid on port $Port..."
    Stop-Process -Id $pid -Force
  }
}

Start-Sleep -Seconds 1
$portfolioRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $portfolioRoot

if (-not (Test-Path (Join-Path $portfolioRoot "src\app\page.tsx"))) {
  Write-Error "Wrong folder: run dev from the Portfolio app (missing src/app/page.tsx)."
  exit 1
}

if (-not (Test-Path (Join-Path $portfolioRoot "node_modules\next"))) {
  Write-Host "Installing dependencies in Portfolio (first run)..."
  npm install
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "Starting dev server from $portfolioRoot ..."
npm run dev
