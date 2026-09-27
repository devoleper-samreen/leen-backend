# Leen Backend

Node.js + Express + MongoDB microservices backend for the Leen V4 platform. See [`v4-flow.md`](./v4-flow.md) for the product flow spec this backend is designed against, and [`docs/architecture.md`](./docs/architecture.md) for the service architecture.

**Status:** Milestone 1 — architecture, DB schemas, and API contracts are scaffolded. Route handlers are contract-only stubs (`501 Not Implemented`); business logic lands in later milestones.

## Structure

```
shared/                 # @leen/shared - common types, middlewares, mongoose helpers
gateway/                # API gateway - single public entrypoint, proxies to services
services/
  auth-service/         # Users, role profiles, sub-admin RBAC
  catalog-service/      # Cities, categories, services, pricing, job templates, promos
  booking-service/      # Bookings, job execution lifecycle, reviews
  payment-service/      # Payments, wallets, payouts, refunds, commission
  chat-service/         # Predefined-message chat (Customer <-> Staff)
  support-dispute-service/ # Support tickets + disputes
  notification-service/ # Notifications, device tokens
  admin-service/        # CMS banners, reports, audit log
docs/
  architecture.md
  api-contracts/*.yaml  # OpenAPI spec per service (mirrors each service's own openapi.yaml)
```

## Getting Started

```bash
npm install                 # installs all workspaces
cp gateway/.env.example gateway/.env
cp services/auth-service/.env.example services/auth-service/.env
# ...repeat for each service...

npm run dev:auth            # start one service, e.g. auth-service
npm run dev:gateway          # start the gateway
```

Or bring everything up together (requires Docker):

```bash
docker-compose up --build
```

Health check any service: `curl http://localhost:<port>/health`. Gateway Swagger UI (all services' contracts combined): `http://localhost:8080/docs`.

## Ports

| Service | Port |
|---|---|
| gateway | 8080 |
| auth-service | 4001 |
| catalog-service | 4002 |
| booking-service | 4003 |
| payment-service | 4004 |
| chat-service | 4005 |
| support-dispute-service | 4006 |
| notification-service | 4007 |
| admin-service | 4008 |
