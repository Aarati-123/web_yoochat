# Database Migrations

This directory contains SQL migration files for the YooChat database.

## Migration Files

- `001_initial_schema.sql` - Initial database schema with all tables and indexes

## How Migrations Work

1. Each migration file is named with a number prefix (001, 002, etc.)
2. Migrations are executed in order by filename
3. Each migration is tracked in the `schema_migrations` table
4. Already-executed migrations are automatically skipped

## Running Migrations

From the backend directory, run:

```bash
npm run migrate
```

This will:
- Connect to your Neon PostgreSQL database
- Create all necessary tables if they don't exist
- Track which migrations have been executed
- Skip migrations that have already run

## Database Schema

### Tables Created:
- **users** - User accounts and profiles
- **friendship** - Friend connections and requests
- **blockeduser** - Blocked user relationships
- **message** - Direct messages between users
- **posts** - User posts/contributions
- **post_images** - Images attached to posts
- **post_reactions** - Likes/reactions on posts
- **saved_posts** - Posts saved by users
- **notifications** - User notifications
- **schema_migrations** - Migration tracking (auto-created)

### Indexes:
Performance indexes are created on frequently queried columns to ensure fast query execution.

## Troubleshooting

If a migration fails:
1. Check the error message in the console
2. Verify your DATABASE_URL in `.env` is correct
3. Ensure your Neon database is accessible
4. Check the migration SQL syntax

## Adding New Migrations

To add a new migration:
1. Create a new file: `002_your_migration_name.sql`
2. Write your SQL statements
3. Run `npm run migrate`
