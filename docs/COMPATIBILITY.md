# Eazworld AI Skills Library — Agent Compatibility

**Version:** 1.0.0  
**Owner:** Eazworld  
**Status:** Foundational Compatibility Standard (Production-Grade Enhanced)  
**Supported Agents:** Claude Code, OpenCode  
**Applies To:** All Eazworld AI Skills & Ecosystem Integrations  

---

## 1. Purpose

This document defines the technical integration, discovery protocols, runtime execution
behavior, cross-agent compatibility standards, and maintenance life cycle for the Eazworld
AI Skills Library.

It establishes a single, authoritative, and maintainable source of truth for reusable AI
agent skills across both Claude Code and OpenCode, preventing agent fragmentation and
ensuring deterministic behavior regardless of the execution environment.

---

## 2. Core Compatibility Principles

All integrations and skill developments must strictly adhere to seven core compatibility
principles:

- **Single Source of Truth (SSOT):** Maintain one authoritative, version-controlled copy of
  every skill (`.claude/skills/`) to eliminate divergence.
- **Native Discovery Compliance:** Leverage each agent's native, supported skill-discovery
  and loading mechanisms without custom patching.
- **Portable Shared Format:** Strictly follow the standardized, portable Open Agent Skills
  SKILL.md format.
- **Zero Unnecessary Duplication:** Never maintain parallel or duplicate copies of identical
  skill code for different agent runners.
- **Empirical Validation:** Verify actual skill discovery, instruction loading, and execution
  in both Claude Code and OpenCode prior to release.
- **Zero-Trust Security & Sandboxing:** Rigorously review skill instructions, helper scripts,
  and external dependencies before agent execution.
- **Explicit Version Awareness:** Document supported runtime agent versions, known edge cases,
  and platform compatibility limitations in release notes.

---

## 3. Supported Agent Environments

### 3.1 Claude Code

Claude Code serves as the primary development, runtime, and skill-authoring environment.

- **Project-Level Skills:** Stored in `.claude/skills/<skill-name>/SKILL.md`.
- **Personal Skills:** Stored globally in `~/.claude/skills/<skill-name>/SKILL.md`.
- **Behavior:** Claude Code automatically indexes project and personal skills at startup,
  matching user prompts against frontmatter descriptions to load relevant instructions
  dynamically.

### 3.2 OpenCode

OpenCode serves as the secondary development, execution, and cross-compatibility environment.

- **Supported Project Locations:** OpenCode natively reads `.claude/skills/<skill-name>/SKILL.md`
  as well as `.opencode/skills/<skill-name>/SKILL.md`.
- **Supported Global Locations:** `~/.claude/skills/<skill-name>/SKILL.md` and
  `~/.config/opencode/skills/<skill-name>/SKILL.md`.
- **Behavior:** OpenCode discovers available skills and parses their directives on demand.
  For Eazworld projects, `.claude/skills/` is designated as the primary project-level path.

---

## 4. Shared Repository Strategy

To completely eliminate code drift and maintain pristine repo hygiene:

```text
eazworld-ai-skills/
└── .claude/
    └── skills/                         # Authoritative Shared Source of Truth
        ├── software-architecture/
        │   └── SKILL.md
        ├── frontend-design/
        │   └── SKILL.md
        ├── backend-engineering/
        │   └── SKILL.md
        └── ...
```

- **Rule:** Both Claude Code and OpenCode must consume skills directly from `.claude/skills/`.
- **Prohibition:** Do not duplicate skills under `.opencode/skills/`.
- **Adapters:** If a platform-specific feature requires minor runtime adjustments, use
  isolated configuration overrides without duplicating the core skill content.

---

## 5. Universal Skill Format Specification

Every skill must use the standard directory-based structure:

```text
skill-name/
├── SKILL.md
├── references/
├── scripts/
└── assets/
```

### 5.1 YAML Frontmatter Schema

Every SKILL.md must begin with valid YAML frontmatter:

```yaml
---
name: software-architecture
description: Design scalable, secure, maintainable software architectures. Use when planning systems, evaluating architectural decisions, or reviewing existing application architecture.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---
```

- **Mandatory Fields:** `name`, `description`.
- **Recommended Fields:** `license`, `metadata.author`, `metadata.version`.
- **Naming Constraint:** The `name` field must match its parent directory name exactly and
  use lowercase kebab-case.

---

## 6. Shared Skill Instructions & Portability

To ensure instructions execute identically across diverse AI runtimes:

- Write clear, declarative Markdown instructions.
- Avoid undocumented proprietary runner syntax or platform-locked tool hooks.
- Describe required operational outcomes rather than assuming an agent has a specific
  hardcoded tool name.
- Explicitly define boundary conditions where human supervisor approval is mandatory.
- Use clean, relative paths for linking supporting reference files and assets.

---

## 7. Supporting Resources & Asset Access

Skills may include modular supporting files:

- `references/`: Deep specifications, security checklists, and technical guides.
- `scripts/`: Validated helper utilities, linters, or schema checkers.
- `assets/`: Boilerplate templates, environment samples (`.env.example`), and configuration
  schemas.

**Execution Safeguards:**

- Agents must load supporting references dynamically only when required.
- Agents must never assume helper scripts execute automatically without parameter checks.
- Skills do not grant autonomous permission to modify files, execute destructive shell
  commands, or access external networks without explicit validation.

