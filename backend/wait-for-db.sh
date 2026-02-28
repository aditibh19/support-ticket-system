#!/bin/sh
set -e

host=${DB_HOST:-db}
port=${DB_PORT:-5432}

echo "Waiting for PostgreSQL at $host:$port..."

until nc -z $host $port; do
  echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Postgres is up - running migrations"
python manage.py migrate

echo "Starting Django server"
python manage.py runserver 0.0.0.0:8000