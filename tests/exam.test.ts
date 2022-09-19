import app from '../src/index';
import supertest from 'supertest';
import { prisma } from '../src/config/database';
import { registerBody } from './factories/userFactory';
import { examBody, wrongFormatExam } from './factories/examFactory';

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE users RESTART IDENTITY;`;

    await prisma.$executeRaw`TRUNCATE tests RESTART IDENTITY;`;
});

describe('POST /exams', () => {
    it('returns 401 for invalid or missing token', async () => {
        const firstTry = await supertest(app).post('/exams').send({});
        expect(firstTry.status).toBe(401);

        const secondTry = await supertest(app).post('/exams').set('Authorization', "Bearer invalidToken").send({});
        expect(secondTry.status).toBe(401);
    });

    it('returns 422 for invalid input', async () => {
        const body = await registerBody();
        await supertest(app).post('/signup').send(body);

        const login = await supertest(app).post('/signin').send({
            email: body.email,
            password: body.password
        });

        const token = login.body.token;

        const firstTry = await supertest(app).post('/exams').set('Authorization', `Bearer ${token}`).send({});
        expect(firstTry.status).toBe(422);

        const exam = await wrongFormatExam();

        const secondTry = await supertest(app).post('/exams').set('Authorization', `Bearer ${token}`).send(exam);
        expect(secondTry.status).toBe(422);
    });

    it('returns 404 for invalid ids (category, teacher, discipline)', async () => {
        const body = await registerBody();
        await supertest(app).post('/signup').send(body);

        const login = await supertest(app).post('/signin').send({
            email: body.email,
            password: body.password
        });

        const token = login.body.token;

        const exam = await examBody();

        const firstTry = await supertest(app)
            .post('/exams')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: exam.name,
                pdfUrl: exam.pdfUrl,
                categoryId: 100,
                disciplineId: 1,
                teacherId: 1
            });
        expect(firstTry.status).toBe(404);

        const secondTry = await supertest(app)
            .post('/exams')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: exam.name,
                pdfUrl: exam.pdfUrl,
                categoryId: 1,
                disciplineId: 100,
                teacherId: 1
            });
        expect(secondTry.status).toBe(404);

        const thirdTry = await supertest(app)
            .post('/exams')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: exam.name,
                pdfUrl: exam.pdfUrl,
                categoryId: 1,
                disciplineId: 1,
                teacherId: 100
            });
        expect(thirdTry.status).toBe(404);
    });

    it('returns 409 for non-relational teacher and discipline', async () => {
        const body = await registerBody();
        await supertest(app).post('/signup').send(body);

        const login = await supertest(app).post('/signin').send({
            email: body.email,
            password: body.password
        });

        const token = login.body.token;

        const exam = await examBody();

        const result = await supertest(app)
            .post('/exams')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: exam.name,
                pdfUrl: exam.pdfUrl,
                categoryId: 1,
                disciplineId: 4,
                teacherId: 1
            });
        expect(result.status).toBe(409);
    })

    it('returns 201 for valid token, valid input and right insert in the database', async () => {
        const body = await registerBody();
        await supertest(app).post('/signup').send(body);

        const login = await supertest(app).post('/signin').send({
            email: body.email,
            password: body.password
        });

        const token = login.body.token;

        const exam = await examBody();

        const result = await supertest(app).post('/exams').set('Authorization', `Bearer ${token}`).send(exam);

        expect(result.status).toBe(201);

        const createdExam = await prisma.test.findUnique({
            where: { id: result.body.id }
        });

        expect(createdExam).not.toBeNull;
    });
});

describe('GET /exams/disciplines', () => {
    it('returns 401 for invalid or missing token', async () => {
        const firstTry = await supertest(app).get('/exams/disciplines');
        expect(firstTry.status).toBe(401);

        const secondTry = await supertest(app).get('/exams/disciplines').set('Authorization', 'Bearer invalidToken');
        expect(secondTry.status).toBe(401);
    });

    it('returns 200 and right format body', async () => {
        const body = await registerBody();
        await supertest(app).post('/signup').send(body);

        const login = await supertest(app).post('/signin').send({
            email: body.email,
            password: body.password
        });
        const token = login.body.token;

        const exam = await examBody();

        await supertest(app).post('/exams').set('Authorization', `Bearer ${token}`).send(exam);

        const result = await supertest(app).get('/exams/disciplines').set('Authorization', `Bearer ${token}`);

        const countData = result.body.length;

        expect(result.status).toBe(200);
        expect(result.body).toBeInstanceOf(Array);
        expect(countData).toBeGreaterThan(0);
    })
});

describe('GET /exams/teachers', () => {
    it('returns 401 for invalid or missing token', async () => {
        const firstTry = await supertest(app).get('/exams/teachers');
        expect(firstTry.status).toBe(401);

        const secondTry = await supertest(app).get('/exams/teachers').set('Authorization', "Bearer invalidToken");
        expect(secondTry.status).toBe(401);
    });

    it('returns 200 and right format body', async () => {
        const body = await registerBody();
        await supertest(app).post('/signup').send(body);

        const login = await supertest(app).post('/signin').send({
            email: body.email,
            password: body.password
        });
        const token = login.body.token;

        const exam = await examBody();

        await supertest(app).post('/exams').set('Authorization', `Bearer ${token}`).send(exam);

        const result = await supertest(app).get('/exams/teachers').set('Authorization', `Bearer ${token}`);

        const countData = result.body.length;

        expect(result.status).toBe(200);
        expect(result.body).toBeInstanceOf(Array);
        expect(countData).toBeGreaterThan(0);
    })
})

afterAll(async () => {
    await prisma.$disconnect();
});