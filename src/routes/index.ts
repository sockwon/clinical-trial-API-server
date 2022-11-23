import { Router } from "express";
import crisinfoRouter from "./crisinfo";

const router = Router();

router.use("/api/v1/crisinfo", crisinfoRouter);

export default router;
