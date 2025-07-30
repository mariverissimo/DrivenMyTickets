import { faker } from '@faker-js/faker';

export function generateTicketBody() {
  return {
    title: faker.lorem.words(3),
    price: faker.number.float({ min: 50, max: 300 }),
    description: faker.lorem.sentence(),
  };
}
