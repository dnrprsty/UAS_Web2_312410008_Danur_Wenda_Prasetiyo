#!/bin/sh
set -e

# Apache must listen on the port the host provides (Render sets $PORT).
export PORT="${PORT:-10000}"

# Build a production .env from the env vars the host injects. CodeIgniter reads
# scalar settings from .env; the TLS CA path is handled in app/Config/Database.php.
if [ -n "$DB_HOST" ]; then
  cat > /var/www/html/.env <<EOF
CI_ENVIRONMENT = ${CI_ENVIRONMENT:-production}
app.baseURL = '${APP_BASE_URL}'
database.default.hostname = ${DB_HOST}
database.default.database = ${DB_NAME}
database.default.username = ${DB_USER}
database.default.password = ${DB_PASS}
database.default.DBDriver = MySQLi
database.default.port = ${DB_PORT:-4000}
EOF
fi

# Apply schema migrations on every boot (idempotent). Never auto-seed here:
# MainSeeder truncates tables, so seeding is a one-time manual step (see DEPLOY.md).
php spark migrate --all || echo "[entrypoint] migration skipped (DB unreachable?) — starting web server anyway"

exec apache2-foreground
