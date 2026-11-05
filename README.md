# Eazworld AI Skills Library

[![CI Status][ci-badge]][ci]
[![MIT License][license-badge]][license]
[![Version][version-badge]][version]
[![Supported Agents][agents-badge]][agents]

> A production-grade, open-source collection of **32 AI agent skills** that standardizes
> how AI coding agents design, engineer, secure, and deliver software — from core web
> platforms to digital marketing, business automation, and West African fintech.

**Version:** 1.0.0 · **License:** MIT · **Agents:** Claude Code & OpenCode

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

### Skills Portfolio — 32 Skills Across 4 Departments

| Department | Skills | Focus Areas |
| :--- | :---: | :--- |
| **1. Software Engineering** | 13 | Core tech stack, system architecture, mobile, APIs, databases, testing, DevOps |
| **2. Digital Marketing** | 7 | Technical SEO, Google/Meta advertising, brand identity, conversion optimization |
| **3. AI & Automation** | 5 | Custom AI agent frameworks, n8n workflows, WhatsApp API, LLM chatbots, CRM pipelines |
| **4. Business Solutions** | 7 | School/Church ERPs, POS & inventory, booking engines, regional fintech (Paystack/MoMo) |
| **Total** | **32** | **Comprehensive enterprise & open-source coverage** |

- **Software Engineering (13):** `software-architecture`, `frontend-design`,
  `backend-engineering`, `api-development`, `database-architecture`,
  `ecommerce-development`, `mobile-app-development`, `software-testing`, `code-review`,
  `security-audit`, `performance-optimization`, `seo-engineering`, `cloud-devops`
- **Digital Marketing (7):** `seo-strategy`, `google-ads`, `meta-ads`,
  `social-media-management`, `brand-identity`, `email-marketing`,
  `conversion-optimization`
- **AI & Automation (5):** `ai-agent-development`, `n8n-automation`,
  `whatsapp-automation`, `chatbot-development`, `crm-automation`
- **Business Solutions (7):** `school-management`, `church-management`, `pos-inventory`,
  `restaurant-management`, `booking-systems`, `ghana-payments`, `nigeria-payments`

See the full release plan in [docs/ROADMAP.md](docs/ROADMAP.md).

---

## Repository Structure

```text
eazworld-ai-skills/
├── .claude/
│   └── skills/                  # SSOT: shared skill definitions
│       ├── software-engineering/
│       ├── digital-marketing/
│       ├── ai-automation/
│       └── business-solutions/
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
git clone https://github.com/fekt2016/eazworld-ai-skills.git
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
3. Verify by checking the session's skill list — all 32 skills register on startup.

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

### One-line quick installation

**Linux / macOS (Bash)** — installs into the current directory, or pass a project
path to install elsewhere:

```bash
curl -fsSL https://raw.githubusercontent.com/eazworld/eazworld-ai-skills/main/scripts/install.sh | bash -s -- /path/to/your-project
```

**Windows (PowerShell)** — run from your project folder:

```powershell
iwr -useb https://raw.githubusercontent.com/eazworld/eazworld-ai-skills/main/scripts/install.ps1 | iex
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
updates use the same one command. The clone source defaults to
`https://github.com/eazworld/eazworld-ai-skills.git` and can be overridden with the
`EAZWORLD_SKILLS_REPO` environment variable (Bash) or the `-Repo` parameter
(PowerShell) — useful for forks or mirrors.

### Git Submodule integration (version-controlled projects)

Teams that want the skills pinned to a version can vendor the library as a submodule
and copy its skills into place:

```bash
cd your-project
git submodule add https://github.com/eazworld/eazworld-ai-skills.git vendor/eazworld-ai-skills
mkdir -p .claude
cp -R vendor/eazworld-ai-skills/.claude/skills .claude/skills
```

Update later with `git -C vendor/eazworld-ai-skills pull --ff-only`, then re-run
the copy command. Commit the copied tree normally so every clone of your project
ships with the skills.

### How discovery works

- Both agents read
  `<your-project>/.claude/skills/<department>/<skill-name>/SKILL.md` straight from
  the workspace root at startup — that is the entire contract.
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

[ci-badge]: https://github.com/fekt2016/eazworld-ai-skills/actions/workflows/lint-skills.yml/badge.svg
[ci]: https://github.com/fekt2016/eazworld-ai-skills/actions
[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg
[license]: LICENSE
[version-badge]: https://img.shields.io/badge/version-1.0.0-blue.svg
[version]: CHANGELOG.md
[agents-badge]: https://img.shields.io/badge/agents-Claude%20Code%20%7C%20OpenCode-6f42c1.svg
[agents]: docs/COMPATIBILITY.md
