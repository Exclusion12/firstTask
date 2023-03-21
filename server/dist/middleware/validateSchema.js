var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import joi from "joi";
import logging from "../library/Logging.js";
export const ValidateSchema = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema.validateAsync(req.body);
            next();
        }
        catch (error) {
            logging.error(error);
            return res.status(422).json({ error });
        }
    });
};
export const validationSchemas = {
    user: {
        create: joi.object({
            username: joi.string().required(),
            password: joi
                .string()
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
                .required(),
            firstname: joi.string(),
            lastname: joi.string(),
        }),
        update: joi.object({
            firstname: joi.string(),
            lastname: joi.string(),
        }),
        updatePassword: joi.object({
            oldPassword: joi.string().required(),
            newPassword: joi
                .string()
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
                .required(),
        }),
    },
};
