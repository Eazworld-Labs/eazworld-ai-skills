# Database Migrations

Companion to the `eaz-cloud-devops` skill. Backward-compatible migrations, rollback
migrations, and pipeline ordering.

## Core principles

- **Migrations run as a separate pipeline step** before the deploy, never as part of
  application startup.
- **Migrations must be backward-compatible:** the currently running application version
  must continue to work with the migrated schema.
- **Every forward migration needs a rollback migration.**
- **Never drop columns or tables** in the same deploy that removes code referencing them.
  Deprecate first, remove later.
- **Test migrations on a copy of production data** before running on production.

## Migration pipeline ordering

```
1. Build application image
2. Run tests
3. Push image to registry
4. Run database migrations (pre-deploy step)
5. Deploy new application version
6. Verify health checks
7. (Optional) Run post-deploy data backfill
```

## Backward-compatible migration rules

| Do | Don't |
| :--- | :--- |
| Add new columns/tables | Drop columns/tables in-use |
| Make new columns nullable | Make existing columns NOT NULL without data |
| Add new indexes | Rename columns/tables |
| Add default values for new columns | Change column types |
| Use `IF NOT EXISTS` | Assume migration runs once |

### Example — safe migration pattern

```sql
-- Forward: add nullable column
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);

-- Backward-compatible: app can read/write phone_number
-- Old code ignores it; new code uses it

-- Rollback: drop the column
ALTER TABLE users DROP COLUMN phone_number;
```

### Example — unsafe (do not do)

```sql
-- DON'T: drop a column the current app still reads
ALTER TABLE users DROP COLUMN legacy_email;

-- DON'T: make a column NOT NULL without backfilling
ALTER TABLE users ALTER COLUMN phone_number SET NOT NULL;
```

## Zero-downtime column removal pattern

If you must remove a column:

1. **Deploy 1:** Stop writing to the column in code; keep reading it
2. **Deploy 2:** Stop reading from the column in code
3. **Deploy 3:** Drop the column via migration

Each step is its own deploy with its own migration.

## Rollback migrations

Every forward migration should have a corresponding rollback:

```sql
-- 20240115120000_add_phone_number.up.sql
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);

-- 20240115120000_add_phone_number.down.sql
ALTER TABLE users DROP COLUMN phone_number;
```

## Testing migrations

1. Clone production data to a staging database
2. Run the migration against the staging copy
3. Verify the application works with the new schema
4. Time the migration — if it takes minutes on production data, plan for downtime or
   use online schema change tools
5. Document the migration time and any locks acquired

## Online schema changes for large tables

For tables with millions of rows, avoid `ALTER TABLE` locks:

- **PostgreSQL:** Use `pg_repack` or logical replication for major changes
- **MySQL:** Use `gh-ost` or `pt-online-schema-change`
- **Planet-scale:** Use their online schema change workflow

## Migration tools by stack

| Stack | Tool |
| :--- | :--- |
| Node.js / TypeScript | Prisma migrations, Knex, Sequelize migrations |
| Python | Alembic, Django migrations |
| PHP/Laravel | Laravel migrations |
| Ruby | ActiveRecord migrations |
| Go | golang-migrate, sql-migrate |
| .NET | EF Core migrations |

## Example — migration step in GitHub Actions

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run migrations
        run: |
          npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}
      - name: Deploy application
        run: fly deploy
```
