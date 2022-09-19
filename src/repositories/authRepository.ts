import { prisma } from '../config/database';
import { ILoginData } from '../types/authTypes';

export async function findByEmail(email: string) {

    const user = await prisma.user.findUnique({
        where: { email }
    });

    return user;
}

export async function insert(userData: ILoginData) {

    await prisma.user.create({
        data: userData
    });
}

export async function findById(id: number) {

    const user = await prisma.user.findUnique({
        where: { id }
    });

    return user;
}