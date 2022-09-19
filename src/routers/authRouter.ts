import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { validateSchemaMiddleware } from "../middlewares/schemaMiddleware";
import registrationSchema from "../schemas/registrationSchema";
import loginSchema from "../schemas/loginSchema";

const authRouter = Router();

authRouter.post('/signup', validateSchemaMiddleware(registrationSchema), registerUser);
authRouter.post('/signin', validateSchemaMiddleware(loginSchema), loginUser);

export default authRouter;