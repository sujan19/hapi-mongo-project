import * as Mongoose from 'mongoose'

const studentSchema = new Mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt:String,
    rollNumber: {
        type: Number
    },
    stationary: [{ type: String }],
    teacher: {
        type: Mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'teacher'
    },
    isActive:{
        type:Boolean,
        default: true
    }
});

studentSchema.pre('find', function () {
    console.log("here in pre find");
})

studentSchema.post('find', function () {
    console.log("here in post find");
})

studentSchema.virtual('stationaryCount')
    .get(function () {
        console.log('inside virtual');
        return this.stationary.length;
    })

export const StudentModel = Mongoose.model('student', studentSchema);