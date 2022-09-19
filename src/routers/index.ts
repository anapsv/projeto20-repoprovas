import { Router } from "express";
import authRouter from "./authRouter";
import examsRouter from "./examRouter";

const router = Router();

router.use(authRouter);
router.use(examsRouter);

export default router;