import { IRegisterData } from "../types/authTypes";
import * as authRepository from "../repositories/authRepository";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export async function registerUser(registerData: IRegisterData) {

    const { email, password, confirmPassword } = registerData;

    if (password !== confirmPassword) throw { type: "conflict", message: "Passwords don't match" };

    const existingEmail = await checkEmail(email);
    if (existingEmail) throw { type: "conflict", message: "Email already registered" };

    const encryptedPassword = encryptPassword(password);

    await authRepository.insert({ email, password: encryptedPassword });

    return "User successfully registered!"
}

async function checkEmail(email: string) {

    return await authRepository.findByEmail(email);
}

function encryptPassword(password: string) {

    const SALT = 10;

    return bcrypt.hashSync(password, SALT);
}

export async function loginUser(email: string, password: string) {

    const user = await checkEmailAndPassword(email, password);

    const token = generateToken(user.id);

    return { token };
}

async function checkEmailAndPassword(email: string, password: string) {

    const user = await checkEmail(email);

    if (!user) throw { type: "unauthorized", message: "Wrong email or password" };

    const encryptedPassword = user.password;

    if (!bcrypt.compareSync(password, encryptedPassword)) throw { type: "unauthorized", message: "Wrong email or password" };

    return user;
}

function generateToken(id: number) {

    const data = { id };

    const SECRET = process.env.JWT_SECRET || "";

    const EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;

    const options = { expiresIn: EXPIRES_IN };

    return jwt.sign(data, SECRET, options);
}

export async function findUserById(id: number) {

    const user = await authRepository.findById(id);

    if (!user) throw { type: "notfound", message: "User not found" };

    return user;
}