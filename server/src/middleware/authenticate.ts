import config from "../config/config.js";
import users, { userDocument } from "../models/users.js";
import { Strategy as LocalStrategy } from "passport-local";
import jwt from "jsonwebtoken";
import { Strategy as jwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import passport from "passport";
declare global {
  namespace Express {
    interface User extends userDocument {}
  }
}

passport.use(new LocalStrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

export function getToken(user: Object) {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
}

let opt = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secretKey,
};
export const jwtPassport = passport.use(
  new jwtStrategy(opt, (jwt_payload, done) => {
    users.findOne(
      { _id: jwt_payload._id },
      (err: Error, user: userDocument) => {
        if (err) {
          return done(err, false);
        } else if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      }
    );
  })
);
export const verifyUser = passport.authenticate("jwt", { session: false });

export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    users
      .findById({ _id: req.user._id })
      .then(
        (user) => {
          if (user !== null && user.admin) {
            next();
          } else {
            let err = createHttpError(
              "you are not authorized to perform this action !"
            );
            //err.status = 403;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
}

// export const facebookPassport = passport.use(
//   new faceBookStrategy(
//     {
//       clientID: config.facebook.clientID,
//       clientSecret: config.facebook.clientSecret,
//     },
//     (accesstoken, refreshtoken, profile, done) => {
//       users.findOne(
//         { faceBookId: profile.id },
//         (err: Error, user: userDocument) => {
//           if (err) {
//             return done(err, false);
//           } else if (!err && user !== null) {
//             return done(null, user);
//           } else {
//             user = new users({ username: profile.displayName });
//             user.faceBookId = profile.id;
//             user.firstname = profile.name.givenName;
//             user.lastname = profile.name.familyName;
//             user.save((err: CallbackError, user) => {
//               if (err) {
//                 return done(err, false);
//               } else return done(false, user);
//             });
//           }
//         }
//       );
//     }
//   )
// );
