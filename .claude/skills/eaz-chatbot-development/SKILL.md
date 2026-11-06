---
name: eaz-chatbot-development
description: Design and implement task-scoped chatbots. Use when mapping conversation
  flows and states, choosing between flow-based and LLM-assisted designs, writing
  fallback and escalation rules, adding human handoff, or measuring containment and
  resolution rates.
license: MIT
metadata:
  author: Eazworld
  department: ai-automation
  version: "1.0.0"
---

# Chatbot Development

## 1. Overview & Purpose

Builds conversation systems that finish a defined job well — order status, bookings,
FAQs, lead capture — and hand off cleanly when they cannot. Target users are support
and product teams drowning in repetitive inquiries. Supported architectures: a
deterministic flow (state machine) for narrow high-volume tasks, an LLM-assisted design
grounded in approved knowledge, and a hybrid that starts deterministic and escalates.
Scope boundary: task-scoped dialogue lives here; autonomous tool-using systems route
to eaz-ai-agent-development.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to design or build a chatbot or conversation flow.
- **Trigger 2:** When choosing between flow-based, LLM-assisted, or hybrid designs for
  a support or sales use case.
- **Trigger 3:** When writing fallback rules, escalation paths, or human handoff
  behavior.
- **Trigger 4:** When a bot dead-ends, loops, wanders off-topic, or containment
  numbers are poor.
- **Anti-Trigger:** Do not activate for autonomous agents that act through tools
  (route to eaz-ai-agent-development), channel and template rules for WhatsApp (route to
  eaz-whatsapp-automation), or CRM record sync (route to eaz-crm-automation).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The real inquiries: a sample of actual customer messages the bot must handle.
  2. The bot's scope statement — what it answers and what it explicitly does not.
  3. The handoff path: who receives escalations, during which hours, with what
     response promise.
- **Research & Audience Audit Checklist:**
  1. Cluster support tickets into intents with frequency — build for the top five
     first, not for the long tail.
  2. Read existing help content: the bot's answers must come from approved sources.
  3. Check the languages and tone customers actually use, including code-switching.
  4. Note previous bot attempts and why users abandoned them.

## 4. Technical Standards & Rules

- Architecture follows volume and risk: deterministic flows for narrow tasks where
  correctness matters, LLM-assisted only with retrieval from approved knowledge, and
  a stated fallback when confidence is low.
- Every conversation defines the full lifecycle: greeting, intent recognition,
  fulfillment, fallback, handoff, and end states — no state is implicit.
- The fallback never dead-ends: it offers alternatives or a human, always.
- Handoff transfers the full context — intent, collected fields, and transcript — so
  the customer never repeats themselves; repeating information is the top reason
  users abandon bots.
- The bot states what it is; it does not pretend to be a human, and its scope
  statement is enforced rather than politely ignored when users push past it.
- Responses stay fast: an answer within a couple seconds or an honest typing
  affordance while working.

Example of an intent definition with fallback and handoff:

```json
{
  "intent": "track_order",
  "required": ["order_id"],
  "steps": [
    { "ask": "Please share your order number." },
    { "lookup": "orders.byReference", "onFail": "fallback_order_not_found" }
  ],
  "handoff": { "when": "repeat_fallback", "include": ["transcript", "intent"] }
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the intents in scope, the architecture chosen,
   and the handoff promise.
2. **Step 2: Inspect Context** — Execute the audit checklist; report intent volumes
   and approved knowledge sources before designing flows.
3. **Step 3: Formulate Plan** — Draw the dialogue map: states, transitions,
   fallbacks, and every exit including handoff.
4. **Step 4: Verify Security** — Confirm PII handling in transcripts, injection
   resistance in any LLM component, and that keys stay environment-only.
5. **Step 5: Apply Edits** — Implement states and intents, then fallback and handoff
   rules, then the measurement hooks.
6. **Step 6: Execute Tests** — Run a dialogue test set per intent, plus hostile and
   off-topic inputs, and force a fallback-to-handoff path end to end.
7. **Step 7: Report Status** — Report flows shipped, test results, and the baseline
   for containment and resolution.

## 6. Security & Edge Case Guidelines

- **PII in Transcripts:** Names, addresses, and payment details are masked in logs
  and analytics; transcripts have a defined retention limit and access control.
- **Prompt Injection:** Any LLM component follows the approved knowledge base only —
  user input never rewrites instructions, and jailbreak-style inputs hit the
  fallback, not the guardrails' blind spot.
- **Environment Isolation:** Model and API keys live in environment variables only;
  they never appear in conversation logs or client bundles.
- **Retry Discipline:** Transient model failures retry with exponential backoff; if
  the model stays unreachable, the bot degrades to its deterministic answers instead
  of showing users an error.
- **Honest Edges:** The bot discloses that it is automated, cannot fabricate answers
  it does not have, and escalates sensitive complaints immediately rather than
  improvising.

## 7. Definition of Done & Quality Gates

- [ ] Dialogue test set passes for every in-scope intent.
- [ ] Fallback and human-handoff paths proven end to end with context intact.
- [ ] Hostile and off-topic inputs handled without instruction override.
- [ ] Bot discloses its nature; no deceptive human mimicry anywhere.
- [ ] Transcript PII masked; retention limit defined.
- [ ] Keys environment-only; backoff degrades to deterministic answers on model
      failure.
- [ ] KPIs defined with baseline and target — containment rate, resolution rate,
      handoff rate, and time to first response.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; the dialogue test set lives
  with the project as its living specification.
