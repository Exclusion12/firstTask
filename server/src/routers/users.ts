import { Router, Request, Response } from "express";
import bodyparser from "body-parser";
import passport from "passport";
import * as authenticate from "../middleware/authenticate.js";
import { corsWithOptions, corsall } from "../middleware/cor.js";
import { StatusCodes } from "http-status-codes";
import userController from "../controllers/user.js";
import {
  ValidateSchema,
  validationSchemas,
} from "../middleware/validateSchema.js";
const usersRouter = Router();

usersRouter.use(bodyparser.json());
usersRouter
  .route("/")
  .options([corsWithOptions], (req: Request, res: Response) => {
    res.sendStatus(StatusCodes.OK);
  })
  .get(
    [corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin],
    userController.getall
  );

usersRouter
  .route("/signup")
  .options([corsWithOptions], (req: Request, res: Response) => {
    res.sendStatus(StatusCodes.OK);
  })
  .post(
    [corsWithOptions, ValidateSchema(validationSchemas.user.create)],
    userController.signup
  );

usersRouter
  .route("/login")
  .options([corsWithOptions], (req: Request, res: Response) => {
    res.sendStatus(StatusCodes.OK);
  })
  .post(
    [corsWithOptions, passport.authenticate("local", { session: false })],
    userController.login
  );
usersRouter
  .route("/profile")
  .options(corsWithOptions, (req, res) => {
    res.status(StatusCodes.OK);
  })
  .get([corsWithOptions, authenticate.verifyUser], userController.getone)
  .post([corsWithOptions, authenticate.verifyUser], userController.disallowed)
  .put(
    [
      corsWithOptions,
      authenticate.verifyUser,
      ValidateSchema(validationSchemas.user.update),
    ],
    userController.update
  )
  .delete([corsWithOptions, authenticate.verifyUser], userController.deleteOne);
usersRouter
  .route("/profile/changepassword")
  .options(corsWithOptions, (req, res) => {
    res.status(StatusCodes.OK);
  })
  .get([corsWithOptions, authenticate.verifyUser], userController.disallowed)
  .post([corsWithOptions, authenticate.verifyUser], userController.disallowed)
  .put(
    [
      corsWithOptions,
      authenticate.verifyUser,
      ValidateSchema(validationSchemas.user.updatePassword),
    ],
    userController.updatePassword
  )
  .delete(
    [corsWithOptions, authenticate.verifyUser],
    userController.disallowed
  );

// usersRouter
//   .route("/facebook/token")
//   //.options(corsWithOptions,(req,res)=>{res.sendStatus(StatusCodes.OK);})
//   .get(
//     passport.authenticate("facebook-token", { session: false }),
//     userController.login
//   );

// usersRouter
//   .route("/logout")
//   .options(corsWithOptions, (req, res) => {
//     res.sendStatus(StatusCodes.OK);
//   })
//   .get((req, res, next) => {
//     if (req.session.user) {
//       req.session.destroy();
//       res.clearCookie("session-id");
//       res.redirect("/");
//     } else {
//       createHttpError("You are not even authenticated !");
//       err.status = 403;
//       return next(err);
//     }
//   });

export default usersRouter;
