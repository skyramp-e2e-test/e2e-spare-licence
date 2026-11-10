# e2e-web-app

A small Node.js (Express) + PostgreSQL web app used as a target for end-to-end testing.

## What's inside

| Path | Description |
| --- | --- |
| `GET /` | Home page |
| `GET /login` | Login page (form posts to `POST /login`) |
| `GET /items` | Items page: lists items and lets you add new ones |
| `GET /api/items` | JSON list of items |
| `POST /api/items` | Create an item. Body: `{"name": "..."}`. Returns `201` with the created item; returns `400` if `name` is missing |
| `GET /health`, `GET /healthz` | Health checks. Both return `200` |

`docker-compose.yml` defines two services:

- `db`: PostgreSQL 16
- `app`: this Express server. It waits for `db` to be healthy before starting.

On startup the app creates its tables and seeds a test user.

## Required configuration

The app **refuses to start** unless `APP_LICENCE_KEY` is set to the correct licence key. At startup it compares the SHA-256 hash of the value against the expected hash. The app never prints or logs the value.

`APP_LICENCE_KEY` is **provided by the customer**. Do not generate your own value; use the key the customer gives you.

If the variable is missing or empty:

- `docker compose up` stops with `APP_LICENCE_KEY is not set`.
- The app exits with code 1 and prints `Startup error: APP_LICENCE_KEY is not set`.

If the variable is set but its SHA-256 hash does not match, the app exits with code 1 and prints `Startup error: APP_LICENCE_KEY is wrong`.

## Start the app

Requires Docker with Compose v2.

```bash
export APP_LICENCE_KEY="<licence key provided by the customer>"
docker compose up --build
```

Then open http://localhost:3000.

To stop the app and delete the database volume:

```bash
docker compose down -v
```

### Run without Docker (optional)

With a PostgreSQL instance reachable at `DATABASE_URL`:

```bash
npm install
APP_LICENCE_KEY="<licence key provided by the customer>" \
DATABASE_URL=postgres://app:app@localhost:5432/app \
npm start
```

## Sign in with the test user

The app seeds this user every time it starts:

- **Email:** `test@example.com`
- **Password:** `password123`

1. Go to http://localhost:3000/login.
2. Enter the email and password above and click **Sign in**.
3. You are redirected to `/items`, which shows "Signed in as test@example.com".

If you enter wrong credentials, the login page shows "Invalid email or password."

## Quick API check

```bash
curl -i http://localhost:3000/health
curl -i http://localhost:3000/healthz
curl -s -X POST http://localhost:3000/api/items \
  -H 'Content-Type: application/json' -d '{"name":"First item"}'
curl -s http://localhost:3000/api/items
```
