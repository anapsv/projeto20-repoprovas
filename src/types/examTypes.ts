import { Test } from "@prisma/client";

export type IExamData = Omit<Test, 'id' | 'createdAt' | 'updatedAt'>;

export interface IExamSchema {
    name: string;
    pdfUrl: string;
    categoryId: number;
    disciplineId: number;
    teacherId: number;
}