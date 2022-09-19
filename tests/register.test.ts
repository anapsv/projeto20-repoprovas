import app from '../src/index';
import supertest from 'supertest';
import { prisma } from '../src/config/database';
import { registerBody, rightFormatCredential, wrongFormatCredential } from './factories/userFactory';

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE users RESTART IDENTITY;`;
});

describe('POST /signup', () => {
    it('returns 422 for invalid input', async () => {
        const rightData = await rightFormatCredential();
        const wrongData = await wrongFormatCredential();

        const firstTry = await supertest(app).post('/signup').send({});
        expect(firstTry.status).toBe(422);

        const secondTry = await supertest(app).post('/signup').send({
            email: wrongData.email,
            password: rightData.password,
            confirmPassword: rightData.password
        });
        expect(secondTry.status).toBe(422);

        const thirdTry = await supertest(app).post('/signup').send({
            email: rightData.email,
            password: wrongData.password,
            confirmPassword: rightData.password
        });
        expect(thirdTry.status).toBe(422);

        const forthTry = await supertest(app).post('/signup').send({
            email: rightData.email,
            password: rightData.password,
            confirmPassword: wrongData.password
        });
        expect(forthTry.status).toBe(422);
    });

    it('returns 409 for using an existing email in the database', async () => {
        const body = await registerBody();

        await supertest(app).post('/signup').send(body);

        const result = await supertest(app).post('/signup').send(body);

        expect(result.status).toBe(409);
    });

    it('returns 201 for valid input and right insert in the database', async () => {
        const body = await registerBody();

        const result = await supertest(app).post('/signup').send(body);

        const createdUser = await prisma.user.findUnique({
            where: { email: body.email }
        });

        expect(result.status).toBe(201);
        expect(createdUser).not.toBeNull;
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});