import { randomUUID } from 'node:crypto';
import 'dotenv/config';
import { env } from '@/env';
import { Environment } from 'vitest';
import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DATABASE_URL="postgresql://docker:docker@localhost:5432/gym-checkin?schema=public"
function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.');
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schema);
  return url.toString();
}

export default <Environment>{
  name: 'prisma',

  //this is an E2E test setup that will run before each test file/suite
  async setup() {
    const schema = randomUUID();
    const randomDatabaseURL = generateDatabaseURL(schema);
    process.env.DATABASE_URL = randomDatabaseURL;
    //now we have a database set up to test. We need to run migrations.
    //we use deploy because we don't want to compare the local db etc. We just
    //want to run all the migrations
    execSync('npx prisma migrate deploy');

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
        await prisma.$disconnect();
      },
    };
  },
};
