#!/usr/bin/env bash
# Install or update the Eazworld AI Skills Library into a project.
#
# Usage:
#   bash install.sh [target-project-dir]
#
# When no target is given, the current directory is used.
#
# Environment:
#   EAZWORLD_SKILLS_REPO     Clone source URL
#                            (default: https://github.com/eazworld/eazworld-ai-skills.git)
#   EAZWORLD_SKILLS_CACHE    Local cache directory
#                            (default: ~/.eazworld-ai-skills)
#
# The installer clones the library into a local cache and copies its
# .claude/skills tree into <target>/.claude/skills. Re-running it updates
# the cache and refreshes the copy, so it is safe to run repeatedly.

set -euo pipefail

REPO="${EAZWORLD_SKILLS_REPO:-https://github.com/eazworld/eazworld-ai-skills.git}"
TARGET="${1:-$PWD}"
CACHE_DIR="${EAZWORLD_SKILLS_CACHE:-$HOME/.eazworld-ai-skills}"

if [ -t 1 ]; then
  GREEN='\033[0;32m'
  CYAN='\033[0;36m'
  YELLOW='\033[0;33m'
  RED='\033[0;31m'
  NC='\033[0m'
else
  GREEN='' ; CYAN='' ; YELLOW='' ; RED='' ; NC=''
fi

print_ok()   { printf "%b✓%b %s\n" "$GREEN" "$NC" "$*"; }
print_info() { printf "%b→%b %s\n" "$CYAN" "$NC" "$*"; }
print_err()  { printf "%b✗%b %s\n" "$RED" "$NC" "$*" >&2; }

# --- 1. Require git ------------------------------------------------------------
if ! git --version >/dev/null 2>&1; then
  print_err "git is not installed or is not on your PATH."
  print_info "Install git first (https://git-scm.com/downloads), then re-run this installer."
  exit 1
fi
print_ok "git found: $(git --version | awk '{print $3}')"

# --- 2. Ensure directories ------------------------------------------------------
mkdir -p "$TARGET/.claude/skills"
print_ok "target ready: $TARGET/.claude/skills"

# --- 3. Clone or update the library cache ---------------------------------------
if [ -d "$CACHE_DIR/.git" ]; then
  print_info "updating cached library at $CACHE_DIR"
  if ! git -C "$CACHE_DIR" fetch --quiet --depth 1 origin; then
    print_err "update failed — check your network connection and re-run."
    exit 1
  fi
  git -C "$CACHE_DIR" reset --quiet --hard origin/HEAD
  print_ok "library cache updated"
else
  print_info "cloning library to $CACHE_DIR"
  rm -rf "$CACHE_DIR"   # clear any partial clone
  if ! git clone --quiet --depth 1 "$REPO" "$CACHE_DIR"; then
    print_err "clone failed — check the repository URL and your network connection."
    rm -rf "$CACHE_DIR"
    exit 1
  fi
  print_ok "library cloned"
fi

# --- 4. Install skills into the target ------------------------------------------
if [ ! -d "$CACHE_DIR/.claude/skills" ]; then
  print_err "the .claude/skills tree was not found in the cloned library."
  exit 1
fi

if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$CACHE_DIR/.claude/skills/" "$TARGET/.claude/skills/"
else
  cp -R "$CACHE_DIR/.claude/skills/." "$TARGET/.claude/skills/"
fi

COUNT="$(find "$TARGET/.claude/skills" -name 'SKILL.md' | wc -l | tr -d ' ')"
if [ "$COUNT" -eq 0 ]; then
  print_err "no SKILL.md files were installed — aborting."
  exit 1
fi
print_ok "installed $COUNT skills into $TARGET/.claude/skills"

# --- 5. Success message ------------------------------------------------------------
printf "\n"
printf "%b✓ Eazworld AI Skills Library installed%b\n" "$GREEN" "$NC"
printf "\n"
printf "Next steps:\n"
printf "  1. Open your project with Claude Code or OpenCode.\n"
printf "  2. The agent discovers .claude/skills/ automatically at startup.\n"
printf "  3. Restart the session if it is already running, then ask it to list its skills to verify.\n"
printf "\n"
printf "Update any time by re-running this installer (it refreshes the cached copy first).\n"
