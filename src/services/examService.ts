import { IExamSchema } from "../types/examTypes";
import * as examRepository from '../repositories/examRepository';

export async function insertExam(examData: IExamSchema) {

    const { teacherId, disciplineId, categoryId, name, pdfUrl } = examData;

    await checkCategoryId(categoryId);

    await checkDisciplineId(disciplineId);

    await checkTeacherId(teacherId);

    const teacherDisciplineId = await findTeacherDisciplineId(teacherId, disciplineId);

    const exam = await examRepository.insert({ name, pdfUrl, categoryId, teacherDisciplineId });

    return exam;
}

async function findTeacherDisciplineId(teacherId: number, disciplineId: number) {

    const teacherDisciplineId = await examRepository.findTeacherDisciplineId(teacherId, disciplineId);

    if (!teacherDisciplineId) throw { type: "conflict", message: "This teacher is not teaching this discipline" };

    return teacherDisciplineId;
}

async function checkCategoryId(categoryId: number) {
    const result = await examRepository.findCategoryById(categoryId);

    if (!result) throw { type: "not_found", message: "Category not found" };
}

async function checkDisciplineId(disciplineId: number) {
    const result = await examRepository.findDisciplineById(disciplineId);

    if (!result) throw { type: "not_found", message: "Discipline not found" };
}

async function checkTeacherId(teacherId: number) {
    const result = await examRepository.findTeacherById(teacherId);

    if (!result) throw { type: "not_found", message: "Teacher not found" };
}

export async function getByDisciplines() {

    const categories = await examRepository.getCategories();

    const terms = await examRepository.getTerms();

    const result = terms.map(term => {
        return {
            termId: term.id,
            termName: term.number,
            disciplines: term.Discipline.map(disc => {
                return {
                    disciplineId: disc.id,
                    disciplineName: disc.name,
                    categories: categories.map(cat => {
                        return {
                            categoryId: cat.id,
                            categoryName: cat.name,
                            tests: cat.Test.map(test => {
                                if (test.teacherDiscipline.disciplineId === disc.id) {
                                    return {
                                        testId: test.id,
                                        testName: test.name,
                                        pdfUrl: test.pdfUrl,
                                        teacher: test.teacherDiscipline.teacher.name
                                    }
                                }
                            }).filter(item => item)
                        }
                    })
                }
            })
        }
    })

    return result;
}

export async function getByTeachers() {

    const categories = await examRepository.getCategories();

    const teachers = await examRepository.getTeachers();

    const result = teachers.map(teacher => {
        return {
            teacherId: teacher.id,
            teacherName: teacher.name,
            categories: categories.map(cat => {
                return {
                    categoryId: cat.id,
                    categoryName: cat.name,
                    tests: cat.Test.map(test => {
                        if (test.teacherDiscipline.teacherId === teacher.id) {
                            return {
                                testId: test.id,
                                testName: test.name,
                                pdfUrl: test.pdfUrl,
                                discipline: test.teacherDiscipline.discipline.name
                            }
                        }
                    }).filter(item => item)
                }
            })
        }
    })

    return result;
}