# Contributing to Eazworld AI Skills Library

Thank you for your interest in contributing to the **Eazworld AI Skills Library**! We are
committed to maintaining a secure, production-grade, and deterministic collection of AI
agent skills for Claude Code and OpenCode.

By contributing, you agree to abide by our engineering standards, security policies, and
code of conduct.

---

## 1. Code of Conduct

- Be respectful, constructive, and professional in all communications, issues, and pull
  requests.
- Prioritize clarity, security, and simplicity in all authored skills and scripts.
- Uphold Eazworld's zero-trust security and coding standards.

---

## 2. How Can I Contribute?

You can contribute in several ways:

- **Authoring New Skills:** Proposing or building new skills within our 4 supported
  departments.
- **Improving Existing Skills:** Refining workflows, adding edge-case handling, or updating
  technical references.
- **Automation & Tooling:** Enhancing validation scripts (`scripts/validate-skills.js`) or
  CI/CD pipelines.
- **Bug Reports & Feedback:** Opening structured GitHub issues for bugs, inconsistencies, or
  agent discovery failures.

---

## 3. Development Workflow (Step-by-Step)

### Step 1: Fork and Clone

1. Fork the `eazworld-ai-skills` repository to your GitHub account.
2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR-USERNAME/eazworld-ai-skills.git
   cd eazworld-ai-skills
   ```

### Step 2: Create a Feature Branch

Create a descriptive branch using conventional prefixes (`feat/`, `fix/`, `docs/`,
`refactor/`):

```bash
git checkout -b feat/add-graphql-skill
```

### Step 3: Author or Modify a Skill

Follow the rules outlined in `docs/SKILL_AUTHORING_GUIDE.md`.

Ensure your skill directory name uses lowercase kebab-case under the correct department:

```text
.claude/skills/[department]/[skill-name]/
├── SKILL.md
├── references/
└── assets/
```

Every SKILL.md must include the 7 mandatory sections:

1. Overview & Purpose
2. Activation Conditions & Triggers
3. Required Inputs & Project Audit
4. Technical Standards & Rules
5. Execution Workflow
6. Security & Edge Case Guidelines
7. Definition of Done & Quality Gates

### Step 4: Run Local Validation

Before submitting your changes, run our automated linter to verify frontmatter, naming
conventions, and security guardrails:

```bash
node scripts/validate-skills.js
```

If validation fails, fix the reported errors before pushing your code.

### Step 5: Commit Your Changes

Follow conventional commit standards:

```text
feat(skills): add graphql-api skill under software-engineering
fix(linter): correct yaml frontmatter parsing bug
docs(roadmap): update milestone timelines
```

```bash
git add .
git commit -m "feat(skills): add new skill implementation"
```

### Step 6: Push and Open a Pull Request

Push your branch to your fork:

```bash
git push origin feat/add-graphql-skill
```

Navigate to the main Eazworld repository and open a Pull Request.

Fill out the Pull Request template completely, detailing what was added and how it was
tested across Claude Code and OpenCode.

---

## 4. Pull Request Review & Merge Criteria

Your pull request will be reviewed against the following criteria:

- **Validation Check:** Automated GitHub Actions linter must pass with 0 errors.
- **Security Review:** Zero hardcoded credentials, API keys, or unsafe shell commands.
- **Agent Interoperability:** Verified functionality in both Claude Code and OpenCode.
- **Documentation Quality:** Clear, concise instructions without fluff or unverified
  claims.

**Note:** AI agents or contributors are strictly prohibited from approving their own pull
requests. All submissions require human maintainer sign-off.

---

## 5. Branch Protection Guidelines

The following rules protect `main` and keep every change reviewed and validated:

- **No direct pushes to `main`:** all changes land through a Pull Request from a feature
  branch (`feat/`, `fix/`, `docs/`, `refactor/`).
- **Required status check:** the `lint-skills` GitHub Actions workflow
  (`.github/workflows/lint-skills.yml`) must pass with 0 errors before merge.
- **Required review:** at least one human maintainer approval is required. AI agents and
  PR authors may never approve their own pull requests.
- **Up-to-date branch:** PRs must be rebased or merged with the latest `main` before
  merging, so validation always runs against current code.
- **Linear history:** prefer squash merges so every merge commit follows the conventional
  commit format (`feat(skills): ...`, `fix(linter): ...`, `docs(roadmap): ...`).
- **Force pushes disabled:** `git push --force` to protected branches is prohibited
  without explicit human maintainer consent.

> **Repository setting:** these rules must also be enabled on GitHub under
> **Settings → Branches → Branch protection rule** for `main` (required checks, required
> review, no force pushes). The guidelines above define the policy; the settings enforce
> it.

---

Thank you for helping build the future of AI agent engineering standards!

Maintained by Eazworld
