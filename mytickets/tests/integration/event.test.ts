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

describe('GET /events', () => {
  it('deve retornar 200 e a lista de eventos', async () => {
    await prisma.event.createMany({
      data: Array.from({ length: 3 }).map(() => ({
        name: faker.lorem.words(2),
        date: faker.date.future(),
      })),
    });

    const res = await agent.get('/events');

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });
});

describe('GET /events/:id', () => {
  it('deve retornar 200 e um evento específico', async () => {
    const event = await prisma.event.create({
      data: { name: faker.lorem.words(2), date: faker.date.future() },
    });

    const res = await agent.get(`/events/${event.id}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(event.name);
  });

  it('deve retornar 404 se o evento não existir', async () => {
    const res = await agent.get(`/events/999999`);

    expect(res.status).toBe(404);
  });
});

describe('POST /events', () => {
  it('deve retornar 201 ao criar um evento válido', async () => {
    const body = {
      name: faker.lorem.words(3),
      date: faker.date.future().toISOString(),
    };

    const res = await agent.post('/events').send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('deve retornar 409 se o nome já existir', async () => {
    const name = faker.lorem.words(2);

    await prisma.event.create({
      data: { name, date: faker.date.future() },
    });

    const res = await agent.post('/events').send({
      name,
      date: faker.date.future().toISOString(),
    });

    expect(res.status).toBe(409);
  });

  it('deve retornar 422 se os dados forem inválidos', async () => {
    const res = await agent.post('/events').send({});

    expect(res.status).toBe(422);
  });
});

describe('PUT /events/:id', () => {
  it('deve retornar 200 ao atualizar um evento existente', async () => {
    const event = await prisma.event.create({
      data: { name: 'Evento Antigo', date: faker.date.future() },
    });

    const updatedData = {
      name: 'Evento Atualizado',
      date: faker.date.future().toISOString(),
    };

    const res = await agent.put(`/events/${event.id}`).send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
  });

  it('deve retornar 422 se o corpo for inválido', async () => {
    const event = await prisma.event.create({
      data: { name: faker.lorem.words(2), date: faker.date.future() },
    });

    const res = await agent.put(`/events/${event.id}`).send({ name: '' });

    expect(res.status).toBe(422);
  });

  it('deve retornar 404 se o evento não existir', async () => {
    const res = await agent.put('/events/999999').send({
      name: 'Qualquer nome',
      date: faker.date.future().toISOString(),
    });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /events/:id', () => {
  it('deve retornar 200 e deletar o evento', async () => {
    const event = await prisma.event.create({
      data: { name: faker.lorem.words(2), date: faker.date.future() },
    });

    const res = await agent.delete(`/events/${event.id}`);

    expect(res.status).toBe(200);

    const deleted = await prisma.event.findUnique({ where: { id: event.id } });
    expect(deleted).toBeNull();
  });

  it('deve retornar 404 se o evento não existir', async () => {
    const res = await agent.delete(`/events/999999`);

    expect(res.status).toBe(404);
  });
});
