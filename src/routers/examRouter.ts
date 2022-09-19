import { Router } from "express";
import { getByDisciplines, getByTeachers, insertExam } from "../controllers/examController";
import { validateSchemaMiddleware } from "../middlewares/schemaMiddleware";
import examSchema from "../schemas/examSchema";
import validateToken from "../middlewares/tokenValidatorMiddleware";


const examsRouter = Router();

examsRouter.use(validateToken);
examsRouter.post('/exams', validateSchemaMiddleware(examSchema), insertExam);
examsRouter.get('/exams/disciplines', getByDisciplines);
examsRouter.get('/exams/teachers', getByTeachers);

export default examsRouter;