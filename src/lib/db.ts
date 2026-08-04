import { DB_BACKEND } from './db-config';
import type { DatabaseClient } from './db-interface';
import { createPgliteClient } from './db-pglite';
import { createSupabaseClient } from './db-supabase';

let client: DatabaseClient | null = null;

export function getDb(): DatabaseClient {
  if (!client) {
    client = DB_BACKEND === 'supabase' ? createSupabaseClient() : createPgliteClient();
  }
  return client;
}

export const db = getDb();

export type { DatabaseClient, AuthSession } from './db-interface';
export * from './types';
