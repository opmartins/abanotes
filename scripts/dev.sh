#!/usr/bin/env bash
set -euo pipefail

# dev.sh - Sobe a stack local (db, server, web), aguarda o Postgres ficar saudável
# e aplica as migrações Prisma automaticamente. Opcionalmente reconstrói as imagens
# com a flag -b|--build.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$ROOT_DIR"

BUILD=false
while [[ ${1:-} =~ ^- ]]; do
  case "$1" in
    -b|--build) BUILD=true ; shift ;;
    -h|--help)
      cat <<EOF
Uso: scripts/dev.sh [opções]

Opções:
  -b, --build   Executa docker compose up -d --build
  -h, --help    Mostra esta ajuda
EOF
      exit 0
      ;;
    *) echo "Opção desconhecida: $1" >&2; exit 1 ;;
  esac
done

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker não encontrado. Instale e inicie o Docker Desktop." >&2
  exit 1
fi

if [[ ! -f .env ]]; then
  echo ".env não encontrado na raiz. Crie a partir de .env.example ou do exemplo abaixo:" >&2
  cat <<'ENV'
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=clinica_autismo
DATABASE_URL=postgresql://postgres:postgres@db:5432/clinica_autismo?schema=public
JWT_SECRET=local-dev-secret
ENV
  exit 1
fi

echo "[1/4] Subindo containers..."
if [[ "$BUILD" == "true" ]]; then
  docker compose up -d --build
else
  docker compose up -d
fi

DB_ID=$(docker compose ps -q db)
if [[ -z "$DB_ID" ]]; then
  echo "Container do banco não encontrado." >&2
  exit 1
fi

echo "[2/4] Aguardando Postgres saudável..."
# Aguarda status healthy (timeout ~120s)
for i in {1..60}; do
  STATUS=$(docker inspect -f '{{ .State.Health.Status }}' "$DB_ID" 2>/dev/null || echo "")
  if [[ "$STATUS" == "healthy" ]]; then
    echo "Postgres saudável."
    break
  fi
  if [[ $i -eq 60 ]]; then
    echo "Timeout esperando Postgres ficar saudável." >&2
    docker compose logs db --tail=100
    exit 1
  fi
  sleep 2
  printf "."
done

echo "[3/5] Aplicando migrações Prisma..."
# Se já existem migrações, usa deploy; senão cria inicial
docker compose exec -T server sh -lc '
  if [ -d /app/prisma/migrations ] && [ "$(ls -A /app/prisma/migrations 2>/dev/null || true)" ]; then
    npx prisma migrate deploy
  else
    npx prisma migrate dev --name init --skip-seed
  fi
'

echo "[4/5] (Opcional) Executando seed Prisma..."
if [[ ${RUN_SEED:-false} == "true" ]]; then
  docker compose exec -T server npx prisma db seed || echo "Seed falhou (continuando)."
else
  echo "Seed pulado (defina RUN_SEED=true para habilitar)."
fi

echo "[5/5] Tudo pronto!\n"
echo "URLs:"
echo "  API:       http://localhost:3000/api/health"
echo "  Frontend:  http://localhost:8080"

echo "Testes rápidos:"
echo "  curl -sf http://localhost:3000/api/health && echo"
echo "Seed manual: docker compose exec server npx prisma db seed"
