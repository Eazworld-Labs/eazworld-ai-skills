# Install or update the Eazworld AI Skills Library into a project.
#
# Usage:
#   .\install.ps1 [-Target <project-dir>] [-Repo <repository-url>]
#
# When no target is given, the current directory is used.
#
# Repository URL resolution order:
#   1. the -Repo parameter
#   2. the EAZWORLD_SKILLS_REPO environment variable
#   3. the default: https://github.com/Eazworld-Labs/eazworld-ai-skills.git
#
# The installer clones the library into a local cache and copies its
# .claude\skills tree into <target>\.claude\skills. Re-running it updates
# the cache and refreshes the copy, so it is safe to run repeatedly.

[CmdletBinding()]
param(
    [string]$Target = (Get-Location).Path,
    [string]$Repo = $env:EAZWORLD_SKILLS_REPO,
    [string[]]$Skill = @('*')
)

if ([string]::IsNullOrWhiteSpace($Repo)) {
    $Repo = "https://github.com/Eazworld-Labs/eazworld-ai-skills.git"
}

$CacheDir = if ($env:EAZWORLD_SKILLS_CACHE) {
    $env:EAZWORLD_SKILLS_CACHE
} else {
    Join-Path $HOME ".eazworld-ai-skills"
}

$ErrorActionPreference = "Stop"

function Write-Ok   { param([string]$Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Write-Info { param([string]$Message) Write-Host "→ $Message" -ForegroundColor Cyan }
function Write-Err  { param([string]$Message) Write-Host "✗ $Message" -ForegroundColor Red }

# --- 1. Require git ------------------------------------------------------------
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Err "git is not installed or is not on your PATH."
    Write-Info "Install git first (https://git-scm.com/downloads), then re-run this installer."
    exit 1
}
Write-Ok "git found: $(git --version)"

# --- 2. Ensure directories ------------------------------------------------------
$SkillsDir = Join-Path $Target ".claude\skills"
New-Item -ItemType Directory -Force -Path $SkillsDir | Out-Null
Write-Ok "target ready: $SkillsDir"

# --- 3. Clone or update the library cache --------------------------------------
$GitDir = Join-Path $CacheDir ".git"
if (Test-Path $GitDir) {
    Write-Info "updating cached library at $CacheDir"
    git -C $CacheDir fetch --depth 1 origin
    if ($LASTEXITCODE -ne 0) {
        Write-Err "update failed — check your network connection and re-run."
        exit 1
    }
    git -C $CacheDir reset --hard origin/HEAD
    Write-Ok "library cache updated"
} else {
    Write-Info "cloning library to $CacheDir"
    if (Test-Path $CacheDir) { Remove-Item -Recurse -Force $CacheDir }
    git clone --depth 1 $Repo $CacheDir
    if ($LASTEXITCODE -ne 0) {
        Write-Err "clone failed — check the repository URL and your network connection."
        Remove-Item -Recurse -Force $CacheDir -ErrorAction SilentlyContinue
        exit 1
    }
    Write-Ok "library cloned"
}

# --- 4. Install skills into the target -----------------------------------------
$SourceRoot = Join-Path $CacheDir ".claude\skills"
if (-not (Test-Path $SourceRoot)) {
    Write-Err "the .claude\skills tree was not found in the cloned library."
    exit 1
}

# A named selection copies exactly the requested skills and never deletes
# anything else in the target; '*' refreshes the whole tree.
if ($Skill -contains '*') {
    Copy-Item -Recurse -Force (Join-Path $SourceRoot "*") $SkillsDir
} else {
    foreach ($name in $Skill) {
        $src = Get-ChildItem -Directory -Recurse -Depth 2 -Filter $name $SourceRoot |
            Select-Object -First 1
        if (-not $src) {
            Write-Err "skill not found in the library: $name"
            $available = (Get-ChildItem -Recurse -Filter "SKILL.md" $SourceRoot |
                ForEach-Object { Split-Path $_.DirectoryName -Leaf } | Sort-Object) -join ', '
            Write-Info "available skills: $available"
            exit 1
        }
        Copy-Item -Recurse -Force $src.FullName $SkillsDir
        Write-Ok "installed skill: $name"
    }
}
$Count = (Get-ChildItem -Recurse -Filter "SKILL.md" $SkillsDir).Count
if ($Count -eq 0) {
    Write-Err "no SKILL.md files were installed — aborting."
    exit 1
}
Write-Ok "installed $Count skills into $SkillsDir"

# --- 5. Success message ---------------------------------------------------------
Write-Host ""
Write-Host "✓ Eazworld AI Skills Library installed" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Open your project with Claude Code or OpenCode."
Write-Host "  2. The agent discovers .claude\skills\ automatically at startup."
Write-Host "  3. Restart the session if it is already running, then ask it to list its skills to verify."
Write-Host ""
Write-Host "Update any time by re-running this installer (it refreshes the cached copy first)."
