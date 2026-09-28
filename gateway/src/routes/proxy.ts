import { Express } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

interface ServiceRoute {
  prefix: string;
  target: string;
}

/**
 * Maps public gateway paths to internal services via plain REST proxying,
 * one prefix per service. No retries or circuit-breaking yet.
 */
export function mountServiceProxies(app: Express): void {
  const routes: ServiceRoute[] = [
    { prefix: '/api/auth', target: process.env.AUTH_SERVICE_URL ?? 'http://localhost:4001' },
    { prefix: '/api/profiles', target: process.env.AUTH_SERVICE_URL ?? 'http://localhost:4001' },
    { prefix: '/api/roles', target: process.env.AUTH_SERVICE_URL ?? 'http://localhost:4001' },
    { prefix: '/api/catalog', target: process.env.CATALOG_SERVICE_URL ?? 'http://localhost:4002' },
    { prefix: '/api/bookings', target: process.env.BOOKING_SERVICE_URL ?? 'http://localhost:4003' },
    { prefix: '/api/payments', target: process.env.PAYMENT_SERVICE_URL ?? 'http://localhost:4004' },
    { prefix: '/api/chat', target: process.env.CHAT_SERVICE_URL ?? 'http://localhost:4005' },
    { prefix: '/api/support', target: process.env.SUPPORT_SERVICE_URL ?? 'http://localhost:4006' },
    { prefix: '/api/disputes', target: process.env.SUPPORT_SERVICE_URL ?? 'http://localhost:4006' },
    {
      prefix: '/api/notifications',
      target: process.env.NOTIFICATION_SERVICE_URL ?? 'http://localhost:4007',
    },
    { prefix: '/api/admin', target: process.env.ADMIN_SERVICE_URL ?? 'http://localhost:4008' },
  ];

  for (const route of routes) {
    app.use(
      route.prefix,
      createProxyMiddleware({
        target: route.target,
        changeOrigin: true,
      }),
    );
  }
}
