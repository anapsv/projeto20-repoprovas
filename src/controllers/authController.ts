import { Request, Response } from 'express';
import { ILoginData, IRegisterData } from '../types/authTypes';
import * as authService from '../services/authService';

export async function registerUser(req: Request, res: Response) {

    const registerData: IRegisterData = req.body;

    const result = await authService.registerUser(registerData);

    res.status(201).send(result);
}

export async function loginUser(req: Request, res: Response) {

    const { email, password }: ILoginData = req.body;

    const result = await authService.loginUser(email, password);

    res.status(200).send(result);
}