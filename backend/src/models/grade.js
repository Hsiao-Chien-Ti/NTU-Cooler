import mongoose from "mongoose";
import { Schema } from "mongoose";
const GradeSchema = new Schema({
    studentID:{type:String},
    subject:{type:String},
    itemName:{type:String},
    score:{type:Number},
    weight:{type:Number},
});
const GradeModel = mongoose.model('Grade', GradeSchema);

export default GradeModel