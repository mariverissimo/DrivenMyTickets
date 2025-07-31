import { faker } from "@faker-js/faker";
import prisma from "database";
import { createEventFactory } from "./eventFactory";

export async function createTicket() {
  const event = await createEventFactory();

  return await prisma.ticket.create({
    data: {
      owner: faker.person.fullName(),
      code: faker.string.alphanumeric(8),
      eventId: event.id,
    },
  });
}
