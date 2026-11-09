# One-time: add "Portfolio preview" to Windows Startup (runs dev:ensure at logon).
$ErrorActionPreference = "Stop"

$workspaceRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$batPath = Join-Path $workspaceRoot "Start Portfolio Preview.bat"
if (-not (Test-Path $batPath)) {
  Write-Error "Missing Start Portfolio Preview.bat at $batPath"
}

$startup = [Environment]::GetFolderPath("Startup")
$lnkPath = Join-Path $startup "Tulasi Portfolio Preview.lnk"

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($lnkPath)
$shortcut.TargetPath = $batPath
$shortcut.WorkingDirectory = $workspaceRoot
$shortcut.WindowStyle = 7
$shortcut.Description = "Next.js dev server at http://127.0.0.1:3000/"
$shortcut.Save()

Write-Host "Created Startup shortcut:"
Write-Host "  $lnkPath"
Write-Host ""
Write-Host "Preview will start when you sign in to Windows (dev:ensure — skips if already healthy)."
Write-Host "Remove via Settings -> Apps -> Startup, or delete the shortcut."
