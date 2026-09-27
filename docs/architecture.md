# Leen Backend — Architecture (Milestone 1)

## Overview

Node.js + Express + MongoDB microservices backend for the Leen platform (Customer, Partner, Staff apps + Admin dashboard), built as an npm-workspaces monorepo in TypeScript. Each service owns its own MongoDB database — no shared schema, no cross-service joins. Services reference each other only by ObjectId.

```
Client apps (Customer/Partner/Staff/Admin)
            |
        API Gateway  (single public entrypoint, JWT verification, Swagger UI at /docs)
            |
  -----------------------------------------------------------
  |        |         |         |       |         |         |
auth   catalog   booking   payment   chat   support/    notification   admin
service service   service   service service  disputes    service       service
  |        |         |         |       |     service        |            |
leen_auth leen_catalog leen_booking leen_payment leen_chat leen_support leen_notification leen_admin
(each its own MongoDB database)
```

## Service Boundaries & Data Ownership

| Service | Owns | Port |
|---|---|---|
| auth-service | Users, role profiles (Customer/Partner/Staff/Admin), sub-admin RBAC roles, OTPs, refresh tokens | 4001 |
| catalog-service | Cities, Categories, Sub-Categories, Services, Pricing Tiers, Job Templates, Promo Codes | 4002 |
| booking-service | Bookings (urgent/scheduled), status history, reviews | 4003 |
| payment-service | Payments, Wallets, Payout Requests, Refunds, Commission Ledger | 4004 |
| chat-service | Conversations, Messages (predefined-template only), Message Templates | 4005 |
| support-dispute-service | Support Tickets, Disputes | 4006 |
| notification-service | Notifications, Device Tokens, Notification Templates | 4007 |
| admin-service | CMS Banners, Reports, Audit Log | 4008 |

Rule: a service never reads another service's database directly. Cross-service data needed at request time is either passed in the request payload by the caller or fetched via that other service's REST API (through the gateway).

## Communication Pattern (Milestone 1)

**Synchronous REST only**, through the API Gateway. The gateway proxies `/api/<prefix>/*` to the owning service, stripping its own prefix (`http-proxy-middleware`, mounted with `app.use(prefix, proxy)`), so each service's internal routes are mounted at root and must not repeat the resource segment the gateway already stripped. A few gateway prefixes intentionally share one backing service (e.g. `/api/auth`, `/api/profiles`, `/api/roles` → auth-service; `/api/support`, `/api/disputes` → support-dispute-service) since one service can expose more than one external resource group.

**Deliberately deferred to a later milestone**: asynchronous eventing (RabbitMQ/Kafka) for cross-cutting flows that don't need a synchronous response — e.g. booking status change → notification-service push, booking completed → chat-service conversation close. Building this now would be premature; Milestone 1 is contracts and schema, not runtime behavior.

## Auth Flow

auth-service issues JWTs on login (secret shared via `JWT_SECRET` env var across gateway + services for this milestone — real key rotation/JWKS is future work). The gateway's `verifyJwt` middleware (from `@leen/shared`) checks the bearer token and attaches `req.user = { id, role }`; downstream services trust that header-derived identity rather than re-verifying, since the gateway is the only public entrypoint.

## What Milestone 1 Does NOT Include

- Business logic (all route handlers return `501 Not Implemented`)
- Tests
- Real secret/key management (only `.env.example` placeholders)
- Async messaging / event bus
- Service-to-service auth (mTLS, internal API keys) — fine for now since there's a single gateway ingress and services aren't publicly exposed outside the docker network in production
