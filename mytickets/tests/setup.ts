import { execSync } from 'child_process';

export default async () => {
  execSync('npx prisma migrate reset --force --skip-seed', { stdio: 'inherit' });
};
