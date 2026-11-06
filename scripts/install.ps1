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

# Skills live one level deep (.claude\skills\<skill-name>\SKILL.md): agents do not
# discover deeper nesting. A named selection copies exactly the requested skills;
# '*' refreshes every library skill. Skills you added yourself are never deleted.
function Install-OneSkill($SrcDir) {
    $dest = Join-Path $SkillsDir $SrcDir.Name
    if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
    Copy-Item -Recurse -Force $SrcDir.FullName $dest
}

if ($Skill -contains '*') {
    Get-ChildItem -Directory $SourceRoot |
        Where-Object { Test-Path (Join-Path $_.FullName "SKILL.md") } |
        ForEach-Object { Install-OneSkill $_ }
} else {
    foreach ($name in $Skill) {
        $srcPath = Join-Path $SourceRoot $name
        $src = if (Test-Path (Join-Path $srcPath "SKILL.md")) { Get-Item $srcPath } else { $null }
        if (-not $src) {
            Write-Err "skill not found in the library: $name"
            $available = (Get-ChildItem -Recurse -Filter "SKILL.md" $SourceRoot |
                ForEach-Object { Split-Path $_.DirectoryName -Leaf } | Sort-Object) -join ', '
            Write-Info "available skills: $available"
            exit 1
        }
        Install-OneSkill $src
        Write-Ok "installed skill: $name"
    }
}
foreach ($legacy in 'software-engineering','digital-marketing','ai-automation','business-solutions') {
    $old = Join-Path $SkillsDir $legacy
    if ((Test-Path $old) -and -not (Test-Path (Join-Path $old "SKILL.md"))) {
        Write-Info "old folder found: .claude\skills\$legacy - it is no longer used, delete it when ready"
    }
}
$Count = (Get-ChildItem -Directory $SkillsDir | Where-Object { Test-Path (Join-Path $_.FullName "SKILL.md") }).Count
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
