---
name: eaz-software-architecture
description: Design system-level architecture and make durable technical decisions for new
  and existing products. Use when asked to plan system design, choose between monolith and
  microservices, define module boundaries, structure a codebase, evaluate a scaling
  strategy, or write an Architecture Decision Record.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.0.0"
---

# Software Architecture

## 1. Overview & Purpose

Designs the high-level structure of a system: component boundaries, data flow, technology
choices, and the trade-offs behind them. Produces a clear, reviewable design — usually an
Architecture Decision Record — that the implementation skills (eaz-backend-engineering,
eaz-database-architecture, eaz-api-development) execute against. Optimizes for reversible
decisions, explicit trade-offs, and a structure the current team can actually operate.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to design, plan, or review the architecture of a system
  or service.
- **Trigger 2:** When deciding between monolith, modular monolith, and microservices, or
  when a codebase has outgrown its current structure.
- **Trigger 3:** When requesting an ADR, a technical design document, or a scalability
  plan.
- **Anti-Trigger:** Do not activate for implementing a single feature, writing UI
  components, or routine bug fixes — those belong to the department's implementation
  skills.

## 3. Required Inputs & Project Audit

Before proposing any structure, inspect the target repository:

- **Mandatory Inputs:**
  1. Problem statement: what the system must do and for whom.
  2. Scale expectations: users, requests per day, data volume — honest estimates are fine.
  3. Constraints: team size, budget, deadline, compliance requirements.
- **Codebase Audit Checklist:**
  1. Read `package.json` (or equivalent manifest) for the existing stack and versions.
  2. Map the current directory structure and identify existing module boundaries.
  3. Review existing docs, diagrams, and any prior decision records.
  4. Check deployment configuration to understand the current runtime topology.

## 4. Technical Standards & Rules

- Follow the Eazworld stack alignment: React/Next.js, Node.js/Express, PostgreSQL/MongoDB,
  Redis — proposing a migration to a new stack requires explicit human approval.
- Start with a modular monolith; earn microservices only when a concrete scaling or team
  boundary demands it — infrastructure YAGNI applies too.
- Every module owns its data: no reaching across boundaries into another module's tables
  or private state.
- Record every non-trivial decision in an ADR (see reference): status, context, options,
  decision, consequences.
- Prefer reversible decisions, and document the reversal path for irreversible ones.

Example of a module boundary expressed as a typed contract:

```ts
// orders module — the only surface other modules may import
export interface OrderService {
  getById(id: OrderId): Promise<Order | null>;
  place(command: PlaceOrderCommand): Promise<OrderId>;
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the problem, scale assumptions, and hard constraints in
   one paragraph; confirm anything critical that is missing before proceeding.
2. **Step 2: Audit Project** — Execute the checklist in section 3; describe the system as
   it exists today before proposing any changes.
3. **Step 3: Formulate Plan** — Draft 2–3 candidate architectures with a trade-off table
   covering complexity, cost, team fit, and time-to-deliver.
4. **Step 4: Verify Security** — Walk each candidate through its trust boundaries: where
   authentication happens, where secrets live, what fails if one component is compromised.
5. **Step 5: Apply Edits** — Write the chosen design as an ADR with a component and
   data-flow diagram (Mermaid or ASCII).
6. **Step 6: Execute Tests** — Sanity-check the design: every requirement maps to a
   component, and no component exists without a requirement.
7. **Step 7: Report Status** — Present the decision, the rejected alternatives and why, and
   the concrete next implementation steps.

## 6. Security & Edge Case Guidelines

- **Zero Trust Boundaries:** No service or module trusts another by default —
  authenticate and authorize at every boundary, including internal ones.
- **Secrets:** The architecture must place secrets in environment variables only; diagrams
  and ADRs reference variable names, never values.
- **Failure Modes:** For each component, state what happens when it is down, slow, or
  returns garbage — designs without degradation paths are incomplete.
- **Scale Events:** Identify the first component that breaks under 10× load and how it is
  relieved (cache, queue, partition).
- **Destructive Changes:** Proposing data migrations, deletions, or infrastructure teardown
  requires explicit human confirmation before execution.

## 7. Definition of Done & Quality Gates

- [ ] ADR written with context, options, decision, and consequences.
- [ ] Component and data-flow diagram included and readable without the prose.
- [ ] Every functional requirement maps to at least one component.
- [ ] No unapproved technology migrations; stack matches Eazworld alignment or is flagged.
- [ ] Security boundaries and failure modes documented.
- [ ] Human maintainer has reviewed the design — self-approval is prohibited.

## 8. Supporting References & Assets

- ADR template: [Architecture Decision Record Template](./references/adr-template.md)
