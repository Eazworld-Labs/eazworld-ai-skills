---
name: database-architecture
description: Design database schemas, migrations, indexes, and query performance for
  PostgreSQL, MongoDB, and Redis. Use when creating or changing tables and collections,
  writing migrations, modeling entities and relationships, adding indexes, planning caches,
  or diagnosing slow queries.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.0.0"
---

# Database Architecture

## 1. Overview & Purpose

Owns the data layer: entity modeling, schema evolution through migrations, indexing, and
query performance. Delivers schemas that match real access patterns, migrations that apply
cleanly forward and backward, and an index plan justified by the queries that actually
run — not by guesswork.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to design or change a schema, table, or collection.
- **Trigger 2:** When writing, reviewing, or reverting database migrations.
- **Trigger 3:** When adding indexes, planning a cache layer, or diagnosing slow queries.
- **Trigger 4:** When deciding between normalization and denormalization for a specific
  read pattern.
- **Anti-Trigger:** Do not activate for application business logic (route to
  backend-engineering) or API contract design (route to api-development).

## 3. Required Inputs & Project Audit

Before modeling anything, inspect the target repository and data requirements:

- **Mandatory Inputs:**
  1. Entities, attributes, and relationships (an ER sketch, even rough, is required).
  2. Query and access patterns: which reads and writes happen, how often, and with what
     filters.
  3. Growth expectations and any PII that will be stored.
- **Codebase Audit Checklist:**
  1. Read the existing migrations to learn naming conventions and current schema state.
  2. Check the ORM or driver in use (Prisma, Mongoose, pg) and follow its patterns.
  3. Review existing query code for the filters and joins that must be served.
  4. Look for slow-query logs or performance notes from previous work.

## 4. Technical Standards & Rules

- Normalize to third normal form by default; denormalize only with a measured reason
  documented next to the schema.
- Naming: tables plural snake_case (`order_items`), columns snake_case, foreign keys
  `<entity>_id`, indexes `idx_<table>_<columns>`.
- Indexes follow actual query patterns — every `WHERE`, `JOIN`, and `ORDER BY` on large
  tables gets a matching composite index, ordered by equality columns first, then range
  and sort columns.
- Migrations are forward and reversible, one concern per migration, and never edit a
  migration that has already run in a shared environment.
- Redis is for cache, queues, and rate counters — always with a TTL; it is not a source of
  truth.
- Flexible JSONB/NoSQL shapes are reserved for genuinely variable data, not used to avoid
  modeling.

Example migration with a matching index (up and down):

```sql
-- up
CREATE TABLE orders (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers (id),
  status      text NOT NULL DEFAULT 'pending',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_customer_created
  ON orders (customer_id, created_at DESC);

-- down
DROP TABLE orders;
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the entities, relationships, and the queries the
   schema must serve.
2. **Step 2: Inspect Context** — Execute the audit checklist; capture the current schema
   and conventions.
3. **Step 3: Formulate Plan** — Produce the ER sketch and list every migration the change
   requires.
4. **Step 4: Verify Security** — Inventory PII columns, confirm least-privilege database
   roles, and flag anything destructive.
5. **Step 5: Apply Edits** — Write the migration (up and down) and the schema changes with
   exact naming conventions.
6. **Step 6: Execute Tests** — Apply the migration to a local database, run it down and up
   again, and run representative queries with `EXPLAIN` to confirm index usage.
7. **Step 7: Report Status** — Report the schema change, index plan, measured query plans,
   and rollback steps.

## 6. Security & Edge Case Guidelines

- **Zero Hardcoding:** Connection strings come from `DATABASE_URL` (or equivalent) in the
  environment — never from code or committed config files.
- **Least Privilege:** Application roles receive only the privileges their queries need;
  migrations may use a higher-privilege role, the app never does.
- **PII Discipline:** Minimize personal data, document every PII column, and encrypt
  sensitive columns where the platform supports it.
- **Destructive Operations:** Dropping, truncating, or renaming production objects, and
  mass deletes, require explicit human confirmation — always scope deletes with a `WHERE`
  clause.
- **Backups:** Take or verify a backup before any risky migration; know the rollback path
  before applying it.

## 7. Definition of Done & Quality Gates

- [ ] Migration applies cleanly up and down on a local database.
- [ ] ER relationships are consistent — no orphaned foreign keys.
- [ ] Key queries show index usage via `EXPLAIN` on representative data.
- [ ] Test suite passes against the migrated schema.
- [ ] No credentials or connection strings present in the diff.
- [ ] PII columns documented and destructive steps flagged for human confirmation.

## 8. Supporting References & Assets

- Reference guide: [Indexing & Query Tuning Guide](./references/indexing-guide.md)
