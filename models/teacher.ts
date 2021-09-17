import * as Mongoose from 'mongoose';
import { StudentModel } from './student'

const teacherSchema = new Mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    subject: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isActive:{
        type:Boolean,
        default: true
    }
})

teacherSchema.post('deleteOne', async function (doc, next) {
    console.log("soft delete student after teacher is deleted");
    // await StudentModel.updateMany({teacher: doc._id},{isActive: false})
})

export const TeacherModel = Mongoose.model('teacher', teacherSchema);