import { ResponseToolkit, Request } from 'hapi';
import { TeacherModel } from '../models';

export const teacherController = () => {
    return [
        {
            method: 'GET',
            path: '/api/teachers/{id}',
            handler: async ({ params }: Request, h: ResponseToolkit, err?: Error) => {
                try {
                    let teachers = await TeacherModel.findOne({ id: params.id, isActive: true }).exec();
                    return h.response(teachers).code(200);
                } catch (error) {
                    return h.response(error).code(500);
                }
            }
        },
        {
            method: 'GET',
            path: '/api/teachers',
            handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
                try {
                    let teachers = await TeacherModel.find({ isActive: true }).exec();
                    return h.response(teachers);
                } catch (error) {
                    return h.response(error).code(500);
                }
            },
            options: {
                auth: false
            }
        },
        {
            method: 'POST',
            path: '/api/teachers',
            handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
                try {
                    let teachers = await TeacherModel.create(request.payload);
                    return h.response(teachers).code(201);
                } catch (error) {
                    return h.response(error).code(500);
                }
            }
        },
        {
            method: 'PUT',
            path: '/api/teachers',
            handler: async (request, h, err?: Error) => {
                try {
                    let teachers = await TeacherModel.findOneAndUpdate(request.payload['id'] , request.payload , { new: true });
                    return h.response(teachers);
                } catch (error) {
                    return h.response(error).code(500);
                }
            }
        },
        {
            method: 'DELETE',
            path: '/api/teachers/{id}',
            handler: async ({ params }: Request, h: ResponseToolkit, err?: Error) => {
                try {
                    let teachers = await TeacherModel.deleteOne({ id: params.id });
                    return h.response(teachers);
                } catch (error) {
                    return h.response(error).code(500);
                }
            }
        }
    ]
}