import joi from 'joi';
import { IExamSchema } from '../types/examTypes';

const examSchema = joi.object<IExamSchema>({

    name: joi.string().required(),

    pdfUrl: joi.string().uri().required(),

    categoryId: joi.number().integer().required(),

    disciplineId: joi.number().integer().required(),

    teacherId: joi.number().integer().required()
})

export default examSchema;