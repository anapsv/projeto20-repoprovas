
import app from '../src/index';
import supertest from 'supertest';
import { prisma } from '../src/config/database';
import { fakeRegisters, registerBody, rightFormatCredential, wrongFormatCredential } from './factories/userFactory';

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE users RESTART IDENTITY;`;
});

describe('POST /signin', () => {
    it('returns 422 for invalid input', async () => {
        const body = await registerBody();
        await supertest(app).post('/signup').send(body);

        const rightData = await rightFormatCredential();
        const wrongData = await wrongFormatCredential();

        const firstTry = await supertest(app).post('/signin').send({});
        expect(firstTry.status).toBe(422);

        const secondTry = await supertest(app).post('/signin').send({
            email: wrongData.email,
            password: rightData.password
        });
        expect(secondTry.status).toBe(422);

        const thirdTry = await supertest(app).post('/signin').send({
            email: rightData.email,
            password: wrongData.password
        });
        expect(thirdTry.status).toBe(422);
    });

    it('returns 401 for wrong credentials', async () => {
        const body = await registerBody();
        await supertest(app).post('/signup').send(body);

        const rightData = await rightFormatCredential();

        const firstTry = await supertest(app).post('/signin').send({
            email: rightData.email,
            password: body.password
        });
        expect(firstTry.status).toBe(401);

        const secondTry = await supertest(app).post('/signin').send({
            email: body.email,
            password: rightData.password
        });
        expect(secondTry.status).toBe(401);
    });

    it('returns 200 for valid input and right credentials', async () => {
        const body = await registerBody();
        await supertest(app).post('/signup').send(body);

        const result = await supertest(app).post('/signin').send({
            email: body.email,
            password: body.password
        });

        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty('token');
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});