
import { Request, Response } from 'express';
import * as examService from '../services/examService';
import { IExamSchema } from '../types/examTypes';

export async function insertExam(req: Request, res: Response) {

    const examData: IExamSchema = req.body;

    const result = await examService.insertExam(examData);

    res.status(201).send(result);
}

export async function getByDisciplines(req: Request, res: Response) {

    const result = await examService.getByDisciplines();

    res.status(200).send(result);
}

export async function getByTeachers(req: Request, res: Response) {

    const result = await examService.getByTeachers();

    res.status(200).send(result);
}