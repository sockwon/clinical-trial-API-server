import { Router } from "express";
import errorHandlerAsync from "../middlewares/errorHandler";

import crisinfoController from "../controllers/crisinfoController";

const router = Router();

router.post(
  "/list",
  errorHandlerAsync(crisinfoController.crisInfoInputControll)
);

router.get("/list", errorHandlerAsync(crisinfoController.getListControll));

export default router;
