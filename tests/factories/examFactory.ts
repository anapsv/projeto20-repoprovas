import { faker } from '@faker-js/faker';

export async function examBody() {
    return {
        name: faker.lorem.words(2),
        pdfUrl: faker.internet.url(),
        categoryId: 1,
        disciplineId: 1,
        teacherId: 1
    }
}

export async function wrongFormatExam() {
    return {
        name: faker.lorem.words(2),
        pdfUrl: faker.internet.url(),
        categoryId: faker.lorem.words(1),
        disciplineId: faker.lorem.words(1),
        teacherId: faker.lorem.words(1)
    }
}