import supertest from 'supertest';
import app from '../../src/server';
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

describe('Events routes', () => {
  describe('GET /events', () => {
    it('deve retornar 200 e a lista de eventos', async () => {
      await prisma.event.createMany({
        data: [
          { name: faker.lorem.words(2), date: faker.date.future() },
          { name: faker.lorem.words(2), date: faker.date.future() },
          { name: faker.lorem.words(2), date: faker.date.future() },
        ],
      });

      const res = await agent.get('/events');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
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
      const res = await agent.get('/events/999999');
      expect(res.status).toBe(404);
    });

    it('deve retornar 400 se o id não for numérico', async () => {
      const res = await agent.get('/events/abc');
      expect(res.status).toBe(400);
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

    it('deve retornar 422 se os dados forem inválidos', async () => {
      const res = await agent.post('/events').send({});
      expect(res.status).toBe(422);
    });

    it('deve retornar 409 se o nome do evento já existir', async () => {
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

    it('deve retornar 409 se tentar atualizar para um nome já existente', async () => {
      const nameExistente = faker.lorem.words(2);

      await prisma.event.create({ data: { name: nameExistente, date: faker.date.future() } });

      const event = await prisma.event.create({ data: { name: 'Outro Evento', date: faker.date.future() } });

      const res = await agent.put(`/events/${event.id}`).send({
        name: nameExistente,
        date: faker.date.future().toISOString(),
      });

      expect(res.status).toBe(409);
    });
  });

  describe('DELETE /events/:id', () => {
    it('deve retornar 204 e deletar o evento', async () => {
      const event = await prisma.event.create({
        data: { name: faker.lorem.words(2), date: faker.date.future() },
      });

      const res = await agent.delete(`/events/${event.id}`);

      expect(res.status).toBe(204);
      const deleted = await prisma.event.findUnique({ where: { id: event.id } });
      expect(deleted).toBeNull();
    });

    it('deve retornar 404 se o evento não existir', async () => {
      const res = await agent.delete('/events/999999');
      expect(res.status).toBe(404);
    });

    it('deve retornar 400 se o id não for numérico', async () => {
      const res = await agent.delete('/events/abc');
      expect(res.status).toBe(400);
    });
  });
});
