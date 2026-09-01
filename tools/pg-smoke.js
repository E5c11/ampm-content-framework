#!/usr/bin/env node
/**
 * Phase 1 verification — confirms the Postgres write layer can reach the backend's Cloud SQL
 * instance through the Auth Proxy and reports the Flyway schema head.
 *
 *   cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432   # first, in another shell
 *   node tools/pg-smoke.js [--env dev|prod]
 *
 * Read-only. See workflows/active/repoint-authoring-to-postgres.md (Phase 1).
 */

'use strict';

const { getPool, closePool } = require('./lib/postgres');

const env = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

async function main() {
  const pool = getPool(env);
  const { rows: v } = await pool.query('SELECT version() AS version');
  const { rows: f } = await pool.query(
    `SELECT version, description, installed_on
       FROM flyway_schema_history
      WHERE success
      ORDER BY installed_rank DESC
      LIMIT 1`,
  );
  const counts = await pool.query(
    `SELECT
        (SELECT count(*) FROM lessons)   AS lessons,
        (SELECT count(*) FROM questions) AS questions,
        (SELECT count(*) FROM lesson_ai_explanation_sub_questions) AS sub_questions`,
  );

  console.log(`env:            ${env}`);
  console.log(`server:         ${v[0].version.split(',')[0]}`);
  console.log(`flyway head:    V${f[0].version} — ${f[0].description} (${f[0].installed_on.toISOString().slice(0, 10)})`);
  console.log(`content rows:   ${counts.rows[0].lessons} lessons · ${counts.rows[0].questions} questions · ${counts.rows[0].sub_questions} sub-questions`);
  console.log('\n✅ Postgres write layer reachable.');
}

main()
  .catch((err) => {
    console.error('\n❌ pg-smoke failed:', err.message);
    console.error('   Is the Cloud SQL Auth Proxy running on the port in PG_PORT_DEV?');
    process.exitCode = 1;
  })
  .finally(closePool);
