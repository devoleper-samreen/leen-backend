import fs from 'fs';
import path from 'path';
import { Express } from 'express';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';

const SERVICES_DIR = path.join(__dirname, '../../../services');

/**
 * Aggregates every service's own openapi.yaml (services/<name>/openapi.yaml -
 * the single source of truth, not a copy) into one Swagger UI at /docs.
 * Static aggregation only - no runtime service discovery.
 */
export function mountApiDocs(app: Express): void {
  const specs: Record<string, unknown> = {};

  if (fs.existsSync(SERVICES_DIR)) {
    for (const serviceName of fs.readdirSync(SERVICES_DIR)) {
      const specPath = path.join(SERVICES_DIR, serviceName, 'openapi.yaml');
      if (fs.existsSync(specPath)) {
        const raw = fs.readFileSync(specPath, 'utf8');
        specs[serviceName] = yaml.load(raw);
      }
    }
  }

  const combined = {
    openapi: '3.0.3',
    info: { title: 'Leen Platform API', version: '1.0.0' },
    tags: Object.keys(specs).map((name) => ({ name })),
    paths: Object.entries(specs).reduce(
      (acc, [, spec]) => ({ ...acc, ...(spec as any)?.paths }),
      {},
    ),
    components: Object.entries(specs).reduce(
      (acc, [, spec]) => ({
        schemas: { ...acc.schemas, ...(spec as any)?.components?.schemas },
      }),
      { schemas: {} } as any,
    ),
  };

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(combined));
}
