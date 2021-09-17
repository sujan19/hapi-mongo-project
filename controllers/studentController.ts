import { ResponseToolkit, Request } from 'hapi';
import { StudentModel } from '../models';
import { pool } from '../common'

export const studentController = () => {
    return [
        {
            method: 'GET',
            path: '/api/students/{id}',
            handler: async ({ params }: Request, h: ResponseToolkit, err?: Error) => {
                try {
                    let students = await (await StudentModel.findOne({ _id: params.id, isActive: true }).populate('teacher').exec()).toJSON();
                    delete students["password"];
                    delete students["salt"];

                    let query = `Select id AS id, student_id AS "studentId",date AS date, time_in as "timeIn",time_out as "timeOut", is_absent as "isAbsent", is_active as "isActive" from student_attendance where is_active = true and student_id = '${students._id}'`;
                    let attendance = await pool.query(query).then(data => {
                        return data.rows;
                    })
                        .catch((err) => {
                            console.log("error on query", err);
                        })
                    students['attendance'] = attendance;
                    return h.response(students).code(200);
                } catch (error) {
                    return h.response(error).code(500);
                }
            }
        },
        {
            method: 'GET',
            path: '/api/students',
            handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
                try {
                    // let query = `Select * from student_attendance where is_active = true`;
                    // pool.query(query).then(data => {
                    //     console.log("returning data", data.rows[0]);
                    // })
                    //     .catch((err) => {
                    //         console.log("error", err);
                    //     })

                    let students = await StudentModel.find({ isActive: true }).lean().populate('teacher').exec();
                    students.map(st => {
                        delete st["password"];
                        delete st["salt"];
                    })
                    return h.response(students);
                } catch (error) {
                    return h.response(error).code(500);
                }
            },
            options: {
                auth: {
                    strategy: 'jwt'
                }
            }
        },
        {
            method: 'GET',
            path: '/api/students/attendance',
            handler: async (request: Request, h, err?: Error) => {
                try {
                    let query = `Select id AS id, student_id AS "studentId",date AS date, time_in as "timeIn",time_out as "timeOut", is_absent as "isAbsent", is_active as "isActive" from student_attendance where is_active = true`;
                    let attendance = await pool.query(query).then(data => {
                        console.log("returning attendance data", data.rows);
                        return data.rows;
                    })
                        .catch((err) => {
                            console.log("error", err);
                        })
                    return h.response(attendance);
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
            path: '/api/students/attendance',
            handler: async ({ payload }: Request, h: ResponseToolkit, err?: Error) => {
                try {
                    let attendance = await pool.query(`Insert into student_attendance (student_id,date,time_in,time_out,is_absent) VALUES ($1,$2,$3,$4,$5) RETURNING id AS id, student_id AS "studentId",date AS date, time_in as "timeIn",time_out as "timeOut", is_absent as "isAbsent", is_active as "isActive"`, [payload['studentId'], payload['date'], payload['timeIn'], payload['timeOut'], payload['isAbsent']])
                        .then(data => {
                            console.log("returning data", data.rows[0]);
                            return data['rows'][0];
                        })
                        .catch((err) => {
                            console.log("error", err);
                        });
                    return h.response(attendance);
                } catch (error) {
                    console.log("error", error);
                    return h.response(error).code(500);
                }
            }
        }
        //Not required here, added in auth controller
        /**{
             method: 'POST',
             path: '/api/students',
             handler: async (request: Request, h: ResponseToolkit, err?: Error) => {
                 try {
                     const salt = await genSalt();
                     console.log("password",request.payload['password']);
                     const password = await hash(request.payload['password'], salt);
                     request.payload['password']= password;
                     request.payload['salt']= salt;
                     let students = await (await StudentModel.create(request.payload)).toJSON();
                     delete students["password"];
                     delete students["salt"];
                     return h.response(students).code(201);
                 } catch (error) {
                     console.log("error",error);
                     return h.response(error).code(500);
                 }
             }
         }
          */
    ]
}