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
import users from "../models/users.js";
import * as authenticate from "../middleware/authenticate.js";
class usersController {
    getall(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let allUsers = yield users.find({});
                res.status(StatusCodes.OK).json(allUsers);
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        if (req.user) {
            let token = authenticate.getToken({ _id: req.user._id });
            res.status(StatusCodes.OK).json({
                success: true,
                token: token,
                status: "You are successfully logged in!",
            });
        }
    }
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield users.register(new users({ username: req.body.username }), req.body.password);
                if (req.body.firstname) {
                    user.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    user.lastname = req.body.lastname;
                }
                yield user.save();
                let token = authenticate.getToken({ _id: user._id });
                res.status(StatusCodes.OK).json({
                    success: true,
                    token: token,
                    status: "You are successfully signed up!",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getone(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user) {
                try {
                    let user = yield users.findById(req.user._id);
                    if (user) {
                        res.status(StatusCodes.OK).json(user);
                    }
                    else {
                        res.status(StatusCodes.NOT_FOUND).end("User profile not found");
                    }
                }
                catch (error) {
                    next(error);
                }
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user) {
                try {
                    let user = yield users.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true });
                    if (user)
                        res.status(StatusCodes.OK).end("User profile updated succesfuly!");
                    else {
                        res.status(StatusCodes.NOT_FOUND).end("User not found!");
                    }
                }
                catch (error) {
                    next(error);
                }
            }
            else {
                res.status(StatusCodes.FORBIDDEN).end("You are not authorized");
            }
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user) {
                try {
                    yield users.findByIdAndRemove(req.user._id);
                    res
                        .status(StatusCodes.OK)
                        .end(`User ${req.user._id} deleted permentaly !`);
                }
                catch (error) {
                    next(error);
                }
            }
        });
    }
    updatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user) {
                try {
                    let user = yield users.findById(req.user._id);
                    if (user) {
                        yield user.changePassword(req.body.oldPassword, req.body.newPassword);
                        yield user.save();
                        res.status(StatusCodes.OK).end("Password updated");
                    }
                }
                catch (error) {
                    next(error);
                }
            }
            else {
                res.status(StatusCodes.FORBIDDEN).end("You are not authorized");
            }
        });
    }
    disallowed(req, res) {
        res
            .status(StatusCodes.FORBIDDEN)
            .end(req.method + " operations are not allowed on " + req.url);
    }
}
export default new usersController();
