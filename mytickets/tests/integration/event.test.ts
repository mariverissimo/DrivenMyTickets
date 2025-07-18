import supertest from 'supertest';
import app from '../../src/index';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const agent = supertest(app);

beforeEach(async () => {
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /events", () => {
  it("deve retornar 201 com um evento criado", async () => {
    const body = {
      name: faker.lorem.words(3),
      date: faker.date.future().toISOString(),
    };

    const res = await agent.post("/events").send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("deve retornar 422 se dados forem inválidos", async () => {
    const res = await agent.post("/events").send({});

    expect(res.status).toBe(422);
  });
});
