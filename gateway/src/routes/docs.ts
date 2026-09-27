import fs from 'fs';
import path from 'path';
import { Express } from 'express';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';

const CONTRACTS_DIR = path.join(__dirname, '../../../docs/api-contracts');

/**
 * Aggregates every service's static openapi.yaml into one Swagger UI at
 * /docs. Static aggregation only - no runtime service discovery.
 */
export function mountApiDocs(app: Express): void {
  const specs: Record<string, unknown> = {};

  if (fs.existsSync(CONTRACTS_DIR)) {
    for (const file of fs.readdirSync(CONTRACTS_DIR)) {
      if (file.endsWith('.yaml') || file.endsWith('.yml')) {
        const serviceName = file.replace(/\.ya?ml$/, '');
        const raw = fs.readFileSync(path.join(CONTRACTS_DIR, file), 'utf8');
        specs[serviceName] = yaml.load(raw);
      }
    }
  }

  const combined = {
    openapi: '3.0.3',
    info: { title: 'Leen Platform API', version: '1.0.0' },
    tags: Object.keys(specs).map((name) => ({ name })),
    paths: Object.entries(specs).reduce(
      (acc, [name, spec]) => ({ ...acc, ...(spec as any)?.paths }),
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
