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
  const specs: Record<string, any> = {};

  if (fs.existsSync(SERVICES_DIR)) {
    for (const serviceName of fs.readdirSync(SERVICES_DIR)) {
      const specPath = path.join(SERVICES_DIR, serviceName, 'openapi.yaml');
      if (fs.existsSync(specPath)) {
        const raw = fs.readFileSync(specPath, 'utf8');
        const parsed = yaml.load(raw) as any;

        // Skip services with no implemented endpoints yet, so they don't
        // show up as an empty tag/group in Swagger UI.
        const hasPaths = parsed?.paths && Object.keys(parsed.paths).length > 0;
        if (hasPaths) {
          specs[serviceName] = parsed;
        }
      }
    }
  }

  const combined = {
    openapi: '3.0.3',
    info: { title: 'Leen Platform API', version: '1.0.0' },
    // Each service's own `tags` entries (name + description) carry which
    // service a tag group belongs to, shown under that group's heading in
    // Swagger UI. Not declaring the service name itself as a tag here - no
    // operation is tagged with it, so that would just show as an empty group.
    tags: Object.values(specs).flatMap((spec: any) => spec?.tags ?? []),
    // Each service's paths carry that service's own `servers` entry (e.g.
    // auth-service uses /api, catalog-service uses /api/catalog) so
    // "Try it out" hits the right gateway prefix - without this, Swagger UI
    // defaults to the page's own origin with no prefix at all.
    paths: Object.entries(specs).reduce((acc, [, spec]) => {
      const paths = (spec as any)?.paths ?? {};
      const servers = (spec as any)?.servers;
      const pathsWithServers: Record<string, unknown> = {};
      for (const [routePath, pathItem] of Object.entries(paths)) {
        pathsWithServers[routePath] = { ...(pathItem as object), servers };
      }
      return { ...acc, ...pathsWithServers };
    }, {}),
    components: Object.entries(specs).reduce(
      (acc, [, spec]) => ({
        schemas: { ...acc.schemas, ...(spec as any)?.components?.schemas },
        securitySchemes: {
          ...acc.securitySchemes,
          ...(spec as any)?.components?.securitySchemes,
        },
      }),
      { schemas: {}, securitySchemes: {} } as any,
    ),
  };

  const uiOptions = {
    // Suppresses the browser's default focus outline on the expand/collapse
    // toggles (operations, models, schema boxes), and docks the built-in
    // dark-mode toggle to the far right of the topbar (it sits right next
    // to the logo by default; the flex row it's in doesn't leave it room to
    // auto-margin over, so it's pinned out of flow instead) - both cosmetic.
    // The "Authorize" button lives in `.scheme-container`, a separate block
    // sibling right after the title's `.information-container` - not
    // nested inside it - so putting them on one row means pulling
    // scheme-container out of flow and overlapping it next to the title.
    customCss:
      '.swagger-ui *:focus { outline: none; box-shadow: none; } ' +
      '.swagger-ui .topbar .topbar-wrapper { position: relative; } ' +
      '.swagger-ui .dark-mode-toggle { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); margin-left: 0; } ' +
      '.swagger-ui { position: relative; } ' +
      '.swagger-ui .information-container { margin-bottom: 0; } ' +
      '.swagger-ui .scheme-container { position: absolute; top: 85px; right: 40px; background: transparent !important; box-shadow: none !important; padding: 0; margin: 0; width: auto; } ' +
      // The "Links" column in each response row is always "No links" since
      // none of our specs define OpenAPI Links objects - pure clutter.
      '.swagger-ui .response-col_links { display: none; } ' +
      // The "Schemas" block at the very bottom duplicates what's already
      // visible via each operation's own "Schema" tab - pure clutter.
      '.swagger-ui section.models { display: none; } ' +
      // The response "Media type" dropdown (controls the Accept header)
      // isn't useful while every response only has one content type.
      '.swagger-ui .response-control-media-type { display: none; } ' +
      // "No parameters" text only ever shows up as a direct <p> child of
      // this wrapper - the :has() scoping keeps real operation/request-body
      // descriptions (which use a different child element) untouched.
      '.swagger-ui .opblock-description-wrapper:has(> p) { display: none; } ' +
      // Hides the generated curl command.
      '.swagger-ui .curl-command { display: none; } ' +
      // "Response headers" and "Request duration" share the exact same
      // markup shape (an <h5> label + a <pre class="microlight"> block)
      // with no distinguishing class, so both get hidden together - only
      // within the live response area, not the (already-hidden) docs table.
      '.swagger-ui .live-responses-table div:has(> h5):has(> pre.microlight) { display: none; }',
    // Every tag group (Auth, Profiles, ...) starts collapsed on page load.
    swaggerOptions: { docExpansion: 'none' },
    // Forces dark mode on every load, instead of leaving it to the OS's
    // light/dark preference or requiring a manual click on the toggle.
    // Also watches for the live response table swagger-ui adds after
    // "Execute" and hides that operation's static documented Responses
    // table once it appears - CSS alone can't react to that state change.
    customJsStr: `
      document.documentElement.classList.add('dark-mode');
      new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          m.addedNodes.forEach(function (node) {
            if (node.nodeType !== 1) return;
            var liveTables = node.classList && node.classList.contains('live-responses-table')
              ? [node]
              : node.querySelectorAll ? node.querySelectorAll('.live-responses-table') : [];
            liveTables.forEach(function (liveTable) {
              var body = liveTable.closest('.opblock-body');
              if (!body) return;
              var dummy = body.querySelector('.responses-table:not(.live-responses-table)');
              if (dummy) dummy.style.display = 'none';
            });
          });
        });
      }).observe(document.body, { childList: true, subtree: true });
    `,
  };

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(combined, uiOptions));
}
