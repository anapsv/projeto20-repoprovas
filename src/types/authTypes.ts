import { User } from '@prisma/client';

export type ILoginData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type IRegisterData = {

    email: string,

    password: string,

    confirmPassword: string

}