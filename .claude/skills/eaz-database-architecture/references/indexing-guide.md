# Indexing & Query Tuning Guide

Companion to the `eaz-database-architecture` skill. Deep material for index design and query
performance on PostgreSQL, MongoDB, and Redis. Read only when the workflow reaches the
index-planning or slow-query steps.

## When an Index Is Justified

Add an index when a query filters, joins, or sorts on a column **and** the table is large
enough that a full scan matters. Every index has a cost: slower writes, extra storage, and
maintenance during migrations. Index what the queries actually do — never "just in case".

## Composite Index Ordering

Order columns by how the query uses them:

1. **Equality** columns first (`WHERE status = 'paid'`).
2. **Range** columns next (`WHERE created_at > ...`).
3. **Sort** columns last (`ORDER BY created_at DESC`).

A single composite index serves many queries; redundant overlapping indexes should be
consolidated.

```sql
-- Serves: WHERE customer_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX idx_orders_customer_status_created
  ON orders (customer_id, status, created_at DESC);
```

## Covering Indexes

If the index includes every column the query reads, PostgreSQL can answer it from the
index alone (an index-only scan):

```sql
CREATE INDEX idx_orders_lookup ON orders (id) INCLUDE (total_cents, currency);
```

Use sparingly — `INCLUDE` columns bloat the index and slow writes.

## PostgreSQL Pitfalls

- Functions or expressions on an indexed column hide it from the planner:
  `WHERE lower(email) = ...` needs an index on `lower(email)`, not `email`.
- Leading wildcard `LIKE '%term'` cannot use a B-tree — consider a trigram index.
- A column with two or three distinct values (boolean, status) rarely benefits from a
  plain B-tree; a **partial index** targeting the hot subset usually wins:

```sql
CREATE INDEX idx_orders_pending ON orders (created_at)
  WHERE status = 'pending';
```

## MongoDB Notes

- Default index on `_id` exists; every other index must earn its write cost.
- Compound index order follows the same equality → sort → range rule.
- `explain("executionStats")` is the MongoDB counterpart of `EXPLAIN` — check for
  `COLLSCAN` on collections that should be indexed.

## Redis Cache Patterns

- Always set a TTL — a cache without expiry is a slow database that forgets nothing.
- Cache the expensive-to-compute value, not the raw database row copy.
- Use `SET key value EX seconds NX` for cache-aside writes so concurrent misses do not
  stampede the database.

## Reading EXPLAIN (PostgreSQL)

| Plan signal | Meaning | Action |
| :--- | :--- | :--- |
| `Seq Scan` on a large table | Index not used or not selective | Check column order and statistics |
| `Index Scan` | Index used | Verify it is the intended index |
| `Index Only Scan` | Covering index paid off | Confirm visibility map is healthy |
| `Rows Removed by Filter` very high | Poor index selectivity | Consider a partial or composite index |
| `Sort Method: external Merge` | Work does not fit in memory | Add matching `ORDER BY` index or raise work memory |

Run `EXPLAIN ANALYZE` on representative data — plans on empty tables lie.

## Pre-merge Checklist

- [ ] Every large-table `WHERE`, `JOIN`, and `ORDER BY` maps to an index.
- [ ] Composite columns ordered equality → range → sort.
- [ ] No duplicate or redundant overlapping indexes.
- [ ] Write-heavy tables keep their index count lean.
- [ ] Plans verified with `EXPLAIN ANALYZE` on representative data.
- [ ] Migration includes the index creation and its reversal.
