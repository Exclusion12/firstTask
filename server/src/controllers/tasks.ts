import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import progresses from "../models/progresses.js";
import tasks, { taskDocument } from "../models/tasks.js";

class tasksController {
  async getall(req: Request, res: Response, next: NextFunction) {
    try {
      let alltasks = await progresses.find({}).populate("taskId");
      res.status(StatusCodes.OK).json(alltasks);
    } catch (error) {
      next(error);
    }
  }
  async getone(req: Request, res: Response, next: NextFunction) {
    try {
      let alltasks = await progresses
        .find({ taskId: req.params.taskId })
        .populate("taskId");
      res.status(StatusCodes.OK).json(alltasks);
    } catch (error) {
      next(error);
    }
  }
  async addTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = req.body.taskId;
      const taskName = req.body.taskName;
      let task = await tasks.create({ taskId, taskName });
      let progress = await progresses.create({
        taskId: task._id,
        progress: req.body.progress,
      });
      res.status(StatusCodes.OK).json({
        taskId: { _id: task._id, taskId, taskName },
        progress: progress.progress,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      let task = await tasks.findOne<taskDocument>({
        taskId: req.params.taskId,
      });
      if (!task) {
        res
          .status(StatusCodes.NOT_FOUND)
          .end(`Task ${req.params.dishId} not found`);
      } else {
        let updatedTask = await progresses.findOneAndUpdate(
          { taskId: task._id },
          { $set: { progress: req.body.progress } },
          { new: true }
        );
        res.status(StatusCodes.OK).json(updatedTask);
      }
    } catch (error) {
      console.log(error);

      next(error);
    }
  }
  async deleteTasks(req: Request, res: Response, next: NextFunction) {
    try {
      await progresses.deleteMany();
      await tasks.deleteMany();
      res.statusCode = StatusCodes.OK;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: "All tasks have been deleted" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async deleteone(req: Request, res: Response, next: NextFunction) {
    try {
      let task = await progresses.findOneAndDelete(
        { taskId: req.params.taskId },
        {
          new: true,
        }
      );
      task = await tasks.findByIdAndDelete(req.params.taskId, {
        new: true,
      });
      if (task) {
        res.status(StatusCodes.OK).json(task);
      } else {
        res
          .status(StatusCodes.NOT_FOUND)
          .end(`Task ${req.params.dishId} not found`);
      }
    } catch (error) {
      next(error);
    }
  }
  disallowed(req: Request, res: Response) {
    res
      .status(StatusCodes.FORBIDDEN)
      .end(req.method + " operations are not allowed on " + req.url);
  }
}
export default new tasksController();
