import joi from 'joi';
import { IRegisterData } from '../types/authTypes';

const registrationSchema = joi.object<IRegisterData>({

    email: joi.string().email().required(),

    password: joi.string().min(10).required(),

    confirmPassword: joi.string().valid(joi.ref('password')).required()
});

export default registrationSchema;