---

## 8. Tooling & Permission Boundaries

Skills provide structured procedural knowledge, not unrestricted system permissions. Before
executing any operation, agents must verify:

- Operation necessity and alignment with user goals.
- Tool availability within the active agent session.
- Applicable repository and system security permission rules.
- Whether human operator authorization is required.

**High-Risk Operations Requiring Explicit Confirmation:**

- Production database schema migrations or data drops.
- Deployments to production infrastructure.
- Destructive file deletions or recursive directory pruning.
- Financial transactions, payment gateway integrations, or live webhook updates.
- Accessing, logging, or exposing PII and customer records.
- Installing unvetted third-party packages or running unverified shell scripts.

A skill must never instruct an agent to bypass its native permission gates.

---

## 9. Discovery & Loading Verification Workflow

Every skill must be empirically tested in both environments prior to merging:

### Claude Code Verification Protocol

1. Open the repository workspace in Claude Code.
2. Confirm the skill exists under `.claude/skills/<skill-name>/`.
3. Verify YAML frontmatter syntax and directory naming.
4. Restart the session if necessary to clear cache.
5. Issue an intentional prompt to test automatic skill discovery.
6. Explicitly invoke the skill and confirm instructions and references load correctly.

### OpenCode Verification Protocol

1. Open the repository workspace in OpenCode.
2. Confirm `.claude/skills/` is correctly indexed by the workspace.
3. Verify the skill appears in the agent's available skills menu.
4. Invoke the skill using OpenCode's execution mechanism.
5. Confirm core directives and supporting references load properly.
6. Audit permission and sandbox behavior.

---

## 10. Compatibility Testing Matrix

Every major release must record test outcomes in the release log using the standardized
matrix:

| Test Category | Claude Code Status | OpenCode Status | Notes / Limitations |
| :--- | :---: | :---: | :--- |
| Skill Discovery | PASS / FAIL / NOT TESTED | PASS / FAIL / NOT TESTED | Verified via startup index scan |
| Frontmatter Parsing | PASS / FAIL / NOT TESTED | PASS / FAIL / NOT TESTED | Validated YAML schema |
| Instruction Loading | PASS / FAIL / NOT TESTED | PASS / FAIL / NOT TESTED | Context window injection check |
| References Resolution | PASS / FAIL / NOT TESTED | PASS / FAIL / NOT TESTED | Relative link traversal check |
| Workflow Execution | PASS / FAIL / NOT TESTED | PASS / FAIL / NOT TESTED | End-to-end task dry-run |
| Permission Controls | PASS / FAIL / NOT TESTED | PASS / FAIL / NOT TESTED | Zero-trust boundary check |

Never mark an untested feature or agent runner as passing.

---

## 11. Compatibility Failure Handling

If a skill functions correctly in Claude Code but fails in OpenCode (or vice versa):

1. Capture the exact error traceback or failure symptom.
2. Isolate whether the failure stems from YAML parsing, path resolution, permission blocks,
   or unsupported runner behavior.
3. Consult the respective agent specification documentation.
4. Implement the minimal portable correction in SKILL.md or supporting files.
5. Re-run verification protocols across both agent runners.
6. Document any permanent environmental limitations in CHANGELOG.md.

Never silently strip functionality or degrade security controls merely to achieve superficial
cross-agent compatibility.

---

## 12. Version Management & Governance

Compatibility standards must be formally reviewed and updated whenever:

- Claude Code modifies its skill-discovery protocol or indexing rules.
- OpenCode updates its runtime integration engine.
- The open-source Agent Skills specification evolves.
- New security policies or permission boundaries are enforced.

All breaking changes and compatibility adjustments must be logged in CHANGELOG.md.

---

## 13. Security Requirements

To protect enterprise systems and developer workstations:

- All shared skills and helper scripts must undergo human review before merging.
- Never commit hardcoded secrets, API tokens, or private credentials.
- Enforce secure execution defaults across all scripts and automation templates.
- Validate all untrusted inputs parsed by agent workflows.
- Restrict skill execution to trusted repository content.

---

## 14. Compatibility Release Checklist

Before any skill or architectural update is tagged for release, maintainers must verify:

- [ ] Skill directory structure complies with Open Agent Skills standards.
- [ ] YAML frontmatter passes schema and linter validation.
- [ ] Skill discovery verified successfully in Claude Code.
- [ ] Skill discovery verified successfully in OpenCode.
- [ ] All supporting reference files and code examples are fully functional.
- [ ] Security scan confirms zero hardcoded credentials or malicious scripts.
- [ ] Tested agent runner versions and test dates are documented.
- [ ] Release approved by an authorized Eazworld maintainer.

---

## 15. Definition of Architectural Completion

Compatibility is successfully achieved when:

- Claude Code natively discovers and loads all shared repository skills.
- OpenCode natively discovers and loads all shared repository skills.
- Supporting reference documentation is dynamically accessible across both tools.
- Agent-specific security boundaries and permission rules are fully respected.
- No redundant, duplicate skill directories exist across agent configurations.

---

Maintained by: Eazworld  
Document: Agent Compatibility Standard  
Version: 1.0.0  
License: MIT
