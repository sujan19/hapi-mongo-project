import * as Mongoose from 'mongoose';

export const connect = () => {
    return Mongoose.connect('mongodb://localhost:27017/school');
}

 