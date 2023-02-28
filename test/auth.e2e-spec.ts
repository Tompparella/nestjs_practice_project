import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

const testEmail = 'tesst@mail.com';
const testPassword = 'testPassword1234?';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({ email: testEmail, password: testPassword })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(testEmail);
      });
  });

  it('register as a new user an get the currently logged in user', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/register')
      .send({ email: testEmail, password: testPassword })
      .expect(201);

    const cookie: string[] = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/users/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(testEmail);
  });
});
