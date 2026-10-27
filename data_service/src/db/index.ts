import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import postgres from 'postgres'

import * as schema from './schema.js'

const client = postgres(process.env.DATABASE_URL!, { max: 10 });

const db = drizzle(client, { schema });
export default db

