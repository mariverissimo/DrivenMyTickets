// test-db.ts
import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

execSync('npx prisma migrate reset --force --skip-seed', {
  env: {
    ...process.env,
  },
  stdio: 'inherit',
});
