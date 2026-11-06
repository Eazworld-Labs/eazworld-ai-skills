# Eazworld AI Skills Library

[![CI Status][ci-badge]][ci]
[![MIT License][license-badge]][license]
[![Version][version-badge]][version]
[![Supported Agents][agents-badge]][agents]

> A production-grade, open-source collection of **33 AI agent skills** that standardizes
> how AI coding agents design, engineer, secure, and deliver software — from core web
> platforms to digital marketing, business automation, and West African fintech.

**Version:** 1.0.0 · **License:** MIT · **Agents:** Claude Code & OpenCode

### Install in one command

```bash
npx skills add Eazworld-Labs/eazworld-ai-skills
```

This copies all 33 skills into your project's `.claude/skills/`, ready for both
Claude Code and OpenCode to discover automatically at startup.

The installer first asks **which AI tools to install into** and lists every tool it supports
(AiderDesk, AstrBot, and many others). Select **Claude Code** and/or **OpenCode** (Space to
toggle, Enter to confirm) and leave the rest unselected — or skip the question with
`npx skills add Eazworld-Labs/eazworld-ai-skills --agent claude-code opencode`. The installer
may also create a `.agents/skills/` folder and a `skills-lock.json` in your project; both are
its own bookkeeping. If you only use OpenCode or want a plain copy into `.claude/skills/`, the
shell installers below do exactly that.

Every skill name starts with `eaz-` (for example `eaz-frontend-design`). That keeps the
library from colliding with your own or built-in skills of the same name — a personal
skill called `frontend-design` would otherwise win over a project skill and silently
replace it. Upgrading from an earlier release? Delete the old un-prefixed folders; the
shell installers print which ones.

Only need some of them? Install a subset instead — same command, one flag:

```bash
npx skills add Eazworld-Labs/eazworld-ai-skills --skill eaz-nigeria-payments --skill eaz-pos-inventory
```

