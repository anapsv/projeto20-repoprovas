import { faker } from '@faker-js/faker';

export async function registerBody() {
    const password = faker.internet.password(10);
    return {
        email: faker.internet.email(),
        password: password,
        confirmPassword: password
    }
}

export async function fakeRegisters() {
    return {
        rightEmail: faker.internet.email(),
        rightPassword: faker.internet.password(10),
        wrongEmail: faker.lorem.word(10),
        wrongPassword: faker.internet.password(6)
    }
}

export async function rightFormatCredential() {
    return {
        email: faker.internet.email(),
        password: faker.internet.password(10)
    }
}

export async function wrongFormatCredential() {
    return {
        email: faker.lorem.word(10),
        password: faker.internet.password(6)
    }
}