import { prisma } from '../config/database';
import { IExamData } from '../types/examTypes';

export async function findTeacherDisciplineId(teacherId: number, disciplineId: number) {

    const result = await prisma.teacherDiscipline.findFirst({
        where: { teacherId, disciplineId }
    });

    return result?.id;
}

export async function findCategoryById(id: number) {

    const result = await prisma.category.findUnique({
        where: { id }
    });

    return result;
}

export async function findTeacherById(id: number) {

    return await prisma.teacher.findUnique({
        where: { id }
    })
};

export async function findDisciplineById(id: number) {

    return await prisma.discipline.findUnique({
        where: { id }
    })
};

export async function insert(exam: IExamData) {

    return await prisma.test.create({
        data: exam
    });
}

export async function getCategories() {
    return await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            Test: {
                select: {
                    id: true,
                    name: true,
                    pdfUrl: true,
                    teacherDiscipline: {
                        select: {
                            disciplineId: true,
                            teacherId: true,
                            teacher: {
                                select: {
                                    name: true
                                }
                            },
                            discipline: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

export async function getTerms() {
    return await prisma.term.findMany({
        select: {
            id: true,
            number: true,
            Discipline: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
}

export async function getTeachers() {
    return await prisma.teacher.findMany();
};