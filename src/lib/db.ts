import { Pool, type QueryResultRow } from 'pg';

type GlobalWithPool = typeof globalThis & {
  __gigglehugsPool?: Pool;
  __gigglehugsPoolAttached?: boolean;
};

const globalForDb = globalThis as GlobalWithPool;

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured.');
  }

  return new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: true,
  });
}

export function getPool(): Pool {
  if (!globalForDb.__gigglehugsPool) {
    globalForDb.__gigglehugsPool = createPool();
  }

  if (process.env.VERCEL && !globalForDb.__gigglehugsPoolAttached) {
    globalForDb.__gigglehugsPoolAttached = true;
    import('@vercel/functions')
      .then(({ attachDatabasePool }) =>
        attachDatabasePool(globalForDb.__gigglehugsPool as Pool)
      )
      .catch((error) => {
        console.error('Failed to attach Neon database pool:', error);
      });
  }

  return globalForDb.__gigglehugsPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await getPool().query<T>(text, params as unknown[]);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
