import { Test } from '@nestjs/testing';
import { AppModule } from '../app/app.module';
import * as request from 'supertest';
import { addDays } from 'date-fns';

describe('Feature: organizing webinaire', () => {
  it('should organize a webinaire', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = module.createNestApplication();
    await app.init();

    const result = await request(app.getHttpServer())
      .post('/webinaires')
      .send({
        title: 'My first webinaire',
        seats: 100,
        startDate: addDays(new Date(), 4).toISOString(), //Dans le payload on ne peut que passer des types primitifs
        endDate: addDays(new Date(), 5).toISOString(),
      });

    expect(result.status).toBe(201);
    expect(result.body).toEqual({ id: expect.any(String) });
  });
});
