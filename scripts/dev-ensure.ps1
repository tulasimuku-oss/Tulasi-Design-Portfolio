# Start Next dev only when nothing healthy is listening on port 3000.
# Use this for "folder open" / auto-preview so we never clobber a running server.
$ErrorActionPreference = "SilentlyContinue"
$Port = 3000
$Uri = "http://127.0.0.1:$Port/"

function Test-DevHealthy {
  try {
    $r = Invoke-WebRequest -Uri $Uri -TimeoutSec 5 -UseBasicParsing
    return $r.StatusCode -eq 200
  } catch {
    return $false
  }
}

$portfolioRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $portfolioRoot

if (-not (Test-Path (Join-Path $portfolioRoot "src\app\page.tsx"))) {
  Write-Error "Wrong folder: run dev from the Portfolio app (missing src/app/page.tsx)."
  exit 1
}

if (Test-DevHealthy) {
  Write-Host "Portfolio dev server already running at $Uri"
  exit 0
}

$listening = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($listening) {
  Write-Host "Port $Port is in use; waiting for a response (compile can take a while)..."
  for ($i = 0; $i -lt 15; $i++) {
    if (Test-DevHealthy) {
      Write-Host "Dev server is up at $Uri"
      exit 0
    }
    Start-Sleep -Seconds 2
  }
  Write-Host "Port $Port did not become healthy - clearing it and starting fresh (dev:clean)..."
  npm run dev:clean
  exit $LASTEXITCODE
}

if (-not (Test-Path (Join-Path $portfolioRoot "node_modules\next"))) {
  Write-Host "Installing dependencies in Portfolio (first run)..."
  npm install
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "Starting dev server from $portfolioRoot ..."
npm run dev
exit $LASTEXITCODE
