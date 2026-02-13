import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/modules/prisma/prisma.service';

describe('Todo Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

      prisma = app.get(PrismaService);

      await app.init();

      console.log('Cleaning up database...');
      // Clean up before starting
      await prisma.todo.deleteMany();
      await prisma.user.deleteMany();
      console.log('Database cleaned.');
    } catch (e) {
      console.error('Error in beforeAll:', e);
      throw e;
    }
  });

  afterAll(async () => {
    if (prisma) {
      // Clean up after tests
      await prisma.todo.deleteMany();
      await prisma.user.deleteMany();
    }
    if (app) {
      await app.close();
    }
  });

  const testUser = {
    username: 'e2e_user',
    password: 'securePassword123',
    email: 'e2e@test.com',
  };
  let authToken: string;

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('accessToken');
        authToken = res.body.accessToken;
      });
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: testUser.username, password: testUser.password })
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('accessToken');
        authToken = res.body.accessToken;
      });
  });

  it('/todos (POST) - Create Todo', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'My E2E Todo', description: 'Testing flow' })
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('My E2E Todo');
      });
  });

  it('/todos (GET) - List Todos', () => {
    return request(app.getHttpServer())
      .get('/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].title).toBe('My E2E Todo');
      });
  });
});
