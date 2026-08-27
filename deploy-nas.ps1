# ============================================================================
#  deploy-nas.ps1 - build the homepage and publish it to the NAS (hanbyeolsystem.kr root = \web\hbsite)
#   usage:  powershell -NoProfile -ExecutionPolicy Bypass -File deploy-nas.ps1        (build + copy)
#           powershell ... -File deploy-nas.ps1 -NoBuild                              (copy only)
#   - /MIR mirrors out\ to the NAS but NEVER touches \driver (the PHP driver center lives there)
#   - git push is still the source backup; GitHub Pages is no longer the live site (DNS -> NAS since 2026-08-27)
# ============================================================================
param([switch]$NoBuild)
$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot
$Dst  = '\\192.168.0.249\web\hbsite'
if (-not $NoBuild) {
  Push-Location $Root
  & npm run build
  if ($LASTEXITCODE -ne 0) { Pop-Location; throw "npm run build failed" }
  Pop-Location
}
$Src = Join-Path $Root 'out'
if (-not (Test-Path (Join-Path $Src 'index.html'))) { throw "out\index.html missing" }
& robocopy $Src $Dst /MIR /XD driver "@eaDir" "#recycle" /XF CNAME /MT:16 /R:2 /W:2 /NFL /NDL /NP
if ($LASTEXITCODE -ge 8) { throw "robocopy failed ($LASTEXITCODE)" }
Write-Host "deployed to $Dst (robocopy code $LASTEXITCODE)"
