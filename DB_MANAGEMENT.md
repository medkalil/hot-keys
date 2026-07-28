# PostgreSQL Database Management Guide

This guide provides common commands for managing the `hotkeys-db` PostgreSQL database running in Docker.

## 1. Accessing the Database UI (Adminer)

A lightweight database management UI (Adminer) is available to easily view and manage the database.

- **URL**: [http://localhost:8080](http://localhost:8080)
- **System**: `PostgreSQL`
- **Server**: `postgres`
- **Username**: `hotkeys_user`
- **Password**: `hotkeys_password`
- **Database**: `hotkeys_db`

After logging in, you can browse tables, run custom SQL queries, and manage data.

## 2. Connecting with `psql` (Command Line)

To get a direct `psql` shell inside the container, run the following command:

```bash
docker-compose exec postgres psql -U hotkeys_user -d hotkeys_db
```

You will be connected to the `hotkeys_db` database as the `hotkeys_user`.

**Useful `psql` commands:**
- `\dt`: List all tables.
- `\d+ leaderboard`: Describe the 'leaderboard' view and its underlying query.
- `SELECT * FROM games LIMIT 10;`: Select the first 10 rows from the `games` table.
- `\q`: Quit `psql`.

## 3. Resetting the Database

To completely wipe the database and re-run the `init.sql` seed script, follow these steps. This is useful when you want to start over with fresh data.

**Warning**: This will permanently delete all existing data in the database.

```bash
# 1. Stop and remove all running containers
docker-compose down

# 2. Remove the persistent data volume
docker volume rm hot-keys-typing-game_postgres_data

# 3. Start the services again. This will create a new volume and run the init script.
docker-compose up --build
```

## 4. Viewing Database Logs

To see the real-time logs from the PostgreSQL container, which is useful for debugging connection issues or errors:

```bash
docker-compose logs -f postgres
```

Press `Ctrl+C` to stop viewing the logs.

## 5. Creating a Database Backup

You can create a `.sql` dump file of the entire database using `pg_dump`.

```bash
# This command executes pg_dump inside the container and saves the output to backup.sql on your host machine.
docker-compose exec postgres pg_dump -U hotkeys_user -d hotkeys_db > backup.sql
```

## 6. Restoring from a Backup

To restore the database from a `.sql` backup file:

```bash
# This command executes psql inside the container, feeding it the backup.sql file from your host machine.
cat backup.sql | docker-compose exec -T postgres psql -U hotkeys_user -d hotkeys_db
```

### Helpful psql commands after connecting:
# before must connect with psql : 
    - (option 1) psql "postgresql://myuser:mypass@dpg-abc123.render.com:5432/mydb"
    - (option 2) psql \
        -h dpg-abc123.render.com \
        -p 5432 \
        -U myuser \
        -d mydb

Useful psql commands after connecting

List databases: \l

List tables: \dt

Describe a table: \d operators

Run SQL: SELECT * FROM operators;

Exit: \q