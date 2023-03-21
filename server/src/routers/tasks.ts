import { Router, Request, Response } from "express";
import bodyparser from "body-parser";
import { corsWithOptions, corsall } from "../middleware/cor.js";
import { StatusCodes } from "http-status-codes";
import * as authenticate from "../middleware/authenticate.js";
import tasksController from "../controllers/tasks.js";
import {
  ValidateSchema,
  validationSchemas,
} from "../middleware/validateSchema.js";
const tasksRouter = Router();

tasksRouter.use(bodyparser.json());
tasksRouter
  .route("/")
  .options([corsWithOptions], (req: Request, res: Response) => {
    res.sendStatus(StatusCodes.OK);
  })
  .get([corsWithOptions, authenticate.verifyUser], tasksController.getall)
  .post([corsWithOptions, authenticate.verifyUser], tasksController.addTask)
  .put([corsWithOptions, authenticate.verifyUser], tasksController.disallowed)
  .delete(
    [corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin],
    tasksController.deleteTasks
  );
tasksRouter
  .route("/:taskId")
  .options([corsWithOptions], (req: Request, res: Response) => {
    res.sendStatus(StatusCodes.OK);
  })
  .get([corsWithOptions, authenticate.verifyUser], tasksController.getone)
  .post([corsWithOptions, authenticate.verifyUser], tasksController.disallowed)
  .put([corsWithOptions, authenticate.verifyUser], tasksController.updateTask)
  .delete(
    [corsWithOptions, authenticate.verifyUser],
    tasksController.deleteone
  );
export default tasksRouter;
