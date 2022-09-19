import joi from 'joi';
import { ILoginData } from '../types/authTypes';

const loginSchema = joi.object<ILoginData>({

    email: joi.string().email().required(),

    password: joi.string().min(10).required(),
});

export default loginSchema;