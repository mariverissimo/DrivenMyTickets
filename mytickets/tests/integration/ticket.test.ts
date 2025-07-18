import supertest from 'supertest';
import app from '../../src/index';
import { generateTicketBody } from '../factories/ticketFactory';

const agent = supertest(app);

describe('POST /tickets', () => {
  it('should create a ticket and return 201', async () => {
    const ticket = generateTicketBody();

    const response = await agent.post('/tickets').send(ticket);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
