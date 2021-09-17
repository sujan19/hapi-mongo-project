import { ResponseToolkit, Request } from 'hapi';
import { StudentModel } from '../models';
import { genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import * as Joi from '@hapi/joi';

export const authController = () => {
    return [
        {
            method: 'POST',
            path: '/api/login',
            handler: async ({ auth: { credentials } }) => {
                console.log('credentials:', credentials);
                return {...credentials, accessToken: sign({...credentials},'secret')};
            },
            options: {
                auth: {
                    strategy: 'simple'
                }
            }
        },
        {
            method: 'POST',
            path: '/api/register',
            handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
                try {
                    const salt = await genSalt();
                    console.log("password", request.payload['password']);
                    const password = await hash(request.payload['password'], salt);
                    request.payload['password'] = password;
                    request.payload['salt'] = salt;
                    let students = await (await StudentModel.create(request.payload)).toJSON();
                    delete students["password"];
                    delete students["salt"];
                    students["accessToken"] = sign({ ...students }, 'secret');
                    return h.response(students).code(201);
                } catch (error) {
                    console.log("error", error);
                    return h.response(error).code(500);
                }
            },
            options: {
                auth: false,
                validate: {
                    payload: Joi.object({
                        firstName: Joi.string().required().max(250).min(2),
                        lastName: Joi.string().optional(),
                        email: Joi.string().required().email(),
                        password: Joi.string().required(),
                        teacher: Joi.string().required(),
                        stationary: Joi.array().optional(),
                        rollNumber: Joi.number().optional(),
                    }),
                    failAction(request: Request, h: ResponseToolkit, err: Error) {
                        throw err;
                    },
                    options: {
                        abortEarly: false,
                    }
                }
            }
        }

    ]
}