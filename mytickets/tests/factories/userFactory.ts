import { faker } from '@faker-js/faker';

export function createUserBody() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}
