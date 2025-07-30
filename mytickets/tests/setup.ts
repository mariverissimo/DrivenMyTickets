import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';

export default async () => {
  const envPath = path.resolve(__dirname, '../.env.test');
  const envConfig = dotenv.config({ path: envPath });

  if (envConfig.error) {
    throw envConfig.error;
  }

  execSync('npx prisma migrate reset --force --skip-seed', {
    env: {
      ...process.env,
      ...envConfig.parsed,
    },
    stdio: 'inherit',
  });
};
