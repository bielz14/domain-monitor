#!/bin/bash
set -e

cd /var/www/html

echo "Waiting for MySQL..."
until php -r "
    try {
        new PDO(
            'mysql:host='.getenv('DB_HOST').';port='.getenv('DB_PORT').';dbname='.getenv('DB_DATABASE'),
            getenv('DB_USERNAME'),
            getenv('DB_PASSWORD')
        );
        exit(0);
    } catch (Exception \$e) {
        exit(1);
    }
"; do
    echo "MySQL not ready, retrying in 2s..."
    sleep 2
done

echo "MySQL is ready!"

# Якщо немає APP_KEY — генеруємо
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force --env=docker
fi

# Експортуємо APP_KEY з .env.docker в поточне середовище процесу
export APP_KEY=$(grep APP_KEY .env.docker | cut -d'=' -f2)

if [ \"$CONTAINER_ROLE\" = \"app\" ]; then
    echo "Running migrations..."
    php artisan migrate --force || true

    echo "Running seeders..."
    php artisan db:seed --force || true

    echo "Caching config..."
    php artisan config:cache || true

    echo "Starting Laravel server..."
    exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
fi

if [ \"$CONTAINER_ROLE\" = \"queue\" ]; then
    echo "Starting queue worker..."
    exec php artisan queue:work --tries=3 --timeout=90
fi

if [ \"$CONTAINER_ROLE\" = \"scheduler\" ]; then
    echo "Starting scheduler..."
    exec sh -c "while true; do php artisan schedule:run; sleep 60; done"
fi
