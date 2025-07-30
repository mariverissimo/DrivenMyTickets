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

describe('Tickets routes', () => {
  describe('POST /tickets', () => {
    it('deve retornar 201 ao criar um ticket válido', async () => {
      const event = await prisma.event.create({
        data: {
          name: faker.lorem.words(3),
          date: faker.date.future(),
        },
      });

      const body = {
        owner: faker.person.fullName(),
        code: faker.string.alphanumeric(8),
        eventId: event.id,
      };

      const res = await agent.post('/tickets').send(body);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.used).toBe(false);
    });

    it('deve retornar 422 se o corpo for inválido', async () => {
      const res = await agent.post('/tickets').send({});
      expect(res.status).toBe(422);
    });

    it('deve retornar 404 se o eventId não existir', async () => {
      const body = {
        owner: faker.person.fullName(),
        code: faker.string.alphanumeric(8),
        eventId: 999999,
      };

      const res = await agent.post('/tickets').send(body);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /tickets/:eventId', () => {
    it('deve retornar 200 e os tickets do evento', async () => {
      const event = await prisma.event.create({
        data: {
          name: faker.lorem.words(3),
          date: faker.date.future(),
        },
      });

      await prisma.ticket.createMany({
        data: Array.from({ length: 3 }).map(() => ({
          owner: faker.person.fullName(),
          code: faker.string.alphanumeric(8),
          eventId: event.id,
        })),
      });

      const res = await agent.get(`/tickets/${event.id}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });

    it('deve retornar 404 se o evento não existir', async () => {
      const res = await agent.get(`/tickets/999999`);
      expect(res.status).toBe(404);
    });

    it('deve retornar 400 se o eventId não for um número', async () => {
      const res = await agent.get(`/tickets/abc`);
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /tickets/use/:id', () => {
    it('deve retornar 200 e marcar o ticket como usado', async () => {
      const event = await prisma.event.create({
        data: {
          name: faker.lorem.words(3),
          date: faker.date.future(),
        },
      });

      const ticket = await prisma.ticket.create({
        data: {
          owner: faker.person.fullName(),
          code: faker.string.alphanumeric(8),
          eventId: event.id,
        },
      });

      const res = await agent.put(`/tickets/use/${ticket.id}`);
      expect(res.status).toBe(200);

      const updatedTicket = await prisma.ticket.findUnique({ where: { id: ticket.id } });
      expect(updatedTicket?.used).toBe(true);
    });

    it('deve retornar 404 se o ticket não existir', async () => {
      const res = await agent.put(`/tickets/use/999999`);
      expect(res.status).toBe(404);
    });

    it('deve retornar 409 se o ticket já estiver usado', async () => {
      const event = await prisma.event.create({
        data: {
          name: faker.lorem.words(3),
          date: faker.date.future(),
        },
      });

      const ticket = await prisma.ticket.create({
        data: {
          owner: faker.person.fullName(),
          code: faker.string.alphanumeric(8),
          eventId: event.id,
          used: true,
        },
      });

      const res = await agent.put(`/tickets/use/${ticket.id}`);
      expect(res.status).toBe(409);
    });

    it('deve retornar 400 se o ID não for numérico', async () => {
      const res = await agent.put(`/tickets/use/abc`);
      expect(res.status).toBe(400);
    });
  });
});