The shell installers support the same selection
(`bash scripts/install.sh --skill eaz-nigeria-payments`). Full setup options (shell
installers, submodules, updates) live in
[User Installation & Setup](#user-installation--setup).
(During the move to the `eazworld` org, `fekt2016/eazworld-ai-skills` also works.)

---

## Overview

### Single Source of Truth (SSOT)

Every skill is authored **once** and stored in a single authoritative location —
`.claude/skills/`. Both supported agents consume that same directory natively:

- **No duplication:** no parallel `.opencode/skills/` copies to drift out of sync.
- **No divergence:** one version-controlled definition per skill.
- **Consistent output:** deterministic, identical instructions regardless of which agent
  executes them.

Progressive disclosure keeps context efficient: metadata loads at startup, instructions
load on trigger, and deep reference assets load only on demand.

### Skills Portfolio — 33 Skills Across 4 Departments

| Department | Skills | Focus Areas |
| :--- | :---: | :--- |
| **1. Software Engineering** | 14 | Core tech stack, system architecture, mobile, APIs, databases, testing, DevOps |
| **2. Digital Marketing** | 7 | Technical SEO, Google/Meta advertising, brand identity, conversion optimization |
| **3. AI & Automation** | 5 | Custom AI agent frameworks, n8n workflows, WhatsApp API, LLM chatbots, CRM pipelines |
| **4. Business Solutions** | 7 | School/Church ERPs, POS & inventory, booking engines, regional fintech (Paystack/MoMo) |
| **Total** | **33** | **Comprehensive enterprise & open-source coverage** |

- **Software Engineering (14):** `eaz-software-architecture`, `eaz-frontend-design`,
  `eaz-backend-engineering`, `eaz-api-development`, `eaz-database-architecture`,
  `eaz-ecommerce-development`, `eaz-mobile-app-development`, `eaz-software-testing`,
  `eaz-code-review`, `eaz-security-audit`, `eaz-performance-optimization`,
  `eaz-seo-engineering`, `eaz-cloud-devops`, `eaz-project-kickoff`
- **Digital Marketing (7):** `eaz-seo-strategy`, `eaz-google-ads`, `eaz-meta-ads`,
  `eaz-social-media-management`, `eaz-brand-identity`, `eaz-email-marketing`,
  `eaz-conversion-optimization`
- **AI & Automation (5):** `eaz-ai-agent-development`, `eaz-n8n-automation`,
  `eaz-whatsapp-automation`, `eaz-chatbot-development`, `eaz-crm-automation`
- **Business Solutions (7):** `eaz-school-management`, `eaz-church-management`,
  `eaz-pos-inventory`, `eaz-restaurant-management`, `eaz-booking-systems`,
  `eaz-ghana-payments`, `eaz-nigeria-payments`

See the full release plan in [docs/ROADMAP.md](docs/ROADMAP.md).

---

## Repository Structure

```text
eazworld-ai-skills/
├── .claude/
│   └── skills/                  # SSOT: shared skill definitions
│       ├── eaz-frontend-design/     # one folder per skill, directly under skills/
│       ├── eaz-n8n-automation/      # (departments are a label in each skill's
│       └── ...                  #  metadata, not folders)
├── .github/
│   └── workflows/               # CI validation pipelines (GitHub Actions)
├── docs/
│   ├── ARCHITECTURE.md          # Technical architecture & repository layout
│   ├── COMPATIBILITY.md         # Cross-agent discovery & execution protocols
│   ├── ENGINEERING_STANDARDS.md # Mandatory coding & behavioral rules
│   ├── ROADMAP.md               # 31-skill release plan & milestones
│   ├── SECURITY_POLICY.md       # Zero-trust rules & OWASP defenses
│   └── SKILL_AUTHORING_GUIDE.md # Standards for authoring new skills
├── scripts/                     # Validation linters & CI helpers
├── templates/                   # Reusable skill skeletons
├── examples/                    # Reference skill implementations
├── CHANGELOG.md                 # Semantic version release log
├── CONTRIBUTING.md              # Contributor workflow & PR criteria
├── LICENSE                      # MIT License
├── PROJECT_SPEC.md              # Project scope, tech stack & versioning
├── README.md                    # This file
├── SECURITY.md                  # Security policy (root copy)
└── tasks.md                     # Implementation progress tracker
```

---

## Discovery & Compatibility

Skills are discovered natively by each agent — no custom patching, no proprietary hooks.

| | Claude Code | OpenCode |
| :--- | :--- | :--- |
| **Project skills** | `.claude/skills/<skill-name>/SKILL.md` | `.claude/skills/<skill-name>/SKILL.md` |
| **Global skills** | `~/.claude/skills/<skill-name>/SKILL.md` | `~/.config/opencode/skills/<skill-name>/SKILL.md` |
| **Loading** | Indexed at startup; matched against frontmatter `description` | Parsed on demand from the workspace index |

**How both agents share one copy:**

1. The authoritative source is always `.claude/skills/`.
2. OpenCode reads that same directory directly — skills are never duplicated under
   `.opencode/skills/`.
3. Platform-specific tweaks use isolated configuration overrides, never forked skill
   content.
4. Every skill is empirically verified in **both** agents before release, and outcomes are
   recorded in the compatibility matrix.

Full protocols: [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md)

---

## Quickstart

### 1. Clone the repository

```bash
git clone https://github.com/Eazworld-Labs/eazworld-ai-skills.git
cd eazworld-ai-skills
```

### 2. Validate the library

Run the local linter to verify YAML frontmatter, kebab-case naming, the 7 mandatory
SKILL.md sections, and secret scanning:

```bash
node scripts/validate-skills.js
```

### 3. Use with your agent

No plugin and no package install — both agents read this repository's directory
directly.

**Claude Code**

1. Open this repository as your workspace (`claude` from the repository root).
2. Skills under `.claude/skills/` are indexed automatically at startup.
3. Verify by asking Claude Code to list its available skills.

**OpenCode**

1. Open the same workspace (`opencode` from the repository root).
2. `.claude/skills/` is picked up natively with no extra configuration.
3. Verify by checking the session's skill list — all 33 skills register on startup.

**Requirements:** Node.js 18+ for the validator and test suite (library CI runs on
Node 24). Cross-agent test results live in
[docs/COMPATIBILITY.md](docs/COMPATIBILITY.md); problems and common questions are
covered in [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

Skills activate by describing your task; the agent matches your prompt against each
skill's frontmatter description and loads the relevant instructions.

---

## User Installation & Setup

Bring the library's skills into your own project with one command — no plugin, no
package install. Both installers copy the library's `.claude/skills/` tree into your
project's root; Claude Code and OpenCode then discover the skills automatically at
startup.

### Install with the skills CLI (recommended)

The [skills.sh](https://skills.sh) CLI installs the whole library into your
project's agent folders in one command:

```bash
npx skills add Eazworld-Labs/eazworld-ai-skills
```

- Add `--skill <name>` to install one skill instead of all 33 — for example
  `npx skills add Eazworld-Labs/eazworld-ai-skills --skill eaz-nigeria-payments`.
- Add `--agent claude-code` (or `--agent opencode`) to target one agent, `-g` to
  install globally for all projects, and run `npx skills update` any time to pull
  the latest versions.
- Every skill lives at `.claude/skills/<skill-name>/SKILL.md` — one folder deep —
  and lands at the same path in your project, `references/` included.

(The clone source is `eazworld/eazworld-ai-skills`; while the live repository still
sits at `fekt2016/eazworld-ai-skills`, substitute that owner in the command.)

### One-line quick installation

**Linux / macOS (Bash)** — installs into the current directory, or pass a project
path to install elsewhere:

```bash
curl -fsSL https://raw.githubusercontent.com/Eazworld-Labs/eazworld-ai-skills/main/scripts/install.sh | bash -s -- /path/to/your-project
```

**Windows (PowerShell)** — run from your project folder:

```powershell
iwr -useb https://raw.githubusercontent.com/Eazworld-Labs/eazworld-ai-skills/main/scripts/install.ps1 | iex
```

Prefer to read a script first? Download it (`curl -O <url>` or save the file) and
run it directly — `bash scripts/install.sh <project>` or `.\install.ps1` — with
identical behavior.

### What the installers do

1. Confirm `git` is installed.
2. Clone the library into a local cache (`~/.eazworld-ai-skills`) — reused on every
   later run, so installs and updates share one download.
3. Create `.claude/skills/` in your project and copy the skill tree into it.
4. Print a confirmation with the number of skills installed.

Re-running an installer refreshes the cache from GitHub and replaces your copy, so
updates use the same one command. To install only part of the library, name the
skills you want — everything else is skipped:

```bash
bash scripts/install.sh --skill eaz-nigeria-payments --skill eaz-pos-inventory
# PowerShell: .\install.ps1 -Skill eaz-nigeria-payments,eaz-pos-inventory
```

The clone source defaults to
`https://github.com/Eazworld-Labs/eazworld-ai-skills.git` and can be overridden with the
`EAZWORLD_SKILLS_REPO` environment variable (Bash) or the `-Repo` parameter
(PowerShell) — useful for forks or mirrors.

### Git Submodule integration (version-controlled projects)

Teams that want the skills pinned to a version can vendor the library as a submodule
and copy its skills into place:

```bash
cd your-project
git submodule add https://github.com/Eazworld-Labs/eazworld-ai-skills.git vendor/eazworld-ai-skills
mkdir -p .claude
cp -R vendor/eazworld-ai-skills/.claude/skills .claude/skills
```

Update later with `git -C vendor/eazworld-ai-skills pull --ff-only`, then re-run
the copy command. Commit the copied tree normally so every clone of your project
ships with the skills.

### How discovery works

- Both agents read
  `<your-project>/.claude/skills/<skill-name>/SKILL.md` straight from the workspace
  root at startup — that is the entire contract. Skills nested deeper (for example
  inside a department folder) are **not** discovered.
- Open a fresh session after installing (skills are indexed at startup, not
  mid-session), then ask the agent to list its skills to verify they registered.
- The skills are plain Markdown: copy them, rename them, or edit them freely. If
  your project's stack differs, the standards apply as-is; the TypeScript-flavored
  examples may need translating.

---

## Security Policy

Security is embedded into every skill, script, and generated artifact:

- **Zero Hardcoding:** credentials, API keys, JWT secrets, and connection strings are
  strictly forbidden in source. Only `.env.example` placeholders are permitted.
- **Zero Trust:** every payload is treated as potentially malicious — server-side
  authorization, strict input validation, OWASP Top 10 defenses, and least-privilege
  access on every request.
- **Human-in-the-Loop Oversight:** AI agents may never autonomously run destructive
  operations (file deletion, force-push, database drops, production deploys, payment
  secret rotations). Explicit human confirmation is always required.

Violating pull requests are rejected without exception.

Full policy: [SECURITY.md](SECURITY.md) · [docs/SECURITY_POLICY.md](docs/SECURITY_POLICY.md)

---

## Contributing

Contributions are welcome — from authoring new skills to improving validation tooling.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow, and
[docs/SKILL_AUTHORING_GUIDE.md](docs/SKILL_AUTHORING_GUIDE.md) for skill standards.
All submissions require human maintainer sign-off.

---

## Documentation

| Document | Purpose |
| :--- | :--- |
| [PROJECT_SPEC.md](PROJECT_SPEC.md) | Project scope, tech stack & versioning rules |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Technical architecture & SSOT layout |
| [docs/ENGINEERING_STANDARDS.md](docs/ENGINEERING_STANDARDS.md) | Mandatory coding & behavioral rules |
| [docs/SKILL_AUTHORING_GUIDE.md](docs/SKILL_AUTHORING_GUIDE.md) | How to author compliant skills |
| [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md) | Cross-agent discovery & testing matrix |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Troubleshooting & FAQ |
| [docs/SECURITY_POLICY.md](docs/SECURITY_POLICY.md) | Zero-trust security requirements |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Release plan & milestones |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [tasks.md](tasks.md) | Implementation progress tracker |

---

## License

Released under the [MIT License](LICENSE).

Maintained by **Eazworld**.

[ci-badge]: https://github.com/Eazworld-Labs/eazworld-ai-skills/actions/workflows/lint-skills.yml/badge.svg
[ci]: https://github.com/Eazworld-Labs/eazworld-ai-skills/actions
[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg
[license]: LICENSE
[version-badge]: https://img.shields.io/badge/version-1.0.0-blue.svg
[version]: CHANGELOG.md
[agents-badge]: https://img.shields.io/badge/agents-Claude%20Code%20%7C%20OpenCode-6f42c1.svg
[agents]: docs/COMPATIBILITY.md
