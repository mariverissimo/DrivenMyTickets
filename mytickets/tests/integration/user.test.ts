import supertest from 'supertest';
import { PrismaClient } from '@prisma/client';
import { createUserBody } from '../factories/userFactory';
import app from '../../src/index';

const prisma = new PrismaClient();
const agent = supertest(app);

beforeEach(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /users", () => {
  it("deve retornar 201 quando o usuário for criado com sucesso", async () => {
    const body = createUserBody();

    const res = await agent.post("/users").send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe(body.email);
  });

  it("deve retornar 409 quando o email já existir", async () => {
    const body = createUserBody();

    await agent.post("/users").send(body);
    const res = await agent.post("/users").send(body);

    expect(res.status).toBe(409);
  });

  it("deve retornar 422 quando o corpo for inválido", async () => {
    const res = await agent.post("/users").send({ email: "invalid" });

    expect(res.status).toBe(422);
  });
});
