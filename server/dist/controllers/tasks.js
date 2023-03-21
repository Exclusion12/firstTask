var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StatusCodes } from "http-status-codes";
import progresses from "../models/progresses.js";
import tasks from "../models/tasks.js";
class tasksController {
    getall(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let alltasks = yield progresses.find({}).populate("taskId");
                res.status(StatusCodes.OK).json(alltasks);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getone(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let alltasks = yield progresses
                    .find({ taskId: req.params.taskId })
                    .populate("taskId");
                res.status(StatusCodes.OK).json(alltasks);
            }
            catch (error) {
                next(error);
            }
        });
    }
    addTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const taskId = req.body.taskId;
                const taskName = req.body.taskName;
                let task = yield tasks.create({ taskId, taskName });
                let progress = yield progresses.create({
                    taskId: task._id,
                    progress: req.body.progress,
                });
                res.status(StatusCodes.OK).json({
                    taskId: { _id: task._id, taskId, taskName },
                    progress: progress.progress,
                });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    updateTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let task = yield tasks.findOne({
                    taskId: req.params.taskId,
                });
                if (!task) {
                    res
                        .status(StatusCodes.NOT_FOUND)
                        .end(`Task ${req.params.dishId} not found`);
                }
                else {
                    let updatedTask = yield progresses.findOneAndUpdate({ taskId: task._id }, { $set: { progress: req.body.progress } }, { new: true });
                    res.status(StatusCodes.OK).json(updatedTask);
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    deleteTasks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield progresses.deleteMany();
                yield tasks.deleteMany();
                res.statusCode = StatusCodes.OK;
                res.setHeader("Content-Type", "application/json");
                res.json({ success: "All tasks have been deleted" });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    deleteone(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let task = yield progresses.findOneAndDelete({ taskId: req.params.taskId }, {
                    new: true,
                });
                task = yield tasks.findByIdAndDelete(req.params.taskId, {
                    new: true,
                });
                if (task) {
                    res.status(StatusCodes.OK).json(task);
                }
                else {
                    res
                        .status(StatusCodes.NOT_FOUND)
                        .end(`Task ${req.params.dishId} not found`);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    disallowed(req, res) {
        res
            .status(StatusCodes.FORBIDDEN)
            .end(req.method + " operations are not allowed on " + req.url);
    }
}
export default new tasksController();
