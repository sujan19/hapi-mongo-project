import { Request, ResponseToolkit } from '@hapi/hapi';
import { StudentModel } from './models'
import { hash } from 'bcrypt';


export const validateJWT = () => {
    return async (
        id,
        request: Request,
        h: ResponseToolkit
    ) => {
        const student = await (await StudentModel.findOne(id)).toJSON();
        if (!student) return { isValid: false };

        return { isValid: true }
    };
};

export const validateBasic = () => {
    return async (
        request: Request,
        userName: string,
        password: string,
        h: ResponseToolkit
    ) => {
        const student = await (await StudentModel.findOne({ email: userName })).toJSON();
        if (!student) {
            return { credentials: null, isValid: false }
        }
        const isValid = (await hash(password, student['salt'])) === student['password'];
        delete student['password'];
        delete student['salt'];
        //credentials is passed back to application in 'request.auth.credentials'
        return { isValid, credentials: student };

    };
};