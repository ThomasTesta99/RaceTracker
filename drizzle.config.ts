import {config} from 'dotenv'
import { defineConfig } from 'drizzle-kit';

config({path: '.env'});

const url = new URL(process.env.DATABASE_URL!);
console.log("Drizzle target:", url.hostname, url.pathname);

export default defineConfig({
  out: './migrations',
  schema: './database/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});