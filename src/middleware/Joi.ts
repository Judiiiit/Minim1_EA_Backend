import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import Logging from '../library/Logging';

export const ValidateJoi = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (error) {
            Logging.error(error);
            return res.status(422).json({ error });
        }
    };
};

export const Schemas = {
    User: {
        create: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        }),
        update: Joi.object({
            name: Joi.string().optional(),
            email: Joi.string().email().optional(),
            password: Joi.string().min(6).optional(),
            favoriteRoutes: Joi.array()
                .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
                .optional(),
            completedRoutes: Joi.array()
                .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
                .optional()
        }).min(1)
    },

    Route: {
        create: Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().required(),
            distance: Joi.number().required(),
            duration: Joi.number().required(),
            difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
            tags: Joi.array().items(Joi.string()).optional(),
            image: Joi.string().optional(),
            authorId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
        }),

        update: Joi.object({
            title: Joi.string().optional(),
            description: Joi.string().optional(),
            city: Joi.string().optional(),
            country: Joi.string().optional(),
            distance: Joi.number().optional(),
            duration: Joi.number().optional(),
            difficulty: Joi.string().valid('easy', 'medium', 'hard').optional(),
            tags: Joi.array().items(Joi.string()).optional(),
            image: Joi.string().optional(),
            authorId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
        }).min(1)
    }
};