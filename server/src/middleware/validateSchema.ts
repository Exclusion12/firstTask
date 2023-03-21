import joi, { ArraySchema, ObjectSchema } from "joi";
import { NextFunction, Request, Response } from "express";
import logging from "../library/Logging.js";
import { userDocument } from "../models/users";

export const ValidateSchema = (schema: ObjectSchema | ArraySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      logging.error(error);
      return res.status(422).json({ error });
    }
  };
};
interface passDocument {
  oldPassword: string;
  newPassword: string;
}

export const validationSchemas = {
  user: {
    create: joi.object<userDocument>({
      username: joi.string().required(),
      password: joi
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .required(),
      firstname: joi.string(),
      lastname: joi.string(),
    }),
    update: joi.object<userDocument>({
      firstname: joi.string(),
      lastname: joi.string(),
    }),
    updatePassword: joi.object<passDocument>({
      oldPassword: joi.string().required(),
      newPassword: joi
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .required(),
    }),
  },
};
