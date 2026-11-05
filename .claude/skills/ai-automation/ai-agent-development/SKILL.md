---
name: ai-agent-development
description: Design and build LLM agent systems with tools, memory, and guardrails. Use
  when orchestrating tool-calling loops, structuring planner-executor or supervisor
  agents, adding memory and context management, validating agent outputs, or controlling
  cost and failure modes.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# AI Agent Development

## 1. Overview & Purpose

Builds custom AI systems where an LLM decides and acts through tools, not just answers
questions. Target users are developers wiring agents into real business workflows —
lookups, updates, and multi-step tasks that must run reliably and cheaply. Supported
architectures: a single agent with tools, a planner–executor split, and a supervisor
coordinating sub-agents. The design rule that governs all three: the agent is bounded,
observable, and never trusted with irreversible actions unattended.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to build or modify an agent that calls tools, APIs,
  or functions.
- **Trigger 2:** When choosing between single, planner–executor, or supervisor agent
  architectures — or splitting one overloaded agent into several.
- **Trigger 3:** When adding memory, context management, evaluation sets, or cost and
  step budgets.
- **Trigger 4:** When an agent misbehaves — loops, hallucinated tool calls, or runaway
  spend.
- **Anti-Trigger:** Do not activate for single-turn Q&A bots (route to
  chatbot-development), workflow automation in n8n (route to n8n-automation), or one
  API call to a model with no decision loop.

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The task the agent must accomplish and what "done" looks like.
  2. The tools available: APIs, databases, and which actions are read-only versus
     mutating.
  3. The budget: acceptable cost per task, latency, and failure tolerance.
- **Research & Audience Audit Checklist:**
  1. Inventory existing integrations and credentials (names and scopes, never values).
  2. Collect real example tasks — the evaluation set starts from actual usage, not
     invented cases.
  3. Identify data sensitivity: what the agent may read and what it must never see.
  4. Check prior attempts: why did earlier versions fail — loops, cost, or accuracy?

## 4. Technical Standards & Rules

- Pick the simplest architecture that fits — a supervisor with sub-agents for one easy
  task is cost with no benefit.
- Tools are narrow and described precisely: one clear schema per tool, least-privilege
  access, and read tools separated from write tools.
- Every model output is validated against a schema before it is acted on — an
  unvalidated tool call is an unreviewed instruction.
- Loops are bounded: maximum steps, maximum tokens, and a hard cost budget per task;
  exceeding any limit stops the agent with a clear error.
- Irreversible actions (payments, deletes, outbound messages) require human
  confirmation or a second independent check.
- Retrieval and web content are treated as data, never as instructions — the
  injection defense lives in the prompt structure, not in hope.

Example of the backoff helper every external call goes through:

```ts
async function withBackoff<T>(fn: () => Promise<T>, tries = 4): Promise<T> {
  for (let i = 0; ; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i >= tries || !isTransient(err)) throw err; // 4xx fails fast
      await sleep(2 ** i * 250 + Math.random() * 250); // exponential + jitter
    }
  }
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the goal, the tools the agent may touch, and the
   budget and failure limits.
2. **Step 2: Inspect Context** — Execute the audit checklist; report what integrations
   and evaluation examples already exist.
3. **Step 3: Formulate Plan** — Choose the architecture, define the tool set, and draw
   the loop: decide → act → observe → repeat until done or bounded.
4. **Step 4: Verify Security** — Confirm prompt injection defenses, tool permissions,
   and that all keys stay environment-only.
5. **Step 5: Apply Edits** — Implement tools first, then the loop with budgets, then
   memory and the evaluation harness.
6. **Step 6: Execute Tests** — Run the evaluation set, inject hostile inputs to test
   injection defense, force API failures to prove backoff, and record cost per task.
7. **Step 7: Report Status** — Report accuracy against the eval set, cost per task,
   failure modes observed, and what remains unbounded.

## 6. Security & Edge Case Guidelines

- **Environment Isolation:** Model and tool API keys live in environment variables
  only, scoped per environment — they never appear in prompts, logs, traces, or the
  repository.
- **Prompt Injection:** External content (files, web pages, tool results) is wrapped
  as untrusted data; instructions found inside it are ignored by design.
- **Tool Permissions:** Each tool declares its risk; write tools need confirmation
  flows, and the agent cannot grant itself new tools.
- **Retry Discipline:** Transient failures (429, 5xx, timeouts) retry with exponential
  backoff and jitter; permanent errors (4xx) fail fast and surface — never retried
  blindly.
- **Cost Edges:** A looping agent is a billing incident — budgets are enforced in
  code, and the circuit breaker trips before the limit, not after.

## 7. Definition of Done & Quality Gates

- [ ] Architecture chosen and justified against the task complexity.
- [ ] Loop proven bounded: step, token, and cost limits enforced in code.
- [ ] Evaluation set passes at an agreed accuracy threshold.
- [ ] Injection test: hostile retrieved content produced no unauthorized tool call.
- [ ] Backoff proven by forced transient failure; permanent errors fail fast.
- [ ] No keys anywhere except environment variables.
- [ ] Cost per task measured and within budget.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; the model provider's tool-use
  documentation is the reference at implementation time.
